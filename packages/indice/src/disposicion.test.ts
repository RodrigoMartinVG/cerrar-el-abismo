import { describe, expect, it } from 'vitest';
import { cargarIndice } from './cargar.ts';
import { caminoSuave, disponer, type Arista } from './disposicion.ts';
import { Grafo } from './grafo.ts';

const grafo = new Grafo(cargarIndice());
const ids = grafo.capitulos.map((c) => c.id);
const aristas: Arista[] = ids.flatMap((id) => grafo.requisitosEsenciales(id).map((de) => ({ de, a: id })));
const opciones = { anchoNodo: 64, altoNodo: 26 };
const d = disponer(ids, aristas, opciones);

describe('la disposición por niveles', () => {
  it('pone cada nodo en un nivel mayor que el de sus requisitos', () => {
    const nodo = new Map(d.nodos.map((n) => [n.id, n]));
    for (const { de, a } of aristas) expect(nodo.get(a)!.nivel).toBeGreaterThan(nodo.get(de)!.nivel);
    expect(Math.max(...d.nodos.map((n) => n.nivel))).toBe(25);
  });

  it('no superpone nodos del mismo nivel y los deja dentro del dibujo', () => {
    const niveles = new Set(d.nodos.map((n) => n.nivel));
    for (const nivel of niveles) {
      const xs = d.nodos
        .filter((n) => n.nivel === nivel)
        .map((n) => n.x)
        .sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i++) expect(xs[i]! - xs[i - 1]!).toBeGreaterThanOrEqual(opciones.anchoNodo);
    }
    for (const n of d.nodos) {
      expect(n.x - opciones.anchoNodo / 2).toBeGreaterThanOrEqual(0);
      expect(n.x + opciones.anchoNodo / 2).toBeLessThanOrEqual(d.ancho);
      expect(n.y + opciones.altoNodo / 2).toBeLessThanOrEqual(d.alto);
    }
  });

  it('dibuja cada arista hacia abajo, del requisito al capítulo', () => {
    for (const a of d.aristas)
      for (let i = 1; i < a.puntos.length; i++) expect(a.puntos[i]![1]).toBeGreaterThan(a.puntos[i - 1]![1]);
  });

  it('es determinista', () => {
    expect(disponer(ids, aristas, opciones)).toEqual(d);
  });

  it('rechaza aristas que no respetan el orden o que salen del dibujo', () => {
    expect(() => disponer(['a', 'b'], [{ de: 'b', a: 'a' }])).toThrow(/no respeta el orden/);
    expect(() => disponer(['a'], [{ de: 'a', a: 'z' }])).toThrow(/no están en el dibujo/);
  });

  it('suaviza el camino con curvas que salen y llegan en vertical', () => {
    expect(
      caminoSuave([
        [0, 0],
        [10, 20],
      ]),
    ).toBe('M0.0,0.0 C0.0,10.0 10.0,10.0 10.0,20.0');
  });
});
