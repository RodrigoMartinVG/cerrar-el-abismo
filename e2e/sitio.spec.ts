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
  await page.getByRole('link', { name: 'Leer el capítulo I.1 →', exact: true }).click();
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
    // I.11 ya está escrito, así que el recuadro enlaza al capítulo y no a su lugar en el índice.
    await expect(recuadro.getByRole('link', { name: 'I.11' })).toHaveAttribute('href', /capitulos\/i-11\/$/);
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

  test('si la red bloquea la CDN de Python, la celda lo dice', async ({ page, context }) => {
    await context.route('https://cdn.jsdelivr.net/**', (ruta) => ruta.abort());
    const celda = page.locator('celda-python').first();
    await celda.getByRole('button', { name: 'Ejecutar' }).click();
    const salida = celda.locator('.celda-salida');
    await expect(salida).toContainText('No se pudo cargar Python desde cdn.jsdelivr.net', { timeout: 30_000 });
    await expect(salida).toHaveClass(/celda-error/);
    await expect(celda.getByRole('button', { name: 'Ejecutar' })).toBeEnabled();
  });

  test('«Detener» corta un bucle que no termina, y Python vuelve a funcionar', async ({ page }) => {
    test.skip(process.env['E2E_SIN_RED'] === '1', 'Pyodide se descarga de su CDN');
    test.setTimeout(240_000);
    const celda = page.locator('celda-python').first();
    const salida = celda.locator('.celda-salida');
    const detener = celda.getByRole('button', { name: 'Detener' });
    await expect(detener).toBeHidden();
    // Primero se carga Python, para que el bucle empiece enseguida.
    await celda.getByRole('button', { name: 'Ejecutar' }).click();
    await expect(salida).toHaveText('True\nTrue\nTrue\nFalse', { timeout: 150_000 });
    await celda.locator('.cm-content').fill('while True:\n    pass');
    await celda.getByRole('button', { name: 'Ejecutar' }).click();
    await expect(salida).toHaveText('Ejecutando…');
    await detener.click();
    await expect(salida).toContainText('Ejecución detenida');
    await expect(salida).toHaveClass(/celda-error/);
    await expect(detener).toBeHidden();
    await celda.getByRole('button', { name: 'Restaurar' }).click();
    await celda.getByRole('button', { name: 'Ejecutar' }).click();
    await expect(salida).toHaveText('True\nTrue\nTrue\nFalse', { timeout: 150_000 });
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

test('cada capítulo dice cuánto está revisado y lleva al estado de la revisión', async ({ page }) => {
  await page.goto('capitulos/i-1/');
  const enlace = page.getByRole('link', { name: /^Revisión: \d+ de 11 resultados/ });
  await expect(enlace).toHaveAttribute('href', /\/revision\/#i-1$/);
  await enlace.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Estado de la revisión' })).toBeVisible();
  await expect(page.locator('.tabla-revision tbody tr')).toHaveCount(15);
  await expect(page.locator('tr#i-1 th a')).toHaveText('I.1 Lógica y demostración');
});

test('cada capítulo tiene un enlace para reportar un error, con el capítulo ya escrito', async ({ page }) => {
  await page.goto('capitulos/i-9/');
  const href = await page.getByRole('link', { name: 'Reportar un error' }).getAttribute('href');
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe('https://github.com/RodrigoMartinVG/cerrar-el-abismo/issues/new');
  expect(url.searchParams.get('title')).toBe('Error en I.9: ');
  expect(url.searchParams.get('body')).toContain('**Capítulo:** I.9 Grupos');
  expect(url.searchParams.get('body')).toContain('/cerrar-el-abismo/capitulos/i-9/');
});

test.describe('el capítulo I.3', () => {
  test('el rectángulo de Euclides se corta en cuadrados y da el máximo común divisor', async ({ page }) => {
    await page.goto('capitulos/i-3/');
    const figura = page.locator('#fig-euclides');
    await expect(figura.locator('.pieza-euclides rect')).toHaveCount(5);
    await expect(figura.locator('output')).toContainText('mcd(84, 60) = 12');
    const [ancho, alto] = await figura.locator('input[type=range]').all();
    await ancho!.fill('21');
    await alto!.fill('13');
    await expect(figura.locator('output')).toContainText('mcd(21, 13) = 1');
    await expect(figura.locator('.pieza-euclides rect')).toHaveCount(7);
  });
});

test.describe('el capítulo I.5', () => {
  test('la multiplicación modular dice cuándo hay inverso', async ({ page }) => {
    await page.goto('capitulos/i-5/');
    const figura = page.locator('#fig-modular');
    await expect(figura.locator('output')).toContainText('el inverso de 7 es 43');
    const [, multiplicador] = await figura.locator('input[type=range]').all();
    await multiplicador!.fill('6');
    await expect(figura.locator('output')).toContainText('6 no tiene inverso módulo 60');
    await expect(figura.locator('output')).toContainText('la imagen tiene 10 de los 60 elementos');
  });
});

test.describe('el capítulo I.7', () => {
  test('el retículo de los divisores marca el ínfimo y el supremo, y dice cuándo es un álgebra de Boole', async ({ page }) => {
    await page.goto('capitulos/i-7/');
    const figura = page.locator('#fig-divisores');
    await expect(figura.locator('output')).toContainText('mcd(4, 6) = 2');
    await expect(figura.locator('output')).toContainText('mcm(4, 6) = 12');
    await expect(figura.locator('output')).toContainText('el complemento de 4 es 15');
    await expect(figura.locator('.nodo')).toHaveCount(12);
    const deslizador = figura.locator('input[type=range]');
    await deslizador.fill('30');
    await expect(figura.locator('output')).toContainText('Los 8 divisores de 30 forman un álgebra de Boole');
    await deslizador.fill('60');
    await expect(figura.locator('output')).toContainText('2 no tiene complemento');
  });
});

test.describe('el mapa de dependencias', () => {
  test('I.4 cumple lo que le dejaron I.2 e I.3', async ({ page }) => {
    await page.goto('mapa/i-4/');
    await expect(page.locator('#hacia-atras ~ ul').first().locator('li', { hasText: 'se cumple en' })).toHaveCount(2);
  });

  test('el mapa hacia atrás dice dónde cumple un capítulo lo que le dejaron los anteriores', async ({ page }) => {
    await page.goto('mapa/i-3/');
    const recibidas = page.locator('#hacia-atras ~ ul').first().locator('li');
    await expect(recibidas).toHaveCount(3);
    await expect(recibidas.filter({ hasText: 'se cumple en' })).toHaveCount(3);
    await expect(page.locator('main')).toContainText('Ninguna: todos los capítulos anteriores');
  });

  test('el recorrido hasta un capítulo lo dibuja, lo lista por tomo y dice lo que abre', async ({ page }) => {
    await page.goto('mapa/i-5/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Recorrido hasta I.5');
    await expect(page.locator('main')).toContainText('hace falta pasar antes por 3 capítulos');
    await expect(page.locator('.mapa-dibujo .mapa-nodo')).toHaveCount(4);
    await expect(page.locator('.mapa-dibujo .mapa-nodo.destino')).toHaveCount(1);
    await expect(page.locator('.mapa-lista').first().locator('li')).toHaveCount(3);
    await page.locator('.mapa-nodo', { hasText: 'I.3' }).click();
    await expect(page).toHaveURL(/\/mapa\/i-3\/$/);
  });

  test('el mapa completo lleva al recorrido del capítulo elegido', async ({ page }) => {
    await page.goto('mapa/');
    await expect(page.locator('.mapa-dibujo .mapa-nodo')).toHaveCount(167);
    await page.locator('#mapa-destino').selectOption({ label: 'IX.15 La función zeta y los números primos' });
    await page.getByRole('button', { name: 'Ver el recorrido' }).click();
    await expect(page).toHaveURL(/\/mapa\/ix-15\/$/);
  });

  test('cada entrada del índice enlaza su recorrido', async ({ page }) => {
    await page.goto('indice/i/');
    await page
      .locator('#i-5')
      .locator('..')
      .getByRole('link', { name: /^Recorrido:/ })
      .click();
    await expect(page).toHaveURL(/\/mapa\/i-5\/$/);
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
