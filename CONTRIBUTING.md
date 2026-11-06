# Contributing

Contibutions are always welcome! We appreciate every help with this project, be it just submitting issues or feature requests, picking one up and working on it, making edits to the wiki or opening a pull request with a new feature or a bugfix, as it helps grow the project.

TL;DR:

- Use the Node version in `.nvmrc` and install with `npm ci`
- `package-lock.json` is committed; use `npm install <pkg>` to change dependencies
- The `obsidian` typings must not be newer than `minAppVersion`

## Rules

The `minAppVersion` field in `manifest.json` is the lowest Obsidian version the plugin is expected to work with. The version of the `obsidian` typings package in `package.json` is pinned to a single version and must not be newer than `minAppVersion`, so the plugin never calls APIs that don't exist in the declared minimum version (`npm test` enforces this). If no typings release exists for your exact `minAppVersion`, use the newest one that is not newer than it.

## Tooling

This project uses npm (not yarn or pnpm) and the current Node LTS release. Node is only needed to build and test the plugin; the plugin itself runs inside Obsidian. Tests run with [Vitest](https://vitest.dev) (`npm test`, or `npm run test:watch`).

The Node version is pinned in two places, and a test keeps their major versions in sync:

- `.tool-versions` for [asdf](https://asdf-vm.com) on macOS and Linux (`asdf plugin add nodejs && asdf install`). This pins an exact version, so bump it by hand when a new Node release comes out.
- `.nvmrc` for CI and for Windows development (nvm, fnm, etc.). CI follows the latest release of that major version.

## Trying the plugin in a vault

Build the plugin and copy it into a vault's `.obsidian/plugins/` folder for testing:

```bash
./scripts/install.sh /path/to/your/vault     # builds, then copies main.js and manifest.json (and styles.css if present)
./scripts/uninstall.sh /path/to/your/vault   # removes the plugin folder and its community-plugins.json entry
```

On Windows, use PowerShell: `.\scripts\install.ps1 C:\path\to\vault` and `.\scripts\uninstall.ps1 C:\path\to\vault`.

The plugin folder name comes from `id` in `manifest.json`, so it always matches the plugin. After installing, reload Obsidian and enable the plugin under Settings → Community plugins. Use a throwaway vault: uninstalling deletes the plugin folder including its saved settings (`data.json`).

## CI

Pull requests run four parallel checks (`.github/workflows/ci.yml`): typecheck, lint, test and build. You can run the same checks locally with `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`.

## Releasing

Never edit version numbers by hand. Run one of:

```bash
npm run release patch   # 1.2.1 -> 1.2.2
npm run release minor   # 1.2.1 -> 1.3.0
npm run release major   # 1.2.1 -> 2.0.0
```

This updates `package.json`, `package-lock.json`, `manifest.json` and `versions.json` (which gets an entry for every release, mapping it to `minAppVersion`) and commits. Pushing a `manifest.json` change to the default branch runs the Release workflow (`.github/workflows/release.yml`), which builds the plugin and publishes a GitHub release with `main.js`, `manifest.json` and `SHA256SUMS.txt`. A release that already exists is skipped.
