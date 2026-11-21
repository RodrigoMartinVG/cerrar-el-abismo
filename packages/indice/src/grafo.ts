import { todosLosCapitulos } from './consultas.ts';
import type { Capitulo, Indice } from './esquema.ts';

/**
 * EL GRAFO DE DEPENDENCIAS (especificación, 11.4). Cada capítulo declara en `requiere` los capítulos que usa
 * directamente; el grafo tiene una arista de cada requisito al capítulo que lo pide. Como todo requisito es anterior en
 * el orden de lectura (lo comprueba validar.ts), el grafo no tiene ciclos, y recorrerlo en ese orden alcanza.
 */
export class Grafo {
  /** Los capítulos en orden de lectura. */
  readonly capitulos: readonly Capitulo[];
  private readonly porId: ReadonlyMap<string, Capitulo>;
  private readonly lugar: ReadonlyMap<string, number>;
  private readonly antes = new Map<string, ReadonlySet<string>>();
  private readonly despues = new Map<string, Set<string>>();
  private readonly profundidades = new Map<string, number>();

  constructor(indice: Indice) {
    this.capitulos = todosLosCapitulos(indice);
    this.porId = new Map(this.capitulos.map((c) => [c.id, c]));
    this.lugar = new Map(this.capitulos.map((c, i) => [c.id, i]));
    for (const c of this.capitulos) {
      const todos = new Set<string>();
      for (const r of c.requiere) {
        todos.add(r);
        for (const x of this.antes.get(r) ?? []) todos.add(x);
      }
      this.antes.set(c.id, todos);
      this.despues.set(c.id, new Set());
    }
    for (const c of this.capitulos) for (const r of this.antes.get(c.id)!) this.despues.get(r)?.add(c.id);
  }

  capitulo(id: string): Capitulo {
    const c = this.porId.get(id);
    if (!c) throw new Error(`${id} no es un capítulo de la obra.`);
    return c;
  }

  private ordenar(ids: Iterable<string>): Capitulo[] {
    return [...ids].sort((a, b) => this.lugar.get(a)! - this.lugar.get(b)!).map((id) => this.capitulo(id));
  }

  /** El recorrido hasta un capítulo: todos sus requisitos, directos o indirectos, en orden de lectura, sin él. */
  recorrido(id: string): Capitulo[] {
    this.capitulo(id);
    return this.ordenar(this.antes.get(id)!);
  }

  /** Si `otro` está en el recorrido hasta `id`, es decir, si `id` depende de `otro`. */
  depende(id: string, otro: string): boolean {
    return this.antes.get(id)?.has(otro) ?? false;
  }

  /** Los capítulos que dependen de uno, directa o indirectamente, en orden de lectura. */
  dependientes(id: string): Capitulo[] {
    this.capitulo(id);
    return this.ordenar(this.despues.get(id)!);
  }

  /** Los capítulos que piden a uno directamente en su `requiere`. */
  dependientesDirectos(id: string): Capitulo[] {
    return this.capitulos.filter((c) => c.requiere.includes(id));
  }

  /**
   * Los requisitos implícitos: un requisito declarado que ya viene con otro requisito del mismo capítulo. No son
   * errores, porque `requiere` dice lo que el capítulo usa directamente, pero el dibujo los omite y conviene revisarlos.
   */
  requisitosImplicitos(): { capitulo: string; requisito: string; via: string }[] {
    const implicitos: { capitulo: string; requisito: string; via: string }[] = [];
    for (const c of this.capitulos)
      for (const r of c.requiere) {
        const via = c.requiere.find((o) => o !== r && this.depende(o, r));
        if (via) implicitos.push({ capitulo: c.id, requisito: r, via });
      }
    return implicitos;
  }

  /** Los requisitos que no son implícitos: las aristas de la reducción transitiva, las que se dibujan. */
  requisitosEsenciales(id: string): string[] {
    const c = this.capitulo(id);
    return c.requiere.filter((r) => !c.requiere.some((o) => o !== r && this.depende(o, r)));
  }

  /** La profundidad de un capítulo: la longitud del camino más largo de requisitos que llega a él. */
  profundidad(id: string): number {
    const guardada = this.profundidades.get(id);
    if (guardada !== undefined) return guardada;
    const p = Math.max(0, ...this.capitulo(id).requiere.map((r) => this.profundidad(r) + 1));
    this.profundidades.set(id, p);
    return p;
  }
}
