import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

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
      }),
    }),
  }),
};
