/**
 * EL CÁLCULO λ SIMPLEMENTE TIPADO COMO DEDUCCIÓN NATURAL (I.15), para la pieza «deduccion-y-termino». Un término
 * tipado se lee como una deducción, regla por regla, como dice el teorema de Curry–Howard: la variable es la hipótesis,
 * la función y la aplicación son la introducción y la eliminación de la implicación, el par y las proyecciones las de
 * la conjunción, `inl`, `inr` y el análisis de casos las de la disyunción, y `absurdo` es la regla del absurdo. La
 * negación ¬A es A → ⊥.
 *
 * Además, la reducción de afuera hacia adentro, en el orden de la segunda celda del capítulo: en cada paso se reduce
 * el rodeo que aparece primero leyendo el término de izquierda a derecha, empezando por el término entero. La
 * sustitución renombra las variables ligadas que capturarían una variable libre.
 */

export type Tipo = { k: 'base'; nombre: string } | { k: 'vacio' } | { k: 'flecha' | 'producto' | 'suma'; a: Tipo; b: Tipo };

export type Termino =
  | { k: 'var'; x: string }
  | { k: 'lam'; x: string; tipo: Tipo; cuerpo: Termino }
  | { k: 'ap'; f: Termino; a: Termino }
  | { k: 'par'; a: Termino; b: Termino }
  | { k: 'pi1' | 'pi2'; t: Termino }
  | { k: 'inl' | 'inr'; t: Termino; otro: Tipo }
  | { k: 'caso'; s: Termino; x: string; u: Termino; y: string; v: Termino }
  | { k: 'absurdo'; t: Termino; tipo: Tipo };

/** Las hipótesis de un juicio: cada variable con su tipo, en el orden en que se ligaron. */
export type Contexto = readonly (readonly [string, Tipo])[];

// Constructores, para escribir los términos del catálogo y de las pruebas.
export const base = (nombre: string): Tipo => ({ k: 'base', nombre });
export const VACIO: Tipo = { k: 'vacio' };
export const imp = (a: Tipo, b: Tipo): Tipo => ({ k: 'flecha', a, b });
export const por = (a: Tipo, b: Tipo): Tipo => ({ k: 'producto', a, b });
export const mas = (a: Tipo, b: Tipo): Tipo => ({ k: 'suma', a, b });
export const no = (a: Tipo): Tipo => imp(a, VACIO);
export const v = (x: string): Termino => ({ k: 'var', x });
export const lam = (x: string, tipo: Tipo, cuerpo: Termino): Termino => ({ k: 'lam', x, tipo, cuerpo });
/** La aplicación, que asocia a la izquierda: `ap(f, a, b)` es (f a) b. */
export const ap = (f: Termino, ...args: Termino[]): Termino => args.reduce<Termino>((g, a) => ({ k: 'ap', f: g, a }), f);
export const par = (a: Termino, b: Termino): Termino => ({ k: 'par', a, b });
export const pi1 = (t: Termino): Termino => ({ k: 'pi1', t });
export const pi2 = (t: Termino): Termino => ({ k: 'pi2', t });
/** `inl(t, otro)` tiene tipo σ + otro si t tiene tipo σ; `inr(otro, t)`, tipo otro + σ. */
export const inl = (t: Termino, otro: Tipo): Termino => ({ k: 'inl', t, otro });
export const inr = (otro: Tipo, t: Termino): Termino => ({ k: 'inr', t, otro });
export const caso = (s: Termino, x: string, u: Termino, y: string, w: Termino): Termino => ({ k: 'caso', s, x, u, y, v: w });
export const absurdo = (t: Termino, tipo: Tipo): Termino => ({ k: 'absurdo', t, tipo });

export function mismoTipo(s: Tipo, t: Tipo): boolean {
  if (s.k === 'base') return t.k === 'base' && s.nombre === t.nombre;
  if (s.k === 'vacio') return t.k === 'vacio';
  return t.k === s.k && mismoTipo(s.a, (t as typeof s).a) && mismoTipo(s.b, (t as typeof s).b);
}

