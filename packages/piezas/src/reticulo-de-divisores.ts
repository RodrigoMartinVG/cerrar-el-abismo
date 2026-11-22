import { aristasDeHasse, complemento, divisores, esBooleano, mcmNatural, posicionesDeHasse } from './divisores.ts';
import { mcdNatural } from './modular.ts';

/**
 * PIEZA «reticulo-de-divisores» (I.12). El diagrama de Hasse de los divisores de n, ordenados por la divisibilidad.
 * Un deslizador cambia n; dos listas, o un clic en el diagrama, eligen dos divisores a y b, y la pieza marca su ínfimo,
 * el mcd, y su supremo, el mcm. Debajo se lee si el retículo es un álgebra de Boole y si a tiene complemento.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const SVG = 'http://www.w3.org/2000/svg';

  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.classList.add('pieza-divisores');
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';

  const etiquetaN = document.createElement('label');
  const deslizador = document.createElement('input');
  Object.assign(deslizador, { type: 'range', min: '2', max: '360', step: '1', value: raiz.dataset['n'] ?? '60' });
  const valorN = document.createElement('span');
  valorN.className = 'pieza-valor';
  etiquetaN.append('n ', deslizador, ' ', valorN);

  const lista = (nombre: string) => {
    const etiqueta = document.createElement('label');
    const eleccion = document.createElement('select');
    etiqueta.append(`${nombre} `, eleccion);
    return { etiqueta, eleccion };
  };
  const a = lista('a');
  const b = lista('b');
  controles.append(etiquetaN, a.etiqueta, b.etiqueta);
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(dibujo, controles, lectura);

  let elegidoA = Number(raiz.dataset['a'] ?? '4');
  let elegidoB = Number(raiz.dataset['b'] ?? '6');
  let siguiente: 'a' | 'b' = 'a';

  function llenarListas(ds: number[]) {
    for (const [{ eleccion }, valor] of [
      [a, elegidoA],
      [b, elegidoB],
    ] as const) {
      eleccion.replaceChildren(
        ...ds.map((d) => {
          const opcion = document.createElement('option');
          opcion.value = String(d);
          opcion.textContent = String(d);
          return opcion;
        }),
      );
      eleccion.value = String(valor);
    }
  }

  function dibujar() {
    const n = Number(deslizador.value);
    valorN.textContent = String(n);
    const ds = divisores(n);
    if (!ds.includes(elegidoA)) elegidoA = ds[1] ?? 1;
    if (!ds.includes(elegidoB)) elegidoB = ds[ds.length - 2] ?? n;
    llenarListas(ds);
    const inf = mcdNatural(elegidoA, elegidoB);
    const sup = mcmNatural(elegidoA, elegidoB);

    const posiciones = posicionesDeHasse(n);
    const PASO_X = 46;
    const PASO_Y = 52;
    const xs = [...posiciones.values()].map(([x]) => x);
    const altura = Math.max(...[...posiciones.values()].map(([, y]) => y));
    const ancho = Math.max(...xs) - Math.min(...xs);
    const margen = 20;
    dibujo.setAttribute(
      'viewBox',
      `${-ancho * (PASO_X / 2) - margen} ${-altura * PASO_Y - margen} ${ancho * PASO_X + 2 * margen} ${altura * PASO_Y + 2 * margen}`,
    );
    const punto = (d: number): [number, number] => {
      const [x, y] = posiciones.get(d)!;
      return [x * PASO_X, -y * PASO_Y];
    };

    dibujo.replaceChildren();
    for (const [d, e] of aristasDeHasse(n)) {
      const [x1, y1] = punto(d);
      const [x2, y2] = punto(e);
      const linea = document.createElementNS(SVG, 'line');
      linea.setAttribute('x1', x1.toFixed(1));
      linea.setAttribute('y1', y1.toFixed(1));
      linea.setAttribute('x2', x2.toFixed(1));
      linea.setAttribute('y2', y2.toFixed(1));
      dibujo.append(linea);
    }
    for (const d of ds) {
      const [x, y] = punto(d);
      const nodo = document.createElementNS(SVG, 'g');
      nodo.classList.add('nodo');
      if (d === elegidoA || d === elegidoB) nodo.classList.add('elegido');
      if (d === inf || d === sup) nodo.classList.add('extremo');
      nodo.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      nodo.dataset['divisor'] = String(d);
      const circulo = document.createElementNS(SVG, 'circle');
      circulo.setAttribute('r', '15');
      const texto = document.createElementNS(SVG, 'text');
      texto.setAttribute('text-anchor', 'middle');
      texto.setAttribute('dy', '0.35em');
      texto.textContent = String(d);
      nodo.append(circulo, texto);
      dibujo.append(nodo);
    }

    const c = complemento(elegidoA, n);
    const tipo = esBooleano(n) ? 'forman un álgebra de Boole' : 'forman un retículo distributivo que no es un álgebra de Boole';
    lectura.textContent =
      `El ínfimo de ${elegidoA} y ${elegidoB} es mcd(${elegidoA}, ${elegidoB}) = ${inf}, y el supremo es mcm(${elegidoA}, ${elegidoB}) = ${sup}. ` +
      `Los ${ds.length} divisores de ${n} ${tipo}; ` +
      (c !== null ? `el complemento de ${elegidoA} es ${c}.` : `${elegidoA} no tiene complemento.`);
    dibujo.setAttribute('aria-label', `${alt} Ahora: n = ${n}, a = ${elegidoA}, b = ${elegidoB}.`);
  }

  const alMover = () => dibujar();
  const alElegirA = () => {
    elegidoA = Number(a.eleccion.value);
    dibujar();
  };
  const alElegirB = () => {
    elegidoB = Number(b.eleccion.value);
    dibujar();
  };
  const alTocar = (evento: Event) => {
    const nodo = (evento.target as Element).closest<SVGGElement>('.nodo');
    if (!nodo) return;
    const d = Number(nodo.dataset['divisor']);
    if (siguiente === 'a') elegidoA = d;
    else elegidoB = d;
    siguiente = siguiente === 'a' ? 'b' : 'a';
    dibujar();
  };
  deslizador.addEventListener('input', alMover);
  a.eleccion.addEventListener('change', alElegirA);
  b.eleccion.addEventListener('change', alElegirB);
  dibujo.addEventListener('click', alTocar);
  dibujar();
  return () => {
    deslizador.removeEventListener('input', alMover);
    a.eleccion.removeEventListener('change', alElegirA);
    b.eleccion.removeEventListener('change', alElegirB);
    dibujo.removeEventListener('click', alTocar);
  };
}
