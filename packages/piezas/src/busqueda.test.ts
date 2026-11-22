import { describe, expect, it } from 'vitest';
import {
  buscar,
  caminoHasta,
  distanciasDesde,
  elecciones,
  GRAFO_DEL_CAPITULO,
  juzgarHeuristica,
  type GrafoConPesos,
  type PasoDeBusqueda,
} from './busqueda.ts';

const G = GRAFO_DEL_CAPITULO;
const indice = (nombre: string) => G.vertices.findIndex((v) => v.nombre === nombre);
const nombres = (g: GrafoConPesos, vs: readonly (number | null)[]) => vs.map((v) => (v === null ? '—' : g.vertices[v]!.nombre));
const elegidos = (g: GrafoConPesos, pasos: readonly PasoDeBusqueda[]) =>
  nombres(
    g,
    pasos.flatMap((p) => (p.elegido === null ? [] : [p.elegido])),
  ).join('');
const S = indice('s');
const T = indice('t');

/** Las distancias exactas por fuerza bruta (Floyd y Warshall), para comparar. */
function floyd(g: GrafoConPesos, unitarios = false): number[][] {
  const n = g.vertices.length;
  const m = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const { u, v, peso } of g.aristas) {
    const w = unitarios ? 1 : peso;
    m[u]![v] = Math.min(m[u]![v]!, w);
    m[v]![u] = Math.min(m[v]![u]!, w);
  }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) m[i]![j] = Math.min(m[i]![j]!, m[i]![k]! + m[k]![j]!);
  return m;
}

/** Un generador con semilla (mulberry32), para que las pruebas al azar sean siempre las mismas. */
function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un grafo al azar en una cuadrícula, con pesos que no bajan de la distancia de Manhattan si `admisible`. */
function grafoAlAzar(r: () => number, admisible: boolean): GrafoConPesos {
  const n = 2 + Math.floor(r() * 8);
  const vertices = Array.from({ length: n }, (_, i) => ({ nombre: `v${i}`, x: Math.floor(r() * 6), y: Math.floor(r() * 4) }));
  const aristas = [];
  for (let u = 0; u < n; u++)
    for (let v = u + 1; v < n; v++)
      if (r() < 0.35) {
        const largo = Math.abs(vertices[u]!.x - vertices[v]!.x) + Math.abs(vertices[u]!.y - vertices[v]!.y);
        aristas.push({ u, v, peso: (admisible ? largo : 0) + Math.floor(r() * 5) });
      }
  return { vertices, aristas };
}

