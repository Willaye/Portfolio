"use client";
import { useEffect, useRef, type RefObject } from "react";
import { ParticleEngine } from "@/lib/particles/engine";
import type { GlyphSampler } from "@/lib/particles/shapes";
import { ACCENT_EVENT } from "@/lib/accent";

export interface ParticleControl {
  next: () => void;
}

/** Samples opaque pixels of a glyph rendered in the display font (browser only). */
function makeGlyphSampler(family: string): GlyphSampler {
  return (text) => {
    const W = 420;
    const H = 240;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.font = `900 190px ${family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, W / 2, H / 2 + 8);
    const { data } = ctx.getImageData(0, 0, W, H);
    const pts: number[] = [];
    let minX = W, maxX = 0, minY = H, maxY = 0;
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (data[(y * W + x) * 4 + 3] > 128) {
          pts.push(x, y);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (pts.length < 200) return null;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const half = Math.max(maxX - minX, maxY - minY) / 2 || 1;
    const out = new Float32Array(pts.length);
    for (let i = 0; i < pts.length; i += 2) {
      out[i] = (pts[i] - cx) / half;
      out[i + 1] = -(pts[i + 1] - cy) / half;
    }
    return out;
  };
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function ParticleCore({
  stageRef,
  controlRef,
  onShapeChange,
  reducedMotion,
}: {
  stageRef: RefObject<HTMLElement | null>;
  controlRef: RefObject<ParticleControl | null>;
  onShapeChange: (index: number) => void;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeCb = useRef(onShapeChange);
  shapeCb.current = onShapeChange;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    let engine: ParticleEngine | null = null;
    let disposed = false;
    const cleanups: (() => void)[] = [];

    const init = async () => {
      const display = cssVar("--font-archivo") || "sans-serif";
      // Wait (briefly) for the display font so the "</>" glyph samples correctly.
      await Promise.race([
        document.fonts?.load(`900 190px ${display}`).catch(() => undefined),
        new Promise((r) => setTimeout(r, 700)),
      ]);
      if (disposed) return;
      const count = window.innerWidth < 700 ? 1700 : 2800;
      engine = new ParticleEngine(canvas, {
        count,
        reducedMotion,
        sampler: makeGlyphSampler(display),
        monoFont: cssVar("--font-geist-mono") || "ui-monospace, monospace",
        onShapeChange: (i) => shapeCb.current(i),
      });
      const e = engine;
      controlRef.current = { next: () => e.next() };
      e.setAccent(cssVar("--a1"));

      const rect = () => stage.getBoundingClientRect();
      const r0 = rect();
      e.resize(r0.width, r0.height);
      const ro = new ResizeObserver(() => {
        const r = rect();
        e.resize(r.width, r.height);
      });
      ro.observe(stage);

      const onMove = (ev: PointerEvent) => {
        const r = rect();
        e.setPointer(ev.clientX - r.left, ev.clientY - r.top, ev.pointerType === "touch");
      };
      const onLeave = () => e.leavePointer();
      const onScroll = () => e.setScroll(window.scrollY / Math.max(1, stage.offsetHeight));
      const onAccent = () => requestAnimationFrame(() => e.setAccent(cssVar("--a1")));
      let inView = true;
      const onVis = () => e.setVisible(inView && !document.hidden);
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        onVis();
      });
      io.observe(stage);

      stage.addEventListener("pointermove", onMove, { passive: true });
      stage.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener(ACCENT_EVENT, onAccent);
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() => {
        ro.disconnect();
        io.disconnect();
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener(ACCENT_EVENT, onAccent);
        document.removeEventListener("visibilitychange", onVis);
      });
      onScroll();
      e.start();
    };

    // Start after first paint so the hero HTML/LCP is never blocked by canvas work.
    const raf = requestAnimationFrame(() => setTimeout(init, 0));
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      engine?.destroy();
      controlRef.current = null;
    };
  }, [stageRef, controlRef, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive 3D particle sculpture that morphs between a globe, code brackets, a phone, a database, a monitoring chart and code braces. Click to morph."
      onClick={() => controlRef.current?.next()}
    />
  );
}
