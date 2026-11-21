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
  await expect(page.locator('section.capitulo')).toHaveCount(15);
  await page.getByRole('link', { name: 'Leer el capítulo I.1' }).click();
  await expect(page).toHaveURL(/\/capitulos\/i-1\/$/);
});

test.describe('el primer capítulo (I.1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('capitulos/i-1/');
  });

  test('muestra su tomo, numera los entornos y resuelve las referencias', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Tomo I · Fundamentos/ })).toBeVisible();
    await expect(page.locator('#teo-de-morgan .entorno-titulo strong')).toHaveText('Teorema I.1.5');
    await expect(page.locator('#ax-induccion .entorno-titulo strong')).toHaveText('Axioma I.1.17');
    await expect(page.getByRole('link', { name: 'Teorema I.1.8' }).first()).toHaveAttribute('href', '#teo-contrapositiva');
    await expect(page.locator('details.entorno-demostracion').first()).toHaveAttribute('open', '');
    await expect(page.locator('.katex').first()).toBeVisible();
  });

  test('dice lo que da por conocido al comienzo del Desarrollo', async ({ page }) => {
    const recuadro = page.locator('aside.supone');
    await expect(recuadro).toContainText('Lo que este capítulo da por conocido');
    await expect(recuadro.getByRole('link', { name: 'I.11' })).toHaveAttribute('href', /indice\/i\/#i-11$/);
    const orden = await page.evaluate(() => {
      const desarrollo = document.getElementById('desarrollo')!;
      const recuadro = document.querySelector('aside.supone')!;
      return desarrollo.compareDocumentPosition(recuadro) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    expect(orden).toBeTruthy();
  });

  test('la tabla de verdad es interactiva y clasifica la fórmula', async ({ page }) => {
    const figura = page.locator('figura-interactiva[data-pieza="tabla-de-verdad"]');
    const veredicto = figura.locator('output');
    await expect(veredicto).toContainText('Tautología');
    await expect(figura.locator('tbody tr')).toHaveCount(4);
    await figura.getByLabel('Fórmula').fill('(p → q) ↔ (q → p)');
    await expect(veredicto).toContainText('Contingencia');
    await figura.getByLabel('Fórmula').fill('p ∧');
    await expect(veredicto).toContainText('termina antes de tiempo');
  });

  test('abre con la matemática: el cuadrado de impares responde al deslizador', async ({ page }) => {
    const figura = page.locator('figura-interactiva[data-pieza="cuadrado-de-impares"]');
    await expect(figura.locator('output')).toHaveText('1 + 3 + 5 + 7 + 9 = 25 = 5²');
    await expect(figura.locator('rect')).toHaveCount(25);
    await figura.getByLabel('Cantidad de impares n').fill('3');
    await expect(figura.locator('output')).toHaveText('1 + 3 + 5 = 9 = 3²');
    // La figura llega antes que el código.
    const posiciones = await page.evaluate(() => {
      const fig = document.querySelector('figura-interactiva')!.getBoundingClientRect().top;
      const codigo = document.querySelector('.sl-markdown-content pre')!.getBoundingClientRect().top;
      return { fig, codigo };
    });
    expect(posiciones.fig).toBeLessThan(posiciones.codigo);
  });

  test('la celda es un editor con resaltado, y «Restaurar» devuelve el código de referencia', async ({ page }) => {
    const celda = page.locator('celda-python').first();
    const contenido = celda.locator('.cm-content');
    await expect(contenido).toHaveAttribute('aria-label', 'Código Python de la celda, editable');
    await expect(celda.locator('.cm-line').first()).toHaveText('from itertools import product');
    // El resaltado de Python: las palabras clave van en su propio elemento.
    expect(await contenido.locator('.cm-line span').count()).toBeGreaterThan(5);
    await contenido.fill('print(2 + 2)');
    await expect(contenido).toHaveText('print(2 + 2)');
    await celda.getByRole('button', { name: 'Restaurar' }).click();
    await expect(celda.locator('.cm-line').first()).toHaveText('from itertools import product');
  });

  test('la celda de Python se ejecuta en el navegador', async ({ page }) => {
    test.skip(process.env['E2E_SIN_RED'] === '1', 'Pyodide se descarga de su CDN');
    test.setTimeout(180_000);
    await page.getByRole('button', { name: 'Ejecutar' }).first().click();
    const salida = page.locator('.celda-salida').first();
    await expect(salida).toHaveText('True\nTrue\nTrue\nFalse', { timeout: 150_000 });
    // Con el código editado y Ctrl+Enter desde el editor.
    const contenido = page.locator('celda-python .cm-content').first();
    await contenido.fill('print(sum(k * k for k in range(5)))');
    await contenido.press('ControlOrMeta+Enter');
    await expect(salida).toHaveText('30', { timeout: 30_000 });
  });
});

test.describe('el capítulo I.2', () => {
  test('cita los entornos de I.1 con su número y enlaza a ellos', async ({ page }) => {
    await page.goto('capitulos/i-2/');
    const deMorgan = page.locator('a[href$="/capitulos/i-1/#teo-de-morgan"]').first();
    await expect(deMorgan).toHaveText('Teorema I.1.5');
    await deMorgan.click();
    await expect(page.locator('#teo-de-morgan')).toContainText('Teorema I.1.5');
  });

  test('las cubetas se reparten de nuevo al cambiar la cantidad y la función', async ({ page }) => {
    await page.goto('capitulos/i-2/');
    const figura = page.locator('#fig-cubetas');
    const cubetas = figura.locator('.pieza-cubetas li');
    await expect(cubetas).toHaveCount(8);
    // Con la suma de códigos, los cuatro anagramas comparten cubeta.
    await expect(figura.locator('li.choque', { hasText: 'amor, roma, mora, ramo' })).toHaveCount(1);
    await figura.locator('input[type=range]').fill('11');
    await expect(cubetas).toHaveCount(11);
    await expect(figura.locator('output')).toContainText('No hay más claves que cubetas');
    await figura.locator('select').selectOption('polinomial');
    await expect(figura.locator('li.choque', { hasText: 'amor, roma, mora, ramo' })).toHaveCount(0);
  });
});

test('el diccionario reúne los términos de los capítulos y busca en los dos idiomas', async ({ page }) => {
  await page.goto('diccionario/');
  const implicacion = page.locator('.diccionario .entrada#implicacion');
  await expect(implicacion.locator('a.termino')).toHaveAttribute('href', /\/capitulos\/i-1\/#def-implicacion$/);
  await expect(implicacion.locator('.ingles')).toHaveText('implication');
  const buscar = page.locator('#buscar-termino');
  await buscar.fill('implication');
  await expect(page.locator('.diccionario .entrada:visible')).toHaveCount(1);
  await expect(implicacion).toBeVisible();
  // Desde el comienzo de una palabra: «all» es `all(...)`, no «falla».
  await buscar.fill('all');
  await expect(page.locator('.diccionario .entrada#cuantificador-universal')).toBeVisible();
  await expect(page.locator('.diccionario .entrada#contraejemplo')).toBeHidden();
  await buscar.fill('zzz');
  await expect(page.locator('#cuenta-terminos')).toHaveText('Ningún término coincide');
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
