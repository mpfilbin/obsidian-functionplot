import { describe, expect, test } from "vitest";
import { parseFunctionLine, parseFunctionLines } from "../common/line";

describe("parseFunctionLine", () => {
  describe("function forms", () => {
    test("definition: f(x) = x^2", () => {
      expect(parseFunctionLine("f(x) = x^2")).toStrictEqual({
        graphType: "polyline",
        fn: "x^2",
      });
    });
    test("definition without spaces: g(x)=x^PI", () => {
      expect(parseFunctionLine("g(x)=x^PI")).toStrictEqual({
        graphType: "polyline",
        fn: "x^PI",
      });
    });
    test("definition with another variable name: h(t) = sin(t)", () => {
      expect(parseFunctionLine("h(t) = sin(t)").fn).toBe("sin(t)");
    });
    test("bare expression: x^2", () => {
      expect(parseFunctionLine("x^2").fn).toBe("x^2");
    });
    test("explicit fn option: fn=x^2", () => {
      expect(parseFunctionLine("fn=x^2").fn).toBe("x^2");
    });
    test("an expression containing '=' is not truncated", () => {
      expect(parseFunctionLine("f(x) = x == 1 ? 1 : 0").fn).toBe(
        "x == 1 ? 1 : 0"
      );
    });
  });

  describe("options", () => {
    test("range is parsed into an array", () => {
      expect(
        parseFunctionLine("f(x) = x^2 @ range=[0, 5]").range
      ).toStrictEqual([0, 5]);
    });
    test("options combine with the explicit fn form", () => {
      expect(
        parseFunctionLine("fn=x^2 @ graphType=scatter @ color=red")
      ).toStrictEqual({ graphType: "scatter", fn: "x^2", color: "red" });
    });
    test("graphType defaults to polyline and can be overridden", () => {
      expect(parseFunctionLine("x").graphType).toBe("polyline");
      expect(parseFunctionLine("x @ graphType=interval").graphType).toBe(
        "interval"
      );
    });
    test("numeric and boolean values are converted", () => {
      const datum = parseFunctionLine("x @ nSamples=100 @ closed=false");
      expect(datum.nSamples).toBe(100);
      expect(datum.closed).toBe(false);
    });
    test("fn may come after other options", () => {
      expect(parseFunctionLine("color=red @ fn=x^2").fn).toBe("x^2");
    });
  });

  describe("invalid lines", () => {
    test("throws when there is no function expression", () => {
      expect(() => parseFunctionLine("color=red")).toThrow(
        /No function expression/
      );
    });
    test("throws when an option has no '='", () => {
      expect(() => parseFunctionLine("x^2 @ color")).toThrow(/key=value/);
    });
    test("throws on a malformed list", () => {
      expect(() => parseFunctionLine("x^2 @ range=[0,")).toThrow(
        /Invalid list for "range"/
      );
    });
  });
});

describe("parseFunctionLines", () => {
  test("skips blank and undefined entries", () => {
    expect(
      parseFunctionLines(["f(x) = x", "", undefined, "  ", "x^2"])
    ).toEqual([
      { graphType: "polyline", fn: "x" },
      { graphType: "polyline", fn: "x^2" },
    ]);
  });
  test("returns an empty list for no input", () => {
    expect(parseFunctionLines([])).toStrictEqual([]);
  });
});
