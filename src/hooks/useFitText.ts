"use client";
import { useLayoutEffect, useRef } from "react";
import { fitElement } from "@/lib/fitText";

/**
 * Makes the referenced text element exactly fill its parent's content width.
 * Re-runs on resize and once web fonts have loaded.
 */
export function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const cs = getComputedStyle(parent);
      const w = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      fitElement(el, w);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    const ro = new ResizeObserver(schedule);
    ro.observe(parent);
    document.fonts?.ready.then(run).catch(() => {});
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
