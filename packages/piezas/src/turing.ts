/**
 * LAS MÁQUINAS DE TURING (I.14), paso a paso. Una máquina tiene una cinta infinita en las dos direcciones, un cabezal
 * que lee una celda por vez y un conjunto finito de estados; su programa dice, para cada estado que no es de parada y
 * cada símbolo leído, qué escribir, hacia dónde mover el cabezal y a qué estado pasar. La pieza «maquina-de-turing»
 * muestra las configuraciones una por una.
 *
 * Las máquinas son las del capítulo: la que decide {0ⁿ1ⁿ}, la que suma uno en binario y los castores afanosos de dos,
 * tres y cuatro estados. Como en la celda del capítulo, el blanco se escribe «_» y un paso es la aplicación de una
 * regla, incluida la que lleva a un estado de parada.
 */

export const BLANCO = '_';

/** Hacia dónde se mueve el cabezal: una celda a la izquierda o a la derecha. */
export type Movimiento = 'izquierda' | 'derecha';

export interface Regla {
  escribe: string;
  mueve: Movimiento;
  pasaA: string;
}

export interface MaquinaDeTuring {
  id: string;
  nombre: string;
  /** Los estados que no son de parada, en el orden de la tabla; el primero es el inicial. */
  estados: readonly string[];
  /** Los estados de parada, con lo que quiere decir llegar a cada uno: «acepta», «rechaza» o «se detiene». */
  paradas: Readonly<Record<string, string>>;
  /** El alfabeto de la cinta, con el blanco, en el orden de las columnas de la tabla. */
  simbolos: readonly string[];
  /** Los símbolos que puede tener una entrada; vacío si la máquina empieza siempre con la cinta en blanco. */
  alfabetoDeEntrada: readonly string[];
  /** La entrada con la que se muestra la máquina si nadie elige otra. */
  entrada: string;
  /** El programa: la regla de cada par (estado, símbolo), con la clave que da `clave`. */
  programa: Readonly<Record<string, Regla>>;
}

/** La clave de un par (estado, símbolo) en el programa. */
export const clave = (estado: string, simbolo: string) => `${estado} ${simbolo}`;

const r = (escribe: string, mueve: 'I' | 'D', pasaA: string): Regla => ({
  escribe,
  mueve: mueve === 'I' ? 'izquierda' : 'derecha',
  pasaA,
});

/** Un programa escrito como tabla: una fila por estado, con la regla de cada símbolo, en el orden de `simbolos`. */
function programa(simbolos: readonly string[], filas: Record<string, (Regla | null)[]>): Record<string, Regla> {
  const resultado: Record<string, Regla> = {};
  for (const [estado, reglas] of Object.entries(filas))
    reglas.forEach((regla, i) => {
      if (regla) resultado[clave(estado, simbolos[i]!)] = regla;
    });
  return resultado;
}

/**
 * La máquina del capítulo que decide {0ⁿ1ⁿ}: en A tacha con x el primer 0 que queda; en B va hacia la derecha hasta la
 * primera x o el primer blanco; en C tacha el último 1; en D vuelve hacia la izquierda hasta la x, y empieza otra vez.
 * Se detiene en S (sí) o en N (no). Las casillas (C, _) y (D, _) no se alcanzan nunca y quedan vacías.
 */
const CEROS_UNOS: MaquinaDeTuring = {
  id: 'ceros-unos',
  nombre: 'Decide 0ⁿ1ⁿ',
  estados: ['A', 'B', 'C', 'D'],
  paradas: { S: 'acepta', N: 'rechaza' },
  simbolos: ['0', '1', 'x', BLANCO],
  alfabetoDeEntrada: ['0', '1'],
  entrada: '0011',
  programa: programa(['0', '1', 'x', BLANCO], {
    A: [r('x', 'D', 'B'), r('1', 'D', 'N'), r('x', 'D', 'S'), r(BLANCO, 'D', 'S')],
    B: [r('0', 'D', 'B'), r('1', 'D', 'B'), r('x', 'I', 'C'), r(BLANCO, 'I', 'C')],
    C: [r('0', 'D', 'N'), r('x', 'I', 'D'), r('x', 'D', 'N'), null],
    D: [r('0', 'I', 'D'), r('1', 'I', 'D'), r('x', 'D', 'A'), null],
  }),
};

