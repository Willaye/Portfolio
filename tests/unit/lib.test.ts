import { describe, expect, it } from "vitest";
import {
  alphaBucket,
  buildToneGrid,
  coverSource,
  dotRadius,
  feather,
  luminance,
  portraitBox,
  toneMap,
} from "@/lib/halftone";
import { fitFontSize } from "@/lib/fitText";
import { buildBrief, buildWhatsAppUrl, joinList } from "@/lib/whatsapp";
import { site } from "@/content/site";
import { siteSchema } from "@/content/schema";

describe("halftone luminance mapping", () => {
  it("computes luminance", () => {
    expect(luminance(255, 255, 255)).toBeCloseTo(1);
    expect(luminance(0, 0, 0)).toBe(0);
  });
  it("tone maps with clamp((l - 0.1) * 1.45)", () => {
    expect(toneMap(0)).toBe(0);
    expect(toneMap(0.1)).toBe(0);
    expect(toneMap(0.5)).toBeCloseTo(0.58);
    expect(toneMap(1)).toBe(1);
  });
  it("dot radius follows gap * (0.1 + 0.44 * l^0.85)", () => {
    expect(dotRadius(8, 0)).toBeCloseTo(0.8);
    expect(dotRadius(8, 1)).toBeCloseTo(8 * 0.54);
    expect(dotRadius(8, 0.5)).toBeCloseTo(8 * (0.1 + 0.44 * Math.pow(0.5, 0.85)));
  });
  it("buckets alpha into 4 levels", () => {
    expect([0, 0.3, 0.6, 0.99, 1].map(alphaBucket)).toEqual([0, 1, 2, 3, 3]);
  });
  it("feathers edges to 0 and keeps the centre at 1", () => {
    expect(feather(0.5, 0.5)).toBe(1);
    expect(feather(0, 0.5)).toBe(0);
    expect(feather(0.5, 1)).toBe(0);
    expect(feather(-0.1, 0.5)).toBe(0);
  });
  it("builds a 4:5 box and top-biased cover crop", () => {
    const box = portraitBox(100, 60);
    expect(box.w / box.h).toBeCloseTo(0.8);
    const src = coverSource(1000, 2000, box);
    expect(src.w / src.h).toBeCloseTo(0.8);
    expect(src.y).toBeCloseTo((2000 - src.h) * 0.2);
  });
  it("tone grid is zero outside the box", () => {
    const cols = 10;
    const rows = 10;
    const data = new Uint8ClampedArray(cols * rows * 4).fill(255);
    const grid = buildToneGrid(data, cols, rows, { x: 3, y: 0, w: 4, h: 10 });
    expect(grid[0]).toBe(0);
    expect(grid[5 * cols + 5]).toBeGreaterThan(0);
  });
});

describe("fitFontSize", () => {
  it("scales linearly to fill the container", () => {
    expect(fitFontSize(500, 1000)).toBe(200);
    expect(fitFontSize(1000, 360)).toBe(36);
  });
  it("falls back to the reference size for bad input", () => {
    expect(fitFontSize(0, 300)).toBe(100);
    expect(fitFontSize(NaN, 300)).toBe(100);
  });
});

describe("WhatsApp link builder", () => {
  it("joins lists naturally", () => {
    expect(joinList([])).toBe("");
    expect(joinList(["Website"])).toBe("Website");
    expect(joinList(["A", "B", "C"])).toBe("A, B and C");
  });
  it("builds the brief", () => {
    const text = buildBrief({
      brand: "Willaye Haider",
      name: " Sara ",
      email: "sara@example.com",
      needs: ["Website", "Mobile app"],
      budget: "$2k-$5k",
      message: "Need a  store.",
    });
    expect(text).toBe(
      "Hi Willaye Haider! I am Sara (sara@example.com). I need Website and Mobile app. My budget is $2k-$5k. Need a store.",
    );
  });
  it("encodes the URL", () => {
    const url = buildWhatsAppUrl("+92 300-1234567", "Hi & bye?");
    expect(url).toBe("https://wa.me/923001234567?text=Hi%20%26%20bye%3F");
  });
});

describe("content", () => {
  it("site content validates", () => {
    expect(() => siteSchema.parse(site)).not.toThrow();
  });
  it("rejects a non-digit WhatsApp number", () => {
    expect(siteSchema.safeParse({ ...site, whatsapp: "+92 300" }).success).toBe(false);
  });
});
