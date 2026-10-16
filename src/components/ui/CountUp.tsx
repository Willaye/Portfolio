"use client";
import { useEffect, useRef } from "react";

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Counts from 0 to `value` once, when 60% visible (1.5s, ease-out quart).
 * SSR renders the final number so the value is readable without JS.
 */
export function CountUp({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.4) return; // already seen
    el.textContent = `0${suffix}`;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1500);
          el.textContent = `${Math.round(value * easeOutQuart(t))}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix]);
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
