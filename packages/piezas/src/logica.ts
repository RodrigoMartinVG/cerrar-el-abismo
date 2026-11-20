/**
 * Lógica proposicional para la pieza «tabla-de-verdad» (I.1): lee una fórmula, la evalúa en todas las valuaciones
 * y dice si es tautología, contradicción o contingencia.
 *
 * Sintaxis: variables de una letra minúscula (salvo «v»); ¬ (también ~, ! o «no»), ∧ (&, «y»), ∨ (|, «o»),
 * → (->, =>), ↔ (<->, <=>), las constantes V y F, y paréntesis. La precedencia, de mayor a menor, es ¬, ∧, ∨, →, ↔;
 * la implicación asocia a la derecha: p → q → r es p → (q → r).
 */

export type Formula =
  | { tipo: 'var'; nombre: string }
  | { tipo: 'const'; valor: boolean }
  | { tipo: 'no'; f: Formula }
  | { tipo: 'y' | 'o' | 'implica' | 'equivale'; a: Formula; b: Formula };

type Simbolo = '¬' | '∧' | '∨' | '→' | '↔' | '(' | ')';
type Token = { tipo: 'simbolo'; valor: Simbolo } | { tipo: 'var'; nombre: string } | { tipo: 'const'; valor: boolean };

const SINONIMOS: [RegExp, Simbolo][] = [
  [/^(?:<->|<=>|↔)/, '↔'],
  [/^(?:->|=>|→)/, '→'],
  [/^(?:¬|~|!|no\b)/, '¬'],
  [/^(?:∧|&&?|y\b)/, '∧'],
  [/^(?:∨|\|\|?|o\b)/, '∨'],
  [/^\(/, '('],
  [/^\)/, ')'],
];

function tokenizar(texto: string): Token[] {
  const tokens: Token[] = [];
  let resto = texto.trim();
  while (resto.length > 0) {
    let encontrado = false;
    for (const [patron, simbolo] of SINONIMOS) {
      const m = patron.exec(resto);
      if (m) {
        tokens.push({ tipo: 'simbolo', valor: simbolo });
        resto = resto.slice(m[0].length).trimStart();
        encontrado = true;
        break;
      }
    }
    if (encontrado) continue;
    const c = resto[0]!;
    if (c === 'V' || c === 'F') tokens.push({ tipo: 'const', valor: c === 'V' });
    else if (/[a-z]/.test(c) && c !== 'v') tokens.push({ tipo: 'var', nombre: c });
    else throw new Error(`No reconozco «${c}». Las variables son letras minúsculas, y los conectivos, ¬ ∧ ∨ → ↔.`);
    resto = resto.slice(1).trimStart();
  }
  return tokens;
}

/** Lee una fórmula; lanza un error con un mensaje para el lector si no está bien escrita. */
export function leerFormula(texto: string): Formula {
  const tokens = tokenizar(texto);
  if (tokens.length === 0) throw new Error('Falta la fórmula; por ejemplo, p → q.');
  let i = 0;
  const mirar = () => tokens[i];
  const es = (s: Simbolo) => {
    const t = mirar();
    return t?.tipo === 'simbolo' && t.valor === s;
  };

  function equivalencia(): Formula {
    let a = implicacion();
    while (es('↔')) {
      i++;
      a = { tipo: 'equivale', a, b: implicacion() };
    }
    return a;
  }
  function implicacion(): Formula {
    const a = disyuncion();
    if (es('→')) {
      i++;
      return { tipo: 'implica', a, b: implicacion() };
    }
    return a;
  }
  function disyuncion(): Formula {
    let a = conjuncion();
    while (es('∨')) {
      i++;
      a = { tipo: 'o', a, b: conjuncion() };
    }
    return a;
  }
  function conjuncion(): Formula {
    let a = negacion();
    while (es('∧')) {
      i++;
      a = { tipo: 'y', a, b: negacion() };
    }
    return a;
  }
  function negacion(): Formula {
    if (es('¬')) {
      i++;
      return { tipo: 'no', f: negacion() };
    }
    return atomo();
  }
  function atomo(): Formula {
    const t = mirar();
    if (!t) throw new Error('La fórmula termina antes de tiempo.');
    i++;
    if (t.tipo === 'var') return { tipo: 'var', nombre: t.nombre };
    if (t.tipo === 'const') return { tipo: 'const', valor: t.valor };
    if (t.valor === '(') {
      const f = equivalencia();
      if (!es(')')) throw new Error('Falta cerrar un paréntesis.');
      i++;
      return f;
    }
    throw new Error(`Sobra «${t.valor}» en esa posición.`);
  }

  const f = equivalencia();
  if (i < tokens.length) throw new Error('Sobra algo al final de la fórmula.');
  return f;
}

export function variables(f: Formula): string[] {
  const vistas = new Set<string>();
  const recorrer = (g: Formula): void => {
    if (g.tipo === 'var') vistas.add(g.nombre);
    else if (g.tipo === 'no') recorrer(g.f);
    else if (g.tipo !== 'const') {
      recorrer(g.a);
      recorrer(g.b);
    }
  };
  recorrer(f);
  return [...vistas].sort();
}

export function evaluar(f: Formula, valuacion: Readonly<Record<string, boolean>>): boolean {
  switch (f.tipo) {
    case 'var':
      return valuacion[f.nombre] ?? false;
    case 'const':
      return f.valor;
    case 'no':
      return !evaluar(f.f, valuacion);
    case 'y':
      return evaluar(f.a, valuacion) && evaluar(f.b, valuacion);
    case 'o':
      return evaluar(f.a, valuacion) || evaluar(f.b, valuacion);
    case 'implica':
      return !evaluar(f.a, valuacion) || evaluar(f.b, valuacion);
    case 'equivale':
      return evaluar(f.a, valuacion) === evaluar(f.b, valuacion);
  }
}

export interface TablaDeVerdad {
  variables: string[];
  filas: { valuacion: Record<string, boolean>; valor: boolean }[];
  clase: 'tautología' | 'contradicción' | 'contingencia';
}

/** La tabla completa, con las filas en el orden de los libros: la primera, todo verdadero. */
export function tablaDeVerdad(f: Formula): TablaDeVerdad {
  const vars = variables(f);
  if (vars.length > 6) throw new Error('Con más de seis variables la tabla tendría más de 64 filas.');
  const filas = Array.from({ length: 2 ** vars.length }, (_, k) => {
    const valuacion = Object.fromEntries(vars.map((v, j) => [v, ((k >> (vars.length - 1 - j)) & 1) === 0]));
    return { valuacion, valor: evaluar(f, valuacion) };
  });
  const verdaderas = filas.filter((x) => x.valor).length;
  const clase = verdaderas === filas.length ? 'tautología' : verdaderas === 0 ? 'contradicción' : 'contingencia';
  return { variables: vars, filas, clase };
}
