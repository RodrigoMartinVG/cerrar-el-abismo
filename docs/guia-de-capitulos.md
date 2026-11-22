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
- `fuente` dice de dónde sale el fragmento de la Entrada (especificación, 8.1): `propia` si se escribió para la obra,
  y entonces la Entrada lo dice, o la fuente con su licencia, que tiene que ser compatible con la de la obra
  (dominio público, CC0, MIT, BSD, Apache-2.0, CC BY 4.0 o CC BY-SA 4.0):

  ```yaml
  fuente:
    de: NIST SP 800-56A, revisión 3, sección 5.6.2.3.1
    url: https://doi.org/10.6028/NIST.SP.800-56Ar3
    licencia: dominio público
  ```
- `estado` es `borrador`, `revision` o `terminado` (sección 16.2 de la especificación). Pasar de un estado a otro
  exige la revisión registrada en `revision/` (decisión 0005; ver «La revisión», más abajo).
- `supone` (opcional) lista lo que el capítulo usa antes de que la obra lo construya, con el capítulo que lo trata con
  rigor. Se escribe en el orden en que el capítulo lo usa:

  ```yaml
  supone:
    - nocion: los números reales, la raíz cuadrada y el valor absoluto
      en: I.9
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

La Entrada y la Salida no se apoyan en licencias (especificación, 8.1): la Salida explica el fragmento solo con el
recorrido del capítulo. Una prueba comprueba que ninguna de las dos mencione un capítulo fuera del recorrido; que
tampoco dependan sin nombrarlo de un hecho que solo establece un capítulo posterior lo comprueba la lectura de estilo. Lo
que el lector trae de la secundaria, como el seno y el coseno, cuenta como conocido aunque la obra lo formalice después.

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
| `ejemplo{.contraejemplo}` | «Contraejemplo II.5.4 (Título).» | El mismo contador común |
| `ejercicio` | «Ejercicio II.5.1.» | Un contador propio |
| `demostracion` | Plegable, abierta, cerrada con ∎ | Sin número |
| `solucion` | Plegable, cerrada | Sin número |
| `puente` | Recuadro «Puente» | Sin número |
| `linea` | Recuadro «Una línea, un teorema» | Sin número |

El título entre corchetes y la etiqueta entre llaves son opcionales; el título va antes que la etiqueta. Los recuadros
de Starlight (`:::note`, `:::tip`, `:::caution`, `:::danger`) también se pueden usar. Cualquier otra directiva hace
fallar la construcción.

Los ejercicios llevan además su dificultad, su tipo y su sección, y los de cálculo, su respuesta (decisión 0006):

```markdown
:::ejercicio{#ej-manos nivel=1 tipo=calculo seccion="combinaciones-y-coeficientes-binomiales" respuesta=2598960 comprobacion="math.comb(52, 5)"}
Contar las manos de cinco cartas de una baraja de 52.
:::
```

- `nivel` es `1` (rutina), `2` (pide una idea) o `3` (desafío); `tipo`, uno de `demostracion`, `calculo`,
  `exploracion`, `traduccion` o `proyecto`.
- `seccion` es el identificador que el sitio da al título de la sección: el texto en minúsculas, con guiones en lugar
  de espacios y sin signos, con las tildes (`cálculo`, `subgrupos-y-el-teorema-de-lagrange`). Puede ser un `###` del
  Desarrollo, o Cálculo, Puente o Aplicaciones.
- `respuesta` es un entero, una fracción `a/b` o un decimal; el lector la comprueba en la página. `comprobacion`,
  opcional, es una expresión de Python, con `math` y `Fraction` a mano, que las pruebas evalúan para confirmarla.
- Los impares llevan su `solucion` a continuación, y los pares no; la prueba lo exige.

## Referencias

- `:ref[teo-dim]` escribe «Teorema II.5.3» con un enlace a un entorno o figura del mismo capítulo.
- `:ref[I.1#teo-de-morgan]` escribe «Teorema I.1.9» con un enlace a un entorno o figura de otro capítulo escrito. Solo
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

El lector puede editarla, ejecutarla y restaurarla. Las celdas de una página comparten intérprete, como un cuaderno,
pero cada una tiene que poder ejecutarse sola: no usa nada que defina otra, porque el lector puede empezar por
cualquiera. Si usa el azar, fija la semilla (`random.seed(1)`), para que su salida sea la que describe el texto. Los
paquetes que importa (NumPy, SciPy, SymPy) se cargan solos. Las pruebas ejecutan cada celda sola, en un espacio de
nombres propio: una celda que falla hace fallar la integración continua.

Después de una celda puede ir su salida esperada, en un bloque ` ```text salida `. El lector la ve sin ejecutar la celda
(y es lo que muestra el PDF), y las pruebas comprueban que la celda la imprime tal cual. Va siempre que el texto cite
números de la salida: así el texto no puede quedar desactualizado si la celda cambia. Un bloque ` ```python ` sin `celda` es código que solo se muestra.

## Figuras interactivas

```markdown
::figura[Pie de la figura, con $matemática$ si hace falta.]{#fig-normal pieza="normal-covector" alt="Descripción completa para quien no ve la figura."}
```

- Los demás atributos configuran la pieza y le llegan como `data-…`: por ejemplo,
  `::figura{pieza="tabla-de-verdad" formula="p → q" alt="…"}`.
- `pieza` es una de `packages/piezas/src/index.ts`; una pieza nueva va allí, con su matemática en un módulo con pruebas.
- `alt` es obligatorio y describe lo que la figura muestra; sin JavaScript, es lo que se lee.
- La figura se numera («Figura II.5.1») y se cita con `:ref[fig-normal]`.
- Un diagrama estático, como un autómata, también es una pieza: una que no responde al lector (decisión 0003).

## El mapa hacia atrás

Antes de dar por escrito un capítulo, se revisa su página de recorrido (`/mapa/<capítulo>/`):

- **Lo que usa** tiene que estar en su recorrido. Las citas a resultados de otros capítulos (`:ref[I.1#…]`) solo pueden
  ir a capítulos del recorrido, y una prueba lo comprueba. Si el capítulo necesita algo que no está, se agrega el
  requisito en el índice o, si es un uso anticipado, se declara en `supone`.
- **Lo que le dejaron** los capítulos anteriores en su `supone` se cumple y se declara en `cumple`.
- **Las menciones de capítulos anteriores que no son requisitos** se revisan una por una: pueden ser un aviso legítimo
  o delatar un requisito que falta.

## La revisión

Las pruebas verifican la forma; la revisión, que lo escrito sea verdadero (decisión 0005). Se registra en
`revision/<capítulo>.yaml` con `npm run revision`, que calcula la fecha y la huella del texto revisado:

- **Cada resultado** (teorema, proposición, lema o corolario): el enunciado se contrasta con una referencia concreta,
  con libro y número de teorema o página, y la demostración se sigue paso a paso.
- **Cinco aspectos** del capítulo entero: `estilo`, `practica`, `calculos`, `ejercicios` e `historia`.
- **La revisión del autor**, con los libros de las lecturas. Si otra persona revisa también, su revisión se registra
  como `segunda`, pero no se exige (enmienda de la decisión 0005).

Un capítulo está en `revision` mientras se revisa, y pasa a `terminado` cuando todos sus resultados y aspectos tienen
su revisión vigente. Si se corrige un resultado ya revisado, su huella cambia y
la revisión queda desactualizada: hay que registrarla de nuevo. Una revisión la firma una persona; una sesión de IA
solo escribe en el registro a pedido del revisor y con sus datos.

## El proceso de un capítulo

Un capítulo pasa por estas etapas, cada una con un propósito distinto. El Tomo I las recorrió en este orden, y lo que
salió mal en cada una es la razón de la regla que la acompaña.

1. **Escribirlo**, en orden de lectura, con el mapa hacia atrás (`supone` y `cumple`), el ritmo de seis pasos de la
   guía de estilo y sus metas de equilibrio (sección 6) desde el principio, no como una pasada posterior.
2. **La lectura previa contra los libros**, en una sesión distinta de la que escribió: enunciados, demostraciones,
   hipótesis que no se usan, cifras recalculadas, historia, afirmaciones sobre la práctica y la regla 8.1. Lo que
   encuentra se corrige; no cuenta como revisión. En el Tomo I encontró unos 300 problemas, varios de ellos errores
   de fondo.
3. **La ronda crítica**, por un lector que tampoco escribió el capítulo, después de cualquier pasada que agregue
   material: primero los errores, después si cada agregado se gana su lugar, después las metas. Termina diciendo qué
   meta no le sirvió al capítulo y por qué.
4. **Recalibrar las metas**: si varias rondas críticas coinciden en que una meta empuja mal, se cambia en la guía de
   estilo con su razón, y se aplica a los capítulos ya escritos.
5. **La revisión del autor**, registrada en `revision/` (decisión 0005).

Lo que el Tomo I enseñó, y que vale para los siguientes:

- **Una meta que es solo un piso produce capítulos inflados.** Toda meta tiene un techo o una proporción.
- **Un detector por palabras se deja engañar.** Lo que importa contar se marca de manera explícita, como
  `{.contraejemplo}`.
- **Lo que una sesión afirma de memoria se verifica o no entra.** Fechas, cifras, el comportamiento de un programa o
  de una biblioteca: el informe de cada pasada lista lo que no pudo verificar, y la ronda crítica lo resuelve.
- **Las sesiones que trabajan en paralelo no se leen entre sí.** Por eso la ronda crítica la hace otra.
- **Un número de resultado escrito a mano se rompe con el primer ejemplo nuevo.** Las pruebas y la documentación
  citan por etiqueta, no por número.
- **El fragmento de la Entrada se declara propio cuando lo es.** Es mejor que atribuirlo a una fuente que no lo
  tiene tal cual; el Puente cita las líneas reales cuando existen.

## Antes de subir

`npm run verify` (tipos, lint, formato, ortografía y pruebas) y `npm run e2e` (el sitio en el navegador). Si el
corrector marca un término técnico correcto, va a `ortografia/palabras.txt`.
