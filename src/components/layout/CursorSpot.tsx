"use client";
import { useEffect, useRef } from "react";

/**
 * 640px accent spotlight that eases toward the pointer, plus the single
 * global listener that feeds `--mx/--my` to the `.card` under the pointer.
 */
export function CursorSpot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;
    let lastCard: HTMLElement | null = null;

    const tick = () => {
      x += (tx - x) * (reduced ? 1 : 0.12);
      y += (ty - y) * (reduced ? 1 : 0.12);
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!raf && !coarse) raf = requestAnimationFrame(tick);
      const card = (e.target as Element | null)?.closest?.(".card") as HTMLElement | null;
      if (lastCard && lastCard !== card) {
        lastCard.style.removeProperty("--mx");
        lastCard.style.removeProperty("--my");
      }
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      lastCard = card;
    };
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="cursor-spot" aria-hidden="true" />;
}
