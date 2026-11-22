import {
  comienzoDeGoodstein,
  parEnOmegaCuadrado,
  pasoDeGoodstein,
  pasosHastaCero,
  textoHereditario,
  textoOrdinal,
  type Hereditaria,
  type TerminoDeGoodstein,
} from './goodstein.ts';

/**
 * PIEZA «sucesion-de-goodstein» (I.11). Arriba, los ordinales menores que ω², dibujados como el orden lexicográfico de
 * ℕ × ℕ: una fila por cada copia de ℕ, la fila a con los pares (a, c), que son los ordinales ω·a + c, cada vez más
 * juntos hacia la derecha, donde empieza la fila siguiente. Abajo, una sucesión de Goodstein paso a paso: de cada
 * término, la base, la escritura hereditaria y el ordinal que resulta de reemplazar la base por ω. Mientras el ordinal
 * es menor que ω², el término es un punto del dibujo, que baja hasta (0, 0) con un rastro de los pasos anteriores.
 *
 * Atributos opcionales: `data-n` (el número de partida, 11 por omisión) y `data-base` (la base inicial, 4 por
 * omisión; la sucesión clásica empieza en la base 2).
 */

const SVG = 'http://www.w3.org/2000/svg';
const N_MAXIMO = 9999;
const BASE_MAXIMA = 12;
/** Cuántas filas puede tener el dibujo, y cuántos pasos puede recorrer de corrido el botón «hasta 0». */
const FILAS_MAXIMAS = 16;
const PASOS_DE_CORRIDO = 100_000;
/** Cuántos términos se guardan, cuántos muestra la tabla y cuántos puntos deja el rastro. */
const HISTORIA = 400;
const FILAS_DE_TABLA = 6;
const RASTRO = 40;

/** Las medidas del dibujo, en unidades del viewBox. */
const ANCHO = 560;
const X0 = 62;
const LARGO = ANCHO - X0 - 24;
const ALTO_DE_FILA = 30;
const ARRIBA = 26;
const RAZON = 0.85;

const posicionX = (c: bigint) => X0 + LARGO * (1 - RAZON ** Number(c));
const posicionY = (a: number) => ARRIBA + a * ALTO_DE_FILA;
const rotuloDeFila = (a: number) => (a === 0 ? '0' : a === 1 ? 'ω' : `ω·${a}`);

/** Un número para leer: tal cual si es corto; si no, cuántas cifras tiene. */
const numero = (v: bigint) => {
  const cifras = v.toString();
  return cifras.length <= 24 ? cifras : `un número de ${cifras.length} cifras`;
};

/**
 * Una escritura hereditaria como nodos, con los exponentes en `<sup>`. Con `base` = 'ω' es el ordinal, con el
 * coeficiente a la derecha. Las sumas de más de seis términos se acortan: los tres primeros, ⋯ y el último.
 */
