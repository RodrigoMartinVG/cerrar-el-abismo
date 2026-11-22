import { describe, expect, it } from 'vitest';
import {
  bitsDe,
  copiasCorridas,
  escribirByte,
  gradoEnF2,
  inversoDeByte,
  leerByte,
  multiplicarBytes,
  POLINOMIOS_DE_REDUCCION,
  polinomioDeBits,
  potenciaDeX,
  productoSinAcarreo,
  reduccionPasoAPaso,
  xtime,
} from './cuerpos-finitos.ts';

const { aes, qr, reducible } = POLINOMIOS_DE_REDUCCION;
const producto = (a: number, b: number, m: number = aes) => multiplicarBytes(a, b, m).resultado;

describe('la multiplicación de bytes en GF(2⁸) (I.8)', () => {
  it('reproduce el ejemplo de la norma FIPS 197: 0x57 · 0x83 = 0xC1, con sus pasos', () => {
    const r = multiplicarBytes(0x57, 0x83);
    expect(r.copias).toEqual([
      { bit: 0, valor: 0x57 },
      { bit: 1, valor: 0xae },
      { bit: 7, valor: 0x2b80 },
    ]);
    expect(r.sinAcarreo).toBe(0x2b79);
    expect(polinomioDeBits(r.sinAcarreo)).toBe('x¹³ + x¹¹ + x⁹ + x⁸ + x⁶ + x⁵ + x⁴ + x³ + 1');
    expect(r.pasos.map((p) => [p.grado, p.sumando, p.despues])).toEqual([
      [13, 0x2360, 0x819],
      [11, 0x8d8, 0xc1],
    ]);
    expect(r.resultado).toBe(0xc1);
    expect(polinomioDeBits(r.resultado)).toBe('x⁷ + x⁶ + 1');
  });

  it('reproduce la cadena de xtime de la norma, y 0x57 · 0x13 = 0xFE', () => {
    const cadena = [0x57];
    for (let i = 0; i < 7; i++) cadena.push(xtime(cadena.at(-1)!));
    expect(cadena).toEqual([0x57, 0xae, 0x47, 0x8e, 0x07, 0x0e, 0x1c, 0x38]);
    expect(producto(0x57, 0x13)).toBe(0xfe);
  });

  it('multiplicar por 0x02 es xtime, y el resultado es siempre un byte', () => {
    for (let a = 0; a < 256; a++) {
      expect(producto(a, 0x02)).toBe(xtime(a));
      for (const b of [0x01, 0x03, 0x80, 0xff]) {
        const r = producto(a, b);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(256);
      }
    }
  });

  it('cumple las leyes de un anillo conmutativo con la suma «o exclusivo»', () => {
    const muestra = [0x00, 0x01, 0x02, 0x03, 0x1b, 0x53, 0x57, 0x80, 0x83, 0xca, 0xff];
    for (const a of muestra)
      for (const b of muestra) {
        expect(producto(a, b)).toBe(producto(b, a));
        for (const c of muestra) {
          expect(producto(a, b ^ c)).toBe(producto(a, b) ^ producto(a, c));
          expect(producto(producto(a, b), c)).toBe(producto(a, producto(b, c)));
        }
      }
    for (let a = 0; a < 256; a++) expect(producto(a, 1)).toBe(a);
  });

  it('con los polinomios irreducibles, todo byte no nulo tiene inverso; con x⁸ + 1, no', () => {
    expect(inversoDeByte(0x53)).toBe(0xca);
    for (const m of [aes, qr])
      for (let a = 1; a < 256; a++) {
        const inverso = inversoDeByte(a, m);
        expect(inverso).not.toBeNull();
        expect(producto(a, inverso!, m)).toBe(1);
      }
    // x⁸ + 1 = (x + 1)⁸, y 0xFF = x⁷ + … + 1 es (x⁸ + 1) / (x + 1): dos bytes no nulos con producto nulo.
    expect(producto(0x03, 0xff, reducible)).toBe(0);
    expect(inversoDeByte(0x03, reducible)).toBeNull();
    expect(inversoDeByte(0x02, reducible)).toBe(0x80);
  });

  it('cada paso de la reducción baja el grado, y el resto tiene grado menor que 8', () => {
    for (const [a, b] of [
      [0xff, 0xff],
      [0x80, 0x80],
      [0x57, 0x83],
    ] as const) {
      const pasos = reduccionPasoAPaso(productoSinAcarreo(a, b), aes);
      for (const p of pasos) expect(gradoEnF2(p.despues)).toBeLessThan(p.grado);
      expect(gradoEnF2(multiplicarBytes(a, b).resultado)).toBeLessThan(8);
    }
    expect(reduccionPasoAPaso(0x57, aes)).toEqual([]);
    expect(() => reduccionPasoAPaso(0x57, 1)).toThrow();
  });

  it('hay una copia por cada bit de b que vale 1', () => {
    expect(copiasCorridas(0x57, 0x00)).toEqual([]);
    expect(copiasCorridas(0x57, 0xff)).toHaveLength(8);
    expect(productoSinAcarreo(0b11, 0b11)).toBe(0b101);
  });

  it('rechaza lo que no es un byte', () => {
    expect(() => multiplicarBytes(256, 1)).toThrow(RangeError);
    expect(() => multiplicarBytes(-1, 1)).toThrow(RangeError);
  });

  it('escribe y lee bytes y polinomios', () => {
    expect(polinomioDeBits(aes)).toBe('x⁸ + x⁴ + x³ + x + 1');
    expect(polinomioDeBits(0)).toBe('0');
    expect(polinomioDeBits(1)).toBe('1');
    expect(polinomioDeBits(0x1b)).toBe('x⁴ + x³ + x + 1');
    expect([0, 1, 2, 7, 10, 14].map(potenciaDeX)).toEqual(['1', 'x', 'x²', 'x⁷', 'x¹⁰', 'x¹⁴']);
    expect(gradoEnF2(0)).toBe(-1);
    expect(gradoEnF2(0x11b)).toBe(8);
    expect(bitsDe(0x57, 8)).toBe('01010111');
    expect(bitsDe(0x2b79, 15)).toBe('010101101111001');
    expect(leerByte('0x57')).toBe(0x57);
    expect(leerByte(' c1 ')).toBe(0xc1);
    expect(leerByte('FF')).toBe(255);
    expect(leerByte('7')).toBe(7);
    for (const malo of ['', '100', 'zz', '0x', '-1']) expect(leerByte(malo)).toBeNull();
    expect(escribirByte(0xc1)).toBe('0xC1');
    expect(escribirByte(5)).toBe('0x05');
  });
});
