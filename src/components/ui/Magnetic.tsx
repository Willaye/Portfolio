"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { isCoarsePointer, prefersReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Pulls its child toward the pointer (20% x, 30% y of the offset from centre).
 * Disabled for touch devices and reduced motion.
 */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isCoarsePointer() || prefersReducedMotion()) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        target.style.transform = `translate(${dx * 0.2}px, ${dy * 0.3}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      target.style.transform = "";
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