function enNodos(h: Hereditaria, base: string): DocumentFragment {
  const fragmento = document.createDocumentFragment();
  if (h.length === 0) {
    fragmento.append('0');
    return fragmento;
  }
  const ordinal = base === 'ω';
  const visibles = h.length > 6 ? [...h.slice(0, 3), null, h[h.length - 1]!] : h;
  visibles.forEach((t, i) => {
    if (i > 0) fragmento.append(' + ');
    if (t === null) {
      const puntos = document.createElement('span');
      puntos.textContent = '⋯';
      puntos.title = `${h.length - 4} términos más`;
      fragmento.append(puntos);
      return;
    }
    const { coeficiente, exponente } = t;
    const esCifra = exponente.length === 0 || (exponente.length === 1 && exponente[0]!.exponente.length === 0);
    const e = exponente.length === 0 ? 0n : esCifra ? exponente[0]!.coeficiente : null;
    if (e === 0n) {
      fragmento.append(String(coeficiente));
      return;
    }
    const potencia = document.createDocumentFragment();
    potencia.append(base);
    if (e !== 1n) {
      const sup = document.createElement('sup');
      sup.append(enNodos(exponente, base));
      potencia.append(sup);
    }
    if (coeficiente === 1n) fragmento.append(potencia);
    else if (ordinal) fragmento.append(potencia, `·${coeficiente}`);
    else fragmento.append(`${coeficiente}·`, potencia);
  });
  return fragmento;
}

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  const entero = (texto: string | undefined, respaldo: number, min: number, max: number) => {
    const v = Math.trunc(Number(texto));
    return Number.isFinite(v) && texto !== undefined && texto !== '' ? Math.min(max, Math.max(min, v)) : respaldo;
  };
  raiz.textContent = '';

  // El dibujo de ω².
  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.classList.add('pieza-goodstein');

  // Los controles: el punto de partida y los pasos.
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const campo = (rotulo: string, min: number, max: number, valor: number) => {
    const etiqueta = document.createElement('label');
    const entrada = document.createElement('input');
    Object.assign(entrada, { type: 'number', min: String(min), max: String(max), step: '1', value: String(valor) });
    entrada.style.width = '5.5em';
    etiqueta.append(`${rotulo} `, entrada);
    controles.append(etiqueta);
    return entrada;
  };
  const campoN = campo('n', 0, N_MAXIMO, entero(raiz.dataset['n'], 11, 0, N_MAXIMO));
  const campoBase = campo('base inicial', 2, BASE_MAXIMA, entero(raiz.dataset['base'], 4, 2, BASE_MAXIMA));

  const botones = document.createElement('div');
  botones.className = 'pieza-controles pieza-botones not-content';
  const boton = (texto: string, etiqueta: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = texto;
    b.setAttribute('aria-label', etiqueta);
    b.title = etiqueta;
    botones.append(b);
    return b;
  };
  const reiniciar = boton('⏮', 'Volver al comienzo');
  const unPaso = boton('▶', 'Un paso');
  const diezPasos = boton('+10', 'Diez pasos');
  const hastaCero = boton('⏭', 'Bajar hasta 0');
  const contador = document.createElement('span');
  contador.className = 'pieza-valor';
  botones.append(contador);

  // La tabla de los últimos términos.
  const tabla = document.createElement('table');
  tabla.className = 'pieza-goodstein-tabla not-content';
  const marcoDeTabla = document.createElement('div');
  marcoDeTabla.style.overflowX = 'auto';
  marcoDeTabla.append(tabla);
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(dibujo, controles, botones, marcoDeTabla, lectura);

  let historia: TerminoDeGoodstein[] = [];
  /** Si la sucesión se cortó porque el término siguiente no cabe. */
  let cortada = false;
  let filas = 4;
  let animacion: ReturnType<typeof setInterval> | null = null;

  const actual = () => historia[historia.length - 1]!;

  function detener() {
    if (animacion !== null) clearInterval(animacion);
    animacion = null;
    hastaCero.textContent = '⏭';
    hastaCero.setAttribute('aria-label', 'Bajar hasta 0');
    hastaCero.title = 'Bajar hasta 0';
  }

  function comenzar() {
    detener();
    const n = BigInt(entero(campoN.value, 11, 0, N_MAXIMO));
    const base = BigInt(entero(campoBase.value, 4, 2, BASE_MAXIMA));
    historia = [comienzoDeGoodstein(n, base)];
    cortada = false;
    const par = parEnOmegaCuadrado(actual().escritura);
    filas = Math.min(FILAS_MAXIMAS, Math.max(4, par ? Number(par[0]) + 1 : 4));
    dibujar();
  }

  /** Da hasta `k` pasos; devuelve false si la sucesión terminó o se cortó. */
  function avanzar(k: number): boolean {
    for (let i = 0; i < k; i++) {
      const t = actual();
      if (t.valor === 0n || cortada) return false;
      const siguiente = pasoDeGoodstein(t);
      if (!siguiente) {
        cortada = true;
        return false;
      }
      historia.push(siguiente);
      const par = parEnOmegaCuadrado(siguiente.escritura);
      if (par && Number(par[0]) + 1 > filas) filas = Math.min(FILAS_MAXIMAS, Number(par[0]) + 1);
    }
    if (historia.length > HISTORIA) historia = historia.slice(-HISTORIA);
    return actual().valor !== 0n && !cortada;
  }

  /** Los pasos que faltan si el término está en ω², o null si no. */
  function faltan(): bigint | null {
    const t = actual();
    const par = parEnOmegaCuadrado(t.escritura);
    return par ? pasosHastaCero(par[0], par[1], t.base) : null;
  }

  function dibujarOmegaCuadrado() {
    const alto = ARRIBA + filas * ALTO_DE_FILA + 26;
    dibujo.setAttribute('viewBox', `0 0 ${ANCHO} ${alto}`);
    dibujo.replaceChildren();
    const elemento = (nombre: string, atributos: Record<string, string | number>, clase?: string) => {
      const e = document.createElementNS(SVG, nombre);
      for (const [k, v] of Object.entries(atributos)) e.setAttribute(k, typeof v === 'number' ? v.toFixed(1) : v);
      if (clase) e.classList.add(clase);
      dibujo.append(e);
      return e;
    };
    for (let a = 0; a < filas; a++) {
      const y = posicionY(a);
      const rotulo = elemento('text', { x: X0 - 14, y, 'text-anchor': 'end', dy: '0.35em', fill: 'currentColor' }, 'rotulo');
      rotulo.textContent = rotuloDeFila(a);
      elemento('line', { x1: X0, y1: y, x2: X0 + LARGO, y2: y, stroke: 'currentColor' }, 'eje');
      for (let c = 0n; c < 45n; c++) {
        const x = posicionX(c);
        const medio = c < 5n ? 6 : 4;
        elemento('line', { x1: x, y1: y - medio, x2: x, y2: y + medio, stroke: 'currentColor' }, 'marca');
      }
      if (a === 0)
        for (let c = 0n; c < 4n; c++) {
          const texto = elemento('text', { x: posicionX(c), y: y - 10, 'text-anchor': 'middle', fill: 'currentColor' }, 'rotulo');
          texto.textContent = String(c);
        }
      // La fila siguiente empieza donde se acumulan las marcas de esta.
      if (a + 1 < filas)
        elemento(
          'path',
          {
            d: `M ${X0 + LARGO} ${y + 4} C ${X0 + LARGO} ${y + ALTO_DE_FILA / 2}, ${X0} ${y + ALTO_DE_FILA / 2}, ${X0} ${y + ALTO_DE_FILA - 7}`,
            fill: 'none',
            stroke: 'currentColor',
          },
          'enlace',
        );
    }
    const pie = elemento('text', { x: X0 - 14, y: posicionY(filas) - 4, 'text-anchor': 'end', fill: 'currentColor' }, 'rotulo');
    pie.textContent = '⋮';
    const final = elemento('text', { x: X0, y: posicionY(filas) + 4, fill: 'currentColor' }, 'rotulo');
    final.textContent = 'y después de todas las filas, ω²';

    // El rastro de los pasos anteriores que estaban en ω², y el punto del término actual.
    const enElDibujo = historia
      .slice(-RASTRO - 1)
      .map((t) => parEnOmegaCuadrado(t.escritura))
      .filter((p): p is [bigint, bigint] => p !== null && Number(p[0]) < filas);
    // El camino une los pasos: dentro de una fila va hacia la izquierda, y al cambiar de fila salta hacia la derecha.
    if (enElDibujo.length > 1)
      elemento(
        'polyline',
        {
          points: enElDibujo.map(([a, c]) => `${posicionX(c).toFixed(1)},${posicionY(Number(a)).toFixed(1)}`).join(' '),
          fill: 'none',
          stroke: 'currentColor',
          'stroke-opacity': '0.5',
        },
        'camino',
      );
    enElDibujo.forEach(([a, c], i) => {
      const ultimo = i === enElDibujo.length - 1 && parEnOmegaCuadrado(actual().escritura) !== null;
      const punto = elemento(
        'circle',
        { cx: posicionX(c), cy: posicionY(Number(a)), r: ultimo ? 6 : 3, fill: 'currentColor' },
        ultimo ? 'punto' : 'rastro',
      );
      if (!ultimo) punto.setAttribute('opacity', (0.2 + (0.5 * (i + 1)) / enElDibujo.length).toFixed(2));
    });
  }

  function dibujarTabla() {
    tabla.replaceChildren();
    const cabeza = tabla.createTHead().insertRow();
    for (const titulo of ['paso', 'base', 'término', 'en base hereditaria', 'ordinal']) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = titulo;
      cabeza.append(th);
    }
    const cuerpo = tabla.createTBody();
    const ultimos = historia.slice(-FILAS_DE_TABLA);
    ultimos.forEach((t, i) => {
      const fila = cuerpo.insertRow();
      if (i === ultimos.length - 1) fila.classList.add('actual');
      fila.insertCell().textContent = String(t.paso);
      fila.insertCell().textContent = String(t.base);
      fila.insertCell().textContent = numero(t.valor);
      fila.insertCell().append(enNodos(t.escritura, String(t.base)));
      fila.insertCell().append(enNodos(t.escritura, 'ω'));
    });
  }

  function dibujar() {
    const t = actual();
    dibujarOmegaCuadrado();
    dibujarTabla();
    contador.textContent = `paso ${t.paso}, base ${t.base}`;

    const par = parEnOmegaCuadrado(t.escritura);
    const quedan = faltan();
    const terminada = t.valor === 0n;
    unPaso.disabled = terminada || cortada;
    diezPasos.disabled = terminada || cortada;
    hastaCero.disabled = (terminada || quedan === null || quedan > BigInt(PASOS_DE_CORRIDO)) && animacion === null;

    const escritura = textoHereditario(t.escritura, String(t.base));
    const ordinal = textoOrdinal(t.escritura);
    let texto =
      `Paso ${t.paso}, base ${t.base}: el término es ${numero(t.valor)}` +
      (t.escritura.length > 1 || t.valor >= t.base
        ? `, que en base ${t.base} se escribe ${escritura.length <= 80 ? escritura : 'con ' + t.escritura.length + ' términos'}`
        : '') +
      `. Reemplazando ${t.base} por ω, le corresponde el ordinal ${ordinal.length <= 80 ? ordinal : 'que muestra la tabla'}. `;
    if (terminada) texto += `La sucesión llegó a 0 en ${t.paso} ${t.paso === 1 ? 'paso' : 'pasos'}.`;
    else if (par && quedan !== null) {
      const [a, c] = par;
      texto +=
        Number(a) < filas
          ? `Es el par (${a}, ${c}) del dibujo: faltan exactamente ${quedan} pasos para llegar a 0.`
          : `Es el par (${a}, ${c}), fuera de las filas del dibujo: faltan exactamente ${quedan} pasos para llegar a 0.`;
    } else
      texto +=
        'El ordinal es mayor o igual que ω²: el término todavía no aparece en el dibujo, pero su ordinal baja en cada paso.';
    if (cortada)
      texto +=
        ' El término siguiente tendría más de 6000 cifras: la pieza se detiene aquí, aunque la sucesión sigue, y llega a 0.';
    lectura.textContent = texto;
    dibujo.setAttribute(
      'aria-label',
      `${alt} Ahora: paso ${t.paso}, ordinal ${ordinal.length <= 80 ? ordinal : 'mayor que ω²'}${par ? `, el par (${par[0]}, ${par[1]})` : ''}.`,
    );
  }

  const alCambiar = () => comenzar();
  const alReiniciar = () => comenzar();
  const alDarUnPaso = () => {
    detener();
    avanzar(1);
    dibujar();
  };
  const alDarDiez = () => {
    detener();
    avanzar(10);
    dibujar();
  };
  const alBajar = () => {
    if (animacion !== null) {
      detener();
      dibujar();
      return;
    }
    const quedan = faltan();
    if (quedan === null || quedan === 0n || quedan > BigInt(PASOS_DE_CORRIDO)) return;
    // Unos 120 cuadros, de a varios pasos si hacen falta muchos.
    const porCuadro = Math.max(1, Math.ceil(Number(quedan) / 120));
    hastaCero.textContent = '⏸';
    hastaCero.setAttribute('aria-label', 'Pausa');
    hastaCero.title = 'Pausa';
    animacion = setInterval(() => {
      const sigue = avanzar(porCuadro);
      if (!sigue) detener();
      dibujar();
    }, 60);
  };

  campoN.addEventListener('change', alCambiar);
  campoBase.addEventListener('change', alCambiar);
  reiniciar.addEventListener('click', alReiniciar);
  unPaso.addEventListener('click', alDarUnPaso);
  diezPasos.addEventListener('click', alDarDiez);
  hastaCero.addEventListener('click', alBajar);
  comenzar();
  return () => {
    detener();
    campoN.removeEventListener('change', alCambiar);
    campoBase.removeEventListener('change', alCambiar);
    reiniciar.removeEventListener('click', alReiniciar);
    unPaso.removeEventListener('click', alDarUnPaso);
    diezPasos.removeEventListener('click', alDarDiez);
    hastaCero.removeEventListener('click', alBajar);
  };
}
