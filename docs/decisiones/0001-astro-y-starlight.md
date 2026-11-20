# 0001. El sitio se construye con Astro y Starlight

*Fecha: 2026-11-20 · Estado: aceptada*

## Contexto

La obra se publica primero en la web (especificación, sección 11): diez tomos, 121 capítulos, matemática compuesta,
Python en vivo, figuras interactivas, herramientas transversales (diccionario, conversor de convenciones, grafo de
dependencias, itinerarios) y, más adelante, un PDF por tomo. La versión 0.3 de la especificación proponía Quarto,
con MyST como alternativa.

Se compararon tres caminos:

- **Quarto.** Trae resuelto lo propio de un libro (teoremas numerados, referencias, bibliografía, PDF) y celdas
  Pyodide con ejercicios (`quarto-live`). Pero la interfaz es difícil de adaptar, la numeración «II.5» y las
  referencias entre tomos piden filtros en Lua, y mezcla Python, Lua y JavaScript.
- **MyST (Jupyter Book 2).** Muy semántico, con referencias entre proyectos. Más joven; el Python en vivo
  (JupyterLite) es más pesado y el diseño cuesta adaptarlo.
- **Astro a medida.** Control total de la web, metadatos tipados y el mismo stack que Manifold_Gaming, el otro
  proyecto del autor (Astro, Starlight, TypeScript, Vitest, Playwright, mise). La capa de libro hay que construirla.

## Decisión

El sitio se construye con **Astro y Starlight**, en TypeScript estricto, en un monorepo de npm:

- `site/`: el sitio. Starlight da la navegación, la búsqueda (Pagefind), el modo oscuro, la accesibilidad básica y
  la interfaz en español.
- `packages/`: las piezas reutilizables, cada una con sus pruebas junto al código (`*.test.ts`). La primera es
  `packages/indice` (decisión 0002).
- El contenido de los capítulos será Markdown con un **conjunto cerrado de directivas** (`:::teorema`,
  `:::demostracion`, `:::puente`, `::figura`, `::celda`…), no MDX libre, para que la misma fuente produzca la web y
  el PDF.
- La matemática se compone con KaTeX al construir el sitio.
- Python en vivo con Pyodide en un Web Worker, cargado al primer uso; en la integración continua, las mismas celdas
  se ejecutarán con Pyodide en Node.
- Herramientas y versiones como en Manifold_Gaming: Node 26 fijado con mise y `.nvmrc`, ESLint, Prettier, Vitest y
  GitHub Actions con despliegue en GitHub Pages.

## Consecuencias

- La capa de libro es trabajo propio: numeración «II.5.3», referencias entre tomos, bibliografía y PDF. El riesgo es
  construir un framework en vez de escribir el libro; se acota con el conjunto cerrado de directivas y con el
  capítulo de prueba de la fase 0 como criterio de aceptación.
- El PDF (sección 11.7) se genera desde el mismo árbol de Markdown. Si por LaTeX o por Typst se decide cuando haga
  falta, antes de cerrar el Tomo II.
- Todo el código vive en una sola familia de lenguajes, con tipos y pruebas, y comparte convenciones con el otro
  proyecto del autor.

## Alternativas descartadas

Quarto y MyST, por las razones del contexto. Si el capítulo de prueba mostrara que la capa de libro cuesta más de lo
previsto, esta decisión se revisa antes de escribir capítulos.
