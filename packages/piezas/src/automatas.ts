/**
 * La matemática de la pieza «automata-finito» (I.13): autómatas finitos, deterministas o no, que leen una palabra
 * símbolo por símbolo; la clausura por transiciones ε, la construcción de subconjuntos y el algoritmo de Moore. Los
 * autómatas de la pieza son los del capítulo, cada uno con la posición de sus estados para dibujarlo.
 */

/** Una transición: desde un estado, con un símbolo (la cadena vacía es ε), hacia otro estado. */
export type Transicion = readonly [desde: string, simbolo: string, hacia: string];

/** Un grupo de símbolos que el dibujo y la tabla muestran juntos, como las diez cifras. */
export interface ClaseDeSimbolos {
  rotulo: string;
  simbolos: string;
}

export interface Automata {
  /** El identificador, que elige el atributo `data-automata` de la figura. */
  clave: string;
  /** El nombre que aparece en la lista de la pieza. */
  titulo: string;
  estados: readonly string[];
  /** Los símbolos, de un carácter cada uno. */
  alfabeto: readonly string[];
  inicial: string;
  finales: readonly string[];
  transiciones: readonly Transicion[];
  /** Las clases de símbolos para los rótulos y las columnas de la tabla; si falta, cada símbolo va solo. */
  clases?: readonly ClaseDeSimbolos[];
  /** La posición de cada estado en el dibujo, en unidades de unos cien píxeles, con la y hacia abajo. */
  posiciones: Readonly<Record<string, readonly [number, number]>>;
  /** La curvatura de algunos arcos, en píxeles, con la clave «p→q»; positiva hacia la izquierda del sentido del arco. */
  curvas?: Readonly<Record<string, number>>;
  /** El ángulo de los lazos, en grados, con la y hacia abajo: −90 es arriba (lo que se usa si falta) y 90, abajo. */
  lazos?: Readonly<Record<string, number>>;
  /** La palabra con la que empieza la pieza. */
  palabra: string;
}

/** El conjunto vacío de estados, como lo escribe la construcción de subconjuntos. */
export const VACIO = '∅';

/** El sumidero que se agrega al completar un autómata determinista, como en el capítulo. */
export const SUMIDERO = '⊥';

/** Un conjunto de estados escrito como en el capítulo, en el orden de los estados del autómata: «{0, 1}». */
export function escribirConjunto(a: Automata, conjunto: Iterable<string>): string {
  const S = new Set(conjunto);
  if (S.size === 0) return VACIO;
  return `{${a.estados.filter((q) => S.has(q)).join(', ')}}`;
}

/** Los estados a los que se llega desde `q` con el símbolo `simbolo` (la cadena vacía es ε). */
export function destinos(a: Automata, q: string, simbolo: string): string[] {
  return a.transiciones.filter(([p, s]) => p === q && s === simbolo).map(([, , r]) => r);
}

/** Un autómata es determinista si no tiene transiciones ε ni dos transiciones con el mismo estado y el mismo símbolo. */
export function esDeterminista(a: Automata): boolean {
  const vistos = new Set<string>();
  for (const [p, s] of a.transiciones) {
    if (s === '') return false;
    const clave = `${p} ${s}`;
    if (vistos.has(clave)) return false;
    vistos.add(clave);
  }
  return true;
}

/** Un autómata determinista es completo si tiene una transición para cada estado y cada símbolo. */
export function esCompleto(a: Automata): boolean {
  return esDeterminista(a) && a.estados.every((q) => a.alfabeto.every((s) => destinos(a, q, s).length === 1));
}

/** La clausura E(S): los estados a los que se llega desde S siguiendo solo transiciones ε, incluidos los de S. */
export function clausura(a: Automata, conjunto: Iterable<string>): Set<string> {
  const vistos = new Set(conjunto);
  const pila = [...vistos];
  while (pila.length > 0) {
    for (const r of destinos(a, pila.pop()!, ''))
      if (!vistos.has(r)) {
        vistos.add(r);
        pila.push(r);
      }
  }
  return vistos;
}

/** Un paso de la construcción de subconjuntos: E(⋃ Δ(q, símbolo) con q en S). */
export function avanzar(a: Automata, conjunto: Iterable<string>, simbolo: string): Set<string> {
  return clausura(
    a,
    [...conjunto].flatMap((q) => destinos(a, q, simbolo)),
  );
}

