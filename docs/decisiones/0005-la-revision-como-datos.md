# 0005. La revisión se registra como datos

*Fecha: 2026-11-22 · Estado: aceptada*

## Contexto

Las comprobaciones automáticas verifican la forma de un capítulo: la plantilla, las reglas mecánicas de estilo, el
diccionario, el mapa de dependencias y que las celdas se ejecuten. No verifican que un enunciado sea verdadero ni que
una demostración sea correcta. La especificación pide las dos cosas antes de dar un capítulo por terminado (16.2):
demostraciones contrastadas con las lecturas en el repaso del tomo y revisadas por un segundo matemático, ejercicios
verificados y una lectura de estilo que apruebe la redacción. El campo `estado` ya distingue `borrador`, `revision` y
`terminado`, pero nada decía qué hace falta para pasar de uno a otro ni dejaba constancia de quién revisó qué.

Una revisión del proyecto, del 22 de noviembre de 2026, señaló que ese es su riesgo principal. El Tomo I se escribió
con asistencia de IA mucho más rápido de lo que se lo puede revisar, y un enunciado mal puesto se propaga por `supone`,
`cumple` y las referencias a todo lo que lo cita. La revisión matemática no se puede automatizar, pero sí se puede
registrar y exigir.

## Decisión

- **Qué se revisa.** Dos clases de cosas:
  - cada **resultado** del capítulo (teorema, proposición, lema o corolario), identificado por su ancla;
  - cinco **aspectos** del capítulo entero:
    - `estilo`: la lectura de estilo, con la lista de la guía;
    - `practica`: el fragmento de la Entrada, el Puente y las Aplicaciones, contrastados con sus fuentes (normas,
      documentación, código);
    - `calculos`: los ejemplos numéricos, recalculados, y las salidas de las celdas que el texto cita;
    - `ejercicios`: los enunciados y las soluciones;
    - `historia`: los datos históricos de las Notas, contrastados con fuentes históricas y no solo con libros de texto.
- **Qué quiere decir «revisado»** para un resultado:
  - el enunciado se contrastó con una referencia concreta, con libro y número de teorema o página;
  - la demostración se siguió paso a paso, cada hipótesis se usa y el texto dice dónde;
  - si la demostración se omite, la referencia que da el texto es exacta y dice qué se pierde.
- **Dos pasadas**, como pide 16.2:
  - la `primera`, del autor, con los libros de las lecturas;
  - la `segunda`, de otro matemático. Es obligatoria para los resultados y opcional para los aspectos.
- **Dónde se registra.** Un archivo por capítulo en `revision/` (por ejemplo, `revision/i-9.yaml`), con una entrada
  por cada revisión hecha:

  ```yaml
  resultados:
    teo-lagrange:
      - pasada: primera
        por: Nombre Apellido
        fecha: 2026-11-25
        contra: Dummit y Foote, Abstract Algebra, 3.ª ed., sección 3.2, teorema 8
        huella: 5c1e0b9a47d2
  aspectos:
    estilo:
      - pasada: primera
        por: Nombre Apellido
        fecha: 2026-11-26
        contra: la lista de la guía de estilo, sección 7
  ```

  `notas` es un campo opcional para lo que el revisor quiera dejar dicho. Las entradas se agregan y no se reemplazan:
  el archivo es la historia de la revisión del capítulo.
- **La huella.** Cada entrada de un resultado guarda una huella del texto revisado: los primeros doce dígitos
  hexadecimales del SHA-256 del entorno y de su demostración, con los espacios normalizados. Si el texto cambia, la
  huella deja de coincidir y la revisión queda **desactualizada**: no cuenta, y hay que hacerla de nuevo. Los aspectos no
  llevan huella. Abarcan el capítulo entero, así que cualquier corrección los invalidaría, y eso empujaría a
  registrarlos otra vez sin volver a leer.
- **Qué exige cada estado** (lo comprueban las pruebas):
  - `borrador`: nada; si hay registro, tiene que ser válido;
  - `revision`: todos los resultados con una primera pasada vigente y los cinco aspectos con la suya;
  - `terminado`: además, todos los resultados con una segunda pasada vigente, de una persona distinta de la que hizo la
    primera.
- **Quién firma.** Solo personas: el campo `por` lleva el nombre de quien revisó. La IA puede hacer una lectura previa
  en una sesión distinta de la que escribió el capítulo, buscando hipótesis sin usar, referencias mal puestas o
  afirmaciones sin justificar. Lo que encuentre se corrige o se abre como *issue*, pero no se registra ni cuenta como
  pasada. Una sesión de IA escribe en `revision/` solo cuando el revisor se lo pide, con sus datos.
- **El comando** `npm run revision` muestra cómo va la revisión de un capítulo, resultado por resultado, y registra
  una revisión con su fecha y su huella, para que nadie tenga que calcularla a mano.
- **En el sitio**, cada capítulo dice, junto a su estado, cuántos de sus resultados tienen la primera pasada. La
  página `/revision/` explica el protocolo y reúne el avance de todos los capítulos.

## Consecuencias

- Un capítulo cambia de estado en el mismo commit que completa su registro, y las pruebas impiden adelantarlo.
- Corregir un resultado de un capítulo en revisión o terminado obliga a revisarlo de nuevo, en las dos pasadas: las
  pruebas fallan hasta que se registre. Es lo que se busca: lo publicado es lo revisado.
- Cambiar un capítulo terminado fuera de sus resultados no invalida nada automáticamente. Quien lo cambia repite la
  lectura del aspecto afectado y la registra.
- El lector ve cuánto de cada capítulo está revisado, contra qué y por quién. Eso hace verificable la declaración de
  cómo se produce la obra, que sigue pendiente (especificación, sección 17).
- Un resultado necesita ancla para poder registrarse; hoy todos la tienen.
- El registro no detecta los errores encadenados: si cambia un lema, la huella del teorema que lo usa sigue igual. Eso
  lo cubre la revisión del teorema, que sigue la demostración junto con lo que cita.

## Alternativas descartadas

- **Pull requests para los cambios de estado**, con la lista de revisión en la descripción. El proyecto trabaja directo
  sobre `main` (decisión del autor, 2026-11-20), y el registro junto con el historial de commits deja el mismo rastro,
  que además leen las pruebas y el sitio.
- **El registro en el frontmatter del capítulo.** Mezcla el proceso con la fuente que va a la web y al PDF, y un
  capítulo tiene unos quince resultados con dos pasadas cada uno.
- **Una sola marca por capítulo**, sin detalle por resultado. Es lo que había, implícito en `estado`: no dice qué se
  contrastó contra qué ni deja ver qué falta.
- **Huella también en los aspectos.** Se descartó por la razón dicha arriba.
- **Formalizar los resultados**, o enlazarlos con su nombre en Mathlib. Es una verificación valiosa y coherente con
  I.15, pero no reemplaza la revisión del texto, y los nombres de Mathlib cambian. Se puede agregar más adelante como
  campo opcional de cada entrada.
