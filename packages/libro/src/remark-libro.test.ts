import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { describe, expect, it } from 'vitest';
import { remarkLibro, type OpcionesLibro } from './remark-libro.ts';

const opciones: OpcionesLibro = {
  capitulos: new Map([
    ['II.3', { url: '/indice/ii/#ii-3', titulo: 'Transformaciones lineales' }],
    ['II.4', { url: '/capitulos/ii-4/', titulo: 'Matrices' }],
    ['II.5', { url: '/capitulos/ii-5/', titulo: 'Espacio dual y covectores' }],
  ]),
  piezas: ['normal-covector'],
  etiquetas: new Map([['II.4', new Map([['teo-nucleo', 'Teorema II.4.4']])]]),
};

/** Procesa un capítulo como lo hace el sitio, con `capitulo: II.5` (u otro frontmatter) en el frontmatter. */
function html(md: string, capitulo: string | undefined = 'II.5', otros: Record<string, unknown> = {}): string {
  const file = new VFile({ value: md, data: { astro: { frontmatter: { ...(capitulo ? { capitulo } : {}), ...otros } } } });
  return String(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkDirective)
      .use(remarkLibro, opciones)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(file),
  );
}

describe('remarkLibro', () => {
  it('numera los entornos con un contador común por capítulo', () => {
    const salida = html(':::definicion\nUn funcional.\n:::\n\n:::teorema[Dimensión del dual]{#dim}\nSi $\\dim V = n$…\n:::');
    expect(salida).toContain('<strong>Definición II.5.1</strong>');
    expect(salida).toContain('<section class="entorno entorno-teorema" id="dim">');
    expect(salida).toContain('<strong>Teorema II.5.2</strong> (Dimensión del dual).');
  });

  it('numera los axiomas con los demás resultados', () => {
    const salida = html(':::axioma[Principio de inducción]{#ax}\nP.\n:::\n\n:::teorema\nQ.\n:::');
    expect(salida).toContain('<strong>Axioma II.5.1</strong> (Principio de inducción).');
    expect(salida).toContain('<strong>Teorema II.5.2</strong>');
  });

  it('cierra las demostraciones con ∎, las deja plegables y no las numera', () => {
    const salida = html(':::demostracion\nTrivial.\n:::');
    expect(salida).toContain(
      '<details class="entorno entorno-demostracion" open><summary class="entorno-titulo"><strong>Demostración</strong></summary>',
    );
    expect(salida).toContain('<p class="qed" aria-label="Fin de la demostración">∎</p>');
  });

  it('lleva un contador aparte para los ejercicios y pliega las soluciones', () => {
    const salida = html(':::teorema\nA.\n:::\n\n:::ejercicio\nB.\n:::\n\n:::solucion\nC.\n:::');
    expect(salida).toContain('<strong>Ejercicio II.5.1</strong>');
    expect(salida).toContain(
      '<details class="entorno entorno-solucion"><summary class="entorno-titulo"><strong>Solución</strong></summary>',
    );
  });

  it('resuelve :ref[id] con el nombre numerado del entorno', () => {
    const salida = html(':::lema{#clave}\nX.\n:::\n\nPor el :ref[clave], listo.');
    expect(salida).toContain('Por el <a href="#clave">Lema II.5.1</a>, listo.');
  });

  it('enlaza [[II.3]] a su capítulo', () => {
    const salida = html('Como vimos en [[II.3]] y en [[II.5]].');
    expect(salida).toContain('<a href="/indice/ii/#ii-3" title="Transformaciones lineales">II.3</a>');
    expect(salida).toContain('<a href="/capitulos/ii-5/" title="Espacio dual y covectores">II.5</a>.');
  });

  it('convierte una figura en una pieza interactiva numerada con su texto alternativo', () => {
    const salida = html('::figura[La normal tras escalar.]{#fig pieza="normal-covector" alt="Una recta y su normal."}');
    expect(salida).toContain('<figure class="figura" id="fig">');
    expect(salida).toContain(
      '<figura-interactiva data-pieza="normal-covector" data-alt="Una recta y su normal.">Una recta y su normal.</figura-interactiva>',
    );
    expect(salida).toContain('<figcaption><strong>Figura II.5.1.</strong> La normal tras escalar.</figcaption>');
  });

  it('pasa a la pieza los atributos que la configuran', () => {
    const salida = html('::figura{pieza="normal-covector" alt="x" formula="p → q"}');
    expect(salida).toContain('data-formula="p → q"');
  });

  it('convierte los bloques python celda en celdas ejecutables y deja el resto como código', () => {
    const salida = html('```python celda\nprint(1 + 1)\n```\n\n```python\nx = 1\n```');
    expect(salida).toContain('<celda-python class="celda">print(1 + 1)</celda-python>');
    expect(salida).toContain('<pre><code class="language-python">x = 1');
  });

  it('pone lo que el capítulo da por conocido después del primer párrafo del Desarrollo', () => {
    const md = '## Desarrollo\n\nEl capítulo usa algo que viene después.\n\nSigue el texto.';
    const salida = html(md, 'II.3', { supone: [{ nocion: 'el espacio dual', en: 'II.5' }] });
    expect(salida).toMatch(/usa algo que viene después\.<\/p>\s*<aside class="supone"/);
    expect(salida).toContain('Lo que este capítulo da por conocido.');
    expect(salida).toContain('<li>el espacio dual: <a href="/capitulos/ii-5/" title="Espacio dual y covectores">II.5</a>.</li>');
    expect(salida.indexOf('</aside>')).toBeLessThan(salida.indexOf('Sigue el texto.'));
  });

  it.each([
    [[{ nocion: 'transformaciones', en: 'II.3' }], /no viene después de II\.5.*requiere/],
    [[{ nocion: 'algo', en: 'II.99' }], /no es un capítulo de la obra/],
    [[{ en: 'II.3' }], /no tiene «nocion»/],
    ['II.3', /tiene que ser una lista/],
  ])('rechaza un «supone» mal hecho: %j', (supone, error) => {
    expect(() => html('## Desarrollo\n\nTexto.', 'II.5', { supone })).toThrow(error);
  });

  it('resuelve :ref[] a un entorno de otro capítulo escrito, y al propio con su identificador', () => {
    expect(html('Por el :ref[II.4#teo-nucleo].')).toContain('<a href="/capitulos/ii-4/#teo-nucleo">Teorema II.4.4</a>');
    expect(html(':::lema{#l}\nX.\n:::\n\nVer :ref[II.5#l].')).toContain('<a href="#l">Lema II.5.1</a>');
  });

  it('deja pasar los recuadros de Starlight', () => {
    expect(() => html(':::note\nOjo.\n:::')).not.toThrow();
  });

  it.each([
    [':::teorma\nX.\n:::', /no es una directiva de la obra/],
    ['::video{src="x"}', /no es una directiva de la obra/],
    ['::figura{pieza="otra" alt="x"}', /no existe/],
    ['::figura{pieza="normal-covector"}', /texto alternativo/],
    ['Ver :ref[nada].', /no apunta a ningún entorno/],
    ['Ver :ref[II.4#otra].', /no apunta a ningún entorno ni figura de un capítulo escrito/],
    ['Ver :ref[II.3#teo-nucleo].', /de un capítulo escrito/],
    ['Ver [[II.99]].', /no es un capítulo de la obra/],
    [':::teorema{#a}\nX.\n:::\n\n:::lema{#a}\nY.\n:::', /repetida/],
  ])('hace fallar la construcción ante %j', (md, error) => {
    expect(() => html(md)).toThrow(error);
  });
});
