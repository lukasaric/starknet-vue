import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), tsconfigPaths({ ignoreConfigErrors: true })],
  test: {
    globals: true,
    clearMocks: true,
    environment: 'happy-dom',
    setupFiles: './test/setup.ts',
  },
})
