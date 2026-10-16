"use client";
import { useEffect, useRef } from "react";
import {
  coverSource,
  portraitBox,
  PORTRAIT_KEY,
} from "@/lib/halftone";
import { ACCENT_EVENT } from "@/lib/accent";

/* ── tunables ─────────────────────────────────────────────── */
const BASE_GAP = 5; // px between sample points (smaller = more particles)
const GLOW_RADIUS = 120; // pointer influence radius
const PARTICLE_BASE = 2; // base particle radius
const DRIFT_AMP = 1.6; // idle drift amplitude
const CURSOR_PUSH = 14; // how hard the cursor pushes
const CURSOR_GLOW = 1.8; // extra size near cursor
const LERP = 0.08; // return-to-home speed
const SPARK_CHANCE = 0.012; // per-particle per-frame chance of accent spark

/**
 * Luminous particle portrait.  The photo is sampled into particles that
 * carry their source colour, glow softly, drift gently, and react to
 * the pointer.  Near the cursor, particles scatter and flash in the
 * accent colour.  When the pointer leaves, they smoothly re-assemble.
 *
 * Everything runs on a single 2-D canvas — no WebGL.
 */
export default function GlowPortrait({
  src,
  label,
  onError,
  className = "",
  fill = 0.96,
}: {
  src: string;
  label: string;
  onError?: () => void;
  className?: string;
  fill?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const errRef = useRef(onError);
  errRef.current = onError;

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── state ──────────────────────────────────────────── */
    let w = 0,
      h = 0,
      dpr = 1;
    let accent = "#ff2d55";
    let mx = -9999,
      my = -9999; // pointer (smoothed)
    let tmx = -9999,
      tmy = -9999; // pointer target
    let raf = 0;
    let visible = true;
    let ready = false;

    interface P {
      hx: number;
      hy: number; // home position
      x: number;
      y: number; // current position
      r: number; // base radius
      col: string; // sampled colour
      a: number; // base alpha
      phase: number; // random offset for drift
      spark: number; // 0..1 accent spark timer
    }
    let particles: P[] = [];

    const readAccent = () => {
      accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--a1")
          .trim() || accent;
    };

    /* ── build particles from image ────────────────────── */
    const img = new Image();
    img.decoding = "async";

    const build = () => {
      if (!ready) return;
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const gap = w < 600 ? BASE_GAP + 1 : BASE_GAP;
      const cols = Math.max(1, Math.floor(w / gap));
      const rows = Math.max(1, Math.floor(h / gap));

      /* sample image into an off-screen canvas */
      const box = portraitBox(cols, rows);
      if (fill < 0.96) {
        const s = fill / 0.96;
        box.w *= s;
        box.h *= s;
        box.x = (cols - box.w) / 2;
        box.y = (rows - box.h) / 2;
      }
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      const s = coverSource(img.naturalWidth, img.naturalHeight, box);
      octx.imageSmoothingQuality = "high";
      octx.drawImage(img, s.x, s.y, s.w, s.h, box.x, box.y, box.w, box.h);
      const data = octx.getImageData(0, 0, cols, rows).data;

      const ox = (w - cols * gap) / 2 + gap / 2;
      const oy = (h - rows * gap) / 2 + gap / 2;
      const next: P[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const pr = data[i],
            pg = data[i + 1],
            pb = data[i + 2],
            pa = data[i + 3];
          if (pa < 20) continue;
          const lum = (0.2126 * pr + 0.7152 * pg + 0.0722 * pb) / 255;
          if (lum < 0.04 && pa < 60) continue; // skip near-black outside the face

          /* feather edges */
          const u = (x + 0.5 - box.x) / box.w;
          const v = (y + 0.5 - box.y) / box.h;
          const edge =
            smoothstep(0, 0.12, u) *
            smoothstep(0, 0.12, 1 - u) *
            smoothstep(0, 0.18, 1 - v) *
            smoothstep(0, 0.03, v);
          if (edge < 0.05) continue;

          const hx = ox + x * gap;
          const hy = oy + y * gap;
          const rad = PARTICLE_BASE * (0.6 + lum * 0.6);
          const alpha = 0.45 + lum * 0.55;
          next.push({
            hx,
            hy,
            x: hx,
            y: hy,
            r: rad,
            col: `rgb(${pr},${pg},${pb})`,
            a: alpha * edge * (pa / 255),
            phase: Math.random() * Math.PI * 2,
            spark: 0,
          });
        }
      }
      particles = next;
      draw(performance.now());
    };

    /* ── draw loop ─────────────────────────────────────── */
    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = t * 0.001; // seconds
      const R = GLOW_RADIUS;
      const R2 = R * R;
      const hasCursor = mx > -5000;

      for (let i = 0, len = particles.length; i < len; i++) {
        const p = particles[i];

        /* idle drift */
        const drift = reduced ? 0 : DRIFT_AMP;
        const tx = p.hx + Math.sin(time * 0.7 + p.phase) * drift;
        const ty = p.hy + Math.cos(time * 0.5 + p.phase * 1.3) * drift;

        /* cursor interaction */
        let pushX = 0,
          pushY = 0,
          cursorInfluence = 0;
        if (hasCursor) {
          const dx = p.hx - mx;
          const dy = p.hy - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / R;
            cursorInfluence = f;
            pushX = (dx / d) * f * CURSOR_PUSH;
            pushY = (dy / d) * f * CURSOR_PUSH;
          }
        }

        /* smooth interpolation to target */
        const targetX = tx + pushX;
        const targetY = ty + pushY;
        if (reduced) {
          p.x = targetX;
          p.y = targetY;
        } else {
          p.x += (targetX - p.x) * LERP;
          p.y += (targetY - p.y) * LERP;
        }

        /* accent sparks near cursor */
        if (cursorInfluence > 0.3 && Math.random() < SPARK_CHANCE * cursorInfluence) {
          p.spark = 1;
        }
        if (p.spark > 0) p.spark = Math.max(0, p.spark - 0.04);

        /* radius (bigger near cursor) */
        const rad = p.r * (1 + cursorInfluence * CURSOR_GLOW);

        /* draw */
        if (p.spark > 0.01) {
          /* accent glow spark */
          ctx.globalAlpha = p.a * p.spark;
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = rad * 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        /* normal particle */
        ctx.globalAlpha = p.a * (1 + cursorInfluence * 0.3);
        ctx.fillStyle = p.col;
        if (cursorInfluence > 0.5) {
          /* subtle glow near cursor */
          ctx.shadowColor = p.col;
          ctx.shadowBlur = rad * 3;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    /* ── animation frame ───────────────────────────────── */
    const tick = (t: number) => {
      raf = 0;
      draw(t);
      if (visible && !reduced) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && ready && visible) raf = requestAnimationFrame(tick);
    };

    /* pointer */
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tmx = e.clientX - r.left;
      tmy = e.clientY - r.top;
      mx += (tmx - mx) * 0.3;
      my += (tmy - my) * 0.3;
      kick();
    };
    const onLeave = () => {
      mx = my = tmx = tmy = -9999;
      kick();
    };
    const onAccent = () => {
      readAccent();
      if (ready) kick();
    };

    readAccent();
    img.onload = () => {
      ready = true;
      build();
      kick();
    };
    img.onerror = () => errRef.current?.();
    img.src = src;

    const ro = new ResizeObserver(() => build());
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener(ACCENT_EVENT, onAccent);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener(ACCENT_EVENT, onAccent);
      img.onload = img.onerror = null;
    };
  }, [src, fill]);

  return <canvas ref={ref} role="img" aria-label={label} className={className} />;
}

/* ── helpers ──────────────────────────────────────────────── */
function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
