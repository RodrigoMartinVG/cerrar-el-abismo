import { ejerciciosDelCapitulo } from './ejercicios.ts';

/**
 * LA DENSIDAD Y EL EQUILIBRIO DE UN CAPÍTULO (guía de estilo, sección 6). La revisión del Tomo I encontró que los
 * capítulos decían en una página lo que los libros dicen en cuatro; la fase D los llevó a sus metas, y la medición de
 * después mostró el problema opuesto: las metas eran solo pisos, y los capítulos crecieron hasta el tope, con
 * contraejemplos que solo lo eran de nombre y ejercicios casi todos de demostrar. Por eso cada meta es ahora un rango
 * o una proporción. Las cuenta `npm run densidad`; lo que no se puede contar lo mira la lectura de estilo.
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
  /** Los ejemplos marcados `{.contraejemplo}`: los que muestran dónde termina un resultado. */
  contraejemplos: number;
  /** La racha más larga de bloques seguidos del Desarrollo (entornos, fórmulas, código, figuras) sin una frase entre ellos. */
  rachaSinProsa: number;
  /** Las palabras del ejemplo más largo. */
  ejemploMasLargo: number;
  figuras: number;
  celdas: number;
  ejercicios: number;
  /** Los ejercicios por tipo y por nivel (decisión 0006). */
  porTipo: Record<string, number>;
  porNivel: Record<string, number>;
}

export interface Meta {
  nombre: string;
  valor: string;
  cumple: boolean;
}

/** Las metas de un capítulo, con su porqué en la guía de estilo, sección 6. */
export const METAS = {
  /** Al menos un ejemplo por cada definición del Desarrollo. */
  ejemplosPorDefinicion: 1,
  /** A lo sumo tres bloques seguidos sin una frase que los una: más se lee como una lista, no como un libro. */
  rachaSinProsa: 3,
  /** Un ejemplo de más palabras que esto es una sección: se parte o se pasa al texto. */
  ejemploMasLargo: 400,
  /** Al menos dos contraejemplos marcados. */
  contraejemplos: 2,
  /** Al menos una figura interactiva. */
  figuras: 1,
  /** De 15 a 20 ejercicios. */
  ejercicios: [15, 20],
  /** Los de demostrar, a lo sumo el 60 %; al menos tres de cálculo, uno de exploración y uno de traducción. */
  demostracionesMaximas: 0.6,
  calculos: 3,
  exploraciones: 1,
  traducciones: 1,
  /** Al menos tres de nivel 1 y dos de nivel 3. */
  nivel1: 3,
  nivel3: 2,
  /** Entre el 90 % y el 115 % de las páginas previstas en el índice, y nunca más de 52. */
  extension: [0.9, 1.15],
  paginasMaximas: 52,
} as const;

const palabras = (texto: string) => texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g)?.length ?? 0;

/**
 * La racha más larga de bloques seguidos sin un párrafo de prosa entre ellos. Una demostración o una solución se
 * cuentan con el resultado o el ejercicio que las precede.
 */
