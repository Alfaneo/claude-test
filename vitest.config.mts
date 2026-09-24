import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Testler geliştirme veritabanına dokunmasın diye ayrı bir SQLite dosyası kullanır.
    env: { DATABASE_URL: 'file:./test.db' },
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
  },
})