// La escritura. Los tipos se escriben de dos maneras: como fórmulas (∧, ∨, ¬), en la columna de la deducción, y como
// tipos (×, +), en la del término. La flecha asocia a la derecha y liga menos que todo lo demás.

const PRECEDENCIA = { flecha: 1, suma: 2, producto: 3 } as const;

function escribir(t: Tipo, comoFormula: boolean): string {
  if (t.k === 'base') return t.nombre;
  if (t.k === 'vacio') return '⊥';
  if (comoFormula && t.k === 'flecha' && t.b.k === 'vacio') {
    const a = escribir(t.a, true);
    return t.a.k === 'base' || t.a.k === 'vacio' || (t.a.k === 'flecha' && t.a.b.k === 'vacio') ? `¬${a}` : `¬(${a})`;
  }
  const simbolo = { flecha: '→', producto: comoFormula ? '∧' : '×', suma: comoFormula ? '∨' : '+' }[t.k];
  const lado = (hijo: Tipo, derecho: boolean) => {
    const texto = escribir(hijo, comoFormula);
    if (hijo.k === 'base' || hijo.k === 'vacio') return texto;
    if (comoFormula && hijo.k === 'flecha' && hijo.b.k === 'vacio') return texto;
    const menor = PRECEDENCIA[hijo.k] < PRECEDENCIA[t.k];
    const igual = hijo.k === t.k && !(t.k === 'flecha' && derecho);
    return menor || igual ? `(${texto})` : texto;
  };
  return `${lado(t.a, false)} ${simbolo} ${lado(t.b, true)}`;
}

/** El tipo leído como fórmula: A ∧ B → B ∧ A, ¬(A ∨ B). */
export const escribirFormula = (t: Tipo) => escribir(t, true);
/** El tipo como tipo: A × B → B × A, A + B → ⊥. */
export const escribirTipo = (t: Tipo) => escribir(t, false);

/**
 * Un término escrito, partido en fragmentos: cada parte del término es un fragmento con su camino (los índices de los
 * hijos desde la raíz, separados por puntos; la raíz es «»), para que la pieza pueda marcar una parte sin volver a
 * escribir el resto. Los paréntesis que rodean a una parte quedan afuera de su fragmento.
 */
export interface Fragmento {
  camino: string;
  partes: (string | Fragmento)[];
}

/** Los hijos de un término, en el orden de sus caminos. */
export function hijos(t: Termino): Termino[] {
  switch (t.k) {
    case 'var':
      return [];
    case 'lam':
      return [t.cuerpo];
    case 'ap':
      return [t.f, t.a];
    case 'par':
      return [t.a, t.b];
    case 'caso':
      return [t.s, t.u, t.v];
    default:
      return [t.t];
  }
}

const hijo = (camino: string, i: number) => (camino === '' ? String(i) : `${camino}.${i}`);
const esAtomo = (t: Termino) => t.k === 'var' || t.k === 'par';

export function fragmentar(t: Termino, camino = ''): Fragmento {
  const sub = (i: number) => fragmentar(hijos(t)[i]!, hijo(camino, i));
  const argumento = (i: number) => (esAtomo(hijos(t)[i]!) ? [sub(i)] : ['(', sub(i), ')']);
  let partes: (string | Fragmento)[];
  switch (t.k) {
    case 'var':
      partes = [t.x];
      break;
    case 'lam':
      partes = [`λ${t.x}. `, sub(0)];
      break;
    case 'ap': {
      const funcion = t.f.k === 'lam' || t.f.k === 'caso' ? ['(', sub(0), ')'] : [sub(0)];
      partes = [...funcion, ' ', ...argumento(1)];
      break;
    }
    case 'par':
      partes = ['⟨', sub(0), ', ', sub(1), '⟩'];
      break;
    case 'pi1':
    case 'pi2':
      partes = [t.k === 'pi1' ? 'π₁ ' : 'π₂ ', ...argumento(0)];
      break;
    case 'inl':
    case 'inr':
    case 'absurdo':
      partes = [`${t.k} `, ...argumento(0)];
      break;
    case 'caso':
      partes = ['caso ', ...argumento(0), ` (${t.x}. `, sub(1), `) (${t.y}. `, sub(2), ')'];
      break;
  }
  return { camino, partes };
}

