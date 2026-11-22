# Para empezar

Lo primero que necesita quien trabaje en este repositorio, sea una persona o una sesión. El resto se enlaza, no se
repite.

## Dónde está cada cosa

- **El plan de la obra:** [docs/especificacion.md](docs/especificacion.md). Es la fuente de verdad del diseño: visión,
  perfil de egreso (2.1), plantilla de capítulo (7), el Puente (8), aplicaciones e hilos (9), plataforma web (11),
  convenciones (12) y plan de trabajo (16).
- **Qué falta y en qué orden:** [roadmap.md](roadmap.md), la hoja de ruta. Se actualiza a medida que se avanza: el commit
  que cierra un punto marca su casilla y mueve la línea «En curso».
- **Por qué está hecho así:** [docs/decisiones](docs/decisiones/README.md). Una decisión va antes que el código
  cuando sus consecuencias son largas.
- **El índice temático:** los datos están en `indice/` (13 tomos, 167 capítulos) y su código en `packages/indice`
  (decisión 0002).
- **El sitio:** `site/`, con Astro y Starlight (decisión 0001).
- **Los capítulos escritos:** `site/src/content/docs/capitulos/` (uno por archivo, `i-1.md`). Cómo se escriben:
  [docs/guia-de-capitulos.md](docs/guia-de-capitulos.md); con qué estilo: [docs/guia-de-estilo.md](docs/guia-de-estilo.md); la capa de libro está en `packages/libro` y las piezas
  interactivas en `packages/piezas` (decisión 0003).
- **El diccionario academia–práctica:** cada capítulo declara sus términos en el campo `diccionario` de su frontmatter,
  y la página `/diccionario/` los reúne (decisión 0004). Los conceptos con varios nombres en español tienen uno solo en la
  obra, el de `ortografia/terminologia.yaml`; una prueba rechaza las otras formas.
- **La revisión:** cada capítulo tiene su registro en `revision/` (`i-9.yaml`), con quién revisó cada resultado y
  aspecto, contra qué y la huella del texto revisado; las pruebas lo exigen según el `estado` (decisión 0005).
- **El diseño anterior** (índice con un motor 3D en paralelo): `docs/historico/`. Ya no es el plan.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` · `npm run build` | El sitio en desarrollo · construido en `site/dist` |
| `npm test` | Vitest: el índice y su concordancia con la especificación, la capa de libro, las piezas y los capítulos (ejecuta sus celdas con Pyodide) |
| `npm run check` | Tipos: `tsc` de cada paquete y `astro check` del sitio |
| `npm run lint` · `npm run format:check` | ESLint · Prettier |
| `npm run indice:spec` | Reescribe los bloques generados de la especificación (secciones 6, 9.6, 13 y 14) desde `indice/`; valida antes |
| `npm run revision` | Cómo va la revisión de cada capítulo; `-- I.7` la detalla; `-- I.7 <ancla o aspecto> --por … --contra …` registra una (decisión 0005) |
| `npm run densidad` | Ejemplos, contraejemplos, figuras, ejercicios y extensión de cada capítulo, frente a sus metas (guía de estilo, sección 6) |
| `npm run pdf` | Convierte el Tomo I a LaTeX en `pdf/tomo-i.tex` (decisión 0007); lo compila LuaLaTeX, o el trabajo «PDF» de la integración continua |
| `npm run ortografia` | cspell con el diccionario español y el del proyecto (`ortografia/palabras.txt`) |
| `npm run e2e` | Playwright sobre el sitio construido (hacer `npm run build` antes); `E2E_SIN_RED=1` salta la celda de Python |
| `npm run verify` | check, lint, formato, ortografía y pruebas: lo mismo que el primer trabajo de la integración continua |

Node 26, fijado con mise (`mise.toml`) y `.nvmrc`. Node ejecuta el TypeScript directamente: solo sintaxis que se pueda
borrar (`erasableSyntaxOnly`) y los imports relativos con su extensión `.ts`.

## Reglas que valen en todo el proyecto

- **El índice se cambia en `indice/`, nunca en la especificación.** La tabla de tomos (6), los itinerarios (9.6), el
  índice (13) y la extensión (14) se generan entre sus marcas con `npm run indice:spec`; si se editan a mano, las
  pruebas fallan.
- **Los libros de referencia viven en `libros/`, que git ignora.** Se consultan para verificar demostraciones,
  enunciados y notación, y se citan en «Lecturas»; nunca se copian pasajes ni se suben al repositorio, que es público.
  La redacción es siempre original. La obra declara que se redacta con asistencia de IA y cómo se revisa (página
  «Cómo se hace», `site/src/content/docs/como-se-hace.md`).
- **La redacción sigue la guía de estilo** ([docs/guia-de-estilo.md](docs/guia-de-estilo.md)): el equilibrio de los
  mejores libros de matemática entre explicar y ser preciso. Es una prioridad del autor, no un detalle.
- **La obra se escribe desde el principio**, en orden de lectura, empezando por I.1 (especificación, 16.1).
- **Textos en español**, también los comentarios, los nombres del dominio (`capitulo`, `requiere`, `tomo`) y las
  decisiones. Se respetan las convenciones de la sección 12 de la especificación.
- **Las pruebas viven junto al código** (`*.test.ts`) y todo cambio pasa `npm run verify` antes de subir.
- **Se trabaja directo sobre `main`, sin pull requests** (decisión del autor, 2026-11-20). Cada commit pasa
  `npm run verify` antes de subir; la integración continua lo verifica otra vez y, si todo pasa, publica el sitio en
  GitHub Pages.
- **El contenido de los capítulos será Markdown con un conjunto cerrado de directivas**, no MDX libre (decisión
  0001), para que la misma fuente sirva a la web y al PDF.
- **Una revisión la firma una persona** (decisión 0005). Una sesión de IA puede hacer una lectura previa y corregir lo
  que encuentre, pero nunca registra una revisión por su cuenta ni a nombre de nadie: solo ejecuta `npm run revision`
  cuando el revisor se lo pide, con sus datos.
- Las pruebas y borradores desechables van en `scratch/`, que nunca se sube.
- Para ver el sitio, servir `site/dist` con `vite preview` (como `.claude/launch.json` y Playwright): en este entorno
  `astro preview` pasa a segundo plano y el comando termina enseguida.
