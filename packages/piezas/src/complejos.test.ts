import { describe, expect, it } from 'vitest';
import {
  ajustarACuadricula,
  ajustarPolar,
  anguloComoFraccionDePi,
  argumentoPrincipal,
  complejoDesdePolar,
  escribirAngulo,
  escribirComplejo,
  escribirNumero,
  explicarProducto,
  moduloComplejo,
  potenciasPorW,
  productoComplejo,
  reducirAngulo,
} from './complejos.ts';

describe('la multiplicación compleja como rotación y escala (I.9)', () => {
  it('multiplica con la regla i² = −1', () => {
    expect(productoComplejo([2, 3], [1, -1])).toEqual([5, 1]);
    expect(productoComplejo([0, 1], [0, 1])).toEqual([-1, 0]);
    expect(productoComplejo([1, 1], [1, 1])).toEqual([0, 2]);
  });

  it('el módulo del producto es el producto de los módulos', () => {
    expect(moduloComplejo(productoComplejo([3, 4], [5, -12]))).toBeCloseTo(65, 12);
    for (const [z, w] of [
      [
        [2, 1],
        [1, 1],
      ],
      [
        [-0.5, 1.75],
        [1.25, -2],
      ],
    ] as const)
      expect(moduloComplejo(productoComplejo(z, w))).toBeCloseTo(moduloComplejo(z) * moduloComplejo(w), 12);
  });

  it('el argumento principal está en (−π, π], también para los reales negativos', () => {
    expect(argumentoPrincipal([1, 1])).toBeCloseTo(Math.PI / 4, 15);
    expect(argumentoPrincipal([-1, 0])).toBe(Math.PI);
    expect(argumentoPrincipal([-1, -0])).toBe(Math.PI);
    expect(argumentoPrincipal([0, -2])).toBeCloseTo(-Math.PI / 2, 15);
    expect(argumentoPrincipal([0, 0])).toBe(0);
    for (const t of [-7, -Math.PI, -1, 0, 2, Math.PI, 3 * Math.PI, 10]) {
      const r = reducirAngulo(t);
      expect(r).toBeGreaterThan(-Math.PI);
      expect(r).toBeLessThanOrEqual(Math.PI);
      expect(Math.abs((t - r) / (2 * Math.PI) - Math.round((t - r) / (2 * Math.PI)))).toBeLessThan(1e-12);
    }
  });

  it('al multiplicar, los argumentos se suman salvo vueltas enteras', () => {
    const e = explicarProducto([2, 1], [1, 1], 1);
    expect(e.producto).toEqual([1, 3]);
    expect(e.moduloProducto).toBeCloseTo(Math.sqrt(10), 12);
    expect(e.argumentoProducto).toBeCloseTo(e.suma, 12);
    expect(e.vueltas).toBe(0);
    // (−1 + i)² = −2i: los argumentos principales suman 3π/2, y el del producto es −π/2, una vuelta menos.
    const f = explicarProducto([-1, 1], [-1, 1], 1);
    expect(f.producto).toEqual([0, -2]);
    expect(f.suma).toBeCloseTo((3 * Math.PI) / 2, 12);
    expect(f.argumentoProducto).toBeCloseTo(-Math.PI / 2, 12);
    expect(f.vueltas).toBe(1);
  });

  it('las potencias de una raíz cúbica de la unidad vuelven al punto de partida', () => {
    const omega = complejoDesdePolar(1, (2 * Math.PI) / 3);
    const puntos = potenciasPorW([1, 0], omega, 3);
    expect(puntos).toHaveLength(4);
    expect(puntos[1]![0]).toBeCloseTo(-0.5, 12);
    expect(puntos[1]![1]).toBeCloseTo(Math.sqrt(3) / 2, 12);
    expect(puntos[3]![0]).toBeCloseTo(1, 12);
    expect(puntos[3]![1]).toBeCloseTo(0, 12);
    // Con módulo 5/4, el punto sale del círculo de radio 2 en la cuarta multiplicación.
    const espiral = potenciasPorW([1, 0], complejoDesdePolar(1.25, Math.PI / 3), 4).map(moduloComplejo);
    expect(espiral[3]).toBeLessThan(2);
    expect(espiral[4]).toBeGreaterThan(2);
  });

  it('ajusta a la cuadrícula y a ángulos de π/12', () => {
    expect(ajustarACuadricula([1.12, -0.37], 0.25)).toEqual([1, -0.25]);
    expect(ajustarACuadricula([-0.1, 0.1], 0.25)).toEqual([0, 0]);
    const w = ajustarPolar([-0.48, 0.9], 0.25, 12);
    expect(moduloComplejo(w)).toBeCloseTo(1, 12);
    expect(argumentoPrincipal(w)).toBeCloseTo((2 * Math.PI) / 3, 12);
    expect(ajustarPolar([0, 1.1], 0.25, 12)).toEqual([0, 1]);
  });

  it('escribe números, complejos y ángulos con coma decimal', () => {
    expect(escribirNumero(2.23606797)).toBe('2,236');
    expect(escribirNumero(-0.5)).toBe('−0,5');
    expect(escribirNumero(-0.0001)).toBe('0');
    expect(escribirNumero(3)).toBe('3');
    expect(escribirComplejo([2, 1])).toBe('2 + i');
    expect(escribirComplejo([1, -3])).toBe('1 − 3i');
    expect(escribirComplejo([0, -1])).toBe('−i');
    expect(escribirComplejo([0, 2])).toBe('2i');
    expect(escribirComplejo([-0.5, Math.sqrt(3) / 2])).toBe('−0,5 + 0,866i');
    expect(escribirComplejo([0, 0])).toBe('0');
    expect(anguloComoFraccionDePi(Math.PI / 4)).toBe('π/4');
    expect(anguloComoFraccionDePi((-2 * Math.PI) / 3)).toBe('−2π/3');
    expect(anguloComoFraccionDePi((7 * Math.PI) / 12)).toBe('7π/12');
    expect(anguloComoFraccionDePi(Math.PI)).toBe('π');
    expect(anguloComoFraccionDePi(0)).toBe('0');
    expect(anguloComoFraccionDePi(Math.atan2(1, 2))).toBeUndefined();
    expect(escribirAngulo(Math.PI / 4)).toBe('π/4 (45°)');
    expect(escribirAngulo(Math.atan2(1, 2))).toBe('0,464 (26,6°)');
  });
});
