/**
 * La matemática de las piezas «coclases» y «rompecabezas-de-quince» (I.7). Los grupos chicos del capítulo, S₃ y D₄,
 * escritos como permutaciones; su tabla de multiplicar (la tabla de Cayley), sus subgrupos, sus coclases por la
 * izquierda y por la derecha, y el cociente cuando el subgrupo es normal. Y el rompecabezas de quince piezas: cada
 * jugada es una transposición del hueco con una pieza vecina, así que el signo de la permutación de las dieciséis
 * casillas cambia en cada jugada, igual que el color de la casilla del hueco.
 */

/** Una permutación de {0, …, n − 1}: `p[i]` es la imagen de `i`. */
export type Permutacion = readonly number[];

/** La composición «a después de b», de derecha a izquierda, como en el capítulo: (ab)(i) = a(b(i)). */
export function componerPermutaciones(a: Permutacion, b: Permutacion): number[] {
  return b.map((i) => a[i]!);
}

export function inversaDePermutacion(a: Permutacion): number[] {
  const r = new Array<number>(a.length);
  a.forEach((imagen, i) => (r[imagen] = i));
  return r;
}

/** La cantidad de inversiones: los pares i < j con p(i) > p(j). */
export function inversionesDe(p: readonly number[]): number {
  let k = 0;
  for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (p[i]! > p[j]!) k++;
  return k;
}

/** El signo, (−1) elevado a la cantidad de inversiones. */
export function signoDePermutacion(p: readonly number[]): 1 | -1 {
  return inversionesDe(p) % 2 === 0 ? 1 : -1;
}

/** El ciclo (a₁ a₂ … a_k) de {1, …, n}, con la numeración del capítulo, como permutación de {0, …, n − 1}. */
export function cicloDe(n: number, ...ciclo: number[]): number[] {
  const p = Array.from({ length: n }, (_, i) => i);
  ciclo.forEach((a, i) => (p[a - 1] = ciclo[(i + 1) % ciclo.length]! - 1));
  return p;
}

/** Un grupo finito de permutaciones, con un nombre para cada elemento; el primero es el neutro. */
export interface GrupoChico {
  nombre: string;
  elementos: { nombre: string; permutacion: Permutacion }[];
}

/** S₃, en el orden de la tabla del capítulo: la identidad, los dos ciclos de longitud 3 y las tres transposiciones. */
export function grupoS3(): GrupoChico {
  return {
    nombre: 'S₃',
    elementos: [
      { nombre: 'id', permutacion: cicloDe(3) },
      { nombre: '(1 2 3)', permutacion: cicloDe(3, 1, 2, 3) },
      { nombre: '(1 3 2)', permutacion: cicloDe(3, 1, 3, 2) },
      { nombre: '(1 2)', permutacion: cicloDe(3, 1, 2) },
      { nombre: '(1 3)', permutacion: cicloDe(3, 1, 3) },
      { nombre: '(2 3)', permutacion: cicloDe(3, 2, 3) },
    ],
  };
}

/**
 * D₄, las simetrías del cuadrado de vértices 1, 2, 3, 4 en sentido antihorario: r es la rotación de 90°, (1 2 3 4), y s
 * la reflexión en la diagonal que pasa por 1 y 3, (2 4). Los elementos son e, r, r², r³, s, rs, r²s y r³s.
 */
export function grupoD4(): GrupoChico {
  const r = cicloDe(4, 1, 2, 3, 4);
  const s = cicloDe(4, 2, 4);
  const potencias = [cicloDe(4)];
  for (let k = 1; k < 4; k++) potencias.push(componerPermutaciones(r, potencias[k - 1]!));
  const nombres = ['e', 'r', 'r²', 'r³'];
  return {
    nombre: 'D₄',
    elementos: [
      ...potencias.map((p, k) => ({ nombre: nombres[k]!, permutacion: p })),
      ...potencias.map((p, k) => ({ nombre: `${k === 0 ? '' : nombres[k]}s`, permutacion: componerPermutaciones(p, s) })),
    ],
  };
}

const clave = (p: Permutacion) => p.join(',');

/** La tabla de Cayley con índices: `tabla[a][b]` es el índice del producto ab (primero b, después a). */
export function tablaDeCayley(G: GrupoChico): number[][] {
  const indice = new Map(G.elementos.map((x, i) => [clave(x.permutacion), i]));
  return G.elementos.map((a) =>
    G.elementos.map((b) => {
      const i = indice.get(clave(componerPermutaciones(a.permutacion, b.permutacion)));
      if (i === undefined) throw new Error(`${G.nombre} no es cerrado por productos.`);
      return i;
    }),
  );
}

