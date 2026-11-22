import {
  ajustarACuadricula,
  ajustarPolar,
  anguloComoFraccionDePi,
  escribirAngulo,
  escribirComplejo,
  escribirNumero,
  explicarProducto,
  moduloComplejo,
  potenciasPorW,
  type Complejo,
} from './complejos.ts';

/**
 * PIEZA «multiplicacion-compleja» (I.9). El plano complejo con dos puntos que se arrastran, z y w, y su producto zw,
 * con los arcos de los tres argumentos: el módulo del producto es el producto de los módulos y su argumento es la suma
 * de los argumentos. Con n = 1 se ven además los triángulos de vértices 0, 1, w y 0, z, zw, que son semejantes:
 * multiplicar por z lleva el primero en el segundo. Con n > 1 se dibujan z, zw, zw², …, zwⁿ, lo que hace un programa que
 * multiplica n veces por w: un polígono regular si w es una raíz de la unidad y una espiral si |w| ≠ 1.
 *
 * Atributos opcionales: `data-z` y `data-w` («2,1» es 2 + i), `data-n` (de 1 a 24) y `data-ajuste` (`cuadricula`,
 * `polar` o `libre`). Con el teclado, el lienzo enfocado elige el punto con las teclas z y w y lo mueve con las flechas;
 * en el ajuste polar, las flechas de los costados giran y las de arriba y abajo cambian el módulo.
 */

/** Medio lado del cuadrado que se dibuja, en unidades del plano. */
const RADIO_DEL_MUNDO = 3.6;
/** Los puntos que se arrastran no salen del círculo de este radio, para que el producto casi siempre se vea. */
const MODULO_MAXIMO = 2.25;
const N_MAXIMO = 24;
const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (k: number) => [...String(k)].map((c) => SUPERINDICES[Number(c)]).join('');
/** «Una raíz cúbica de la unidad», «una raíz sexta»… */
const ORDINALES: Record<number, string> = {
  2: 'cuadrada',
  3: 'cúbica',
  4: 'cuarta',
  5: 'quinta',
  6: 'sexta',
  7: 'séptima',
  8: 'octava',
  9: 'novena',
  10: 'décima',
  11: 'undécima',
  12: 'duodécima',
};

type Ajuste = 'cuadricula' | 'polar' | 'libre';
type Nombre = 'z' | 'w';
type Punto = readonly [number, number];

function leerComplejo(texto: string | undefined): Complejo | undefined {
  if (!texto) return undefined;
  const partes = texto.split(',').map((s) => Number(s.trim()));
  if (partes.length !== 2 || partes.some((x) => !Number.isFinite(x))) return undefined;
  const [a, b] = partes as [number, number];
  return moduloComplejo([a, b]) <= MODULO_MAXIMO + 1e-9 ? [a, b] : undefined;
}

function ajustar(z: Complejo, ajuste: Ajuste): Complejo {
  if (ajuste === 'cuadricula') return ajustarACuadricula(z, 0.25);
  if (ajuste === 'polar') return ajustarPolar(z, 0.25, 12);
  return z;
}

/** «z·w⁵», o «zw» si n = 1. */
const nombreDelProducto = (n: number) => (n === 1 ? 'zw' : `zw${sup(n)}`);

