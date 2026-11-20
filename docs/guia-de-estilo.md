# Guía de estilo de redacción

La obra tiene que leerse como los mejores libros de matemática: precisa sin ser árida, explicativa sin perder rigor,
con buenas introducciones y con la claridad de quien quiere que el lector entienda, no solo que le crea. Esta guía
convierte esa aspiración en reglas concretas. Las que se pueden comprobar automáticamente se comprueban (sección 11);
las demás son la lista de la lectura de estilo que todo capítulo pasa antes de darse por terminado.

El primer capítulo, [`site/src/content/docs/capitulos/i-1.md`](../site/src/content/docs/capitulos/i-1.md), es el
ejemplo de referencia de todo lo que sigue.

## Los modelos

No se imita la voz de ningún libro, pero se estudia qué hace bien cada uno.

| Libro | Qué tomamos de él |
| --- | --- |
| Axler, *Linear Algebra Done Right* | Definiciones que llegan cuando hacen falta, demostraciones limpias, notación cuidada |
| Abbott, *Understanding Analysis* | Cada capítulo abre con un problema que la teoría resuelve; la idea va antes que la demostración |
| Spivak, *Calculus* | Rigor completo en un tono de conversación; ejercicios que enseñan |
| Needham, *Visual Complex Analysis* | La intuición geométrica como argumento, no como adorno |
| Strang, *Introduction to Linear Algebra* | El diálogo con el lector y los ejemplos con números pequeños |
| Trefethen y Bau, *Numerical Linear Algebra* | Una idea por lección y precisión sobre lo que hace la computadora |
| Arnold, *Mathematical Methods of Classical Mechanics* | La geometría y la física como fuente de las definiciones |
| Pharr, Jakob y Humphreys, *Physically Based Rendering* | Teoría y código entrelazados: el modelo del Puente |

Sobre el oficio de escribir matemática: Halmos, «How to Write Mathematics»; Knuth, Larrabee y Roberts, *Mathematical
Writing*; Higham, *Handbook of Writing for the Mathematical Sciences*.

## 1. El equilibrio entre explicar y ser preciso

Cada capítulo tiene dos capas, y ninguna reemplaza a la otra.

- **La capa precisa** son las definiciones, los enunciados y las demostraciones. Allí no hay concesiones: todas las
  hipótesis están escritas, todos los cuantificadores son explícitos y toda demostración es completa.
- **La capa explicativa** rodea a la precisa: dice de dónde sale cada definición, qué significa cada teorema, cuál es la
  idea de cada demostración y para qué sirve lo que se acaba de probar.

Una explicación nunca ocupa el lugar de una demostración, y ninguna demostración queda sin explicar. Un capítulo no es
una lista de definiciones y teoremas: entre dos entornos siempre hay prosa que los une.

## 2. Abrir bien

- **El capítulo** abre con la Entrada, un fragmento real que el lector todavía no puede explicar, y la Motivación,
  que convierte ese fragmento en una pregunta. La Motivación trabaja primero el caso más chico que muestra el problema,
  con números concretos, y termina con un párrafo que anuncia el camino: qué se va a construir y en qué orden.
- **Cada sección** abre con una o dos frases que dicen qué problema resuelve y cómo sigue a la anterior. Ninguna
  sección empieza con una definición, una fórmula o un bloque de código.
- **Lo concreto va antes que lo general**: el ejemplo pequeño, hecho a mano, prepara la definición o el teorema.

## 3. Definiciones

- **Se motivan.** Una definición llega cuando el lector ya vio el objeto en un ejemplo y necesita nombrarlo; la
  definición comprime lo que el ejemplo mostró.
- **El término definido va en negrita**, una sola vez, en el lugar donde se define.
- **Después, ejemplos.** Inmediatamente después de una definición importante hay al menos un ejemplo y, cuando ayuda,
  un contraejemplo: algo que parece cumplirla y no la cumple.
- **Cada condición se justifica.** Si la definición pide algo, el texto dice qué se pierde sin eso.

## 4. Teoremas

- **El enunciado es completo**: todas las hipótesis, con los cuantificadores en palabras.
- **Los resultados importantes llevan título** (`:::teorema[Dimensión del dual]`), que el lector pueda recordar.
- **«En palabras»**: cuando el enunciado no es transparente, una frase después lo dice sin símbolos.
- **Después del teorema**, el texto dice por qué importa y qué hipótesis es esencial; si quitar una hipótesis lo hace
  falso, se muestra el contraejemplo.

## 5. Demostraciones

- **Son completas.** Quedan prohibidas «es fácil ver», «obviamente», «claramente», «trivialmente» y «se deja al
  lector». Si un paso es rutinario, se dice en media frase por qué; si se omite, es un ejercicio numerado y citado.
