/**
 * LA BÚSQUEDA EN UN GRAFO CON PESOS (I.6): el recorrido en anchura, el algoritmo de Dijkstra y A*, paso a paso, tal
 * como los describe el capítulo. Cada paso elige un vértice y examina sus aristas; la pieza «busqueda-en-grafos» los
 * muestra uno por uno. Los vértices tienen un lugar en una cuadrícula, y la heurística de A* es la distancia de
 * Manhattan hasta el destino, contada en esa cuadrícula.
 *
 * Las tres búsquedas se detienen al elegir el destino. Los empates se resuelven como en la celda de A* del capítulo:
 * a igual prioridad, primero el vértice de mayor d, y si siguen empatados, el que aparece antes en la lista.
 */

export interface VerticeEnLaCuadricula {
  nombre: string;
  x: number;
  y: number;
}

/** Una arista entre los vértices de índices `u` y `v`, con su peso, que es un número no negativo. */
export interface AristaConPeso {
  u: number;
  v: number;
  peso: number;
}

export interface GrafoConPesos {
  vertices: readonly VerticeEnLaCuadricula[];
  aristas: readonly AristaConPeso[];
}

export type Busqueda = 'anchura' | 'dijkstra' | 'a-estrella';

/** Sin ver: d infinito. Abierto: d finito, a la espera de ser elegido. Elegido: terminado, o cerrado en A*. */
export type EstadoDelVertice = 'sin-ver' | 'abierto' | 'elegido';

/** Lo que pasó al examinar una arista desde el vértice elegido: el d del otro extremo antes y después. */
export interface Examen {
  arista: number;
  hacia: number;
  antes: number;
  despues: number;
}

export interface PasoDeBusqueda {
  /** El vértice elegido en este paso; `null` en el estado inicial. */
  elegido: number | null;
  d: number[];
  /** El vértice desde el que se obtuvo el d de cada uno, o `null`. */
  previo: (number | null)[];
  estado: EstadoDelVertice[];
  examinadas: Examen[];
  /** La cola del recorrido en anchura, en orden, o los abiertos de Dijkstra y A*, por prioridad. */
  frontera: number[];
  /** «llego» si eligió el destino; «inalcanzable» si no queda nada que elegir. */
  final: 'llego' | 'inalcanzable' | null;
}

/**
 * El grafo de la figura y de los ejemplos del capítulo: siete vértices en una cuadrícula de 6 × 3, y pesos que no son
 * menores que la distancia de Manhattan entre los extremos, para que esa distancia sea una heurística admisible.
 */
export const GRAFO_DEL_CAPITULO: GrafoConPesos = {
  vertices: [
    { nombre: 'z', x: 0, y: 1 },
    { nombre: 's', x: 1, y: 1 },
    { nombre: 'a', x: 2, y: 2 },
    { nombre: 'b', x: 2, y: 0 },
    { nombre: 'c', x: 3, y: 1 },
    { nombre: 'd', x: 4, y: 2 },
    { nombre: 't', x: 5, y: 1 },
  ],
  aristas: [
    { u: 0, v: 1, peso: 5 },
    { u: 1, v: 2, peso: 6 },
    { u: 1, v: 3, peso: 2 },
    { u: 2, v: 4, peso: 3 },
    { u: 2, v: 5, peso: 4 },
    { u: 3, v: 4, peso: 2 },
    { u: 4, v: 5, peso: 3 },
    { u: 4, v: 6, peso: 6 },
    { u: 5, v: 6, peso: 2 },
  ],
};

/** Los vecinos de `v`, en el orden de la lista de vértices, con la arista que los une. */
export function vecinosDe(g: GrafoConPesos, v: number): { w: number; arista: number }[] {
  const lista: { w: number; arista: number }[] = [];
  g.aristas.forEach((a, i) => {
    if (a.u === v) lista.push({ w: a.v, arista: i });
    else if (a.v === v) lista.push({ w: a.u, arista: i });
  });
  return lista.sort((p, q) => p.w - q.w || p.arista - q.arista);
}

/** La distancia de Manhattan en la cuadrícula entre dos vértices. */
export function manhattan(g: GrafoConPesos, v: number, w: number): number {
  const p = g.vertices[v]!;
  const q = g.vertices[w]!;
  return Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
}

/** La heurística de A*: la distancia de Manhattan de cada vértice hasta el destino. */
export function heuristicaHasta(g: GrafoConPesos, destino: number): number[] {
  return g.vertices.map((_, v) => manhattan(g, v, destino));
}

/** La prioridad de cada búsqueda y su desempate: menor d + h, después mayor d, después el primero de la lista. */
function antes(d: number[], h: number[]) {
  return (p: number, q: number) => d[p]! + h[p]! - (d[q]! + h[q]!) || d[q]! - d[p]! || p - q;
}

