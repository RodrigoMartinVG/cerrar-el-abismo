import { aplicar, inversaTranspuesta, normalizar, perpendicular, producto, type Mat2, type Vec2 } from './algebra.ts';

/**
 * PIEZA «normal-covector» (II.5). Una recta del plano con su normal; una escala no uniforme M = diag(s, 1) la
 * transforma. Se dibujan la normal transformada con M, que deja de ser perpendicular, y con (M⁻¹)ᵀ, que lo sigue
 * siendo, y se muestran los dos productos escalares. Se maneja con dos deslizadores, también desde el teclado.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';

  const lienzo = document.createElement('canvas');
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', alt);
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const escala = deslizador('Escala horizontal s', 0.25, 3, 0.05, 2.5);
  const angulo = deslizador('Ángulo de la recta (grados)', 0, 180, 1, 35);
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  controles.append(escala.etiqueta, angulo.etiqueta);
  raiz.append(lienzo, controles, lectura);

  function dibujar() {
    const s = Number(escala.input.value);
    const theta = (Number(angulo.input.value) * Math.PI) / 180;
    escala.valor.textContent = s.toFixed(2);
    angulo.valor.textContent = `${Math.round((theta * 180) / Math.PI)}°`;

    const M: Mat2 = [s, 0, 0, 1];
    const t: Vec2 = [Math.cos(theta), Math.sin(theta)];
    const n = perpendicular(t);
    const t2 = aplicar(M, t);
    const malo = aplicar(M, n);
    const bueno = aplicar(inversaTranspuesta(M), n);

    const ancho = Math.min(raiz.clientWidth || 560, 640);
    const alto = Math.round(ancho * 0.6);
    const dpr = window.devicePixelRatio || 1;
    lienzo.width = ancho * dpr;
    lienzo.height = alto * dpr;
    lienzo.style.width = `${ancho}px`;
    lienzo.style.height = `${alto}px`;
    const g = lienzo.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const estilo = getComputedStyle(raiz);
    const color = (variable: string, respaldo: string) => estilo.getPropertyValue(variable).trim() || respaldo;
    const tinta = color('--sl-color-white', '#111');
    const tenue = color('--sl-color-gray-4', '#999');
    const correcta = color('--sl-color-green', '#1a7f37');
    const incorrecta = color('--sl-color-orange', '#bc4c00');

    g.clearRect(0, 0, ancho, alto);
    const escalaPx = alto / 4;
    const origen: Vec2 = [ancho / 2, alto / 2];
    const aPantalla = ([x, y]: Vec2): Vec2 => [origen[0] + x * escalaPx, origen[1] - y * escalaPx];

    // Ejes.
    g.strokeStyle = tenue;
    g.lineWidth = 1;
    linea(g, [0, origen[1]], [ancho, origen[1]]);
    linea(g, [origen[0], 0], [origen[0], alto]);

    // La recta transformada.
    const d = normalizar(t2);
    g.strokeStyle = tinta;
    g.lineWidth = 2;
    linea(g, aPantalla([-3 * d[0], -3 * d[1]]), aPantalla([3 * d[0], 3 * d[1]]));

    // Las dos normales: la incorrecta, discontinua; la correcta, continua.
    g.setLineDash([6, 5]);
    flecha(g, aPantalla([0, 0]), aPantalla(escalar(normalizar(malo), 1.4)), incorrecta);
    g.setLineDash([]);
    flecha(g, aPantalla([0, 0]), aPantalla(escalar(normalizar(bueno), 1.4)), correcta);

    g.font = '14px system-ui, sans-serif';
    g.fillStyle = incorrecta;
    g.fillText('M·n', ...desplazar(aPantalla(escalar(normalizar(malo), 1.55))));
    g.fillStyle = correcta;
    g.fillText('(M⁻¹)ᵀ·n', ...desplazar(aPantalla(escalar(normalizar(bueno), 1.55))));

    const pm = producto(t2, malo);
    const pb = producto(t2, bueno);
    lectura.textContent = `M·t · M·n = ${pm.toFixed(3)} (no es normal salvo con s = 1) · M·t · (M⁻¹)ᵀ·n = ${Math.abs(pb) < 5e-13 ? '0' : pb.toFixed(3)} (siempre normal)`;
  }

  const alCambiar = () => dibujar();
  escala.input.addEventListener('input', alCambiar);
  angulo.input.addEventListener('input', alCambiar);
  const observador = new ResizeObserver(() => dibujar());
  observador.observe(raiz);
  dibujar();

  return () => {
    observador.disconnect();
    escala.input.removeEventListener('input', alCambiar);
    angulo.input.removeEventListener('input', alCambiar);
  };
}

function deslizador(texto: string, min: number, max: number, paso: number, inicial: number) {
  const etiqueta = document.createElement('label');
  const input = document.createElement('input');
  const valor = document.createElement('span');
  Object.assign(input, { type: 'range', min: String(min), max: String(max), step: String(paso), value: String(inicial) });
  valor.className = 'pieza-valor';
  etiqueta.append(`${texto} `, input, ' ', valor);
  return { etiqueta, input, valor };
}

function escalar([x, y]: Vec2, k: number): Vec2 {
  return [x * k, y * k];
}

function desplazar([x, y]: Vec2): [number, number] {
  return [x + 4, y - 4];
}

function linea(g: CanvasRenderingContext2D, [x1, y1]: Vec2, [x2, y2]: Vec2) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
}

function flecha(g: CanvasRenderingContext2D, desde: Vec2, hasta: Vec2, color: string) {
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = 2.5;
  linea(g, desde, hasta);
  const ang = Math.atan2(hasta[1] - desde[1], hasta[0] - desde[0]);
  const punta = 10;
  g.setLineDash([]);
  g.beginPath();
  g.moveTo(hasta[0], hasta[1]);
  g.lineTo(hasta[0] - punta * Math.cos(ang - 0.4), hasta[1] - punta * Math.sin(ang - 0.4));
  g.lineTo(hasta[0] - punta * Math.cos(ang + 0.4), hasta[1] - punta * Math.sin(ang + 0.4));
  g.closePath();
  g.fill();
}
