export const ACCENTS = [
  { id: "crimson", label: "Crimson", a1: "#ff2d55", a2: "#ff8a3d" },
  { id: "teal", label: "Teal", a1: "#16d6c4", a2: "#4f8cff" },
  { id: "violet", label: "Violet", a1: "#9a6bff", a2: "#ff4fa3" },
  { id: "amber", label: "Amber", a1: "#ffb020", a2: "#ff5d2e" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];
export const ACCENT_KEY = "hs-accent";
export const ACCENT_EVENT = "hs:accent";

export const isAccent = (v: unknown): v is AccentId => ACCENTS.some((a) => a.id === v);

export function readAccent(): AccentId {
  try {
    const v = localStorage.getItem(ACCENT_KEY);
    return isAccent(v) ? v : "crimson";
  } catch {
    return "crimson";
  }
}

export function applyAccent(id: AccentId) {
  document.documentElement.dataset.accent = id;
  try {
    localStorage.setItem(ACCENT_KEY, id);
  } catch {
    /* storage unavailable (private mode) */
  }
  window.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: id }));
}

export const accentColor = (id: AccentId) => ACCENTS.find((a) => a.id === id)!.a1;

/** Inline script run before paint to avoid an accent flash. */
export const accentBootScript = `try{var a=localStorage.getItem("${ACCENT_KEY}");if(${JSON.stringify(
  ACCENTS.map((a) => a.id),
)}.indexOf(a)>-1)document.documentElement.dataset.accent=a}catch(e){}`;
