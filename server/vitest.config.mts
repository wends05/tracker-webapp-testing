import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Important: Use the Node.js environment
    globals: true, // Optional: Makes test functions globally available (describe, it, expect)
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"], // Choose your reporters
      include: ["**/*.ts"], // Files to include in coverage
      exclude: ["src/types/*", "src/config/*"], // Files to exclude in coverage
    },
  },
});
