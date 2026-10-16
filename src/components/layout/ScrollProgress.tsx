"use client";
import { useEffect, useRef } from "react";

/** 2px gradient bar at the top showing page scroll progress (rAF eased). */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0;
    let raf = 0;
    const target = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? window.scrollY / max : 0;
    };
    const tick = () => {
      const t = target();
      cur = reduced ? t : cur + (t - cur) * 0.2;
      el.style.transform = `scaleX(${cur.toFixed(4)})`;
      raf = Math.abs(t - cur) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="progress" aria-hidden="true" />;
}
