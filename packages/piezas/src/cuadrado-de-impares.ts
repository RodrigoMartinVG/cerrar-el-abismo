import { capa, igualdad } from './impares.ts';

/**
 * PIEZA «cuadrado-de-impares» (I.1). Un cuadrado de n × n armado con n capas en forma de L, de colores alternados:
 * la capa k tiene 2k + 1 cuadraditos. Un deslizador cambia n, y debajo se lee la igualdad 1 + 3 + ⋯ + (2n − 1) = n².
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const SVG = 'http://www.w3.org/2000/svg';

  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.classList.add('pieza-impares');
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiqueta = document.createElement('label');
  const deslizador = document.createElement('input');
  Object.assign(deslizador, { type: 'range', min: '1', max: '12', step: '1', value: raiz.dataset['n'] ?? '5' });
  const valor = document.createElement('span');
  valor.className = 'pieza-valor';
  etiqueta.append('Cantidad de impares n ', deslizador, ' ', valor);
  controles.append(etiqueta);
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(dibujo, controles, lectura);

  function dibujar() {
    const n = Number(deslizador.value);
    valor.textContent = String(n);
    const lado = 24;
    const margen = 2;
    const total = n * lado + 2 * margen;
    dibujo.setAttribute('viewBox', `0 0 ${total} ${total}`);
    dibujo.style.width = `${Math.min(total * 1.6, 320)}px`;
    dibujo.replaceChildren();
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const cuadradito = document.createElementNS(SVG, 'rect');
        // La capa 0 queda abajo a la izquierda y cada capa nueva la rodea por arriba y por la derecha.
        cuadradito.setAttribute('x', String(margen + j * lado));
        cuadradito.setAttribute('y', String(margen + (n - 1 - i) * lado));
        cuadradito.setAttribute('width', String(lado - 2));
        cuadradito.setAttribute('height', String(lado - 2));
        cuadradito.setAttribute('rx', '3');
        cuadradito.classList.add(capa(i, j) % 2 === 0 ? 'capa-par' : 'capa-impar');
        dibujo.append(cuadradito);
      }
    const texto = igualdad(n);
    lectura.textContent = texto;
    dibujo.setAttribute('aria-label', `${alt} Ahora: ${texto}.`);
  }

  deslizador.addEventListener('input', dibujar);
  dibujar();
  return () => deslizador.removeEventListener('input', dibujar);
}
