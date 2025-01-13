import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  treeshake: true,
  splitting: true,
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.js']
  }
})
