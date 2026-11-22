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
  /** Entre los que el texto no cita, los de demostrar y el total. */
  demostracionesLibres: number;
  ejerciciosLibres: number;
  /** Los ejercicios de exploración que usan una figura. */
  exploracionesConFigura: number;
  /** La proporción de cada sección de la plantilla en el capítulo, de 0 a 1 (especificación, 7). */
  proporciones: Record<string, number>;
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
  /**
   * Entre los ejercicios que el texto no cita, los de demostrar son a lo sumo el 60 % (los que el texto cita completan
   * una demostración suya y no pueden cambiar de tipo); al menos tres de cálculo, uno de exploración, que use la figura
   * si el capítulo tiene una, y uno de traducción.
   */
  demostracionesMaximas: 0.6,
  calculos: 3,
  exploraciones: 1,
  traducciones: 1,
  /**
   * Las proporciones de la plantilla (especificación, 7), que el reporte muestra: el Desarrollo, el 45 %, y las
   * Aplicaciones, el 20 %. Las Aplicaciones de menos del 12 % se señalan, porque son el lado de la práctica.
   */
  aplicacionesSenaladas: 0.12,
  /** Al menos tres de nivel 1 y dos de nivel 3. */
  nivel1: 3,
  nivel3: 2,
  /**
   * Al menos el 90 % de las páginas previstas en el índice. No hay techo (decisión 0008): por encima del 115 % el
   * reporte lo señala, y la ronda crítica dice por qué cada sección lo necesita.
   */
  extension: 0.9,
  extensionSenalada: 1.15,
} as const;

const palabras = (texto: string) => texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g)?.length ?? 0;

/**
 * Las palabras que ocupan lugar en la página: el texto, el pie de las figuras y el código de las celdas, que se ven y
 * se imprimen, pero no el texto alternativo ni los atributos de las directivas. Una fórmula en el texto cuenta como una
 * palabra, para que los comandos de LaTeX no inflen la cuenta, y una fórmula aparte, como doce, porque ocupa dos o tres
 * renglones.
 */
function palabrasDeProsa(texto: string): number {
  return palabras(
    texto
      .replace(/\{[^{}\n]*(?:\{[^{}\n]*\}[^{}\n]*)*\}/g, ' ')
      .replace(/\$\$[\s\S]*?\$\$/g, ` ${'fórmula '.repeat(12)}`)
      .replace(/\$[^$\n]*\$/g, ' x '),
  );
}

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
    else if (linea.startsWith('|')) {
      // Una tabla es un bloque, no una frase.
      while (k + 1 < lineas.length && lineas[k + 1]!.startsWith('|')) k++;
      mejor = Math.max(mejor, ++actual);
    } else if (linea.trim() !== '') actual = 0;
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
  const total = palabrasDeProsa(cuerpo);
  const libres = ejercicios.filter((e) => !e.citadoPorElTexto);
  const proporciones: Record<string, number> = {};
  for (const [, titulo, texto] of cuerpo.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |(?![\s\S]))/gm))
    proporciones[titulo!] = palabrasDeProsa(texto!) / Math.max(1, total);
  return {
    palabras: total,
    palabrasDesarrollo: palabrasDeProsa(desarrollo),
    paginasEstimadas: Math.round(total / 300),
    definiciones: cuenta(desarrollo, /^:::definicion\b/gm),
    resultados: cuenta(desarrollo, /^:::(?:teorema|proposicion|lema|corolario)\b/gm),
    ejemplos: ejemplos.length,
    contraejemplos: ejemplos.filter((m) => /\.contraejemplo\b/.test(m[1] ?? '')).length,
    rachaSinProsa: rachaSinProsa(desarrollo),
    ejemploMasLargo: Math.max(0, ...ejemplos.map((m) => palabrasDeProsa(m[2]!))),
    figuras: cuenta(cuerpo, /^::figura\b/gm),
    celdas: cuenta(cuerpo, /^```python celda$/gm),
    ejercicios: ejercicios.length,
    porTipo: sumar('tipo'),
    demostracionesLibres: libres.filter((e) => e.atributos['tipo'] === 'demostracion').length,
    ejerciciosLibres: libres.length,
    proporciones,
    exploracionesConFigura: ejercicios.filter(
      (e) => e.atributos['tipo'] === 'exploracion' && /:ref\[fig-|figura/i.test(e.enunciado),
    ).length,
    porNivel: sumar('nivel'),
  };
}

/** Compara las medidas con las metas; `paginasPrevistas` es la extensión del capítulo en el índice. */
export function evaluarDensidad(d: Densidad, paginasPrevistas: number): Meta[] {
  const tipo = (t: string) => d.porTipo[t] ?? 0;
  const nivel = (n: string) => d.porNivel[n] ?? 0;
  const [pocos, muchos] = METAS.ejercicios;
  // Sin redondear: con páginas enteras, quitar una repetición podía bajar un capítulo del piso.
  const proporcion = d.palabras / 300 / paginasPrevistas;
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
      valor: `dem ${d.demostracionesLibres} de ${d.ejerciciosLibres} libres, con ${tipo('construccion')} y cal ${tipo('calculo')} exp ${tipo('exploracion')} (${d.exploracionesConFigura} con la figura) tra ${tipo('traduccion')}`,
      cumple:
        d.demostracionesLibres <= METAS.demostracionesMaximas * d.ejerciciosLibres &&
        tipo('calculo') >= METAS.calculos &&
        tipo('exploracion') >= METAS.exploraciones &&
        (d.figuras === 0 || d.exploracionesConFigura >= 1) &&
        tipo('traduccion') >= METAS.traducciones,
    },
    {
      nombre: 'niveles',
      valor: `${nivel('1')} / ${nivel('2')} / ${nivel('3')}`,
      cumple: nivel('1') >= METAS.nivel1 && nivel('3') >= METAS.nivel3,
    },
    {
      nombre: 'extensión',
      valor: `${d.paginasEstimadas} de ${paginasPrevistas} págs. (${Math.round(100 * proporcion)} %${
        proporcion > METAS.extensionSenalada ? ': la ronda crítica dice por qué' : ''
      })`,
      cumple: proporcion >= METAS.extension,
    },
  ];
}
