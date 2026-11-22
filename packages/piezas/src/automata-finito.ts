import {
  AUTOMATAS_DEL_CAPITULO,
  SUMIDERO,
  arcos,
  clasesDe,
  clausura,
  completar,
  destinos,
  esDeterminista,
  escribirConjunto,
  leer,
  moore,
  rotular,
  subconjuntos,
  type Lectura,
} from './automatas.ts';

/**
 * PIEZA «automata-finito» (I.13). Un autómata finito dibujado como un digrafo, que lee una palabra símbolo por
 * símbolo: el estado actual se resalta en el diagrama, el símbolo recién leído en la palabra y el arco recorrido en
 * cobre, y al terminar el autómata acepta o rechaza. En los no deterministas se resaltan todos los estados posibles a
 * la vez, y la tabla de la construcción de subconjuntos marca la fila del conjunto actual; en los deterministas, la
 * tabla es la de transiciones, y debajo se lee lo que hace el algoritmo de Moore.
 *
 * Atributos opcionales: `data-automata` (la clave de uno de AUTOMATAS_DEL_CAPITULO), `data-palabra` y `data-paso`
 * (un número, o «final»).
 */

const ESCALA = 100;
const SVG = 'http://www.w3.org/2000/svg';
type Punto = readonly [number, number];