export const aplanar = (f: Fragmento): string => f.partes.map((p) => (typeof p === 'string' ? p : aplanar(p))).join('');
export const escribirTermino = (t: Termino) => aplanar(fragmentar(t));

/** La parte de un término que está en un camino. */
export function subtermino(t: Termino, camino: string): Termino {
  if (camino === '') return t;
  return camino
    .split('.')
    .map(Number)
    .reduce((s, i) => {
      const h = hijos(s)[i];
      if (!h) throw new Error(`El camino «${camino}» no está en el término.`);
      return h;
    }, t);
}

// El tipado.

export class ErrorDeTipo extends Error {}

const buscar = (contexto: Contexto, x: string) => {
  for (let i = contexto.length - 1; i >= 0; i--) if (contexto[i]![0] === x) return contexto[i]![1];
  throw new ErrorDeTipo(`La variable ${x} no está en el contexto.`);
};

/** El tipo de un término en un contexto, o un `ErrorDeTipo` que dice qué regla no se puede aplicar. */
export function tipar(t: Termino, contexto: Contexto = []): Tipo {
  switch (t.k) {
    case 'var':
      return buscar(contexto, t.x);
    case 'lam':
      return imp(t.tipo, tipar(t.cuerpo, [...contexto, [t.x, t.tipo]]));
    case 'ap': {
      const f = tipar(t.f, contexto);
      const a = tipar(t.a, contexto);
      if (f.k !== 'flecha') throw new ErrorDeTipo(`${escribirTermino(t.f)} no es una función: tiene tipo ${escribirTipo(f)}.`);
      if (!mismoTipo(f.a, a))
        throw new ErrorDeTipo(`${escribirTermino(t.f)} espera un ${escribirTipo(f.a)}, y recibe un ${escribirTipo(a)}.`);
      return f.b;
    }
    case 'par':
      return por(tipar(t.a, contexto), tipar(t.b, contexto));
    case 'pi1':
    case 'pi2': {
      const p = tipar(t.t, contexto);
      if (p.k !== 'producto') throw new ErrorDeTipo(`${escribirTermino(t.t)} no es un par: tiene tipo ${escribirTipo(p)}.`);
      return t.k === 'pi1' ? p.a : p.b;
    }
    case 'inl':
      return mas(tipar(t.t, contexto), t.otro);
    case 'inr':
      return mas(t.otro, tipar(t.t, contexto));
    case 'caso': {
      const s = tipar(t.s, contexto);
      if (s.k !== 'suma') throw new ErrorDeTipo(`${escribirTermino(t.s)} no es una suma: tiene tipo ${escribirTipo(s)}.`);
      const u = tipar(t.u, [...contexto, [t.x, s.a]]);
      const w = tipar(t.v, [...contexto, [t.y, s.b]]);
      if (!mismoTipo(u, w)) throw new ErrorDeTipo(`Las ramas tienen tipos distintos: ${escribirTipo(u)} y ${escribirTipo(w)}.`);
      return u;
    }
    case 'absurdo': {
      const e = tipar(t.t, contexto);
      if (e.k !== 'vacio')
        throw new ErrorDeTipo(`absurdo pide un término de tipo ⊥, y ${escribirTermino(t.t)} tiene tipo ${escribirTipo(e)}.`);
      return t.tipo;
    }
  }
}

// La deducción que se lee en un término.

export type Regla =
  'hipotesis' | 'intro-imp' | 'elim-imp' | 'intro-y' | 'elim-y-1' | 'elim-y-2' | 'intro-o-1' | 'intro-o-2' | 'elim-o' | 'absurdo';

/** Una línea de la deducción: un juicio Γ ⊢ φ, con la parte del término que le corresponde. */
export interface Linea {
  /** Desde 1, como en las deducciones del capítulo. */
  numero: number;
  contexto: Contexto;
  termino: Termino;
  tipo: Tipo;
  regla: Regla;
  /** Los números de las líneas de las que sale, en el orden de la regla. */
  premisas: number[];
  /** Las variables que la regla liga, es decir, las hipótesis que descarga. */
  descarga: string[];
  /** El camino de esta parte en el término entero. */
  camino: string;
}