function rachaSinProsa(texto: string): number {
  const lineas = texto.split('\n');
  let mejor = 0;
  let actual = 0;
  for (let k = 0; k < lineas.length; k++) {
    const linea = lineas[k]!;
    const entorno = /^:::([a-z]+)/.exec(linea);
    if (entorno) {
      let profundidad = 1;
      while (++k < lineas.length && profundidad > 0) {
        if (/^:::[a-z]/.test(lineas[k]!)) profundidad++;
        else if (lineas[k]!.trim() === ':::') profundidad--;
      }
      k--;
      if (entorno[1] !== 'demostracion' && entorno[1] !== 'solucion') mejor = Math.max(mejor, ++actual);
    } else if (/^(\$\$|```)/.test(linea)) {
      const valla = linea.slice(0, 3);
      while (++k < lineas.length && !lineas[k]!.startsWith(valla));
      mejor = Math.max(mejor, ++actual);
    } else if (/^::figura/.test(linea)) mejor = Math.max(mejor, ++actual);
    else if (linea.trim() !== '') actual = 0;
  }
  return mejor;
}

/** Mide un capítulo a partir de su Markdown completo. */
export function medirDensidad(markdown: string): Densidad {
  const cuerpo = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const inicio = cuerpo.search(/^## Desarrollo$/m);
  const fin = cuerpo.search(/^## Cálculo$/m);
  const desarrollo = inicio >= 0 && fin > inicio ? cuerpo.slice(inicio, fin) : '';
  const cuenta = (texto: string, patron: RegExp) => texto.match(patron)?.length ?? 0;
  const ejemplos = [...desarrollo.matchAll(/^:::ejemplo(?:\[[^\]]*\])?(\{[^\n]*\})?\n([\s\S]*?)^:::$/gm)];
  const ejercicios = ejerciciosDelCapitulo(markdown);
  const sumar = (clave: 'tipo' | 'nivel') =>
    ejercicios.reduce<Record<string, number>>((r, e) => {
      const k = e.atributos[clave] ?? '?';
      r[k] = (r[k] ?? 0) + 1;
      return r;
    }, {});
  const total = palabras(cuerpo);
  return {
    palabras: total,
    palabrasDesarrollo: palabras(desarrollo),
    paginasEstimadas: Math.round(total / 300),
    definiciones: cuenta(desarrollo, /^:::definicion\b/gm),
    resultados: cuenta(desarrollo, /^:::(?:teorema|proposicion|lema|corolario)\b/gm),
    ejemplos: ejemplos.length,
    contraejemplos: ejemplos.filter((m) => /\.contraejemplo\b/.test(m[1] ?? '')).length,
    rachaSinProsa: rachaSinProsa(desarrollo),
    ejemploMasLargo: Math.max(0, ...ejemplos.map((m) => palabras(m[2]!))),
    figuras: cuenta(cuerpo, /^::figura\b/gm),
    celdas: cuenta(cuerpo, /^```python celda$/gm),
    ejercicios: ejercicios.length,
    porTipo: sumar('tipo'),
    porNivel: sumar('nivel'),
  };
}

/** Compara las medidas con las metas; `paginasPrevistas` es la extensión del capítulo en el índice. */
export function evaluarDensidad(d: Densidad, paginasPrevistas: number): Meta[] {
  const tipo = (t: string) => d.porTipo[t] ?? 0;
  const nivel = (n: string) => d.porNivel[n] ?? 0;
  const [minimo, maximo] = METAS.extension;
  const [pocos, muchos] = METAS.ejercicios;
  return [
    {
      nombre: 'ejemplos por definición',
      valor: `${d.ejemplos} / ${d.definiciones}`,
      cumple: d.ejemplos >= METAS.ejemplosPorDefinicion * d.definiciones,
    },
    {
      nombre: 'bloques seguidos sin prosa',
      valor: String(d.rachaSinProsa),
      cumple: d.rachaSinProsa <= METAS.rachaSinProsa,
    },
    {
      nombre: 'ejemplo más largo',
      valor: `${d.ejemploMasLargo} pal.`,
      cumple: d.ejemploMasLargo <= METAS.ejemploMasLargo,
    },
    { nombre: 'contraejemplos', valor: String(d.contraejemplos), cumple: d.contraejemplos >= METAS.contraejemplos },
    { nombre: 'figuras', valor: String(d.figuras), cumple: d.figuras >= METAS.figuras },
    { nombre: 'ejercicios', valor: String(d.ejercicios), cumple: d.ejercicios >= pocos && d.ejercicios <= muchos },
    {
      nombre: 'mezcla de ejercicios',
      valor: `dem ${tipo('demostracion')} cal ${tipo('calculo')} exp ${tipo('exploracion')} tra ${tipo('traduccion')}`,
      cumple:
        tipo('demostracion') <= METAS.demostracionesMaximas * d.ejercicios &&
        tipo('calculo') >= METAS.calculos &&
        tipo('exploracion') >= METAS.exploraciones &&
        tipo('traduccion') >= METAS.traducciones,
    },
    {
      nombre: 'niveles',
      valor: `${nivel('1')} / ${nivel('2')} / ${nivel('3')}`,
      cumple: nivel('1') >= METAS.nivel1 && nivel('3') >= METAS.nivel3,
    },
    {
      nombre: 'extensión',
      valor: `${d.paginasEstimadas} de ${paginasPrevistas} págs.`,
      cumple:
        d.paginasEstimadas >= minimo * paginasPrevistas &&
        d.paginasEstimadas <= Math.min(maximo * paginasPrevistas, METAS.paginasMaximas),
    },
  ];
}
