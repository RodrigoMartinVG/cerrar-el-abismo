/**
 * LA DENSIDAD DE UN CAPÍTULO (guía de estilo, sección 6; hoja de ruta, A2). La revisión del Tomo I encontró que los
 * capítulos trataban sus temas en mucho menos espacio que los libros de referencia, y que lo que faltaba eran ejemplos,
 * contraejemplos y figuras. Estas medidas lo hacen visible capítulo por capítulo, frente a unas metas. Las cuenta
 * `npm run densidad`; lo que no se puede contar, como un caso hecho a mano antes de cada definición, lo mira la lectura
 * de estilo.
 */

export interface Densidad {
  /** Palabras del capítulo sin el frontmatter, y las del Desarrollo. */
  palabras: number;
  palabrasDesarrollo: number;
  /** Las páginas estimadas, a 300 palabras por página, como en la revisión. */
  paginasEstimadas: number;
  definiciones: number;
  resultados: number;
  ejemplos: number;
  /** Los ejemplos que muestran dónde termina una definición o un teorema. */
  contraejemplos: number;
  figuras: number;
  celdas: number;
  ejercicios: number;
}

export interface Meta {
  nombre: string;
  valor: string;
  cumple: boolean;
}

/** Las metas de un capítulo (hoja de ruta, A3, decisión del autor del 2026-11-22). */
export const METAS = {
  /** Al menos un ejemplo por cada definición del Desarrollo. */
  ejemplosPorDefinicion: 1,
  /** Al menos dos contraejemplos por capítulo. */
  contraejemplos: 2,
  /** Al menos una figura interactiva. */
  figuras: 1,
  /** De 15 a 20 ejercicios. */
  ejercicios: 15,
  /** Al menos el 85 % de las páginas previstas en el índice. */
  extension: 0.85,
} as const;

const palabras = (texto: string) => texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g)?.length ?? 0;

/** El título de un ejemplo que es un contraejemplo lo dice, con alguna de estas palabras. */
const CONTRAEJEMPLO = /contraejemplo|es falsa|es falso|no es |no son |no vale|no alcanza|falla|necesari/i;

/** Mide un capítulo a partir de su Markdown completo. */
export function medirDensidad(markdown: string): Densidad {
  const cuerpo = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const inicio = cuerpo.search(/^## Desarrollo$/m);
  const fin = cuerpo.search(/^## Cálculo$/m);
  const desarrollo = inicio >= 0 && fin > inicio ? cuerpo.slice(inicio, fin) : '';
  const cuenta = (texto: string, patron: RegExp) => texto.match(patron)?.length ?? 0;
  const titulosDeEjemplos = [...desarrollo.matchAll(/^:::ejemplo(?:\[([^\]]*)\])?/gm)].map((m) => m[1] ?? '');
  const total = palabras(cuerpo);
  return {
    palabras: total,
    palabrasDesarrollo: palabras(desarrollo),
    paginasEstimadas: Math.round(total / 300),
    definiciones: cuenta(desarrollo, /^:::definicion\b/gm),
    resultados: cuenta(desarrollo, /^:::(?:teorema|proposicion|lema|corolario)\b/gm),
    ejemplos: titulosDeEjemplos.length,
    contraejemplos: titulosDeEjemplos.filter((t) => CONTRAEJEMPLO.test(t)).length,
    figuras: cuenta(cuerpo, /^::figura\b/gm),
    celdas: cuenta(cuerpo, /^```python celda$/gm),
    ejercicios: cuenta(cuerpo, /^:::ejercicio\b/gm),
  };
}

/** Compara las medidas con las metas; `paginasPrevistas` es la extensión del capítulo en el índice. */
export function evaluarDensidad(d: Densidad, paginasPrevistas: number): Meta[] {
  return [
    {
      nombre: 'ejemplos por definición',
      valor: `${d.ejemplos} / ${d.definiciones}`,
      cumple: d.ejemplos >= METAS.ejemplosPorDefinicion * d.definiciones,
    },
    { nombre: 'contraejemplos', valor: String(d.contraejemplos), cumple: d.contraejemplos >= METAS.contraejemplos },
    { nombre: 'figuras', valor: String(d.figuras), cumple: d.figuras >= METAS.figuras },
    { nombre: 'ejercicios', valor: String(d.ejercicios), cumple: d.ejercicios >= METAS.ejercicios },
    {
      nombre: 'extensión',
      valor: `${d.paginasEstimadas} de ${paginasPrevistas} págs.`,
      cumple: d.paginasEstimadas >= METAS.extension * paginasPrevistas,
    },
  ];
}
