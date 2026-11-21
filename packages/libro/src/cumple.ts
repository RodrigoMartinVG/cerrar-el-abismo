/**
 * LO QUE UN CAPÍTULO CUMPLE (guía de capítulos; el mapa hacia atrás). Cuando un capítulo usa una noción antes de que
 * la obra la construya, la declara en su campo `supone`, con el capítulo que la trata con rigor: es una promesa. El
 * capítulo prometido, cuando se escribe, dice en su campo `cumple` en qué entornos la cumple:
 *
 *     cumple:
 *       - de: I.1
 *         nocion: los números enteros, su aritmética y su orden, la divisibilidad y las definiciones por recursión
 *         anclas: [teo-recursion, def-enteros, teo-enteros, def-divisibilidad]
 *
 * La noción se copia tal como está en el `supone` del otro capítulo, así que si una de las dos cambia, la prueba lo
 * señala. Aquí se comprueba que cada promesa tenga su cumplimiento, que cada cumplimiento responda a una promesa y que
 * las anclas existan.
 */

export interface Promesa {
  /** El capítulo que hizo la promesa en su `supone`. */
  de: string;
  nocion: string;
}

export interface Cumplimiento extends Promesa {
  /** Las etiquetas de los entornos del capítulo donde se cumple. */
  anclas: string[];
}

const esTexto = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/**
 * Revisa el campo `cumple` de un capítulo frente a las promesas que le hicieron los capítulos escritos. `texto` es el
 * archivo completo del capítulo, para comprobar las anclas. Devuelve los problemas en palabras.
 */
export function revisarCumple(cumple: unknown, texto: string, promesas: readonly Promesa[]): string[] {
  const lista = cumple ?? [];
  if (!Array.isArray(lista)) return ['«cumple» tiene que ser una lista de entradas con «de», «nocion» y «anclas».'];
  const problemas: string[] = [];
  const cumplidas: Cumplimiento[] = [];
  lista.forEach((entrada: unknown, i) => {
    const c = entrada as Partial<Cumplimiento> | null;
    if (
      !esTexto(c?.de) ||
      !esTexto(c?.nocion) ||
      !Array.isArray(c?.anclas) ||
      c.anclas.length === 0 ||
      !c.anclas.every(esTexto)
    ) {
      problemas.push(`La entrada ${i + 1} de «cumple» necesita «de», «nocion» y al menos una ancla.`);
      return;
    }
    for (const ancla of c.anclas)
      if (!new RegExp(`\\{#${ancla.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s}]`).test(texto))
        problemas.push(`«${c.nocion}» (de ${c.de}): el capítulo no tiene la etiqueta «${ancla}».`);
    cumplidas.push(c as Cumplimiento);
  });
  for (const p of promesas)
    if (!cumplidas.some((c) => c.de === p.de && c.nocion === p.nocion))
      problemas.push(
        `${p.de} dejó para este capítulo «${p.nocion}», y falta en «cumple»: hay que decir dónde se trata con rigor.`,
      );
  for (const c of cumplidas)
    if (!promesas.some((p) => p.de === c.de && p.nocion === c.nocion))
      problemas.push(
        `«${c.nocion}» no es ninguna noción que ${c.de} deje para este capítulo en su «supone»; si cambió allí, hay que copiarla de nuevo.`,
      );
  return problemas;
}
