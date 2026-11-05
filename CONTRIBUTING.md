# Contributing

Contibutions are always welcome! We appreciate every help with this project, be it just submitting issues or feature requests, picking one up and working on it, making edits to the wiki or opening a pull request with a new feature or a bugfix, as it helps grow the project.

TL;DR:

-   Use the Node version in `.nvmrc` and install with `npm ci`
-   `package-lock.json` is committed; use `npm install <pkg>` to change dependencies
-   The `obsidian` typings must not be newer than `minAppVersion`

## Rules

The `minAppVersion` field in `manifest.json` is the lowest Obsidian version the plugin is expected to work with. The version of the `obsidian` typings package in `package.json` is pinned to a single version and must not be newer than `minAppVersion`, so the plugin never calls APIs that don't exist in the declared minimum version (`npm test` enforces this). If no typings release exists for your exact `minAppVersion`, use the newest one that is not newer than it.

## Tooling

This project uses npm (not yarn or pnpm) and the current Node LTS release (see `.nvmrc`). Node is only needed to build and test the plugin; the plugin itself runs inside Obsidian.
