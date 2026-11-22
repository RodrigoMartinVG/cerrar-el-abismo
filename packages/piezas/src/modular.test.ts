import { describe, expect, it } from 'vitest';
import { cuerdas, inversoModular, mcdNatural, tamanoDeLaImagen } from './modular.ts';

describe('la multiplicación modular (I.4)', () => {
  it('el inverso existe exactamente cuando a y n son coprimos, y lo es', () => {
    for (let n = 2; n <= 60; n++)
      for (let a = 0; a < n; a++) {
        const inv = inversoModular(a, n);
        if (mcdNatural(a, n) === 1) {
          expect(inv).not.toBeNull();
          expect((a * inv!) % n).toBe(1);
        } else expect(inv).toBeNull();
      }
  });

  it('la imagen de la multiplicación por a tiene n / mcd(a, n) elementos', () => {
    for (let n = 2; n <= 60; n++) for (let a = 1; a <= 30; a++) expect(tamanoDeLaImagen(n, a)).toBe(n / mcdNatural(a, n));
  });

  it('hay una cuerda por cada punto, y es una biyección cuando a y n son coprimos', () => {
    expect(cuerdas(10, 3)).toHaveLength(10);
    expect(new Set(cuerdas(10, 3).map(([, b]) => b)).size).toBe(10);
    expect(cuerdas(6, 2).map(([, b]) => b)).toEqual([0, 2, 4, 0, 2, 4]);
  });

  it('acepta enteros negativos en el inverso', () => {
    expect(inversoModular(-3, 7)).toBe(2);
  });
});
