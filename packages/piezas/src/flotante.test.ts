import { describe, expect, it } from 'vitest';
import {
  Racional,
  bitsSimple,
  cancelacion,
  errorRelativo,
  ordenDeLaSuma,
  redondearEnSistema,
  sistemaDeJuguete,
  sumaRepetida,
} from './flotante.ts';

describe('los racionales exactos', () => {
  it('leen un decimal por lo que dice, y un doble por lo que guarda', () => {
    expect(Racional.deDecimal('0.1')).toEqual(new Racional(1n, 10n));
    expect(Racional.deDecimal('-2.5e3')).toEqual(new Racional(-2500n));
    // El doble más cercano a 0,1 es 3602879701896397/2⁵⁵, un poco más que 0,1.
    expect(Racional.deDoble(0.1)).toEqual(new Racional(3602879701896397n, 2n ** 55n));
    expect(Racional.deDoble(0.1).menos(new Racional(1n, 10n)).num > 0n).toBe(true);
  });

  it('escriben su desarrollo decimal y una aproximación', () => {
    expect(new Racional(1n, 3n).decimal(5)).toBe('0,33333…');
    expect(new Racional(-7n, 4n).decimal(5)).toBe('−1,75');
    expect(new Racional(1n, 3n * 10n ** 40n).aproximado()).toBeCloseTo(3.333333333333333e-41, 55);
  });
});

describe('las tres cuentas', () => {
  it('sumar 0,1 diez veces: exacto da 1, la doble precisión no, y la simple tampoco', () => {
    const r = sumaRepetida('0.1', 10);
    expect(r.exacto).toEqual(new Racional(1n));
    expect(r.doble).toBe(0.9999999999999999);
    expect(r.simple).not.toBe(1);
    expect(errorRelativo(r.doble, r.exacto)).toBeCloseTo(1.1102230246251565e-16, 30);
  });

  it('el orden de la suma: con el 1 primero, los sumandos chicos se pierden en precisión simple', () => {
    const grande = ordenDeLaSuma(10000, 'grande-primero');
    const chicos = ordenDeLaSuma(10000, 'chicos-primero');
    expect(grande.exacto).toEqual(new Racional(10001n, 10000n));
    expect(grande.simple).toBe(1);
    expect(errorRelativo(chicos.simple, chicos.exacto)).toBeLessThan(1e-6);
    expect(errorRelativo(chicos.doble, chicos.exacto)).toBeLessThan(errorRelativo(grande.doble, grande.exacto));
  });

  it('(1 + x) − 1 con x chico pierde todo en simple y casi todo en doble', () => {
    const r = cancelacion('1e-8');
    expect(r.simple).toBe(0);
    expect(r.doble).not.toBe(1e-8);
  });

  it('separa los bits de un número de precisión simple', () => {
    expect(bitsSimple(1)).toEqual({ signo: '0', exponente: '01111111', fraccion: '0'.repeat(23) });
    expect(bitsSimple(-2).signo).toBe('1');
  });
});

describe('el sistema de juguete', () => {
  it('tiene 2^(p−1) números en cada intervalo [2^e, 2^(e+1)), con el espaciado duplicándose', () => {
    const numeros = sistemaDeJuguete(3, -1, 1, false);
    expect(numeros).toEqual([0.5, 0.625, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5]);
    expect(sistemaDeJuguete(3, -1, 1, true).slice(0, 4)).toEqual([0.125, 0.25, 0.375, 0.5]);
  });

  it('redondea al más cercano, los empates al par, y desborda pasado el máximo más media unidad', () => {
    expect(redondearEnSistema(1.1, 3, -1, 1, false)).toBe(1);
    expect(redondearEnSistema(1.125, 3, -1, 1, false)).toBe(1); // empate entre 1 (mantisa 4) y 1,25 (mantisa 5)
    expect(redondearEnSistema(1.375, 3, -1, 1, false)).toBe(1.5); // empate entre 1,25 (5) y 1,5 (6)
    expect(redondearEnSistema(3.7, 3, -1, 1, false)).toBe(3.5);
    expect(redondearEnSistema(3.75, 3, -1, 1, false)).toBe(Infinity);
    expect(redondearEnSistema(0.2, 3, -1, 1, false)).toBe(0);
    expect(redondearEnSistema(0.2, 3, -1, 1, true)).toBe(0.25);
  });
});
