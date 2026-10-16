import type { ElementType, ReactNode, ComponentPropsWithoutRef } from "react";

type CardProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Panel with a cursor-following spotlight border. The `--mx/--my` vars are
 * written by the single global pointer listener in <CursorSpot/>, so cards
 * stay server components with zero JS of their own.
 */
export function Card<T extends ElementType = "div">({ as, className = "", children, ...rest }: CardProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag className={`card ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