const REGLA: Record<Termino['k'], Regla> = {
  var: 'hipotesis',
  lam: 'intro-imp',
  ap: 'elim-imp',
  par: 'intro-y',
  pi1: 'elim-y-1',
  pi2: 'elim-y-2',
  inl: 'intro-o-1',
  inr: 'intro-o-2',
  caso: 'elim-o',
  absurdo: 'absurdo',
};

/**
 * La deducción de un término tipado: una línea por cada parte del término, con las partes antes que el todo, así que
 * las premisas de una línea siempre están antes. Lanza un `ErrorDeTipo` si el término no tiene tipo.
 */
export function deduccion(t: Termino, contexto: Contexto = []): Linea[] {
  const lineas: Linea[] = [];
  function visitar(s: Termino, ctx: Contexto, camino: string): number {
    let premisas: number[];
    let descarga: string[] = [];
    switch (s.k) {
      case 'var':
        premisas = [];
        break;
      case 'lam':
        premisas = [visitar(s.cuerpo, [...ctx, [s.x, s.tipo]], hijo(camino, 0))];
        descarga = [s.x];
        break;
      case 'caso': {
        const suma = tipar(s.s, ctx);
        if (suma.k !== 'suma') throw new ErrorDeTipo(`${escribirTermino(s.s)} no es una suma.`);
        premisas = [
          visitar(s.s, ctx, hijo(camino, 0)),
          visitar(s.u, [...ctx, [s.x, suma.a]], hijo(camino, 1)),
          visitar(s.v, [...ctx, [s.y, suma.b]], hijo(camino, 2)),
        ];
        descarga = [s.x, s.y];
        break;
      }
      default:
        premisas = hijos(s).map((h, i) => visitar(h, ctx, hijo(camino, i)));
    }
    lineas.push({
      numero: lineas.length + 1,
      contexto: ctx,
      termino: s,
      tipo: tipar(s, ctx),
      regla: REGLA[s.k],
      premisas,
      descarga,
      camino,
    });
    return lineas.length;
  }
  visitar(t, contexto, '');
  return lineas;
}

/** El nombre de la regla de una línea, con la negación aparte cuando la implicación es con ⊥. */
export function nombreDeRegla(linea: Linea): string {
  switch (linea.regla) {
    case 'hipotesis':
      return 'hipótesis';
    case 'intro-imp':
      return linea.tipo.k === 'flecha' && linea.tipo.b.k === 'vacio' ? 'introducción de ¬' : 'introducción de →';
    case 'elim-imp':
      return linea.tipo.k === 'vacio' ? 'eliminación de ¬' : 'eliminación de →';
    case 'intro-y':
      return 'introducción de ∧';
    case 'elim-y-1':
    case 'elim-y-2':
      return 'eliminación de ∧';
    case 'intro-o-1':
    case 'intro-o-2':
      return 'introducción de ∨';
    case 'elim-o':
      return 'eliminación de ∨';
    case 'absurdo':
      return 'absurdo';
  }
}

// La reducción.

/** Las variables libres de un término. */
export function libres(t: Termino): Set<string> {
  switch (t.k) {
    case 'var':
      return new Set([t.x]);
    case 'lam': {
      const c = libres(t.cuerpo);
      c.delete(t.x);
      return c;
    }
    case 'caso': {
      const u = libres(t.u);
      u.delete(t.x);
      const w = libres(t.v);
      w.delete(t.y);
      return new Set([...libres(t.s), ...u, ...w]);
    }
    default:
      return new Set(hijos(t).flatMap((h) => [...libres(h)]));
  }
}

/** Todas las variables que aparecen en un término, libres o ligadas. */
function variables(t: Termino): Set<string> {
  const propias = t.k === 'var' || t.k === 'lam' ? [t.x] : t.k === 'caso' ? [t.x, t.y] : [];
  return new Set([...propias, ...hijos(t).flatMap((h) => [...variables(h)])]);
}

/** Un nombre que no está en `usadas`: el mismo con primas, x′, x′′, … */
function nueva(x: string, usadas: Set<string>): string {
  let y = `${x}′`;
  while (usadas.has(y)) y += '′';
  return y;
}