/** La lectura de la pieza: los dos números en forma polar y lo que el teorema dice del producto. */
function describir(z: Complejo, w: Complejo, n: number): string {
  const e = explicarProducto(z, w, n);
  const nombre = nombreDelProducto(n);
  const lineas = [
    `z = ${escribirComplejo(z)}: módulo ${escribirNumero(e.moduloZ)}, argumento θ = ${escribirAngulo(e.argumentoZ)}.`,
    `w = ${escribirComplejo(w)}: módulo ${escribirNumero(e.moduloW)}, argumento φ = ${escribirAngulo(e.argumentoW)}.`,
  ];
  if (e.moduloZ < 1e-12 || e.moduloW < 1e-12) {
    lineas.push(`${nombre} = 0: un producto con un factor nulo es nulo, y el 0 no tiene argumento.`);
    return lineas.join('\n');
  }
  const potencia = n === 1 ? '|w|' : `|w|${sup(n)}`;
  const sumaEnPalabras = n === 1 ? 'θ + φ' : `θ + ${n}φ`;
  const suma = anguloComoFraccionDePi(e.suma) ?? escribirNumero(e.suma);
  const vueltas =
    e.vueltas === 0
      ? `, que es ${sumaEnPalabras} = ${suma}`
      : `; la suma ${sumaEnPalabras} = ${suma} da el mismo punto, ${Math.abs(e.vueltas) === 1 ? 'una vuelta' : `${Math.abs(e.vueltas)} vueltas`} ${e.vueltas > 0 ? 'más' : 'menos'}`;
  lineas.push(
    `${nombre} = ${escribirComplejo(e.producto)}: módulo ${escribirNumero(e.moduloProducto)} = |z| · ${potencia}, ` +
      `argumento ${escribirAngulo(e.argumentoProducto)}${vueltas}.`,
  );
  if (Math.abs(e.moduloW - 1) < 1e-9) {
    const vuelve = Math.abs(e.producto[0] - z[0]) < 1e-9 && Math.abs(e.producto[1] - z[1]) < 1e-9;
    lineas.push(
      !vuelve
        ? 'w tiene módulo 1: multiplicar por w es girar, sin estirar.'
        : n === 1
          ? 'w = 1: multiplicar por 1 no mueve nada.'
          : `w tiene módulo 1 y w${sup(n)} = 1: w es una raíz ${ORDINALES[n] ?? `de índice ${n}`} de la unidad, y ${nombre} vuelve a z.`,
    );
  } else if (Math.abs(e.argumentoW) < 1e-12) lineas.push('w es un real positivo: multiplicar por w es estirar, sin girar.');
  return lineas.join('\n');
}

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  const ajusteInicial = (['cuadricula', 'polar', 'libre'] as const).find((a) => a === raiz.dataset['ajuste']) ?? 'cuadricula';
  const puntos: Record<Nombre, Complejo> = {
    z: leerComplejo(raiz.dataset['z']) ?? [2, 1],
    w: leerComplejo(raiz.dataset['w']) ?? [1, 1],
  };
  let elegido: Nombre = 'w';
  let arrastrado: Nombre | undefined;
  raiz.textContent = '';

  const lienzo = document.createElement('canvas');
  lienzo.tabIndex = 0;
  lienzo.setAttribute('role', 'img');
  lienzo.style.touchAction = 'none';

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaAjuste = document.createElement('label');
  const ajuste = document.createElement('select');
  for (const [valor, texto] of [
    ['cuadricula', 'a la cuadrícula de 1/4'],
    ['polar', 'a módulos de 1/4 y ángulos de π/12'],
    ['libre', 'libre'],
  ] as const) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    ajuste.append(opcion);
  }
  ajuste.value = ajusteInicial;
  etiquetaAjuste.append('Ajuste ', ajuste);
  const etiquetaN = document.createElement('label');
  const veces = document.createElement('input');
  const nInicial = Math.round(Number(raiz.dataset['n'] ?? 1));
  Object.assign(veces, {
    type: 'range',
    min: '1',
    max: String(N_MAXIMO),
    step: '1',
    value: String(Number.isFinite(nInicial) ? Math.min(N_MAXIMO, Math.max(1, nInicial)) : 1),
  });
  const valorN = document.createElement('span');
  valorN.className = 'pieza-valor';
  etiquetaN.append('Veces que se multiplica por w: n = ', veces, ' ', valorN);
  controles.append(etiquetaAjuste, etiquetaN);

  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  lectura.style.whiteSpace = 'pre-line';
  raiz.append(lienzo, controles, lectura);

  // Las coordenadas del último dibujo, para convertir los clics.
  let escala = 1;
  const aPantalla = ([x, y]: Punto): Punto => [(x + RADIO_DEL_MUNDO) * escala, (RADIO_DEL_MUNDO - y) * escala];
  const aPlano = ([px, py]: Punto): Complejo => [px / escala - RADIO_DEL_MUNDO, RADIO_DEL_MUNDO - py / escala];

  function colores() {
    const estilo = getComputedStyle(raiz);
    const color = (variable: string, respaldo: string) => estilo.getPropertyValue(variable).trim() || respaldo;
    return {
      tinta: color('--obra-teoria', '#141312'),
      cobre: color('--obra-practica', '#a0522d'),
      cobreBajo: color('--obra-practica-bajo', '#f6e6da'),
      fondo: color('--sl-color-bg', '#fff'),
      tenue: color('--sl-color-gray-3', '#888'),
      linea: color('--sl-color-gray-4', '#aaa'),
      cuadricula: color('--sl-color-gray-6', '#eee'),
    };
  }

  function dibujar() {
    const { z, w } = puntos;
    const n = Number(veces.value);
    valorN.textContent = String(n);
    const ancho = Math.min(raiz.clientWidth || 480, 520);
    escala = ancho / (2 * RADIO_DEL_MUNDO);
    const dpr = window.devicePixelRatio || 1;
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(ancho * dpr);
    lienzo.style.width = `${ancho}px`;
    lienzo.style.height = `${ancho}px`;
    const g = lienzo.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, ancho, ancho);
    const c = colores();
    const origen = aPantalla([0, 0]);
    g.font = '13px system-ui, sans-serif';

    // La cuadrícula de las unidades, los ejes y sus números.
    g.lineWidth = 1;
    for (let k = -3; k <= 3; k++) {
      g.strokeStyle = k === 0 ? c.linea : c.cuadricula;
      g.lineWidth = k === 0 ? 1.5 : 1;
      trazo(g, [aPantalla([k, -RADIO_DEL_MUNDO]), aPantalla([k, RADIO_DEL_MUNDO])]);
      trazo(g, [aPantalla([-RADIO_DEL_MUNDO, k]), aPantalla([RADIO_DEL_MUNDO, k])]);
    }
    g.fillStyle = c.tenue;
    for (let k = -3; k <= 3; k++) {
      if (k === 0) continue;
      const [x] = aPantalla([k, 0]);
      g.fillText(k < 0 ? `−${-k}` : String(k), x + 3, origen[1] + 14);
      const [, y] = aPantalla([0, k]);
      g.fillText(k === 1 ? 'i' : k === -1 ? '−i' : `${k < 0 ? '−' : ''}${Math.abs(k)}i`, origen[0] + 4, y - 3);
    }

    // El círculo de radio 1.
    g.strokeStyle = c.tenue;
    g.lineWidth = 1.25;
    g.setLineDash([4, 4]);
    g.beginPath();
    g.arc(origen[0], origen[1], escala, 0, 2 * Math.PI);
    g.stroke();
    g.setLineDash([]);

    const potencias = potenciasPorW(z, w, n);
    const producto = potencias[n]!;
    const e = explicarProducto(z, w, n);

    // Con n = 1, los triángulos semejantes 0, 1, w y 0, z, zw.
    if (n === 1) {
      g.fillStyle = c.cobreBajo;
      g.strokeStyle = c.linea;
      g.lineWidth = 1;
      for (const triangulo of [
        [[0, 0], [1, 0], w],
        [[0, 0], z, producto],
      ] as Punto[][]) {
        g.beginPath();
        triangulo.map(aPantalla).forEach(([x, y], k) => (k === 0 ? g.moveTo(x, y) : g.lineTo(x, y)));
        g.closePath();
        g.globalAlpha = 0.55;
        g.fill();
        g.globalAlpha = 1;
        g.stroke();
      }
    }

    // Los arcos de los argumentos, cada uno a su radio.
    const arco = (theta: number, radio: number, color: string, grosor: number) => {
      if (Math.abs(theta) < 1e-9) return;
      g.strokeStyle = color;
      g.lineWidth = grosor;
      g.beginPath();
      g.arc(origen[0], origen[1], radio, 0, -theta, theta > 0);
      g.stroke();
    };
    if (e.moduloZ > 1e-12) arco(e.argumentoZ, 20, c.tinta, 1.5);
    if (e.moduloW > 1e-12) arco(e.argumentoW, 28, c.cobre, 1.5);
    if (moduloComplejo(producto) > 1e-12) arco(e.argumentoProducto, 36, c.tinta, 3);

    // El camino z, zw, zw², …, zwⁿ.
    if (n > 1) {
      g.strokeStyle = c.tenue;
      g.lineWidth = 1.25;
      trazo(g, potencias.map(aPantalla));
      g.fillStyle = c.cobre;
      for (const p of potencias.slice(1, -1)) circulo(g, aPantalla(p), 3, true);
    }

    // Los segmentos desde el origen.
    const segmento = (p: Complejo, color: string, grosor: number) => {
      g.strokeStyle = color;
      g.lineWidth = grosor;
      trazo(g, [origen, aPantalla(p)]);
    };
    segmento(z, c.tinta, 2);
    segmento(w, c.cobre, 2);
    segmento(producto, c.tinta, 3);

    // Los puntos y sus nombres. Si el producto queda fuera del dibujo, una flecha en el borde señala hacia dónde.
    const rotulo = (p: Punto, texto: string) => {
      const aLaIzquierda = p[0] > ancho - 48;
      g.fillStyle = c.tinta;
      g.font = '600 14px system-ui, sans-serif';
      g.textAlign = aLaIzquierda ? 'right' : 'left';
      g.fillText(texto, p[0] + (aLaIzquierda ? -11 : 11), p[1] < 20 ? p[1] + 20 : p[1] - 9);
      g.textAlign = 'start';
      g.font = '13px system-ui, sans-serif';
    };
    const pantallaProducto = aPantalla(producto);
    const margen = 10;
    const fuera = pantallaProducto.some((x) => x < margen || x > ancho - margen);
    if (fuera) {
      const t = Math.min(
        ...[0, 1].map((k) => {
          const d = pantallaProducto[k]! - origen[k]!;
          if (Math.abs(d) < 1e-9) return Infinity;
          return ((d > 0 ? ancho - margen : margen) - origen[k]!) / d;
        }),
      );
      const borde: Punto = [origen[0] + t * (pantallaProducto[0] - origen[0]), origen[1] + t * (pantallaProducto[1] - origen[1])];
      const angulo = Math.atan2(pantallaProducto[1] - origen[1], pantallaProducto[0] - origen[0]);
      g.fillStyle = c.tinta;
      g.beginPath();
      g.moveTo(borde[0] + 9 * Math.cos(angulo), borde[1] + 9 * Math.sin(angulo));
      g.lineTo(borde[0] + 7 * Math.cos(angulo + 2.5), borde[1] + 7 * Math.sin(angulo + 2.5));
      g.lineTo(borde[0] + 7 * Math.cos(angulo - 2.5), borde[1] + 7 * Math.sin(angulo - 2.5));
      g.closePath();
      g.fill();
      rotulo(borde, `${nombreDelProducto(n)} (afuera)`);
    }
    // Si el producto vuelve a z (wⁿ = 1), los dos comparten el punto y el nombre.
    const vuelveAZ = Math.hypot(producto[0] - z[0], producto[1] - z[1]) < 1e-9;
    if (!fuera && !vuelveAZ) {
      g.fillStyle = c.tinta;
      circulo(g, pantallaProducto, 7, true);
      rotulo(pantallaProducto, nombreDelProducto(n));
    }
    const pz = aPantalla(z);
    g.fillStyle = elegido === 'z' ? c.cobreBajo : c.fondo;
    circulo(g, pz, 7, true);
    g.strokeStyle = c.tinta;
    g.lineWidth = 2;
    circulo(g, pz, 7, false);
    rotulo(pz, vuelveAZ ? `z = ${nombreDelProducto(n)}` : 'z');
    const pw = aPantalla(w);
    g.fillStyle = c.cobre;
    circulo(g, pw, 7, true);
    g.strokeStyle = elegido === 'w' ? c.tinta : c.cobre;
    g.lineWidth = 2;
    circulo(g, pw, 7, false);
    rotulo(pw, 'w');

    const texto = describir(z, w, n);
    lectura.textContent = texto;
    lienzo.setAttribute('aria-label', `${alt} Ahora: ${texto.replace(/\n/g, ' ')}`);
  }

  // Arrastrar los puntos, con el ajuste elegido y sin salir del círculo de radio MODULO_MAXIMO.
  const mover = (nombre: Nombre, destino: Complejo) => {
    const nuevo = ajustar(destino, ajuste.value as Ajuste);
    if (moduloComplejo(nuevo) <= MODULO_MAXIMO + 1e-9) puntos[nombre] = nuevo;
  };
  const posicion = (e: PointerEvent): Punto => {
    const r = lienzo.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const masCercano = ([px, py]: Punto): Nombre | undefined => {
    let mejor: Nombre | undefined;
    let distancia = 18;
    for (const nombre of ['z', 'w'] as const) {
      const [x, y] = aPantalla(puntos[nombre]);
      const d = Math.hypot(x - px, y - py);
      if (d <= distancia) [mejor, distancia] = [nombre, d];
    }
    return mejor;
  };

  function alPresionar(e: PointerEvent) {
    const nombre = masCercano(posicion(e));
    if (!nombre) return;
    arrastrado = nombre;
    elegido = nombre;
    lienzo.setPointerCapture(e.pointerId);
    lienzo.style.cursor = 'grabbing';
    e.preventDefault();
    dibujar();
  }
  function alMover(e: PointerEvent) {
    if (!arrastrado) {
      lienzo.style.cursor = masCercano(posicion(e)) ? 'grab' : 'default';
      return;
    }
    mover(arrastrado, aPlano(posicion(e)));
    dibujar();
  }
  function alSoltar(e: PointerEvent) {
    if (!arrastrado) return;
    arrastrado = undefined;
    if (lienzo.hasPointerCapture(e.pointerId)) lienzo.releasePointerCapture(e.pointerId);
    lienzo.style.cursor = 'grab';
  }
  function alTeclear(e: KeyboardEvent) {
    const tecla = e.key.toLowerCase();
    if (tecla === 'z' || tecla === 'w') {
      elegido = tecla;
      dibujar();
      return;
    }
    if (!['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(tecla)) return;
    e.preventDefault();
    const [a, b] = puntos[elegido];
    const modo = ajuste.value as Ajuste;
    if (modo === 'polar') {
      const r = moduloComplejo([a, b]);
      const theta = Math.atan2(b, a);
      const giro = { arrowleft: Math.PI / 12, arrowright: -Math.PI / 12, arrowup: 0, arrowdown: 0 }[tecla]!;
      const estiramiento = { arrowleft: 0, arrowright: 0, arrowup: 0.25, arrowdown: -0.25 }[tecla]!;
      const nuevoR = Math.max(0, r + estiramiento);
      mover(elegido, [nuevoR * Math.cos(theta + giro), nuevoR * Math.sin(theta + giro)]);
    } else {
      const paso = modo === 'cuadricula' ? 0.25 : 0.05;
      const d = { arrowleft: [-paso, 0], arrowright: [paso, 0], arrowup: [0, paso], arrowdown: [0, -paso] }[tecla]!;
      mover(elegido, [a + d[0]!, b + d[1]!]);
    }
    dibujar();
  }
  function alCambiarAjuste() {
    for (const nombre of ['z', 'w'] as const) mover(nombre, puntos[nombre]);
    dibujar();
  }

  lienzo.addEventListener('pointerdown', alPresionar);
  lienzo.addEventListener('pointermove', alMover);
  lienzo.addEventListener('pointerup', alSoltar);
  lienzo.addEventListener('pointercancel', alSoltar);
  lienzo.addEventListener('keydown', alTeclear);
  ajuste.addEventListener('change', alCambiarAjuste);
  veces.addEventListener('input', dibujar);
  const observador = new ResizeObserver(() => dibujar());
  observador.observe(raiz);
  dibujar();

  return () => {
    observador.disconnect();
    lienzo.removeEventListener('pointerdown', alPresionar);
    lienzo.removeEventListener('pointermove', alMover);
    lienzo.removeEventListener('pointerup', alSoltar);
    lienzo.removeEventListener('pointercancel', alSoltar);
    lienzo.removeEventListener('keydown', alTeclear);
    ajuste.removeEventListener('change', alCambiarAjuste);
    veces.removeEventListener('input', dibujar);
  };
}

function trazo(g: CanvasRenderingContext2D, puntos: readonly Punto[]) {
  if (puntos.length < 2) return;
  g.beginPath();
  g.moveTo(puntos[0]![0], puntos[0]![1]);
  for (const [x, y] of puntos.slice(1)) g.lineTo(x, y);
  g.stroke();
}

function circulo(g: CanvasRenderingContext2D, [x, y]: Punto, radio: number, relleno: boolean) {
  g.beginPath();
  g.arc(x, y, radio, 0, 2 * Math.PI);
  if (relleno) g.fill();
  else g.stroke();
}
