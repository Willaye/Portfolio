import { mulberry32 } from "../rng";

/** Shape names in morph order. */
export const SHAPES = ["Web", "Code", "Mobile", "Database", "Monitor", "Braces"] as const;
export type ShapeName = (typeof SHAPES)[number];

type Rng = () => number;
/** Optional glyph sampler (browser only): returns [x, y] pairs in [-1, 1] from opaque pixels. */
export type GlyphSampler = (text: string) => Float32Array | null;

const TAU = Math.PI * 2;

/* ── Web: globe from 14 meridians and 9 parallels ── */
function web(n: number, r: Rng, out: Float32Array) {
  const MER = 14;
  const PAR = 9;
  for (let i = 0; i < n; i++) {
    let lat: number;
    let lon: number;
    if (r() < 0.55) {
      lon = (Math.floor(r() * MER) / MER) * TAU;
      lat = (r() - 0.5) * Math.PI;
    } else {
      const k = Math.floor(r() * PAR);
      lat = ((k + 1) / (PAR + 1) - 0.5) * Math.PI;
      lon = r() * TAU;
    }
    const rad = 1.05 + (r() - 0.5) * 0.015;
    out[i * 3] = rad * Math.cos(lat) * Math.cos(lon);
    out[i * 3 + 1] = rad * Math.sin(lat);
    out[i * 3 + 2] = rad * Math.cos(lat) * Math.sin(lon);
  }
}

/* ── Code: "</>" glyph, sampled from pixels (browser) or strokes (fallback) ── */
function code(n: number, r: Rng, out: Float32Array, sampler?: GlyphSampler) {
  const pts = sampler?.("</>");
  if (pts && pts.length >= 2) {
    const m = pts.length / 2;
    for (let i = 0; i < n; i++) {
      const k = Math.floor(r() * m) * 2;
      out[i * 3] = pts[k] * 1.35;
      out[i * 3 + 1] = pts[k + 1] * 1.35;
      out[i * 3 + 2] = (r() - 0.5) * 0.24;
    }
    return;
  }
  // Procedural fallback: thick strokes for <, / and >
  const segs = [
    [-0.55, 0.55, -1.25, 0], [-1.25, 0, -0.55, -0.55],
    [0.28, 0.75, -0.28, -0.75],
    [0.55, 0.55, 1.25, 0], [1.25, 0, 0.55, -0.55],
  ];
  for (let i = 0; i < n; i++) {
    const s = segs[Math.floor(r() * segs.length)];
    const t = r();
    out[i * 3] = s[0] + (s[2] - s[0]) * t + (r() - 0.5) * 0.12;
    out[i * 3 + 1] = s[1] + (s[3] - s[1]) * t + (r() - 0.5) * 0.12;
    out[i * 3 + 2] = (r() - 0.5) * 0.24;
  }
}

/** Point on a rounded rect perimeter (clockwise from top-left), u in [0,1). */
export function roundedRectPoint(u: number, w: number, h: number, rad: number): [number, number] {
  const sw = w - 2 * rad;
  const sh = h - 2 * rad;
  const arc = (Math.PI / 2) * rad;
  const total = 2 * sw + 2 * sh + 4 * arc;
  let d = (((u % 1) + 1) % 1) * total;
  const hw = w / 2;
  const hh = h / 2;
  const corner = (cx: number, cy: number, a0: number): [number, number] => {
    const a = a0 - (d / arc) * (Math.PI / 2);
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  };
  if (d < sw) return [-hw + rad + d, hh];
  d -= sw;
  if (d < arc) return corner(hw - rad, hh - rad, Math.PI / 2);
  d -= arc;
  if (d < sh) return [hw, hh - rad - d];
  d -= sh;
  if (d < arc) return corner(hw - rad, -hh + rad, 0);
  d -= arc;
  if (d < sw) return [hw - rad - d, -hh];
  d -= sw;
  if (d < arc) return corner(-hw + rad, -hh + rad, -Math.PI / 2);
  d -= arc;
  if (d < sh) return [-hw, -hh + rad + d];
  d -= sh;
  return corner(-hw + rad, hh - rad, Math.PI);
}

