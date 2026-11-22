# Decisiones

Las decisiones de arquitectura del proyecto, una por archivo y numeradas. Una decisión va antes que el código
cuando sus consecuencias son largas. Cada una dice el contexto, lo que se decidió, sus consecuencias y las
alternativas que se descartaron. Si se revisa, se enmienda con fecha o se reemplaza por una nueva, sin borrarla.

| N.º | Decisión | Estado |
| --- | --- | --- |
| [0001](0001-astro-y-starlight.md) | El sitio se construye con Astro y Starlight, con la capa de libro propia | Aceptada (2026-11-20) |
| [0002](0002-el-indice-como-datos.md) | El índice temático es datos; las tablas e índice de la especificación se generan desde ellos | Aceptada (2026-11-20), enmendada el mismo día |
| [0003](0003-la-capa-de-libro.md) | La capa de libro: directivas cerradas, celdas de Python con Pyodide y figuras interactivas | Aceptada (2026-11-20), enmendada el 2026-11-21 y el 2026-11-22 |
| [0004](0004-el-diccionario-en-los-capitulos.md) | El diccionario academia–práctica se escribe en los capítulos | Aceptada (2026-11-21) |
| [0005](0005-la-revision-como-datos.md) | La revisión de cada resultado y aspecto se registra como datos, con su huella, y las pruebas la exigen según el estado del capítulo | Aceptada (2026-11-22) |
| [0006](0006-los-ejercicios-graduados.md) | Los ejercicios dicen su dificultad, su tipo y su sección, y los de cálculo se comprueban en el navegador | Aceptada (2026-11-22) |
| [0007](0007-el-pdf-con-latex.md) | El PDF se compone con LaTeX (LuaLaTeX), desde el mismo árbol de Markdown, y lo compila la integración continua | Aceptada (2026-11-22) |
