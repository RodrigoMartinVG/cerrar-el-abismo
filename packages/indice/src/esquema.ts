import { z } from 'zod';

/**
 * EL ÍNDICE COMO DATOS (decisión 0002). Cada tomo vive en `indice/tomo-NN.yaml` y los itinerarios en
 * `indice/itinerarios.yaml`. Este esquema es el contrato: lo que no lo cumple no entra al sitio ni a la
 * especificación. Las claves van en español y sin tildes, como en la sección 11.4 de la especificación.
 */

/** Los campos de aplicación (sección 9.1): la clave que se escribe en los datos y la etiqueta que se muestra. */
export const CAMPOS = {
  '3d': '3D',
  fisica: 'Física',
  ing: 'Ing',
  datos: 'Datos',
  senales: 'Señales',
  cripto: 'Cripto',
  'bio-eco': 'Bio/Eco',
} as const;

export type Campo = keyof typeof CAMPOS;

/** Los dos hilos fijos (sección 9.2): presentes en todos los tomos y nunca más de un tercio de un tomo. */
export const HILOS_FIJOS: readonly Campo[] = ['3d', 'fisica'];

export const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const;

export type Romano = (typeof ROMANOS)[number];

const romano = z.enum(ROMANOS);

/** Un capítulo se nombra «tomo.capítulo»: II.5 es el quinto capítulo del Tomo II. */
export const idCapitulo = z
  .string()
  .regex(/^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.[1-9]\d*$/, 'se espera «tomo.capítulo», como II.5');

export const aplicacion = z.strictObject({
  campo: z.enum(Object.keys(CAMPOS) as [Campo, ...Campo[]]),
  /** Markdown en línea. */
  texto: z.string().min(1),
});

export const capitulo = z.strictObject({
  id: idCapitulo,
  titulo: z.string().min(1),
  /** Extensión estimada, en páginas impresas. */
  paginas: z.number().int().positive(),
  requiere: z.array(idCapitulo),
  /** Sección 5.3: ningún capítulo de núcleo depende de uno complementario. */
  tipo: z.enum(['nucleo', 'complementario']),
  /** Los temas del capítulo, en Markdown en línea. */
  contenidos: z.array(z.string().min(1)).min(1),
  /** El fragmento de entrada y lo que revela (sección 8), en Markdown en línea. */
  puente: z.string().min(1),
  aplicaciones: z.array(aplicacion).min(1),
  /** Las lecturas de referencia, en Markdown en línea. */
  lecturas: z.string().min(1),
});

export const parte = z.strictObject({
  letra: z.string().regex(/^[A-Z]$/),
  titulo: z.string().min(1),
  capitulos: z.array(capitulo).min(1),
});

export const tomo = z.strictObject({
  id: romano,
  titulo: z.string().min(1),
  /** Los tomos que se deben haber leído antes (sección 6). */
  requiere: z.array(romano),
  /** Capítulos de otros tomos que se importan sin requerir el tomo entero (sección 6). */
  interfaces: z.array(idCapitulo),
  /** El párrafo que presenta el tomo, en Markdown en línea. */
  presentacion: z.string().min(1),
  partes: z.array(parte).min(1),
});

export const itinerario = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nombre: z.string().min(1),
  /** Todo itinerario parte del núcleo y suma estos capítulos complementarios… */
  capitulos: z.array(idCapitulo),
  /** …y estos tomos completos. */
  tomos: z.array(romano),
});

export const itinerarios = z.array(itinerario);

export type Aplicacion = z.infer<typeof aplicacion>;
export type Capitulo = z.infer<typeof capitulo>;
export type Parte = z.infer<typeof parte>;
export type Tomo = z.infer<typeof tomo>;
export type Itinerario = z.infer<typeof itinerario>;

/** El índice completo: los diez tomos en orden y los itinerarios. */
export interface Indice {
  tomos: Tomo[];
  itinerarios: Itinerario[];
}
