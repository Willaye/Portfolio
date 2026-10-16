import { describe, expect, it } from "vitest";
import { SHAPES, generateShape, roundedRectPoint } from "@/lib/particles/shapes";
import { easeInOutCubic, localProgress, morphValue } from "@/lib/particles/engine";
import { mulberry32 } from "@/lib/rng";

describe("mulberry32", () => {
  it("is deterministic and in [0,1)", () => {
    const a = mulberry32(7);
    const b = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("shape generators", () => {
  for (const n of [1700, 2800]) {
    SHAPES.forEach((name, i) => {
      it(`${name} produces ${n} finite, bounded points`, () => {
        const pts = generateShape(i, n);
        expect(pts.length).toBe(n * 3);
        for (const v of pts) {
          expect(Number.isFinite(v)).toBe(true);
          expect(Math.abs(v)).toBeLessThan(2);
        }
      });
    });
  }

  it("is cached and deterministic", () => {
    expect(generateShape(0, 500)).toBe(generateShape(0, 500));
    expect(Array.from(generateShape(3, 300, undefined, 9))).toEqual(
      Array.from(generateShape(3, 300, undefined, 9)),
    );
  });

  it("uses the glyph sampler for Code when given", () => {
    const sampler = () => new Float32Array([0.5, -0.5]);
    const pts = generateShape(1, 50, sampler);
    expect(pts[0]).toBeCloseTo(0.5 * 1.35);
    expect(pts[1]).toBeCloseTo(-0.5 * 1.35);
  });

  it("rounded rect perimeter stays on the outline", () => {
    for (let u = 0; u < 1; u += 0.01) {
      const [x, y] = roundedRectPoint(u, 1, 2, 0.2);
      expect(Math.abs(x)).toBeLessThanOrEqual(0.5 + 1e-9);
      expect(Math.abs(y)).toBeLessThanOrEqual(1 + 1e-9);
      const onEdge = Math.abs(Math.abs(x) - 0.5) < 1e-9 || Math.abs(Math.abs(y) - 1) < 1e-9;
      const cx = Math.abs(x) - 0.3;
      const cy = Math.abs(y) - 0.8;
      const onArc = cx >= -1e-9 && cy >= -1e-9 && Math.abs(Math.hypot(cx, cy) - 0.2) < 1e-6;
      expect(onEdge || onArc).toBe(true);
    }
  });
});

describe("morph math", () => {
  it("eases from 0 to 1", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
  it("starts at from and ends at to (swirl vanishes at the ends)", () => {
    expect(morphValue(1, 3, 0.4, 0)).toBeCloseTo(1);
    expect(morphValue(1, 3, 0.4, 1)).toBeCloseTo(3);
  });
  it("delayed particles finish by t=1", () => {
    expect(localProgress(1, 0.35)).toBe(1);
    expect(localProgress(0.2, 0.35)).toBe(0);
  });
});
