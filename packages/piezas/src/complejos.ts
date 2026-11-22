/**
 * La matemática de la pieza «multiplicacion-compleja» (I.9): los complejos como puntos del plano, su forma polar y el
 * producto, que multiplica los módulos y suma los argumentos (teorema de la forma polar). El argumento que se informa es
 * el principal, en el intervalo (−π, π], como el de `atan2` y `cmath.phase`; por eso el argumento de un producto es la
 * suma de los argumentos solo salvo vueltas enteras.
 */

/** Un número complejo a + bi, como el par (a, b). */
export type Complejo = readonly [re: number, im: number];

export function productoComplejo([a, b]: Complejo, [c, d]: Complejo): Complejo {
  return [a * c - b * d, a * d + b * c];
}

export function moduloComplejo([a, b]: Complejo): number {
  return Math.hypot(a, b);
}

/** Reduce un ángulo al intervalo (−π, π], sumándole o restándole vueltas enteras. */
export function reducirAngulo(theta: number): number {
  const vuelta = 2 * Math.PI;
  let t = theta - vuelta * Math.round(theta / vuelta);
  if (t <= -Math.PI) t += vuelta;
  if (t > Math.PI) t -= vuelta;
  return t;
}

/** El argumento principal, en (−π, π]; el de 0, que no tiene argumento, se toma como 0. */
export function argumentoPrincipal([a, b]: Complejo): number {
  if (a === 0 && b === 0) return 0;
  return reducirAngulo(Math.atan2(b, a));
}

/** El complejo de módulo r y argumento θ: r(cos θ + i sen θ). */
export function complejoDesdePolar(r: number, theta: number): Complejo {
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

/** Los puntos z, zw, zw², …, zwⁿ: lo que hace un programa que multiplica n veces por w. */
export function potenciasPorW(z: Complejo, w: Complejo, n: number): Complejo[] {
  const puntos: Complejo[] = [z];
  for (let k = 1; k <= n; k++) puntos.push(productoComplejo(puntos[k - 1]!, w));
  return puntos;
}

/** Lo que dice el teorema de la forma polar sobre z·wⁿ, con los números de la pieza. */
export interface ProductoExplicado {
  producto: Complejo;
  /** |z|, |w| y |z|·|w|ⁿ, que es el módulo del producto. */
  moduloZ: number;
  moduloW: number;
  moduloProducto: number;
  /** Los argumentos principales de z, de w y del producto. */
  argumentoZ: number;
  argumentoW: number;
  argumentoProducto: number;
  /** θ + nφ, la suma que da el teorema, y cuántas vueltas enteras la separan del argumento principal del producto. */
  suma: number;
  vueltas: number;
}

export function explicarProducto(z: Complejo, w: Complejo, n: number): ProductoExplicado {
  const producto = potenciasPorW(z, w, n)[n]!;
  const argumentoZ = argumentoPrincipal(z);
  const argumentoW = argumentoPrincipal(w);
  const argumentoProducto = argumentoPrincipal(producto);
  const suma = argumentoZ + n * argumentoW;
  return {
    producto,
    moduloZ: moduloComplejo(z),
    moduloW: moduloComplejo(w),
    moduloProducto: moduloComplejo(z) * moduloComplejo(w) ** n,
    argumentoZ,
    argumentoW,
    argumentoProducto,
    suma,
    vueltas: Math.round((suma - argumentoProducto) / (2 * Math.PI)),
  };
}

/** Ajusta un punto a la cuadrícula de lado `paso`. */
export function ajustarACuadricula([a, b]: Complejo, paso: number): Complejo {
  const ajustar = (x: number) => Math.round(x / paso) * paso + 0;
  return [ajustar(a), ajustar(b)];
}

/**
 * Ajusta un punto en coordenadas polares: el módulo a un múltiplo de `pasoDelModulo` y el argumento a un múltiplo de
 * π/`partesDePi`. Así se pueden elegir exactamente las raíces de la unidad, como cos(2π/3) + i sen(2π/3).
 */
export function ajustarPolar(z: Complejo, pasoDelModulo: number, partesDePi: number): Complejo {
  const r = Math.round(moduloComplejo(z) / pasoDelModulo) * pasoDelModulo;
  const paso = Math.PI / partesDePi;
  const theta = Math.round(argumentoPrincipal(z) / paso) * paso;
  const [a, b] = complejoDesdePolar(r, theta);
  // Sin restos de redondeo como 6e-17 en lugar de 0.
  const limpiar = (x: number) => (Math.abs(x) < 1e-12 ? 0 : x);
  return [limpiar(a), limpiar(b)];
}

/** Un número con coma decimal y a lo sumo `cifras` decimales, sin ceros de más y con el signo menos tipográfico. */
export function escribirNumero(x: number, cifras = 3): string {
  const redondeado = Number(x.toFixed(cifras));
  if (redondeado === 0) return '0';
  const texto = Math.abs(redondeado)
    .toFixed(cifras)
    .replace(/\.?0+$/, '')
    .replace('.', ',');
  return redondeado < 0 ? `−${texto}` : texto;
}

/** Un complejo como a + bi: «2 + i», «−0,5 + 0,866i», «−3i», «0». */
export function escribirComplejo([a, b]: Complejo, cifras = 3): string {
  const re = escribirNumero(a, cifras);
  const im = escribirNumero(b, cifras);
  if (im === '0') return re;
  const coeficiente = (texto: string) => (texto === '1' ? '' : texto);
  if (re === '0') return im.startsWith('−') ? `−${coeficiente(im.slice(1))}i` : `${coeficiente(im)}i`;
  return im.startsWith('−') ? `${re} − ${coeficiente(im.slice(1))}i` : `${re} + ${coeficiente(im)}i`;
}

/**
 * Un ángulo como múltiplo racional de π con denominador chico, si lo es: «π/4», «−2π/3», «π», «0». Si no lo es,
 * devuelve `undefined`.
 */
export function anguloComoFraccionDePi(theta: number, denominadorMaximo = 12): string | undefined {
  const x = theta / Math.PI;
  for (let q = 1; q <= denominadorMaximo; q++) {
    const p = Math.round(x * q);
    if (Math.abs(x * q - p) > 1e-9) continue;
    if (p === 0) return '0';
    const signo = p < 0 ? '−' : '';
    const numerador = Math.abs(p) === 1 ? 'π' : `${Math.abs(p)}π`;
    return q === 1 ? `${signo}${numerador}` : `${signo}${numerador}/${q}`;
  }
  return undefined;
}

/** Un ángulo en radianes, con los grados entre paréntesis: «π/4 (45°)», «0,464 (26,6°)». */
export function escribirAngulo(theta: number): string {
  const radianes = anguloComoFraccionDePi(theta) ?? escribirNumero(theta, 3);
  return `${radianes} (${escribirNumero((theta * 180) / Math.PI, 1)}°)`;
}
