/**
 * La matemática de la pieza «cuadrado-de-impares» (I.1): un cuadrado de n × n se arma con n capas en forma de L,
 * y la capa k (contando desde 0) tiene 2k + 1 cuadraditos, el impar que ocupa el lugar k + 1.
 */

/** La capa a la que pertenece el cuadradito de la fila i y la columna j (contando desde 0). */
export function capa(i: number, j: number): number {
  return Math.max(i, j);
}

/** Los primeros n impares: 1, 3, 5, …, 2n − 1. */
export function impares(n: number): number[] {
  return Array.from({ length: n }, (_, k) => 2 * k + 1);
}

/** «1 + 3 + 5 = 9 = 3²»: la igualdad que muestra la pieza para un n dado. */
export function igualdad(n: number): string {
  const terminos = impares(n);
  const suma = terminos.reduce((a, b) => a + b, 0);
  return `${terminos.join(' + ')} = ${suma} = ${n}²`;
}
