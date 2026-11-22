/**
 * La matemática de la pieza «reticulo-de-divisores» (I.12): los divisores de n ordenados por la divisibilidad forman
 * un retículo, con el máximo común divisor como ínfimo y el mínimo común múltiplo como supremo. Su diagrama de Hasse
 * une cada divisor con los que lo cubren, que son sus múltiplos por un primo. Es un álgebra de Boole exactamente
 * cuando n no tiene factores primos repetidos.
 */
import { mcdNatural } from './modular.ts';

/** Los divisores positivos de n ≥ 1, de menor a mayor. */
export function divisores(n: number): number[] {
  const chicos: number[] = [];
  const grandes: number[] = [];
  for (let d = 1; d * d <= n; d++)
    if (n % d === 0) {
      chicos.push(d);
      if (d * d !== n) grandes.unshift(n / d);
    }
  return [...chicos, ...grandes];
}

/** La factorización de n ≥ 1 como pares [primo, exponente], con los primos de menor a mayor. */
export function factorizar(n: number): [number, number][] {
  const factores: [number, number][] = [];
  let resto = n;
  for (let p = 2; p * p <= resto; p++) {
    let e = 0;
    while (resto % p === 0) {
      resto /= p;
      e++;
    }
    if (e > 0) factores.push([p, e]);
  }
  if (resto > 1) factores.push([resto, 1]);
  return factores;
}

/** La cantidad de factores primos de d, contados con su multiplicidad: la altura de d en el diagrama de Hasse. */
export function rango(d: number): number {
  return factorizar(d).reduce((s, [, e]) => s + e, 0);
}

/** El mínimo común múltiplo de dos naturales positivos. */
export function mcmNatural(a: number, b: number): number {
  return (a / mcdNatural(a, b)) * b;
}

/** Si b cubre a a en el orden de la divisibilidad: a divide a b y el cociente es primo. */
export function cubre(a: number, b: number): boolean {
  if (b % a !== 0 || b === a) return false;
  return rango(b / a) === 1;
}

/** Las aristas del diagrama de Hasse de los divisores de n: los pares [a, b] en los que b cubre a a. */
export function aristasDeHasse(n: number): [number, number][] {
  const ds = divisores(n);
  return ds.flatMap((a) => ds.filter((b) => cubre(a, b)).map((b) => [a, b] as [number, number]));
}

/**
 * La posición de cada divisor en el diagrama: la altura es su rango, y dentro de cada altura los divisores se ordenan
 * por una proyección de sus exponentes, que manda el primer primo a la izquierda y el último a la derecha, y se
 * reparten a distancias iguales alrededor del centro.
 */
export function posicionesDeHasse(n: number): Map<number, [number, number]> {
  const primos = factorizar(n).map(([p]) => p);
  const k = primos.length;
  const clave = (d: number) => {
    const exponentes = new Map(factorizar(d));
    return primos.reduce((s, p, i) => s + (exponentes.get(p) ?? 0) * (k === 1 ? 0 : i / (k - 1) - 0.5), 0);
  };
  const porAltura = new Map<number, number[]>();
  for (const d of divisores(n)) {
    const h = rango(d);
    porAltura.set(h, [...(porAltura.get(h) ?? []), d]);
  }
  const posiciones = new Map<number, [number, number]>();
  for (const [h, ds] of porAltura) {
    ds.sort((a, b) => clave(a) - clave(b) || a - b);
    ds.forEach((d, i) => posiciones.set(d, [i - (ds.length - 1) / 2, h]));
  }
  return posiciones;
}

/** El complemento de d en el retículo de los divisores de n: el c con mcd(d, c) = 1 y mcm(d, c) = n, o `null`. */
export function complemento(d: number, n: number): number | null {
  return mcdNatural(d, n / d) === 1 ? n / d : null;
}

/** Si los divisores de n forman un álgebra de Boole, es decir, si n no tiene factores primos repetidos. */
export function esBooleano(n: number): boolean {
  return factorizar(n).every(([, e]) => e === 1);
}
