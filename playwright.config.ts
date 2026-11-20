import { defineConfig, devices } from '@playwright/test';

/**
 * Las pruebas en el navegador: el sitio construido (`npm run build`), servido con `vite preview`. La celda de
 * Python necesita red, porque Pyodide se descarga de su CDN; sin red, `E2E_SIN_RED=1` la salta.
 */
const PUERTO = Number(process.env['E2E_PORT'] ?? 4330);

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PUERTO}/cerrar-el-abismo/`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // `astro preview` pasa a segundo plano cuando no hay una terminal; `vite preview` sirve site/dist en primer plano.
    command: `npx vite preview --outDir site/dist --base /cerrar-el-abismo/ --host 127.0.0.1 --port ${PUERTO} --strictPort`,
    url: `http://127.0.0.1:${PUERTO}/cerrar-el-abismo/`,
    reuseExistingServer: process.env['E2E_REUSE'] === '1',
    timeout: 60_000,
  },
});
