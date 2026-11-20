import type { Capitulo, Indice, Itinerario, Romano, Tomo } from './esquema.ts';

/** Todos los capítulos, en orden de lectura. */
export function todosLosCapitulos(indice: Indice): Capitulo[] {
  return indice.tomos.flatMap((t) => t.partes.flatMap((p) => p.capitulos));
}

export function tomoDe(id: string): Romano {
  return id.split('.')[0] as Romano;
}

/** El identificador para direcciones y anclas: II.5 → «ii-5». */
export function slug(id: string): string {
  return id.toLowerCase().replace('.', '-');
}

/** Los tomos que un tomo necesita, directa o indirectamente. */
export function tomosRequeridos(indice: Indice, t: Tomo): Set<Romano> {
  const porId = new Map(indice.tomos.map((x) => [x.id, x]));
  const vistos = new Set<Romano>();
  const pendientes = [...t.requiere];
  for (let r = pendientes.pop(); r !== undefined; r = pendientes.pop()) {
    if (vistos.has(r)) continue;
    vistos.add(r);
    pendientes.push(...(porId.get(r)?.requiere ?? []));
  }
  return vistos;
}

/** Los capítulos de un itinerario: el núcleo, más sus capítulos y tomos propios. */
export function capitulosDelItinerario(indice: Indice, it: Itinerario): Capitulo[] {
  const extra = new Set(it.capitulos);
  const tomos = new Set(it.tomos);
  return todosLosCapitulos(indice).filter((c) => c.tipo === 'nucleo' || extra.has(c.id) || tomos.has(tomoDe(c.id)));
}

export function paginas(capitulos: readonly Capitulo[]): number {
  return capitulos.reduce((n, c) => n + c.paginas, 0);
}
