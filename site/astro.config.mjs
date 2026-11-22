// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cargarIndice, slug, todosLosCapitulos, tomoDe } from '@cerrar-el-abismo/indice';
import { etiquetasDelCapitulo, remarkLibro } from '@cerrar-el-abismo/libro';
import { NOMBRES_DE_PIEZAS } from '@cerrar-el-abismo/piezas';

/**
 * El sitio de la obra (decisión 0001): Astro con Starlight, publicado en GitHub Pages en
 * https://rodrigomartinvg.github.io/cerrar-el-abismo/ ; por eso toda dirección empieza con `base`.
 * El índice temático sale de los datos de indice/ (decisión 0002), y los capítulos escritos viven en
 * src/content/docs/capitulos/, uno por archivo con el nombre de su identificador («ii-5.md»).
 */
const BASE = '/cerrar-el-abismo';
const indice = cargarIndice();
const archivo = (/** @type {string} */ id) => new URL(`./src/content/docs/capitulos/${slug(id)}.md`, import.meta.url);
const escrito = (/** @type {string} */ id) => existsSync(archivo(id));

/** Para resolver [[II.3]]: el capítulo escrito, o su entrada en el índice mientras no lo esté. */
const capitulos = new Map(
  todosLosCapitulos(indice).map((c) => [
    c.id,
    {
      titulo: c.titulo,
      url: escrito(c.id) ? `${BASE}/capitulos/${slug(c.id)}/` : `${BASE}/indice/${slug(tomoDe(c.id))}/#${slug(c.id)}`,
    },
  ]),
);

/**
 * Para resolver :ref[I.1#teo-de-morgan]: las etiquetas de cada capítulo escrito, con su nombre numerado. Se leen al
 * arrancar; en desarrollo, una etiqueta nueva en otro capítulo pide reiniciar el servidor.
 */
const etiquetas = new Map(
  todosLosCapitulos(indice)
    .filter((c) => escrito(c.id))
    .map((c) => [c.id, etiquetasDelCapitulo(readFileSync(archivo(c.id), 'utf8'), c.id)]),
);

/** La versión de Pyodide del repositorio: la misma en el navegador (CDN) y en las pruebas (Node). */
const PYODIDE = JSON.parse(readFileSync(new URL('../node_modules/pyodide/package.json', import.meta.url), 'utf8')).version;

export default defineConfig({
  site: 'https://rodrigomartinvg.github.io',
  base: BASE,
  trailingSlash: 'always',
  markdown: {
    // La capa de libro (directivas, numeración y referencias) y la matemática, compuesta con KaTeX al construir.
    processor: unified({
      remarkPlugins: [remarkMath, [remarkLibro, { capitulos, piezas: NOMBRES_DE_PIEZAS, etiquetas }]],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: { define: { __PYODIDE_VERSION__: JSON.stringify(PYODIDE) } },
  integrations: [
    starlight({
      title: 'Matemática y práctica',
      description:
        'Una obra de matemática de licenciatura en trece tomos que cierra el abismo entre la matemática que se estudia y la que se usa.',
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/RodrigoMartinVG/cerrar-el-abismo' }],
      // «Carbón y cobre» (src/styles/tema.css): fuentes servidas desde el sitio, KaTeX y los estilos de la obra.
      logo: { light: './src/assets/logo-claro.svg', dark: './src/assets/logo-oscuro.svg', alt: '' },
      favicon: '/favicon.svg',
      // El código con colores apagados, a tono con «carbón y cobre»: Vitesse en sus dos versiones; los marcos usan
      // los colores de la interfaz. (Al cambiar el tema, borrar la caché de contenido: site/.astro/data-store.json.)
      expressiveCode: { themes: ['vitesse-dark', 'vitesse-light'], useStarlightUiThemeColors: true },
      customCss: [
        '@fontsource-variable/source-serif-4/opsz.css',
        '@fontsource-variable/source-serif-4/opsz-italic.css',
        '@fontsource-variable/fraunces/index.css',
        '@fontsource-variable/jetbrains-mono/index.css',
        'katex/dist/katex.min.css',
        './src/styles/tema.css',
        './src/styles/obra.css',
      ],
      components: {
        // Bajo el título de un capítulo, sus metadatos del índice.
        PageTitle: './src/components/TituloDePagina.astro',
        // El contenido, con los elementos de la capa de libro (celdas de Python y figuras).
        MarkdownContent: './src/components/ContenidoMarkdown.astro',
        // Junto al selector de tema, los botones que ocultan los paneles laterales.
        ThemeSelect: './src/components/SelectorDeTema.astro',
      },
      // Los paneles que el lector ocultó en otra página, aplicados antes de dibujar para que no parpadeen.
      head: [
        {
          tag: 'script',
          content:
            "try{var d=document.documentElement;if(localStorage.getItem('obra:sin-indice')==='1')d.setAttribute('data-sin-indice','');if(localStorage.getItem('obra:sin-toc')==='1')d.setAttribute('data-sin-toc','')}catch(e){}",
        },
      ],
      sidebar: [
        { label: 'Inicio', link: '/' },
        {
          label: 'La obra',
          items: [
            { label: 'Índice temático', link: '/indice/' },
            { label: 'Itinerarios', link: '/itinerarios/' },
            { label: 'Mapa de dependencias', link: '/mapa/' },
            { label: 'Diccionario academia–práctica', link: '/diccionario/' },
            { label: 'Estado de la revisión', link: '/revision/' },
          ],
        },
        { label: 'Capítulos escritos', items: [{ autogenerate: { directory: 'capitulos' } }] },
        {
          label: 'Tomos',
          collapsed: true,
          items: indice.tomos.map((t) => ({ label: `${t.id}. ${t.titulo}`, link: `/indice/${slug(t.id)}/` })),
        },
      ],
    }),
  ],
});
