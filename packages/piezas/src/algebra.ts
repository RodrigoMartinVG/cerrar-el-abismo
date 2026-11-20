/**
 * Álgebra lineal mínima en el plano, para las piezas. Las matrices son de 2×2 y se guardan por filas,
 * [a, b, c, d] = ((a, b), (c, d)), y los vectores son columnas (convención de la obra, sección 12).
 */

export type Vec2 = readonly [number, number];
export type Mat2 = readonly [number, number, number, number];

export function aplicar([a, b, c, d]: Mat2, [x, y]: Vec2): Vec2 {
  return [a * x + b * y, c * x + d * y];
}

export function determinante([a, b, c, d]: Mat2): number {
  return a * d - b * c;
}

/** (M⁻¹)ᵀ: la matriz que transforma covectores (II.5). Falla si M no es invertible. */
export function inversaTranspuesta(m: Mat2): Mat2 {
  const det = determinante(m);
  if (det === 0) throw new Error('La matriz no es invertible.');
  const [a, b, c, d] = m;
  return [d / det, -c / det, -b / det, a / det];
}

export function producto([x1, y1]: Vec2, [x2, y2]: Vec2): number {
  return x1 * x2 + y1 * y2;
}

export function normalizar(v: Vec2): Vec2 {
  const n = Math.hypot(v[0], v[1]);
  return n === 0 ? v : [v[0] / n, v[1] / n];
}

/** La normal de la recta de dirección t: t girado un cuarto de vuelta. */
export function perpendicular([x, y]: Vec2): Vec2 {
  return [-y, x];
}
