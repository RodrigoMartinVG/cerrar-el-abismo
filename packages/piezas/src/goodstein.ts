/**
 * La matemática de la pieza «sucesion-de-goodstein» (I.11). Un número se escribe en base b hereditaria: como suma de
 * términos c·b^e con 0 < c < b, y cada exponente e escrito del mismo modo, hasta que no queden más que cifras. Un paso
 * de Goodstein reemplaza cada b por b + 1 y resta 1. Si en la escritura se reemplaza la base por ω, a cada término le
 * corresponde un ordinal en forma normal de Cantor, y esos ordinales bajan en cada paso.
 *
 * Los ordinales menores que ω² son los ω·a + c, que corresponden a los términos a·b + c con a, c < b y al par (a, c)
 * de ℕ × ℕ en el orden lexicográfico: con ellos la pieza dibuja el descenso.
 */

/** Un término c·b^e de una escritura hereditaria, con 0 < c < b y el exponente escrito también en base hereditaria. */
export interface Termino {
  coeficiente: bigint;
  exponente: Hereditaria;
}

/** Una escritura en base hereditaria: sus términos, del exponente mayor al menor. La lista vacía es el 0. */
export type Hereditaria = Termino[];

/** El tamaño máximo, en bits, de los términos que la pieza calcula: unas 6000 cifras decimales. */
export const BITS_MAXIMOS = 20_000;

/** La escritura de n ≥ 0 en base b ≥ 2 hereditaria. */
export function escrituraHereditaria(n: bigint, base: bigint): Hereditaria {
  if (n < 0n || base < 2n) throw new RangeError('Hace falta n ≥ 0 y una base b ≥ 2.');
  const terminos: Hereditaria = [];
  let resto = n;
  let exponente = 0n;
  while (resto > 0n) {
    const cifra = resto % base;
    if (cifra > 0n) terminos.unshift({ coeficiente: cifra, exponente: escrituraHereditaria(exponente, base) });
    resto /= base;
    exponente++;
  }
  return terminos;
}

/**
 * El valor de una escritura hereditaria leída en otra base (la misma escritura con cada b reemplazada por `base`), o
 * `null` si alguna potencia pasa de `bitsMaximos` bits.
 */
export function valorEnBase(h: Hereditaria, base: bigint, bitsMaximos = BITS_MAXIMOS): bigint | null {
  const bitsPorCifra = Math.log2(Number(base));
  let total = 0n;
  for (const { coeficiente, exponente } of h) {
    const e = valorEnBase(exponente, base, bitsMaximos);
    if (e === null || Number(e) * bitsPorCifra > bitsMaximos) return null;
    total += coeficiente * base ** e;
  }
  return total;
}

/** Un término de una sucesión de Goodstein: cuántos pasos se dieron, la base, el valor y su escritura hereditaria. */
export interface TerminoDeGoodstein {
  paso: number;
  base: bigint;
  valor: bigint;
  escritura: Hereditaria;
}

/** El término de partida: n escrito en la base inicial (en la sucesión clásica, la base 2). */
export function comienzoDeGoodstein(n: bigint, base = 2n): TerminoDeGoodstein {
  return { paso: 0, base, valor: n, escritura: escrituraHereditaria(n, base) };
}

/**
 * El paso de Goodstein: cambia cada b de la escritura por b + 1 y resta 1. Devuelve `null` si el término es 0, porque
 * la sucesión terminó, o si el siguiente pasa de `bitsMaximos` bits.
 */
export function pasoDeGoodstein(t: TerminoDeGoodstein, bitsMaximos = BITS_MAXIMOS): TerminoDeGoodstein | null {
  if (t.valor === 0n) return null;
  const cambiado = valorEnBase(t.escritura, t.base + 1n, bitsMaximos);
  if (cambiado === null) return null;
  const base = t.base + 1n;
  const valor = cambiado - 1n;
  return { paso: t.paso + 1, base, valor, escritura: escrituraHereditaria(valor, base) };
}

