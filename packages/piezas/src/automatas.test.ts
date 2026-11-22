import { describe, expect, it } from 'vitest';
import {
  ABB_DETERMINISTA,
  ABB_NO_DETERMINISTA,
  ABB_THOMPSON,
  A_ESTRELLA_B_ESTRELLA,
  AUTOMATAS_DEL_CAPITULO,
  MULTIPLOS_DE_3,
  NUMEROS,
  TERCERO_DESDE_EL_FINAL,
  SUMIDERO,
  VACIO,
  arcos,
  clausura,
  completar,
  destinos,
  esCompleto,
  esDeterminista,
  escribirConjunto,
  leer,
  moore,
  rotular,
  subconjuntos,
  type Automata,
} from './automatas.ts';

/** Todas las palabras sobre un alfabeto, de largo a lo sumo n. */
function palabras(alfabeto: readonly string[], n: number): string[] {
  const todas = [''];
  let ultimas = [''];
  for (let largo = 1; largo <= n; largo++) {
    ultimas = ultimas.flatMap((w) => alfabeto.map((s) => w + s));
    todas.push(...ultimas);
  }
  return todas;
}

const acepta = (a: Automata, w: string) => leer(a, w).acepta;

describe('los autómatas del capítulo reconocen sus lenguajes', () => {
  it('los múltiplos de 3 en binario, contando la palabra vacía', () => {
    for (const w of palabras(['0', '1'], 11)) expect(acepta(MULTIPLOS_DE_3, w), w).toBe(parseInt(w || '0', 2) % 3 === 0);
  });

  it('los números del patrón de la Entrada, como re.fullmatch', () => {
    const patron = /^[0-9]+(\.[0-9]*)?$/;
    for (const w of palabras(['0', '7', '.', 'a'], 6)) expect(acepta(NUMEROS, w), w).toBe(patron.test(w));
    expect(acepta(NUMEROS, '3.14')).toBe(true);
    expect(acepta(NUMEROS, '7.')).toBe(true);
    expect(acepta(NUMEROS, '.5')).toBe(false);
    expect(acepta(NUMEROS, '3..1')).toBe(false);
  });

  it('las palabras que terminan en abb, con los tres autómatas', () => {
    for (const a of [ABB_NO_DETERMINISTA, ABB_DETERMINISTA, ABB_THOMPSON])
      for (const w of palabras(['a', 'b'], 9)) expect(acepta(a, w), `${a.clave}: ${w}`).toBe(w.endsWith('abb'));
  });

  it('las palabras cuyo tercer símbolo desde el final es un 1', () => {
    for (const w of palabras(['0', '1'], 9)) expect(acepta(TERCERO_DESDE_EL_FINAL, w), w).toBe(w.at(-3) === '1');
  });

  it('a*b*, con la transición ε', () => {
    for (const w of palabras(['a', 'b'], 8)) expect(acepta(A_ESTRELLA_B_ESTRELLA, w), w).toBe(/^a*b*$/.test(w));
  });
});

describe('la lectura paso a paso', () => {
  it('sigue el estado de un determinista, como en el ejemplo del capítulo', () => {
    expect(leer(MULTIPLOS_DE_3, '1011').conjuntos).toEqual([['0'], ['1'], ['2'], ['2'], ['2']]);
    expect(leer(MULTIPLOS_DE_3, '110').conjuntos).toEqual([['0'], ['1'], ['0'], ['0']]);
  });

  it('sigue el conjunto de estados posibles de un no determinista', () => {
    expect(leer(ABB_NO_DETERMINISTA, 'aabb').conjuntos).toEqual([['0'], ['0', '1'], ['0', '1'], ['0', '2'], ['0', '3']]);
    expect(leer(A_ESTRELLA_B_ESTRELLA, 'aabba').conjuntos).toEqual([['0', '1'], ['0', '1'], ['0', '1'], ['1'], ['1'], []]);
  });

  it('se traba sin transición, o con un símbolo fuera del alfabeto, y rechaza', () => {
    const sin = leer(NUMEROS, '3..1');
    expect(sin.conjuntos).toEqual([['i'], ['e'], ['p'], [], []]);
    expect(sin.fueraDelAlfabeto).toBe(-1);
    const fuera = leer(MULTIPLOS_DE_3, '1a0');
    expect(fuera.fueraDelAlfabeto).toBe(1);
    expect(fuera.conjuntos.slice(2)).toEqual([[], []]);
    expect(fuera.acepta).toBe(false);
  });

  it('la palabra vacía se acepta si el estado inicial, o su clausura, es de aceptación', () => {
    expect(leer(MULTIPLOS_DE_3, '').acepta).toBe(true);
    expect(leer(NUMEROS, '').acepta).toBe(false);
    expect(leer(A_ESTRELLA_B_ESTRELLA, '').acepta).toBe(true);
  });
});