/** «a», «a y b», «a, b y c». */
const enumerar = (partes: readonly string[]) =>
  partes.length <= 1 ? (partes[0] ?? '') : `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;

const unitario = (x: number, y: number): Punto => {
  const largo = Math.hypot(x, y) || 1;
  return [x / largo, y / largo];
};

const fmt = (x: number) => x.toFixed(1);

/** «2⁴», con el exponente en superíndice. */
const potenciaDeDos = (n: number) => `2${[...String(n)].map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join('')}`;

function elemento<K extends keyof SVGElementTagNameMap>(nombre: K, atributos: Record<string, string | number> = {}) {
  const e = document.createElementNS(SVG, nombre);
  for (const [clave, valor] of Object.entries(atributos)) e.setAttribute(clave, typeof valor === 'number' ? fmt(valor) : valor);
  return e;
}

/** La punta de una flecha que termina en `fin` con dirección `dir`. */
function punta(fin: Punto, dir: Punto): SVGPathElement {
  const [x, y] = fin;
  const [ux, uy] = dir;
  const [bx, by] = [x - 9 * ux, y - 9 * uy];
  return elemento('path', {
    d: `M ${fmt(x)} ${fmt(y)} L ${fmt(bx - 4.5 * uy)} ${fmt(by + 4.5 * ux)} L ${fmt(bx + 4.5 * uy)} ${fmt(by - 4.5 * ux)} Z`,
    class: 'punta',
  });
}

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  let automata = AUTOMATAS_DEL_CAPITULO.find((a) => a.clave === raiz.dataset['automata']) ?? AUTOMATAS_DEL_CAPITULO[0]!;
  let palabra = raiz.dataset['palabra'] ?? automata.palabra;
  let lectura: Lectura = leer(automata, palabra);
  const pasoPedido = raiz.dataset['paso'];
  let paso =
    pasoPedido === 'final' ? lectura.simbolos.length : Math.min(Math.max(0, Number(pasoPedido) || 0), lectura.simbolos.length);
  raiz.textContent = '';

  // Los controles: el autómata y la palabra.
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaAutomata = document.createElement('label');
  const eleccion = document.createElement('select');
  for (const a of AUTOMATAS_DEL_CAPITULO) {
    const opcion = document.createElement('option');
    opcion.value = a.clave;
    opcion.textContent = a.titulo;
    eleccion.append(opcion);
  }
  eleccion.style.maxWidth = '100%';
  etiquetaAutomata.style.maxWidth = '100%';
  etiquetaAutomata.append('Autómata ', eleccion);
  const etiquetaPalabra = document.createElement('label');
  const campo = document.createElement('input');
  Object.assign(campo, { type: 'text', maxLength: 24, spellcheck: false, autocomplete: 'off' });
  campo.style.width = '9em';
  campo.style.fontFamily = 'var(--sl-font-mono)';
  etiquetaPalabra.append('Palabra ', campo);
  controles.append(etiquetaAutomata, etiquetaPalabra);

  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.classList.add('pieza-automata');

  const vistaPalabra = document.createElement('p');
  vistaPalabra.className = 'pieza-palabra not-content';
  vistaPalabra.setAttribute('aria-hidden', 'true');

  const botones = document.createElement('div');
  botones.className = 'pieza-controles not-content';
  const boton = (texto: string, etiqueta: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = texto;
    b.setAttribute('aria-label', etiqueta);
    botones.append(b);
    return b;
  };
  const alComienzo = boton('⏮', 'Al comienzo');
  const anterior = boton('◀', 'Símbolo anterior');
  const siguiente = boton('▶', 'Símbolo siguiente');
  const alFinal = boton('⏭', 'Al final');
  const contador = document.createElement('span');
  contador.className = 'pieza-valor';
  botones.append(contador);

  const salida = document.createElement('output');
  salida.className = 'pieza-lectura';
  salida.setAttribute('aria-live', 'polite');
  const tabla = document.createElement('table');
  tabla.className = 'pieza-matriz pieza-tabla-automata not-content';
  const marcoDeTabla = document.createElement('div');
  marcoDeTabla.style.overflowX = 'auto';
  marcoDeTabla.append(tabla);
  const nota = document.createElement('p');
  nota.className = 'pieza-lectura';
  raiz.append(controles, dibujo, vistaPalabra, botones, salida, marcoDeTabla, nota);

  /** Las transiciones de la lectura en este paso: [desde, símbolo, hacia], para marcarlas en cobre. */
  function recorridas(): Set<string> {
    const marcadas = new Set<string>();
    const actual = new Set(lectura.conjuntos[paso]);
    if (paso > 0 && paso - 1 !== lectura.fueraDelAlfabeto) {
      const s = lectura.simbolos[paso - 1]!;
      for (const p of lectura.conjuntos[paso - 1]!) for (const q of destinos(automata, p, s)) marcadas.add(`${p}→${q}`);
    }
    for (const [p, s, q] of automata.transiciones) if (s === '' && actual.has(p) && actual.has(q)) marcadas.add(`${p}→${q}`);
    return marcadas;
  }

  function dibujar() {
    const a = automata;
    const largoMaximo = Math.max(...a.estados.map((q) => [...q].length));
    const r = Math.max(19, 4 * largoMaximo + 6);
    const lugar = (q: string): Punto => {
      const [x, y] = a.posiciones[q] ?? [0, 0];
      return [x * ESCALA, y * ESCALA];
    };
    const terminado = paso === lectura.simbolos.length;
    const actual = new Set(lectura.conjuntos[paso]);
    const marcadas = recorridas();
    dibujo.replaceChildren();
    dibujo.classList.toggle('aceptada', terminado && lectura.acepta);
    dibujo.classList.toggle('rechazada', terminado && !lectura.acepta);

    // Los límites del dibujo, que se agrandan con cada cosa que se dibuja.
    const xs: number[] = [];
    const ys: number[] = [];
    const incluir = (x: number, y: number, holgura = 0) => {
      xs.push(x - holgura, x + holgura);
      ys.push(y - holgura, y + holgura);
    };
    const texto = (x: number, y: number, contenido: string, clase: string) => {
      const t = elemento('text', { x, y, 'text-anchor': 'middle', dy: '0.35em', class: clase });
      t.textContent = contenido;
      incluir(x, y, 4 * contenido.length + 6);
      return t;
    };

    // Los arcos, debajo de los estados.
    for (const { desde, hacia, simbolos } of arcos(a)) {
      const grupo = elemento('g', { class: 'transicion' });
      if (marcadas.has(`${desde}→${hacia}`)) grupo.classList.add('recorrido');
      const rotulo = rotular(a, simbolos);
      const [cx, cy] = lugar(desde);
      if (desde === hacia) {
        const t = ((a.lazos?.[desde] ?? -90) * Math.PI) / 180;
        const abre = 0.45;
        const lejos = r + 44;
        const p1: Punto = [cx + r * Math.cos(t - abre), cy + r * Math.sin(t - abre)];
        const p2: Punto = [cx + r * Math.cos(t + abre), cy + r * Math.sin(t + abre)];
        const c1: Punto = [cx + lejos * Math.cos(t - 0.55), cy + lejos * Math.sin(t - 0.55)];
        const c2: Punto = [cx + lejos * Math.cos(t + 0.55), cy + lejos * Math.sin(t + 0.55)];
        grupo.append(
          elemento('path', {
            d: `M ${fmt(p1[0])} ${fmt(p1[1])} C ${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`,
            class: 'arco',
          }),
          punta(p2, unitario(p2[0] - c2[0], p2[1] - c2[1])),
        );
        const d = 0.25 * r + 0.66 * lejos + 13;
        grupo.append(texto(cx + d * Math.cos(t), cy + d * Math.sin(t), rotulo, 'rotulo'));
        incluir(cx + lejos * Math.cos(t), cy + lejos * Math.sin(t), 6);
      } else {
        const [x1, y1] = [cx, cy];
        const [x2, y2] = lugar(hacia);
        const hayVuelta = a.transiciones.some(([p, , q]) => p === hacia && q === desde);
        const curva = a.curvas?.[`${desde}→${hacia}`] ?? (hayVuelta ? 16 : 0);
        // La normal a la izquierda del sentido del arco, con la y hacia abajo.
        const [nx, ny] = unitario(y2 - y1, -(x2 - x1));
        const control: Punto = [(x1 + x2) / 2 + 2 * curva * nx, (y1 + y2) / 2 + 2 * curva * ny];
        const u1 = unitario(control[0] - x1, control[1] - y1);
        const u2 = unitario(x2 - control[0], y2 - control[1]);
        const inicio: Punto = [x1 + r * u1[0], y1 + r * u1[1]];
        const fin: Punto = [x2 - r * u2[0], y2 - r * u2[1]];
        grupo.append(
          elemento('path', {
            d: `M ${fmt(inicio[0])} ${fmt(inicio[1])} Q ${fmt(control[0])} ${fmt(control[1])} ${fmt(fin[0])} ${fmt(fin[1])}`,
            class: 'arco',
          }),
          punta(fin, u2),
        );
        const medio: Punto = [(inicio[0] + 2 * control[0] + fin[0]) / 4, (inicio[1] + 2 * control[1] + fin[1]) / 4];
        const lado = curva < 0 ? -1 : 1;
        grupo.append(texto(medio[0] + lado * 12 * nx, medio[1] + lado * 12 * ny, rotulo, 'rotulo'));
        incluir(medio[0], medio[1], 8);
      }
      dibujo.append(grupo);
    }

    // La flecha que entra al estado inicial.
    const [ix, iy] = lugar(a.inicial);
    const entrada = elemento('g', { class: 'transicion inicio' });
    entrada.append(
      elemento('path', { d: `M ${fmt(ix - r - 34)} ${fmt(iy)} L ${fmt(ix - r)} ${fmt(iy)}`, class: 'arco' }),
      punta([ix - r, iy], [1, 0]),
    );
    incluir(ix - r - 38, iy);
    dibujo.append(entrada);

    // Los estados.
    for (const q of a.estados) {
      const [x, y] = lugar(q);
      const nodo = elemento('g', { class: 'estado', transform: `translate(${fmt(x)} ${fmt(y)})` });
      if (actual.has(q)) nodo.classList.add('actual');
      if (a.finales.includes(q)) nodo.classList.add('final');
      nodo.append(elemento('circle', { r, class: 'borde' }));
      if (a.finales.includes(q)) nodo.append(elemento('circle', { r: r - 4, class: 'interior' }));
      const t = elemento('text', { 'text-anchor': 'middle', dy: '0.35em' });
      t.textContent = q;
      nodo.append(t);
      incluir(x, y, r + 6);
      dibujo.append(nodo);
    }

    const margen = 6;
    const [xMin, xMax, yMin, yMax] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    dibujo.setAttribute(
      'viewBox',
      `${fmt(xMin - margen)} ${fmt(yMin - margen)} ${fmt(xMax - xMin + 2 * margen)} ${fmt(yMax - yMin + 2 * margen)}`,
    );
    // A su tamaño natural, un píxel por unidad, para que los autómatas chicos no se agranden; el CSS lo achica si no cabe.
    dibujo.style.width = `${Math.round(xMax - xMin + 2 * margen)}px`;
  }

  /** La palabra, con lo leído atenuado y el símbolo recién leído marcado. */
  function mostrarPalabra() {
    vistaPalabra.replaceChildren();
    if (lectura.simbolos.length === 0) {
      const vacia = document.createElement('span');
      vacia.className = 'actual';
      vacia.textContent = 'ε';
      vistaPalabra.append(vacia);
      return;
    }
    lectura.simbolos.forEach((s, i) => {
      const letra = document.createElement('span');
      letra.textContent = s === ' ' ? '␣' : s;
      letra.className = i < paso - 1 ? 'leido' : i === paso - 1 ? 'actual' : 'pendiente';
      if (i === lectura.fueraDelAlfabeto) letra.classList.add('fuera');
      vistaPalabra.append(letra);
    });
  }

  const conjunto = (S: readonly string[]) => escribirConjunto(automata, S);
  const comillas = (s: string) => `«${s}»`;

  /** Lo que pasa en este paso, en palabras. */
  function describir(): string {
    const a = automata;
    const determinista = esDeterminista(a);
    const n = lectura.simbolos.length;
    const actual = lectura.conjuntos[paso]!;
    const aceptacion = actual.filter((q) => a.finales.includes(q));
    let texto: string;
    if (paso === 0) {
      const inicio = lectura.conjuntos[0]!;
      if (determinista) texto = `Al comienzo, el autómata está en su estado inicial, ${a.inicial}.`;
      else if (inicio.length > 1)
        texto = `Al comienzo, los estados posibles son E({${a.inicial}}) = ${conjunto(inicio)}: el inicial y los que se alcanzan desde él por transiciones ε.`;
      else texto = `Al comienzo, el único estado posible es el inicial, ${a.inicial}.`;
      if (n === 0) {
        const acepta = lectura.acepta;
        texto += ` La palabra es la vacía, ε: el autómata no lee nada, y ${determinista ? `${a.inicial} ${acepta ? 'es' : 'no es'} un estado de aceptación` : `${acepta ? 'hay' : 'no hay'} un estado de aceptación entre los posibles`}, así que la ${acepta ? 'acepta' : 'rechaza'}.`;
      }
      return texto;
    }
    const s = lectura.simbolos[paso - 1]!;
    const antes = lectura.conjuntos[paso - 1]!;
    if (paso - 1 === lectura.fueraDelAlfabeto) {
      const sigma = `{${a.alfabeto.length > 4 ? `${a.alfabeto.slice(0, 3).join(', ')}, …, ${a.alfabeto.at(-1)}` : a.alfabeto.join(', ')}}`;
      texto = `El símbolo ${comillas(s)} no está en el alfabeto, ${sigma}: el autómata no puede leerlo, y la palabra se rechaza.`;
    } else if (antes.length === 0) {
      texto = determinista
        ? `Con ${comillas(s)}: el autómata ya estaba trabado, y sigue así.`
        : `Con ${comillas(s)}: el conjunto estaba vacío, y sigue vacío.`;
    } else if (determinista) {
      const p = antes[0]!;
      texto =
        actual.length === 0
          ? `Con ${comillas(s)}, desde ${p} no hay transición: el autómata se traba, que es lo mismo que pasar a un sumidero del que no se sale.`
          : `Con ${comillas(s)}, el autómata pasa de ${p} a δ(${p}, ${s}) = ${actual[0]}.`;
    } else if (actual.length === 0) {
      texto = `Con ${comillas(s)}, desde ${conjunto(antes)} no se llega a ningún estado: el conjunto queda vacío, y ya no se vuelve a llenar.`;
    } else {
      const directos = new Set(antes.flatMap((q) => destinos(a, q, s)));
      const conEpsilon = clausura(a, directos).size > directos.size;
      texto = `Con ${comillas(s)}, desde ${conjunto(antes)} se pasa a ${conjunto(actual)}${conEpsilon ? `, con la clausura por ε de ${conjunto([...directos])}` : ''}.`;
    }
    if (paso < n) return texto;
    if (determinista) {
      if (actual.length === 0) return `${texto} Al terminar la palabra, el autómata la rechaza.`;
      return `${texto} Al terminar la palabra, ${actual[0]} ${lectura.acepta ? 'es' : 'no es'} un estado de aceptación: el autómata la ${lectura.acepta ? 'acepta' : 'rechaza'}.`;
    }
    if (lectura.acepta)
      return `${texto} Al terminar la palabra, el conjunto contiene ${enumerar(aceptacion)}, de aceptación: algún paseo rotulado con la palabra termina en un estado de aceptación, y el autómata la acepta.`;
    return `${texto} Al terminar la palabra, ${actual.length === 0 ? 'no queda ningún estado posible' : `ningún estado de ${conjunto(actual)} es de aceptación`}: ningún paseo llega a uno, y el autómata la rechaza.`;
  }

  /** La tabla de transiciones del determinista, o la de la construcción de subconjuntos del no determinista. */
  function llenarTabla() {
    const a = automata;
    const determinista = esDeterminista(a);
    const clases = clasesDe(a);
    const columna = (s: string) => clases.findIndex((c) => c.simbolos.includes(s));
    const leido = paso > 0 && paso - 1 !== lectura.fueraDelAlfabeto ? lectura.simbolos[paso - 1]! : null;
    const clave = (S: readonly string[]) => S.join(' ');
    const actual = clave(lectura.conjuntos[paso]!);
    const antes = paso > 0 ? clave(lectura.conjuntos[paso - 1]!) : null;

    tabla.replaceChildren();
    const cabeza = tabla.createTHead().insertRow();
    for (const rotulo of [determinista ? 'δ' : 'δ′', ...clases.map((c) => c.rotulo)]) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = rotulo;
      cabeza.append(th);
    }
    const filas: { estados: string[]; nombre: string; inicial: boolean; final: boolean; celdas: string[] }[] = determinista
      ? a.estados.map((q) => ({
          estados: [q],
          nombre: q,
          inicial: q === a.inicial,
          final: a.finales.includes(q),
          celdas: clases.map((c) => [...new Set([...c.simbolos].flatMap((s) => destinos(a, q, s)))].join(' / ') || '—'),
        }))
      : subconjuntos(a).map((f, i) => ({
          estados: f.conjunto,
          nombre: conjunto(f.conjunto),
          inicial: i === 0,
          final: f.final,
          celdas: clases.map((c) => conjunto(f.transiciones[a.alfabeto.indexOf(c.simbolos[0]!)]!)),
        }));
    const cuerpo = tabla.createTBody();
    for (const fila of filas) {
      const tr = cuerpo.insertRow();
      if (clave(fila.estados) === actual) tr.classList.add('actual');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = `${fila.inicial ? '→ ' : ''}${fila.final ? '∗ ' : ''}${fila.nombre}`;
      tr.append(th);
      fila.celdas.forEach((contenido, j) => {
        const td = tr.insertCell();
        td.textContent = contenido;
        if (leido !== null && clave(fila.estados) === antes && j === columna(leido)) td.classList.add('usada');
      });
    }

    if (determinista) {
      const completo = completar(a);
      const particiones = moore(completo);
      const bloques = particiones[particiones.length - 1]!;
      const juntos = bloques.filter((b) => b.length > 1).map((b) => enumerar(b));
      const sumidero = completo !== a;
      const prefijo = sumidero ? `Completado con un sumidero, ${SUMIDERO}, que recibe las transiciones que faltan, ` : '';
      const pasos = particiones.length - 1;
      const leyenda = `En la tabla de transiciones, → marca el estado inicial${sumidero ? ', ∗ los de aceptación y — una transición que falta' : ' y ∗ los de aceptación'}. `;
      nota.textContent =
        leyenda +
        (juntos.length === 0
          ? `${prefijo}${sumidero ? 'el' : 'El'} algoritmo de Moore no junta ningún par de estados: el autómata ya es mínimo.`
          : `${prefijo}${sumidero ? 'el' : 'El'} algoritmo de Moore junta ${juntos.join('; ')}, en ${pasos} ${pasos === 1 ? 'paso' : 'pasos'}: el autómata mínimo tiene ${bloques.length} estados${sumidero ? ', contando el sumidero' : ''}.`);
    } else {
      const n = a.estados.length;
      const conVacio = filas.some((f) => f.estados.length === 0);
      nota.textContent =
        `La tabla es la de la construcción de subconjuntos: cada conjunto que se alcanza es un estado del autómata determinista; → marca el inicial, y ∗ los de aceptación. ` +
        `De los ${potenciaDeDos(n)} = ${2 ** n} subconjuntos de los estados, la construcción alcanza ${filas.length}${conVacio ? ', incluido el vacío, que es un sumidero' : ''}.`;
    }
  }

  function actualizar() {
    const n = lectura.simbolos.length;
    eleccion.value = automata.clave;
    if (campo.value !== palabra) campo.value = palabra;
    dibujar();
    mostrarPalabra();
    llenarTabla();
    const descripcion = describir();
    salida.textContent = descripcion;
    contador.textContent = `${paso} de ${n} ${n === 1 ? 'símbolo leído' : 'símbolos leídos'}`;
    alComienzo.disabled = anterior.disabled = paso === 0;
    alFinal.disabled = siguiente.disabled = paso === n;
    dibujo.setAttribute(
      'aria-label',
      `${alt} Ahora: ${automata.titulo}, la palabra ${palabra === '' ? 'vacía' : comillas(palabra)}, con ${paso} de ${n} símbolos leídos. ${descripcion}`,
    );
  }

  const ir = (nuevo: number) => {
    paso = Math.max(0, Math.min(lectura.simbolos.length, nuevo));
    actualizar();
  };
  const alElegir = () => {
    automata = AUTOMATAS_DEL_CAPITULO.find((a) => a.clave === eleccion.value) ?? automata;
    palabra = automata.palabra;
    lectura = leer(automata, palabra);
    ir(0);
  };
  const alEscribir = () => {
    palabra = campo.value;
    lectura = leer(automata, palabra);
    ir(lectura.simbolos.length);
  };
  const alComenzar = () => ir(0);
  const alRetroceder = () => ir(paso - 1);
  const alAvanzar = () => ir(paso + 1);
  const alTerminar = () => ir(lectura.simbolos.length);
  eleccion.addEventListener('change', alElegir);
  campo.addEventListener('input', alEscribir);
  alComienzo.addEventListener('click', alComenzar);
  anterior.addEventListener('click', alRetroceder);
  siguiente.addEventListener('click', alAvanzar);
  alFinal.addEventListener('click', alTerminar);
  actualizar();
  return () => {
    eleccion.removeEventListener('change', alElegir);
    campo.removeEventListener('input', alEscribir);
    alComienzo.removeEventListener('click', alComenzar);
    anterior.removeEventListener('click', alRetroceder);
    siguiente.removeEventListener('click', alAvanzar);
    alFinal.removeEventListener('click', alTerminar);
  };
}
