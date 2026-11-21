import { describe, expect, it } from 'vitest';
import { cubeta, dispersionPolinomial, dispersionSuma, leerClaves, repartir } from './dispersion.ts';

describe('la dispersión en cubetas (I.2)', () => {
  it('reproduce String.hashCode de Java, con el desborde de 32 bits', () => {
    expect(dispersionPolinomial('')).toBe(0);
    expect(dispersionPolinomial('a')).toBe(97);
    expect(dispersionPolinomial('hola')).toBe(3208380);
    // «polygenelubricants» es un ejemplo conocido cuyo hashCode en Java es Integer.MIN_VALUE.
    expect(dispersionPolinomial('polygenelubricants')).toBe(-(2 ** 31));
  });

  it('la suma de códigos no distingue anagramas', () => {
    expect(dispersionSuma('amor')).toBe(dispersionSuma('roma'));
    expect(dispersionPolinomial('amor')).not.toBe(dispersionPolinomial('roma'));
  });

  it('la cubeta está entre 0 y m − 1, también para valores negativos', () => {
    for (const h of [-17, -1, 0, 5, 2 ** 31 - 1, -(2 ** 31)]) {
      const c = cubeta(h, 7);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(7);
      expect(Math.abs((h - c) % 7)).toBe(0);
    }
  });

  it('lee las claves como un conjunto: sin repetir', () => {
    expect(leerClaves('ana, luis\neva  ana;sol')).toEqual(['ana', 'luis', 'eva', 'sol']);
  });

  it('las cubetas son una partición de las claves, y alguna tiene al menos ⌈n/m⌉', () => {
    const claves = leerClaves('ana luis eva juan sol amor roma mora ramo pedro');
    for (const funcion of ['suma', 'polinomial'] as const)
      for (let m = 1; m <= 12; m++) {
        const r = repartir(claves, m, funcion);
        expect(r.cubetas.flat().sort()).toEqual([...claves].sort());
        expect(r.maxima).toBeGreaterThanOrEqual(r.garantia);
        expect(r.inyectiva).toBe(r.cubetas.every((c) => c.length <= 1));
        if (claves.length > m) expect(r.inyectiva).toBe(false);
      }
  });
});