/** El índice del inverso de cada elemento, leído en la tabla: el b con ab = e. */
export function inversosDe(G: GrupoChico): number[] {
  return tablaDeCayley(G).map((fila) => fila.indexOf(0));
}

/** El subgrupo generado por unos elementos (índices): el menor que los contiene, ordenado. */
export function subgrupoGenerado(G: GrupoChico, generadores: readonly number[]): number[] {
  const tabla = tablaDeCayley(G);
  const H = new Set([0, ...generadores]);
  for (let crecio = true; crecio;) {
    crecio = false;
    for (const a of [...H])
      for (const b of [...H])
        if (!H.has(tabla[a]![b]!)) {
          H.add(tabla[a]![b]!);
          crecio = true;
        }
  }
  return [...H].sort((x, y) => x - y);
}

/**
 * Todos los subgrupos, ordenados por su orden y, a igual orden, por sus elementos. En un grupo finito, un subconjunto
 * no vacío y cerrado por productos es un subgrupo, así que basta con generar: cada subgrupo es el generado por sus
 * elementos, y se obtiene agregando generadores de a uno.
 */
export function subgruposDe(G: GrupoChico): number[][] {
  const vistos = new Map<string, number[]>();
  const pendientes = [subgrupoGenerado(G, [])];
  while (pendientes.length > 0) {
    const H = pendientes.pop()!;
    if (vistos.has(H.join(','))) continue;
    vistos.set(H.join(','), H);
    for (let x = 0; x < G.elementos.length; x++) if (!H.includes(x)) pendientes.push(subgrupoGenerado(G, [...H, x]));
  }
  return [...vistos.values()].sort(
    (A, B) => A.length - B.length || A.join(',').localeCompare(B.join(','), 'en', { numeric: true }),
  );
}

/**
 * Las coclases por la izquierda, aH, o por la derecha, Ha, de un subgrupo H (índices). Cada una es la de su primer
 * elemento en el orden del grupo, y van en ese orden: la primera es H.
 */
function coclases(G: GrupoChico, H: readonly number[], lado: 'izquierda' | 'derecha'): number[][] {
  const tabla = tablaDeCayley(G);
  const cubiertos = new Set<number>();
  const resultado: number[][] = [];
  for (let a = 0; a < G.elementos.length; a++) {
    if (cubiertos.has(a)) continue;
    const coclase = H.map((h) => (lado === 'izquierda' ? tabla[a]![h]! : tabla[h]![a]!));
    coclase.forEach((x) => cubiertos.add(x));
    resultado.push(coclase);
  }
  return resultado;
}

export const coclasesPorLaIzquierda = (G: GrupoChico, H: readonly number[]) => coclases(G, H, 'izquierda');
export const coclasesPorLaDerecha = (G: GrupoChico, H: readonly number[]) => coclases(G, H, 'derecha');

/** Si H es normal: si gHg⁻¹ está contenido en H para todo g. */
export function esNormal(G: GrupoChico, H: readonly number[]): boolean {
  const tabla = tablaDeCayley(G);
  const inversos = inversosDe(G);
  return G.elementos.every((_, g) => H.every((h) => H.includes(tabla[tabla[g]![h]!]![inversos[g]!]!)));
}

/** Un elemento g con gH ≠ Hg, si lo hay. */
export function testigoDeQueNoEsNormal(G: GrupoChico, H: readonly number[]): number | undefined {
  const tabla = tablaDeCayley(G);
  const igualesComoConjuntos = (A: number[], B: number[]) => A.length === B.length && A.every((x) => B.includes(x));
  for (let g = 0; g < G.elementos.length; g++) {
    const izquierda = H.map((h) => tabla[g]![h]!);
    const derecha = H.map((h) => tabla[h]![g]!);
    if (!igualesComoConjuntos(izquierda, derecha)) return g;
  }
  return undefined;
}

/** A qué coclase (por su lugar en la lista) pertenece cada elemento. */
export function coclaseDeCadaElemento(G: GrupoChico, clases: readonly (readonly number[])[]): number[] {
  const lugar = new Array<number>(G.elementos.length).fill(-1);
  clases.forEach((C, k) => C.forEach((x) => (lugar[x] = k)));
  return lugar;
}

/**
 * La tabla del cociente G/H, con las coclases por la izquierda como elementos: `tabla[i][j]` es la coclase del producto
 * de un elemento de la i-ésima por uno de la j-ésima. Si H no es normal, algún producto de dos coclases cae en más de
 * una, y el resultado es `undefined`.
 */
