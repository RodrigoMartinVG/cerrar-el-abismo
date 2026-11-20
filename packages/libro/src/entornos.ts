/**
 * EL CONJUNTO CERRADO DE DIRECTIVAS (decisión 0001). Un capítulo solo puede usar estos entornos; cualquier otro
 * nombre hace fallar la construcción. Así la misma fuente se puede llevar a la web y, más adelante, al PDF.
 *
 * Los entornos numerados comparten un contador por capítulo («Definición II.5.1», «Teorema II.5.2»…), como en los
 * libros de matemática; los ejercicios llevan el suyo propio.
 */

export interface Entorno {
  /** El nombre que se muestra. */
  nombre: string;
  /** Qué contador usa, si se numera. */
  contador?: 'resultados' | 'ejercicios';
  /** La etiqueta HTML del entorno; por defecto, `section`. */
  html?: string;
  /** La etiqueta HTML del encabezado; por defecto, `p`. */
  htmlTitulo?: string;
  /** Si se cierra con «∎». */
  cierre?: boolean;
  /** Si, siendo plegable (`details`), empieza abierto. */
  abierto?: boolean;
}

export const ENTORNOS: Readonly<Record<string, Entorno>> = {
  axioma: { nombre: 'Axioma', contador: 'resultados' },
  definicion: { nombre: 'Definición', contador: 'resultados' },
  teorema: { nombre: 'Teorema', contador: 'resultados' },
  lema: { nombre: 'Lema', contador: 'resultados' },
  proposicion: { nombre: 'Proposición', contador: 'resultados' },
  corolario: { nombre: 'Corolario', contador: 'resultados' },
  ejemplo: { nombre: 'Ejemplo', contador: 'resultados' },
  observacion: { nombre: 'Observación', contador: 'resultados' },
  // Las demostraciones se pueden plegar (sección 7) y empiezan abiertas.
  demostracion: { nombre: 'Demostración', cierre: true, html: 'details', htmlTitulo: 'summary', abierto: true },
  ejercicio: { nombre: 'Ejercicio', contador: 'ejercicios' },
  solucion: { nombre: 'Solución', html: 'details', htmlTitulo: 'summary' },
  puente: { nombre: 'Puente', html: 'aside' },
  linea: { nombre: 'Una línea, un teorema', html: 'aside' },
};

/** Las directivas de bloque de Starlight (sus recuadros), que se dejan pasar. */
export const DIRECTIVAS_DE_STARLIGHT: ReadonlySet<string> = new Set(['note', 'tip', 'caution', 'danger']);
