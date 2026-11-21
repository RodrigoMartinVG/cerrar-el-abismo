/**
 * La matemática de la pieza «dispersion» (I.2): una función de dispersión reparte un conjunto de claves en m cubetas.
 * Las claves que caen en la misma cubeta son las fibras de la función, y forman una partición del conjunto; si hay más
 * claves que cubetas, alguna cubeta recibe al menos ⌈n/m⌉ (el principio del palomar).
 */

export type FuncionDeDispersion = 'suma' | 'polinomial';

/** La suma de los códigos de los caracteres: una función de dispersión mala, porque no ve el orden de las letras. */
export function dispersionSuma(clave: string): number {
  let h = 0;
  for (const c of clave) h += c.codePointAt(0)!;
  return h;
}

/**
 * La fórmula de `String.hashCode` de Java: s[0]·31^(n−1) + s[1]·31^(n−2) + ⋯ + s[n−1], sobre las unidades UTF-16 de
 * la cadena y con la aritmética de los enteros de 32 bits, que da la vuelta al desbordarse.
 */
export function dispersionPolinomial(clave: string): number {
  let h = 0;
  for (let i = 0; i < clave.length; i++) h = (Math.imul(h, 31) + clave.charCodeAt(i)) | 0;
  return h;
}

/** La cubeta de un valor de dispersión, entre 0 y m − 1, también para valores negativos. */
export function cubeta(h: number, m: number): number {
  return ((h % m) + m) % m;
}

/** Las claves de un texto separadas por comas, espacios o líneas, sin repetir: un conjunto, no una lista. */
export function leerClaves(texto: string): string[] {
  return [...new Set(texto.split(/[\s,;]+/).filter((c) => c !== ''))];
}

export interface Reparto {
  /** Las claves de cada cubeta, en el orden en que llegaron. */
  cubetas: string[][];
  /** Si dos claves distintas nunca comparten cubeta. */
  inyectiva: boolean;
  /** Cuántas claves tiene la cubeta más llena. */
  maxima: number;
  /** Lo que garantiza el principio del palomar: alguna cubeta tiene al menos ⌈n/m⌉ claves. */
  garantia: number;
}

export function repartir(claves: readonly string[], m: number, funcion: FuncionDeDispersion): Reparto {
  const h = funcion === 'suma' ? dispersionSuma : dispersionPolinomial;
  const cubetas = Array.from({ length: m }, () => [] as string[]);
  for (const clave of claves) cubetas[cubeta(h(clave), m)]!.push(clave);
  const maxima = Math.max(0, ...cubetas.map((c) => c.length));
  return { cubetas, inyectiva: maxima <= 1, maxima, garantia: Math.ceil(claves.length / m) };
}