/**
 * Liga `x` en `cuerpo` para sustituir en él `x` por `a`, renombrándola si capturaría una variable libre de `a`. Devuelve
 * el nombre que queda y el cuerpo, ya renombrado.
 */
function ligadura(y: string, cuerpo: Termino, x: string, a: Termino): [string, Termino] {
  if (!libres(a).has(y) || !libres(cuerpo).has(x)) return [y, cuerpo];
  const z = nueva(y, new Set([...variables(cuerpo), ...libres(a), x]));
  return [z, sustituir(cuerpo, y, v(z))];
}

/** t[a/x]: el término t con a en lugar de las apariciones libres de x, sin capturar las variables libres de a. */
export function sustituir(t: Termino, x: string, a: Termino): Termino {
  switch (t.k) {
    case 'var':
      return t.x === x ? a : t;
    case 'lam': {
      if (t.x === x) return t;
      const [y, cuerpo] = ligadura(t.x, t.cuerpo, x, a);
      return lam(y, t.tipo, sustituir(cuerpo, x, a));
    }
    case 'ap':
      return { k: 'ap', f: sustituir(t.f, x, a), a: sustituir(t.a, x, a) };
    case 'par':
      return par(sustituir(t.a, x, a), sustituir(t.b, x, a));
    case 'pi1':
    case 'pi2':
    case 'inl':
    case 'inr':
    case 'absurdo':
      return { ...t, t: sustituir(t.t, x, a) };
    case 'caso': {
      const s = sustituir(t.s, x, a);
      const [y1, u] = t.x === x ? [t.x, t.u] : ligadura(t.x, t.u, x, a);
      const [y2, w] = t.y === x ? [t.y, t.v] : ligadura(t.y, t.v, x, a);
      return {
        k: 'caso',
        s,
        x: y1,
        u: t.x === x ? u : sustituir(u, x, a),
        y: y2,
        v: t.y === x ? w : sustituir(w, x, a),
      };
    }
  }
}

export type ReglaDeReduccion = 'β' | 'π₁' | 'π₂' | 'caso-inl' | 'caso-inr';

/** Un paso de reducción: el término antes, dónde estaba el rodeo, con qué regla se redujo y el término después. */
export interface Reduccion {
  antes: Termino;
  camino: string;
  regla: ReglaDeReduccion;
  despues: Termino;
}

/** Si el término mismo es un rodeo, su regla y lo que queda al reducirlo. */
function contraer(t: Termino): [ReglaDeReduccion, Termino] | null {
  if (t.k === 'ap' && t.f.k === 'lam') return ['β', sustituir(t.f.cuerpo, t.f.x, t.a)];
  if ((t.k === 'pi1' || t.k === 'pi2') && t.t.k === 'par') return t.k === 'pi1' ? ['π₁', t.t.a] : ['π₂', t.t.b];
  if (t.k === 'caso' && t.s.k === 'inl') return ['caso-inl', sustituir(t.u, t.x, t.s.t)];
  if (t.k === 'caso' && t.s.k === 'inr') return ['caso-inr', sustituir(t.v, t.y, t.s.t)];
  return null;
}

/** El término con `nuevo` en el lugar del hijo `i`. */
function reemplazarHijo(t: Termino, i: number, nuevo: Termino): Termino {
  switch (t.k) {
    case 'lam':
      return { ...t, cuerpo: nuevo };
    case 'ap':
      return i === 0 ? { ...t, f: nuevo } : { ...t, a: nuevo };
    case 'par':
      return i === 0 ? { ...t, a: nuevo } : { ...t, b: nuevo };
    case 'caso':
      return i === 0 ? { ...t, s: nuevo } : i === 1 ? { ...t, u: nuevo } : { ...t, v: nuevo };
    case 'var':
      return t;
    default:
      return { ...t, t: nuevo };
  }
}

