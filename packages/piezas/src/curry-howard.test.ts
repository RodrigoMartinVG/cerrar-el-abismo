import { describe, expect, it } from 'vitest';
import {
  ap,
  base,
  CATALOGO,
  deduccion,
  ErrorDeTipo,
  escribirFormula,
  escribirTermino,
  escribirTipo,
  fragmentar,
  imp,
  lam,
  libres,
  mas,
  mismoTipo,
  no,
  nombreDeRegla,
  par,
  pi1,
  pi2,
  por,
  reducir,
  reducirUnPaso,
  subtermino,
  sustituir,
  tipar,
  v,
  type Contexto,
  type Fragmento,
  type Linea,
  type Termino,
  type Tipo,
} from './curry-howard.ts';

const A = base('A');
const B = base('B');
const C = base('C');
const porClave = (clave: string) => CATALOGO.find((d) => d.clave === clave)!;

/**
 * Comprueba, olvidando los términos, que una línea sale de sus premisas por la regla que dice, con las reglas de la
 * deducción natural intuicionista: es la mitad de Curry–Howard que la pieza muestra, comprobada aparte.
 */
function sigue(l: Linea, lineas: readonly Linea[]): boolean {
  const premisas = l.premisas.map((n) => lineas[n - 1]!);
  if (premisas.some((p) => p.numero >= l.numero)) return false;
  const tipos = (c: Contexto) => c.map(([, t]) => t);
  const iguales = (c: Tipo[], d: Tipo[]) => c.length === d.length && c.every((t, i) => mismoTipo(t, d[i]!));
  const ctx = tipos(l.contexto);
  const mismoContexto = premisas.every((p) => iguales(tipos(p.contexto), ctx));
  const [p, q, r] = premisas;
  const t = l.tipo;
  switch (l.regla) {
    case 'hipotesis':
      return premisas.length === 0 && ctx.some((h) => mismoTipo(h, t));
    case 'intro-imp':
      return t.k === 'flecha' && iguales(tipos(p!.contexto), [...ctx, t.a]) && mismoTipo(p!.tipo, t.b);
    case 'elim-imp':
      return mismoContexto && p!.tipo.k === 'flecha' && mismoTipo(p!.tipo.a, q!.tipo) && mismoTipo(p!.tipo.b, t);
    case 'intro-y':
      return mismoContexto && t.k === 'producto' && mismoTipo(t.a, p!.tipo) && mismoTipo(t.b, q!.tipo);
    case 'elim-y-1':
    case 'elim-y-2':
      return mismoContexto && p!.tipo.k === 'producto' && mismoTipo(l.regla === 'elim-y-1' ? p!.tipo.a : p!.tipo.b, t);
    case 'intro-o-1':
    case 'intro-o-2':
      return mismoContexto && t.k === 'suma' && mismoTipo(l.regla === 'intro-o-1' ? t.a : t.b, p!.tipo);
    case 'elim-o': {
      const s = p!.tipo;
      return (
        iguales(tipos(p!.contexto), ctx) &&
        s.k === 'suma' &&
        iguales(tipos(q!.contexto), [...ctx, s.a]) &&
        iguales(tipos(r!.contexto), [...ctx, s.b]) &&
        mismoTipo(q!.tipo, t) &&
        mismoTipo(r!.tipo, t)
      );
    }
    case 'absurdo':
      return mismoContexto && p!.tipo.k === 'vacio';
  }
}

/** Los caminos de los fragmentos de un término escrito. */
const caminos = (f: Fragmento): string[] => [f.camino, ...f.partes.flatMap((p) => (typeof p === 'string' ? [] : caminos(p)))];

describe('la escritura de tipos y fórmulas', () => {
  it('lee los tipos como fórmulas, con ¬ para la implicación con ⊥ y la flecha asociando a la derecha', () => {
    expect(escribirFormula(imp(no(mas(A, B)), por(no(A), no(B))))).toBe('¬(A ∨ B) → ¬A ∧ ¬B');
    expect(escribirFormula(imp(imp(A, B), imp(imp(B, C), imp(A, C))))).toBe('(A → B) → (B → C) → A → C');
    expect(escribirFormula(imp(A, no(no(A))))).toBe('A → ¬¬A');
    expect(escribirFormula(por(por(A, B), C))).toBe('(A ∧ B) ∧ C');
    expect(escribirFormula(por(A, mas(B, C)))).toBe('A ∧ (B ∨ C)');
    expect(escribirFormula(mas(por(A, B), C))).toBe('A ∧ B ∨ C');
  });

  it('escribe los tipos con × y +, y la negación como flecha a ⊥', () => {
    expect(escribirTipo(imp(no(mas(A, B)), por(no(A), no(B))))).toBe('(A + B → ⊥) → (A → ⊥) × (B → ⊥)');
    expect(escribirTipo(imp(por(A, B), por(B, A)))).toBe('A × B → B × A');
  });
});

