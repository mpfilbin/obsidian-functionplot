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
