import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { CAMPOS, type Campo } from '@cerrar-el-abismo/indice';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /** El identificador del capítulo en el índice («II.5»); sus metadatos viven allí (decisión 0002). */
        capitulo: z.string().optional(),
        /** En qué punto está el capítulo (sección 16.2). */
        estado: z.enum(['borrador', 'revision', 'terminado']).optional(),
        /**
         * Lo que el capítulo usa antes de que la obra lo construya, y dónde se trata con rigor (guía de estilo,
         * sección 1). La capa de libro lo muestra al comienzo del Desarrollo y comprueba que `en` venga después.
         */
        supone: z.array(z.object({ nocion: z.string(), en: z.string() })).optional(),
        /**
         * Lo que el capítulo cumple de lo que otros dejaron para él en su `supone`, y en qué entornos
         * (packages/libro/src/cumple.ts): el mapa de dependencias, verificado hacia atrás.
         */
        cumple: z.array(z.strictObject({ de: z.string(), nocion: z.string(), anclas: z.array(z.string()).min(1) })).optional(),
        /**
         * Los términos que el capítulo define, con lo que la práctica dice en su lugar (decisión 0004). La página
         * /diccionario/ los reúne; packages/libro/src/diccionario.ts los comprueba.
         */
        diccionario: z
          .array(
            z.strictObject({
              termino: z.string(),
              ingles: z.string(),
              practica: z.array(z.string()).min(1),
              nota: z.string(),
              ancla: z.string().optional(),
              campos: z.array(z.enum(Object.keys(CAMPOS) as [Campo, ...Campo[]])).optional(),
            }),
          )
          .optional(),
      }),
    }),
  }),
};
