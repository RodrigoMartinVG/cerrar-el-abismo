# 0007. El PDF se compone con LaTeX, desde el mismo árbol de Markdown

*Fecha: 2026-11-22 · Estado: aceptada*

## Contexto

La especificación pide un PDF por tomo (11.7), con las figuras interactivas como fotogramas y un enlace a la versión
web, y las celdas con su salida. La decisión 0001 dejó para más adelante la elección entre LaTeX y Typst, y la
decisión 0003 cerró el conjunto de directivas justamente para que la misma fuente sirviera a la web y al papel. La
hoja de ruta (E6) pide un prototipo con el Tomo I, para ver qué directivas y qué figuras necesitan una versión impresa
antes de que haya más tomos escritos.

## Decisión

- **LaTeX, con LuaLaTeX.** Las fórmulas de los capítulos ya están escritas en LaTeX, porque es lo que entiende KaTeX:
  con LaTeX pasan tal cual al PDF. Con Typst habría que traducir cada fórmula de cada capítulo a otra sintaxis, o
  apoyarse en un paquete que la traduzca al compilar, y cada diferencia entre los dos sería un error posible en
  ciento sesenta y siete capítulos. LuaLaTeX lee UTF-8 y usa las fuentes del sistema, así que el texto, con sus «»,
  sus flechas y sus símbolos, no necesita escaparse.
- **Un conversor propio** (`packages/libro/src/latex.ts`) recorre el mismo árbol de Markdown que la capa de libro y
  escribe LaTeX: los entornos con el mismo nombre numerado que en la web («Teorema I.7.3»), en cursiva los enunciados
  y en redonda las definiciones, los ejemplos y los ejercicios; las referencias, con ese nombre y un enlace interno;
  las celdas y su salida esperada, como código; los ejercicios, con su grado y su respuesta para comprobar; el Puente
  y «Una línea, un teorema», como recuadros. `npm run pdf` escribe `pdf/tomo-i.tex` con el tomo entero.
- **Las figuras**, por ahora, como un recuadro con su texto alternativo y la dirección de la versión web. El paso
  siguiente es un fotograma de cada una, tomado con Playwright del sitio construido, que ya tiene el navegador.
- **La compilación** la hace un trabajo de la integración continua (`.github/workflows/pdf.yml`), que instala TeX
  Live y deja el PDF como artefacto, sin bloquear la publicación del sitio. Así nadie necesita TeX en su computadora
  para escribir.

## Consecuencias

- Toda directiva nueva necesita su caso en el conversor; el conjunto cerrado de la decisión 0003 es lo que hace esto
  posible, y una prueba del conversor lo cubre.
- Las macros que KaTeX acepta y LaTeX no, si aparecen, se definen en el preámbulo.
- El recuadro «Lo que este capítulo da por conocido», las soluciones de los ejercicios al final del tomo y el código
  QR de cada figura quedan para cuando el prototipo se vuelva el PDF de verdad, antes de cerrar el Tomo II.

## Alternativas descartadas

- **Typst.** Es más rápido y su lenguaje de plantillas es más cómodo que el de LaTeX, pero obliga a traducir las
  fórmulas.
- **Imprimir el sitio con el navegador.** Saldría casi gratis, pero la composición de un libro (cortes de página,
  índice, encabezados, figuras flotantes) es justamente lo que un navegador hace peor.
- **Pandoc.** Convierte Markdown a LaTeX, pero no conoce las directivas de la obra; habría que escribir un filtro, que
  es el mismo trabajo que el conversor, en otro lenguaje.
