import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/**
 * En la portada de un capítulo (decisión 0008), el índice «En esta página» muestra solo lo que la portada tiene: la
 * Entrada, la Motivación y la lista de sus páginas. El resto del capítulo está en sus secciones.
 */
export const onRequest = defineRouteMiddleware((context) => {
  const { entry, toc } = context.locals.starlightRoute;
  if (!toc || !/\/capitulos\/[^/]+\.md$/.test(entry.filePath ?? '')) return;
  toc.items = [
    ...toc.items.filter((i) => i.slug === '_top' || i.slug === 'entrada' || i.slug === 'motivación'),
    { depth: 2, slug: 'paginas-del-capitulo', text: 'El capítulo, página por página', children: [] },
  ];
});
