/**
 * La matemática de las piezas de coma flotante (I.10): un sistema de juguete con pocas cifras para ver su espaciado, y
 * cuentas hechas a la vez con racionales exactos, en doble precisión y en precisión simple, para comparar.
 */

/** Un racional exacto, con numerador y denominador enteros y el denominador positivo, siempre reducido. */
export class Racional {
  readonly num: bigint;
  readonly den: bigint;

  constructor(num: bigint, den: bigint = 1n) {
    if (den === 0n) throw new Error('Denominador nulo.');
    if (den < 0n) [num, den] = [-num, -den];
    const d = mcd(num, den) || 1n;
    this.num = num / d;
    this.den = den / d;
  }

  /** El valor exacto de un decimal escrito: «0.1» es 1/10, no el número que guarda la máquina. */
  static deDecimal(texto: string): Racional {
    const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(texto.trim());
    if (!m || (m[2] === '' && (m[3] ?? '') === '')) throw new Error(`«${texto}» no es un decimal.`);
    const cifras = `${m[2]}${m[3] ?? ''}` || '0';
    const exponente = Number(m[4] ?? '0') - (m[3] ?? '').length;
    let num = BigInt(cifras) * (m[1] === '-' ? -1n : 1n);
    let den = 1n;
    if (exponente >= 0) num *= 10n ** BigInt(exponente);
    else den = 10n ** BigInt(-exponente);
    return new Racional(num, den);
  }

  /** El valor exacto de un número de doble precisión, que siempre es un racional con denominador potencia de 2. */
  static deDoble(x: number): Racional {
    if (!Number.isFinite(x)) throw new Error('Solo números finitos.');
    if (x === 0) return new Racional(0n);
    const vista = new DataView(new ArrayBuffer(8));
    vista.setFloat64(0, x);
    const bits = vista.getBigUint64(0);
    const signo = bits >> 63n ? -1n : 1n;
    const exponente = Number((bits >> 52n) & 0x7ffn);
    const fraccion = bits & ((1n << 52n) - 1n);
    const mantisa = exponente === 0 ? fraccion : fraccion | (1n << 52n);
    const e = (exponente === 0 ? 1 : exponente) - 1075;
    return e >= 0 ? new Racional(signo * mantisa * 2n ** BigInt(e)) : new Racional(signo * mantisa, 2n ** BigInt(-e));
  }

  mas(otro: Racional): Racional {
    return new Racional(this.num * otro.den + otro.num * this.den, this.den * otro.den);
  }

  menos(otro: Racional): Racional {
    return new Racional(this.num * otro.den - otro.num * this.den, this.den * otro.den);
  }

  por(otro: Racional): Racional {
    return new Racional(this.num * otro.num, this.den * otro.den);
  }

  abs(): Racional {
    return new Racional(this.num < 0n ? -this.num : this.num, this.den);
  }

  esCero(): boolean {
    return this.num === 0n;
  }

  /** Una aproximación de doble precisión, para mostrar tamaños, no para calcular. */
  aproximado(): number {
    if (this.num === 0n) return 0;
    const n = this.num < 0n ? -this.num : this.num;
    const k = this.den.toString().length - n.toString().length + 17;
    const escalado = k >= 0 ? (n * 10n ** BigInt(k)) / this.den : n / (this.den * 10n ** BigInt(-k));
    return Number(`${this.num < 0n ? '-' : ''}${escalado}e${-k}`);
  }

  /** El desarrollo decimal con `cifras` cifras después de la coma, truncado, con «…» si sigue. */
  decimal(cifras: number): string {
    const negativo = this.num < 0n;
    let resto = negativo ? -this.num : this.num;
    const entero = resto / this.den;
    resto %= this.den;
    let parte = '';
    for (let i = 0; i < cifras && resto !== 0n; i++) {
      resto *= 10n;
      parte += String(resto / this.den);
      resto %= this.den;
    }
    const texto = parte ? `${entero},${parte}` : String(entero);
    return `${negativo ? '−' : ''}${texto}${resto !== 0n ? '…' : ''}`;
  }
}

function mcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Los tres resultados de una misma cuenta: con racionales exactos, en doble precisión y en precisión simple. */
export interface TresCuentas {
  exacto: Racional;
  doble: number;
  simple: number;
}

