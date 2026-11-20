import { CAMPOS, type Capitulo, type Indice, type Tomo } from './esquema.ts';

/**
 * LA SECCIÓN 13 DE LA ESPECIFICACIÓN, ESCRITA DESDE LOS DATOS (decisión 0002). Los datos de `indice/` son la
 * fuente; la especificación muestra su versión legible entre dos marcas y nunca se edita a mano entre ellas.
 * `npm run indice:spec` la reescribe, y una prueba falla si quedó desactualizada.
 */

export const MARCA_INICIO = '<!-- indice: generado desde indice/ con `npm run indice:spec`; no editar a mano -->';
export const MARCA_FIN = '<!-- /indice -->';

/** «A», «A y B», «A, B y C». */
export function enumerar(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
}

function requisitosDelTomo(t: Tomo): string {
  const tomos =
    t.requiere.length === 0 ? 'escuela secundaria' : `${t.requiere.length === 1 ? 'Tomo' : 'Tomos'} ${enumerar(t.requiere)}`;
  const interfaces = t.interfaces.length === 0 ? '' : `; importa ${enumerar(t.interfaces)} por interfaz`;
  return tomos + interfaces;
}

export function capitulosDe(t: Tomo): Capitulo[] {
  return t.partes.flatMap((p) => p.capitulos);
}

function capituloEnMarkdown(c: Capitulo): string {
  const tipo = c.tipo === 'nucleo' ? 'Núcleo' : 'Complementario';
  const requiere = c.requiere.length === 0 ? '—' : c.requiere.join(', ');
  const aplicaciones = c.aplicaciones.map((a) => `[${CAMPOS[a.campo]}] ${a.texto}`).join(' · ');
  return [
    `#### ${c.id} ${c.titulo}`,
    `*${c.paginas} págs. · Requiere: ${requiere} · ${tipo}*`,
    ...c.contenidos.map((linea) => `- ${linea}`),
    '',
    `**Puente.** ${c.puente}`,
    `**Aplicaciones.** ${aplicaciones}.`,
    `**Lecturas.** ${c.lecturas}`,
  ].join('\n');
}

function tomoEnMarkdown(t: Tomo): string {
  const bloques = [
    `### Tomo ${t.id} — ${t.titulo}`,
    `*Requiere: ${requisitosDelTomo(t)} · ${capitulosDe(t).length} capítulos.* ${t.presentacion}`,
  ];
  for (const p of t.partes) {
    bloques.push(`**Parte ${p.letra} — ${p.titulo}**`, ...p.capitulos.map(capituloEnMarkdown));
  }
  return bloques.join('\n\n');
}

/** El índice entero, tal como aparece entre las marcas de la sección 13. */
export function indiceEnMarkdown(indice: Indice): string {
  return indice.tomos.map(tomoEnMarkdown).join('\n\n');
}

/** Devuelve el texto de la especificación con el índice puesto entre las marcas. */
export function conIndice(especificacion: string, indice: Indice): string {
  const inicio = especificacion.indexOf(MARCA_INICIO);
  const fin = especificacion.indexOf(MARCA_FIN);
  if (inicio < 0 || fin < inicio) throw new Error('La especificación no tiene las marcas del índice (decisión 0002).');
  return `${especificacion.slice(0, inicio + MARCA_INICIO.length)}\n\n${indiceEnMarkdown(indice)}\n\n${especificacion.slice(fin)}`;
}