describe('el tipado', () => {
  it('da a cada demostración del catálogo el enunciado de su nombre', () => {
    const enunciados: Record<string, string> = {
      intercambio: 'A ∧ B → B ∧ A',
      currificacion: '(A ∧ B → C) → A → B → C',
      'doble-negacion': 'A → ¬¬A',
      conmutatividad: 'A ∨ B → B ∨ A',
      'de-morgan': '¬(A ∨ B) → ¬A ∧ ¬B',
    };
    for (const d of CATALOGO) {
      expect(libres(d.termino).size, d.clave).toBe(0);
      expect(escribirFormula(tipar(d.termino)), d.clave).toBe(enunciados[d.clave]);
    }
  });

  it('da al intercambio equivocado otro tipo, que no es el del enunciado', () => {
    const equivocado = lam('p', por(A, B), par(pi1(v('p')), pi2(v('p'))));
    expect(escribirTipo(tipar(equivocado))).toBe('A × B → A × B');
  });

  it('rechaza lo que no tiene tipo: proyectar una función, aplicar una variable a sí misma', () => {
    expect(() => tipar(pi1(lam('x', A, v('x'))))).toThrow(ErrorDeTipo);
    expect(() => tipar(lam('x', A, ap(v('x'), v('x'))))).toThrow(ErrorDeTipo);
    expect(() => tipar(lam('x', imp(A, B), ap(v('x'), v('x'))))).toThrow(/espera un A, y recibe un A → B/);
    expect(() => tipar(v('x'))).toThrow(/no está en el contexto/);
  });
});

describe('la deducción que se lee en un término', () => {
  it('tiene una línea por cada parte del término, y cada línea sale de las anteriores por su regla', () => {
    for (const d of CATALOGO) {
      const lineas = deduccion(d.termino);
      expect(lineas.length, d.clave).toBe(caminos(fragmentar(d.termino)).length);
      for (const l of lineas) {
        expect(sigue(l, lineas), `${d.clave}, línea ${l.numero}`).toBe(true);
        expect(subtermino(d.termino, l.camino)).toBe(l.termino);
      }
      const ultima = lineas.at(-1)!;
      expect(ultima.contexto).toEqual([]);
      expect(mismoTipo(ultima.tipo, tipar(d.termino))).toBe(true);
    }
  });

  it('lee el intercambio como la deducción de I.14: hipótesis, eliminaciones, introducción de ∧ y de →', () => {
    const lineas = deduccion(porClave('intercambio').termino);
    expect(lineas.map(nombreDeRegla)).toEqual([
      'hipótesis',
      'eliminación de ∧',
      'hipótesis',
      'eliminación de ∧',
      'introducción de ∧',
      'introducción de →',
    ]);
    expect(lineas.map((l) => l.premisas)).toEqual([[], [1], [], [3], [2, 4], [5]]);
    expect(lineas[5]!.descarga).toEqual(['p']);
  });

  it('nombra la negación aparte cuando la implicación es con ⊥', () => {
    const lineas = deduccion(porClave('doble-negacion').termino);
    expect(lineas.map(nombreDeRegla)).toEqual([
      'hipótesis',
      'hipótesis',
      'eliminación de ¬',
      'introducción de ¬',
      'introducción de →',
    ]);
  });

  it('descarga las dos hipótesis en el análisis de casos', () => {
    const lineas = deduccion(porClave('conmutatividad').termino);
    const casos = lineas.find((l) => l.regla === 'elim-o')!;
    expect(casos.descarga).toEqual(['x', 'y']);
    expect(casos.premisas).toHaveLength(3);
  });
});

describe('la escritura de los términos', () => {
  it('escribe como el capítulo, con los paréntesis justos', () => {
    expect(escribirTermino(porClave('intercambio').termino)).toBe('λp. ⟨π₂ p, π₁ p⟩');
    expect(escribirTermino(porClave('currificacion').termino)).toBe('λf. λa. λb. f ⟨a, b⟩');
    expect(escribirTermino(porClave('conmutatividad').termino)).toBe('λs. caso s (x. inr x) (y. inl y)');
    expect(escribirTermino(porClave('de-morgan').aplicacion.termino)).toBe('π₁ ((λh. ⟨λa. h (inl a), λb. h (inr b)⟩) r) x');
  });

  it('parte el término en fragmentos con caminos distintos, uno por cada parte', () => {
    for (const d of CATALOGO) {
      const todos = caminos(fragmentar(d.aplicacion.termino));
      expect(new Set(todos).size).toBe(todos.length);
      for (const c of todos) expect(() => subtermino(d.aplicacion.termino, c)).not.toThrow();
    }
  });
});