/* ── Mobile: phone outline front + back, sides, UI lines, notch, home bar ── */
function mobile(n: number, r: Rng, out: Float32Array) {
  const W = 1.1;
  const H = 2.15;
  const R = 0.2;
  const D = 0.1;
  const rows = [0.62, 0.9, 0.5, 0.8, 0.7, 0.45, 0.85];
  for (let i = 0; i < n; i++) {
    const p = r();
    let x: number;
    let y: number;
    let z = D;
    if (p < 0.3) {
      [x, y] = roundedRectPoint(r(), W, H, R);
    } else if (p < 0.5) {
      [x, y] = roundedRectPoint(r(), W, H, R);
      z = -D;
    } else if (p < 0.6) {
      [x, y] = roundedRectPoint(r(), W, H, R);
      z = (r() * 2 - 1) * D;
    } else if (p < 0.87) {
      const k = Math.floor(r() * rows.length);
      x = -W / 2 + 0.16 + r() * rows[k] * (W - 0.32);
      y = 0.62 - k * 0.2 + (r() - 0.5) * 0.03;
    } else if (p < 0.95) {
      [x, y] = roundedRectPoint(r(), 0.34, 0.08, 0.04);
      y += H / 2 - 0.12;
    } else {
      x = (r() - 0.5) * 0.36;
      y = -H / 2 + 0.09 + (r() - 0.5) * 0.015;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

/* ── Database: a stacked cylinder (the classic DB symbol) ── */
function database(n: number, r: Rng, out: Float32Array) {
  const Rr = 0.62;
  const Hh = 0.82;
  // y-levels of the visible rings (top cap down to bottom cap)
  const rings = [Hh, Hh * 0.34, -Hh * 0.34, -Hh];
  for (let i = 0; i < n; i++) {
    const p = r();
    let rad = Rr;
    let y: number;
    if (p < 0.1) {
      // filled top cap disk so the cylinder reads as closed from above
      rad = Math.sqrt(r()) * Rr;
      y = Hh;
    } else if (p < 0.46) {
      // the four horizontal rings (dense, bright edges)
      y = rings[Math.floor(r() * rings.length)] + (r() - 0.5) * 0.02;
    } else {
      // lateral surface
      y = (r() * 2 - 1) * Hh;
    }
    const a = r() * TAU;
    out[i * 3] = rad * Math.cos(a);
    out[i * 3 + 1] = y;
    // squash depth a touch so caps look elliptical, like the DB icon
    out[i * 3 + 2] = rad * Math.sin(a) * 0.72;
  }
}

/* ── Monitor: a 3D bar chart / equalizer (monitoring dashboard) ── */
function monitor(n: number, r: Rng, out: Float32Array) {
  const G = 6;
  const span = 1.7;
  const step = span / (G - 1);
  const base = -0.72;
  // deterministic height per cell, computed once
  const heights = new Float32Array(G * G);
  for (let c = 0; c < G * G; c++) heights[c] = 0.18 + r() * 1.4;
  for (let i = 0; i < n; i++) {
    if (r() < 0.16) {
      // ground grid plane so the bars feel anchored
      const gx = Math.floor(r() * G);
      const gz = Math.floor(r() * G);
      out[i * 3] = -span / 2 + gx * step + (r() - 0.5) * step * 0.6;
      out[i * 3 + 1] = base + (r() - 0.5) * 0.01;
      out[i * 3 + 2] = -span / 2 + gz * step + (r() - 0.5) * step * 0.6;
      continue;
    }
    const gx = Math.floor(r() * G);
    const gz = Math.floor(r() * G);
    const h = heights[gx * G + gz];
    out[i * 3] = -span / 2 + gx * step + (r() - 0.5) * step * 0.42;
    out[i * 3 + 1] = base + r() * h;
    out[i * 3 + 2] = -span / 2 + gz * step + (r() - 0.5) * step * 0.42;
  }
}

/* ── Braces: the "{ }" glyph, sampled from pixels (browser) or fallback ── */
function braces(n: number, r: Rng, out: Float32Array, sampler?: GlyphSampler) {
  const pts = sampler?.("{ }");
  if (pts && pts.length >= 2) {
    const m = pts.length / 2;
    for (let i = 0; i < n; i++) {
      const k = Math.floor(r() * m) * 2;
      out[i * 3] = pts[k] * 1.35;
      out[i * 3 + 1] = pts[k + 1] * 1.35;
      out[i * 3 + 2] = (r() - 0.5) * 0.24;
    }
    return;
  }
  // Fallback: two curly-brace outlines drawn from arcs if the sampler is absent.
  for (let i = 0; i < n; i++) {
    const side = r() < 0.5 ? -1 : 1;
    const t = r() * Math.PI - Math.PI / 2; // -90°..90°
    const bulge = Math.cos(t) * 0.28;
    out[i * 3] = side * (0.95 - bulge) + (r() - 0.5) * 0.06;
    out[i * 3 + 1] = Math.sin(t) * 1.1 + (r() - 0.5) * 0.06;
    out[i * 3 + 2] = (r() - 0.5) * 0.2;
  }
}

const GENERATORS = [web, code, mobile, database, monitor, braces];

const cache = new Map<string, Float32Array>();

/**
 * Generate (and cache) `n` points for a shape. Deterministic for a given seed.
 * Returns a Float32Array of xyz triplets.
 */
export function generateShape(index: number, n: number, sampler?: GlyphSampler, seed = 1337): Float32Array {
  const key = `${index}:${n}:${seed}:${sampler ? "g" : "p"}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const out = new Float32Array(n * 3);
  GENERATORS[index](n, mulberry32(seed + index * 7919), out, sampler);
  cache.set(key, out);
  return out;
}

export function generateAll(n: number, sampler?: GlyphSampler): Float32Array[] {
  return SHAPES.map((_, i) => generateShape(i, n, sampler));
}
