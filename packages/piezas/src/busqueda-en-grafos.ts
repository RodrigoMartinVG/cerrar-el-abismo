import {
  buscar,
  caminoHasta,
  distanciasDesde,
  elecciones,
  GRAFO_DEL_CAPITULO,
  juzgarHeuristica,
  type AristaConPeso,
  type Busqueda,
  type GrafoConPesos,
  type PasoDeBusqueda,
} from './busqueda.ts';

/**
 * PIEZA «busqueda-en-grafos» (I.6). El grafo con pesos de los ejemplos del capítulo, dibujado en su cuadrícula, y una
 * búsqueda que avanza paso a paso: el recorrido en anchura, el algoritmo de Dijkstra o A*, con la distancia de
 * Manhattan como heurística. Cada vértice muestra su d (y en A*, su h); los elegidos se rellenan, el del paso actual se
 * marca en cobre, y las aristas de las que sale cada d forman el árbol de la búsqueda. Al llegar, el camino encontrado
 * se marca, y la lectura lo compara con la distancia verdadera.
 *
 * Los pesos se cambian eligiendo una arista (en la lista o con un clic en su peso), y las aristas se pueden quitar o
 * poner, también dos que el grafo del capítulo no tiene. Un clic en un vértice lo hace origen, y el siguiente,
 * destino. Atributos opcionales: `data-busqueda` («anchura», «dijkstra» o «a-estrella»), `data-origen` y
 * `data-destino` (nombres de vértices) y `data-paso` (un número, o «final»).
 */

/** Las aristas que se pueden poner: las del capítulo y dos más, a–b y b–t, que empiezan quitadas. */
const POSIBLES: readonly (AristaConPeso & { inicial: boolean })[] = [
  ...GRAFO_DEL_CAPITULO.aristas.map((a) => ({ ...a, inicial: true })),
  { u: 2, v: 3, peso: 2, inicial: false },
  { u: 3, v: 6, peso: 4, inicial: false },
];
const PESO_MAXIMO = 20;
const NOMBRES: Record<Busqueda, string> = { anchura: 'El recorrido en anchura', dijkstra: 'Dijkstra', 'a-estrella': 'A*' };