describe('la reducción', () => {
  it('sustituye sin capturar: (λx. λy. x) y se reduce a λy′. y', () => {
    const t = ap(lam('x', A, lam('y', A, v('x'))), v('y'));
    expect(escribirTermino(reducir(t)[0]!.despues)).toBe('λy′. y');
    expect(escribirTermino(sustituir(lam('y', A, ap(v('x'), v('y'))), 'x', v('y')))).toBe('λy′. y y′');
    expect(escribirTermino(sustituir(lam('x', A, v('x')), 'x', v('y')))).toBe('λx. x');
  });

  it('lleva cada aplicación del catálogo a su forma normal, sin cambiar el tipo en ningún paso', () => {
    const esperado: Record<string, [number, string]> = {
      intercambio: [3, '⟨b, a⟩'],
      currificacion: [3, 'g ⟨x, y⟩'],
      'doble-negacion': [2, 'r a'],
      conmutatividad: [2, 'inr a'],
      'de-morgan': [3, 'r (inl x)'],
    };
    for (const d of CATALOGO) {
      const { termino, contexto } = d.aplicacion;
      const tipo = tipar(termino, contexto);
      const pasos = reducir(termino);
      expect([pasos.length, escribirTermino(pasos.at(-1)!.despues)], d.clave).toEqual(esperado[d.clave]);
      for (const p of pasos) {
        expect(mismoTipo(tipar(p.despues, contexto), tipo), d.clave).toBe(true);
        expect(subtermino(p.antes, p.camino)).toBeDefined();
      }
      expect(reducirUnPaso(pasos.at(-1)!.despues)).toBeNull();
    }
  });

  it('reduce el rodeo de más afuera primero: el intercambio, la proyección de la izquierda y después la de la derecha', () => {
    const pasos = reducir(porClave('intercambio').aplicacion.termino);
    expect(pasos.map((p) => [p.regla, p.camino])).toEqual([
      ['β', ''],
      ['π₂', '0'],
      ['π₁', '1'],
    ]);
  });

  it('hace las cuentas del capítulo: la currificación de una proyección, y el intercambio aplicado dos veces', () => {
    const proyeccion = lam('p', por(A, B), pi1(v('p')));
    const curry = lam('f', imp(por(A, B), A), lam('a', A, lam('b', B, ap(v('f'), par(v('a'), v('b'))))));
    const t = ap(curry, proyeccion, v('x'), v('y'));
    expect(
      escribirTipo(
        tipar(t, [
          ['x', A],
          ['y', B],
        ]),
      ),
    ).toBe('A');
    const pasos = reducir(t);
    expect(pasos.map((p) => escribirTermino(p.despues))).toEqual([
      '(λa. λb. (λp. π₁ p) ⟨a, b⟩) x y',
      '(λb. (λp. π₁ p) ⟨x, b⟩) y',
      '(λp. π₁ p) ⟨x, y⟩',
      'π₁ ⟨x, y⟩',
      'x',
    ]);

    const intercambio = lam('q', por(A, A), par(pi2(v('q')), pi1(v('q'))));
    const dosVeces = lam('f', imp(por(A, A), por(A, A)), lam('z', por(A, A), ap(v('f'), ap(v('f'), v('z')))));
    const u = ap(dosVeces, intercambio, par(v('a'), v('b')));
    expect(
      escribirTipo(
        tipar(u, [
          ['a', A],
          ['b', A],
        ]),
      ),
    ).toBe('A × A');
    const otros = reducir(u);
    expect(otros).toHaveLength(9);
    expect(escribirTermino(otros.at(-1)!.despues)).toBe('⟨a, b⟩');
  });

  it('no termina con Ω, que no tiene tipo: cada paso vuelve al mismo término', () => {
    const delta: Termino = lam('x', A, ap(v('x'), v('x')));
    const omega = ap(delta, delta);
    expect(() => tipar(omega)).toThrow(ErrorDeTipo);
    const pasos = reducir(omega, 10);
    expect(pasos).toHaveLength(10);
    for (const p of pasos) expect(escribirTermino(p.despues)).toBe('(λx. x x) (λx. x x)');
  });
});
