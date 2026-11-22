/**
 * LA BIBLIOTECA COMÚN DE LAS DEMOS 3D (especificación, 11.2 y 16.1, fase 0). Las cuentas que comparten todas las
 * escenas de la obra, en sus convenciones (especificación, 12):
 *
 * - vectores columna, y las matrices actúan por la izquierda: y = M x, y (AB) x = A (B x);
 * - las matrices 4 × 4 se guardan por columnas, como en WGSL y glTF: el elemento de la fila i y la columna j está en
 *   el lugar 4j + i, y la traslación ocupa los lugares 12, 13 y 14;
 * - sistema dextrógiro con Y hacia arriba, y la cámara mira hacia −Z;
 * - la profundidad, después de la proyección, va de 0 en el plano cercano a 1 en el lejano, como en WebGPU;
 * - los cuaterniones se escriben (w, x, y, z), con w la parte real;
 * - los ángulos, en radianes.
 *
 * No depende de ninguna biblioteca: las piezas que usan Three.js le pasan estas matrices, y las que dibujan en un
 * lienzo 2D usan `proyectarAlambre`.
 */

export type Vec3 = readonly [number, number, number];
/** Una matriz 4 × 4 guardada por columnas: `m[4 * j + i]` es el elemento de la fila i y la columna j. */
export type Mat4 = Float32Array;
/** Un cuaternión (w, x, y, z). */
export type Cuaternion = readonly [number, number, number, number];

export const suma = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const resta = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const escalar = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const punto = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cruz = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norma = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
export function normalizar(a: Vec3): Vec3 {
  const n = norma(a);
  if (n === 0) throw new Error('No se puede normalizar el vector nulo.');
  return escalar(a, 1 / n);
}

/** El elemento de la fila i y la columna j. */
export const elemento = (m: Mat4, i: number, j: number): number => m[4 * j + i]!;

/** Una matriz a partir de sus filas, que es como se escribe en el papel; se guarda por columnas. */
export function deFilas(filas: readonly (readonly number[])[]): Mat4 {
  const m = new Float32Array(16);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) m[4 * j + i] = filas[i]![j]!;
  return m;
}

export const identidad = (): Mat4 =>
  deFilas([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

/** El producto A B: aplicar A B a un punto es aplicar primero B y después A. */
export function producto(a: Mat4, b: Mat4): Mat4 {
  const m = new Float32Array(16);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += elemento(a, i, k) * elemento(b, k, j);
      m[4 * j + i] = s;
    }
  return m;
}

export const traslacion = (t: Vec3): Mat4 =>
  deFilas([
    [1, 0, 0, t[0]],
    [0, 1, 0, t[1]],
    [0, 0, 1, t[2]],
    [0, 0, 0, 1],
  ]);

export const escala = (s: Vec3): Mat4 =>
  deFilas([
    [s[0], 0, 0, 0],
    [0, s[1], 0, 0],
    [0, 0, s[2], 0],
    [0, 0, 0, 1],
  ]);

/** Rotación de ángulo `a` alrededor de un eje de coordenadas, en sentido antihorario mirando desde la punta del eje. */
export function rotacion(eje: 'x' | 'y' | 'z', a: number): Mat4 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  if (eje === 'x')
    return deFilas([
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1],
    ]);
  if (eje === 'y')
    return deFilas([
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1],
    ]);
  return deFilas([
    [c, -s, 0, 0],
    [s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
}

/** Aplica la matriz a un punto (w = 1) y divide por la cuarta coordenada. */
export function aplicarAPunto(m: Mat4, p: Vec3): Vec3 {
  const x = elemento(m, 0, 0) * p[0] + elemento(m, 0, 1) * p[1] + elemento(m, 0, 2) * p[2] + elemento(m, 0, 3);
  const y = elemento(m, 1, 0) * p[0] + elemento(m, 1, 1) * p[1] + elemento(m, 1, 2) * p[2] + elemento(m, 1, 3);
  const z = elemento(m, 2, 0) * p[0] + elemento(m, 2, 1) * p[1] + elemento(m, 2, 2) * p[2] + elemento(m, 2, 3);
  const w = elemento(m, 3, 0) * p[0] + elemento(m, 3, 1) * p[1] + elemento(m, 3, 2) * p[2] + elemento(m, 3, 3);
  return [x / w, y / w, z / w];
}

/** Aplica la parte lineal de la matriz a un vector (w = 0): las direcciones no se trasladan. */
export function aplicarAVector(m: Mat4, v: Vec3): Vec3 {
  return [0, 1, 2].map((i) => elemento(m, i, 0) * v[0] + elemento(m, i, 1) * v[1] + elemento(m, i, 2) * v[2]) as [
    number,
    number,
    number,
  ];
}

/**
 * La matriz de vista de una cámara en `ojo` que mira hacia `objetivo`, con `arriba` como referencia: lleva el ojo al
 * origen y la dirección de la mirada a −Z, en un sistema dextrógiro.
 */
export function mirarHacia(ojo: Vec3, objetivo: Vec3, arriba: Vec3 = [0, 1, 0]): Mat4 {
  const atras = normalizar(resta(ojo, objetivo));
  const derecha = normalizar(cruz(arriba, atras));
  const arribaReal = cruz(atras, derecha);
  return deFilas([
    [derecha[0], derecha[1], derecha[2], -punto(derecha, ojo)],
    [arribaReal[0], arribaReal[1], arribaReal[2], -punto(arribaReal, ojo)],
    [atras[0], atras[1], atras[2], -punto(atras, ojo)],
    [0, 0, 0, 1],
  ]);
}

/**
 * La proyección perspectiva con campo de visión vertical `fovy`, relación de aspecto ancho/alto, y planos cercano y
 * lejano a distancias `cerca` y `lejos` delante de la cámara. Lleva el plano cercano a la profundidad 0 y el lejano a
 * la 1, como WebGPU (no a −1 y 1, como WebGL).
 */
export function perspectiva(fovy: number, aspecto: number, cerca: number, lejos: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2);
  return deFilas([
    [f / aspecto, 0, 0, 0],
    [0, f, 0, 0],
    [0, 0, lejos / (cerca - lejos), (cerca * lejos) / (cerca - lejos)],
    [0, 0, -1, 0],
  ]);
}

/** La matriz que transforma las normales: la inversa transpuesta de la parte lineal (II.5), como matriz 3 × 3 por filas. */
export function matrizDeNormales(m: Mat4): number[][] {
  const g = (i: number, j: number) => elemento(m, i, j);
  const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = [
    g(0, 0),
    g(0, 1),
    g(0, 2),
    g(1, 0),
    g(1, 1),
    g(1, 2),
    g(2, 0),
    g(2, 1),
    g(2, 2),
  ];
  const cof = [
    [a11 * a22 - a12 * a21, -(a10 * a22 - a12 * a20), a10 * a21 - a11 * a20],
    [-(a01 * a22 - a02 * a21), a00 * a22 - a02 * a20, -(a00 * a21 - a01 * a20)],
    [a01 * a12 - a02 * a11, -(a00 * a12 - a02 * a10), a00 * a11 - a01 * a10],
  ];
  const det = a00 * cof[0]![0]! + a01 * cof[0]![1]! + a02 * cof[0]![2]!;
  if (Math.abs(det) < 1e-12) throw new Error('La parte lineal no es invertible.');
  // La inversa es la adjunta (la transpuesta de los cofactores) dividida por el determinante; su transpuesta son los
  // cofactores divididos por el determinante.
  return cof.map((fila) => fila.map((c) => c / det));
}

/** El cuaternión de una rotación de ángulo `a` alrededor del eje unitario `eje`. */
export function cuaternionDeEje(eje: Vec3, a: number): Cuaternion {
  const [x, y, z] = normalizar(eje);
  const s = Math.sin(a / 2);
  return [Math.cos(a / 2), x * s, y * s, z * s];
}

/** El producto de Hamilton: rotar por q después de r es rotar por q r. */
export function productoDeCuaterniones(q: Cuaternion, r: Cuaternion): Cuaternion {
  const [w1, x1, y1, z1] = q;
  const [w2, x2, y2, z2] = r;
  return [
    w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
    w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
    w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
    w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
  ];
}

/** La matriz de rotación de un cuaternión unitario. */
export function matrizDeCuaternion(q: Cuaternion): Mat4 {
  const [w, x, y, z] = q;
  return deFilas([
    [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y), 0],
    [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x), 0],
    [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y), 0],
    [0, 0, 0, 1],
  ]);
}

