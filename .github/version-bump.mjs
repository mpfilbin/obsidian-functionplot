import { existsSync, readFileSync, writeFileSync } from "fs";

const version = process.argv[2];

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, data) =>
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");

// read files
const package_ = readJson("package.json");
const manifest = readJson("manifest.json");
const versions = readJson("versions.json");

const minAppVersion = manifest.minAppVersion;

// index minAppVersion
versions[version] = minAppVersion;

// update versions
package_.version = version;
manifest.version = version;

writeJson("package.json", package_);
writeJson("manifest.json", manifest);
writeJson("versions.json", versions);

// keep package-lock.json's own version in sync
if (existsSync("package-lock.json")) {
  const lock = readJson("package-lock.json");
  lock.version = version;
  if (lock.packages?.[""]) lock.packages[""].version = version;
  writeJson("package-lock.json", lock);
}
