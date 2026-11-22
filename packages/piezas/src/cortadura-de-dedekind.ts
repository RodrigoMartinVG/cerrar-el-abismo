import { escribirNumero } from './complejos.ts';
import {
  distanciaEntreFracciones,
  mayorEnLaCortadura,
  menorFueraDeLaCortadura,
  racionalesEnVentana,
  REALES_POR_CORTADURA,
  type FraccionEntera,
  type RealPorCortadura,
} from './cortaduras.ts';

/**
 * PIEZA «cortadura-de-dedekind» (I.9). Un tramo de la recta alrededor de un real, con los racionales de denominador a lo
 * sumo N como marcas, más altas cuanto más chico el denominador: en la tinta base los de la cortadura, a la izquierda, y
 * en cobre los que quedan afuera. Cada marca se decide con la regla exacta del real, con enteros, sin usar su valor
 * aproximado. Se destacan el mayor racional de la cortadura y el menor de afuera; con un racional r, el menor de afuera
 * es r mismo, y con un irracional los dos se acercan al crecer N sin que ninguno sea el último.
 *
 * Atributos opcionales: `data-real` (`raiz-de-2`, `raiz-cubica-de-2`, `aureo`, `un-medio` o `siete-quintos`), `data-n`
 * (de 1 a 120) y `data-ampliacion` (de 1 a 1000).
 */

const N_MAXIMO = 120;
const ALTO = 160;
const EJE = 100;

