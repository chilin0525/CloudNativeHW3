import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks',
    coverage: {
      enabled: true,
      reportsDirectory: 'coverage',
      reporter: ['html', 'json', 'lcov', 'text-summary', 'json-summary'] // ensures multiple output formats
    }
  }
})
