import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';
import { cargarIndice, Grafo, referenciasA, slug, todosLosCapitulos, tomoDe, type Indice } from '@cerrar-el-abismo/indice';

/** El índice de la obra, leído una sola vez por construcción del sitio. */
let indice: Indice | undefined;
export function obra(): Indice {
  return (indice ??= cargarIndice());
}

/** El grafo de dependencias de la obra (packages/indice/src/grafo.ts), armado una sola vez. */
let grafoDeLaObra: Grafo | undefined;
export function grafo(): Grafo {
  return (grafoDeLaObra ??= new Grafo(obra()));
}

const raiz = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export function urlTomo(tomo: string): string {
  return `${raiz}indice/${slug(tomo)}/`;
}

/** Los capítulos ya escritos: un archivo por capítulo en src/content/docs/capitulos/, con el nombre «i-1.md». */
const escritos = new Set(
  Object.keys(import.meta.glob('/src/content/docs/capitulos/*.md')).map((ruta) => ruta.replace(/^.*\/([^/]+)\.md$/, '$1')),
);

export function estaEscrito(id: string): boolean {
  return escritos.has(slug(id));
}

/** El mapa de dependencias, o la página del recorrido hasta un capítulo. */
export function urlMapa(id?: string): string {
  return id ? `${raiz}mapa/${slug(id)}/` : `${raiz}mapa/`;
}

/** La entrada de un capítulo en la página de su tomo. */
export function urlEnIndice(id: string): string {
  return `${urlTomo(tomoDe(id))}#${slug(id)}`;
}

/** El capítulo escrito, o su entrada en el índice mientras no lo esté. */
export function urlCapitulo(id: string): string {
  return estaEscrito(id) ? `${raiz}capitulos/${slug(id)}/` : urlEnIndice(id);
}

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
      i % 2 === 1 ? trozo : trozo.replace(referenciasA(), (id) => (existentes.has(id) ? `[${id}](${urlEnIndice(id)})` : id)),
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

/** La clase de la etiqueta de un campo: la práctica (3D) en ámbar, la física en tinta, el resto neutro. */
export function claseDeCampo(etiqueta: string): string {
  return etiqueta === '3D' ? 'campo campo-3d' : etiqueta === 'Física' ? 'campo campo-fisica' : 'campo campo-otro';
}
