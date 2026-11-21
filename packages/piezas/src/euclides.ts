/**
 * La matemática de la pieza «rectangulo-de-euclides» (I.3): el algoritmo de Euclides como una manera de cubrir un
 * rectángulo de a × b con cuadrados. En cada paso se cortan del rectángulo tantos cuadrados del lado menor como entran,
 * y queda un rectángulo más chico; el último cuadrado tiene por lado el máximo común divisor.
 */

export interface Paso {
  /** El dividendo y el divisor del paso: a = q · b + r, con 0 ≤ r < b. */
  a: number;
  b: number;
  q: number;
  r: number;
}

/** Los pasos del algoritmo de Euclides para a, b ≥ 1: una división con resto por paso, hasta que el resto es 0. */
export function pasosDeEuclides(a: number, b: number): Paso[] {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) throw new Error('Se esperan dos enteros positivos.');
  const pasos: Paso[] = [];
  let [x, y] = a >= b ? [a, b] : [b, a];
  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x - q * y;
    pasos.push({ a: x, b: y, q, r });
    [x, y] = [y, r];
  }
  return pasos;
}

/** El máximo común divisor de dos enteros positivos: el último divisor del algoritmo. */
export function mcd(a: number, b: number): number {
  return pasosDeEuclides(a, b).at(-1)!.b;
}

export interface Cuadrado {
  x: number;
  y: number;
  lado: number;
  /** El paso del algoritmo al que pertenece, contando desde 0. */
  paso: number;
}

/**
 * Los cuadrados que cubren el rectángulo de ancho a y alto b, en coordenadas con el origen arriba a la izquierda.
 * En cada paso, los cuadrados se cortan a lo largo del lado mayor del rectángulo que queda.
 */
export function cuadradosDeEuclides(a: number, b: number): Cuadrado[] {
  const cuadrados: Cuadrado[] = [];
  let x = 0;
  let y = 0;
  let ancho = a;
  let alto = b;
  let paso = 0;
  while (ancho > 0 && alto > 0) {
    const lado = Math.min(ancho, alto);
    if (ancho >= alto) {
      const q = Math.floor(ancho / alto);
      for (let i = 0; i < q; i++) cuadrados.push({ x: x + i * lado, y, lado, paso });
      x += q * lado;
      ancho -= q * lado;
    } else {
      const q = Math.floor(alto / ancho);
      for (let i = 0; i < q; i++) cuadrados.push({ x, y: y + i * lado, lado, paso });
      y += q * lado;
      alto -= q * lado;
    }
    paso++;
  }
  return cuadrados;
}

/** «84 = 1 · 60 + 24»: la división con resto de un paso, como la muestra la pieza. */
export function escribirPaso(p: Paso): string {
  return `${p.a} = ${p.q} · ${p.b} + ${p.r}`;
}