/** La lectura de una palabra, paso a paso. */
export interface Lectura {
  /** Los símbolos de la palabra. */
  simbolos: string[];
  /** El conjunto de estados posibles antes de leer nada y después de cada símbolo, en el orden de los estados. */
  conjuntos: string[][];
  /** La posición del primer símbolo que no está en el alfabeto, o −1. */
  fueraDelAlfabeto: number;
  acepta: boolean;
}

/** Lee una palabra con el autómata, determinista o no, siguiendo todos los paseos a la vez. */
export function leer(a: Automata, palabra: string): Lectura {
  const simbolos = [...palabra];
  const ordenar = (S: Set<string>) => a.estados.filter((q) => S.has(q));
  let actual = clausura(a, [a.inicial]);
  const conjuntos = [ordenar(actual)];
  let fueraDelAlfabeto = -1;
  for (const [i, s] of simbolos.entries()) {
    if (!a.alfabeto.includes(s)) {
      if (fueraDelAlfabeto < 0) fueraDelAlfabeto = i;
      actual = new Set();
    } else actual = avanzar(a, actual, s);
    conjuntos.push(ordenar(actual));
  }
  const ultimo = conjuntos[conjuntos.length - 1]!;
  return { simbolos, conjuntos, fueraDelAlfabeto, acepta: ultimo.some((q) => a.finales.includes(q)) };
}

/** Una fila de la construcción de subconjuntos: un conjunto alcanzable y adónde lleva cada símbolo. */
export interface FilaDeSubconjuntos {
  conjunto: string[];
  transiciones: string[][];
  final: boolean;
}

/** Los conjuntos alcanzables desde E({q0}), en el orden en que los descubre un recorrido en anchura. */
export function subconjuntos(a: Automata): FilaDeSubconjuntos[] {
  const ordenar = (S: Set<string>) => a.estados.filter((q) => S.has(q));
  const inicio = ordenar(clausura(a, [a.inicial]));
  const clave = (S: readonly string[]) => S.join('\u0000');
  const vistos = new Set([clave(inicio)]);
  const filas: FilaDeSubconjuntos[] = [];
  const cola = [inicio];
  while (cola.length > 0) {
    const S = cola.shift()!;
    const transiciones = a.alfabeto.map((s) => ordenar(avanzar(a, S, s)));
    for (const T of transiciones)
      if (!vistos.has(clave(T))) {
        vistos.add(clave(T));
        cola.push(T);
      }
    filas.push({ conjunto: S, transiciones, final: S.some((q) => a.finales.includes(q)) });
  }
  return filas;
}

/**
 * El autómata determinista de la construcción de subconjuntos, con un estado por cada conjunto alcanzable, que se
 * llama como el conjunto («{0, 1}»). Las posiciones y las curvas del dibujo se dan con esos nombres.
 */
export function determinizar(
  a: Automata,
  dibujo: Pick<Automata, 'clave' | 'titulo' | 'posiciones' | 'curvas' | 'lazos'>,
): Automata {
  const filas = subconjuntos(a);
  const nombre = (S: readonly string[]) => escribirConjunto(a, S);
  return {
    ...dibujo,
    estados: filas.map((f) => nombre(f.conjunto)),
    alfabeto: a.alfabeto,
    ...(a.clases ? { clases: a.clases } : {}),
    inicial: nombre(filas[0]!.conjunto),
    finales: filas.filter((f) => f.final).map((f) => nombre(f.conjunto)),
    transiciones: filas.flatMap((f) => a.alfabeto.map((s, i): Transicion => [nombre(f.conjunto), s, nombre(f.transiciones[i]!)])),
    palabra: a.palabra,
  };
}

/** El mismo autómata determinista con un sumidero, «⊥», que recibe las transiciones que faltan; si no falta ninguna, el mismo. */
export function completar(a: Automata): Automata {
  if (esCompleto(a)) return a;
  const estados = [...a.estados, SUMIDERO];
  const transiciones: Transicion[] = [...a.transiciones];
  for (const q of estados) for (const s of a.alfabeto) if (destinos(a, q, s).length === 0) transiciones.push([q, s, SUMIDERO]);
  return { ...a, estados, transiciones };
}

/**
 * El algoritmo de Moore sobre un autómata determinista completo: la partición inicial separa los estados de
 * aceptación de los demás, y cada paso separa dos estados de un mismo bloque si algún símbolo los lleva a bloques
 * distintos. Devuelve las particiones de cada paso, hasta la primera que no cambia (incluida), con los bloques en el
 * orden de su primer estado.
 */
