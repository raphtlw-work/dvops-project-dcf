import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  treeshake: true,
  splitting: true,
  // This ensures .ts extensions are handled correctly
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.js']
  }
})
