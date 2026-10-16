import { SHAPES, generateAll, type GlyphSampler } from "./shapes";
import { mulberry32, clamp } from "../rng";

export const MORPH_MS = 1900;
export const HOLD_MS = 4400;
const CAM = 3.4;
const SPIN = 0.45;
const POINTER_RADIUS = 130;
const IDLE_MS = 4000;
const ALPHAS = [0.22, 0.42, 0.66, 0.95];
/** Flat/glyph shapes that read best facing the camera (gentle sway, no full spin). */
const FLAT = new Set<string>(["Code", "Braces"]);

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Per-particle morph progress given global t in [0,1] and a delay in [0,0.35]. */
export const localProgress = (t: number, delay: number) => clamp((t - delay) / (1 - 0.35));

/** Morph formula: from + (to - from) * ease(e) + swirl * sin(PI * e) * 0.75 * 2 */
export function morphValue(from: number, to: number, swirl: number, e: number): number {
  return from + (to - from) * easeInOutCubic(e) + swirl * Math.sin(Math.PI * e) * 0.75 * 2;
}

export interface EngineOptions {
  count: number;
  reducedMotion: boolean;
  sampler?: GlyphSampler;
  /** Resolved CSS font-family for the HUD readout. */
  monoFont?: string;
  onShapeChange?: (index: number) => void;
}

/**
 * Canvas 2D 3D point-cloud renderer. Owns its own rAF loop; the React
 * component only mounts it and forwards pointer / visibility events.
 */
export class ParticleEngine {
  private ctx: CanvasRenderingContext2D;
  private shapes: Float32Array[];
  private n: number;
  private active: number;
  private cur: Float32Array;
  private from: Float32Array;
  private delay: Float32Array;
  private swirl: Float32Array;
  private accentMask: Uint8Array;
  private sx: Float32Array;
  private sy: Float32Array;
  private sr: Float32Array;
  private sb: Uint8Array;

  private shape = 0;
  private morphStart = 0;
  private morphing = true;
  private yaw = 0;
  private lastT = 0;
  private raf = 0;
  private running = false;
  private visible = true;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private accent = "#ff2d55";

  private px = 0; // eased pointer, normalized [-1,1]
  private py = 0;
  private tx = 0; // target pointer
  private ty = 0;
  private mx = -9999; // pointer in css px
  private my = -9999;
  private lastPointer = -Infinity;
  private touch = false;
  private scroll = 0;

  private frameSum = 0;
  private frameCount = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: EngineOptions,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.n = opts.count;
    this.active = opts.count;
    this.shapes = generateAll(this.n, opts.sampler);
    const rnd = mulberry32(42);
    this.cur = new Float32Array(this.shapes[0]);
    this.from = new Float32Array(this.n * 3);
    this.delay = new Float32Array(this.n);
    this.swirl = new Float32Array(this.n * 3);
    this.accentMask = new Uint8Array(this.n);
    this.sx = new Float32Array(this.n);
    this.sy = new Float32Array(this.n);
    this.sr = new Float32Array(this.n);
    this.sb = new Uint8Array(this.n);
    for (let i = 0; i < this.n; i++) {
      this.delay[i] = rnd() * 0.35;
      this.swirl[i * 3] = (rnd() - 0.5) * 0.3;
      this.swirl[i * 3 + 1] = (rnd() - 0.5) * 0.3;
      this.swirl[i * 3 + 2] = (rnd() - 0.5) * 0.3;
      this.accentMask[i] = rnd() < 0.16 ? 1 : 0;
      // Start scattered so the first globe "assembles" on load.
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(2 * rnd() - 1);
      const rr = 1.6 + rnd() * 1.2;
      this.from[i * 3] = rr * Math.sin(ph) * Math.cos(th);
      this.from[i * 3 + 1] = rr * Math.cos(ph);
      this.from[i * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
    }
    if (opts.reducedMotion) {
      this.morphing = false;
      this.cur.set(this.shapes[0]);
    } else {
      this.cur.set(this.from);
    }
    this.morphStart = performance.now();
  }

  get shapeName() {
    return SHAPES[this.shape];
  }

