/**
 * LO QUE UN CAPÍTULO DA POR CONOCIDO (guía de estilo, sección 1: «Las licencias, declaradas»). Un capítulo puede usar una noción antes de que
 * la obra la construya: los números reales en I.1, por ejemplo. Lo declara en su frontmatter,
 *
 *     supone:
 *       - nocion: los números reales, la raíz cuadrada y el valor absoluto
 *         en: I.11
 *
 * y la capa de libro lo muestra en un recuadro al comienzo del Desarrollo. La regla que se comprueba aquí es la que
 * distingue un uso anticipado de un requisito: el capítulo que trata la noción con rigor viene *después* en el orden
 * de lectura. Si viniera antes, no sería una licencia sino un requisito, y su lugar es `requiere` en el índice.
 */

export interface Supuesto {
  /** La noción, como la nombraría el texto: «los números reales, la raíz cuadrada y el valor absoluto». */
  nocion: string;
  /** El capítulo que la trata con todo rigor («I.11»). */
  en: string;
}

/**
 * Revisa el campo `supone` de un capítulo. `orden` es la lista de todos los capítulos de la obra en el orden de
 * lectura. Devuelve los problemas, en palabras; una lista vacía quiere decir que el campo está bien.
 */
export function revisarSupone(supone: unknown, capitulo: string, orden: readonly string[]): string[] {
  if (supone === undefined) return [];
  if (!Array.isArray(supone)) return ['«supone» tiene que ser una lista de entradas con «nocion» y «en».'];
  const lugar = orden.indexOf(capitulo);
  const problemas: string[] = [];
  supone.forEach((entrada: unknown, i) => {
    const s = entrada as Partial<Supuesto> | null;
    const n = i + 1;
    if (typeof s?.nocion !== 'string' || s.nocion.trim() === '') {
      problemas.push(`La entrada ${n} de «supone» no tiene «nocion».`);
      return;
    }
    if (typeof s.en !== 'string') {
      problemas.push(`«${s.nocion}» no dice en qué capítulo se trata con rigor («en: I.11»).`);
      return;
    }
    const destino = orden.indexOf(s.en);
    if (destino === -1) problemas.push(`«${s.nocion}»: ${s.en} no es un capítulo de la obra.`);
    else if (lugar !== -1 && destino <= lugar)
      problemas.push(
        `«${s.nocion}»: ${s.en} no viene después de ${capitulo}. Una noción que se trata antes no es un uso anticipado sino un requisito: va en «requiere», en el índice.`,
      );
  });
  return problemas;
}
