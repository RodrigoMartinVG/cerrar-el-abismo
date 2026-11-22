# 0003. La capa de libro: directivas cerradas, celdas de Python y figuras

*Fecha: 2026-11-20 · Estado: aceptada, enmendada el 2026-11-21*

## Contexto

La decisión 0001 eligió Astro con Starlight y dejó como trabajo propio la capa de libro: entornos numerados,
referencias, código en vivo y figuras interactivas, con un conjunto cerrado de directivas para que la misma fuente
sirva a la web y al PDF. La fase 0 (especificación, sección 16) exige un capítulo de prueba publicado con todas las
comprobaciones en verde.

## Decisión

- **Dónde viven los capítulos.** Un archivo Markdown por capítulo en `site/src/content/docs/capitulos/`, con el
  nombre de su identificador (`i-1.md`). El frontmatter declara `title`, `capitulo` y `estado`. Los requisitos, el
  tipo y las aplicaciones siguen en el índice (decisión 0002), y la página los muestra bajo el título.
- **La capa de libro es un plugin de remark**, `packages/libro`, que corre en el procesador `unified` de Astro:
  - Trece entornos: `axioma`, `definicion`, `teorema`, `lema`, `proposicion`, `corolario`, `ejemplo`, `observacion`,
    `demostracion`, `ejercicio`, `solucion`, `puente` y `linea`, escritos como `:::teorema[Título]{#etiqueta}`. Los
    resultados comparten un contador por capítulo («Teorema II.5.3») y los ejercicios llevan uno propio. Las
    demostraciones se pueden plegar y cierran con ∎; las soluciones empiezan plegadas.
  - `::figura[Pie]{#etiqueta pieza="…" alt="…"}` monta una pieza interactiva de `packages/piezas`. El texto
    alternativo es obligatorio: sin JavaScript, es lo que se lee.
  - Un bloque ` ```python celda ` es una celda editable, con «Ejecutar» y «Restaurar».
  - `:ref[etiqueta]` enlaza un entorno o figura del capítulo con su nombre numerado, y `[[II.3]]` enlaza un capítulo:
    el escrito o, mientras no lo esté, su entrada en el índice.
  - El campo `supone` del frontmatter lista lo que el capítulo usa antes de que la obra lo construya; la capa de libro
    lo muestra en un recuadro al comienzo del Desarrollo y comprueba que cada noción se trate en un capítulo posterior.
  - Una directiva desconocida, una referencia rota, una pieza inexistente o una figura sin texto alternativo hacen
    fallar la construcción, con el lugar exacto. Los recuadros de Starlight (`:::note` y los demás) se dejan pasar.
- **Python en el navegador con Pyodide**, en un Web Worker que se carga la primera vez que el lector ejecuta una celda.
  La versión es la del paquete `pyodide` del repositorio, y el navegador la descarga de su CDN. Todas las celdas de una
  página comparten intérprete, como un cuaderno.

  *Enmienda (2026-11-22), tras la revisión del Tomo I:* compartir el intérprete no autoriza que una celda dependa de
  otra. Cada celda tiene que poder ejecutarse sola, porque el lector puede empezar por cualquiera, y las pruebas
  ejecutan cada una en un espacio de nombres propio. Las que usan el azar fijan la semilla, para que su salida sea la
  que describe el texto.

  *Enmienda (2026-11-22), sobre las figuras:* un diagrama estático, como el de un autómata o el de las coclases de un
  grupo, es una pieza sin interacción, con la misma directiva `::figura`. Así no se agrega una directiva, y cada
  diagrama sigue teniendo su texto alternativo y su versión impresa.
- **Las celdas se editan con CodeMirror 6**, con el resaltado de Python, números de línea, deshacer y Ctrl+Enter para
  ejecutar. Se carga aparte, solo en las páginas con celdas, y mientras llega el código se ve como texto. Sus colores
  son variables de `tema.css` que repiten los de los bloques de solo lectura (Expressive Code con Vitesse), para que
  una celda y un bloque se vean iguales. Los bloques que no se ejecutan siguen con Expressive Code, que da el marco y
  el botón de copiar sin cargar un editor.
- **Comprobaciones.** Las pruebas unitarias cubren la capa de libro y la matemática de las piezas. Para cada capítulo
  escrito, se comprueba que está en el índice con su título, que sigue la plantilla de la sección 7 y que sus celdas se
  ejecutan con el mismo Pyodide, en Node. Playwright recorre el sitio construido, y cspell revisa la ortografía.

## Consecuencias

- Escribir un capítulo es escribir Markdown con trece entornos y tres formas de referencia; la guía está en
  [docs/guia-de-capitulos.md](../guia-de-capitulos.md).
- Las referencias a entornos de otros capítulos («el Teorema II.3.4») todavía no existen: se resolverán con un
  registro global de etiquetas cuando haya un segundo capítulo escrito.

  *Enmienda (2026-11-21), con el segundo capítulo:* existen. `:ref[I.1#teo-de-morgan]` escribe «Teorema I.1.5» con un
  enlace. El registro se arma al construir el sitio, leyendo cada capítulo escrito con las mismas reglas de numeración
  que el plugin (`packages/libro/src/etiquetas.ts`); una prueba comprueba que los dos cálculos coinciden.
- El PDF podrá generarse recorriendo el mismo árbol de Markdown, porque las directivas son pocas y cerradas.

## Alternativas descartadas

- **MDX con componentes libres.** Es más flexible, pero cada componente nuevo sería un caso más para el PDF.
- **Pyodide empaquetado en el sitio.** Pesa más de 10 MB por despliegue; la CDN con la versión fijada da el mismo
  resultado.
