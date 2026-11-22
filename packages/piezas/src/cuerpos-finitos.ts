/**
 * La matemática de la pieza «multiplicacion-de-bytes» (I.8): el producto de dos bytes en GF(2⁸), hecho como lo define
 * la norma de AES. Un byte b₇…b₀ es el polinomio b₇x⁷ + … + b₁x + b₀ con coeficientes en 𝔽₂, y un entero guarda
 * cualquier polinomio de 𝔽₂[x]: el bit k es el coeficiente de xᵏ. Multiplicar a por b tiene dos pasos:
 *
 * 1. sumar, con el «o exclusivo», una copia de a corrida k lugares por cada bit k de b que vale 1: es el producto
 *    sin acarreo, un polinomio de grado a lo sumo 14;
 * 2. reducirlo módulo un polinomio m de grado 8: mientras quede un bit en una posición k ≥ 8, se le suma m corrido
 *    k − 8 lugares, que borra ese bit y no toca los más altos.
 */

/** Los polinomios de reducción que ofrece la pieza: el de AES, el de los códigos QR y uno reducible, (x + 1)⁸. */
export const POLINOMIOS_DE_REDUCCION = {
  aes: 0x11b,
  qr: 0x11d,
  reducible: 0x101,
} as const;

export type NombreDePolinomio = keyof typeof POLINOMIOS_DE_REDUCCION;

/** Una copia de a corrida `bit` lugares, que el producto suma porque el bit `bit` de b vale 1. */
export interface CopiaCorrida {
  bit: number;
  valor: number;
}

/** Un paso de la reducción: el bit más alto, de grado `grado`, se borra sumando m corrido `grado − 8` lugares. */
export interface PasoDeReduccion {
  grado: number;
  antes: number;
  sumando: number;
  despues: number;
}

export interface ProductoDeBytes {
  a: number;
  b: number;
  m: number;
  copias: CopiaCorrida[];
  sinAcarreo: number;
  pasos: PasoDeReduccion[];
  resultado: number;
}

/** El grado de un polinomio de 𝔽₂[x] guardado en un entero; −1 para el polinomio nulo, que no tiene grado. */
export function gradoEnF2(p: number): number {
  return p === 0 ? -1 : 31 - Math.clz32(p);
}

/** Las copias corridas de a que suma el producto por b, de la del bit más bajo a la del más alto. */
export function copiasCorridas(a: number, b: number): CopiaCorrida[] {
  const copias: CopiaCorrida[] = [];
  for (let bit = 0; bit < 8; bit++) if ((b >> bit) & 1) copias.push({ bit, valor: a << bit });
  return copias;
}

/** El producto en 𝔽₂[x] de dos polinomios de grado a lo sumo 7: la suma sin acarreo de las copias corridas. */
export function productoSinAcarreo(a: number, b: number): number {
  return copiasCorridas(a, b).reduce((suma, copia) => suma ^ copia.valor, 0);
}

/** Los pasos que llevan p a su resto módulo m, con m de grado n ≥ 1: uno por cada bit que queda en un grado ≥ n. */
export function reduccionPasoAPaso(p: number, m: number): PasoDeReduccion[] {
  const n = gradoEnF2(m);
  if (n < 1) throw new Error('El polinomio de reducción tiene que tener grado por lo menos 1.');
  const pasos: PasoDeReduccion[] = [];
  let actual = p;
  while (gradoEnF2(actual) >= n) {
    const grado = gradoEnF2(actual);
    const sumando = m << (grado - n);
    pasos.push({ grado, antes: actual, sumando, despues: actual ^ sumando });
    actual ^= sumando;
  }
  return pasos;
}

/** El resto de p módulo m en 𝔽₂[x]. */
export function restoEnF2(p: number, m: number): number {
  const pasos = reduccionPasoAPaso(p, m);
  return pasos.length === 0 ? p : pasos[pasos.length - 1]!.despues;
}

/** El producto de dos bytes módulo m (por omisión, el polinomio de AES), con todos sus pasos. */
export function multiplicarBytes(a: number, b: number, m: number = POLINOMIOS_DE_REDUCCION.aes): ProductoDeBytes {
  for (const x of [a, b])
    if (!Number.isInteger(x) || x < 0 || x > 0xff) throw new RangeError(`${x} no es un byte: tiene que estar entre 0 y 255.`);
  const copias = copiasCorridas(a, b);
  const sinAcarreo = productoSinAcarreo(a, b);
  const pasos = reduccionPasoAPaso(sinAcarreo, m);
  return { a, b, m, copias, sinAcarreo, pasos, resultado: restoEnF2(sinAcarreo, m) };
}

/** La operación `xtime` de la norma FIPS 197: multiplicar un byte por x, es decir, por 0x02, en el cuerpo de AES. */
export function xtime(x: number): number {
  return ((x << 1) ^ (x & 0x80 ? 0x1b : 0)) & 0xff;
}

/** El inverso de un byte módulo m, buscándolo entre los 255 bytes no nulos, o `null` si no tiene. */
export function inversoDeByte(a: number, m: number = POLINOMIOS_DE_REDUCCION.aes): number | null {
  for (let b = 1; b < 256; b++) if (multiplicarBytes(a, b, m).resultado === 1) return b;
  return null;
}

const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** La potencia xᵏ escrita con superíndices: «1», «x», «x²», …, «x¹⁴». */
export function potenciaDeX(k: number): string {
  if (k === 0) return '1';
  if (k === 1) return 'x';
  return `x${[...String(k)].map((c) => SUPERINDICES[Number(c)]).join('')}`;
}

/** Un polinomio de 𝔽₂[x] escrito con potencias decrecientes: 0x11B es «x⁸ + x⁴ + x³ + x + 1». */
export function polinomioDeBits(p: number): string {
  if (p === 0) return '0';
  const terminos: string[] = [];
  for (let k = gradoEnF2(p); k >= 0; k--) if ((p >> k) & 1) terminos.push(potenciaDeX(k));
  return terminos.join(' + ');
}

/** Los `ancho` bits más bajos de p, del más alto al más bajo. */
export function bitsDe(p: number, ancho: number): string {
  return p.toString(2).padStart(ancho, '0').slice(-ancho);
}

/** Un byte escrito en hexadecimal, como «0x57», «57» o «c1», o `null` si el texto no es un byte. */
export function leerByte(texto: string): number | null {
  const m = /^\s*(?:0x)?([0-9a-f]{1,2})\s*$/i.exec(texto);
  return m ? parseInt(m[1]!, 16) : null;
}

/** Un byte en la notación de la obra: «0x57», con dos cifras hexadecimales en mayúscula. */
export function escribirByte(x: number): string {
  return `0x${x.toString(16).toUpperCase().padStart(2, '0')}`;
}
