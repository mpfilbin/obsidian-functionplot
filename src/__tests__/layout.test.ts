import { describe, expect, test } from "vitest";
import { previewSize } from "../common/layout";

describe("previewSize", () => {
  test("keeps a fixed aspect ratio when the window is tall enough", () => {
    expect(previewSize(800, 2000)).toStrictEqual({ width: 800, height: 496 });
  });
  test("grows with the container", () => {
    const small = previewSize(500, 2000);
    const large = previewSize(1000, 2000);
    expect(large.width).toBeGreaterThan(small.width);
    expect(large.height).toBeGreaterThan(small.height);
  });
  test("caps the height at 60% of the window", () => {
    // 1200 wide would want 744 high, but the window is only 900 tall
    expect(previewSize(1200, 900)).toStrictEqual({ width: 1200, height: 540 });
  });
  test("never goes below a minimum size", () => {
    expect(previewSize(50, 100)).toStrictEqual({ width: 200, height: 140 });
  });
  test("returns whole pixels", () => {
    const { width, height } = previewSize(777.6, 1000);
    expect(Number.isInteger(width)).toBe(true);
    expect(Number.isInteger(height)).toBe(true);
  });
});