/** Una reducción, la del rodeo de más afuera y más a la izquierda, o `null` si el término está en forma normal. */
export function reducirUnPaso(t: Termino, camino = ''): Reduccion | null {
  const contraido = contraer(t);
  if (contraido) return { antes: t, camino, regla: contraido[0], despues: contraido[1] };
  const hs = hijos(t);
  for (let i = 0; i < hs.length; i++) {
    // La reducción del hijo trae el hijo ya reducido; basta ponerlo en su lugar.
    const r = reducirUnPaso(hs[i]!, hijo(camino, i));
    if (r) return { ...r, antes: t, despues: reemplazarHijo(t, i, r.despues) };
  }
  return null;
}

/** Las reducciones de afuera hacia adentro hasta la forma normal, o hasta `limite` pasos. */
export function reducir(t: Termino, limite = 100): Reduccion[] {
  const pasos: Reduccion[] = [];
  let actual = t;
  while (pasos.length < limite) {
    const r = reducirUnPaso(actual);
    if (!r) break;
    pasos.push(r);
    actual = r.despues;
  }
  return pasos;
}

// El catálogo de la pieza.

const A = base('A');
const B = base('B');
const C = base('C');

export interface DeduccionDelCatalogo {
  clave: string;
  /** Para el menú: el nombre y el enunciado. */
  nombre: string;
  /** Un término cerrado: la demostración. */
  termino: Termino;
  /** El término aplicado a unas demostraciones concretas, con un rodeo para reducir, y las variables que usa. */
  aplicacion: { termino: Termino; contexto: Contexto; descripcion: string };
}

const intercambio = lam('p', por(A, B), par(pi2(v('p')), pi1(v('p'))));
const currificacion = lam('f', imp(por(A, B), C), lam('a', A, lam('b', B, ap(v('f'), par(v('a'), v('b'))))));
const dobleNegacion = lam('x', A, lam('k', no(A), ap(v('k'), v('x'))));
const conmutatividad = lam('s', mas(A, B), caso(v('s'), 'x', inr(B, v('x')), 'y', inl(v('y'), A)));
const deMorgan = lam('h', no(mas(A, B)), par(lam('a', A, ap(v('h'), inl(v('a'), B))), lam('b', B, ap(v('h'), inr(A, v('b'))))));

export const CATALOGO: readonly DeduccionDelCatalogo[] = [
  {
    clave: 'intercambio',
    nombre: 'El intercambio: A ∧ B → B ∧ A',
    termino: intercambio,
    aplicacion: {
      termino: ap(intercambio, par(v('a'), v('b'))),
      contexto: [
        ['a', A],
        ['b', B],
      ],
      descripcion: 'un par ⟨a, b⟩ de demostraciones de A y de B',
    },
  },
  {
    clave: 'currificacion',
    nombre: 'La currificación: (A ∧ B → C) → (A → B → C)',
    termino: currificacion,
    aplicacion: {
      termino: ap(currificacion, v('g'), v('x'), v('y')),
      contexto: [
        ['g', imp(por(A, B), C)],
        ['x', A],
        ['y', B],
      ],
      descripcion: 'una demostración g de A ∧ B → C y demostraciones x de A e y de B',
    },
  },
  {
    clave: 'doble-negacion',
    nombre: 'La doble negación: A → ¬¬A',
    termino: dobleNegacion,
    aplicacion: {
      termino: ap(dobleNegacion, v('a'), v('r')),
      contexto: [
        ['a', A],
        ['r', no(A)],
      ],
      descripcion: 'una demostración a de A y una refutación r de A',
    },
  },
  {
    clave: 'conmutatividad',
    nombre: 'La conmutatividad de ∨: A ∨ B → B ∨ A',
    termino: conmutatividad,
    aplicacion: {
      termino: ap(conmutatividad, inl(v('a'), B)),
      contexto: [['a', A]],
      descripcion: 'inl a, una demostración de A ∨ B que dice que vale A',
    },
  },
  {
    clave: 'de-morgan',
    nombre: 'De Morgan: ¬(A ∨ B) → ¬A ∧ ¬B',
    termino: deMorgan,
    aplicacion: {
      termino: ap(pi1(ap(deMorgan, v('r'))), v('x')),
      contexto: [
        ['r', no(mas(A, B))],
        ['x', A],
      ],
      descripcion: 'una refutación r de A ∨ B, de la que se toma la primera componente y se aplica a una demostración x de A',
    },
  },
];
