"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { site } from "@/content/site";
import { PORTRAIT_KEY } from "@/lib/halftone";
import { usePointerVars } from "@/hooks/usePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button, LinkButton } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { toast } from "@/components/layout/Toast";
import { HudChips } from "./HudChips";
import { FitWordmark } from "./MetalWordmark";
import type { ParticleControl } from "./ParticleCore";
import { downscaleToDataUrl } from "@/lib/image";

// Client-only, code-split canvas modules (never rendered on the server).
const ParticleCore = dynamic(() => import("./ParticleCore"), { ssr: false });
const HalftonePortrait = dynamic(() => import("./GlowPortrait"), { ssr: false });

type Mode = { kind: "orb" } | { kind: "photo"; src: string; own: boolean };

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<ParticleControl | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [shape, setShape] = useState(0);
  const [mode, setMode] = useState<Mode>({ kind: "orb" });
  const reduced = useReducedMotion();
  usePointerVars(stageRef);

  // Restore a previously uploaded photo.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PORTRAIT_KEY);
      if (saved) setMode({ kind: "photo", src: saved, own: false });
    } catch {
      /* storage unavailable */
    }
  }, []);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please choose an image file");
    try {
      const src = await downscaleToDataUrl(file);
      try {
        localStorage.setItem(PORTRAIT_KEY, src);
      } catch {
        toast("Photo shown, but could not be saved for next visit");
      }
      setMode({ kind: "photo", src, own: false });
    } catch {
      toast("Could not read that image");
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem(PORTRAIT_KEY);
    } catch {
      /* ignore */
    }
    setMode({ kind: "orb" });
  };

  const isPhoto = mode.kind === "photo";

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div ref={stageRef} className="stage">
          {isPhoto ? (
            <HalftonePortrait
              src={mode.src}
              label={mode.own ? `Halftone portrait of ${site.brand}` : "Halftone portrait made from your photo"}
              onError={() => {
                toast("Portrait not found. Add your photo to /public" + site.portrait);
                setMode({ kind: "orb" });
              }}
            />
          ) : (
            <ParticleCore
              stageRef={stageRef}
              controlRef={controlRef}
              onShapeChange={setShape}
              reducedMotion={reduced}
            />
          )}

          <HudChips shape={shape} showShape={!isPhoto} onShape={() => controlRef.current?.next()} />

          <p className="tagline rise" style={{ animationDelay: "260ms" }}>
            {site.taglines.heroLead} <em>{site.taglines.heroAccent}</em>
          </p>

          <h1 id="hero-title" className="wordmark-wrap rise" style={{ animationDelay: "380ms" }}>
            <span className="sr-only">
              {site.brand}, {site.role}. {site.taglines.heroLead} {site.taglines.heroAccent}
            </span>
            <FitWordmark text={site.wordmark} />
          </h1>
        </div>

        <div className="hero-foot">
          <div>
            <p className="lead" style={{ margin: 0 }}>
              {site.taglines.intro}
            </p>
            <p className="hint">{site.taglines.hint}</p>
          </div>
          <div className="hero-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onFile}
              aria-label="Upload a photo to turn into a halftone portrait"
            />
            {site.portrait && !(mode.kind === "photo" && mode.own) && (
              <Button onClick={() => setMode({ kind: "photo", src: site.portrait, own: true })}>
                Meet {site.brand.split(" ")[0]}
              </Button>
            )}
            <Button onClick={() => fileRef.current?.click()}>Add your photo</Button>
            {isPhoto && <Button onClick={reset}>Use orb / Reset</Button>}
            <Magnetic>
              <LinkButton href="#work" variant="primary">
                See our work <span aria-hidden="true">↓</span>
              </LinkButton>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
