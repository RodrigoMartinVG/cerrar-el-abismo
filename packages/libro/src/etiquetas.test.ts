import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';
import { describe, expect, it } from 'vitest';
import { etiquetasDelCapitulo } from './etiquetas.ts';
import { remarkLibro } from './remark-libro.ts';

/** Un capítulo con todo lo que se numera, y con directivas falsas dentro de bloques de código. */
const CAPITULO = [
  ':::definicion[Conjunto de partes]{#def-partes}',
  'Texto.',
  ':::',
  '',
  '```markdown',
  ':::teorema{#falso}',
  '```',
  '',
  ':::teorema[De Cantor, con $\\{0, 1\\}$]{#teo-cantor}',
  'Texto.',
  ':::',
  '',
  ':::demostracion',
  'Sin número.',
  ':::',
  '',
  ':::observacion',
  'Sin etiqueta, pero cuenta.',
  ':::',
  '',
  '::figura[Un pie con {llaves}.]{#fig-cubetas pieza="normal-covector" alt="Una descripción."}',
  '',
  '````markdown',
  '```python',
  ':::ejemplo{#tampoco}',
  '```',
  '````',
  '',
  ':::ejercicio{#ej-uno}',
  'Texto.',
  ':::',
  '',
  ':::ejemplo{#ej-numeros}',
  'Texto.',
  ':::',
].join('\n');

/** Los nombres que el plugin escribe de verdad, leídos del HTML. */
function nombresDelPlugin(md: string, capitulo: string): Map<string, string> {
  const html = String(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkDirective)
      .use(remarkLibro, { capitulos: new Map(), piezas: ['normal-covector'] })
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(new VFile({ value: md, data: { astro: { frontmatter: { capitulo } } } })),
  );
  const nombres = new Map<string, string>();
  for (const m of html.matchAll(/id="([\w-]+)"[^>]*>[\s\S]*?<strong>([^<]+?)\.?<\/strong>/g)) nombres.set(m[1]!, m[2]!);
  return nombres;
}

describe('etiquetasDelCapitulo', () => {
  it('numera como el plugin: resultados, ejercicios y figuras, cada uno con su contador', () => {
    const etiquetas = etiquetasDelCapitulo(CAPITULO, 'II.5');
    expect(Object.fromEntries(etiquetas)).toEqual({
      'def-partes': 'Definición II.5.1',
      'teo-cantor': 'Teorema II.5.2',
      'fig-cubetas': 'Figura II.5.1',
      'ej-uno': 'Ejercicio II.5.1',
      'ej-numeros': 'Ejemplo II.5.4',
    });
    expect(etiquetas).toEqual(nombresDelPlugin(CAPITULO, 'II.5'));
  });
});
