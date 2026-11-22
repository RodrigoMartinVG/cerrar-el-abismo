/**
 * La matemática de la pieza «de-casteljau» (I.5). El algoritmo de De Casteljau evalúa una curva de Bézier mezclando
 * de a dos los puntos de control: cada vuelta reemplaza dos puntos vecinos p, q por (1 − t)p + tq, y la lista se
 * acorta en uno. Las filas de mezclas forman un triángulo, y el punto de control P_k llega a su vértice de abajo por
 * C(n, k) caminos, cada uno con peso t^k (1 − t)^(n−k): por eso el resultado es la suma de los puntos de control con
 * los pesos de los polinomios de Bernstein (I.5, Salida).
 */

export type PuntoDelPlano = readonly [number, number];

/** La mezcla (1 − t)p + tq de dos puntos, coordenada por coordenada: la operación `mix` de GLSL o `lerp` de HLSL. */
export function mezclar(p: PuntoDelPlano, q: PuntoDelPlano, t: number): PuntoDelPlano {
  return [(1 - t) * p[0] + t * q[0], (1 - t) * p[1] + t * q[1]];
}

/**
 * Las vueltas del algoritmo, que forman el triángulo de las mezclas: la fila 0 son los puntos de control, cada fila
 * tiene un punto menos que la anterior, y la última tiene uno solo, el punto de la curva.
 */
export function vueltasDeCasteljau(puntos: readonly PuntoDelPlano[], t: number): PuntoDelPlano[][] {
  if (puntos.length === 0) throw new Error('Hace falta por lo menos un punto de control.');
  const filas: PuntoDelPlano[][] = [[...puntos]];
  let fila = filas[0]!;
  while (fila.length > 1) {
    fila = fila.slice(1).map((q, i) => mezclar(fila[i]!, q, t));
    filas.push(fila);
  }
  return filas;
}

/** El punto de la curva en t, como lo calcula el fragmento de la Entrada de I.5. */
export function deCasteljau(puntos: readonly PuntoDelPlano[], t: number): PuntoDelPlano {
  return vueltasDeCasteljau(puntos, t).at(-1)![0]!;
}

/**
 * El coeficiente binomial C(n, k), con la fórmula que multiplica y divide alternadamente: después del paso i vale
 * C(n, i + 1), así que cada división es exacta. Vale 0 si k < 0 o k > n.
 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let c = 1;
  for (let i = 0; i < Math.min(k, n - k); i++) c = (c * (n - i)) / (i + 1);
  return c;
}

/** Las filas 0 a n del triángulo de Pascal, cada número como suma de los dos de arriba. */
export function trianguloDePascal(n: number): number[][] {
  const filas: number[][] = [[1]];
  for (let r = 1; r <= n; r++) {
    const anterior = filas[r - 1]!;
    filas.push(Array.from({ length: r + 1 }, (_, k) => (anterior[k - 1] ?? 0) + (anterior[k] ?? 0)));
  }
  return filas;
}

/** El polinomio de Bernstein C(n, k) t^k (1 − t)^(n−k), con la convención 0⁰ = 1, la de Python y la de la obra. */
export function bernstein(n: number, k: number, t: number): number {
  return binomial(n, k) * t ** k * (1 - t) ** (n - k);
}

/** Los pesos de los n + 1 puntos de control en t. Suman 1, por el teorema del binomio. */
export function pesosDeBernstein(n: number, t: number): number[] {
  return Array.from({ length: n + 1 }, (_, k) => bernstein(n, k, t));
}

/** El punto de la curva en t, como suma de los puntos de control con sus pesos de Bernstein. */
export function curvaDeBezier(puntos: readonly PuntoDelPlano[], t: number): PuntoDelPlano {
  const pesos = pesosDeBernstein(puntos.length - 1, t);
  return puntos.reduce<PuntoDelPlano>((s, p, k) => [s[0] + pesos[k]! * p[0], s[1] + pesos[k]! * p[1]], [0, 0]);
}

/**
 * Cuántos caminos llevan del punto de control k a cada punto del triángulo de las mezclas. El punto j de la fila r
 * mezcla el j y el j + 1 de la fila anterior; un camino que baja r filas y toma i veces el vecino de la derecha (el
 * que entra con peso t) termina en j = k − i, así que hay C(r, k − j) caminos: el triángulo de Pascal, colgado de P_k.
 */
export function caminosDesde(n: number, k: number): number[][] {
  return Array.from({ length: n + 1 }, (_, r) => Array.from({ length: n + 1 - r }, (_, j) => binomial(r, k - j)));
}

/** Puntos de la curva para dibujarla: `cantidad` + 1 valores de t igualmente espaciados entre `desde` y `hasta`. */
export function muestrearCurva(puntos: readonly PuntoDelPlano[], cantidad: number, desde = 0, hasta = 1): PuntoDelPlano[] {
  return Array.from({ length: cantidad + 1 }, (_, i) => deCasteljau(puntos, desde + ((hasta - desde) * i) / cantidad));
}
