import { CAMPOS, HILOS_FIJOS, textoDeLecturas, type Capitulo, type Indice, type Tomo } from './esquema.ts';
import { capitulosDelItinerario, paginas, todosLosCapitulos } from './consultas.ts';

/**
 * LAS PARTES DE LA ESPECIFICACIÓN QUE SALEN DE LOS DATOS (decisión 0002). Los datos de `indice/` son la fuente; la
 * especificación muestra su versión legible en bloques entre dos marcas, que nunca se editan a mano:
 *
 * - `tomos`: la tabla de tomos de la sección 6;
 * - `itinerarios`: la tabla de itinerarios de la sección 9.6;
 * - `indice`: el índice temático completo de la sección 13;
 * - `extension`: las tablas y cifras de la sección 14.
 *
 * `npm run indice:spec` los reescribe, y una prueba falla si alguno quedó desactualizado.
 */

export const BLOQUES = ['tomos', 'itinerarios', 'indice', 'extension'] as const;
export type Bloque = (typeof BLOQUES)[number];

export const marcaInicio = (b: Bloque) => `<!-- ${b}: generado desde indice/ con \`npm run indice:spec\`; no editar a mano -->`;
export const marcaFin = (b: Bloque) => `<!-- /${b} -->`;

/** «A», «A y B», «A, B y C». */
export function enumerar(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
}

