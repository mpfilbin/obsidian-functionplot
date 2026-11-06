import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      // The real `obsidian` package ships only type declarations.
      obsidian: fileURLToPath(
        new URL("./src/__tests__/mocks/obsidian.ts", import.meta.url)
      ),
    },
  },
  test: {
    include: ["src/__tests__/**/*.test.ts"],
  },
});
