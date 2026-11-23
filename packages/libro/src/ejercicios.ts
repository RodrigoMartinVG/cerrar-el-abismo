import GithubSlugger from 'github-slugger';
import { leerNumero } from './respuestas.ts';

/**
 * LOS EJERCICIOS (especificación, 10; decisión 0006). Cada ejercicio dice su dificultad, su tipo y la sección del
 * capítulo a la que corresponde, con atributos de la directiva:
 *
 *     :::ejercicio{#ej-cumpleanos nivel=2 tipo=calculo seccion="combinaciones-y-coeficientes-binomiales" respuesta=23}
 *
 * Los tipos: demostrar, construir (un ejemplo o un contraejemplo, o encontrar el error de un argumento), calcular,
 * explorar con una figura o una celda, traducir entre la obra y la práctica, y los proyectos que combinan capítulos.
 *
 * Los de cálculo llevan además su `respuesta`, que el lector comprueba en el navegador, y pueden llevar una
 * `comprobacion`, una expresión de Python que las pruebas evalúan para confirmar que la respuesta es la correcta. Los
 * impares tienen solución, y los pares no (decisión del autor, 2026-11-22).
 */

export const NIVELES = { '1': 'rutina', '2': 'pide una idea', '3': 'desafío' } as const;
export const TIPOS = {
  demostracion: 'Demostración',
  construccion: 'Construcción',
  calculo: 'Cálculo',
  exploracion: 'Exploración',
  traduccion: 'Traducción',
  proyecto: 'Proyecto',
} as const;
export type Nivel = keyof typeof NIVELES;
export type Tipo = keyof typeof TIPOS;

/** Los atributos de una directiva escritos entre llaves: `{#id clave=valor clave="valor con espacios"}`. */
export function leerAtributos(llaves: string): Record<string, string> {
  const atributos: Record<string, string> = {};
  for (const m of llaves.matchAll(/#([\w-]+)|([\w-]+)=(?:"([^"]*)"|([^\s}"]+))/g)) {
    if (m[1]) atributos['id'] = m[1];
    else atributos[m[2]!] = m[3] ?? m[4] ?? '';
  }
  return atributos;
}

/**
 * Las secciones a las que puede corresponder un ejercicio: los títulos `###` del Desarrollo y las secciones `##` de
 * Cálculo, Puente y Aplicaciones, con el identificador que les da el sitio (el mismo algoritmo de GitHub que usa
 * Astro). Devuelve un mapa del identificador al título.
 */
export function seccionesDelCapitulo(markdown: string): Map<string, string> {
  const slugger = new GithubSlugger();
  const secciones = new Map<string, string>();
  const cuerpo = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  let enCodigo = false;
  for (const linea of cuerpo.split('\n')) {
    if (/^```/.test(linea)) enCodigo = !enCodigo;
    if (enCodigo) continue;
    const m = /^(#{2,6}) (.+)$/.exec(linea);
    if (!m) continue;
    const titulo = m[2]!.trim();
    const id = slugger.slug(titulo.replace(/[*_`]/g, ''));
    if (m[1] === '###' || ['Cálculo', 'Puente', 'Aplicaciones'].includes(titulo)) secciones.set(id, titulo);
  }
  return secciones;
}

/**
 * Un ejercicio tal como aparece en el Markdown: sus atributos, su número y si lo sigue una solución. Los proyectos
 * (`tipo=proyecto`) se numeran aparte, «Proyecto I.8.1», y van al final de los Ejercicios (decisión 0006).
 */
export interface EjercicioEscrito {
  numero: number;
  proyecto: boolean;
  linea: number;
  atributos: Record<string, string>;
  conSolucion: boolean;
  /** El enunciado, tal como está en el Markdown. */
  enunciado: string;
  /** Si el texto del capítulo, fuera de los ejercicios, lo cita: entonces completa algo que el texto deja. */
  citadoPorElTexto: boolean;
}