/** Suma uno a un número escrito en binario: en A va hasta el final, y en B lleva el acarreo hacia la izquierda. */
const SUMAR_UNO: MaquinaDeTuring = {
  id: 'sumar-uno',
  nombre: 'Suma uno en binario',
  estados: ['A', 'B'],
  paradas: { H: 'se detiene' },
  simbolos: ['0', '1', BLANCO],
  alfabetoDeEntrada: ['0', '1'],
  entrada: '1011',
  programa: programa(['0', '1', BLANCO], {
    A: [r('0', 'D', 'A'), r('1', 'D', 'A'), r(BLANCO, 'I', 'B')],
    B: [r('1', 'I', 'H'), r('0', 'I', 'B'), r('1', 'I', 'H')],
  }),
};

/** Un castor afanoso: empieza con la cinta en blanco, con los símbolos blanco y 1. */
function castor(id: string, nombre: string, filas: Record<string, (Regla | null)[]>): MaquinaDeTuring {
  const simbolos = [BLANCO, '1'];
  return {
    id,
    nombre,
    estados: Object.keys(filas),
    paradas: { H: 'se detiene' },
    simbolos,
    alfabetoDeEntrada: [],
    entrada: '',
    programa: programa(simbolos, filas),
  };
}

/** Las máquinas de la pieza, en el orden del menú. */
export const MAQUINAS: readonly MaquinaDeTuring[] = [
  CEROS_UNOS,
  SUMAR_UNO,
  castor('castor-2', 'Castor afanoso de 2 estados', {
    A: [r('1', 'D', 'B'), r('1', 'I', 'B')],
    B: [r('1', 'I', 'A'), r('1', 'D', 'H')],
  }),
  castor('castor-3', 'Castor afanoso de 3 estados, el de más unos', {
    A: [r('1', 'D', 'B'), r('1', 'D', 'H')],
    B: [r(BLANCO, 'D', 'C'), r('1', 'D', 'B')],
    C: [r('1', 'I', 'C'), r('1', 'I', 'A')],
  }),
  castor('castor-3-pasos', 'Castor afanoso de 3 estados, el de más pasos', {
    A: [r('1', 'D', 'B'), r('1', 'D', 'H')],
    B: [r('1', 'I', 'B'), r(BLANCO, 'D', 'C')],
    C: [r('1', 'I', 'C'), r('1', 'I', 'A')],
  }),
  castor('castor-4', 'Castor afanoso de 4 estados', {
    A: [r('1', 'D', 'B'), r('1', 'I', 'B')],
    B: [r('1', 'I', 'A'), r(BLANCO, 'I', 'C')],
    C: [r('1', 'D', 'H'), r('1', 'I', 'D')],
    D: [r('1', 'D', 'D'), r(BLANCO, 'D', 'A')],
  }),
];

export const maquinaPorId = (id: string | undefined) => MAQUINAS.find((m) => m.id === id);

/** Una configuración: el estado, la posición del cabezal y el contenido de la cinta, sin los blancos. */
export interface Configuracion {
  estado: string;
  cabezal: number;
  cinta: ReadonlyMap<number, string>;
}

/** El símbolo de una celda; las que nunca se escribieron tienen el blanco. */
export const leer = (c: Configuracion, posicion: number) => c.cinta.get(posicion) ?? BLANCO;

/** La configuración inicial: la entrada desde la celda 0, el cabezal sobre ella y el estado inicial. */
export function configuracionInicial(m: MaquinaDeTuring, entrada: string): Configuracion {
  const cinta = new Map<number, string>();
  [...entrada].forEach((s, i) => {
    if (s !== BLANCO) cinta.set(i, s);
  });
  return { estado: m.estados[0]!, cabezal: 0, cinta };
}

