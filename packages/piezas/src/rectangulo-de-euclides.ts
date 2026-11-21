import { cuadradosDeEuclides, escribirPaso, mcd, pasosDeEuclides } from './euclides.ts';

/**
 * PIEZA «rectangulo-de-euclides» (I.3). Un rectángulo de a × b cubierto por los cuadrados del algoritmo de Euclides:
 * en cada paso, tantos cuadrados del lado menor como entran, con un color por paso. Dos deslizadores cambian a y b, y
 * debajo se leen las divisiones con resto y el máximo común divisor, que es el lado del cuadrado más chico.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const SVG = 'http://www.w3.org/2000/svg';

  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.classList.add('pieza-euclides');
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const deslizador = (nombre: string, inicial: string) => {
    const etiqueta = document.createElement('label');
    const control = document.createElement('input');
    Object.assign(control, { type: 'range', min: '1', max: '90', step: '1', value: inicial });
    const valor = document.createElement('span');
    valor.className = 'pieza-valor';
    etiqueta.append(`${nombre} `, control, ' ', valor);
    controles.append(etiqueta);
    return { control, valor };
  };
  const a = deslizador('Ancho a', raiz.dataset['a'] ?? '84');
  const b = deslizador('Alto b', raiz.dataset['b'] ?? '60');
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura pieza-euclides-pasos';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(dibujo, controles, lectura);

  function dibujar() {
    const ancho = Number(a.control.value);
    const alto = Number(b.control.value);
    a.valor.textContent = String(ancho);
    b.valor.textContent = String(alto);
    const escala = 320 / Math.max(ancho, alto);
    const margen = 2;
    dibujo.setAttribute('viewBox', `0 0 ${ancho * escala + 2 * margen} ${alto * escala + 2 * margen}`);
    dibujo.style.width = `${ancho * escala + 2 * margen}px`;
    dibujo.replaceChildren();
    for (const c of cuadradosDeEuclides(ancho, alto)) {
      const g = document.createElementNS(SVG, 'g');
      const cuadrado = document.createElementNS(SVG, 'rect');
      cuadrado.setAttribute('x', String(margen + c.x * escala));
      cuadrado.setAttribute('y', String(margen + c.y * escala));
      cuadrado.setAttribute('width', String(c.lado * escala));
      cuadrado.setAttribute('height', String(c.lado * escala));
      cuadrado.classList.add(c.paso % 2 === 0 ? 'paso-par' : 'paso-impar');
      g.append(cuadrado);
      if (c.lado * escala >= 22) {
        const texto = document.createElementNS(SVG, 'text');
        texto.setAttribute('x', String(margen + (c.x + c.lado / 2) * escala));
        texto.setAttribute('y', String(margen + (c.y + c.lado / 2) * escala));
        texto.setAttribute('text-anchor', 'middle');
        texto.setAttribute('dominant-baseline', 'central');
        texto.textContent = String(c.lado);
        g.append(texto);
      }
      dibujo.append(g);
    }
    const pasos = pasosDeEuclides(ancho, alto);
    const d = mcd(ancho, alto);
    lectura.textContent = `${pasos.map(escribirPaso).join('   ')}   →   mcd(${ancho}, ${alto}) = ${d}`;
    dibujo.setAttribute('aria-label', `${alt} Ahora: un rectángulo de ${ancho} por ${alto}; el cuadrado más chico mide ${d}.`);
  }

  a.control.addEventListener('input', dibujar);
  b.control.addEventListener('input', dibujar);
  dibujar();
  return () => {
    a.control.removeEventListener('input', dibujar);
    b.control.removeEventListener('input', dibujar);
  };
}