/** Todos los pasos de una búsqueda desde `origen` hasta `destino`, empezando por el estado inicial. */
export function buscar(g: GrafoConPesos, busqueda: Busqueda, origen: number, destino: number): PasoDeBusqueda[] {
  const n = g.vertices.length;
  const h = busqueda === 'a-estrella' ? heuristicaHasta(g, destino) : new Array<number>(n).fill(0);
  const d = new Array<number>(n).fill(Infinity);
  const previo = new Array<number | null>(n).fill(null);
  const estado = new Array<EstadoDelVertice>(n).fill('sin-ver');
  const cola: number[] = [origen];
  d[origen] = 0;
  estado[origen] = 'abierto';

  const frontera = () =>
    busqueda === 'anchura'
      ? [...cola]
      : estado
          .map((e, v) => (e === 'abierto' ? v : -1))
          .filter((v) => v >= 0)
          .sort(antes(d, h));
  const foto = (elegido: number | null, examinadas: Examen[], final: PasoDeBusqueda['final']): PasoDeBusqueda => ({
    elegido,
    d: [...d],
    previo: [...previo],
    estado: [...estado],
    examinadas,
    frontera: frontera(),
    final,
  });

  const pasos = [foto(null, [], null)];
  // Cada vértice se elige a lo sumo una vez en anchura y en Dijkstra; en A* puede volver a abrirse, y la cota solo
  // protege de un error de programación.
  for (let vuelta = 0; vuelta < n * n + 1; vuelta++) {
    const candidatos = frontera();
    if (candidatos.length === 0) {
      pasos.push(foto(null, [], 'inalcanzable'));
      break;
    }
    const u = candidatos[0]!;
    if (busqueda === 'anchura') cola.shift();
    estado[u] = 'elegido';
    if (u === destino) {
      pasos.push(foto(u, [], 'llego'));
      break;
    }
    const examinadas: Examen[] = [];
    for (const { w, arista } of vecinosDe(g, u)) {
      if (busqueda === 'anchura') {
        if (estado[w] !== 'sin-ver') continue;
        examinadas.push({ arista, hacia: w, antes: d[w]!, despues: d[u]! + 1 });
        d[w] = d[u]! + 1;
        previo[w] = u;
        estado[w] = 'abierto';
        cola.push(w);
        continue;
      }
      if (busqueda === 'dijkstra' && estado[w] === 'elegido') continue;
      const nuevo = d[u]! + g.aristas[arista]!.peso;
      examinadas.push({ arista, hacia: w, antes: d[w]!, despues: Math.min(d[w]!, nuevo) });
      if (nuevo < d[w]!) {
        d[w] = nuevo;
        previo[w] = u;
        estado[w] = 'abierto';
      }
    }
    pasos.push(foto(u, examinadas, null));
  }
  return pasos;
}

/** Las distancias exactas desde `origen`, con Dijkstra sin destino: la referencia para juzgar a A*. */
export function distanciasDesde(g: GrafoConPesos, origen: number): number[] {
  const pasos = buscar(g, 'dijkstra', origen, -1);
  return pasos[pasos.length - 1]!.d;
}

/** El camino que dejan los previos, del origen hasta `v`, o vacío si `v` no se alcanzó. */
export function caminoHasta(paso: PasoDeBusqueda, v: number): number[] {
  if (!Number.isFinite(paso.d[v]!)) return [];
  const camino = [v];
  let actual = v;
  while (paso.previo[actual] !== null && camino.length <= paso.d.length) {
    actual = paso.previo[actual]!;
    camino.unshift(actual);
  }
  return camino;
}

export interface JuicioDeLaHeuristica {
  h: number[];
  /** δ(v, t) para cada v. */
  exactas: number[];
  /** Un vértice donde h sobreestima, si lo hay: entonces no es admisible. */
  sobreestima: number | null;
  /** Una arista uv con h(u) > w(uv) + h(v) en algún sentido, si la hay: entonces no es consistente. */
  inconsistente: { u: number; v: number } | null;
}

/** Juzga la heurística de Manhattan hasta `destino` en el grafo dado: si es admisible y si es consistente. */
export function juzgarHeuristica(g: GrafoConPesos, destino: number): JuicioDeLaHeuristica {
  const h = heuristicaHasta(g, destino);
  const exactas = distanciasDesde(g, destino);
  const sobreestima = h.findIndex((hv, v) => hv > exactas[v]!);
  let inconsistente: { u: number; v: number } | null = null;
  for (const { u, v, peso } of g.aristas) {
    if (h[u]! > peso + h[v]!) inconsistente ??= { u, v };
    else if (h[v]! > peso + h[u]!) inconsistente ??= { u: v, v: u };
  }
  return { h, exactas, sobreestima: sobreestima >= 0 ? sobreestima : null, inconsistente };
}

/** Cuántos pasos de una búsqueda eligieron un vértice (contando las veces que A* elige otra vez uno reabierto). */
export function elecciones(pasos: readonly PasoDeBusqueda[]): number {
  return pasos.filter((p) => p.elegido !== null).length;
}
