import { describe, expect, it } from 'vitest';
import { cargarIndice } from './cargar.ts';
import { Grafo } from './grafo.ts';

const grafo = new Grafo(cargarIndice());
const ids = (cs: readonly { id: string }[]) => cs.map((c) => c.id);

describe('el grafo de dependencias', () => {
  it('da el recorrido hasta un capítulo, en orden de lectura y sin él', () => {
    expect(ids(grafo.recorrido('I.1'))).toEqual([]);
    expect(ids(grafo.recorrido('I.4'))).toEqual(['I.1', 'I.2', 'I.3']);
    expect(grafo.depende('IX.15', 'I.4')).toBe(true);
    expect(grafo.depende('I.4', 'IX.15')).toBe(false);
  });

  it('todo recorrido está cerrado: los requisitos de cada capítulo del recorrido también están', () => {
    for (const c of grafo.capitulos) {
      const dentro = new Set(ids(grafo.recorrido(c.id)));
      for (const x of [c, ...grafo.recorrido(c.id)])
        for (const r of x.requiere) expect(dentro.has(r), `${c.id}: ${r}`).toBe(true);
    }
  });

  it('da lo que depende de un capítulo, y lo que lo pide directamente', () => {
    expect(ids(grafo.dependientes('I.15'))).toEqual([]);
    expect(ids(grafo.dependientesDirectos('I.1'))).toEqual(['I.2', 'I.14', 'I.15']);
    expect(ids(grafo.dependientes('I.1'))).toHaveLength(grafo.capitulos.length - 1);
  });

  it('separa los requisitos implícitos de los esenciales', () => {
    expect(grafo.requisitosImplicitos()).toContainEqual({ capitulo: 'I.12', requisito: 'I.2', via: 'I.6' });
    expect(grafo.requisitosEsenciales('I.12')).toEqual(['I.6', 'I.11']);
    expect(grafo.requisitosEsenciales('I.2')).toEqual(['I.1']);
  });

  it('mide la profundidad como el camino más largo de requisitos', () => {
    expect(grafo.profundidad('I.1')).toBe(0);
    expect(grafo.profundidad('I.2')).toBe(1);
    for (const c of grafo.capitulos)
      for (const r of c.requiere) expect(grafo.profundidad(c.id)).toBeGreaterThan(grafo.profundidad(r));
  });
});