/** 5216 → «5.216», como escribe la especificación. */
export function miles(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const porciento = (k: number, n: number) => `${Math.round((100 * k) / n)} %`;

const PALABRAS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
/** Los números del cero al diez se escriben con letras, como en el resto de la especificación. */
const cantidad = (n: number) => PALABRAS[n] ?? String(n);

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
    `**Lecturas.** ${textoDeLecturas(c.lecturas)}`,
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

/** Sección 13: el índice entero. */
export function indiceEnMarkdown(indice: Indice): string {
  return indice.tomos.map(tomoEnMarkdown).join('\n\n');
}

/** Sección 6: la tabla de tomos, con sus requisitos e interfaces. */
export function tomosEnMarkdown(indice: Indice): string {
  const filas = indice.tomos.map(
    (t) =>
      `| ${t.id} | ${t.titulo} | ${t.requiere.join(', ') || '—'} | ${t.interfaces.join(', ') || '—'} | ${capitulosDe(t).length} |`,
  );
  return [
    '| Tomo | Título | Requiere | Interfaces | Caps. |',
    '| --- | --- | --- | --- | --- |',
    ...filas,
    `| **Total** | | | | **${todosLosCapitulos(indice).length}** |`,
  ].join('\n');
}

/** Sección 14: extensión por tomo, hilos, campos e itinerarios. */
export function extensionEnMarkdown(indice: Indice): string {
  const todos = todosLosCapitulos(indice);
  const nucleo = todos.filter((c) => c.tipo === 'nucleo');
  const aplicaciones = todos.flatMap((c) => c.aplicaciones);
  const cuenta = (apps: readonly { campo: string }[], campo: string) => apps.filter((a) => a.campo === campo).length;
  const [hilo3d, hiloFisica] = HILOS_FIJOS as [string, string];

  const filas = indice.tomos.map((t) => {
    const cs = capitulosDe(t);
    const ns = cs.filter((c) => c.tipo === 'nucleo');
    const apps = cs.flatMap((c) => c.aplicaciones);
    const a3 = cuenta(apps, hilo3d);
    const af = cuenta(apps, hiloFisica);
    return {
      t,
      fila: `| ${t.id} | ${cs.length} | ${miles(paginas(cs))} | ${ns.length} | ${miles(paginas(ns))} | ${a3} de ${apps.length} (${porciento(a3, apps.length)}) | ${af} de ${apps.length} (${porciento(af, apps.length)}) |`,
      p3d: (100 * a3) / apps.length,
      pFisica: (100 * af) / apps.length,
      sinNucleo: ns.length === 0,
    };
  });
  const a3 = cuenta(aplicaciones, hilo3d);
  const af = cuenta(aplicaciones, hiloFisica);
  const extremos = (xs: number[]) => `entre el ${Math.round(Math.min(...xs))} % y el ${Math.round(Math.max(...xs))} %`;
  const longitudes = todos.map((c) => c.paginas);
  const media = (paginas(todos) / todos.length).toFixed(1).replace('.', ',');
  const materialPropio = 50 * indice.tomos.length;
  const sinNucleo = filas.filter((f) => f.sinNucleo).map((f) => f.t.id);

  const itinerarios = indice.itinerarios.map((it) => {
    const cs = capitulosDelItinerario(indice, it);
    return { it, cs };
  });
  const fisica = itinerarios.find((x) => x.it.id === 'fisica');
  const fueraDeFisica = fisica ? todos.filter((c) => !fisica.cs.includes(c)).map((c) => c.id) : [];

  return [
    '| Tomo | Caps. | Págs. | Caps. de núcleo | Págs. de núcleo | Aplicaciones [3D] | Aplicaciones [Física] |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...filas.map((f) => f.fila),
    `| **Total** | **${todos.length}** | **${miles(paginas(todos))}** | **${nucleo.length}** | **${miles(paginas(nucleo))}** | **${a3} de ${aplicaciones.length} (${porciento(a3, aplicaciones.length)})** | **${af} de ${aplicaciones.length} (${porciento(af, aplicaciones.length)})** |`,
    '',
    `- Los capítulos tienen entre ${Math.min(...longitudes)} y ${Math.max(...longitudes)} páginas, con una media de ${media}.`,
    `- Cada tomo suma además unas 50 páginas de material propio: «Lo que este tomo importa», «Lo que este tomo exporta», notación y convenciones, diccionario academia–práctica del tomo, soluciones de los ejercicios impares e índice analítico. En total, unas ${miles(materialPropio)} páginas, para unas ${miles(paginas(todos) + materialPropio)} en toda la obra.`,
    `- El hilo 3D ocupa ${extremos(filas.map((f) => f.p3d))} de las aplicaciones de cada tomo, y el de física ${extremos(filas.map((f) => f.pFisica))}: ninguno supera el límite de un tercio (9.2).`,
    ...(sinNucleo.length === 0
      ? []
      : [
          sinNucleo.length === 1
            ? `- El Tomo ${sinNucleo[0]} no tiene capítulos de núcleo: todo él es complementario en el sentido de 5.3.`
            : `- Los Tomos ${enumerar(sinNucleo)} no tienen capítulos de núcleo: son complementarios en el sentido de 5.3.`,
        ]),
    '',
    '| Campo (9.1) | Aplicaciones | Proporción |',
    '| --- | --- | --- |',
    ...Object.entries(CAMPOS)
      .map(([campo, etiqueta]) => ({ etiqueta, k: cuenta(aplicaciones, campo) }))
      .sort((x, y) => y.k - x.k)
      .map(({ etiqueta, k }) => `| [${etiqueta}] | ${k} | ${porciento(k, aplicaciones.length)} |`),
    `| **Total** | **${aplicaciones.length}** | **100 %** |`,
    '',
    '| Itinerario (9.6) | Caps. | Págs. de capítulos |',
    '| --- | --- | --- |',
    ...itinerarios.map(({ it, cs }) => `| ${it.nombre} | ${cs.length} | ${miles(paginas(cs))} |`),
    '',
    `Los ${cantidad(itinerarios.length)} itinerarios están cerrados bajo dependencias: cada capítulo que incluyen tiene todos sus requisitos dentro del mismo itinerario.${
      fueraDeFisica.length > 0 ? ` El de física deja fuera ${fueraDeFisica.length} capítulos: ${enumerar(fueraDeFisica)}.` : ''
    }`,
  ].join('\n');
}

/** Sección 9.6: qué suma cada itinerario al núcleo. */
export function itinerariosEnMarkdown(indice: Indice): string {
  const filas = indice.itinerarios.map((it) => {
    const extra = [...it.capitulos, ...it.tomos.map((t) => `el Tomo ${t}`)];
    const capitulos =
      extra.length === 0
        ? 'Todos los capítulos de núcleo: la licenciatura aplicada mínima (5.3)'
        : `Núcleo, más ${enumerar(extra)}`;
    return `| ${it.nombre} | ${capitulos} |`;
  });
  return ['| Itinerario | Capítulos |', '| --- | --- |', ...filas].join('\n');
}

const GENERADORES: Record<Bloque, (indice: Indice) => string> = {
  tomos: tomosEnMarkdown,
  itinerarios: itinerariosEnMarkdown,
  indice: indiceEnMarkdown,
  extension: extensionEnMarkdown,
};

/** Devuelve el texto de la especificación con cada bloque generado puesto entre sus marcas. */
export function conIndice(especificacion: string, indice: Indice): string {
  let texto = especificacion;
  for (const b of BLOQUES) {
    const inicio = texto.indexOf(marcaInicio(b));
    const fin = texto.indexOf(marcaFin(b));
    if (inicio < 0 || fin < inicio) throw new Error(`La especificación no tiene las marcas del bloque «${b}» (decisión 0002).`);
    texto = `${texto.slice(0, inicio + marcaInicio(b).length)}\n\n${GENERADORES[b](indice)}\n\n${texto.slice(fin)}`;
  }
  return texto;
}