export function moore(a: Automata): string[][][] {
  if (!esCompleto(a)) throw new Error('El algoritmo de Moore pide un autómata determinista completo.');
  const delta = (q: string, s: string) => destinos(a, q, s)[0]!;
  const agrupar = (firma: (q: string) => string) => {
    const bloques = new Map<string, string[]>();
    for (const q of a.estados) {
      const f = firma(q);
      bloques.set(f, [...(bloques.get(f) ?? []), q]);
    }
    return [...bloques.values()];
  };
  let particion = agrupar((q) => String(a.finales.includes(q)));
  const particiones = [particion];
  for (;;) {
    const bloqueDe = new Map<string, number>();
    particion.forEach((bloque, i) => bloque.forEach((q) => bloqueDe.set(q, i)));
    const nueva = agrupar((q) => [bloqueDe.get(q), ...a.alfabeto.map((s) => bloqueDe.get(delta(q, s)))].join(' '));
    particiones.push(nueva);
    if (nueva.length === particion.length) return particiones;
    particion = nueva;
  }
}

/** Las clases de símbolos del autómata: las suyas, o una por símbolo. */
export function clasesDe(a: Automata): ClaseDeSimbolos[] {
  return a.clases ? [...a.clases] : a.alfabeto.map((s) => ({ rotulo: s, simbolos: s }));
}

/**
 * El rótulo de un arco con estos símbolos: las clases completas por su rótulo («0–9») y los demás símbolos sueltos,
 * separados por comas; ε para la cadena vacía.
 */
export function rotular(a: Automata, simbolos: readonly string[]): string {
  const quedan = new Set(simbolos);
  const partes: string[] = [];
  if (quedan.delete('')) partes.push('ε');
  for (const clase of clasesDe(a)) {
    const todos = [...clase.simbolos];
    if (todos.length > 1 && todos.every((s) => quedan.has(s))) {
      todos.forEach((s) => quedan.delete(s));
      partes.push(clase.rotulo);
    }
  }
  for (const s of a.alfabeto) if (quedan.has(s)) partes.push(s);
  return partes.join(', ');
}

/** Los arcos del dibujo: uno por cada par de estados con alguna transición, con todos sus símbolos. */
export function arcos(a: Automata): { desde: string; hacia: string; simbolos: string[] }[] {
  const porPar = new Map<string, { desde: string; hacia: string; simbolos: string[] }>();
  for (const [p, s, q] of a.transiciones) {
    const clave = `${p}→${q}`;
    const arco = porPar.get(clave) ?? { desde: p, hacia: q, simbolos: [] };
    arco.simbolos.push(s);
    porPar.set(clave, arco);
  }
  return [...porPar.values()];
}

const CIFRAS: ClaseDeSimbolos = { rotulo: '0–9', simbolos: '0123456789' };

/** Los múltiplos de 3 en binario: el estado es el resto de lo leído, y un bit b lleva de r al resto de 2r + b. */
export const MULTIPLOS_DE_3: Automata = {
  clave: 'multiplos-de-3',
  titulo: 'Múltiplos de 3 en binario',
  estados: ['0', '1', '2'],
  alfabeto: ['0', '1'],
  inicial: '0',
  finales: ['0'],
  transiciones: [0, 1, 2].flatMap((r) => [0, 1].map((b): Transicion => [String(r), String(b), String((2 * r + b) % 3)])),
  posiciones: { '0': [0, 0], '1': [1.6, 0], '2': [3.2, 0] },
  palabra: '1011',
};

/** Los números del patrón de la Entrada, [0-9]+(\.[0-9]*)?, sin el sumidero: i, e, p y d. */
export const NUMEROS: Automata = {
  clave: 'numeros',
  titulo: 'Los números de la Entrada',
  estados: ['i', 'e', 'p', 'd'],
  alfabeto: [...CIFRAS.simbolos, '.'],
  clases: [CIFRAS, { rotulo: '.', simbolos: '.' }],
  inicial: 'i',
  finales: ['e', 'p', 'd'],
  transiciones: [
    ...[...CIFRAS.simbolos].flatMap((c): Transicion[] => [
      ['i', c, 'e'],
      ['e', c, 'e'],
      ['p', c, 'd'],
      ['d', c, 'd'],
    ]),
    ['e', '.', 'p'],
  ],
  posiciones: { i: [0, 0], e: [1.4, 0], p: [2.8, 0], d: [4.2, 0] },
  palabra: '3.14',
};

