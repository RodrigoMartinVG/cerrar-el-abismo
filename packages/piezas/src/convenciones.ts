/**
 * La matemática del conversor de convenciones (especificación, 8.5 y 12). La obra escribe una transformación con
 * vectores columna, en un sistema de mano derecha y almacenada por columnas. Aquí se traduce esa misma transformación a
 * las otras convenciones y se dice cómo queda en memoria, y se escriben la métrica de Minkowski y las coordenadas
 * esféricas en sus dos convenciones.
 */

export type Mano = 'derecha' | 'izquierda';
export type TipoDeVector = 'columna' | 'fila';
export type Almacenamiento = 'columnas' | 'filas';
/** Una matriz 4 × 4, por filas: `m[i][j]` es la entrada de la fila i y la columna j. */
export type Matriz4 = number[][];

/** La rotación de ángulo `alfa` (en radianes) alrededor del eje Y seguida de la traslación `t`, en la convención de la obra. */
export function transformacion(alfa: number, t: [number, number, number]): Matriz4 {
  const c = Math.cos(alfa);
  const s = Math.sin(alfa);
  return [
    [c, 0, s, t[0]],
    [0, 1, 0, t[1]],
    [-s, 0, c, t[2]],
    [0, 0, 0, 1],
  ];
}

export function transpuesta(m: Matriz4): Matriz4 {
  return m[0]!.map((_, j) => m.map((fila) => fila[j]!));
}

/**
 * La misma transformación en otra convención. Pasar a mano izquierda es cambiar el signo de la coordenada z, que es
 * conjugar por S = diag(1, 1, −1, 1); pasar a vectores fila es transponer, porque y = Mx equivale a yᵀ = xᵀMᵀ.
 */
export function enConvencion(m: Matriz4, mano: Mano, vector: TipoDeVector): Matriz4 {
  const signo = [1, 1, mano === 'izquierda' ? -1 : 1, 1];
  const conjugada = m.map((fila, i) => fila.map((x, j) => signo[i]! * x * signo[j]!));
  return vector === 'fila' ? transpuesta(conjugada) : conjugada;
}

/** Los 16 números en el orden en que quedan en memoria. */
export function enMemoria(m: Matriz4, almacenamiento: Almacenamiento): number[] {
  return almacenamiento === 'filas' ? m.flat() : transpuesta(m).flat();
}

/** La matriz de la métrica de Minkowski y la forma del intervalo, en cada signatura. */
export function metrica(signatura: '-+++' | '+---'): { diagonal: number[]; intervalo: string } {
  return signatura === '-+++'
    ? { diagonal: [-1, 1, 1, 1], intervalo: 'ds² = −c²dt² + dx² + dy² + dz²' }
    : { diagonal: [1, -1, -1, -1], intervalo: 'ds² = c²dt² − dx² − dy² − dz²' };
}

/** Las coordenadas esféricas: θ polar y φ azimutal (ISO 80000-2, la de la obra), o al revés, como muchos textos de cálculo. */
export function esfericas(convencion: 'iso' | 'calculo'): { x: string; y: string; z: string; nota: string } {
  return convencion === 'iso'
    ? {
        x: 'r sen θ cos φ',
        y: 'r sen θ sen φ',
        z: 'r cos θ',
        nota: 'θ es el ángulo con el eje z, entre 0 y π; φ es el azimut, entre 0 y 2π.',
      }
    : {
        x: 'r cos θ sen φ',
        y: 'r sen θ sen φ',
        z: 'r cos φ',
        nota: 'θ es el azimut, entre 0 y 2π; φ es el ángulo con el eje z, entre 0 y π.',
      };
}