describe('la construcción de subconjuntos', () => {
  it('da, para (a|b)*abb, cuatro de los dieciséis subconjuntos', () => {
    const filas = subconjuntos(ABB_NO_DETERMINISTA);
    const escribir = (S: string[]) => escribirConjunto(ABB_NO_DETERMINISTA, S);
    expect(filas.map((f) => [escribir(f.conjunto), ...f.transiciones.map(escribir), f.final])).toEqual([
      ['{0}', '{0, 1}', '{0}', false],
      ['{0, 1}', '{0, 1}', '{0, 2}', false],
      ['{0, 2}', '{0, 1}', '{0, 3}', false],
      ['{0, 3}', '{0, 1}', '{0}', true],
    ]);
    expect(esCompleto(ABB_DETERMINISTA)).toBe(true);
    expect(ABB_DETERMINISTA.estados).toEqual(['{0}', '{0, 1}', '{0, 2}', '{0, 3}']);
  });

  it('da 2^k conjuntos para el k-ésimo símbolo desde el final, con k = 3', () => {
    expect(subconjuntos(TERCERO_DESDE_EL_FINAL)).toHaveLength(8);
  });

  it('empieza por la clausura, y el conjunto vacío es un sumidero', () => {
    expect([...clausura(A_ESTRELLA_B_ESTRELLA, ['0'])].sort()).toEqual(['0', '1']);
    const filas = subconjuntos(A_ESTRELLA_B_ESTRELLA);
    expect(filas.map((f) => escribirConjunto(A_ESTRELLA_B_ESTRELLA, f.conjunto))).toEqual(['{0, 1}', '{1}', VACIO]);
    expect(filas[2]!.transiciones).toEqual([[], []]);
  });
});

describe('el algoritmo de Moore', () => {
  it('junta A y C en el autómata de cinco estados, en tres pasos', () => {
    expect(moore(ABB_THOMPSON)).toEqual([
      [['A', 'B', 'C', 'D'], ['E']],
      [['A', 'B', 'C'], ['D'], ['E']],
      [['A', 'C'], ['B'], ['D'], ['E']],
      [['A', 'C'], ['B'], ['D'], ['E']],
    ]);
  });

  it('no junta nada en los que ya son mínimos', () => {
    for (const a of [MULTIPLOS_DE_3, ABB_DETERMINISTA]) expect(moore(a).at(-1)).toHaveLength(a.estados.length);
    expect(moore(completar(subconjuntosComoAutomata(TERCERO_DESDE_EL_FINAL))).at(-1)).toHaveLength(8);
  });

  it('completa los números con el sumidero y junta p con d', () => {
    expect(esCompleto(NUMEROS)).toBe(false);
    const completo = completar(NUMEROS);
    expect(completo.estados).toEqual(['i', 'e', 'p', 'd', SUMIDERO]);
    expect(moore(completo).at(-1)).toEqual([['i'], ['e'], ['p', 'd'], [SUMIDERO]]);
    expect(completar(MULTIPLOS_DE_3)).toBe(MULTIPLOS_DE_3);
  });

  it('rechaza un autómata que no es determinista y completo', () => {
    expect(() => moore(ABB_NO_DETERMINISTA)).toThrow();
  });
});

/** El determinista alcanzable de un no determinista, sin dibujo. */
function subconjuntosComoAutomata(a: Automata): Automata {
  const filas = subconjuntos(a);
  const nombre = (S: string[]) => escribirConjunto(a, S);
  return {
    ...a,
    estados: filas.map((f) => nombre(f.conjunto)),
    inicial: nombre(filas[0]!.conjunto),
    finales: filas.filter((f) => f.final).map((f) => nombre(f.conjunto)),
    transiciones: filas.flatMap((f) => a.alfabeto.map((s, i) => [nombre(f.conjunto), s, nombre(f.transiciones[i]!)] as const)),
  };
}

describe('el dibujo', () => {
  it('cada autómata tiene sus estados ubicados, transiciones entre sus estados y símbolos de un carácter', () => {
    const claves = new Set<string>();
    for (const a of AUTOMATAS_DEL_CAPITULO) {
      expect(claves.has(a.clave), a.clave).toBe(false);
      claves.add(a.clave);
      for (const q of a.estados) expect(a.posiciones[q], `${a.clave}: ${q}`).toBeDefined();
      expect(a.estados).toContain(a.inicial);
      for (const q of a.finales) expect(a.estados).toContain(q);
      for (const [p, s, q] of a.transiciones) {
        expect(a.estados).toContain(p);
        expect(a.estados).toContain(q);
        expect(s === '' || a.alfabeto.includes(s)).toBe(true);
      }
      for (const s of a.alfabeto) expect([...s]).toHaveLength(1);
      for (const clave of Object.keys(a.curvas ?? {})) {
        const [p, q] = clave.split('→');
        expect(destinos(a, p!, '').concat(...a.alfabeto.map((s) => destinos(a, p!, s))), `${a.clave}: ${clave}`).toContain(q);
      }
    }
  });

  it('los deterministas son los que dicen serlo', () => {
    expect(AUTOMATAS_DEL_CAPITULO.filter(esDeterminista).map((a) => a.clave)).toEqual([
      'multiplos-de-3',
      'numeros',
      'abb-determinista',
      'abb-thompson',
    ]);
  });

  it('junta los símbolos de un arco, con las cifras como una clase', () => {
    const deNumeros = arcos(NUMEROS).map((x) => `${x.desde}→${x.hacia} ${rotular(NUMEROS, x.simbolos)}`);
    expect(deNumeros).toEqual(['i→e 0–9', 'e→e 0–9', 'p→d 0–9', 'd→d 0–9', 'e→p .']);
    expect(rotular(ABB_NO_DETERMINISTA, ['b', 'a'])).toBe('a, b');
    expect(rotular(A_ESTRELLA_B_ESTRELLA, [''])).toBe('ε');
    expect(rotular(NUMEROS, ['1', '2'])).toBe('1, 2');
  });
});
