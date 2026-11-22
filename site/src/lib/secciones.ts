import { paginasDelCapitulo, type PaginaDelCapitulo } from '@cerrar-el-abismo/libro';

/**
 * LAS PÁGINAS DE CADA CAPÍTULO (decisión 0008). La fuente es un archivo por capítulo; el sitio lo muestra en varias
 * páginas, una por sección. Aquí se divide el HTML de un capítulo en esas páginas y se corrigen los enlaces a anclas,
 * para que cada uno apunte a la página donde está su destino, en el mismo capítulo o en otro.
 */

const raiz = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** El Markdown de cada capítulo escrito, por su nombre de archivo sin extensión («i-7»). */
const fuentes = import.meta.glob<string>('/src/content/docs/capitulos/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Las páginas de cada capítulo escrito, por su nombre de archivo. */
export const PAGINAS: ReadonlyMap<string, PaginaDelCapitulo[]> = new Map(
  Object.entries(fuentes).map(([ruta, texto]) => [ruta.replace(/^.*\/([^/]+)\.md$/, '$1'), paginasDelCapitulo(texto)]),
);

/** En qué página de su capítulo queda cada ancla: `ANCLAS.get('i-7')?.get('teo-lagrange')` es su tramo. */
const ANCLAS = new Map(
  [...PAGINAS].map(([capitulo, paginas]) => [
    capitulo,
    new Map(paginas.flatMap((p) => p.anclas.map((a) => [a, p.slug] as const))),
  ]),
);

/** La dirección de una página de un capítulo: `urlPagina('i-7', '')` es la portada. */
export function urlPagina(capitulo: string, pagina: string): string {
  return `${raiz}capitulos/${capitulo}/${pagina ? `${pagina}/` : ''}`;
}

/** La dirección de un ancla de un capítulo escrito, en la página que la contiene. */
export function urlAncla(capitulo: string, ancla: string): string {
  return `${urlPagina(capitulo, ANCLAS.get(capitulo)?.get(ancla) ?? '')}#${ancla}`;
}

const escaparRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Corrige los enlaces a anclas de un HTML para que apunten a la página que las contiene. `actual` es la página donde
 * va a quedar el HTML, si es de un capítulo; los enlaces a anclas de esa misma página quedan como están.
 */
export function corregirEnlaces(html: string, actual?: { capitulo: string; pagina: string }): string {
  const prefijo = escaparRegExp(`${raiz}capitulos/`);
  return html.replace(new RegExp(`href="(?:${prefijo}([a-z0-9-]+)/)?#([^"]+)"`, 'g'), (todo, otro, ancla) => {
    const capitulo = (otro as string | undefined) ?? actual?.capitulo;
    if (!capitulo) return todo;
    const id = decodeURIComponent(ancla as string);
    const pagina = ANCLAS.get(capitulo)?.get(id);
    if (pagina === undefined) return todo;
    if (actual && capitulo === actual.capitulo && pagina === actual.pagina) return `href="#${ancla as string}"`;
    return `href="${urlPagina(capitulo, pagina)}#${ancla as string}"`;
  });
}

/** El lugar donde empieza un título en el HTML, con el envoltorio que le agrega Starlight si lo tiene. */
function inicioDelTitulo(html: string, id: string): number {
  const titulo = html.search(new RegExp(`<h[2-6] id="${escaparRegExp(id)}"`));
  if (titulo < 0) return -1;
  const envoltorio = html.lastIndexOf('<div class="sl-heading-wrapper', titulo);
  return envoltorio >= 0 && html.slice(envoltorio, titulo).indexOf('</div>') < 0 ? envoltorio : titulo;
}

/** Quita del comienzo de un tramo de HTML los títulos que la página no repite. */
function sinTitulos(html: string, ids: readonly string[]): string {
  let resultado = html;
  for (const id of ids) {
    const inicio = inicioDelTitulo(resultado, id);
    if (inicio < 0) continue;
    const esEnvoltorio = resultado.startsWith('<div class="sl-heading-wrapper', inicio);
    const fin = esEnvoltorio
      ? resultado.indexOf('</div>', inicio) + '</div>'.length
      : resultado.indexOf('</h', inicio) + '</h3>'.length;
    resultado = resultado.slice(0, inicio) + resultado.slice(fin);
  }
  return resultado;
}

/** Divide el HTML de un capítulo en sus páginas, en el mismo orden que `PAGINAS`. */
export function dividir(html: string, paginas: readonly PaginaDelCapitulo[]): string[] {
  const cortes = paginas.map((p) => (p.desde ? inicioDelTitulo(html, p.desde) : 0));
  return paginas.map((p, i) => {
    const fin = cortes.slice(i + 1).find((c) => c > 0) ?? html.length;
    return sinTitulos(html.slice(Math.max(cortes[i]!, 0), fin), p.sinTitulo);
  });
}

/** Los títulos de un tramo de HTML, para el índice «En esta página» de una sección. */
export function titulosDe(html: string): { depth: number; slug: string; text: string }[] {
  return [...html.matchAll(/<h([2-4]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map((m) => ({
    depth: Number(m[1]),
    slug: m[2]!,
    text: m[3]!.replace(/<[^>]+>/g, ''),
  }));
}
