import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
    coverage: {
      enabled: true,
      reportsDirectory: 'coverage',
      reporter: ['html', 'lcov', 'text-summary'], // ensures multiple output formats
    },
  }
})
