# Cómo se escribe un capítulo

Guía práctica de la capa de libro (decisión 0003). El modelo completo es el capítulo de prueba,
[`site/src/content/docs/capitulos/ii-5.md`](../site/src/content/docs/capitulos/ii-5.md).

## El archivo

Un archivo por capítulo en `site/src/content/docs/capitulos/`, con el nombre de su identificador en minúsculas y con
guion: II.5 es `ii-5.md`.

```markdown
---
title: II.5 Espacio dual y covectores
description: Una frase para buscadores y tarjetas.
capitulo: II.5
estado: borrador
---
```

- `title` es el identificador seguido del título exacto del índice; una prueba lo comprueba.
- `estado` es `borrador`, `revision` o `terminado` (sección 16.2 de la especificación).
- Los requisitos, el tipo y las aplicaciones no se repiten: vienen del índice (`indice/tomo-NN.yaml`).

## Las secciones

Las de la plantilla (sección 7), como títulos `##` y en este orden: Entrada, Motivación, Desarrollo, Cálculo, Puente,
Aplicaciones, Salida, Ejercicios y «Notas y «Para seguir»». La sección Puente lleva un recuadro `:::puente`.

## Los entornos

```markdown
:::teorema[Dimensión del dual]{#teo-dim}
La familia dual de una base de $V$ es una base de $V^*$.
:::

:::demostracion
…
:::
```

| Directiva | Se muestra como | Numeración |
| --- | --- | --- |
| `definicion`, `teorema`, `lema`, `proposicion`, `corolario`, `ejemplo`, `observacion` | «Teorema II.5.3 (Título).» | Un contador común por capítulo |
| `ejercicio` | «Ejercicio II.5.1.» | Un contador propio |
| `demostracion` | Plegable, abierta, cerrada con ∎ | Sin número |
| `solucion` | Plegable, cerrada | Sin número |
| `puente` | Recuadro «Puente» | Sin número |
| `linea` | Recuadro «Una línea, un teorema» | Sin número |

El título entre corchetes y la etiqueta entre llaves son opcionales; el título va antes que la etiqueta. Los recuadros
de Starlight (`:::note`, `:::tip`, `:::caution`, `:::danger`) también se pueden usar. Cualquier otra directiva hace
fallar la construcción.

## Referencias

- `:ref[teo-dim]` escribe «Teorema II.5.3» con un enlace. Solo vale para etiquetas del mismo capítulo.
- `[[II.3]]` escribe «II.3» con un enlace al capítulo escrito, o a su entrada en el índice si todavía no lo está.

## Matemática

`$…$` en línea y `$$…$$` aparte, en LaTeX; KaTeX la compone al construir el sitio. Las convenciones de notación son
las de la sección 12 de la especificación: por ejemplo, vectores columna y `\mathsf T` para la transpuesta.

## Celdas de Python

````markdown
```python celda
import numpy as np
print(np.linalg.det(np.eye(3)))
```
````

El lector puede editarla, ejecutarla y restaurarla. Las celdas de una página comparten intérprete, en orden. Los
paquetes que importa (NumPy, SciPy, SymPy) se cargan solos. Las pruebas ejecutan todas las celdas: una celda que falla
hace fallar la integración continua. Un bloque ` ```python ` sin `celda` es código que solo se muestra.

## Figuras interactivas

```markdown
::figura[Pie de la figura, con $matemática$ si hace falta.]{#fig-normal pieza="normal-covector" alt="Descripción completa para quien no ve la figura."}
```

- `pieza` es una de `packages/piezas/src/index.ts`; una pieza nueva va allí, con su matemática en un módulo con pruebas.
- `alt` es obligatorio y describe lo que la figura muestra; sin JavaScript, es lo que se lee.
- La figura se numera («Figura II.5.1») y se cita con `:ref[fig-normal]`.

## Antes de subir

`npm run verify` (tipos, lint, formato, ortografía y pruebas) y `npm run e2e` (el sitio en el navegador). Si el
corrector marca un término técnico correcto, va a `ortografia/palabras.txt`.
