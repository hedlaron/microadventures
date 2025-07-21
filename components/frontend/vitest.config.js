/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    // Limit parallelism to reduce memory usage in CI
    maxWorkers: 2,
    minWorkers: 1,
    // Reduce memory usage by limiting concurrent test files
    pool: "threads",
    poolOptions: {
      threads: {
        maxThreads: 2,
        minThreads: 1,
      },
    },
  },
});
