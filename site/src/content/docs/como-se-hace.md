---
title: Cómo se hace esta obra
description: Quién la escribe, con qué herramientas, cómo se revisa lo escrito y con qué licencia se publica.
---

Una obra de matemática pide confianza: el lector tiene que poder creer que lo que lee es verdadero. Esta página dice
cómo se produce el texto y qué lo respalda, para que esa confianza tenga dónde apoyarse.

## Quién la escribe

La obra la dirige Rodrigo Martin Vidal Galan, que fija su plan, su índice temático, sus criterios y su estilo. Los
borradores de los capítulos se redactan con la asistencia de Claude, un modelo de inteligencia artificial de
Anthropic, que trabaja dentro de ese plan: la
[especificación](https://github.com/RodrigoMartinVG/cerrar-el-abismo/blob/main/docs/especificacion.md), la guía de
estilo y la guía de capítulos. Las decisiones de diseño, con sus razones y las alternativas descartadas, están
registradas en el repositorio.

Un modelo de lenguaje puede escribir una demostración convincente que sea falsa, o atribuir un hecho histórico a quien
no corresponde. Por eso la redacción asistida es solo el primer paso, y nada se da por terminado sin la revisión de
personas.

## Cómo se revisa

Cada capítulo pasa por comprobaciones automáticas antes de publicarse: que siga la plantilla, que cumpla las reglas
mecánicas de la guía de estilo, que solo cite resultados de los capítulos que requiere, que use la terminología de la
obra y que todas sus celdas de Python se ejecuten. Esas comprobaciones verifican la forma, no la verdad.

La verdad la verifica la revisión, en dos pasadas: la primera, del autor, contrastando cada enunciado y cada
demostración con los libros de las lecturas; la segunda, de otro matemático. Cada revisión queda registrada con quién
la hizo, cuándo y contra qué referencia, y si el texto de un resultado cambia después, su revisión deja de contar
hasta que se haga de nuevo. La página [Estado de la revisión](../revision/) muestra cuánto de cada capítulo está
revisado. Mientras falte, el capítulo se publica como **borrador**, y así lo dice debajo de su título.

Los libros de referencia se consultan para contrastar enunciados, demostraciones y notación, y se citan en las
«Lecturas» de cada capítulo. Nunca se copian sus pasajes: la redacción es siempre original.

## Cómo reportar un error

Debajo del título de cada capítulo hay un enlace, «Reportar un error», que abre un aviso en el repositorio de la obra
con el capítulo ya indicado. Toda corrección es bienvenida, desde una errata hasta una demostración equivocada.

## Licencia

El texto se publica bajo la licencia
[Creative Commons Atribución-NoComercial-CompartirIgual 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es):
se puede copiar, redistribuir y adaptar con fines no comerciales, citando la obra y compartiendo las adaptaciones con
la misma licencia. El código, incluido el de las celdas de Python, se publica bajo la licencia MIT. El detalle está en
el archivo [LICENSE.md](https://github.com/RodrigoMartinVG/cerrar-el-abismo/blob/main/LICENSE.md) del repositorio.