const numero = (x: number) => (Number.isFinite(x) ? String(x) : '∞');
/** «z», «z y a», «z, a y b». */
const enumerar = (nombres: string[]) =>
  nombres.length <= 1 ? (nombres[0] ?? '') : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  const vertices = GRAFO_DEL_CAPITULO.vertices;
  const porNombre = (nombre: string | undefined, respaldo: string) => {
    const i = vertices.findIndex((v) => v.nombre === nombre);
    return i >= 0 ? i : vertices.findIndex((v) => v.nombre === respaldo);
  };
  let busqueda: Busqueda =
    (['anchura', 'dijkstra', 'a-estrella'] as const).find((b) => b === raiz.dataset['busqueda']) ?? 'dijkstra';
  let origen = porNombre(raiz.dataset['origen'], 's');
  let destino = porNombre(raiz.dataset['destino'], 't');
  const pesos = POSIBLES.map((a) => a.peso);
  const presentes = POSIBLES.map((a) => a.inicial);
  let editada = 0;
  let siguienteClic: 'origen' | 'destino' = 'origen';
  const pasoInicial = raiz.dataset['paso'];
  let paso = 0;
  let pasos: PasoDeBusqueda[] = [];
  /** El índice en POSIBLES de cada arista del grafo actual. */
  let deGrafo: number[] = [];
  let grafo: GrafoConPesos = GRAFO_DEL_CAPITULO;
  raiz.textContent = '';
  const SVG = 'http://www.w3.org/2000/svg';

  // El dibujo.
  const dibujo = document.createElementNS(SVG, 'svg');
  dibujo.setAttribute('role', 'img');
  dibujo.classList.add('pieza-grafo');
  const ESCALA = 84;
  const xs = vertices.map((v) => v.x);
  const ys = vertices.map((v) => v.y);
  const margen = 58;
  const [xMin, xMax, yMin, yMax] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  dibujo.setAttribute(
    'viewBox',
    `${xMin * ESCALA - margen} ${-yMax * ESCALA - margen} ${(xMax - xMin) * ESCALA + 2 * margen} ${(yMax - yMin) * ESCALA + 2 * margen}`,
  );
  const lugar = (v: number): [number, number] => [vertices[v]!.x * ESCALA, -vertices[v]!.y * ESCALA];

  // Los controles de la búsqueda.
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const lista = (texto: string, opciones: readonly [string, string][]) => {
    const etiqueta = document.createElement('label');
    const eleccion = document.createElement('select');
    for (const [valor, rotulo] of opciones) {
      const opcion = document.createElement('option');
      opcion.value = valor;
      opcion.textContent = rotulo;
      eleccion.append(opcion);
    }
    etiqueta.append(`${texto} `, eleccion);
    controles.append(etiqueta);
    return eleccion;
  };
  const eleccionBusqueda = lista('Búsqueda', [
    ['anchura', 'en anchura'],
    ['dijkstra', 'Dijkstra'],
    ['a-estrella', 'A*'],
  ]);
  const deVertices = vertices.map((v, i): [string, string] => [String(i), v.nombre]);
  const eleccionOrigen = lista('Origen', deVertices);
  const eleccionDestino = lista('Destino', deVertices);

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
  const anterior = boton('◀', 'Paso anterior');
  const siguiente = boton('▶', 'Paso siguiente');
  const alFinal = boton('⏭', 'Al final');
  const contador = document.createElement('span');
  contador.className = 'pieza-valor';
  botones.append(contador);

  // El editor de aristas.
  const editor = document.createElement('div');
  editor.className = 'pieza-controles not-content';
  const etiquetaArista = document.createElement('label');
  const eleccionArista = document.createElement('select');
  etiquetaArista.append('Arista ', eleccionArista);
  const etiquetaPeso = document.createElement('label');
  const campoPeso = document.createElement('input');
  Object.assign(campoPeso, { type: 'number', min: '0', max: String(PESO_MAXIMO), step: '1' });
  campoPeso.style.width = '4.5em';
  etiquetaPeso.append('peso ', campoPeso);
  const etiquetaPresente = document.createElement('label');
  const casilla = document.createElement('input');
  casilla.type = 'checkbox';
  etiquetaPresente.append(casilla, ' está en el grafo');
  const restaurar = document.createElement('button');
  restaurar.type = 'button';
  restaurar.textContent = 'Restaurar el grafo';
  editor.append(etiquetaArista, etiquetaPeso, etiquetaPresente, restaurar);

  const tabla = document.createElement('table');
  tabla.className = 'pieza-matriz pieza-tabla-grafo not-content';
  const marcoDeTabla = document.createElement('div');
  marcoDeTabla.style.overflowX = 'auto';
  marcoDeTabla.append(tabla);
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  const juicio = document.createElement('p');
  juicio.className = 'pieza-lectura';
  raiz.append(dibujo, controles, botones, editor, marcoDeTabla, lectura, juicio);

  const nombre = (v: number) => vertices[v]!.nombre;
  const rotuloDeArista = (i: number) => `${nombre(POSIBLES[i]!.u)}–${nombre(POSIBLES[i]!.v)}`;

  function llenarAristas() {
    eleccionArista.replaceChildren(
      ...POSIBLES.map((_, i) => {
        const opcion = document.createElement('option');
        opcion.value = String(i);
        opcion.textContent = presentes[i] ? rotuloDeArista(i) : `${rotuloDeArista(i)} (quitada)`;
        return opcion;
      }),
    );
    eleccionArista.value = String(editada);
    campoPeso.value = String(pesos[editada]);
    casilla.checked = presentes[editada]!;
  }

  /** Rehace el grafo y la búsqueda; `irA` dice en qué paso quedar. */
  function calcular(irA: 'mismo' | 'comienzo' | 'final') {
    deGrafo = POSIBLES.flatMap((_, i) => (presentes[i] ? [i] : []));
    grafo = { vertices, aristas: deGrafo.map((i) => ({ u: POSIBLES[i]!.u, v: POSIBLES[i]!.v, peso: pesos[i]! })) };
    pasos = buscar(grafo, busqueda, origen, destino);
    if (irA === 'comienzo') paso = 0;
    else if (irA === 'final') paso = pasos.length - 1;
    else paso = Math.min(paso, pasos.length - 1);
    dibujar();
  }

  /** El largo, con los pesos, de un camino dado por sus vértices. */
  function largo(camino: number[]) {
    let total = 0;
    for (let k = 1; k < camino.length; k++) {
      const [p, q] = [camino[k - 1]!, camino[k]!];
      total += Math.min(...grafo.aristas.filter((a) => (a.u === p && a.v === q) || (a.u === q && a.v === p)).map((a) => a.peso));
    }
    return total;
  }

  function describir(actual: PasoDeBusqueda): string {
    const h = busqueda === 'a-estrella' ? juzgarHeuristica(grafo, destino).h : vertices.map(() => 0);
    const s = nombre(origen);
    const t = nombre(destino);
    if (origen === destino)
      return `El origen y el destino son el mismo vértice: la búsqueda lo elige en el primer paso, con d = 0.`;
    if (actual.elegido === null && actual.final === null) {
      const comienzo = `Al comienzo, d(${s}) = 0 y los demás vértices tienen d = ∞.`;
      if (busqueda === 'anchura')
        return `${comienzo} La cola tiene solo a ${s}. El recorrido en anchura no mira los pesos: cada arista cuenta 1.`;
      if (busqueda === 'dijkstra') return `${comienzo} Ningún vértice está terminado.`;
      return `${comienzo} Solo ${s} está abierto, con prioridad d(${s}) + h(${s}) = 0 + ${h[origen]} = ${h[origen]}; h es la distancia de Manhattan hasta ${t} en la cuadrícula.`;
    }
    if (actual.final === 'inalcanzable') return `No quedan vértices por elegir: ${t} no se alcanza desde ${s}.`;
    const u = actual.elegido!;
    const du = actual.d[u]!;
    let eleccion: string;
    if (busqueda === 'anchura')
      eleccion = `El recorrido en anchura saca del frente de la cola el vértice ${nombre(u)}, con d(${nombre(u)}) = ${du}`;
    else if (busqueda === 'dijkstra')
      eleccion = `Dijkstra elige ${nombre(u)}, el no terminado de menor d, con d(${nombre(u)}) = ${du}`;
    else
      eleccion = `A* elige ${nombre(u)}, el abierto de menor prioridad, d(${nombre(u)}) + h(${nombre(u)}) = ${du} + ${h[u]} = ${du + h[u]!}`;

    if (actual.final === 'llego') {
      const camino = caminoHasta(actual, destino);
      const texto = camino.map(nombre).join(', ');
      const cuantos = elecciones(pasos);
      const fin = `${eleccion}: es el destino, y la búsqueda termina después de ${cuantos} ${cuantos === 1 ? 'elección' : 'elecciones'}.`;
      const delta = distanciasDesde(grafo, origen)[destino]!;
      if (busqueda === 'anchura') {
        return `${fin} El camino ${texto} tiene ${du} ${du === 1 ? 'arista' : 'aristas'}, la menor cantidad posible; con los pesos mide ${largo(camino)}, y el más corto mide ${delta}.`;
      }
      if (busqueda === 'dijkstra')
        return `${fin} El camino ${texto} mide ${du}, que es δ(${s}, ${t}), como asegura el teorema de Dijkstra.`;
      const dijkstra = elecciones(buscar(grafo, 'dijkstra', origen, destino));
      if (du === delta)
        return `${fin} El camino ${texto} mide ${du}, que es δ(${s}, ${t}). Dijkstra, con el mismo grafo, hace ${dijkstra} elecciones.`;
      return `${fin} El camino ${texto} mide ${du}, pero δ(${s}, ${t}) = ${delta}: A* devolvió un camino que no es mínimo.`;
    }

    const cambios = actual.examinadas;
    if (busqueda === 'anchura') {
      const nuevos = cambios.map((e) => nombre(e.hacia));
      const cola = actual.frontera.map(nombre).join(', ') || 'vacía';
      return nuevos.length === 0
        ? `${eleccion}; no tiene vecinos sin ver. Cola: ${cola}.`
        : `${eleccion}, y agrega al fondo ${nuevos.length === 1 ? 'su vecino sin ver' : 'sus vecinos sin ver'}, ${enumerar(nuevos)}, con d = ${du + 1}. Cola: ${cola}.`;
    }
    const partes = cambios.map((e) => {
      const w = nombre(e.hacia);
      if (e.despues < e.antes) {
        const reabre =
          busqueda === 'a-estrella' && pasos.slice(0, paso).some((p) => p.elegido === e.hacia) ? `, y ${w} vuelve a abrirse` : '';
        return `d(${w}) baja de ${numero(e.antes)} a ${e.despues}${reabre}`;
      }
      return `d(${w}) se queda en ${numero(e.antes)}`;
    });
    const cuales = busqueda === 'dijkstra' ? 'sus aristas hacia vértices no terminados' : 'todas sus aristas';
    if (partes.length === 0) return `${eleccion}. No tiene aristas hacia vértices no terminados.`;
    const enumeracion = partes.length === 1 ? partes[0] : `${partes.slice(0, -1).join('; ')}; y ${partes[partes.length - 1]}`;
    return `${eleccion}. Relaja ${cuales}: ${enumeracion}.`;
  }

  function dibujar() {
    const actual = pasos[paso]!;
    const terminado = actual.final === 'llego';
    const camino = terminado ? caminoHasta(actual, destino) : [];
    const enCamino = new Set(camino.slice(1).map((v, k) => `${Math.min(v, camino[k]!)}-${Math.max(v, camino[k]!)}`));
    const clave = (u: number, v: number) => `${Math.min(u, v)}-${Math.max(u, v)}`;
    const delArbol = new Set(actual.previo.flatMap((p, v) => (p === null ? [] : [clave(p, v)])));
    const examinadas = new Set(actual.examinadas.map((e) => grafo.aristas[e.arista]!).map((a) => clave(a.u, a.v)));
    const h = busqueda === 'a-estrella' ? juzgarHeuristica(grafo, destino).h : null;

    dibujo.replaceChildren();
    const capaAristas = document.createElementNS(SVG, 'g');
    const capaPesos = document.createElementNS(SVG, 'g');
    const capaVertices = document.createElementNS(SVG, 'g');
    dibujo.append(capaAristas, capaPesos, capaVertices);

    POSIBLES.forEach((a, i) => {
      const [x1, y1] = lugar(a.u);
      const [x2, y2] = lugar(a.v);
      const linea = document.createElementNS(SVG, 'line');
      linea.classList.add('arista');
      const k = clave(a.u, a.v);
      if (!presentes[i]) linea.classList.add('ausente');
      else if (enCamino.has(k)) linea.classList.add('camino');
      else if (examinadas.has(k)) linea.classList.add('examinada');
      else if (delArbol.has(k)) linea.classList.add('arbol');
      linea.setAttribute('x1', String(x1));
      linea.setAttribute('y1', String(y1));
      linea.setAttribute('x2', String(x2));
      linea.setAttribute('y2', String(y2));
      capaAristas.append(linea);

      const marca = document.createElementNS(SVG, 'g');
      marca.classList.add('peso');
      if (i === editada) marca.classList.add('editada');
      if (busqueda === 'anchura' || !presentes[i]) marca.classList.add('ignorado');
      marca.dataset['arista'] = String(i);
      marca.setAttribute('transform', `translate(${(x1 + x2) / 2} ${(y1 + y2) / 2})`);
      const caja = document.createElementNS(SVG, 'rect');
      Object.entries({ x: '-11', y: '-9', width: '22', height: '18', rx: '4' }).forEach(([c, v]) => caja.setAttribute(c, v));
      const texto = document.createElementNS(SVG, 'text');
      texto.setAttribute('text-anchor', 'middle');
      texto.setAttribute('dy', '0.35em');
      texto.textContent = String(pesos[i]);
      marca.append(caja, texto);
      capaPesos.append(marca);
    });

    vertices.forEach((v, i) => {
      const [x, y] = lugar(i);
      const nodo = document.createElementNS(SVG, 'g');
      nodo.classList.add('vertice');
      if (actual.estado[i] === 'abierto') nodo.classList.add('abierto');
      if (actual.estado[i] === 'elegido') nodo.classList.add('elegido');
      if (actual.elegido === i) nodo.classList.add('actual');
      nodo.dataset['vertice'] = String(i);
      nodo.setAttribute('transform', `translate(${x} ${y})`);
      if (i === origen || i === destino) {
        const anillo = document.createElementNS(SVG, 'circle');
        anillo.classList.add('anillo');
        anillo.setAttribute('r', '21');
        nodo.append(anillo);
      }
      const circulo = document.createElementNS(SVG, 'circle');
      circulo.setAttribute('r', '16');
      const rotulo = document.createElementNS(SVG, 'text');
      rotulo.setAttribute('text-anchor', 'middle');
      rotulo.setAttribute('dy', '0.35em');
      rotulo.textContent = v.nombre;
      nodo.append(circulo, rotulo);
      // Los valores van del lado de afuera del dibujo, para no tapar las aristas; en A*, h debajo de d.
      const abajo = v.y === yMin || (v.y !== yMax && v.y * 2 < yMin + yMax);
      const lineas = h ? [`d ${numero(actual.d[i]!)}`, `h ${h[i]}`] : [`d ${numero(actual.d[i]!)}`];
      lineas.forEach((linea, k) => {
        const valor = document.createElementNS(SVG, 'text');
        valor.classList.add('valor');
        valor.setAttribute('text-anchor', 'middle');
        const desde = abajo ? 37 + 14 * k : -30 - 14 * (lineas.length - 1 - k);
        valor.setAttribute('y', String(desde));
        valor.textContent = linea;
        nodo.append(valor);
      });
      capaVertices.append(nodo);
    });

    // La tabla: una fila por vértice, angosta para que quepa en un teléfono.
    const estados = {
      anchura: { 'sin-ver': 'sin ver', abierto: 'en la cola', elegido: 'sacado' },
      dijkstra: { 'sin-ver': '—', abierto: 'abierto', elegido: 'terminado' },
      'a-estrella': { 'sin-ver': '—', abierto: 'abierto', elegido: 'cerrado' },
    }[busqueda];
    const columnas = h ? ['vértice', 'd', 'h', 'd + h', 'viene de', 'estado'] : ['vértice', 'd', 'viene de', 'estado'];
    tabla.replaceChildren();
    const cabeza = tabla.createTHead().insertRow();
    for (const c of columnas) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = c;
      cabeza.append(th);
    }
    const cuerpo = tabla.createTBody();
    vertices.forEach((v, i) => {
      const tr = cuerpo.insertRow();
      if (actual.elegido === i) tr.classList.add('actual');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = v.nombre;
      tr.append(th);
      const d = actual.d[i]!;
      const previo = actual.previo[i] ?? null;
      const valores = [numero(d), ...(h ? [String(h[i]), numero(d + h[i]!)] : []), previo === null ? '—' : nombre(previo)];
      for (const valor of [...valores, estados[actual.estado[i]!]]) tr.insertCell().textContent = valor;
    });

    contador.textContent = `paso ${paso} de ${pasos.length - 1}`;
    alComienzo.disabled = anterior.disabled = paso === 0;
    alFinal.disabled = siguiente.disabled = paso === pasos.length - 1;
    eleccionBusqueda.value = busqueda;
    eleccionOrigen.value = String(origen);
    eleccionDestino.value = String(destino);
    llenarAristas();
    lectura.textContent = describir(actual);

    if (busqueda === 'a-estrella') {
      const j = juzgarHeuristica(grafo, destino);
      const t = nombre(destino);
      if (j.sobreestima !== null) {
        const v = nombre(j.sobreestima);
        juicio.textContent = `La heurística no es admisible: h(${v}) = ${j.h[j.sobreestima]} es mayor que δ(${v}, ${t}) = ${numero(j.exactas[j.sobreestima]!)}.`;
      } else if (j.inconsistente !== null) {
        const [u, v] = [nombre(j.inconsistente.u), nombre(j.inconsistente.v)];
        juicio.textContent = `La heurística es admisible, pero no consistente: h(${u}) es mayor que el peso de ${u}–${v} más h(${v}).`;
      } else
        juicio.textContent = `La heurística es admisible, y además consistente: cada peso es por lo menos la diferencia de las h de sus extremos.`;
      juicio.hidden = false;
    } else juicio.hidden = true;

    const nombreBusqueda = NOMBRES[busqueda];
    dibujo.setAttribute(
      'aria-label',
      `${alt} Ahora: ${nombreBusqueda}, de ${nombre(origen)} a ${nombre(destino)}, paso ${paso} de ${pasos.length - 1}.`,
    );
  }

  const alCambiarBusqueda = () => {
    busqueda = eleccionBusqueda.value as Busqueda;
    calcular('comienzo');
  };
  const alCambiarOrigen = () => {
    origen = Number(eleccionOrigen.value);
    calcular('comienzo');
  };
  const alCambiarDestino = () => {
    destino = Number(eleccionDestino.value);
    calcular('comienzo');
  };
  const ir = (nuevo: number) => {
    paso = Math.max(0, Math.min(pasos.length - 1, nuevo));
    dibujar();
  };
  const alComenzar = () => ir(0);
  const alRetroceder = () => ir(paso - 1);
  const alAvanzar = () => ir(paso + 1);
  const alTerminar = () => ir(pasos.length - 1);
  const alElegirArista = () => {
    editada = Number(eleccionArista.value);
    dibujar();
  };
  const alCambiarPeso = () => {
    const valor = Math.round(Number(campoPeso.value));
    if (!Number.isFinite(valor) || campoPeso.value.trim() === '') return;
    pesos[editada] = Math.max(0, Math.min(PESO_MAXIMO, valor));
    calcular('mismo');
  };
  const alPonerOQuitar = () => {
    presentes[editada] = casilla.checked;
    calcular('mismo');
  };
  const alRestaurar = () => {
    POSIBLES.forEach((a, i) => {
      pesos[i] = a.peso;
      presentes[i] = a.inicial;
    });
    calcular('comienzo');
  };
  const alTocar = (evento: Event) => {
    const objetivo = evento.target as Element;
    const marca = objetivo.closest<SVGGElement>('.peso');
    if (marca) {
      editada = Number(marca.dataset['arista']);
      dibujar();
      campoPeso.focus();
      return;
    }
    const nodo = objetivo.closest<SVGGElement>('.vertice');
    if (!nodo) return;
    const v = Number(nodo.dataset['vertice']);
    if (siguienteClic === 'origen') origen = v;
    else destino = v;
    siguienteClic = siguienteClic === 'origen' ? 'destino' : 'origen';
    calcular('comienzo');
  };

  eleccionBusqueda.addEventListener('change', alCambiarBusqueda);
  eleccionOrigen.addEventListener('change', alCambiarOrigen);
  eleccionDestino.addEventListener('change', alCambiarDestino);
  alComienzo.addEventListener('click', alComenzar);
  anterior.addEventListener('click', alRetroceder);
  siguiente.addEventListener('click', alAvanzar);
  alFinal.addEventListener('click', alTerminar);
  eleccionArista.addEventListener('change', alElegirArista);
  campoPeso.addEventListener('input', alCambiarPeso);
  casilla.addEventListener('change', alPonerOQuitar);
  restaurar.addEventListener('click', alRestaurar);
  dibujo.addEventListener('click', alTocar);

  calcular('comienzo');
  if (pasoInicial === 'final') ir(pasos.length - 1);
  else if (pasoInicial !== undefined && Number.isFinite(Number(pasoInicial))) ir(Number(pasoInicial));

  return () => {
    eleccionBusqueda.removeEventListener('change', alCambiarBusqueda);
    eleccionOrigen.removeEventListener('change', alCambiarOrigen);
    eleccionDestino.removeEventListener('change', alCambiarDestino);
    alComienzo.removeEventListener('click', alComenzar);
    anterior.removeEventListener('click', alRetroceder);
    siguiente.removeEventListener('click', alAvanzar);
    alFinal.removeEventListener('click', alTerminar);
    eleccionArista.removeEventListener('change', alElegirArista);
    campoPeso.removeEventListener('input', alCambiarPeso);
    casilla.removeEventListener('change', alPonerOQuitar);
    restaurar.removeEventListener('click', alRestaurar);
    dibujo.removeEventListener('click', alTocar);
  };
}
