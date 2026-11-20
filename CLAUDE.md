# Para empezar

Lo primero que necesita quien trabaje en este repositorio, sea una persona o una sesión. El resto se enlaza, no se
repite.

## Dónde está cada cosa

- **El plan de la obra:** [docs/especificacion.md](docs/especificacion.md). Es la fuente de verdad del diseño: visión,
  perfil de egreso (2.1), plantilla de capítulo (7), el Puente (8), aplicaciones e hilos (9), plataforma web (11),
  convenciones (12) y plan de trabajo (16).
- **Por qué está hecho así:** [docs/decisiones](docs/decisiones/README.md). Una decisión va antes que el código
  cuando sus consecuencias son largas.
- **El índice temático:** los datos están en `indice/` y su código en `packages/indice` (decisión 0002).
- **El sitio:** `site/`, con Astro y Starlight (decisión 0001).
- **El diseño anterior** (índice con un motor 3D en paralelo): `docs/historico/`. Ya no es el plan.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` · `npm run build` | El sitio en desarrollo · construido en `site/dist` |
| `npm test` | Vitest: reglas del índice, concordancia con la especificación y el resto de las pruebas |
| `npm run check` | Tipos: `tsc` del paquete del índice y `astro check` del sitio |
| `npm run lint` · `npm run format:check` | ESLint · Prettier |
| `npm run indice:spec` | Reescribe la sección 13 de la especificación desde `indice/` (valida antes) |
| `npm run verify` | check, lint, formato y pruebas: lo mismo que la integración continua |

Node 26, fijado con mise (`mise.toml`) y `.nvmrc`. Node ejecuta el TypeScript directamente: solo sintaxis que se pueda
borrar (`erasableSyntaxOnly`) y los imports relativos con su extensión `.ts`.

## Reglas que valen en todo el proyecto

- **El índice se cambia en `indice/`, nunca en la especificación.** La sección 13 se genera entre sus dos marcas con
  `npm run indice:spec`; si se edita a mano, las pruebas fallan.
- **Textos en español**, también los comentarios, los nombres del dominio (`capitulo`, `requiere`, `tomo`) y las
  decisiones. Se respetan las convenciones de la sección 12 de la especificación.
- **Las pruebas viven junto al código** (`*.test.ts`) y todo cambio pasa `npm run verify` antes de subir.
- **Una rama por cambio** y pull request a `main`; la integración continua verifica y, en `main`, publica el sitio
  en GitHub Pages.
- **El contenido de los capítulos será Markdown con un conjunto cerrado de directivas**, no MDX libre (decisión
  0001), para que la misma fuente sirva a la web y al PDF.
- Las pruebas y borradores desechables van en `scratch/`, que nunca se sube.
