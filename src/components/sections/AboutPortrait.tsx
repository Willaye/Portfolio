"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const HalftonePortrait = dynamic(() => import("@/components/hero/GlowPortrait"), { ssr: false });

/** Halftone version of the owner's photo with an initials fallback if the file is missing. */
export function AboutPortrait({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(!src);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="portrait-frame">
      {failed ? (
        <div className="display metal" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: "clamp(90px,16vw,200px)" }} aria-hidden="true">
          {initials}
        </div>
      ) : (
        <HalftonePortrait src={src} label={`Portrait of ${name}`} onError={() => setFailed(true)} fill={0.92} />
      )}
      <span className="chip" style={{ position: "absolute", left: 16, bottom: 16 }}>
        <span className="dot-live" aria-hidden="true" /> Available for projects
      </span>
    </div>
  );
}
