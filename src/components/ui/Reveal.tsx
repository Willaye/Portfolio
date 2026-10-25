"use client";
import { useLayoutEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

const useIso = typeof window === "undefined" ? () => {} : useLayoutEffect;

/**
 * Scroll reveal. SSR output is fully visible; on mount, only elements that are
 * *below the fold* get hidden and then revealed when 10% visible — so the
 * first screen is never blank and no-JS users see everything.
 */
export function Reveal({
  children,
  as,
  className = "",
  delay = 0,
  style,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  id?: string;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useIso(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.98) return;
    el.classList.add("reveal-hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add("reveal-in");
        el.classList.remove("reveal-hidden");
        io.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}