/** El error relativo exacto de un número de la máquina respecto del valor verdadero, como número para mostrar. */
export function errorRelativo(calculado: number, exacto: Racional): number {
  if (exacto.esCero()) return calculado === 0 ? 0 : Infinity;
  return Racional.deDoble(calculado).menos(exacto).abs().por(new Racional(exacto.den, exacto.num).abs()).aproximado();
}

/** Sumar `n` veces el decimal `sumando`, empezando de 0. */
export function sumaRepetida(sumando: string, n: number): TresCuentas {
  const s = Racional.deDecimal(sumando);
  const d = Number(sumando);
  const f = Math.fround(d);
  let doble = 0;
  let simple = 0;
  for (let i = 0; i < n; i++) {
    doble += d;
    simple = Math.fround(simple + f);
  }
  return { exacto: s.por(new Racional(BigInt(n))), doble, simple };
}

/**
 * Sumar un 1 y `m` veces 10⁻⁸, con el 1 primero o al final. Exacto da lo mismo; en la máquina, si el 1 va primero,
 * cada sumando chico se pierde en el redondeo, y si va al final, los chicos se juntan antes.
 */
export function ordenDeLaSuma(m: number, orden: 'grande-primero' | 'chicos-primero'): TresCuentas {
  const chico = 1e-8;
  const chicoSimple = Math.fround(chico);
  const exacto = new Racional(1n).mas(new Racional(BigInt(m), 10n ** 8n));
  let doble = orden === 'grande-primero' ? 1 : 0;
  let simple = doble;
  for (let i = 0; i < m; i++) {
    doble += chico;
    simple = Math.fround(simple + chicoSimple);
  }
  if (orden === 'chicos-primero') {
    doble += 1;
    simple = Math.fround(simple + 1);
  }
  return { exacto, doble, simple };
}

/** (1 + x) − 1, que debería dar x: la cancelación deja a la vista el redondeo de 1 + x. */
export function cancelacion(x: string): TresCuentas {
  const d = Number(x);
  const f = Math.fround(d);
  return {
    exacto: Racional.deDecimal(x),
    doble: 1 + d - 1,
    simple: Math.fround(Math.fround(1 + f) - 1),
  };
}

/** Los bits de un número de precisión simple: signo, 8 de exponente y 23 de fracción. */
export function bitsSimple(x: number): { signo: string; exponente: string; fraccion: string } {
  const vista = new DataView(new ArrayBuffer(4));
  vista.setFloat32(0, x);
  const bits = vista.getUint32(0).toString(2).padStart(32, '0');
  return { signo: bits.slice(0, 1), exponente: bits.slice(1, 9), fraccion: bits.slice(9) };
}

/**
 * Un sistema de coma flotante de juguete, con precisión `p` y exponentes entre `emin` y `emax`: sus números positivos,
 * normales y, si se piden, subnormales, en orden.
 */
export function sistemaDeJuguete(p: number, emin: number, emax: number, subnormales: boolean): number[] {
  const numeros = new Set<number>();
  for (let e = emin; e <= emax; e++) for (let m = 2 ** (p - 1); m < 2 ** p; m++) numeros.add(m * 2 ** (e - p + 1));
  if (subnormales) for (let m = 1; m < 2 ** (p - 1); m++) numeros.add(m * 2 ** (emin - p + 1));
  return [...numeros].sort((a, b) => a - b);
}

/**
 * Redondea `x ≥ 0` al número más cercano del sistema, con los empates al que termina en cifra par (la mantisa par), y
 * a infinito si pasa del máximo más media unidad del último lugar.
 */
export function redondearEnSistema(x: number, p: number, emin: number, emax: number, subnormales: boolean): number {
  const numeros = [0, ...sistemaDeJuguete(p, emin, emax, subnormales)];
  const maximo = numeros[numeros.length - 1]!;
  const medioUlp = 2 ** (emax - p);
  if (x >= maximo + medioUlp) return Infinity;
  let mejor = 0;
  for (const y of numeros) {
    const dy = Math.abs(y - x);
    const dm = Math.abs(mejor - x);
    if (dy < dm) mejor = y;
    else if (dy === dm && y !== mejor) {
      const paso = (z: number) => {
        if (z === 0) return 0;
        const e = Math.max(Math.floor(Math.log2(z)), emin);
        return Math.round(z / 2 ** (e - p + 1));
      };
      if (paso(y) % 2 === 0) mejor = y;
    }
  }
  return mejor;
}
