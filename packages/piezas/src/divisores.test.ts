import { describe, expect, it } from 'vitest';
import {
  aristasDeHasse,
  complemento,
  cubre,
  divisores,
  esBooleano,
  factorizar,
  mcmNatural,
  posicionesDeHasse,
  rango,
} from './divisores.ts';
import { mcdNatural } from './modular.ts';

describe('el retículo de los divisores (I.7)', () => {
  it('encuentra los divisores y la factorización', () => {
    expect(divisores(60)).toEqual([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]);
    expect(divisores(1)).toEqual([1]);
    expect(divisores(49)).toEqual([1, 7, 49]);
    expect(factorizar(360)).toEqual([
      [2, 3],
      [3, 2],
      [5, 1],
    ]);
    expect(rango(360)).toBe(6);
  });

  it('el mcd es el ínfimo y el mcm el supremo en la divisibilidad', () => {
    for (const n of [12, 30, 60, 72, 210]) {
      const ds = divisores(n);
      for (const a of ds)
        for (const b of ds) {
          const cotasInferiores = ds.filter((c) => a % c === 0 && b % c === 0);
          const cotasSuperiores = ds.filter((c) => c % a === 0 && c % b === 0);
          expect(Math.max(...cotasInferiores)).toBe(mcdNatural(a, b));
          expect(cotasInferiores.every((c) => mcdNatural(a, b) % c === 0)).toBe(true);
          expect(cotasSuperiores.every((c) => c % mcmNatural(a, b) === 0)).toBe(true);
        }
    }
  });

  it('el diagrama de Hasse tiene una arista por cada multiplicación por un primo', () => {
    expect(cubre(2, 6)).toBe(true);
    expect(cubre(2, 12)).toBe(false);
    expect(cubre(3, 3)).toBe(false);
    // Con n = p^a q^b r^c, cada divisor tiene un cubridor por cada primo cuyo exponente aún puede crecer.
    expect(aristasDeHasse(60)).toHaveLength(20);
    expect(aristasDeHasse(30)).toHaveLength(12);
  });

  it('las posiciones no se superponen y la altura es el rango', () => {
    for (const n of [60, 90, 210, 360, 64]) {
      const posiciones = posicionesDeHasse(n);
      const claves = new Set([...posiciones.values()].map(([x, y]) => `${x},${y}`));
      expect(claves.size).toBe(divisores(n).length);
      for (const [d, [, y]] of posiciones) expect(y).toBe(rango(d));
    }
  });

  it('es un álgebra de Boole exactamente cuando n no tiene cuadrados', () => {
    for (let n = 1; n <= 200; n++) {
      const todos = divisores(n).every((d) => complemento(d, n) !== null);
      expect(todos).toBe(esBooleano(n));
    }
    expect(complemento(4, 60)).toBe(15);
    expect(complemento(2, 60)).toBeNull();
  });
});