export function ejerciciosDelCapitulo(markdown: string): EjercicioEscrito[] {
  const lineas = markdown.split('\n');
  const ejercicios: EjercicioEscrito[] = [];
  const inicioDeLosEjercicios = markdown.search(/^## Ejercicios$/m);
  const texto = inicioDeLosEjercicios >= 0 ? markdown.slice(0, inicioDeLosEjercicios) : markdown;
  for (let i = 0; i < lineas.length; i++) {
    const m = /^:::ejercicio(\{.*\})?\s*$/.exec(lineas[i]!);
    if (!m) continue;
    let j = i + 1;
    while (j < lineas.length && lineas[j] !== ':::') j++;
    let k = j + 1;
    while (k < lineas.length && lineas[k]!.trim() === '') k++;
    const atributos = leerAtributos(m[1] ?? '');
    const proyecto = atributos['tipo'] === 'proyecto';
    ejercicios.push({
      numero: ejercicios.filter((e) => e.proyecto === proyecto).length + 1,
      proyecto,
      linea: i + 1,
      atributos,
      conSolucion: /^:::solucion\b/.test(lineas[k] ?? ''),
      enunciado: lineas.slice(i + 1, j).join('\n'),
      citadoPorElTexto: atributos['id'] !== undefined && texto.includes(`:ref[${atributos['id']}]`),
    });
  }
  return ejercicios;
}

/** Los problemas de los ejercicios de un capítulo, como mensajes; una lista vacía si no hay ninguno. */
export function revisarEjercicios(markdown: string): string[] {
  const secciones = seccionesDelCapitulo(markdown);
  const problemas: string[] = [];
  let despuesDeUnProyecto = false;
  for (const { numero, proyecto, linea, atributos, conSolucion, enunciado, citadoPorElTexto } of ejerciciosDelCapitulo(
    markdown,
  )) {
    const donde = `${proyecto ? 'Proyecto' : 'Ejercicio'} ${numero} (línea ${linea})`;
    const { nivel, tipo, seccion, respuesta } = atributos;
    if (!nivel || !(nivel in NIVELES)) problemas.push(`${donde}: falta «nivel», que es 1, 2 o 3.`);
    if (!tipo || !(tipo in TIPOS)) problemas.push(`${donde}: falta «tipo», que es uno de ${Object.keys(TIPOS).join(', ')}.`);
    if (!seccion) problemas.push(`${donde}: falta «seccion», el identificador de la sección a la que corresponde.`);
    else if (!secciones.has(seccion))
      problemas.push(`${donde}: la sección «${seccion}» no existe; las posibles son ${[...secciones.keys()].join(', ')}.`);
    if (tipo === 'calculo' && respuesta === undefined) problemas.push(`${donde}: un ejercicio de cálculo lleva su «respuesta».`);
    if (tipo === 'exploracion' && !/:ref\[fig-|celda|figura/i.test(enunciado))
      problemas.push(`${donde}: un ejercicio de exploración usa una figura (con :ref[fig-…]) o una celda, y lo dice.`);
    if (respuesta !== undefined && !leerNumero(respuesta))
      problemas.push(`${donde}: la respuesta «${respuesta}» no es un número, una fracción ni un decimal.`);
    // Las soluciones: las de los impares, y las de los que el texto cita, que completan algo que el texto deja y el
    // lector tiene que poder comprobar sin un profesor. Los pares que el texto no cita no la tienen. Los proyectos
    // quedan fuera de la paridad: su enunciado los guía por pasos, y la solución es optativa.
    if (proyecto) despuesDeUnProyecto = true;
    else {
      if (despuesDeUnProyecto) problemas.push(`${donde}: va después de un proyecto, y los proyectos van al final.`);
      if (citadoPorElTexto && !conSolucion) problemas.push(`${donde}: el texto lo cita, así que lleva su solución.`);
      else if (numero % 2 === 1 && !conSolucion) problemas.push(`${donde}: es impar y no tiene solución.`);
      if (numero % 2 === 0 && conSolucion && !citadoPorElTexto)
        problemas.push(`${donde}: es par, el texto no lo cita, y tiene solución.`);
    }
  }
  return problemas;
}
