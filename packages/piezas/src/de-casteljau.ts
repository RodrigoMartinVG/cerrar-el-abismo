import { binomial, caminosDesde, muestrearCurva, pesosDeBernstein, vueltasDeCasteljau, type PuntoDelPlano } from './bezier.ts';

/**
 * PIEZA «de-casteljau» (I.5). Arriba, una curva de Bézier con sus puntos de control, que se arrastran, y las vueltas
 * del algoritmo de De Casteljau para el t del deslizador: cada vuelta une los puntos que mezclan de a dos los de la
 * anterior, y la última deja un solo punto, el de la curva. Debajo, el triángulo de las mezclas como esquema: cada
 * punto recibe 1 − t del de arriba a la izquierda y t del de arriba a la derecha, y dentro de cada uno se lee cuántos
 * caminos llegan a él desde el punto de control elegido, que es el triángulo de Pascal colgado de ese punto. La tabla
 * da los pesos de Bernstein de todos los puntos de control, que suman 1.
 *
 * Atributos opcionales: `data-puntos` («0,0 2,4 6,4 8,0»), `data-grado` (de 1 a 5, si no hay puntos) y `data-t`.
 * Con el teclado, el lienzo enfocado mueve con las flechas el punto elegido, y las cifras eligen otro.
 */

/** La región del plano que se dibuja, en las coordenadas de los puntos de control. */
const MUNDO = { xMin: -0.6, xMax: 8.6, yMin: -0.6, yMax: 5 } as const;
/** Los puntos arrastrados se ajustan a esta cuadrícula, para que se puedan poner en coordenadas exactas. */
const PASO = 0.25;
const GRADO_MAXIMO = 5;

const PREDETERMINADOS: Record<number, PuntoDelPlano[]> = {
  1: [
    [0, 1],
    [8, 3],
  ],
  2: [
    [0, 0],
    [4, 4.5],
    [8, 0],
  ],
  3: [
    [0, 0],
    [2, 4],
    [6, 4],
    [8, 0],
  ],
  4: [
    [0, 0],
    [0.5, 4],
    [4, 4.5],
    [7.5, 0.5],
    [8, 4],
  ],
  5: [
    [0, 0],
    [1, 4],
    [3, 4.5],
    [5, 0],
    [7, 0.5],
    [8, 4],
  ],
};

const SUBINDICES = '₀₁₂₃₄₅₆₇₈₉';
const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sub = (k: number) => [...String(k)].map((c) => SUBINDICES[Number(c)]).join('');
const sup = (k: number) => [...String(k)].map((c) => SUPERINDICES[Number(c)]).join('');
/** Coma decimal en el texto, como pide la convención de la obra. */
const decimal = (x: number, cifras: number) => (Math.abs(x) < 0.5 * 10 ** -cifras ? 0 : x).toFixed(cifras).replace('.', ',');

/** El peso de un camino desde P_k, en símbolos: «t²(1 − t)». */
function pesoDeUnCamino(n: number, k: number): string {
  const partes: string[] = [];
  if (k > 0) partes.push(k === 1 ? 't' : `t${sup(k)}`);
  if (n - k > 0) partes.push(n - k === 1 ? '(1 − t)' : `(1 − t)${sup(n - k)}`);
  return partes.join('') || '1';
}

function leerPuntos(texto: string | undefined): PuntoDelPlano[] | undefined {
  if (!texto) return undefined;
  const puntos = texto
    .trim()
    .split(/\s+/)
    .map((par) => par.split(',').map(Number));
  if (puntos.length < 2 || puntos.length > GRADO_MAXIMO + 1) return undefined;
  if (puntos.some((p) => p.length !== 2 || p.some((x) => !Number.isFinite(x)))) return undefined;
  return puntos.map(([x, y]) => [x!, y!]);
}

