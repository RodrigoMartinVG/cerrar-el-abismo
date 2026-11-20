import { defineConfig } from 'vitest/config';

/** Las pruebas viven junto al código que prueban: `*.test.ts`. */
export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts', 'site/src/**/*.test.ts'],
  },
});
