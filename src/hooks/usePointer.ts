"use client";
import { useEffect, type RefObject } from "react";

/**
 * Writes the pointer position (relative to the element) into CSS custom
 * properties `--mx` / `--my` (px) and optionally `--bx` (0-100%).
 * Passive listener, rAF-throttled.
 */
export function usePointerVars(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${x - r.left}px`);
      el.style.setProperty("--my", `${y - r.top}px`);
      el.style.setProperty("--bx", `${(((x - r.left) / r.width) * 100).toFixed(1)}%`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
