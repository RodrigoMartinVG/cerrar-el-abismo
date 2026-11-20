import { expect, test } from '@playwright/test';

test('la portada lleva al índice temático', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1, name: 'Matemática y práctica' })).toBeVisible();
  await page.getByRole('link', { name: 'Índice temático' }).first().click();
  await expect(page).toHaveURL(/\/indice\/$/);
  await expect(page.locator('table tbody tr')).toHaveCount(13);
});

test('la página de un tomo muestra sus capítulos y enlaza los escritos', async ({ page }) => {
  await page.goto('indice/ii/');
  await expect(page.locator('section.capitulo')).toHaveCount(16);
  await page.getByRole('link', { name: 'Leer el capítulo II.5' }).click();
  await expect(page).toHaveURL(/\/capitulos\/ii-5\/$/);
});

test.describe('el capítulo de prueba (II.5)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('capitulos/ii-5/');
  });

  test('numera los entornos y resuelve las referencias', async ({ page }) => {
    await expect(page.getByText('Teorema II.5.3', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Proposición II.5.5' }).first()).toHaveAttribute('href', '#prop-transpuesta');
    await expect(page.locator('details.entorno-demostracion').first()).toHaveAttribute('open', '');
    await expect(page.locator('.katex').first()).toBeVisible();
  });

  test('la figura es interactiva, accesible y responde al deslizador', async ({ page }) => {
    const figura = page.locator('figura-interactiva');
    await expect(figura.locator('canvas')).toHaveAttribute('aria-label', /recta del plano/);
    const lectura = figura.locator('output');
    const antes = await lectura.textContent();
    await figura.getByLabel('Escala horizontal s').fill('1');
    await expect(lectura).not.toHaveText(antes ?? '');
    await expect(lectura).toContainText('M·t · M·n = 0.000');
  });

  test('la celda de Python se ejecuta en el navegador', async ({ page }) => {
    test.skip(process.env['E2E_SIN_RED'] === '1', 'Pyodide se descarga de su CDN');
    test.setTimeout(180_000);
    await page.getByRole('button', { name: 'Ejecutar' }).click();
    const salida = page.locator('.celda-salida');
    await expect(salida).toContainText('con (M⁻¹)ᵀ:  0.0', { timeout: 150_000 });
    await expect(salida).toContainText('con M:       -3.0');
    await expect(salida).not.toContainText('Loading');
  });
});
