"use client";
import { useEffect, useState } from "react";
import { ACCENTS, applyAccent, readAccent, type AccentId } from "@/lib/accent";

/** Live local clock (h:mm AM/PM), refreshed every 20s. */
export function Clock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 20_000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className="clock" aria-label={now ? `Local time ${now}` : undefined} suppressHydrationWarning>
      {now}
    </time>
  );
}

/** Four accent swatches; persists choice in localStorage. */
export function AccentSwitcher() {
  const [active, setActive] = useState<AccentId>("orchid");
  useEffect(() => setActive(readAccent()), []);
  return (
    <div className="swatches" role="group" aria-label="Accent colour">
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          className="swatch"
          aria-label={`${a.label} accent`}
          aria-pressed={active === a.id}
          style={{ backgroundImage: `linear-gradient(135deg, ${a.a2}, ${a.a1})` }}
          onClick={() => {
            applyAccent(a.id);
            setActive(a.id);
          }}
        />
      ))}
    </div>
  );
}
