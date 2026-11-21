/**
 * EL DICCIONARIO ACADEMIA–PRÁCTICA (especificación, 8.5; decisión 0004). Cada capítulo declara en su frontmatter los
 * términos que define, con lo que la práctica dice en su lugar:
 *
 *     diccionario:
 *       - termino: implicación
 *         ingles: implication
 *         practica: ['`!p || q`', 'el contrato de una función']
 *         nota: Casi ningún lenguaje tiene un operador para la implicación…
 *         ancla: def-implicacion
 *
 * y la página /diccionario/ reúne los de todos los capítulos. Aquí se comprueba cada entrada; que un término no se
 * repita en dos capítulos lo comprueban las pruebas de los capítulos, que ven la obra entera.
 */

export interface EntradaDelDiccionario {
  /** El término de la obra, en minúscula salvo que sea un nombre propio: «combinación afín». */
  termino: string;
  /** Su nombre académico en inglés: «affine combination». */
  ingles: string;
  /** Cómo se lo llama o se lo escribe en la práctica: «*lerp*», «`mix` en GLSL». Markdown en línea. */
  practica: string[];
  /** En qué coinciden los dos lados y dónde dejan de coincidir. Markdown en línea. */
  nota: string;
  /** La etiqueta del entorno del capítulo que define el término. */
  ancla?: string;
  /** Los campos de aplicación de los nombres prácticos, con las claves del índice. */
  campos?: string[];
}

const CLAVES = new Set(['termino', 'ingles', 'practica', 'nota', 'ancla', 'campos']);

const esTexto = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/** La forma en que se comparan dos términos: sin mayúsculas ni tildes. */
export function claveDeTermino(termino: string): string {
  return termino
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim();
}

/**
 * Revisa el campo `diccionario` de un capítulo. `texto` es el archivo completo del capítulo, para comprobar las anclas,
 * y `campos`, las claves de campo del índice. Devuelve los problemas en palabras; una lista vacía quiere decir que el
 * campo está bien.
 */
export function revisarDiccionario(diccionario: unknown, texto: string, campos: readonly string[]): string[] {
  if (diccionario === undefined || (Array.isArray(diccionario) && diccionario.length === 0))
    return ['El capítulo no agrega términos al diccionario: todo capítulo declara los suyos (especificación, 16.2).'];
  if (!Array.isArray(diccionario)) return ['«diccionario» tiene que ser una lista de entradas.'];
  const problemas: string[] = [];
  const vistos = new Set<string>();
  diccionario.forEach((entrada: unknown, i) => {
    const nombre = `La entrada ${i + 1} del diccionario`;
    if (typeof entrada !== 'object' || entrada === null) {
      problemas.push(`${nombre} no es un objeto con «termino», «ingles», «practica» y «nota».`);
      return;
    }
    const e = entrada as Record<string, unknown>;
    const quien = esTexto(e.termino) ? `«${e.termino}»` : nombre;
    for (const clave of Object.keys(e))
      if (!CLAVES.has(clave)) problemas.push(`${quien}: «${clave}» no es un campo de las entradas.`);
    for (const clave of ['termino', 'ingles', 'nota'] as const)
      if (!esTexto(e[clave])) problemas.push(`${quien} no tiene «${clave}».`);
    if (!Array.isArray(e.practica) || e.practica.length === 0 || !e.practica.every(esTexto))
      problemas.push(`${quien}: «practica» tiene que ser una lista con al menos un nombre de la práctica.`);
    const textos = [e.termino, e.ingles, e.nota, ...(Array.isArray(e.practica) ? e.practica : [])];
    if (textos.some((t) => typeof t === 'string' && t.includes('$')))
      problemas.push(`${quien} tiene una fórmula: el diccionario va sin fórmulas (los símbolos Unicode, como ℝ, sirven).`);
    if (e.ancla !== undefined) {
      if (!esTexto(e.ancla)) problemas.push(`${quien}: «ancla» tiene que ser una etiqueta.`);
      else if (!new RegExp(`\\{#${e.ancla.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s}]`).test(texto))
        problemas.push(`${quien}: el capítulo no tiene la etiqueta «${e.ancla}».`);
    }
    if (e.campos !== undefined) {
      if (!Array.isArray(e.campos)) problemas.push(`${quien}: «campos» tiene que ser una lista.`);
      else
        for (const c of e.campos)
          if (!campos.includes(c as string)) problemas.push(`${quien}: «${String(c)}» no es un campo del índice.`);
    }
    if (esTexto(e.termino)) {
      const clave = claveDeTermino(e.termino);
      if (vistos.has(clave)) problemas.push(`${quien} aparece dos veces.`);
      vistos.add(clave);
    }
  });
  return problemas;
}
