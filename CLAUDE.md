# Para empezar

Lo primero que necesita quien trabaje en este repositorio, sea una persona o una sesión. El resto se enlaza, no se
repite.

## Dónde está cada cosa

- **El plan de la obra:** [docs/especificacion.md](docs/especificacion.md). Es la fuente de verdad del diseño: visión,
  perfil de egreso (2.1), plantilla de capítulo (7), el Puente (8), aplicaciones e hilos (9), plataforma web (11),
  convenciones (12) y plan de trabajo (16).
- **Por qué está hecho así:** [docs/decisiones](docs/decisiones/README.md). Una decisión va antes que el código
  cuando sus consecuencias son largas.
- **El índice temático:** los datos están en `indice/` (13 tomos, 150 capítulos) y su código en `packages/indice`
  (decisión 0002).
- **El sitio:** `site/`, con Astro y Starlight (decisión 0001).
- **El diseño anterior** (índice con un motor 3D en paralelo): `docs/historico/`. Ya no es el plan.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` · `npm run build` | El sitio en desarrollo · construido en `site/dist` |
| `npm test` | Vitest: reglas del índice, concordancia con la especificación y el resto de las pruebas |
| `npm run check` | Tipos: `tsc` del paquete del índice y `astro check` del sitio |
| `npm run lint` · `npm run format:check` | ESLint · Prettier |
| `npm run indice:spec` | Reescribe los bloques generados de la especificación (secciones 6, 9.6, 13 y 14) desde `indice/`; valida antes |
| `npm run verify` | check, lint, formato y pruebas: lo mismo que la integración continua |

Node 26, fijado con mise (`mise.toml`) y `.nvmrc`. Node ejecuta el TypeScript directamente: solo sintaxis que se pueda
borrar (`erasableSyntaxOnly`) y los imports relativos con su extensión `.ts`.

## Reglas que valen en todo el proyecto

- **El índice se cambia en `indice/`, nunca en la especificación.** La tabla de tomos (6), los itinerarios (9.6), el
  índice (13) y la extensión (14) se generan entre sus marcas con `npm run indice:spec`; si se editan a mano, las
  pruebas fallan.
- **Los libros de referencia viven en `libros/`, que git ignora.** Se consultan para verificar demostraciones,
  enunciados y notación, y se citan en «Lecturas»; nunca se copian pasajes ni se suben al repositorio, que es público.
  La redacción de la obra es siempre propia.
- **Textos en español**, también los comentarios, los nombres del dominio (`capitulo`, `requiere`, `tomo`) y las
  decisiones. Se respetan las convenciones de la sección 12 de la especificación.
- **Las pruebas viven junto al código** (`*.test.ts`) y todo cambio pasa `npm run verify` antes de subir.
- **Una rama por cambio** y pull request a `main`; la integración continua verifica y, en `main`, publica el sitio
  en GitHub Pages.
- **El contenido de los capítulos será Markdown con un conjunto cerrado de directivas**, no MDX libre (decisión
  0001), para que la misma fuente sirva a la web y al PDF.
- Las pruebas y borradores desechables van en `scratch/`, que nunca se sube.
