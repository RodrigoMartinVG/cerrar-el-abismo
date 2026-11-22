/**
 * LA TERMINOLOGÍA DE LA OBRA (guía de estilo, sección 7). Un concepto con varios nombres en español tiene uno solo en
 * la obra; el registro (`ortografia/terminologia.yaml`) dice cuál, qué variantes usan otros libros y qué formas la obra
 * no usa:
 *
 *     - termino: coclase
 *       ingles: coset
 *       variantes:
 *         - forma: clase lateral
 *           uso: en España y en muchas traducciones
 *       rechazar: [clase lateral, clases laterales]
 *
 * Aquí se comprueba que el registro esté bien escrito y se buscan las formas rechazadas en un texto. Una forma se puede
 * nombrar sin usarla: entre comillas latinas («campo finito»), en el código y en las fórmulas no cuenta.
 */

export interface Variante {
  forma: string;
  /** Dónde se usa: una región, una tradición, un campo. */
  uso: string;
}

export interface Termino {
  termino: string;
  ingles: string;
  variantes: Variante[];
  /** Las formas que la obra no usa; pueden faltar si la variante es legítima en otro sentido. */
  rechazar?: string[];
  nota?: string;
}

export interface UsoRechazado {
  forma: string;
  /** El término que la obra usa en su lugar. */
  termino: string;
  linea: number;
}

const esTexto = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';

/** Revisa el registro y devuelve sus problemas en palabras. */
export function revisarRegistroDeTerminologia(datos: unknown): string[] {
  if (!Array.isArray(datos)) return ['El registro de terminología es una lista de términos.'];
  const problemas: string[] = [];
  const vistos = new Map<string, string>();
  datos.forEach((t: Partial<Termino> | null, i) => {
    const donde = esTexto(t?.termino) ? `«${t.termino}»` : `El término ${i + 1}`;
    if (!esTexto(t?.termino) || !esTexto(t?.ingles)) problemas.push(`${donde} necesita «termino» e «ingles».`);
    if (
      !Array.isArray(t?.variantes) ||
      t.variantes.length === 0 ||
      !t.variantes.every((v: Partial<Variante>) => esTexto(v?.forma) && esTexto(v?.uso))
    )
      problemas.push(`${donde} necesita al menos una variante, con «forma» y «uso».`);
    if (t?.rechazar !== undefined && !(Array.isArray(t.rechazar) && t.rechazar.every(esTexto)))
      problemas.push(`${donde}: «rechazar» es una lista de formas.`);
    if (t?.nota !== undefined && !esTexto(t.nota)) problemas.push(`${donde}: «nota», si está, es un texto.`);
    for (const forma of [t?.termino, ...(t?.rechazar ?? [])].filter(esTexto)) {
      const clave = forma.toLowerCase();
      const otro = vistos.get(clave);
      if (otro !== undefined && otro !== t?.termino) problemas.push(`«${forma}» aparece en «${otro}» y en «${t?.termino}».`);
      vistos.set(clave, t?.termino ?? '');
    }
    for (const forma of (t?.rechazar ?? []).filter(esTexto))
      if (forma.toLowerCase() === t?.termino?.toLowerCase()) problemas.push(`${donde} no puede rechazarse a sí mismo.`);
  });
  return problemas;
}

/**
 * Borra lo que no cuenta como uso, conservando los saltos de línea para que los números de línea sigan valiendo: el
 * código (bloques y en línea), las fórmulas y lo que está entre comillas latinas.
 */
function soloLaProsa(texto: string): string {
  const blanco = (s: string) => s.replace(/[^\n]/g, ' ');
  return texto
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, blanco)
    .replace(/\$\$[\s\S]*?\$\$/g, blanco)
    .replace(/`[^`\n]*`/g, blanco)
    .replace(/\$[^$\n]*\$/g, blanco)
    .replace(/«[^»]*»/g, blanco);
}

/** Las formas rechazadas que un texto usa, con su línea. */
export function usosRechazados(texto: string, registro: readonly Termino[]): UsoRechazado[] {
  const prosa = soloLaProsa(texto);
  const usos: UsoRechazado[] = [];
  for (const { termino, rechazar = [] } of registro)
    for (const forma of rechazar) {
      const patron = new RegExp(
        `(?<![\\p{L}\\p{N}])${forma.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')}(?![\\p{L}\\p{N}])`,
        'giu',
      );
      for (const m of prosa.matchAll(patron)) usos.push({ forma, termino, linea: prosa.slice(0, m.index).split('\n').length });
    }
  return usos.sort((a, b) => a.linea - b.linea);
}
