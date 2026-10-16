"use client";
import { useEffect, useRef } from "react";
import {
  alphaBucket,
  buildToneGrid,
  coverSource,
  dotRadius,
  portraitBox,
} from "@/lib/halftone";
import { ACCENT_EVENT } from "@/lib/accent";

const ALPHAS = [0.35, 0.55, 0.78, 1];
const INFLUENCE_CELLS = 16;

/**
 * Dot-grid halftone portrait. The image is drawn cover-fitted into a centred
 * 4:5 box on a tiny cols x rows canvas; each pixel becomes one dot.
 * Everything happens locally; the image never leaves the browser.
 */
export default function HalftonePortrait({
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
  /** fraction of the canvas height used by the portrait box */
  fill?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const errRef = useRef(onError);
  errRef.current = onError;

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.decoding = "async";
    let grid: Float32Array = new Float32Array(0);
    let cols = 0;
    let rows = 0;
    let gap = 8;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let accent = "#ff2d55";
    let tx = -9999, ty = -9999, px = -9999, py = -9999;
    let raf = 0;
    let visible = true;
    let ready = false;

    const readAccent = () => {
      accent = getComputedStyle(document.documentElement).getPropertyValue("--a1").trim() || accent;
    };

    const build = () => {
      if (!ready) return;
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gap = w < 700 ? 6 : 8;
      cols = Math.max(1, Math.floor(w / gap));
      rows = Math.max(1, Math.floor(h / gap));
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
      grid = buildToneGrid(octx.getImageData(0, 0, cols, rows).data, cols, rows, box);
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = INFLUENCE_CELLS * gap;
      const R2 = R * R;
      const ox = (w - cols * gap) / 2 + gap / 2;
      const oy = (h - rows * gap) / 2 + gap / 2;
      for (let pass = 0; pass < 5; pass++) {
        const isAccent = pass === 4;
        ctx.fillStyle = isAccent ? accent : "#f4f1ec";
        ctx.globalAlpha = isAccent ? 1 : ALPHAS[pass];
        ctx.globalCompositeOperation = isAccent ? "lighter" : "source-over";
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const l = grid[y * cols + x];
            if (l < 0.02) continue;
            let X = ox + x * gap;
            let Y = oy + y * gap;
            let rad = dotRadius(gap, l);
            const dx = X - px;
            const dy = Y - py;
            const d2 = dx * dx + dy * dy;
            let acc = false;
            if (d2 < R2) {
              const d = Math.sqrt(d2) || 1;
              const f = 1 - d / R;
              rad *= 1 + f * 0.9;
              X += (dx / d) * f * gap * 1.4;
              Y += (dy / d) * f * gap * 1.4;
              acc = f > 0.62;
            }
            if (isAccent ? !acc : acc || alphaBucket(l) !== pass) continue;
            ctx.moveTo(X + rad, Y);
            ctx.arc(X, Y, rad, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      raf = 0;
      const k = reduced ? 1 : 0.16;
      px += (tx - px) * k;
      py += (ty - py) * k;
      if (px < -5000 || tx < -5000) {
        px = tx;
        py = ty;
      }
      draw();
      if (visible && Math.abs(tx - px) + Math.abs(ty - py) > 0.3) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && ready && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (px < -5000) {
        px = tx + 0.01;
        py = ty;
      }
      kick();
    };
    const onLeave = () => {
      tx = ty = -9999;
      kick();
    };
    const onAccent = () =>
      requestAnimationFrame(() => {
        readAccent();
        if (ready) draw();
      });

    readAccent();
    img.onload = () => {
      ready = true;
      build();
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
