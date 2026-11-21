import { cuerdas, inversoModular, mcdNatural, tamanoDeLaImagen } from './modular.ts';

/**
 * PIEZA «multiplicacion-modular» (I.5). Un círculo con n puntos, los elementos de ℤ/nℤ, y una cuerda de cada k a a·k
 * mod n. Dos deslizadores cambian n y a. Debajo se lee si multiplicar por a es una biyección, y entonces cuál es el
 * inverso de a, o, si no, cuántos elementos tiene la imagen.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const SVG = 'http://www.w3.org/2000/svg';

  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.setAttribute('viewBox', '-110 -110 220 220');
  dibujo.classList.add('pieza-modular');
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const deslizador = (nombre: string, min: string, max: string, inicial: string) => {
    const etiqueta = document.createElement('label');
    const control = document.createElement('input');
    Object.assign(control, { type: 'range', min, max, step: '1', value: inicial });
    const valor = document.createElement('span');
    valor.className = 'pieza-valor';
    etiqueta.append(`${nombre} `, control, ' ', valor);
    controles.append(etiqueta);
    return { control, valor };
  };
  const n = deslizador('Módulo n', '2', '200', raiz.dataset['n'] ?? '60');
  const a = deslizador('Multiplicador a', '1', '40', raiz.dataset['a'] ?? '7');
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(dibujo, controles, lectura);

  function dibujar() {
    const modulo = Number(n.control.value);
    const factor = Number(a.control.value);
    n.valor.textContent = String(modulo);
    a.valor.textContent = String(factor);
    const punto = (k: number): [number, number] => {
      const angulo = (2 * Math.PI * k) / modulo - Math.PI / 2;
      return [100 * Math.cos(angulo), 100 * Math.sin(angulo)];
    };
    dibujo.replaceChildren();
    const circulo = document.createElementNS(SVG, 'circle');
    circulo.setAttribute('r', '100');
    circulo.classList.add('borde');
    dibujo.append(circulo);
    for (const [k, imagen] of cuerdas(modulo, factor)) {
      if (k === imagen) continue;
      const [x1, y1] = punto(k);
      const [x2, y2] = punto(imagen);
      const linea = document.createElementNS(SVG, 'line');
      linea.setAttribute('x1', x1.toFixed(2));
      linea.setAttribute('y1', y1.toFixed(2));
      linea.setAttribute('x2', x2.toFixed(2));
      linea.setAttribute('y2', y2.toFixed(2));
      dibujo.append(linea);
    }
    if (modulo <= 60)
      for (let k = 0; k < modulo; k++) {
        const [x, y] = punto(k);
        const marca = document.createElementNS(SVG, 'circle');
        marca.setAttribute('cx', x.toFixed(2));
        marca.setAttribute('cy', y.toFixed(2));
        marca.setAttribute('r', '1.6');
        marca.classList.add('punto');
        dibujo.append(marca);
      }
    const d = mcdNatural(factor, modulo);
    const inverso = inversoModular(factor, modulo);
    lectura.textContent =
      inverso !== null
        ? `mcd(${factor}, ${modulo}) = 1: multiplicar por ${factor} es una biyección de ℤ/${modulo}ℤ, y el inverso de ${factor} es ${inverso}, porque ${factor} · ${inverso} = ${factor * inverso} ≡ 1 (mód ${modulo}).`
        : `mcd(${factor}, ${modulo}) = ${d}: multiplicar por ${factor} no es inyectiva; la imagen tiene ${tamanoDeLaImagen(modulo, factor)} de los ${modulo} elementos, y ${factor} no tiene inverso módulo ${modulo}.`;
    dibujo.setAttribute('aria-label', `${alt} Ahora: n = ${modulo}, a = ${factor}.`);
  }

  n.control.addEventListener('input', dibujar);
  a.control.addEventListener('input', dibujar);
  dibujar();
  return () => {
    n.control.removeEventListener('input', dibujar);
    a.control.removeEventListener('input', dibujar);
  };
}
