import { describe, expect, it } from 'vitest';
import { aplicar, inversaTranspuesta, perpendicular, producto, type Mat2, type Vec2 } from './algebra.ts';

describe('la transformación de normales (II.5)', () => {
  const t: Vec2 = [Math.cos(0.6), Math.sin(0.6)];
  const n = perpendicular(t);

  it('con una escala no uniforme, M·n deja de ser normal y (M⁻¹)ᵀ·n no', () => {
    const M: Mat2 = [2.5, 0, 0, 1];
    const tangente = aplicar(M, t);
    expect(Math.abs(producto(tangente, aplicar(M, n)))).toBeGreaterThan(0.1);
    expect(producto(tangente, aplicar(inversaTranspuesta(M), n))).toBeCloseTo(0, 12);
  });

  it('con una rotación, (M⁻¹)ᵀ = M', () => {
    const a = 0.9;
    const R: Mat2 = [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];
    inversaTranspuesta(R).forEach((x, i) => expect(x).toBeCloseTo(R[i]!, 12));
  });

  it('rechaza las matrices no invertibles', () => {
    expect(() => inversaTranspuesta([1, 2, 2, 4])).toThrow(/invertible/);
  });
});
