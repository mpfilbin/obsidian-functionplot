import { expect, test } from "vitest";
import { readFileSync } from "fs";

/** Parse "major.minor.patch" into a comparable tuple, throwing on anything else. */
function parseVersion(version: string): [number, number, number] {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Invalid version "${version}", expected "x.y.z"`);
  }
  const [major, minor, patch] = version.split(".").map(Number);
  return [major, minor, patch];
}

/** Returns true if version `a` is newer than version `b`. */
function isNewer(a: string, b: string): boolean {
  const [pa, pb] = [parseVersion(a), parseVersion(b)];
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] > pb[i];
  }
  return false;
}

test("obsidian typings are not newer than minAppVersion", () => {
  // The typings must not describe APIs newer than the lowest Obsidian version
  // declared in the manifest, otherwise the plugin could call missing APIs.
  const package_ = JSON.parse(readFileSync("package.json", "utf8"));
  const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
  const typings: string = package_.dependencies.obsidian;
  expect(typings).toMatch(/^\d+\.\d+\.\d+$/); // pinned, no ranges
  expect(isNewer(typings, manifest.minAppVersion)).toBe(false);
});

test(".tool-versions (asdf) and .nvmrc pin the same Node major version", () => {
  // .nvmrc drives CI and Windows development, .tool-versions drives asdf on
  // macOS/Linux. They must not drift apart.
  const nvmrc = readFileSync(".nvmrc", "utf8").trim();
  const toolVersions = readFileSync(".tool-versions", "utf8");
  const match = toolVersions.match(/^nodejs\s+(\d+)\.\d+\.\d+\s*$/m);
  expect(nvmrc).toMatch(/^\d+$/);
  expect(match).not.toBeNull();
  expect(match?.[1]).toBe(nvmrc);
});
