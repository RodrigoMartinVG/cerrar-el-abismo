# Cerrar el abismo

*Matemática y práctica* (título provisional): una obra de matemática de nivel licenciatura, en trece tomos, pensada
para la web. Cada tema se construye con rigor completo y, en el mismo capítulo, se enseña a reconocerlo en la
práctica: un motor 3D, un libro de física, un sistema de control, un modelo de datos. La misión es cerrar el abismo
entre la matemática que se estudia y la que se usa.

**Sitio:** https://rodrigomartinvg.github.io/cerrar-el-abismo/

## Estado

Fase 1 (especificación, sección 16): terminada la infraestructura, empieza la escritura. El sitio publica el índice temático completo: 13 tomos,
167 capítulos, sus requisitos, sus aplicaciones y los itinerarios por perfil, y un mapa de dependencias con el
recorrido completo hasta cada capítulo. La obra se escribe desde el principio: I.1 *Lógica y demostración*, I.2
*Conjuntos, relaciones y funciones*, I.3 *Naturales, enteros y divisibilidad* e I.4 *Teoría axiomática de conjuntos* ya están en borrador, con sus figuras interactivas y sus celdas de Python. La redacción sigue la [guía de estilo](docs/guia-de-estilo.md).

## Dónde está cada cosa

| Carpeta | Qué hay |
| --- | --- |
| [`docs/especificacion.md`](docs/especificacion.md) | El plan de la obra: visión, perfil de egreso, diseño de los capítulos, índice y plan de trabajo |
| [`docs/decisiones/`](docs/decisiones/README.md) | Las decisiones de arquitectura |
| [`indice/`](indice/) | El índice temático como datos: un YAML por tomo y los itinerarios (decisión 0002) |
| `libros/` | Los libros de referencia, para consulta interna; no se suben nunca |
| [`packages/indice/`](packages/indice/) | Esquema, carga y reglas del índice, el grafo de dependencias y su dibujo, y la versión en Markdown para la especificación |
| [`packages/libro/`](packages/libro/) | La capa de libro: directivas, numeración y referencias (decisión 0003) |
| [`packages/piezas/`](packages/piezas/) | Las piezas interactivas de las figuras |
| [`site/src/content/docs/capitulos/`](site/src/content/docs/capitulos/) | Los capítulos escritos ([cómo se escriben](docs/guia-de-capitulos.md)) |
| [`site/`](site/) | El sitio: Astro con Starlight (decisión 0001) |
| [`docs/historico/`](docs/historico/) | El diseño anterior: el índice con un motor 3D en paralelo |

## Trabajar en el proyecto

Requiere [mise](https://mise.jdx.dev/), que instala la versión de Node fijada en `mise.toml`.

```bash
mise install
```

```bash
npm install
```

```bash
npm run dev
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | El sitio en modo desarrollo |
| `npm run build` | Construye el sitio en `site/dist` |
| `npm test` | Las pruebas, incluidas las reglas del índice y su concordancia con la especificación |
| `npm run check` · `npm run lint` · `npm run format:check` | Tipos · lint · formato |
| `npm run indice:spec` | Reescribe desde `indice/` los bloques generados de la especificación (secciones 6, 9.6, 13 y 14) |
| `npm run ortografia` | El corrector ortográfico en español |
| `npm run e2e` | Las pruebas en el navegador, sobre el sitio construido |
| `npm run verify` | Tipos, lint, formato, ortografía y pruebas |

## Licencia

Por decidir (especificación, sección 17). Mientras tanto, el contenido es visible pero con todos los derechos
reservados.