/** El no determinista de (a|b)*abb: el estado 1 apuesta a que la a recién leída empieza el abb final. */
export const ABB_NO_DETERMINISTA: Automata = {
  clave: 'abb-no-determinista',
  titulo: '(a|b)*abb, no determinista',
  estados: ['0', '1', '2', '3'],
  alfabeto: ['a', 'b'],
  inicial: '0',
  finales: ['3'],
  transiciones: [
    ['0', 'a', '0'],
    ['0', 'b', '0'],
    ['0', 'a', '1'],
    ['1', 'b', '2'],
    ['2', 'b', '3'],
  ],
  posiciones: { '0': [0, 0], '1': [1.4, 0], '2': [2.8, 0], '3': [4.2, 0] },
  palabra: 'aabb',
};

/** El determinista que da la construcción de subconjuntos aplicada al anterior: {0}, {0, 1}, {0, 2} y {0, 3}. */
export const ABB_DETERMINISTA: Automata = determinizar(ABB_NO_DETERMINISTA, {
  clave: 'abb-determinista',
  titulo: '(a|b)*abb, por subconjuntos',
  posiciones: { '{0}': [0, 0], '{0, 1}': [1.5, 0], '{0, 2}': [3, 0], '{0, 3}': [4.5, 0] },
  curvas: { '{0, 1}→{0, 2}': 18, '{0, 2}→{0, 1}': 18, '{0, 3}→{0, 1}': 62, '{0, 3}→{0}': 104 },
});

/** El determinista de cinco estados que dan las construcciones de Thompson y de subconjuntos para (a|b)*abb. */
export const ABB_THOMPSON: Automata = {
  clave: 'abb-thompson',
  titulo: '(a|b)*abb, de Thompson (cinco estados)',
  estados: ['A', 'B', 'C', 'D', 'E'],
  alfabeto: ['a', 'b'],
  inicial: 'A',
  finales: ['E'],
  transiciones: [
    ['A', 'a', 'B'],
    ['A', 'b', 'C'],
    ['B', 'a', 'B'],
    ['B', 'b', 'D'],
    ['C', 'a', 'B'],
    ['C', 'b', 'C'],
    ['D', 'a', 'B'],
    ['D', 'b', 'E'],
    ['E', 'a', 'B'],
    ['E', 'b', 'C'],
  ],
  posiciones: { A: [0, 0.8], B: [1.4, 0], C: [2.1, 1.6], D: [2.8, 0], E: [4.2, 0] },
  curvas: { 'B→D': 16, 'D→B': 16, 'E→B': -70 },
  lazos: { B: -125, C: 90 },
  palabra: 'babb',
};

/** El no determinista de las palabras cuyo tercer símbolo desde el final es un 1. */
export const TERCERO_DESDE_EL_FINAL: Automata = {
  clave: 'tercero-desde-el-final',
  titulo: 'Tercer símbolo desde el final, no determinista',
  estados: ['0', '1', '2', '3'],
  alfabeto: ['0', '1'],
  inicial: '0',
  finales: ['3'],
  transiciones: [
    ['0', '0', '0'],
    ['0', '1', '0'],
    ['0', '1', '1'],
    ['1', '0', '2'],
    ['1', '1', '2'],
    ['2', '0', '3'],
    ['2', '1', '3'],
  ],
  posiciones: { '0': [0, 0], '1': [1.4, 0], '2': [2.8, 0], '3': [4.2, 0] },
  palabra: '10110',
};

/** Un no determinista con una transición ε, para a*b*: un lazo a en 0, un lazo b en 1 y un arco ε de 0 a 1. */
export const A_ESTRELLA_B_ESTRELLA: Automata = {
  clave: 'a-estrella-b-estrella',
  titulo: 'a*b*, con una transición ε',
  estados: ['0', '1'],
  alfabeto: ['a', 'b'],
  inicial: '0',
  finales: ['1'],
  transiciones: [
    ['0', 'a', '0'],
    ['0', '', '1'],
    ['1', 'b', '1'],
  ],
  posiciones: { '0': [0, 0], '1': [1.6, 0] },
  palabra: 'aabba',
};

/** Los autómatas de la pieza, en el orden de la lista. */
export const AUTOMATAS_DEL_CAPITULO: readonly Automata[] = [
  MULTIPLOS_DE_3,
  NUMEROS,
  ABB_NO_DETERMINISTA,
  ABB_DETERMINISTA,
  ABB_THOMPSON,
  TERCERO_DESDE_EL_FINAL,
  A_ESTRELLA_B_ESTRELLA,
];
