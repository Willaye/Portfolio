import { SHAPES } from "@/lib/particles/shapes";

export function HudChips({
  shape,
  showShape,
  onShape,
}: {
  shape: number;
  showShape: boolean;
  onShape: () => void;
}) {
  return (
    <div className="hud rise" style={{ animationDelay: "120ms" }}>
      <span className="chip">
        <span className="dot-live" aria-hidden="true" /> System ready
      </span>
      <span className="chip">Portfolio 2026</span>
      <span className="chip">UI loading</span>
      {showShape && (
        <button type="button" className="chip" onClick={onShape} aria-label={`Shape: ${SHAPES[shape]}. Morph to next shape`}>
          Shape: {SHAPES[shape]} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