describe('la búsqueda en un grafo con pesos (I.6)', () => {
  it('Dijkstra, en el grafo del capítulo, elige s, b, c, z, a, d y t, como en la tabla del ejemplo', () => {
    const pasos = buscar(G, 'dijkstra', S, T);
    expect(elegidos(G, pasos)).toBe('sbczadt');
    const fin = pasos[pasos.length - 1]!;
    expect(fin.final).toBe('llego');
    expect(nombres(G, caminoHasta(fin, T)).join('')).toBe('sbcdt');
    // Los d después de cada paso, en el orden z, s, a, b, c, d, t.
    expect(pasos.map((p) => p.d)).toEqual([
      [Infinity, 0, Infinity, Infinity, Infinity, Infinity, Infinity],
      [5, 0, 6, 2, Infinity, Infinity, Infinity],
      [5, 0, 6, 2, 4, Infinity, Infinity],
      [5, 0, 6, 2, 4, 7, 10],
      [5, 0, 6, 2, 4, 7, 10],
      [5, 0, 6, 2, 4, 7, 10],
      [5, 0, 6, 2, 4, 7, 9],
      [5, 0, 6, 2, 4, 7, 9],
    ]);
  });

  it('A*, con la distancia de Manhattan, elige solo s, b, c, d y t, y llega con la misma distancia', () => {
    const pasos = buscar(G, 'a-estrella', S, T);
    expect(elegidos(G, pasos)).toBe('sbcdt');
    expect(elecciones(pasos)).toBe(5);
    expect(pasos[pasos.length - 1]!.d[T]).toBe(9);
    expect(nombres(G, pasos[pasos.length - 1]!.frontera)).toEqual(['a', 'z']);
  });

  it('el recorrido en anchura cuenta aristas: encuentra s, a, c, t, que no es el camino más corto', () => {
    const pasos = buscar(G, 'anchura', S, T);
    expect(elegidos(G, pasos)).toBe('szabcdt');
    const fin = pasos[pasos.length - 1]!;
    expect(fin.d).toEqual([1, 0, 1, 1, 2, 2, 3]);
    expect(nombres(G, caminoHasta(fin, T)).join('')).toBe('sact');
  });

  it('la heurística del grafo del capítulo es consistente; con a–d de peso 0 sobreestima en a, y A* se equivoca', () => {
    const juicio = juzgarHeuristica(G, T);
    expect(juicio.h).toEqual([5, 4, 4, 4, 2, 2, 0]);
    expect(juicio.exactas).toEqual([14, 9, 6, 7, 5, 2, 0]);
    expect(juicio.sobreestima).toBeNull();
    expect(juicio.inconsistente).toBeNull();

    const roto: GrafoConPesos = {
      vertices: G.vertices,
      aristas: G.aristas.map((a) => (a.u === indice('a') && a.v === indice('d') ? { ...a, peso: 0 } : a)),
    };
    const otro = juzgarHeuristica(roto, T);
    expect(otro.sobreestima).toBe(indice('a'));
    expect(otro.exactas[S]).toBe(8);
    const pasos = buscar(roto, 'a-estrella', S, T);
    expect(pasos[pasos.length - 1]!.d[T]).toBe(9);
  });

  it('el árbol generador mínimo pesa 17 y no es el árbol de los caminos mínimos, que pesa 20', () => {
    // El árbol de los previos de Dijkstra, sin destino.
    const pasos = buscar(G, 'dijkstra', S, -1);
    const fin = pasos[pasos.length - 1]!;
    const peso = (u: number, v: number) => G.aristas.find((a) => (a.u === u && a.v === v) || (a.u === v && a.v === u))!.peso;
    const arbol = fin.previo.flatMap((p, v) => (p === null ? [] : [peso(p, v)]));
    expect(arbol.reduce((x, y) => x + y)).toBe(20);
    // Kruskal, a mano en el texto: s–b, b–c, d–t, a–c, c–d, s–z.
    const kruskal = [
      ['s', 'b'],
      ['b', 'c'],
      ['d', 't'],
      ['a', 'c'],
      ['c', 'd'],
      ['s', 'z'],
    ].map(([u, v]) => peso(indice(u!), indice(v!)));
    expect(kruskal.reduce((x, y) => x + y)).toBe(17);
  });

  it('si el destino no se alcanza, la búsqueda termina sin llegar', () => {
    const g: GrafoConPesos = { vertices: G.vertices, aristas: G.aristas.filter((a) => a.v !== T) };
    for (const busqueda of ['anchura', 'dijkstra', 'a-estrella'] as const) {
      const pasos = buscar(g, busqueda, S, T);
      expect(pasos[pasos.length - 1]!.final).toBe('inalcanzable');
      expect(pasos[pasos.length - 1]!.d[T]).toBe(Infinity);
    }
  });

  it('en grafos al azar, anchura y Dijkstra dan las distancias, y A* también si la heurística es admisible', () => {
    const r = azar(6);
    for (let k = 0; k < 400; k++) {
      const admisible = k % 2 === 0;
      const g = grafoAlAzar(r, admisible);
      const n = g.vertices.length;
      const exactas = floyd(g);
      const saltos = floyd(g, true);
      const s = Math.floor(r() * n);
      const t = Math.floor(r() * n);
      expect(distanciasDesde(g, s)).toEqual(exactas[s]);

      const anchura = buscar(g, 'anchura', s, -1);
      expect(anchura[anchura.length - 1]!.d).toEqual(saltos[s]);

      // Dijkstra: cuando elige un vértice, su d es la distancia (teorema de Dijkstra).
      for (const p of buscar(g, 'dijkstra', s, t)) if (p.elegido !== null) expect(p.d[p.elegido]).toBe(exactas[s]![p.elegido]);

      const juicio = juzgarHeuristica(g, t);
      if (admisible) {
        expect(juicio.sobreestima).toBeNull();
        expect(juicio.inconsistente).toBeNull();
      }
      if (juicio.sobreestima === null) {
        const a = buscar(g, 'a-estrella', s, t);
        expect(a[a.length - 1]!.d[t]).toBe(exactas[s]![t]);
        // Con una heurística consistente, ningún vértice se elige dos veces.
        if (juicio.inconsistente === null) {
          const vistos = a.flatMap((p) => (p.elegido === null ? [] : [p.elegido]));
          expect(new Set(vistos).size).toBe(vistos.length);
        }
      }
    }
  });

  it('el camino de los previos tiene la longitud que dice d', () => {
    const r = azar(11);
    for (let k = 0; k < 200; k++) {
      const g = grafoAlAzar(r, true);
      const s = 0;
      const pasos = buscar(g, 'dijkstra', s, -1);
      const fin = pasos[pasos.length - 1]!;
      for (let v = 0; v < g.vertices.length; v++) {
        const camino = caminoHasta(fin, v);
        if (!Number.isFinite(fin.d[v]!)) {
          expect(camino).toEqual([]);
          continue;
        }
        expect(camino[0]).toBe(s);
        let largo = 0;
        for (let i = 1; i < camino.length; i++) {
          const [p, q] = [camino[i - 1]!, camino[i]!];
          largo += Math.min(...g.aristas.filter((a) => (a.u === p && a.v === q) || (a.u === q && a.v === p)).map((a) => a.peso));
        }
        expect(largo).toBe(fin.d[v]);
      }
    }
  });
});