  setAccent(color: string) {
    this.accent = color || this.accent;
    if (!this.running) this.frame(performance.now());
  }

  resize(w: number, h: number) {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    if (!this.running) this.frame(performance.now());
  }

  setPointer(x: number, y: number, isTouch: boolean) {
    this.touch = isTouch;
    if (isTouch) return;
    this.mx = x;
    this.my = y;
    this.tx = clamp((x / this.w) * 2 - 1, -1, 1);
    this.ty = clamp((y / this.h) * 2 - 1, -1, 1);
    this.lastPointer = performance.now();
  }

  leavePointer() {
    this.lastPointer = -Infinity;
  }

  setScroll(progress: number) {
    this.scroll = clamp(progress, 0, 1);
  }

  /** Advance to the next shape, starting from the particles' current positions. */
  next() {
    this.from.set(this.cur);
    this.shape = (this.shape + 1) % SHAPES.length;
    this.morphStart = performance.now();
    this.morphing = true;
    this.opts.onShapeChange?.(this.shape);
    if (this.opts.reducedMotion) this.start();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.start();
    else this.stop();
  }

  start() {
    if (this.running || !this.visible) return;
    if (this.opts.reducedMotion && !this.morphing) {
      this.frame(performance.now());
      return;
    }
    this.running = true;
    this.lastT = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const t0 = performance.now();
      this.frame(t);
      this.trackPerf(performance.now() - t0);
      if (this.opts.reducedMotion && !this.morphing) {
        this.running = false;
        return;
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
  }

  /** Adaptive quality: drop particles if the average frame costs > 12 ms. */
  private trackPerf(ms: number) {
    this.frameSum += ms;
    if (++this.frameCount < 60) return;
    const avg = this.frameSum / this.frameCount;
    this.frameSum = 0;
    this.frameCount = 0;
    if (avg > 12 && this.active > 800) this.active = Math.floor(this.active * 0.7);
  }

  private frame(now: number) {
    const dt = Math.min(0.05, Math.max(0, (now - this.lastT) / 1000));
    this.lastT = now;
    const time = now / 1000;
    const rm = this.opts.reducedMotion;

    /* ── morph state ── */
    const elapsed = now - this.morphStart;
    const to = this.shapes[this.shape];
    const n = this.active;
    if (this.morphing) {
      const t = clamp(elapsed / MORPH_MS);
      for (let i = 0; i < n; i++) {
        const e = localProgress(t, this.delay[i]);
        const k = i * 3;
        this.cur[k] = morphValue(this.from[k], to[k], this.swirl[k], e);
        this.cur[k + 1] = morphValue(this.from[k + 1], to[k + 1], this.swirl[k + 1], e);
        this.cur[k + 2] = morphValue(this.from[k + 2], to[k + 2], this.swirl[k + 2], e);
      }
      if (t >= 1) {
        this.morphing = false;
        this.morphStart = now;
      }
    } else if (!rm && elapsed > HOLD_MS) {
      this.next();
    }

    /* ── pointer (idle → Lissajous drift) ── */
    const idle = this.touch || now - this.lastPointer > IDLE_MS;
    let ix = this.mx;
    let iy = this.my;
    if (idle && !rm) {
      this.tx = Math.sin(time * 0.37) * 0.6;
      this.ty = Math.sin(time * 0.53 + 1) * 0.4;
      ix = (this.tx * 0.5 + 0.5) * this.w;
      iy = (this.ty * 0.5 + 0.5) * this.h;
    } else if (idle) {
      ix = iy = -9999;
    }
    const ease = rm ? 1 : Math.min(1, dt * 3);
    this.px += (this.tx - this.px) * ease;
    this.py += (this.ty - this.py) * ease;

    /* ── camera ── */
    if (!rm) {
      if (FLAT.has(SHAPES[this.shape])) {
        const TAU = Math.PI * 2;
        const target = Math.round(this.yaw / TAU) * TAU + Math.sin(time * 0.6) * 0.22;
        this.yaw += (target - this.yaw) * Math.min(1, dt * 1.8);
      } else {
        this.yaw += SPIN * dt;
      }
    }
    const yaw = this.yaw + this.px * 0.65;
    const pitch = this.py * 0.35 + this.scroll * 0.5;
    const cy = Math.cos(yaw);
    const syw = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const { ctx, dpr, w, h } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const small = w < 700;
    const ox = w / 2;
    const oy = h * (small ? 0.42 : 0.45);
    const R = Math.min(w * (small ? 0.3 : 0.2), h * 0.3) * (1 + 0.015 * Math.sin(time * 1.6));

    this.drawHud(ox, oy, R, time, rm);

    /* ── project ── */
    const base = small ? 1.05 : 1.25;
    const PR2 = POINTER_RADIUS * POINTER_RADIUS;
    for (let i = 0; i < n; i++) {
      const k = i * 3;
      const x0 = this.cur[k];
      const y0 = this.cur[k + 1];
      const z0 = this.cur[k + 2];
      const x1 = x0 * cy + z0 * syw;
      const z1 = -x0 * syw + z0 * cy;
      const y2 = y0 * cp - z1 * sp;
      const z2 = y0 * sp + z1 * cp;
      const s = CAM / (CAM - z2);
      let X = ox + x1 * s * R;
      let Y = oy - y2 * s * R;
      const depth = clamp((z2 + 1.4) / 2.8);
      let rad = base * (0.55 + depth * 1.1) * s;
      let bucket = Math.min(3, Math.floor(depth * 4));
      let accent = this.accentMask[i] === 1;
      const dx = X - ix;
      const dy = Y - iy;
      const d2 = dx * dx + dy * dy;
      if (d2 < PR2) {
        const d = Math.sqrt(d2) || 1;
        const f = 1 - d / POINTER_RADIUS;
        rad *= 1 + f * 1.4;
        X += (dx / d) * f * 18;
        Y += (dy / d) * f * 18;
        accent = true;
        bucket = Math.max(bucket, 2);
      }
      this.sx[i] = X;
      this.sy[i] = Y;
      this.sr[i] = rad;
      this.sb[i] = bucket + (accent ? 4 : 0);
    }

    /* ── batched draw: one path + fill per bucket ── */
    for (let b = 0; b < 8; b++) {
      const isAccent = b >= 4;
      ctx.globalCompositeOperation = isAccent ? "lighter" : "source-over";
      ctx.fillStyle = isAccent ? this.accent : "#f4f1ec";
      ctx.globalAlpha = ALPHAS[b % 4];
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (this.sb[i] !== b) continue;
        const r = this.sr[i];
        ctx.moveTo(this.sx[i] + r, this.sy[i]);
        ctx.arc(this.sx[i], this.sy[i], r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  private drawHud(ox: number, oy: number, R: number, time: number, rm: boolean) {
    const { ctx } = this;
    const t = rm ? 0 : time;
    const r1 = R * 1.42;
    ctx.save();
    ctx.translate(ox, oy);

    ctx.save();
    ctx.rotate(t * 0.12);
    ctx.setLineDash([2, 9]);
    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(-t * 0.25);
    ctx.strokeStyle = this.accent;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, r1 + 12, 0, Math.PI * 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r1 + 12, Math.PI, Math.PI * 1.18);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const r2 = r1 + 26;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2 + t * 0.05;
      const len = i % 6 === 0 ? 10 : 4;
      ctx.moveTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.lineTo(Math.cos(a) * (r2 + len), Math.sin(a) * (r2 + len));
    }
    ctx.stroke();
    ctx.restore();

    if (this.w >= 900) {
      ctx.font = `500 11px ${this.opts.monoFont || "ui-monospace, monospace"}`;
      ctx.fillStyle = "rgba(244,241,236,.6)";
      ctx.textBaseline = "middle";
      const label = `${SHAPES[this.shape].toUpperCase()} / ${this.active} PTS`;
      const lx = Math.max(24, ox - r2 - 190);
      ctx.fillText(label, lx, oy);
      ctx.fillStyle = this.accent;
      ctx.fillRect(lx, oy + 12, 28, 1);
    }
  }
}
