import type { Line } from "./types";

/** Matches the classic definition syntax, e.g. `f(x) = x^2`. */
const DEFINITION = /^[A-Za-z_]\w*\s*\(\s*[A-Za-z_]\w*\s*\)\s*=(.*)$/;

/** Convert an option value from its textual form to a number, boolean or array. */
function parseValue(key: string, value: string): unknown {
  if (value.startsWith("[")) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid list for "${key}": ${value}`);
    }
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (value !== "" && !isNaN(Number(value))) return Number(value);
  return value;
}

/**
 * Parse one line of a `functionplot` block into the datum function-plot expects.
 *
 * Supported forms (options after `@` can be combined with any of them):
 *
 *     f(x) = x^2                       definition (name and variable are ignored)
 *     x^2                              bare expression
 *     fn = x^2                         explicit `fn` option
 *     f(x) = x^2 @ range=[0,5]         options, separated by `@`
 *     fn=x^2 @ graphType=scatter @ color=red
 *
 * Plots a polyline unless `graphType` says otherwise.
 * @param line One line of the code block
 * @returns The datum for function-plot
 * @throws If the line has no function expression or an option is malformed
 */
export function parseFunctionLine(line: string): Line {
  const datum: Record<string, unknown> = { graphType: "polyline" };

  line.split("@").forEach((segment, index) => {
    const text = segment.trim();
    if (!text) return;

    const definition = text.match(DEFINITION);
    if (definition) {
      datum.fn = definition[1].trim();
      return;
    }

    const separator = text.indexOf("=");
    if (separator === -1) {
      if (index !== 0) {
        throw new Error(`Expected "key=value" but got "${text}"`);
      }
      datum.fn = text; // bare expression
      return;
    }

    const key = text.slice(0, separator).trim();
    const value = text.slice(separator + 1).trim();
    datum[key] = key === "fn" ? value : parseValue(key, value);
  });

  if (typeof datum.fn !== "string" || datum.fn === "") {
    throw new Error(`No function expression found in "${line.trim()}"`);
  }
  return datum as Line;
}

/**
 * Parse all non-blank lines of a `functionplot` block.
 * @param lines The lines of the block (blank or undefined entries are skipped)
 * @returns The datums for function-plot
 */
export function parseFunctionLines(lines: (string | undefined)[]): Line[] {
  return lines
    .filter((line): line is string => !!line && line.trim().length > 0)
    .map(parseFunctionLine);
}
