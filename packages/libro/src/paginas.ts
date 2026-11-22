import GithubSlugger from 'github-slugger';

/**
 * LAS PÁGINAS DE UN CAPÍTULO EN EL SITIO (decisión 0008). La fuente es un archivo por capítulo; el sitio lo divide en
 * una portada (Entrada y Motivación), una página por cada sección `###` del Desarrollo, y las páginas del Cálculo, del
 * Puente con las Aplicaciones, de la Salida, de los Ejercicios y de las Notas. Este módulo calcula esa división a partir
 * del Markdown, con los mismos identificadores de títulos que el sitio, y dice en qué página queda cada ancla.
 */

export interface PaginaDelCapitulo {
  /** El tramo de la dirección: '' para la portada, `subgrupos-y-el-teorema-de-lagrange` para una sección. */
  slug: string;
  titulo: string;
  /** El identificador del título donde empieza la página en el HTML; `undefined` para la portada. */
  desde?: string;
  /** Los títulos que la página no repite, porque su título ya los dice. */
  sinTitulo: string[];
  /** Las anclas que quedan en la página: las de los entornos y figuras, y las de los títulos. */
  anclas: string[];
}

/** El tramo de una dirección a partir del identificador de un título: sin tildes, para que se lea bien. */
export const tramo = (id: string) =>
  id
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]/g, '');

const ESPECIALES: Record<string, { slug: string; titulo: string }> = {
  Cálculo: { slug: 'calculo', titulo: 'Cálculo' },
  Puente: { slug: 'puente', titulo: 'Puente y aplicaciones' },
  Salida: { slug: 'salida', titulo: 'Salida' },
  Ejercicios: { slug: 'ejercicios', titulo: 'Ejercicios' },
  'Notas y «Para seguir»': { slug: 'notas', titulo: 'Notas y «Para seguir»' },
};

export function paginasDelCapitulo(markdown: string): PaginaDelCapitulo[] {
  const slugger = new GithubSlugger();
  const cuerpo = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const paginas: PaginaDelCapitulo[] = [{ slug: '', titulo: 'Entrada y motivación', sinTitulo: [], anclas: [] }];
  let actual = paginas[0]!;
  let enDesarrollo = false;
  let primeraDelDesarrollo = true;
  let valla: string | undefined;
  for (const linea of cuerpo.split('\n')) {
    const cerco = /^\s*(`{3,}|~{3,})/.exec(linea)?.[1];
    if (cerco && valla === undefined) {
      valla = cerco;
      continue;
    }
    if (valla !== undefined) {
      if (cerco && cerco[0] === valla[0] && cerco.length >= valla.length && linea.trim() === cerco) valla = undefined;
      continue;
    }
    const titulo = /^(#{2,6}) (.+)$/.exec(linea);
    if (titulo) {
      const texto = titulo[2]!.trim();
      const id = slugger.slug(texto.replace(/[*_`]/g, ''));
      const nivel = titulo[1]!.length;
      if (nivel === 2) {
        enDesarrollo = texto === 'Desarrollo';
        if (enDesarrollo) {
          // Una página provisoria, que la primera sección `###` adopta: así la introducción del Desarrollo y sus
          // anclas quedan con ella, y un Desarrollo sin secciones sigue teniendo su página.
          primeraDelDesarrollo = true;
          actual = { slug: tramo(id), titulo: texto, desde: id, sinTitulo: [id], anclas: [] };
          paginas.push(actual);
        } else if (ESPECIALES[texto]) {
          const { slug, titulo: nombre } = ESPECIALES[texto]!;
          actual = { slug, titulo: nombre, desde: id, sinTitulo: texto === 'Puente' ? [] : [id], anclas: [] };
          paginas.push(actual);
        }
      } else if (nivel === 3 && enDesarrollo) {
        if (primeraDelDesarrollo) {
          actual.slug = tramo(id);
          actual.titulo = texto.replace(/[*_`]/g, '');
          actual.sinTitulo.push(id);
        } else {
          actual = { slug: tramo(id), titulo: texto.replace(/[*_`]/g, ''), desde: id, sinTitulo: [id], anclas: [] };
          paginas.push(actual);
        }
        primeraDelDesarrollo = false;
      }
      actual.anclas.push(id);
      continue;
    }
    const ancla = /^:{2,3}[a-z]+[^\n]*\{[^}]*#([\w-]+)/.exec(linea)?.[1];
    if (ancla) actual.anclas.push(ancla);
  }
  return paginas;
}
