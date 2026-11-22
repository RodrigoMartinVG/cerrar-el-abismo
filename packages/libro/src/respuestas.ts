/**
 * LAS RESPUESTAS DE LOS EJERCICIOS DE CÁLCULO (decisión 0006). Una respuesta es un número: un entero, una fracción
 * `a/b` o un decimal, con punto o con coma. Se compara exactamente si las dos partes son enteros o fracciones, y con
 * una tolerancia relativa si alguna es decimal. Este módulo no depende de nada, porque lo usan a la vez las pruebas y
 * el navegador.
 */

/** Un número leído de un texto: su valor y, si es entero o fracción, la fracción exacta reducida. */
export interface Numero {
  valor: number;
  exacto?: { numerador: bigint; denominador: bigint };
}

function mcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Lee un número escrito por una persona: «12», «−3», «7/12», «0,25», «1.5e-3». Devuelve `undefined` si no lo es. */
export function leerNumero(texto: string): Numero | undefined {
  // Los espacios, también los finos, separan los miles: «2 598 960». El punto no, porque se confundiría con el decimal.
  const t = texto.trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  const fraccion = /^([+-]?\d+)(?:\/([+-]?\d+))?$/.exec(t);
  if (fraccion) {
    let numerador = BigInt(fraccion[1]!);
    let denominador = BigInt(fraccion[2] ?? '1');
    if (denominador === 0n) return undefined;
    if (denominador < 0n) [numerador, denominador] = [-numerador, -denominador];
    const d = mcd(numerador, denominador) || 1n;
    numerador /= d;
    denominador /= d;
    return { valor: Number(numerador) / Number(denominador), exacto: { numerador, denominador } };
  }
  const decimal = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)(e[+-]?\d+)?$/i.exec(t);
  if (decimal) {
    const valor = Number(t.replace(',', '.'));
    return Number.isFinite(valor) ? { valor } : undefined;
  }
  return undefined;
}

/**
 * ¿La respuesta del lector coincide con la del ejercicio? Exactamente, si las dos son enteros o fracciones; si no, con
 * la tolerancia relativa dada, que por omisión es de una parte en un millón.
 */
export function coincide(dada: Numero, esperada: Numero, tolerancia = 1e-6): boolean {
  if (dada.exacto && esperada.exacto)
    return dada.exacto.numerador === esperada.exacto.numerador && dada.exacto.denominador === esperada.exacto.denominador;
  const escala = Math.max(Math.abs(esperada.valor), Number.MIN_VALUE);
  return Math.abs(dada.valor - esperada.valor) <= tolerancia * escala;
}
