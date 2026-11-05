import { readFileSync, writeFileSync } from "fs";

// Copies the version from package.json into manifest.json, and records the
// version -> minAppVersion mapping in versions.json when minAppVersion is new.
// Run via scripts/release.sh (`npm run release <major|minor|patch>`).
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, data) =>
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");

const { version: targetVersion } = readJson("package.json");

const manifest = readJson("manifest.json");
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeJson("manifest.json", manifest);

const versions = readJson("versions.json");
if (!Object.values(versions).includes(minAppVersion)) {
  versions[targetVersion] = minAppVersion;
  writeJson("versions.json", versions);
}
