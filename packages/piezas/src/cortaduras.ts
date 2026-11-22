/**
 * La matemática de la pieza «cortadura» (I.9): un número real como una cortadura de Dedekind, el conjunto de los
 * racionales que quedan por debajo de él. Cada real de la pieza viene con un procedimiento exacto, con enteros, que
 * decide si un racional p/q está en su cortadura; con él se buscan, entre los racionales de denominador a lo sumo N, el
 * mayor de la cortadura y el menor de los que quedan afuera. Para un racional r, el menor de afuera es r mismo; para un
 * irracional, los dos se acercan sin parar al crecer N, porque ni la cortadura tiene máximo ni lo de afuera mínimo.
 */

/** Una fracción p/q con q > 0, como el par (p, q). */
export type FraccionEntera = readonly [p: number, q: number];

export interface RealPorCortadura {
  clave: string;
  /** Cómo se escribe: «√2», «1/2». */
  nombre: string;
  /** Un valor aproximado, solo para dibujar y para empezar las búsquedas. */
  aproximado: number;
  /** ¿Está p/q, con q > 0, en la cortadura? La respuesta es exacta: usa solo enteros. */
  contiene: (p: number, q: number) => boolean;
  /** La regla en palabras, para el lector. */
  regla: string;
  /** Si el real es racional, su fracción irreducible. */
  racional?: FraccionEntera;
}

export const REALES_POR_CORTADURA: readonly RealPorCortadura[] = [
  {
    clave: 'raiz-de-2',
    nombre: '√2',
    aproximado: Math.SQRT2,
    contiene: (p, q) => p < 0 || p * p < 2 * q * q,
    regla: 'un racional p/q, con q > 0, está en la cortadura de √2 si p < 0 o p² < 2q²',
  },
  {
    clave: 'raiz-cubica-de-2',
    nombre: '∛2',
    aproximado: Math.cbrt(2),
    contiene: (p, q) => p * p * p < 2 * q * q * q,
    regla: 'un racional p/q, con q > 0, está en la cortadura de ∛2 si p³ < 2q³',
  },
  {
    clave: 'aureo',
    nombre: '(1 + √5)/2',
    aproximado: (1 + Math.sqrt(5)) / 2,
    // p/q < (1 + √5)/2 si y solo si 2p − q < q√5, es decir, si 2p − q < 0 o (2p − q)² < 5q².
    contiene: (p, q) => 2 * p - q < 0 || (2 * p - q) ** 2 < 5 * q * q,
    regla: 'un racional p/q, con q > 0, está en la cortadura de (1 + √5)/2 si 2p − q < 0 o (2p − q)² < 5q²',
  },
  {
    clave: 'un-medio',
    nombre: '1/2',
    aproximado: 0.5,
    contiene: (p, q) => 2 * p < q,
    regla: 'un racional p/q, con q > 0, está en la cortadura de 1/2 si 2p < q',
    racional: [1, 2],
  },
  {
    clave: 'siete-quintos',
    nombre: '7/5',
    aproximado: 1.4,
    contiene: (p, q) => 5 * p < 7 * q,
    regla: 'un racional p/q, con q > 0, está en la cortadura de 7/5 si 5p < 7q',
    racional: [7, 5],
  },
];

export function mcdEntero(a: number, b: number): number {
  let [x, y] = [Math.abs(a), Math.abs(b)];
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export function reducirFraccion([p, q]: FraccionEntera): FraccionEntera {
  const d = mcdEntero(p, q) || 1;
  return [p / d, q / d];
}

/** Compara dos fracciones de denominador positivo: negativo si a < b, cero si son iguales, positivo si a > b. */
export function compararFracciones([p, q]: FraccionEntera, [r, s]: FraccionEntera): number {
  return p * s - r * q;
}

/** b − a, irreducible. */
export function distanciaEntreFracciones(a: FraccionEntera, b: FraccionEntera): FraccionEntera {
  return reducirFraccion([b[0] * a[1] - a[0] * b[1], a[1] * b[1]]);
}

/** El mayor p con p/q en la cortadura (la cortadura no es vacía ni es todo ℚ, así que existe). */
function mayorNumerador(real: RealPorCortadura, q: number): number {
  let p = Math.floor(real.aproximado * q);
  while (real.contiene(p + 1, q)) p++;
  while (!real.contiene(p, q)) p--;
  return p;
}

/** El mayor racional de la cortadura entre los de denominador a lo sumo N, irreducible. */
export function mayorEnLaCortadura(real: RealPorCortadura, n: number): FraccionEntera {
  let mejor: FraccionEntera = [mayorNumerador(real, 1), 1];
  for (let q = 2; q <= n; q++) {
    const candidato: FraccionEntera = [mayorNumerador(real, q), q];
    if (compararFracciones(candidato, mejor) > 0) mejor = candidato;
  }
  return reducirFraccion(mejor);
}

/** El menor racional de los que quedan afuera de la cortadura, entre los de denominador a lo sumo N, irreducible. */
export function menorFueraDeLaCortadura(real: RealPorCortadura, n: number): FraccionEntera {
  let mejor: FraccionEntera = [mayorNumerador(real, 1) + 1, 1];
  for (let q = 2; q <= n; q++) {
    const candidato: FraccionEntera = [mayorNumerador(real, q) + 1, q];
    if (compararFracciones(candidato, mejor) < 0) mejor = candidato;
  }
  return reducirFraccion(mejor);
}

export interface RacionalDibujado {
  p: number;
  q: number;
  adentro: boolean;
}

/** Los racionales irreducibles p/q con q ≤ N entre `desde` y `hasta`, cada uno con el lado de la cortadura en que cae. */
export function racionalesEnVentana(real: RealPorCortadura, n: number, desde: number, hasta: number): RacionalDibujado[] {
  const racionales: RacionalDibujado[] = [];
  for (let q = 1; q <= n; q++)
    for (let p = Math.ceil(desde * q); p <= Math.floor(hasta * q); p++)
      if (mcdEntero(p, q) === 1) racionales.push({ p, q, adentro: real.contiene(p, q) });
  return racionales;
}
