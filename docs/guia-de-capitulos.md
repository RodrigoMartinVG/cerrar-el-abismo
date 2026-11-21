# Cómo se escribe un capítulo

Guía práctica de la capa de libro (decisión 0003). El modelo completo es el primer capítulo,
[`site/src/content/docs/capitulos/i-1.md`](../site/src/content/docs/capitulos/i-1.md). El estilo de la redacción está en
[la guía de estilo](guia-de-estilo.md).

## El archivo

Un archivo por capítulo en `site/src/content/docs/capitulos/`, con el nombre de su identificador en minúsculas y con
guion: I.1 es `i-1.md`, y II.5 será `ii-5.md`.

```markdown
---
title: I.1 Lógica y demostración
description: Una frase para buscadores y tarjetas.
capitulo: I.1
estado: borrador
---
```

- `title` es el identificador seguido del título exacto del índice; una prueba lo comprueba.
- `estado` es `borrador`, `revision` o `terminado` (sección 16.2 de la especificación).
- `supone` (opcional) lista lo que el capítulo usa antes de que la obra lo construya, con el capítulo que lo trata con
  rigor. Se escribe en el orden en que el capítulo lo usa:

  ```yaml
  supone:
    - nocion: los números reales, la raíz cuadrada y el valor absoluto
      en: I.11
  ```

  La capa de libro lo muestra en el recuadro «Lo que este capítulo da por conocido», después del primer párrafo del
  Desarrollo, que lo presenta. La noción va en texto, sin fórmulas (los símbolos Unicode, como ℝ, sirven). Si `en` no
  es un capítulo posterior en el orden de lectura, la construcción y las pruebas fallan: una noción que se trata antes
  no es un uso anticipado sino un requisito, y va en `requiere`, en el índice. Además de figurar en la lista, la noción se
  declara en el texto, en el lugar donde se usa (guía de estilo, sección 1).
- `cumple` dice dónde trata el capítulo, con rigor, lo que otros capítulos escritos dejaron para él en su `supone`: es
  el mapa de dependencias verificado hacia atrás. La noción se copia tal cual, y las anclas son las etiquetas de los
  entornos donde se cumple:

  ```yaml
  cumple:
    - de: I.1
      nocion: los conjuntos, sus elementos, el conjunto vacío y las funciones
      anclas: [ax-extensionalidad, prop-inclusiones, def-funcion]
  ```

  Si falta una promesa, si una entrada ya no corresponde a ninguna (porque la noción cambió en el otro capítulo) o si
  un ancla no existe, las pruebas fallan. La página del recorrido de cada capítulo (`/mapa/i-3/`) muestra lo que le
  dejaron, lo que deja y dónde se cumple.
- `diccionario` lista los términos que el capítulo define, con lo que la práctica dice en su lugar (decisión 0004). Todo
  capítulo agrega al menos uno, y la página del diccionario los reúne:

  ```yaml
  diccionario:
    - termino: implicación
      ingles: implication
      practica: ['`!p || q`, o `not p or q`', 'el contrato de una función: precondición y poscondición']
      nota: Casi ningún lenguaje tiene un operador para la implicación. Que sea verdadera cuando…
      ancla: def-implicacion
  ```

  `practica` es una lista; `nota` dice en qué coinciden los dos lados y dónde dejan de coincidir, que es lo que el
  diccionario aporta; `ancla` (opcional) es la etiqueta del entorno que define el término, y `campos` (opcional), los
  campos del índice de los nombres prácticos (`[3d, fisica]`). Los textos son Markdown en línea, sin fórmulas: los
  símbolos Unicode y el código entre comillas invertidas sirven. Un valor que empieza con comilla invertida o asterisco
  va entre comillas simples, para que el YAML lo lea como texto. Un término se define en un solo capítulo.
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
| `axioma`, `definicion`, `teorema`, `lema`, `proposicion`, `corolario`, `ejemplo`, `observacion` | «Teorema II.5.3 (Título).» | Un contador común por capítulo |
| `ejercicio` | «Ejercicio II.5.1.» | Un contador propio |
| `demostracion` | Plegable, abierta, cerrada con ∎ | Sin número |
| `solucion` | Plegable, cerrada | Sin número |
| `puente` | Recuadro «Puente» | Sin número |
| `linea` | Recuadro «Una línea, un teorema» | Sin número |

El título entre corchetes y la etiqueta entre llaves son opcionales; el título va antes que la etiqueta. Los recuadros
de Starlight (`:::note`, `:::tip`, `:::caution`, `:::danger`) también se pueden usar. Cualquier otra directiva hace
fallar la construcción.

## Referencias

- `:ref[teo-dim]` escribe «Teorema II.5.3» con un enlace a un entorno o figura del mismo capítulo.
- `:ref[I.1#teo-de-morgan]` escribe «Teorema I.1.5» con un enlace a un entorno o figura de otro capítulo escrito. Solo
  vale para capítulos del recorrido, es decir, requisitos directos o indirectos (una prueba lo comprueba): un resultado
  que el capítulo usa tiene que estar en lo que el lector ya leyó. La numeración se calcula leyendo ese capítulo; en desarrollo, una etiqueta nueva en otro capítulo pide reiniciar el
  servidor.
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

- Los demás atributos configuran la pieza y le llegan como `data-…`: por ejemplo,
  `::figura{pieza="tabla-de-verdad" formula="p → q" alt="…"}`.
- `pieza` es una de `packages/piezas/src/index.ts`; una pieza nueva va allí, con su matemática en un módulo con pruebas.
- `alt` es obligatorio y describe lo que la figura muestra; sin JavaScript, es lo que se lee.
- La figura se numera («Figura II.5.1») y se cita con `:ref[fig-normal]`.

## El mapa hacia atrás

Antes de dar por escrito un capítulo, se revisa su página de recorrido (`/mapa/<capítulo>/`):

- **Lo que usa** tiene que estar en su recorrido. Las citas a resultados de otros capítulos (`:ref[I.1#…]`) solo pueden
  ir a capítulos del recorrido, y una prueba lo comprueba. Si el capítulo necesita algo que no está, se agrega el
  requisito en el índice o, si es un uso anticipado, se declara en `supone`.
- **Lo que le dejaron** los capítulos anteriores en su `supone` se cumple y se declara en `cumple`.
- **Las menciones de capítulos anteriores que no son requisitos** se revisan una por una: pueden ser un aviso legítimo
  o delatar un requisito que falta.

## Antes de subir

`npm run verify` (tipos, lint, formato, ortografía y pruebas) y `npm run e2e` (el sitio en el navegador). Si el
corrector marca un término técnico correcto, va a `ortografia/palabras.txt`.
