# La prueba de I.1 con estudiantes

*Protocolo de la fase 1 del plan de trabajo (especificación, 16.1) y del punto F3 de la hoja de ruta. Preparado el
22 de noviembre de 2026; lo lleva adelante el autor.*

La especificación pide probar el primer capítulo con 5 a 10 estudiantes que terminaron la escuela secundaria, y
ajustar la plantilla y la guía de estilo con lo que se aprenda. El criterio para pasar de fase es que, al terminar,
expliquen el fragmento de la Salida. Este protocolo convierte ese criterio en una prueba concreta y repetible: la
misma sirve después para cualquier capítulo.

## Qué se quiere saber

1. Si el lector entiende las demostraciones del capítulo, en un sentido preciso (la evaluación de la sección 4).
2. Si puede explicar el fragmento de la Entrada línea por línea, que es el objetivo del capítulo.
3. Dónde se pierde: qué secciones le llevan más tiempo, qué ejemplos lo ayudan y qué pasajes le resultan demasiado
   densos.

## Participantes y materiales

- De 5 a 10 personas que terminaron la secundaria y todavía no cursaron matemática universitaria. Conviene que la
  mitad no programe, porque la Entrada no debe suponerlo (especificación, 8.1).
- El capítulo I.1 en el sitio, con sus celdas y figuras. La versión que se prueba queda anotada por su commit.
- Una planilla por participante, sin nombre, con un código (P1, P2, …).

## El procedimiento

**Antes (10 minutos).** Tres preguntas de contexto: qué matemática cursó en la secundaria, si programa, y si alguna vez
leyó una demostración. Se explica que se evalúa el capítulo, no a la persona.

**La lectura (entre 2 y 4 horas, en una o dos sesiones).** Cada participante lee el capítulo a su ritmo, puede ejecutar
las celdas y mover las figuras, y anota en la planilla la hora en que empieza cada sección. Si es posible, piensa en
voz alta mientras lee, y quien observa marca los lugares donde se detiene, vuelve atrás o se pierde. No se responden
preguntas de contenido durante la lectura: se anotan.

**La evaluación (45 minutos), sin el capítulo a la vista salvo donde se indica.** Las secciones 4 y 5.

**La entrevista final (15 minutos).** Qué pasaje fue el más difícil, qué ejemplo ayudó más, si en algún lugar el texto
iba demasiado rápido o demasiado lento, y qué habría agregado.

## La evaluación de la comprensión

Sigue el modelo de Mejía-Ramos, Fuller, Weber, Rhoads y Samkoff, «An assessment model for proof comprehension in
undergraduate mathematics», *Educational Studies in Mathematics* 79 (2012), que distingue siete dimensiones. Se
aplica a dos demostraciones de I.1: la de la suma de los primeros impares (por inducción, la proposición
`prop-impares`) y la de la irracionalidad de √2 (por el absurdo, el teorema `teo-raiz-2`). Para cada demostración, una
pregunta por dimensión; cada respuesta se califica con 0 (no responde o es incorrecta), 1 (parcial) o 2 (completa).

| Dimensión | Qué evalúa | Pregunta modelo, para la suma de impares |
| --- | --- | --- |
| Significado de los términos | Qué quiere decir cada término y cada afirmación | ¿Qué afirma exactamente la proposición? Dar el caso n = 4. |
| Estatus lógico | Qué se supone, qué se quiere probar y qué tipo de demostración es | ¿Cuál es el caso base y qué se supone en el paso inductivo? |
| Justificación | Por qué vale cada paso | ¿Por qué el paso de n a n + 1 suma exactamente 2n + 1? |
| Resumen | Las ideas principales, en pocas palabras | Explicar la demostración en dos frases, sin fórmulas. |
| Estructura | En qué partes se divide y cómo se encadenan | ¿En qué partes se divide la demostración, y qué aporta cada una? |
| Transferencia | Usar el método en otro contexto | Demostrar del mismo modo que 2 + 4 + … + 2n = n(n + 1). |
| Ejemplos | Ilustrar la demostración con un caso | Mostrar con n = 3 qué hace cada paso. |

Para la demostración de √2, las preguntas son las análogas: qué se supone para llegar al absurdo, por qué la fracción
se puede tomar irreducible, qué se contradice al final, y cómo se adapta el argumento a √3.

## El fragmento de la Salida

Con el capítulo cerrado, cada participante recibe el programa de la Entrada y lo explica línea por línea, por escrito.
Se califica cada línea con la misma escala (0, 1 o 2), según diga:

- qué hace la línea en el programa;
- qué idea matemática del capítulo la explica (el invariante como afirmación, la inducción, la condición de salida
  como negación);
- por qué el comentario final es verdadero, incluida la hipótesis de que n es natural.

## Cómo se leen los resultados

- **El criterio de 16.1** se cumple si al menos el 70 % de los participantes obtiene al menos la mitad del puntaje en
  el fragmento de la Salida.
- **Una dimensión débil** es una en la que la mayoría obtiene 0 o 1. Señala qué le falta al capítulo: si falla
  «Ejemplos», faltan casos trabajados; si falla «Estructura», las demostraciones largas necesitan pasos con nombre;
  si falla «Transferencia», faltan ejercicios que pidan reutilizar el método.
- **Los tiempos por sección y los lugares marcados** señalan los pasajes demasiado densos, que se revisan con el ritmo
  de la guía de estilo (sección 6).

Los cambios a la plantilla y a la guía se discuten con esos datos y se registran como enmiendas, con la fecha.

## Lo que no se guarda

El repositorio es público, así que solo se guardan resultados agregados y anónimos: los puntajes por dimensión, los
tiempos por sección y las citas sin nombre. Las planillas individuales quedan fuera del repositorio. La participación
es voluntaria y se puede abandonar en cualquier momento.