const escribirFraccion = ([p, q]: FraccionEntera) => (q === 1 ? escribirNumero(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`);

/** La lectura de la pieza: la regla, los dos racionales destacados y lo que pasa al crecer N. */
function describir(real: RealPorCortadura, n: number): string {
  const adentro = mayorEnLaCortadura(real, n);
  const afuera = menorFueraDeLaCortadura(real, n);
  const aproximar = ([p, q]: FraccionEntera) => (q === 1 ? '' : ` ≈ ${escribirNumero(p / q, 5)}`);
  const lineas = [
    `${real.regla[0]!.toUpperCase()}${real.regla.slice(1)}.`,
    `Entre los racionales de denominador a lo sumo N = ${n}, el mayor de la cortadura es ${escribirFraccion(adentro)}${aproximar(adentro)}, ` +
      `y el menor de los que quedan afuera es ${escribirFraccion(afuera)}${aproximar(afuera)}; ` +
      `la distancia entre ellos es ${escribirFraccion(distanciaEntreFracciones(adentro, afuera))}.`,
  ];
  if (real.racional) {
    const [p, q] = real.racional;
    lineas.push(
      n < q
        ? `Con N = ${n} todavía no aparece ${escribirFraccion([p, q])}; desde N = ${q}, es el menor de los de afuera.`
        : `Lo de afuera tiene mínimo, ${escribirFraccion([p, q])} mismo, para todo N ≥ ${q}. La cortadura, en cambio, no tiene máximo: al crecer N aparecen racionales de la cortadura cada vez más cerca de ${real.nombre}.`,
    );
  } else
    lineas.push(
      `Al crecer N, los dos se acercan a ${real.nombre} sin alcanzarlo: ni la cortadura tiene máximo ni lo de afuera tiene mínimo. Ese hueco es el que la cortadura llena.`,
    );
  return lineas.join('\n');
}

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';

  const lienzo = document.createElement('canvas');
  lienzo.setAttribute('role', 'img');

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaReal = document.createElement('label');
  const eleccion = document.createElement('select');
  for (const r of REALES_POR_CORTADURA) {
    const opcion = document.createElement('option');
    opcion.value = r.clave;
    opcion.textContent = r.nombre;
    eleccion.append(opcion);
  }
  eleccion.value = REALES_POR_CORTADURA.some((r) => r.clave === raiz.dataset['real'])
    ? raiz.dataset['real']!
    : REALES_POR_CORTADURA[0]!.clave;
  etiquetaReal.append('Real ', eleccion);
  const nInicial = Math.round(Number(raiz.dataset['n'] ?? 12));
  const denominador = deslizador('Denominador máximo N', 1, N_MAXIMO, 1, Number.isFinite(nInicial) ? nInicial : 12);
  const ampliacionInicial = Number(raiz.dataset['ampliacion'] ?? 1);
  const ampliacion = deslizador(
    'Ampliación',
    0,
    3,
    0.05,
    Number.isFinite(ampliacionInicial) && ampliacionInicial >= 1 ? Math.min(3, Math.log10(ampliacionInicial)) : 0,
  );
  controles.append(etiquetaReal, denominador.etiqueta, ampliacion.etiqueta);

  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  lectura.style.whiteSpace = 'pre-line';
  raiz.append(lienzo, controles, lectura);

  function colores() {
    const estilo = getComputedStyle(raiz);
    const color = (variable: string, respaldo: string) => estilo.getPropertyValue(variable).trim() || respaldo;
    return {
      tinta: color('--obra-teoria', '#141312'),
      cobre: color('--obra-practica', '#a0522d'),
      tenue: color('--sl-color-gray-3', '#888'),
      linea: color('--sl-color-gray-4', '#aaa'),
    };
  }

  function dibujar() {
    const real = REALES_POR_CORTADURA.find((r) => r.clave === eleccion.value)!;
    const n = Number(denominador.input.value);
    const exponente = Number(ampliacion.input.value);
    const factor = 10 ** exponente;
    denominador.valor.textContent = String(n);
    ampliacion.valor.textContent = `×${escribirNumero(factor, factor < 10 ? 1 : 0)}`;

    const ancho = Math.min(raiz.clientWidth || 560, 680);
    const dpr = window.devicePixelRatio || 1;
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(ALTO * dpr);
    lienzo.style.width = `${ancho}px`;
    lienzo.style.height = `${ALTO}px`;
    const g = lienzo.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, ancho, ALTO);
    const c = colores();

    const medio = 0.75 / factor;
    const desde = real.aproximado - medio;
    const hasta = real.aproximado + medio;
    const aPantalla = (x: number) => ((x - desde) / (hasta - desde)) * ancho;

    // El eje y los extremos del tramo.
    g.strokeStyle = c.linea;
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(0, EJE);
    g.lineTo(ancho, EJE);
    g.stroke();
    const cifras = 2 + Math.ceil(exponente);
    g.font = '12px system-ui, sans-serif';
    g.fillStyle = c.tenue;
    g.textAlign = 'left';
    g.fillText(escribirNumero(desde, cifras), 2, ALTO - 6);
    g.textAlign = 'right';
    g.fillText(escribirNumero(hasta, cifras), ancho - 2, ALTO - 6);

    // Las marcas de los racionales: más altas cuanto más chico el denominador.
    for (const { p, q, adentro } of racionalesEnVentana(real, n, desde, hasta)) {
      const x = aPantalla(p / q);
      const alto = 8 + 52 / Math.sqrt(q);
      g.strokeStyle = adentro ? c.tinta : c.cobre;
      g.lineWidth = q <= 5 ? 2 : 1;
      g.beginPath();
      g.moveTo(x, EJE);
      g.lineTo(x, EJE - alto);
      g.stroke();
    }

    // Dónde está el real, con una línea punteada y su nombre.
    const xReal = aPantalla(real.aproximado);
    g.strokeStyle = c.tenue;
    g.lineWidth = 1;
    g.setLineDash([3, 3]);
    g.beginPath();
    g.moveTo(xReal, 22);
    g.lineTo(xReal, EJE + 6);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = c.tinta;
    g.font = '600 14px system-ui, sans-serif';
    g.textAlign = 'center';
    g.fillText(real.nombre, xReal, 16);

    // Los dos racionales destacados, debajo del eje; si quedan fuera del tramo, en el borde con una flecha.
    const destacar = (f: FraccionEntera, color: string, lado: 'izquierda' | 'derecha') => {
      const x = aPantalla(f[0] / f[1]);
      const visible = x >= 0 && x <= ancho;
      g.fillStyle = color;
      g.font = '600 13px system-ui, sans-serif';
      if (visible) {
        g.beginPath();
        g.arc(x, EJE, 4.5, 0, 2 * Math.PI);
        g.fill();
        g.textAlign = lado === 'izquierda' ? 'right' : 'left';
        g.fillText(escribirFraccion(f), x + (lado === 'izquierda' ? -4 : 4), EJE + 22);
      } else {
        g.textAlign = lado === 'izquierda' ? 'left' : 'right';
        g.fillText(
          lado === 'izquierda' ? `◀ ${escribirFraccion(f)}` : `${escribirFraccion(f)} ▶`,
          lado === 'izquierda' ? 2 : ancho - 2,
          EJE + 22,
        );
      }
    };
    destacar(mayorEnLaCortadura(real, n), c.tinta, 'izquierda');
    destacar(menorFueraDeLaCortadura(real, n), c.cobre, 'derecha');

    // Qué color es cada lado.
    g.font = '12px system-ui, sans-serif';
    g.textAlign = 'left';
    g.fillStyle = c.tinta;
    g.fillText('en la cortadura', 2, 16);
    g.textAlign = 'right';
    g.fillStyle = c.cobre;
    g.fillText('afuera', ancho - 2, 16);
    g.textAlign = 'start';

    const texto = describir(real, n);
    lectura.textContent = texto;
    lienzo.setAttribute(
      'aria-label',
      `${alt} Ahora: el real ${real.nombre}, los racionales de denominador a lo sumo ${n} entre ${escribirNumero(desde, cifras)} y ${escribirNumero(hasta, cifras)}. ${texto.replace(/\n/g, ' ')}`,
    );
  }

  eleccion.addEventListener('change', dibujar);
  denominador.input.addEventListener('input', dibujar);
  ampliacion.input.addEventListener('input', dibujar);
  const observador = new ResizeObserver(() => dibujar());
  observador.observe(raiz);
  dibujar();

  return () => {
    observador.disconnect();
    eleccion.removeEventListener('change', dibujar);
    denominador.input.removeEventListener('input', dibujar);
    ampliacion.input.removeEventListener('input', dibujar);
  };
}

function deslizador(texto: string, min: number, max: number, paso: number, inicial: number) {
  const etiqueta = document.createElement('label');
  const input = document.createElement('input');
  const valor = document.createElement('span');
  Object.assign(input, {
    type: 'range',
    min: String(min),
    max: String(max),
    step: String(paso),
    value: String(Math.min(max, Math.max(min, inicial))),
  });
  valor.className = 'pieza-valor';
  etiqueta.append(`${texto} `, input, ' ', valor);
  return { etiqueta, input, valor };
}
