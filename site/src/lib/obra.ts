import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';
import { cargarIndice, slug, todosLosCapitulos, tomoDe, type Indice } from '@cerrar-el-abismo/indice';

/** El índice de la obra, leído una sola vez por construcción del sitio. */
let indice: Indice | undefined;
export function obra(): Indice {
  return (indice ??= cargarIndice());
}

const raiz = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export function urlTomo(tomo: string): string {
  return `${raiz}indice/${slug(tomo)}/`;
}

export function urlCapitulo(id: string): string {
  return `${urlTomo(tomoDe(id))}#${slug(id)}`;
}

const REFERENCIA = /\b(?:VIII|VII|VI|IV|IX|X|V|III|II|I)\.\d+\b/g;

let procesador: Promise<MarkdownRenderer> | undefined;

/**
 * Convierte Markdown en línea (los textos del índice) en HTML, y enlaza cada capítulo que nombra («II.5»),
 * salvo dentro del código, donde un «II.5» es código y no una referencia.
 */
export async function enLinea(md: string): Promise<string> {
  const existentes = new Set(todosLosCapitulos(obra()).map((c) => c.id));
  const conEnlaces = md
    .split(/(`[^`]*`)/)
    .map((trozo, i) =>
      i % 2 === 1 ? trozo : trozo.replace(REFERENCIA, (id) => (existentes.has(id) ? `[${id}](${urlCapitulo(id)})` : id)),
    )
    .join('');
  procesador ??= createMarkdownProcessor({ syntaxHighlight: false });
  const { code } = await (await procesador).render(conEnlaces);
  return code.trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}

/** «1.234»: los números grandes con punto de miles, como en la especificación. */
export function numero(n: number): string {
  return n.toLocaleString('es-ES', { useGrouping: 'always' });
}
