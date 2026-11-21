import { describe, expect, it } from 'vitest';
import { cuadradosDeEuclides, escribirPaso, mcd, pasosDeEuclides } from './euclides.ts';

/** El máximo común divisor por fuerza bruta, para comparar. */
function mcdIngenuo(a: number, b: number): number {
  for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d;
  return 1;
}

describe('el rectángulo de Euclides (I.3)', () => {
  it('cada paso es una división con resto, y el último divisor es el máximo común divisor', () => {
    for (let a = 1; a <= 40; a++)
      for (let b = 1; b <= 40; b++) {
        const pasos = pasosDeEuclides(a, b);
        for (const p of pasos) {
          expect(p.a).toBe(p.q * p.b + p.r);
          expect(p.r).toBeGreaterThanOrEqual(0);
          expect(p.r).toBeLessThan(p.b);
        }
        expect(pasos.at(-1)!.r).toBe(0);
        expect(mcd(a, b)).toBe(mcdIngenuo(a, b));
      }
  });

  it('los cuadrados cubren el rectángulo sin superponerse, y el más chico mide el máximo común divisor', () => {
    for (const [a, b] of [
      [84, 60],
      [21, 13],
      [7, 7],
      [1, 30],
      [30, 1],
      [55, 34],
    ] as const) {
      const cuadrados = cuadradosDeEuclides(a, b);
      expect(cuadrados.reduce((s, c) => s + c.lado * c.lado, 0)).toBe(a * b);
      for (const c of cuadrados) {
        expect(c.x + c.lado).toBeLessThanOrEqual(a);
        expect(c.y + c.lado).toBeLessThanOrEqual(b);
      }
      for (let i = 0; i < cuadrados.length; i++)
        for (let j = i + 1; j < cuadrados.length; j++) {
          const p = cuadrados[i]!;
          const q = cuadrados[j]!;
          const separados = p.x + p.lado <= q.x || q.x + q.lado <= p.x || p.y + p.lado <= q.y || q.y + q.lado <= p.y;
          expect(separados).toBe(true);
        }
      expect(Math.min(...cuadrados.map((c) => c.lado))).toBe(mcd(a, b));
      expect(cuadrados.length).toBe(pasosDeEuclides(a, b).reduce((s, p) => s + p.q, 0));
    }
  });

  it('escribe cada paso como una división con resto', () => {
    expect(pasosDeEuclides(84, 60).map(escribirPaso)).toEqual(['84 = 1 · 60 + 24', '60 = 2 · 24 + 12', '24 = 2 · 12 + 0']);
  });

  it('rechaza lo que no son enteros positivos', () => {
    expect(() => pasosDeEuclides(0, 5)).toThrow();
    expect(() => pasosDeEuclides(2.5, 5)).toThrow();
  });
});