/** La interpolación esférica entre dos cuaterniones unitarios, por el camino corto. */
export function slerp(q: Cuaternion, r: Cuaternion, t: number): Cuaternion {
  let c = q[0] * r[0] + q[1] * r[1] + q[2] * r[2] + q[3] * r[3];
  let rr: Cuaternion = r;
  if (c < 0) {
    rr = [-r[0], -r[1], -r[2], -r[3]];
    c = -c;
  }
  if (c > 0.9995) {
    const m = q.map((v, i) => v + t * (rr[i]! - v));
    const n = Math.hypot(...m);
    return m.map((v) => v / n) as unknown as Cuaternion;
  }
  const angulo = Math.acos(c);
  const a = Math.sin((1 - t) * angulo) / Math.sin(angulo);
  const b = Math.sin(t * angulo) / Math.sin(angulo);
  return q.map((v, i) => a * v + b * rr[i]!) as unknown as Cuaternion;
}

/**
 * Proyecta un modelo de alambre a un lienzo de `ancho` × `alto` píxeles con la matriz `mvp` (proyección · vista ·
 * modelo): devuelve los segmentos en píxeles, con el origen arriba a la izquierda, y descarta los que tienen algún
 * extremo detrás de la cámara o fuera del rango de profundidad.
 */
export function proyectarAlambre(
  vertices: readonly Vec3[],
  aristas: readonly (readonly [number, number])[],
  mvp: Mat4,
  ancho: number,
  alto: number,
): [number, number, number, number][] {
  const enPantalla = vertices.map((v) => {
    const w = elemento(mvp, 3, 0) * v[0] + elemento(mvp, 3, 1) * v[1] + elemento(mvp, 3, 2) * v[2] + elemento(mvp, 3, 3);
    if (w <= 0) return undefined;
    const [x, y, z] = aplicarAPunto(mvp, v);
    if (z < 0 || z > 1) return undefined;
    return [((x + 1) / 2) * ancho, ((1 - y) / 2) * alto] as const;
  });
  const segmentos: [number, number, number, number][] = [];
  for (const [i, j] of aristas) {
    const a = enPantalla[i];
    const b = enPantalla[j];
    if (a && b) segmentos.push([a[0], a[1], b[0], b[1]]);
  }
  return segmentos;
}

/** Un cubo de lado 2 centrado en el origen, como modelo de alambre: sus 8 vértices y sus 12 aristas. */
export function cubo(): { vertices: Vec3[]; aristas: [number, number][] } {
  const vertices: Vec3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) vertices.push([x, y, z]);
  const aristas: [number, number][] = [];
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const distintos = [0, 1, 2].filter((k) => vertices[i]![k] !== vertices[j]![k]).length;
      if (distintos === 1) aristas.push([i, j]);
    }
  return { vertices, aristas };
}
