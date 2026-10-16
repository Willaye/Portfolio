"use client";
import { useFitText } from "@/hooks/useFitText";

/**
 * Giant uppercase metallic wordmark that always fills its parent's width
 * exactly (measured at 100px, scaled; re-fit on resize and fonts.ready).
 */
export function FitWordmark({ text, className = "" }: { text: string; className?: string }) {
  const ref = useFitText<HTMLSpanElement>();
  return (
    <span ref={ref} className={`wordmark ${className}`} aria-hidden="true" style={{ fontSize: "16vw" }}>
      {text}
    </span>
  );
}
