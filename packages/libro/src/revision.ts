import { createHash } from 'node:crypto';

/**
 * EL REGISTRO DE REVISIÓN (decisión 0005). Las pruebas verifican la forma de un capítulo, no que sus enunciados sean
 * verdaderos: eso lo hace la revisión, que no se puede automatizar pero sí registrar y exigir. Cada capítulo tiene su
 * registro en `revision/` («revision/i-7.yaml»), con una entrada por cada revisión hecha:
 *
 *     resultados:
 *       teo-lagrange:
 *         - pasada: primera
 *           por: Nombre Apellido
 *           fecha: 2026-11-25
 *           contra: Dummit y Foote, Abstract Algebra, 3.ª ed., sección 3.2, teorema 8
 *           huella: 5c1e0b9a47d2
 *     aspectos:
 *       estilo:
 *         - pasada: primera
 *           ...
 *
 * La huella de un resultado resume el texto que se revisó (el entorno y su demostración): si el texto cambia, la
 * revisión queda desactualizada y deja de contar. Aquí se comprueba que el registro esté bien escrito y que alcance
 * para el estado del capítulo, y se calcula su avance para mostrarlo en el sitio.
 */

/** Los entornos que se revisan uno por uno: los que afirman algo que se demuestra. */
export const ENTORNOS_REVISABLES: ReadonlySet<string> = new Set(['teorema', 'proposicion', 'lema', 'corolario']);

/** Los aspectos del capítulo entero que se revisan, con su nombre para mostrar y lo que quiere decir revisarlos. */
export const ASPECTOS: Readonly<Record<string, { nombre: string; que: string }>> = {
  estilo: { nombre: 'Estilo', que: 'la lectura de estilo, con la lista de la guía' },
  practica: {
    nombre: 'Práctica',
    que: 'el fragmento de la Entrada, el Puente y las Aplicaciones, contrastados con sus fuentes',
  },
  calculos: {
    nombre: 'Cálculos',
    que: 'los ejemplos numéricos, recalculados, y las salidas de las celdas que el texto cita',
  },
  ejercicios: { nombre: 'Ejercicios', que: 'los enunciados y las soluciones de los ejercicios' },
  historia: { nombre: 'Historia', que: 'los datos históricos de las Notas, contrastados con fuentes históricas' },
};

export const PASADAS = ['primera', 'segunda'] as const;
export type Pasada = (typeof PASADAS)[number];

export const ESTADOS = ['borrador', 'revision', 'terminado'] as const;
export type Estado = (typeof ESTADOS)[number];

export interface EntradaDeRevision {
  pasada: Pasada;
  /** Quién revisó: una persona, nunca una IA. */
  por: string;
  /** La fecha de la revisión, AAAA-MM-DD. */
  fecha: string;
  /** Contra qué se contrastó: libro y número de teorema o página, una norma, la lista de la guía. */
  contra: string;
  /** La huella del texto revisado; solo en los resultados. */
  huella?: string;
  notas?: string;
}

export interface Registro {
  resultados?: Record<string, EntradaDeRevision[]>;
  aspectos?: Record<string, EntradaDeRevision[]>;
}

export interface ResultadoRevisable {
  ancla: string;
  entorno: string;
  /** La huella del texto actual del entorno y de su demostración. */
  huella: string;
}

/** Cómo está una pasada de un resultado o de un aspecto. */
export type EstadoDePasada = 'falta' | 'vigente' | 'desactualizada';

export interface AvanceDeRevision {
  /** Cuántos resultados tiene el capítulo. */
  resultados: number;
  /** Cuántos tienen una primera pasada vigente, y cuántos una segunda, de otra persona. */
  primera: number;
  segunda: number;
  /** Cuántos de los cinco aspectos tienen la primera pasada. */
  aspectos: number;
  porResultado: Map<string, Record<Pasada, EstadoDePasada>>;
  porAspecto: Map<string, Record<Pasada, EstadoDePasada>>;
}

/** Los primeros doce dígitos del SHA-256 del texto, con los espacios normalizados. */
export function huella(texto: string): string {
  return createHash('sha256').update(texto.replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 12);
}

/**
 * Los resultados de un capítulo, en orden, con la huella de su texto: el entorno, desde la línea que lo abre hasta la
 * que lo cierra, y la demostración que lo sigue, si la hay. Lo que está dentro de un bloque de código no cuenta como
 * directiva, igual que en etiquetas.ts.
 */
