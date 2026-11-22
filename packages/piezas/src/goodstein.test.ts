import { describe, expect, it } from 'vitest';
import {
  comienzoDeGoodstein,
  compararOrdinales,
  escrituraHereditaria,
  parEnOmegaCuadrado,
  pasoDeGoodstein,
  pasosHastaCero,
  sucesionDeGoodstein,
  textoHereditario,
  textoOrdinal,
  valorEnBase,
  type TerminoDeGoodstein,
} from './goodstein.ts';

/** Todos los términos desde n en la base dada, hasta `cuantos` o hasta 0. */
function terminos(n: bigint, base: bigint, cuantos: number): TerminoDeGoodstein[] {
  const lista: TerminoDeGoodstein[] = [];
  let t: TerminoDeGoodstein | null = comienzoDeGoodstein(n, base);
  while (t && lista.length < cuantos) {
    lista.push(t);
    t = pasoDeGoodstein(t);
  }
  return lista;
}

describe('las sucesiones de Goodstein (I.11)', () => {
  it('escribe en base hereditaria y vuelve a leer el mismo número', () => {
    expect(textoHereditario(escrituraHereditaria(26n, 3n), '3')).toBe('2·3^2 + 2·3 + 2');
    expect(textoHereditario(escrituraHereditaria(4n, 2n), '2')).toBe('2^2');
    expect(textoHereditario(escrituraHereditaria(11n, 2n), '2')).toBe('2^(2 + 1) + 2 + 1');
    expect(textoHereditario(escrituraHereditaria(16n, 2n), '2')).toBe('2^(2^2)');
    expect(textoHereditario(escrituraHereditaria(0n, 5n), '5')).toBe('0');
    for (const base of [2n, 3n, 7n])
      for (let n = 0n; n < 300n; n++) expect(valorEnBase(escrituraHereditaria(n, base), base)).toBe(n);
  });

  it('da los términos de la celda del capítulo', () => {
    expect(sucesionDeGoodstein(3n, 12)).toEqual([3n, 3n, 3n, 2n, 1n, 0n]);
    expect(sucesionDeGoodstein(4n, 12)).toEqual([4n, 26n, 41n, 60n, 83n, 109n, 139n, 173n, 211n, 253n, 299n, 348n]);
    expect(sucesionDeGoodstein(5n, 5)).toEqual([5n, 27n, 255n, 467n, 775n]);
    expect(sucesionDeGoodstein(1n, 5)).toEqual([1n, 0n]);
    expect(sucesionDeGoodstein(2n, 5)).toEqual([2n, 2n, 1n, 0n]);
  });

  it('escribe el ordinal de cada término en forma normal de Cantor', () => {
    expect(terminos(4n, 2n, 4).map((t) => textoOrdinal(t.escritura))).toEqual([
      'ω^ω',
      'ω^2·2 + ω·2 + 2',
      'ω^2·2 + ω·2 + 1',
      'ω^2·2 + ω·2',
    ]);
    expect(terminos(3n, 2n, 10).map((t) => textoOrdinal(t.escritura))).toEqual(['ω + 1', 'ω', '3', '2', '1', '0']);
    expect(textoOrdinal(escrituraHereditaria(11n, 2n))).toBe('ω^(ω + 1) + ω + 1');
    expect(textoOrdinal(escrituraHereditaria(16n, 2n))).toBe('ω^(ω^ω)');
  });

  it('los ordinales bajan en cada paso, aunque los términos crezcan', () => {
    for (const [n, base] of [
      [4n, 2n],
      [5n, 2n],
      [11n, 2n],
      [15n, 2n],
      [100n, 3n],
      [11n, 4n],
    ] as const) {
      const lista = terminos(n, base, 80);
      for (let i = 1; i < lista.length; i++)
        expect(compararOrdinales(lista[i]!.escritura, lista[i - 1]!.escritura)).toBeLessThan(0);
    }
    expect(terminos(4n, 2n, 80).at(-1)!.valor).toBeGreaterThan(1000n);
  });

  it('compara ordinales como la forma normal de Cantor', () => {
    const o = (n: bigint, base: bigint) => escrituraHereditaria(n, base);
    // ω^ω > ω^2·2 + ω·2 + 2 > ω·5 + 9 > ω·5 > 9.
    expect(compararOrdinales(o(4n, 2n), o(26n, 3n))).toBeGreaterThan(0);
    expect(compararOrdinales(o(26n, 3n), o(59n, 10n))).toBeGreaterThan(0);
    expect(compararOrdinales(o(59n, 10n), o(50n, 10n))).toBeGreaterThan(0);
    expect(compararOrdinales(o(50n, 10n), o(9n, 10n))).toBeGreaterThan(0);
    expect(compararOrdinales(o(9n, 10n), o(9n, 12n))).toBe(0);
  });

  it('reconoce los ordinales menores que ω² como pares de ℕ × ℕ', () => {
    expect(parEnOmegaCuadrado(escrituraHereditaria(11n, 4n))).toEqual([2n, 3n]);
    expect(parEnOmegaCuadrado(escrituraHereditaria(3n, 2n))).toEqual([1n, 1n]);
    expect(parEnOmegaCuadrado(escrituraHereditaria(7n, 9n))).toEqual([0n, 7n]);
    expect(parEnOmegaCuadrado(escrituraHereditaria(0n, 9n))).toEqual([0n, 0n]);
    expect(parEnOmegaCuadrado(escrituraHereditaria(4n, 2n))).toBeNull();
    expect(parEnOmegaCuadrado(escrituraHereditaria(26n, 3n))).toBeNull();
  });

  it('cuenta los pasos que faltan dentro de ω², y coinciden con los de la sucesión', () => {
    expect(pasosHastaCero(2n, 3n, 4n)).toBe(27n);
    expect(pasosHastaCero(1n, 1n, 2n)).toBe(5n);
    for (let base = 2n; base <= 7n; base++)
      for (let a = 0n; a < base; a++)
        for (let c = 0n; c < base; c++) {
          const lista = terminos(a * base + c, base, 100_000);
          expect(lista.at(-1)!.valor).toBe(0n);
          expect(BigInt(lista.length - 1)).toBe(pasosHastaCero(a, c, base));
          // Mientras tanto, el par (a, c) baja en el orden lexicográfico.
          for (let i = 1; i < lista.length; i++) {
            const [a1, c1] = parEnOmegaCuadrado(lista[i - 1]!.escritura)!;
            const [a2, c2] = parEnOmegaCuadrado(lista[i]!.escritura)!;
            expect(a2 < a1 || (a2 === a1 && c2 < c1)).toBe(true);
          }
        }
  });

  it('se detiene cuando un término no cabe, en lugar de colgarse', () => {
    // Desde 16 = 2^(2^2), los términos tienen del orden de 2b² cifras en base b: pasan de 2000 bits antes de b = 20.
    let t: TerminoDeGoodstein = comienzoDeGoodstein(16n, 2n);
    let siguiente = pasoDeGoodstein(t, 2000);
    while (siguiente) {
      t = siguiente;
      siguiente = pasoDeGoodstein(t, 2000);
    }
    expect(t.valor).toBeGreaterThan(0n);
    expect(t.valor.toString(2).length).toBeLessThanOrEqual(2000);
    expect(t.paso).toBeLessThan(20);
  });
});
