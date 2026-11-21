/**
 * La matemática de la pieza «multiplicacion-modular» (I.5): multiplicar por a en ℤ/nℤ, dibujado como cuerdas que
 * unen cada k con a·k mod n en un círculo de n puntos. Multiplicar por a es una biyección exactamente cuando a y n son
 * coprimos, y entonces a tiene un inverso módulo n; si no, la imagen tiene n / mcd(a, n) elementos.
 */

/** El máximo común divisor de dos naturales, con mcd(0, 0) = 0. */
export function mcdNatural(a: number, b: number): number {
  let [x, y] = [Math.abs(a), Math.abs(b)];
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

/** El inverso de a módulo n ≥ 2, con el algoritmo de Euclides extendido, o `null` si a y n no son coprimos. */
export function inversoModular(a: number, n: number): number | null {
  let [r0, r1] = [((a % n) + n) % n, n];
  let [x0, x1] = [1, 0];
  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    [r0, r1] = [r1, r0 - q * r1];
    [x0, x1] = [x1, x0 - q * x1];
  }
  return r0 === 1 ? ((x0 % n) + n) % n : null;
}

/** Las cuerdas de la pieza: cada k de 0 a n − 1, unido con a·k mod n. */
export function cuerdas(n: number, a: number): [number, number][] {
  return Array.from({ length: n }, (_, k) => [k, (a * k) % n] as [number, number]);
}

/** Cuántos elementos tiene la imagen de la multiplicación por a en ℤ/nℤ. */
export function tamanoDeLaImagen(n: number, a: number): number {
  return new Set(cuerdas(n, a).map(([, b]) => b)).size;
}
