import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    dir: "./src",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "lcov", "clover"],
    },
  },
});
