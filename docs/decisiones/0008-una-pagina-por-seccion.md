# 0008. Cada sección de un capítulo tiene su propia página en el sitio

*Fecha: 2026-11-22 · Estado: aceptada*

## Contexto

Cada capítulo era una sola página web. Después de la pasada de densidad del Tomo I, los capítulos tienen entre 12 000
y 16 000 palabras: una sola página de 40 a 50 páginas impresas, que se lee mal en una pantalla y que empujaba a
comprimir. La primera recalibración de las metas puso un techo a la extensión (el 115 % de lo previsto y nunca más de
52 páginas), y la ronda crítica empezó a recortar para entrar en él. El autor señaló el problema de fondo: querer meter
cada tema en un espacio fijo, cuando lo que la obra necesita es desarrollarlo con la amplitud y la paciencia que
merece.

## Decisión

- **La fuente sigue siendo un archivo por capítulo.** La numeración «Teorema I.7.3», las referencias, las pruebas, el
  registro de la revisión y el PDF no cambian.
- **El sitio divide cada capítulo en páginas, una por sección:**
  - la portada del capítulo, en `/capitulos/i-7/`, con la Entrada, la Motivación y la lista de sus páginas;
  - una página por cada sección `###` del Desarrollo, en `/capitulos/i-7/<sección>/`, la primera con la introducción
    del Desarrollo y el recuadro de lo que el capítulo da por conocido;
  - el Cálculo; el Puente y las Aplicaciones, juntos; la Salida; los Ejercicios; y las Notas.
- **Las referencias siguen funcionando:** un enlace a un ancla, del mismo capítulo o de otro, apunta a la página que la
  contiene. El sitio lo calcula al construirse, a partir de los títulos de cada capítulo.
- **La navegación:** en la barra lateral, cada capítulo es un grupo plegable con sus páginas, y cada página tiene su
  anterior y su siguiente.
- **La extensión deja de tener techo.** La meta conserva su piso, el 90 % de lo previsto, porque el problema original
  era la compresión; por encima del 115 % el reporte de densidad lo señala, y la ronda crítica dice por qué cada
  sección lo necesita. El tope de 52 páginas y la regla de dividir un capítulo que lo pase se retiran.

## Consecuencias

- Un capítulo puede crecer lo que sus temas pidan sin volverse ilegible en la pantalla, y las secciones largas del
  Desarrollo se leen como capítulos cortos.
- Las celdas de Python de páginas distintas no comparten intérprete; ya eran independientes (decisión 0003).
- La búsqueda encuentra cada sección por separado.
- El índice conserva sus páginas previstas como referencia de proporción entre temas, no como límite.

## Alternativas descartadas

- **Un archivo por sección.** Dispersa la plantilla del capítulo en muchos archivos y obliga a la numeración y a las
  pruebas a reunirlos de nuevo.
- **Secciones plegables en una sola página.** No resuelve el largo de la página ni la carga, y esconde lo que el lector
  tiene que ver.
- **Mantener el techo y dividir los capítulos que lo pasan.** Cambia el índice, que está congelado, por un problema de
  presentación.