export function resultadosDelCapitulo(markdown: string): ResultadoRevisable[] {
  const lineas = markdown.split('\n');
  const resultados: ResultadoRevisable[] = [];

  /** Devuelve el índice de la línea que cierra el entorno que se abre en `i`. */
  const cierre = (i: number): number => {
    let profundidad = 0;
    let cerco: string | undefined;
    for (let j = i; j < lineas.length; j++) {
      const linea = lineas[j]!;
      const valla = /^\s*(`{3,}|~{3,})/.exec(linea)?.[1];
      if (cerco !== undefined) {
        if (valla && valla[0] === cerco[0] && valla.length >= cerco.length && linea.trim() === valla) cerco = undefined;
        continue;
      }
      if (valla) {
        cerco = valla;
        continue;
      }
      if (/^:::[a-z]/.test(linea)) profundidad++;
      else if (/^:::\s*$/.test(linea) && --profundidad === 0) return j;
    }
    throw new Error(`El entorno de la línea ${i + 1} no se cierra.`);
  };

  let cerco: string | undefined;
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i]!;
    const valla = /^\s*(`{3,}|~{3,})/.exec(linea)?.[1];
    if (cerco !== undefined) {
      if (valla && valla[0] === cerco[0] && valla.length >= cerco.length && linea.trim() === valla) cerco = undefined;
      continue;
    }
    if (valla) {
      cerco = valla;
      continue;
    }
    const entorno = /^:::([a-z]+)/.exec(linea)?.[1];
    if (!entorno || !ENTORNOS_REVISABLES.has(entorno)) continue;
    const ancla = /\{#([\w-]+)/.exec(linea)?.[1] ?? '';
    let fin = cierre(i);
    let siguiente = fin + 1;
    while (siguiente < lineas.length && lineas[siguiente]!.trim() === '') siguiente++;
    if (/^:::demostracion\b/.test(lineas[siguiente] ?? '')) fin = cierre(siguiente);
    resultados.push({ ancla, entorno, huella: huella(lineas.slice(i, fin + 1).join('\n')) });
    i = fin;
  }
  return resultados;
}

const esTexto = (x: unknown): x is string => typeof x === 'string' && x.trim() !== '';
const esObjeto = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Quien firma una revisión es una persona: ningún nombre de IA puede aparecer en `por`. */
const IA = /\b(?:claude|anthropic|gpt|chatgpt|openai|gemini|copilot|llm|ia|ai)\b/i;

const CAMPOS = new Set(['pasada', 'por', 'fecha', 'contra', 'huella', 'notas']);

function fechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(`${fecha}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(fecha);
}

/** Revisa una entrada y devuelve sus problemas; `donde` la nombra en los mensajes. */
function revisarEntrada(e: unknown, donde: string, conHuella: boolean): string[] {
  if (!esObjeto(e)) return [`${donde}: cada entrada tiene «pasada», «por», «fecha» y «contra».`];
  const problemas: string[] = [];
  for (const campo of Object.keys(e)) if (!CAMPOS.has(campo)) problemas.push(`${donde}: «${campo}» no es un campo del registro.`);
  if (!PASADAS.includes(e['pasada'] as Pasada)) problemas.push(`${donde}: «pasada» es «primera» o «segunda».`);
  if (!esTexto(e['por'])) problemas.push(`${donde}: falta «por», el nombre de quien revisó.`);
  else if (IA.test(e['por']))
    problemas.push(`${donde}: «${e['por']}» no puede firmar; una revisión la firma una persona (decisión 0005).`);
  if (typeof e['fecha'] !== 'string' || !fechaValida(e['fecha']))
    problemas.push(`${donde}: «fecha» tiene que ser una fecha AAAA-MM-DD.`);
  if (!esTexto(e['contra'])) problemas.push(`${donde}: falta «contra», con qué se contrastó.`);
  if (conHuella && !(typeof e['huella'] === 'string' && /^[0-9a-f]{12}$/.test(e['huella'])))
    problemas.push(`${donde}: falta «huella», doce dígitos hexadecimales (npm run revision la calcula).`);
  if (!conHuella && e['huella'] !== undefined) problemas.push(`${donde}: los aspectos no llevan huella.`);
  if (e['notas'] !== undefined && !esTexto(e['notas'])) problemas.push(`${donde}: «notas», si está, es un texto.`);
  return problemas;
}

/** Las entradas bien formadas de una lista, sin decir nada de las otras (de eso se ocupa `revisarRegistro`). */
function entradasValidas(lista: unknown, conHuella: boolean): EntradaDeRevision[] {
  return Array.isArray(lista) ? (lista.filter((e) => revisarEntrada(e, '', conHuella).length === 0) as EntradaDeRevision[]) : [];
}

/**
 * El estado de las dos pasadas de un resultado (con su huella actual) o de un aspecto (sin huella). La segunda es
 * opcional, y solo cuenta si no la firma ninguna de las personas que hicieron una primera pasada vigente.
 */
function pasadas(entradas: EntradaDeRevision[], huellaActual?: string): Record<Pasada, EstadoDePasada> {
  const vigente = (e: EntradaDeRevision) => huellaActual === undefined || e.huella === huellaActual;
  const de = (p: Pasada) => entradas.filter((e) => e.pasada === p);
  const primeras = de('primera').filter(vigente);
  const estado = (p: Pasada): EstadoDePasada => {
    const todas = de(p);
    if (todas.length === 0) return 'falta';
    const vigentes = todas.filter(vigente).filter((s) => p === 'primera' || !primeras.some((x) => x.por.trim() === s.por.trim()));
    if (vigentes.length > 0) return 'vigente';
    return todas.some(vigente) ? 'falta' : 'desactualizada';
  };
  return { primera: estado('primera'), segunda: estado('segunda') };
}

/** El avance de la revisión de un capítulo, para el sitio y para `npm run revision`. */
export function avanceDeRevision(registro: unknown, markdown: string): AvanceDeRevision {
  const r = esObjeto(registro) ? registro : {};
  const resultados = esObjeto(r['resultados']) ? r['resultados'] : {};
  const aspectos = esObjeto(r['aspectos']) ? r['aspectos'] : {};
  const porResultado = new Map(
    resultadosDelCapitulo(markdown).map((x) => [x.ancla, pasadas(entradasValidas(resultados[x.ancla], true), x.huella)]),
  );
  const porAspecto = new Map(Object.keys(ASPECTOS).map((a) => [a, pasadas(entradasValidas(aspectos[a], false))]));
  const cuenta = (m: Map<string, Record<Pasada, EstadoDePasada>>, p: Pasada) =>
    [...m.values()].filter((x) => x[p] === 'vigente').length;
  return {
    resultados: porResultado.size,
    primera: cuenta(porResultado, 'primera'),
    segunda: cuenta(porResultado, 'segunda'),
    aspectos: cuenta(porAspecto, 'primera'),
    porResultado,
    porAspecto,
  };
}

/**
 * Revisa el registro de un capítulo frente a su texto y su estado. `registro` es el YAML ya leído, o `undefined` si el
 * capítulo no tiene registro. Devuelve los problemas en palabras.
 */
export function revisarRegistro(registro: unknown, markdown: string, estado: Estado = 'borrador'): string[] {
  if (registro !== undefined && registro !== null && !esObjeto(registro))
    return ['El registro tiene dos partes, «resultados» y «aspectos».'];
  const r = registro ?? {};
  const problemas: string[] = [];
  for (const parte of Object.keys(r))
    if (parte !== 'resultados' && parte !== 'aspectos')
      problemas.push(`«${parte}» no es una parte del registro: tiene «resultados» y «aspectos».`);

  const actuales = resultadosDelCapitulo(markdown);
  for (const { ancla, entorno } of actuales)
    if (!ancla) problemas.push(`Un ${entorno} no tiene ancla, así que no se puede registrar su revisión.`);
  const anclas = new Set(actuales.map((x) => x.ancla));

  const revisarParte = (parte: 'resultados' | 'aspectos', conocidos: Set<string>, conHuella: boolean) => {
    const datos = r[parte];
    if (datos === undefined) return;
    if (!esObjeto(datos)) {
      problemas.push(`«${parte}» va de cada ${conHuella ? 'ancla' : 'aspecto'} a su lista de revisiones.`);
      return;
    }
    for (const [clave, lista] of Object.entries(datos)) {
      if (!conocidos.has(clave))
        problemas.push(
          conHuella
            ? `«${clave}» no es el ancla de ningún resultado del capítulo.`
            : `«${clave}» no es un aspecto; son ${Object.keys(ASPECTOS).join(', ')}.`,
        );
      if (!Array.isArray(lista) || lista.length === 0) {
        problemas.push(`«${clave}»: tiene que ser una lista de revisiones.`);
        continue;
      }
      lista.forEach((e: unknown, i) => problemas.push(...revisarEntrada(e, `«${clave}», entrada ${i + 1}`, conHuella)));
      const validas = entradasValidas(lista, conHuella);
      for (const s of validas.filter((e) => e.pasada === 'segunda'))
        if (validas.some((p) => p.pasada === 'primera' && p.por.trim() === s.por.trim() && p.huella === s.huella))
          problemas.push(`«${clave}»: la segunda pasada la tiene que hacer otra persona que la primera.`);
    }
  };
  revisarParte('resultados', anclas, true);
  revisarParte('aspectos', new Set(Object.keys(ASPECTOS)), false);

  // En «revision» la pasada está en curso; «terminado» la exige completa. Una segunda pasada, de otra persona, se
  // registra si se hace, pero no se exige (enmienda de la decisión 0005).
  if (estado !== 'terminado') return problemas;
  const avance = avanceDeRevision(registro, markdown);
  for (const [ancla, p] of avance.porResultado)
    if (p.primera !== 'vigente')
      problemas.push(`«${ancla}»: un capítulo terminado necesita su revisión vigente (hoy: ${p.primera}).`);
  for (const [aspecto, p] of avance.porAspecto)
    if (p.primera !== 'vigente') problemas.push(`El aspecto «${aspecto}» necesita su revisión en un capítulo terminado.`);
  return problemas;
}
