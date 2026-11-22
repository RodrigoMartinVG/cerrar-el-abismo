import { describe, expect, it } from 'vitest';
import {
  bernstein,
  binomial,
  caminosDesde,
  curvaDeBezier,
  deCasteljau,
  mezclar,
  muestrearCurva,
  pesosDeBernstein,
  trianguloDePascal,
  vueltasDeCasteljau,
  type PuntoDelPlano,
} from './bezier.ts';

/** El fragmento de la Entrada de I.5, traducido tal cual: mezclar de a dos hasta que quede un punto. */
function fragmentoDeLaEntrada(puntos: PuntoDelPlano[], t: number): PuntoDelPlano {
  while (puntos.length > 1)
    puntos = puntos.slice(0, -1).map((p, i) => [(1 - t) * p[0] + t * puntos[i + 1]![0], (1 - t) * p[1] + t * puntos[i + 1]![1]]);
  return puntos[0]!;
}

const CUBICA: PuntoDelPlano[] = [
  [0, 0],
  [2, 4],
  [6, 4],
  [8, 0],
];

describe('el algoritmo de De Casteljau y los polinomios de Bernstein (I.5)', () => {
  it('mezcla dos puntos con pesos 1 − t y t', () => {
    expect(mezclar([0, 0], [4, 8], 0.25)).toEqual([1, 2]);
    expect(mezclar([1, 2], [3, 5], 0)).toEqual([1, 2]);
    expect(mezclar([1, 2], [3, 5], 1)).toEqual([3, 5]);
  });

  it('arma el triángulo de las mezclas: cada vuelta tiene un punto menos', () => {
    const filas = vueltasDeCasteljau(CUBICA, 0.5);
    expect(filas.map((f) => f.length)).toEqual([4, 3, 2, 1]);
    expect(filas[1]).toEqual([
      [1, 2],
      [4, 4],
      [7, 2],
    ]);
    expect(filas[2]).toEqual([
      [2.5, 3],
      [5.5, 3],
    ]);
    expect(filas[3]).toEqual([[4, 3]]);
  });

  it('da lo mismo que el fragmento de la Entrada y que la suma con los pesos de Bernstein', () => {
    const puntos: PuntoDelPlano[] = [
      [0, 1],
      [1.5, 4.5],
      [3, 0],
      [5, 4.5],
      [8, 2],
    ];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const a = deCasteljau(puntos, t);
      const b = curvaDeBezier(puntos, t);
      const c = fragmentoDeLaEntrada(puntos, t);
      for (const q of [b, c]) {
        expect(q[0]).toBeCloseTo(a[0], 12);
        expect(q[1]).toBeCloseTo(a[1], 12);
      }
    }
  });

  it('empieza en el primer punto de control y termina en el último', () => {
    expect(deCasteljau(CUBICA, 0)).toEqual([0, 0]);
    expect(deCasteljau(CUBICA, 1)).toEqual([8, 0]);
  });

  it('calcula los coeficientes binomiales y el triángulo de Pascal', () => {
    expect(trianguloDePascal(6)[6]).toEqual([1, 6, 15, 20, 15, 6, 1]);
    for (let n = 0; n <= 30; n++) for (let k = 0; k <= n; k++) expect(binomial(n, k)).toBe(trianguloDePascal(n)[n]![k]);
    expect(binomial(5, -1)).toBe(0);
    expect(binomial(5, 6)).toBe(0);
    expect(binomial(52, 5)).toBe(2598960);
  });

  it('da los pesos de la Salida de I.5: con cuatro puntos y t = 1/4, 27/64, 27/64, 9/64 y 1/64', () => {
    const pesos = pesosDeBernstein(3, 0.25);
    [27, 27, 9, 1].forEach((numerador, k) => expect(pesos[k]).toBeCloseTo(numerador / 64, 15));
  });

  it('los pesos suman 1 y están entre 0 y 1, por el teorema del binomio', () => {
    for (let n = 1; n <= 8; n++)
      for (let i = 0; i <= 10; i++) {
        const pesos = pesosDeBernstein(n, i / 10);
        expect(pesos.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
        for (const p of pesos) expect(p >= 0 && p <= 1).toBe(true);
      }
    expect(bernstein(3, 0, 0)).toBe(1);
    expect(bernstein(3, 3, 1)).toBe(1);
  });

  it('cuenta los caminos desde cada punto de control: C(n, k) llegan al final', () => {
    for (let n = 1; n <= 6; n++)
      for (let k = 0; k <= n; k++) {
        const caminos = caminosDesde(n, k);
        expect(caminos.map((f) => f.length)).toEqual(Array.from({ length: n + 1 }, (_, r) => n + 1 - r));
        expect(caminos[0]).toEqual(Array.from({ length: n + 1 }, (_, j) => (j === k ? 1 : 0)));
        expect(caminos[n]).toEqual([binomial(n, k)]);
        // Cada punto recibe los caminos de los dos de arriba: la regla de Pascal.
        for (let r = 1; r <= n; r++)
          for (let j = 0; j <= n - r; j++) expect(caminos[r]![j]).toBe(caminos[r - 1]![j]! + caminos[r - 1]![j + 1]!);
      }
  });

  it('muestrea la curva de un extremo al otro', () => {
    const muestras = muestrearCurva(CUBICA, 8);
    expect(muestras).toHaveLength(9);
    expect(muestras[0]).toEqual([0, 0]);
    expect(muestras[4]).toEqual([4, 3]);
    expect(muestras[8]).toEqual([8, 0]);
  });
});
