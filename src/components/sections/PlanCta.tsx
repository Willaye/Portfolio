"use client";
import type { ReactNode } from "react";

export const NEED_EVENT = "hs:need";

/** Scrolls to the contact form and preselects a matching "I need" chip. */
export function PlanCta({ need, primary, children }: { need: string; primary: boolean; children: ReactNode }) {
  return (
    <a
      href="#contact"
      className={`btn ${primary ? "btn-primary" : ""}`}
      onClick={() => window.dispatchEvent(new CustomEvent(NEED_EVENT, { detail: need }))}
    >
      {children}
    </a>
  );
}
