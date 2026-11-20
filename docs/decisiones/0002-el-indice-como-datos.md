# 0002. El índice temático es datos

*Fecha: 2026-11-20 · Estado: aceptada*

## Contexto

Hasta la versión 0.3, el índice temático vivía solo como prosa en la sección 13 de la especificación, y un script
suelto la analizaba para comprobar el grafo de dependencias. El sitio necesita el índice completo desde el primer día
(páginas de tomo, grafo, itinerarios, hilos), aunque todavía no haya capítulos escritos. Tener el índice en dos
lugares escritos a mano los haría divergir.

## Decisión

- El índice es **datos**: un YAML por tomo en `indice/tomo-NN.yaml`, con sus partes y capítulos (id, título,
  páginas, requisitos, tipo, contenidos, Puente, aplicaciones y lecturas), y los itinerarios en
  `indice/itinerarios.yaml`.
- `packages/indice` define su **esquema** (Zod), lo **carga** y valida sus **reglas**: orden y numeración, requisitos
  existentes y anteriores, requisitos de otros tomos solo si el tomo se requiere o el capítulo se importa por
  interfaz, ningún capítulo de núcleo dependiente de uno complementario, de 2 a 4 aplicaciones de al menos dos campos,
  los hilos fijos en todos los tomos y sin pasar de un tercio, referencias existentes e itinerarios cerrados bajo
  dependencias.
- La sección 13 de la especificación **se genera** desde los datos, entre dos marcas, con `npm run indice:spec`.
  Una prueba falla si quedó desactualizada.
- Los metadatos de un capítulo viven en el índice. Cuando se escriba el capítulo, su archivo declarará solo su `id`;
  así hay una sola fuente para los requisitos y el tipo.

## Consecuencias

- Un cambio de estructura (un capítulo nuevo, un requisito, una aplicación) se hace en `indice/`, y después se
  regenera la especificación. Editar la sección 13 a mano hace fallar las pruebas.
- La migración se verificó con una ida y vuelta: los datos extraídos regeneran la sección 13 idéntica, carácter por
  carácter, y cumplen todas las reglas.
- Las secciones 6 (tabla de tomos), 9.6 (itinerarios) y 14 (extensión) todavía repiten datos a mano. Si divergen, se
  generan también.

## Alternativas descartadas

- **Mantener la especificación como fuente y extraer los datos al construir.** El sitio dependería de analizar
  prosa, una fuente frágil.
- **Metadatos solo en la cabecera de cada capítulo** (como proponía la sección 11.4). No sirve mientras la mayoría de
  los capítulos no existe, y repartiría el grafo entre 121 archivos.
