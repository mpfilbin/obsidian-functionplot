import { parseYaml } from "obsidian";

/**
 * Split the contents of a `functionplot` code block into its (optional) YAML
 * header and its list of function lines.
 *
 * Kept free of `function-plot` imports so it can be unit-tested without
 * loading that library's ESM-only d3 dependencies.
 * @param content The raw contents of the code block
 * @returns A tuple of the parsed header and the function lines
 */
export function parseCodeBlock(content: string): [object, string[]] {
  let header = {},
    offset = 0;
  if (/-{3}[^]*-{3}/.test(content)) {
    // header present
    const headerMatch = content.match(/-{3}([^]*?)-{3}/)[1];
    offset = headerMatch.length + 6;
    header = parseYaml(headerMatch);
  }
  const functions = content
    .slice(offset)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return [header, functions];
}
