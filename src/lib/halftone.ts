import { clamp } from "./rng";

export const PORTRAIT_KEY = "hs-portrait";

/** Luminance (0..1) from sRGB bytes, Rec. 709 weights. */
export const luminance = (r: number, g: number, b: number) =>
  (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Tone curve applied to raw luminance: clamp((l - 0.1) * 1.45). */
export const toneMap = (l: number) => clamp((l - 0.1) * 1.45);

/** Dot radius for a cell: gap * (0.1 + 0.44 * l^0.85). */
export const dotRadius = (gap: number, l: number) => gap * (0.1 + 0.44 * Math.pow(clamp(l), 0.85));

/** Alpha bucket 0..3 by luminance. */
export const alphaBucket = (l: number) => Math.min(3, Math.floor(clamp(l) * 4));

const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Edge feather inside the portrait box. u,v in [0,1] (v=1 is bottom). */
export function feather(u: number, v: number): number {
  if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  return smooth(0, 0.16, u) * smooth(0, 0.16, 1 - u) * smooth(0, 0.22, 1 - v) * smooth(0, 0.03, v);
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Centered 4:5 portrait box inside a cols x rows grid. */
export function portraitBox(cols: number, rows: number): Box {
  let h = rows * 0.96;
  let w = h * 0.8;
  if (w > cols * 0.92) {
    w = cols * 0.92;
    h = w / 0.8;
  }
  return { x: (cols - w) / 2, y: rows - h, w, h };
}

/** Source rect for cover-fitting an image into a box, crop biased toward the top. */
export function coverSource(iw: number, ih: number, box: Box, topBias = 0.2): Box {
  const scale = Math.max(box.w / iw, box.h / ih);
  const sw = box.w / scale;
  const sh = box.h / scale;
  return { x: (iw - sw) / 2, y: (ih - sh) * topBias, w: sw, h: sh };
}

/** Build the per-cell tone grid from RGBA pixel data of size cols x rows. */
export function buildToneGrid(data: Uint8ClampedArray, cols: number, rows: number, box: Box): Float32Array {
  const out = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const p = i * 4;
      const a = data[p + 3] / 255;
      if (a === 0) continue;
      const u = (x + 0.5 - box.x) / box.w;
      const v = (y + 0.5 - box.y) / box.h;
      out[i] = toneMap(luminance(data[p], data[p + 1], data[p + 2])) * feather(u, v) * a;
    }
  }
  return out;
}
