import { expect, test } from '@playwright/test';

test('la portada muestra el mapa de tomos y lleva al índice temático', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1, name: 'Matemática y práctica' })).toBeVisible();
  await expect(page.locator('.mapa-tomos li')).toHaveCount(13);
  await page.getByRole('link', { name: 'Índice temático' }).first().click();
  await expect(page).toHaveURL(/\/indice\/$/);
  await expect(page.locator('table tbody tr')).toHaveCount(13);
});

test('la página de un tomo muestra sus capítulos y enlaza los escritos', async ({ page }) => {
  await page.goto('indice/i/');
  await expect(page.locator('section.capitulo')).toHaveCount(12);
  await page.getByRole('link', { name: 'Leer el capítulo I.1' }).click();
  await expect(page).toHaveURL(/\/capitulos\/i-1\/$/);
});

test.describe('el primer capítulo (I.1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('capitulos/i-1/');
  });

  test('muestra su tomo, numera los entornos y resuelve las referencias', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Tomo I · Fundamentos/ })).toBeVisible();
    await expect(page.locator('#teo-de-morgan .entorno-titulo strong')).toHaveText('Teorema I.1.4');
    await expect(page.locator('#ax-induccion .entorno-titulo strong')).toHaveText('Axioma I.1.16');
    await expect(page.getByRole('link', { name: 'Teorema I.1.7' }).first()).toHaveAttribute('href', '#teo-contrapositiva');
    await expect(page.locator('details.entorno-demostracion').first()).toHaveAttribute('open', '');
    await expect(page.locator('.katex').first()).toBeVisible();
  });

  test('la tabla de verdad es interactiva y clasifica la fórmula', async ({ page }) => {
    const figura = page.locator('figura-interactiva');
    const veredicto = figura.locator('output');
    await expect(veredicto).toContainText('Tautología');
    await expect(figura.locator('tbody tr')).toHaveCount(4);
    await figura.getByLabel('Fórmula').fill('(p → q) ↔ (q → p)');
    await expect(veredicto).toContainText('Contingencia');
    await figura.getByLabel('Fórmula').fill('p ∧');
    await expect(veredicto).toContainText('termina antes de tiempo');
  });

  test('la celda de Python se ejecuta en el navegador', async ({ page }) => {
    test.skip(process.env['E2E_SIN_RED'] === '1', 'Pyodide se descarga de su CDN');
    test.setTimeout(180_000);
    await page.getByRole('button', { name: 'Ejecutar' }).first().click();
    const salida = page.locator('.celda-salida').first();
    await expect(salida).toHaveText('True\nTrue\nTrue\nFalse', { timeout: 150_000 });
  });
});

test('los paneles laterales se ocultan y la preferencia se recuerda', async ({ page }) => {
  await page.goto('capitulos/i-1/');
  const indice = page.locator('.sidebar-pane');
  const toc = page.locator('.right-sidebar-container');
  await expect(indice).toBeVisible();
  await expect(toc).toBeVisible();
  await page.getByRole('button', { name: 'Ocultar el índice de la obra' }).click();
  await page.getByRole('button', { name: 'Ocultar el índice de la página' }).click();
  await expect(indice).toBeHidden();
  await expect(toc).toBeHidden();
  await page.goto('indice/i/');
  await expect(page.locator('.sidebar-pane')).toBeHidden();
  await page.getByRole('button', { name: 'Ocultar el índice de la obra' }).click();
  await expect(page.locator('.sidebar-pane')).toBeVisible();
});

test('los botones de las piezas y de las celdas quedan alineados', async ({ page }) => {
  await page.goto('capitulos/i-1/');
  const botones = page.locator('figura-interactiva .pieza-botones button');
  const alturas = await botones.evaluateAll((bs) => bs.map((b) => Math.round(b.getBoundingClientRect().top)));
  expect(new Set(alturas).size).toBe(1);
  const celda = page.locator('celda-python .celda-barra button');
  const filas = await celda.evaluateAll((bs) => bs.slice(0, 2).map((b) => Math.round(b.getBoundingClientRect().top)));
  expect(filas[0]).toBe(filas[1]);
});
