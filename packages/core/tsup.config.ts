import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/providers/index.ts', 'src/composables/index.ts'],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  format: ['esm'],
})
