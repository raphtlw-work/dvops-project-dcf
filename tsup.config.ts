import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["index.ts"],
  clean: false,
  format: "esm",
  target: "esnext",
  sourcemap: true,
})
