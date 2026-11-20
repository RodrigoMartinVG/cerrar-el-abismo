// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cargarIndice, slug } from '@cerrar-el-abismo/indice';

/**
 * El sitio de la obra (decisión 0001): Astro con Starlight, publicado en GitHub Pages en
 * https://rodrigomartinvg.github.io/cerrar-el-abismo/ ; por eso toda dirección empieza con `base`.
 * El índice temático sale de los datos de indice/ (decisión 0002).
 */
const { tomos } = cargarIndice();

export default defineConfig({
  site: 'https://rodrigomartinvg.github.io',
  base: '/cerrar-el-abismo',
  trailingSlash: 'always',
  // La matemática se compone con KaTeX al construir el sitio: $…$ en línea y $$…$$ aparte.
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
  integrations: [
    starlight({
      title: 'Matemática y práctica',
      description:
        'Una obra de matemática de licenciatura en diez tomos que cierra el abismo entre la matemática que se estudia y la que se usa.',
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es' } },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/RodrigoMartinVG/cerrar-el-abismo' }],
      customCss: ['katex/dist/katex.min.css', './src/styles/obra.css'],
      sidebar: [
        { label: 'Inicio', link: '/' },
        {
          label: 'La obra',
          items: [
            { label: 'Índice temático', link: '/indice/' },
            { label: 'Itinerarios', link: '/itinerarios/' },
          ],
        },
        { label: 'Tomos', items: tomos.map((t) => ({ label: `${t.id}. ${t.titulo}`, link: `/indice/${slug(t.id)}/` })) },
      ],
    }),
  ],
});