export function tablaDelCociente(G: GrupoChico, H: readonly number[]): number[][] | undefined {
  const tabla = tablaDeCayley(G);
  const clases = coclasesPorLaIzquierda(G, H);
  const lugar = coclaseDeCadaElemento(G, clases);
  const resultado: number[][] = [];
  for (const A of clases) {
    const fila: number[] = [];
    for (const B of clases) {
      const productos = new Set(A.flatMap((a) => B.map((b) => lugar[tabla[a]![b]!]!)));
      if (productos.size !== 1) return undefined;
      fila.push([...productos][0]!);
    }
    resultado.push(fila);
  }
  return resultado;
}

/** El nombre de una coclase aH: «H» si es la del neutro, y si no, el nombre de su primer elemento seguido de «H». */
export function nombreDeCoclase(G: GrupoChico, coclase: readonly number[], lado: 'izquierda' | 'derecha'): string {
  const representante = Math.min(...coclase);
  if (representante === 0) return 'H';
  const nombre = G.elementos[representante]!.nombre;
  return lado === 'izquierda' ? `${nombre}H` : `H${nombre}`;
}

/* El rompecabezas de quince piezas. */

/**
 * Un tablero de 4 × 4 leído por filas: `t[c]` es la pieza de la casilla c, del 1 al 15, y 0 es el hueco. En la
 * posición ordenada, las piezas van en orden y el hueco queda en la última casilla.
 */
export type Tablero = readonly number[];

export const TABLERO_ORDENADO: Tablero = [...Array.from({ length: 15 }, (_, i) => i + 1), 0];

/** Las casillas vecinas de una casilla: arriba, abajo, a la izquierda y a la derecha. */
export function casillasVecinas(c: number): number[] {
  const [fila, columna] = [Math.floor(c / 4), c % 4];
  return [
    [fila - 1, columna],
    [fila + 1, columna],
    [fila, columna - 1],
    [fila, columna + 1],
  ]
    .filter(([f, k]) => f! >= 0 && f! < 4 && k! >= 0 && k! < 4)
    .map(([f, k]) => 4 * f! + k!);
}

/** Desliza al hueco la pieza de la casilla c, si es vecina del hueco; si no, devuelve `undefined`. */
export function deslizarPieza(t: Tablero, c: number): number[] | undefined {
  const hueco = t.indexOf(0);
  if (!casillasVecinas(hueco).includes(c)) return undefined;
  return intercambiarCasillas(t, hueco, c);
}

/** Intercambia el contenido de dos casillas: es una jugada si una es el hueco y son vecinas, y si no, una trampa. */
export function intercambiarCasillas(t: Tablero, a: number, b: number): number[] {
  const nuevo = [...t];
  [nuevo[a], nuevo[b]] = [t[b]!, t[a]!];
  return nuevo;
}

/** Los pasos que separan al hueco de su casilla, la última, moviéndose de una casilla a una vecina. */
export function distanciaDelHueco(t: Tablero): number {
  const hueco = t.indexOf(0);
  return 3 - Math.floor(hueco / 4) + (3 - (hueco % 4));
}

/** La permutación de las dieciséis casillas, con el hueco como la pieza 16: la casilla c tiene la pieza p[c] + 1. */
export function permutacionDelTablero(t: Tablero): number[] {
  return t.map((x) => (x === 0 ? 15 : x - 1));
}

/**
 * Si la posición se alcanza desde la ordenada. Cada jugada multiplica la permutación por una transposición y mueve el
 * hueco un paso, así que el signo de la permutación por (−1) a la distancia del hueco no cambia, y en la posición
 * ordenada vale 1. Que esa condición también alcanza lo demostró Story en 1880.
 */
export function alcanzable(t: Tablero): boolean {
  return signoDePermutacion(permutacionDelTablero(t)) === (distanciaDelHueco(t) % 2 === 0 ? 1 : -1);
}

/** Una sucesión de jugadas al azar desde una posición, sin deshacer la anterior; `azar` da números en [0, 1). */
export function mezclarTablero(t: Tablero, jugadas: number, azar: () => number = Math.random): number[] {
  let actual = [...t];
  let anterior = -1;
  for (let k = 0; k < jugadas; k++) {
    const hueco = actual.indexOf(0);
    const opciones = casillasVecinas(hueco).filter((c) => c !== anterior);
    const c = opciones[Math.floor(azar() * opciones.length)]!;
    actual = deslizarPieza(actual, c)!;
    anterior = hueco;
  }
  return actual;
}