function predeterminados(grado: number): PuntoDelPlano[] {
  const n = Math.min(GRADO_MAXIMO, Math.max(1, Math.round(grado) || 3));
  return PREDETERMINADOS[n]!.map(([x, y]) => [x, y]);
}

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  const puntos: PuntoDelPlano[] = leerPuntos(raiz.dataset['puntos']) ?? predeterminados(Number(raiz.dataset['grado'] ?? 3));
  let elegido = Math.min(1, puntos.length - 1);
  let arrastrado: number | undefined;
  raiz.textContent = '';

  const lienzo = document.createElement('canvas');
  lienzo.tabIndex = 0;
  lienzo.setAttribute('role', 'img');
  lienzo.style.touchAction = 'none';

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const grado = deslizador('Grado n', 1, GRADO_MAXIMO, 1, puntos.length - 1);
  const tInicial = Number(raiz.dataset['t'] ?? 0.25);
  const parametro = deslizador('t', 0, 1, 0.01, Number.isFinite(tInicial) ? Math.min(1, Math.max(0, tInicial)) : 0.25);
  const etiquetaElegido = document.createElement('label');
  const eleccion = document.createElement('select');
  etiquetaElegido.append('Caminos desde ', eleccion);
  controles.append(grado.etiqueta, parametro.etiqueta, etiquetaElegido);

  const esquema = document.createElement('canvas');
  esquema.setAttribute('role', 'img');
  const tabla = document.createElement('table');
  tabla.className = 'pieza-matriz not-content';
  // En una pantalla angosta, la tabla se desplaza sola en lugar de ensanchar la página.
  const marcoDeTabla = document.createElement('div');
  marcoDeTabla.className = 'pieza-pesos';
  marcoDeTabla.append(tabla);
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(lienzo, controles, esquema, marcoDeTabla, lectura);

  // La transformación del mundo a la pantalla del último dibujo, para convertir los clics.
  let escala = 1;
  const aPantalla = ([x, y]: PuntoDelPlano): PuntoDelPlano => [(x - MUNDO.xMin) * escala, (MUNDO.yMax - y) * escala];
  const aMundo = ([px, py]: PuntoDelPlano): PuntoDelPlano => [px / escala + MUNDO.xMin, MUNDO.yMax - py / escala];
  // Las posiciones de los puntos de control en el esquema, para elegirlos con un clic.
  let enEsquema: PuntoDelPlano[] = [];

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

  function preparar(c: HTMLCanvasElement, ancho: number, alto: number): CanvasRenderingContext2D | null {
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(ancho * dpr);
    c.height = Math.round(alto * dpr);
    c.style.width = `${ancho}px`;
    c.style.height = `${alto}px`;
    const g = c.getContext('2d');
    if (!g) return null;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, ancho, alto);
    return g;
  }

  function dibujarCurva(t: number, ancho: number) {
    const n = puntos.length - 1;
    const alto = Math.round((ancho * (MUNDO.yMax - MUNDO.yMin)) / (MUNDO.xMax - MUNDO.xMin));
    escala = ancho / (MUNDO.xMax - MUNDO.xMin);
    const g = preparar(lienzo, ancho, alto);
    if (!g) return;
    const c = colores();
    g.font = '13px system-ui, sans-serif';

    // La cuadrícula de las unidades, con sus números en el borde.
    g.lineWidth = 1;
    g.strokeStyle = c.cuadricula;
    g.fillStyle = c.tenue;
    for (let x = 0; x <= 8; x++) {
      trazo(g, [aPantalla([x, MUNDO.yMin]), aPantalla([x, MUNDO.yMax])]);
      g.fillText(String(x), aPantalla([x, 0])[0] + 3, alto - 4);
    }
    for (let y = 0; y <= 4; y++) {
      trazo(g, [aPantalla([MUNDO.xMin, y]), aPantalla([MUNDO.xMax, y])]);
      if (y > 0) g.fillText(String(y), 3, aPantalla([0, y])[1] - 3);
    }

    // La curva: entera, fina, y el tramo de 0 a t, grueso.
    g.strokeStyle = c.linea;
    g.lineWidth = 1.5;
    trazo(g, muestrearCurva(puntos, 160).map(aPantalla));
    g.strokeStyle = c.tinta;
    g.lineWidth = 3;
    if (t > 0) trazo(g, muestrearCurva(puntos, Math.max(2, Math.round(160 * t)), 0, t).map(aPantalla));

    // El polígono de control y las vueltas, alternando el cobre y la tinta.
    const filas = vueltasDeCasteljau(puntos, t);
    g.strokeStyle = c.tenue;
    g.lineWidth = 1.25;
    trazo(g, puntos.map(aPantalla));
    for (let r = 1; r < n; r++) {
      const tono = r % 2 === 1 ? c.cobre : c.tinta;
      g.strokeStyle = tono;
      g.fillStyle = tono;
      g.lineWidth = 1.25;
      trazo(g, filas[r]!.map(aPantalla));
      for (const p of filas[r]!) circulo(g, aPantalla(p), 3.5, true);
    }

    // El punto de la curva.
    const final = aPantalla(filas[n]![0]!);
    g.fillStyle = c.cobre;
    circulo(g, final, 7, true);
    g.strokeStyle = c.tinta;
    g.lineWidth = 2;
    circulo(g, final, 7, false);

    // Los puntos de control, con su nombre; el elegido, relleno de cobre.
    puntos.forEach((p, k) => {
      const q = aPantalla(p);
      g.fillStyle = k === elegido ? c.cobre : c.fondo;
      circulo(g, q, 7, true);
      g.strokeStyle = c.tinta;
      g.lineWidth = 2;
      circulo(g, q, 7, false);
      g.fillStyle = c.tinta;
      const aLaIzquierda = q[0] > ancho - 34;
      g.textAlign = aLaIzquierda ? 'right' : 'left';
      g.fillText(`P${sub(k)}`, q[0] + (aLaIzquierda ? -10 : 10), q[1] < 20 ? q[1] + 18 : q[1] - 8);
      g.textAlign = 'start';
    });

    const [x, y] = filas[n]![0]!;
    lienzo.setAttribute(
      'aria-label',
      `${alt} Ahora: grado ${n}, t = ${decimal(t, 2)}, puntos de control ${puntos
        .map(([a, b], k) => `P${sub(k)} = (${decimal(a, 2)}; ${decimal(b, 2)})`)
        .join(', ')}; el punto de la curva es (${decimal(x, 2)}; ${decimal(y, 2)}).`,
    );
  }

  function dibujarEsquema(t: number, ancho: number) {
    const n = puntos.length - 1;
    const filas = 46;
    const arriba = 36;
    const leyenda = cortar(
      `Cada punto recibe 1 − t = ${decimal(1 - t, 2)} del de arriba a la izquierda y t = ${decimal(t, 2)} del de arriba a la derecha; un camino pesa el producto de lo que recibe en cada paso.`,
      '12px system-ui, sans-serif',
      ancho - 8,
    );
    const alto = arriba + n * filas + 44 + 16 * leyenda.length;
    const g = preparar(esquema, ancho, alto);
    if (!g) return;
    const c = colores();
    const dx = Math.min(ancho / (n + 2), 92);
    const x0 = (ancho - n * dx) / 2;
    const posicion = (r: number, j: number): PuntoDelPlano => [x0 + (j + r / 2) * dx, arriba + r * filas];
    const caminos = caminosDesde(n, elegido);
    enEsquema = puntos.map((_, j) => posicion(0, j));

    // Las aristas: de cada punto salen dos hacia abajo; las que están en un camino desde el elegido, en cobre.
    for (let r = 1; r <= n; r++)
      for (let j = 0; j <= n - r; j++)
        for (const padre of [j, j + 1]) {
          const enCamino = caminos[r - 1]![padre]! > 0;
          g.strokeStyle = enCamino ? c.cobre : c.cuadricula;
          g.lineWidth = enCamino ? 2.5 : 1.25;
          trazo(g, [posicion(r - 1, padre), posicion(r, j)]);
        }

    // Los puntos, con la cantidad de caminos que llegan a cada uno desde el elegido.
    g.textAlign = 'center';
    for (let r = 0; r <= n; r++)
      for (let j = 0; j <= n - r; j++) {
        const q = posicion(r, j);
        const cuantos = caminos[r]![j]!;
        g.fillStyle = cuantos > 0 ? c.cobreBajo : c.fondo;
        circulo(g, q, 13, true);
        g.strokeStyle = cuantos > 0 ? c.cobre : c.linea;
        g.lineWidth = cuantos > 0 ? 2 : 1.25;
        circulo(g, q, 13, false);
        if (cuantos > 0) {
          g.fillStyle = c.tinta;
          g.font = '600 13px system-ui, sans-serif';
          g.fillText(String(cuantos), q[0], q[1] + 4.5);
        }
      }
    g.font = '13px system-ui, sans-serif';
    g.fillStyle = c.tinta;
    for (let j = 0; j <= n; j++) g.fillText(`P${sub(j)}`, posicion(0, j)[0], arriba - 19);
    g.fillText('B(t)', posicion(n, 0)[0], arriba + n * filas + 29);
    if (ancho >= 420) {
      g.textAlign = 'left';
      g.fillStyle = c.tenue;
      for (let r = 1; r <= n; r++) g.fillText(`vuelta ${r}`, 4, arriba + r * filas + 4);
    }
    g.textAlign = 'left';
    g.font = '12px system-ui, sans-serif';
    g.fillStyle = c.tenue;
    leyenda.forEach((linea, i) => g.fillText(linea, 4, alto - 8 - 16 * (leyenda.length - 1 - i)));
    g.textAlign = 'start';

    esquema.setAttribute(
      'aria-label',
      `El triángulo de las mezclas de grado ${n}: cada punto de una vuelta recibe 1 − t del de arriba a la izquierda y t del de arriba a la derecha. Desde P${sub(elegido)} llegan ${caminos[n]![0]} caminos al punto de la curva; en cada vuelta r, los caminos que llegan a sus puntos son números de la fila r del triángulo de Pascal: ${caminos
        .slice(1)
        .map((f) => f.filter((x) => x > 0).join(' '))
        .join(' / ')}.`,
    );
  }

  function escribirTabla(t: number) {
    const n = puntos.length - 1;
    const pesos = pesosDeBernstein(n, t);
    const fila = (celdas: string[], encabezado = false, resaltada = false) => {
      const tr = document.createElement('tr');
      for (const texto of celdas) {
        const celda = document.createElement(encabezado ? 'th' : 'td');
        if (resaltada) {
          const fuerte = document.createElement('strong');
          fuerte.textContent = texto;
          celda.append(fuerte);
        } else celda.textContent = texto;
        tr.append(celda);
      }
      return tr;
    };
    const cabeza = document.createElement('thead');
    cabeza.append(fila(['punto', 'caminos', 'un camino', 'peso'], true));
    const cuerpo = document.createElement('tbody');
    pesos.forEach((peso, k) => {
      const uno = t ** k * (1 - t) ** (n - k);
      cuerpo.append(
        fila(
          [`P${sub(k)}`, String(binomial(n, k)), `${pesoDeUnCamino(n, k)} = ${decimal(uno, 4)}`, decimal(peso, 4)],
          false,
          k === elegido,
        ),
      );
    });
    cuerpo.append(
      fila([
        'suma',
        `2${sup(n)} = ${2 ** n}`,
        '',
        decimal(
          pesos.reduce((a, b) => a + b, 0),
          4,
        ),
      ]),
    );
    tabla.replaceChildren(cabeza, cuerpo);
  }

  function actualizarEleccion() {
    const n = puntos.length - 1;
    if (eleccion.options.length !== n + 1)
      eleccion.replaceChildren(
        ...puntos.map((_, k) => {
          const opcion = document.createElement('option');
          opcion.value = String(k);
          opcion.textContent = `P${sub(k)}`;
          return opcion;
        }),
      );
    eleccion.value = String(elegido);
  }

  function dibujar() {
    const n = puntos.length - 1;
    const t = Number(parametro.input.value);
    grado.valor.textContent = String(n);
    parametro.valor.textContent = decimal(t, 2);
    actualizarEleccion();
    const ancho = Math.min(raiz.clientWidth || 560, 640);
    dibujarCurva(t, ancho);
    dibujarEsquema(t, ancho);
    escribirTabla(t);
    const [x, y] = vueltasDeCasteljau(puntos, t)[n]![0]!;
    const k = elegido;
    const caminos = binomial(n, k);
    const uno = t ** k * (1 - t) ** (n - k);
    lectura.textContent =
      `t = ${decimal(t, 2)}: el punto de la curva es (${decimal(x, 2)}; ${decimal(y, 2)}). ` +
      `Desde P${sub(k)} llegan ${caminos} ${caminos === 1 ? 'camino' : 'caminos'} al final, cada uno con peso ` +
      `${pesoDeUnCamino(n, k)} = ${decimal(uno, 4)}, así que el peso de P${sub(k)} es ${caminos} · ${decimal(uno, 4)} = ` +
      `${decimal(caminos * uno, 4)}. Los pesos de todos los puntos suman 1.`;
  }

  // Arrastrar los puntos de control.
  const posicionEn = (c: HTMLCanvasElement, e: PointerEvent): PuntoDelPlano => {
    const r = c.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const masCercano = (lugares: readonly PuntoDelPlano[], [px, py]: PuntoDelPlano, radio: number) => {
    let mejor: number | undefined;
    let distancia = radio;
    lugares.forEach(([x, y], k) => {
      const d = Math.hypot(x - px, y - py);
      if (d <= distancia) [mejor, distancia] = [k, d];
    });
    return mejor;
  };
  const ajustar = (x: number, min: number, max: number) =>
    Math.min(max - PASO, Math.max(min + PASO, Math.round(x / PASO) * PASO));
  const mover = (k: number, [x, y]: PuntoDelPlano) => {
    puntos[k] = [ajustar(x, MUNDO.xMin, MUNDO.xMax), ajustar(y, MUNDO.yMin, MUNDO.yMax)];
  };

  function alPresionar(e: PointerEvent) {
    const k = masCercano(puntos.map(aPantalla), posicionEn(lienzo, e), 18);
    if (k === undefined) return;
    arrastrado = k;
    elegido = k;
    lienzo.setPointerCapture(e.pointerId);
    lienzo.style.cursor = 'grabbing';
    e.preventDefault();
    dibujar();
  }
  function alMover(e: PointerEvent) {
    const lugar = posicionEn(lienzo, e);
    if (arrastrado === undefined) {
      lienzo.style.cursor = masCercano(puntos.map(aPantalla), lugar, 18) === undefined ? 'default' : 'grab';
      return;
    }
    mover(arrastrado, aMundo(lugar));
    dibujar();
  }
  function alSoltar(e: PointerEvent) {
    if (arrastrado === undefined) return;
    arrastrado = undefined;
    if (lienzo.hasPointerCapture(e.pointerId)) lienzo.releasePointerCapture(e.pointerId);
    lienzo.style.cursor = 'grab';
  }
  function alTeclear(e: KeyboardEvent) {
    const n = puntos.length - 1;
    if (/^[0-9]$/.test(e.key) && Number(e.key) <= n) {
      elegido = Number(e.key);
      dibujar();
      return;
    }
    const pasos: Record<string, PuntoDelPlano> = {
      ArrowLeft: [-PASO, 0],
      ArrowRight: [PASO, 0],
      ArrowUp: [0, PASO],
      ArrowDown: [0, -PASO],
    };
    const d = pasos[e.key];
    if (!d) return;
    e.preventDefault();
    const [x, y] = puntos[elegido]!;
    mover(elegido, [x + d[0], y + d[1]]);
    dibujar();
  }
  function alElegirEnEsquema(e: PointerEvent) {
    const k = masCercano(enEsquema, posicionEn(esquema, e), 16);
    if (k === undefined) return;
    elegido = k;
    dibujar();
  }
  function alCambiarGrado() {
    const n = Number(grado.input.value);
    if (n === puntos.length - 1) return;
    puntos.splice(0, puntos.length, ...predeterminados(n));
    elegido = Math.min(elegido, n);
    dibujar();
  }
  function alElegir() {
    elegido = Number(eleccion.value);
    dibujar();
  }

  lienzo.addEventListener('pointerdown', alPresionar);
  lienzo.addEventListener('pointermove', alMover);
  lienzo.addEventListener('pointerup', alSoltar);
  lienzo.addEventListener('pointercancel', alSoltar);
  lienzo.addEventListener('keydown', alTeclear);
  esquema.addEventListener('pointerdown', alElegirEnEsquema);
  grado.input.addEventListener('input', alCambiarGrado);
  parametro.input.addEventListener('input', dibujar);
  eleccion.addEventListener('change', alElegir);
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
    esquema.removeEventListener('pointerdown', alElegirEnEsquema);
    grado.input.removeEventListener('input', alCambiarGrado);
    parametro.input.removeEventListener('input', dibujar);
    eleccion.removeEventListener('change', alElegir);
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

function trazo(g: CanvasRenderingContext2D, puntos: readonly PuntoDelPlano[]) {
  if (puntos.length < 2) return;
  g.beginPath();
  g.moveTo(puntos[0]![0], puntos[0]![1]);
  for (const [x, y] of puntos.slice(1)) g.lineTo(x, y);
  g.stroke();
}

function circulo(g: CanvasRenderingContext2D, [x, y]: PuntoDelPlano, radio: number, relleno: boolean) {
  g.beginPath();
  g.arc(x, y, radio, 0, 2 * Math.PI);
  if (relleno) g.fill();
  else g.stroke();
}

/** Corta un texto en líneas que no pasen de `ancho` píxeles con la fuente dada, para escribirlo en un lienzo. */
function cortar(texto: string, fuente: string, ancho: number): string[] {
  const g = document.createElement('canvas').getContext('2d');
  if (!g) return [texto];
  g.font = fuente;
  const lineas: string[] = [];
  let actual = '';
  for (const palabra of texto.split(' ')) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (actual && g.measureText(prueba).width > ancho) {
      lineas.push(actual);
      actual = palabra;
    } else actual = prueba;
  }
  if (actual) lineas.push(actual);
  return lineas;
}
