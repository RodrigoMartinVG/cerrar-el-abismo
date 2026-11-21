import { ENTORNOS } from './entornos.ts';

/**
 * LAS ETIQUETAS DE UN CAPÍTULO, para citarlas desde otro: `:ref[I.1#teo-de-morgan]` escribe «Teorema I.1.5» con un
 * enlace. Cada capítulo se procesa por separado, así que el nombre numerado de una etiqueta ajena se calcula leyendo
 * el Markdown del otro capítulo, línea por línea, con las mismas reglas de numeración que el plugin (remark-libro.ts):
 * un contador común para los resultados, uno para los ejercicios y otro para las figuras. Las pruebas comprueban que
 * los dos cálculos coinciden.
 */
export function etiquetasDelCapitulo(markdown: string, capitulo: string): Map<string, string> {
  const etiquetas = new Map<string, string>();
  const contadores = { resultados: 0, ejercicios: 0, figuras: 0 };
  let cerco: string | undefined;
  for (const linea of markdown.split('\n')) {
    // Lo que está dentro de un bloque de código no es una directiva. Un bloque se cierra con una valla del mismo
    // carácter y al menos igual de larga, como en CommonMark.
    const valla = /^\s*(`{3,}|~{3,})/.exec(linea)?.[1];
    if (valla && cerco === undefined) {
      cerco = valla;
      continue;
    }
    if (cerco !== undefined) {
      if (valla && valla[0] === cerco[0] && valla.length >= cerco.length && linea.trim() === valla) cerco = undefined;
      continue;
    }

    const id = /\{#([\w-]+)/.exec(linea)?.[1];
    const bloque = /^:::([a-z]+)/.exec(linea);
    if (bloque) {
      const entorno = ENTORNOS[bloque[1]!];
      if (!entorno?.contador) continue;
      const nombre = `${entorno.nombre} ${capitulo}.${++contadores[entorno.contador]}`;
      if (id) etiquetas.set(id, nombre);
    } else if (/^::figura\b/.test(linea)) {
      const nombre = `Figura ${capitulo}.${++contadores.figuras}`;
      if (id) etiquetas.set(id, nombre);
    }
  }
  return etiquetas;
}