- **Primero la idea.** Toda demostración de más de un párrafo va precedida de una o dos frases con su idea: «La idea
  es…».
- **Las largas se dividen en pasos con nombre** (*Genera.*, *Es independiente.*, *Paso 1.*).
- **Se dice dónde se usa cada hipótesis** («aquí usamos que T es invertible»). Una hipótesis que no se usa es un
  error del enunciado.
- **Después**, si la demostración revela algo más que el enunciado, una frase lo dice.

## 6. Ejemplos

- **Con números pequeños**, hechos a mano, antes de la celda de código que hace el caso general o realista.
- **Con propósito declarado**: el texto dice antes qué muestra el ejemplo («este ejemplo muestra que la hipótesis de
  dimensión finita es necesaria»).
- **Los contraejemplos son de primera clase**: enseñan dónde termina un teorema.

## 7. La prosa

- **Voz.** El cuerpo del texto usa la primera persona del plural: «veamos», «supongamos», «obtenemos». Autor y lector
  hacen la matemática juntos. El cuerpo no se dirige al lector de tú ni de usted.
- **Ejercicios en infinitivo**: «Demostrar que…», «Calcular…». Es la forma tradicional de los libros de matemática en
  español y es la misma en todas sus variantes.
- **Una idea por párrafo**, frases cortas, voz activa y sujetos concretos.
- **Conectores que muestran la lógica**: «por lo tanto», «en cambio», «es decir», «en particular». Se evitan las
  transiciones vacías.
- **Palabras que no se usan**:

  | En lugar de | Se escribe |
  | --- | --- |
  | obviamente, claramente, evidentemente, trivialmente | la razón, en media frase |
  | es fácil ver, se deja al lector | la demostración, o un ejercicio citado |
  | asumir | suponer |
  | chequear | comprobar |
  | remarcar | señalar, observar |
  | en orden a | para |
  | eventualmente (por «finalmente») | finalmente, tarde o temprano |

- **La terminología** es la de la sección 12 de la especificación y la del diccionario academia–práctica.

## 8. Símbolos y fórmulas

- **Ninguna frase empieza con un símbolo o una fórmula.** «La matriz $A$ es…», no «$A$ es…». Una lista de fórmulas
  sueltas, como las partes del enunciado de un teorema, no es prosa y no cuenta.
- **∀, ∃, ⇒ y ∴ no se usan en la prosa**, solo dentro de fórmulas o en el capítulo de lógica.
- **Cada símbolo se presenta antes de usarse** y tiene un solo significado en el capítulo. La notación es la de la
  sección 12.
- **Las fórmulas en display son parte de la frase** y llevan la puntuación que les corresponde.
- **Cuando una fórmula lleva el argumento**, una frase dice qué afirma.

## 9. Figuras, código y Puente

- **Toda figura** se cita y se comenta en el texto; su pie se entiende solo, y su texto alternativo describe lo que
  muestra a quien no la ve.
- **Toda celda de código** va precedida de una frase que dice qué calcula y qué esperamos ver, y seguida de una que
  interpreta el resultado. La celda confirma un teorema o muestra dónde deja de valer (por ejemplo, en coma flotante).
- **El Puente** tiene la misma precisión que la matemática: cada afirmación sobre la práctica es exacta, y cada
  fragmento real cita su fuente.

## 10. Cerrar bien

- **La Salida** explica el fragmento de la Entrada símbolo por símbolo, citando los resultados del capítulo.
- **«Lo esencial»**: al final de la Salida, de tres a seis puntos con lo que hay que recordar, cada uno con su
  referencia.
- **Las Notas** incluyen la historia cuando ilumina, y «Para seguir» dice hacia dónde continúa el tema, dentro y fuera
  de la obra.

## 11. Lo que se comprueba

Automáticamente, en cada capítulo (`packages/libro/src/estilo.ts`, desde las pruebas de los capítulos):

- que no aparezcan las palabras prohibidas de la sección 7;
- que ningún párrafo empiece con una fórmula;
- que toda sección abra con un párrafo de texto;
- que no haya imperativos dirigidos al lector («Calcula», «Demuestre», «Probá»).

En la lectura de estilo, a mano, con esta lista:

- ¿La Motivación trabaja un caso concreto y termina anunciando el camino?
- ¿Cada definición importante tiene un ejemplo, y un contraejemplo cuando ayuda?
- ¿Cada teorema largo tiene su idea antes de la demostración?
- ¿Cada hipótesis se usa, y el texto dice dónde?
- ¿Cada celda y cada figura están comentadas antes y después?
- ¿La Salida cierra con «Lo esencial»?
- ¿Se puede leer el capítulo saltando las demostraciones y entender qué se probó y por qué importa?
