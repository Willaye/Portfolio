import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "ink";
const cls = (v: Variant, size?: "sm", extra = "") =>
  `btn ${v === "primary" ? "btn-primary" : v === "ink" ? "btn-ink" : ""} ${size === "sm" ? "btn-sm" : ""} ${extra}`.trim();

export function Button({
  variant = "ghost",
  size,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm"; children: ReactNode }) {
  return (
    <button type="button" className={cls(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "ghost",
  size,
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: "sm"; children: ReactNode }) {
  return (
    <a className={cls(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}
