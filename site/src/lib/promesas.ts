import { getCollection } from 'astro:content';
import { etiquetasDelCapitulo } from '@cerrar-el-abismo/libro';
import { grafo } from './obra';

/**
 * EL MAPA HACIA ATRÁS, para las páginas del mapa: lo que cada capítulo escrito deja para otro en su `supone` (las
 * promesas), dónde se cumple cada una según el `cumple` del capítulo prometido, y las menciones de capítulos
 * anteriores que no están en el recorrido de quien las hace. Las pruebas comprueban lo mismo (site/src/capitulos.test.ts).
 */

export interface PromesaEnElMapa {
  de: string;
  a: string;
  nocion: string;
  /** Dónde se cumple: la etiqueta y su nombre numerado («Teorema I.3.4»), si el capítulo prometido ya la cumple. */
  cumplida?: { ancla: string; nombre: string }[];
}

interface Escrito {
  id: string;
  cuerpo: string;
  supone: { nocion: string; en: string }[];
  cumple: { de: string; nocion: string; anclas: string[] }[];
}

let escritos: Promise<Map<string, Escrito>> | undefined;
function capitulosEscritos(): Promise<Map<string, Escrito>> {
  return (escritos ??= getCollection('docs', (e) => Boolean(e.data.capitulo)).then(
    (entradas) =>
      new Map(
        entradas.map((e) => [
          e.data.capitulo as string,
          { id: e.data.capitulo as string, cuerpo: e.body ?? '', supone: e.data.supone ?? [], cumple: e.data.cumple ?? [] },
        ]),
      ),
  ));
}

/** Todas las promesas de los capítulos escritos, en orden de lectura de quien las hace. */
export async function promesas(): Promise<PromesaEnElMapa[]> {
  const mapa = await capitulosEscritos();
  const lista: PromesaEnElMapa[] = [];
  for (const c of grafo().capitulos) {
    const escrito = mapa.get(c.id);
    if (!escrito) continue;
    for (const { nocion, en } of escrito.supone) {
      const destino = mapa.get(en);
      const cumplimiento = destino?.cumple.find((x) => x.de === c.id && x.nocion === nocion);
      const etiquetas = destino ? etiquetasDelCapitulo(destino.cuerpo, en) : new Map<string, string>();
      lista.push({
        de: c.id,
        a: en,
        nocion,
        ...(cumplimiento
          ? { cumplida: cumplimiento.anclas.map((ancla) => ({ ancla, nombre: etiquetas.get(ancla) ?? ancla })) }
          : {}),
      });
    }
  }
  return lista;
}

/** Los capítulos anteriores que un capítulo escrito menciona (`[[I.13]]` o `:ref[I.13#…]`) sin que estén en su recorrido. */
export async function mencionesFueraDelRecorrido(id: string): Promise<string[]> {
  const escrito = (await capitulosEscritos()).get(id);
  if (!escrito) return [];
  const g = grafo();
  const orden = g.capitulos.map((c) => c.id);
  const mencionados = new Set(
    [...escrito.cuerpo.matchAll(/\[\[([^\][]+)\]\]|:ref\[([^\]#]+)#/g)].map((m) => (m[1] ?? m[2]) as string),
  );
  return [...mencionados].filter(
    (x) => x !== id && orden.indexOf(x) !== -1 && orden.indexOf(x) < orden.indexOf(id) && !g.depende(id, x),
  );
}

/** Si el capítulo está escrito. */
export async function escrito(id: string): Promise<boolean> {
  return (await capitulosEscritos()).has(id);
}
