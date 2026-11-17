import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier/flat";

// Flat config (ESLint 9+ no longer reads .eslintrc.* / .eslintignore).
// Only TypeScript sources are linted, as with the old `--ext .ts` flag.
export default [
  // Replaces .eslintignore (node_modules/ is ignored by default).
  { ignores: ["main.js", "data.json", ".nyc_output/", "coverage/"] },

  {
    files: ["**/*.ts"],
    ...js.configs.recommended,
  },
  // Sets @typescript-eslint/parser and the plugin, and applies its
  // recommended rules (scoped to TypeScript files).
  ...typescriptEslint.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),
  // Turns off formatting rules that conflict with Prettier; keep it last
  // among the shared configs so it wins.
  prettier,

  {
    files: ["**/*.ts"],
    rules: {
      "no-unused-vars": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "no-use-before-define": "warn",
    },
  },
];
