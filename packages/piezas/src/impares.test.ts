import { describe, expect, it } from 'vitest';
import { capa, igualdad, impares } from './impares.ts';

describe('el cuadrado de impares (I.1)', () => {
  it('la capa k de un cuadrado de n × n tiene 2k + 1 cuadraditos', () => {
    const n = 7;
    for (let k = 0; k < n; k++) {
      let cuenta = 0;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (capa(i, j) === k) cuenta++;
      expect(cuenta).toBe(2 * k + 1);
    }
  });

  it('la suma de los primeros n impares es n²', () => {
    for (let n = 0; n <= 20; n++) expect(impares(n).reduce((a, b) => a + b, 0)).toBe(n * n);
  });

  it('escribe la igualdad que muestra la pieza', () => {
    expect(igualdad(3)).toBe('1 + 3 + 5 = 9 = 3²');
  });
});
