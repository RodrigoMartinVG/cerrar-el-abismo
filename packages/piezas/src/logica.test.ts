import { describe, expect, it } from 'vitest';
import { evaluar, leerFormula, tablaDeVerdad, variables } from './logica.ts';

const clase = (texto: string) => tablaDeVerdad(leerFormula(texto)).clase;

describe('la lógica proposicional de I.1', () => {
  it('reconoce las leyes de De Morgan y la contrapositiva como tautologías', () => {
    expect(clase('¬(p ∧ q) ↔ (¬p ∨ ¬q)')).toBe('tautología');
    expect(clase('¬(p ∨ q) ↔ (¬p ∧ ¬q)')).toBe('tautología');
    expect(clase('(p → q) ↔ (¬q → ¬p)')).toBe('tautología');
  });

  it('distingue la implicación de su recíproca', () => {
    expect(clase('(p → q) ↔ (q → p)')).toBe('contingencia');
    expect(clase('p ∧ ¬p')).toBe('contradicción');
  });

  it('acepta la escritura del código y las palabras', () => {
    expect(clase('!(p && q) <-> (!p || !q)')).toBe('tautología');
    expect(clase('no (p y q) <=> (no p o no q)')).toBe('tautología');
  });

  it('respeta la precedencia: ¬, ∧, ∨, →, ↔, y la implicación asocia a la derecha', () => {
    const f = leerFormula('p ∨ q ∧ r');
    expect(evaluar(f, { p: true, q: false, r: false })).toBe(true);
    const g = leerFormula('p → q → r');
    // p → (q → r) es falsa solo con p y q verdaderas y r falsa; (p → q) → r sería falsa con p falsa y r falsa.
    expect(evaluar(g, { p: false, q: false, r: false })).toBe(true);
  });

  it('ordena las filas como los libros y lista las variables', () => {
    const t = tablaDeVerdad(leerFormula('q → p'));
    expect(t.variables).toEqual(['p', 'q']);
    expect(t.filas.map((x) => x.valor)).toEqual([true, true, false, true]);
    expect(variables(leerFormula('V ∨ r'))).toEqual(['r']);
  });

  it.each([
    ['p ∧', /termina antes de tiempo/],
    ['(p ∨ q', /paréntesis/],
    ['p q', /Sobra/],
    ['p + q', /No reconozco/],
    ['', /Falta la fórmula/],
  ])('explica el error en %j', (texto, error) => {
    expect(() => leerFormula(texto)).toThrow(error);
  });
});