export const sePara = (m: MaquinaDeTuring, c: Configuracion) => c.estado in m.paradas;

/** La regla que se aplica en una configuración, o `null` si está en un estado de parada o no hay regla. */
export function reglaActual(m: MaquinaDeTuring, c: Configuracion): Regla | null {
  if (sePara(m, c)) return null;
  return m.programa[clave(c.estado, leer(c, c.cabezal))] ?? null;
}

/** Un paso: aplica la regla de la configuración, o devuelve `null` si no hay ninguna. */
export function avanzar(m: MaquinaDeTuring, c: Configuracion): Configuracion | null {
  const regla = reglaActual(m, c);
  if (!regla) return null;
  const cinta = new Map(c.cinta);
  if (regla.escribe === BLANCO) cinta.delete(c.cabezal);
  else cinta.set(c.cabezal, regla.escribe);
  return { estado: regla.pasaA, cabezal: c.cabezal + (regla.mueve === 'derecha' ? 1 : -1), cinta };
}

export interface Traza {
  /** Las configuraciones, desde la inicial; la cantidad de pasos es una menos que su cantidad. */
  configuraciones: Configuracion[];
  /** «parada» si llegó a un estado de parada, «sin-regla» si no hay regla para seguir, «limite» si se cortó. */
  final: 'parada' | 'sin-regla' | 'limite';
}

/** Ejecuta la máquina con una entrada, a lo sumo `limite` pasos. */
export function ejecutar(m: MaquinaDeTuring, entrada: string, limite = 10_000): Traza {
  const configuraciones = [configuracionInicial(m, entrada)];
  for (let pasos = 0; pasos < limite; pasos++) {
    const actual = configuraciones[configuraciones.length - 1]!;
    if (sePara(m, actual)) return { configuraciones, final: 'parada' };
    const siguiente = avanzar(m, actual);
    if (!siguiente) return { configuraciones, final: 'sin-regla' };
    configuraciones.push(siguiente);
  }
  const ultima = configuraciones[configuraciones.length - 1]!;
  return { configuraciones, final: sePara(m, ultima) ? 'parada' : 'limite' };
}

/** La cantidad de unos en la cinta. */
export const unos = (c: Configuracion) => [...c.cinta.values()].filter((s) => s === '1').length;

/** Lo que dice la cinta, de la primera a la última celda que no está en blanco, con los blancos del medio. */
export function contenido(c: Configuracion): string {
  if (c.cinta.size === 0) return '';
  const posiciones = [...c.cinta.keys()];
  const desde = Math.min(...posiciones);
  const hasta = Math.max(...posiciones);
  let texto = '';
  for (let i = desde; i <= hasta; i++) texto += leer(c, i);
  return texto;
}

/** Las celdas de la primera a la última que toca una traza (escritas o visitadas por el cabezal). */
export function ventana(configuraciones: readonly Configuracion[]): [number, number] {
  let desde = 0;
  let hasta = 0;
  for (const c of configuraciones) {
    desde = Math.min(desde, c.cabezal, ...c.cinta.keys());
    hasta = Math.max(hasta, c.cabezal, ...c.cinta.keys());
  }
  return [desde, hasta];
}

/** El problema de una entrada, como mensaje, o `null` si la máquina puede leerla. */
export function revisarEntrada(m: MaquinaDeTuring, entrada: string, largoMaximo = 16): string | null {
  if (m.alfabetoDeEntrada.length === 0) return entrada === '' ? null : 'Esta máquina empieza con la cinta en blanco.';
  const ajeno = [...entrada].find((s) => !m.alfabetoDeEntrada.includes(s));
  if (ajeno !== undefined)
    return `La entrada solo puede tener los símbolos ${m.alfabetoDeEntrada.join(' y ')}, y tiene «${ajeno}».`;
  if ([...entrada].length > largoMaximo) return `La entrada puede tener a lo sumo ${largoMaximo} símbolos.`;
  return null;
}
