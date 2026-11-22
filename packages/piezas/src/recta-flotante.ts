import { redondearEnSistema, sistemaDeJuguete } from './flotante.ts';

/**
 * PIEZA «recta-flotante» (I.10). Los números positivos de un sistema de coma flotante de juguete, con precisión p y
 * exponentes de −1 a 2, como marcas sobre la recta: entre cada potencia de 2 y la siguiente hay 2^(p−1) igualmente
 * espaciados, y el espaciado se duplica al cruzar una potencia. Un interruptor agrega los subnormales, que llenan el
 * hueco junto al 0, y un deslizador elige un real x para ver a qué número del sistema se redondea.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const SVG = 'http://www.w3.org/2000/svg';
  const EMIN = -1;
  const EMAX = 2;

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaP = document.createElement('label');
  const p = document.createElement('input');
  Object.assign(p, { type: 'range', min: '2', max: '4', step: '1', value: raiz.dataset['p'] ?? '3' });
  const valorP = document.createElement('span');
  valorP.className = 'pieza-valor';
  etiquetaP.append('Precisión p ', p, ' ', valorP);
  const etiquetaSub = document.createElement('label');
  const sub = document.createElement('input');
  sub.type = 'checkbox';
  sub.checked = raiz.dataset['subnormales'] !== 'no';
  etiquetaSub.append(sub, ' subnormales');
  const etiquetaX = document.createElement('label');
  const x = document.createElement('input');
  Object.assign(x, { type: 'range', min: '0', max: '8', step: '0.01', value: raiz.dataset['x'] ?? '1.1' });
  const valorX = document.createElement('span');
  valorX.className = 'pieza-valor';
  etiquetaX.append('Real x ', x, ' ', valorX);
  controles.append(etiquetaP, etiquetaSub, etiquetaX);

  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.setAttribute('viewBox', '-10 -30 620 70');
  dibujo.classList.add('pieza-recta');
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(dibujo, controles, lectura);

  const ESCALA = 600 / 8;
  const linea = (x1: number, y1: number, x2: number, y2: number, clase: string) => {
    const l = document.createElementNS(SVG, 'line');
    l.setAttribute('x1', x1.toFixed(2));
    l.setAttribute('y1', String(y1));
    l.setAttribute('x2', x2.toFixed(2));
    l.setAttribute('y2', String(y2));
    l.classList.add(clase);
    return l;
  };
  const texto = (contenido: string, cx: number, cy: number, clase = 'rotulo') => {
    const t = document.createElementNS(SVG, 'text');
    t.setAttribute('x', cx.toFixed(2));
    t.setAttribute('y', String(cy));
    t.classList.add(clase);
    t.textContent = contenido;
    return t;
  };

  /** Los números del texto, con coma decimal, como en la obra; los del dibujo siguen con punto. */
  const coma = (x: number | string) => String(x).replace('.', ',');

  function dibujar() {
    const precision = Number(p.value);
    const conSub = sub.checked;
    const real = Number(x.value);
    valorP.textContent = String(precision);
    valorX.textContent = coma(real.toFixed(2));
    const normales = sistemaDeJuguete(precision, EMIN, EMAX, false);
    const todos = sistemaDeJuguete(precision, EMIN, EMAX, conSub);
    dibujo.replaceChildren(linea(0, 0, 600, 0, 'eje'));
    for (let e = EMIN; e <= EMAX + 1; e++) {
      dibujo.append(linea(2 ** e * ESCALA, -4, 2 ** e * ESCALA, 4, 'potencia'));
      dibujo.append(texto(String(2 ** e), 2 ** e * ESCALA, 22));
    }
    dibujo.append(texto('0', 0, 22));
    for (const y of todos) dibujo.append(linea(y * ESCALA, -12, y * ESCALA, 0, normales.includes(y) ? 'normal' : 'subnormal'));
    const redondeado = redondearEnSistema(real, precision, EMIN, EMAX, conSub);
    dibujo.append(linea(real * ESCALA, -26, real * ESCALA, 0, 'real'));
    if (Number.isFinite(redondeado)) dibujo.append(linea(redondeado * ESCALA, -26, redondeado * ESCALA, -12, 'redondeado'));
    const maximo = normales[normales.length - 1]!;
    lectura.textContent = Number.isFinite(redondeado)
      ? `Con p = ${precision}, hay ${2 ** (precision - 1)} números entre cada potencia de 2 y la siguiente; el mayor es ${coma(maximo)}. ` +
        `x = ${coma(real.toFixed(2))} se redondea a ${coma(redondeado)}, con error relativo ${real === 0 ? 0 : coma((Math.abs(redondeado - real) / real).toFixed(3))}, ` +
        `y la cota es u = 2^−${precision} = ${coma((2 ** -precision).toFixed(3))} ${real !== 0 && real < 2 ** EMIN ? '(no vale en el rango de los subnormales)' : ''}.`
      : `x = ${coma(real.toFixed(2))} pasa del mayor número, ${coma(maximo)}, más media unidad del último lugar: se redondea a infinito.`;
    dibujo.setAttribute('aria-label', `${alt} ${lectura.textContent}`);
  }

  controles.addEventListener('input', dibujar);
  dibujar();
  return () => controles.removeEventListener('input', dibujar);
}