/** Los primeros términos, hasta `cuantos` o hasta llegar a 0, como en la celda del capítulo. */
export function sucesionDeGoodstein(n: bigint, cuantos: number, base = 2n): bigint[] {
  const valores: bigint[] = [];
  let t: TerminoDeGoodstein | null = comienzoDeGoodstein(n, base);
  while (t && valores.length < cuantos) {
    valores.push(t.valor);
    t = pasoDeGoodstein(t);
  }
  return valores;
}

/**
 * Compara los ordinales de dos escrituras, con la base reemplazada por ω: en la forma normal de Cantor manda el
 * término de mayor exponente, después su coeficiente, y así. Devuelve un número negativo, 0 o positivo.
 */
export function compararOrdinales(a: Hereditaria, b: Hereditaria): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const porExponente = compararOrdinales(a[i]!.exponente, b[i]!.exponente);
    if (porExponente !== 0) return porExponente;
    if (a[i]!.coeficiente !== b[i]!.coeficiente) return a[i]!.coeficiente < b[i]!.coeficiente ? -1 : 1;
  }
  return a.length - b.length;
}

/** El exponente de un término, si es una cifra (0, 1, 2…), o `null` si es una escritura con la base adentro. */
function cifraDe(h: Hereditaria): bigint | null {
  if (h.length === 0) return 0n;
  if (h.length === 1 && h[0]!.exponente.length === 0) return h[0]!.coeficiente;
  return null;
}

/** Un exponente en texto: entre paréntesis si tiene más de un símbolo. */
function exponenteEnTexto(texto: string): string {
  return /^[\wω]+$/u.test(texto) ? texto : `(${texto})`;
}

/** La escritura en texto, con la base `b` dada como texto: «2·3^2 + 2·3 + 2», «2^(2 + 1) + 2». */
export function textoHereditario(h: Hereditaria, b: string): string {
  if (h.length === 0) return '0';
  return h
    .map(({ coeficiente, exponente }) => {
      const e = cifraDe(exponente);
      const c = String(coeficiente);
      if (e === 0n) return c;
      const potencia = e === 1n ? b : `${b}^${exponenteEnTexto(textoHereditario(exponente, b))}`;
      return coeficiente === 1n ? potencia : `${c}·${potencia}`;
    })
    .join(' + ');
}

/**
 * El ordinal de una escritura, en texto: la base reemplazada por ω y el coeficiente a la derecha, como se escribe la
 * forma normal de Cantor: «ω^2·2 + ω·2 + 2», «ω^ω», «ω^(ω + 1) + 1».
 */
export function textoOrdinal(h: Hereditaria): string {
  if (h.length === 0) return '0';
  return h
    .map(({ coeficiente, exponente }) => {
      const e = cifraDe(exponente);
      const c = String(coeficiente);
      if (e === 0n) return c;
      const potencia = e === 1n ? 'ω' : `ω^${exponenteEnTexto(textoOrdinal(exponente))}`;
      return coeficiente === 1n ? potencia : `${potencia}·${c}`;
    })
    .join(' + ');
}

/**
 * Si el ordinal de la escritura es menor que ω², es ω·a + c: devuelve el par (a, c) de ℕ × ℕ que le corresponde en el
 * orden lexicográfico. Si no, `null`.
 */
export function parEnOmegaCuadrado(h: Hereditaria): [bigint, bigint] | null {
  let a = 0n;
  let c = 0n;
  for (const { coeficiente, exponente } of h) {
    const e = cifraDe(exponente);
    if (e === 0n) c = coeficiente;
    else if (e === 1n) a = coeficiente;
    else return null;
  }
  return [a, c];
}

/**
 * Cuántos pasos le faltan para llegar a 0 a un término a·b + c con a, c < b, cuyo ordinal es ω·a + c: con c pasos la
 * segunda coordenada llega a 0, y el siguiente baja la primera y deja la segunda en la base; contando así, son
 * c + (b + c + 1)(2^a − 1).
 */
export function pasosHastaCero(a: bigint, c: bigint, base: bigint): bigint {
  return c + (base + c + 1n) * (2n ** a - 1n);
}
