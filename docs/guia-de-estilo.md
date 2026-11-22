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

### Las licencias, declaradas

La obra se escribe en orden, pero no puede esperar a tener todo construido para dar ejemplos: I.1 habla de √2 antes de
que existan los números reales, y de demostraciones antes de que la lógica las estudie. Esas libertades son legítimas,
y los buenos libros se las toman; lo que no se permite es tomarlas en silencio. El lector tiene que saber siempre en
qué nivel está cada afirmación. Hay tres clases de licencias, y cada una se declara de una manera:

- **Uso anticipado.** Una noción que la obra construye más adelante (los enteros, los conjuntos, los reales, una
  definición por recursión) se usa como se conoce de la escuela secundaria. Se dice en el lugar, en una frase de
  prosa, y se nombra el capítulo que la trata con rigor: «Usamos aquí los números reales como se conocen de la
  escuela; se construyen en [[I.11]]». Además, el capítulo lo lista en su campo `supone` (guía de capítulos), y la
  capa de libro lo muestra en un recuadro al comienzo del Desarrollo.
- **Metamatemática.** Una afirmación *sobre* la matemática y no *dentro* de ella: qué es una proposición, qué es una
  demostración, que una comprobación exhaustiva hecha por una computadora demuestra algo. Se dice que se habla en el
  metalenguaje, el lenguaje de todos los días con el que se habla de la matemática, y, cuando lo hay, se nombra el
  capítulo que convierte esa noción en objeto de estudio (casi siempre [[I.14]]). La observación «Dos niveles de
  lenguaje» de I.1 explica la distinción una vez, y los avisos posteriores pueden remitir a ella.
- **Ejemplo prestado por su forma.** Algo de un capítulo posterior que se usa solo por su estructura lógica, como la
  definición de continuidad para practicar la negación de cuantificadores. Se dice que no hace falta entender su
  contenido para seguir el argumento.

Tres reglas acompañan a las tres clases:

- **Una postura se declara como postura.** Cuando una elección podría haberse hecho de otra manera (tomar la
  inducción como axioma, que en la teoría de conjuntos es un teorema), el texto lo dice.
- **Nada riguroso se apoya en una licencia.** Un enunciado y su demostración pueden usar nociones informales para
  motivar o ilustrar, pero lo que la demostración necesita de verdad tiene que estar demostrado, o anunciado con el
  capítulo donde se demuestra. Si un argumento solo convence (el dibujo de los impares, un intercambio de sumas «porque
  se suman los mismos términos»), se dice que convence y no se lo presenta como demostración.
- **Un resultado condicional se enuncia como tal.** Si un teorema depende de una conjetura, como los que valen «si la
  hipótesis de Riemann generalizada es cierta», la conjetura va en el enunciado, y todo lo que se deduce de él hereda la
  condición.

La forma es siempre una frase de prosa, en el lugar, y no un recuadro: llenar el texto de avisos lo vuelve ilegible.
El único recuadro es el del campo `supone`, uno por capítulo.

## 2. Abrir bien

- **El capítulo** abre con la Entrada, un fragmento real que el lector todavía no puede explicar, y la Motivación,
  que convierte ese fragmento en una pregunta. La Motivación trabaja primero el caso más chico que muestra el problema,
  con números concretos, y termina con un párrafo que anuncia el camino: qué se va a construir y en qué orden.
- **Cada sección** abre con una o dos frases que dicen qué problema resuelve y cómo sigue a la anterior. Ninguna
  sección empieza con una definición, una fórmula o un bloque de código.
- **Lo concreto va antes que lo general**: el ejemplo pequeño, hecho a mano, prepara la definición o el teorema.
- **La Entrada no supone saber programar.** Si el fragmento es código, se elige la forma más legible (Python, cuando el
  lenguaje no importa) y una frase dice qué hace cada instrucción. En los primeros capítulos, la Entrada abre con una
  pregunta matemática, y el código llega como esa misma pregunta escrita en otro idioma (especificación, 8.1).

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

- **La terminología** es la de la sección 12 de la especificación y la del diccionario academia–práctica. Cuando un
  concepto tiene varios nombres en español («cuerpo» y «campo», «coclase» y «clase lateral»), la obra usa uno solo, el
  de `ortografia/terminologia.yaml`; las otras formas solo aparecen entre comillas, cuando se las nombra.

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
- que no haya imperativos dirigidos al lector («Calcula», «Demuestre», «Probá»);
- que cada noción del campo `supone` se trate con rigor en un capítulo posterior (`packages/libro/src/supone.ts`);
- que el capítulo agregue sus términos al diccionario, completos, sin fórmulas y con anclas que existen
  (`packages/libro/src/diccionario.ts`);
- que no use las formas que el registro de terminología rechaza (`packages/libro/src/terminologia.ts`), en el
  capítulo, en el índice y en la especificación.

En la lectura de estilo, a mano, con esta lista:

- ¿La Motivación trabaja un caso concreto y termina anunciando el camino?
- ¿Cada definición importante tiene un ejemplo, y un contraejemplo cuando ayuda?
- ¿Cada teorema largo tiene su idea antes de la demostración?
- ¿Cada hipótesis se usa, y el texto dice dónde?
- ¿Cada celda y cada figura están comentadas antes y después?
- ¿La Salida cierra con «Lo esencial»?
- ¿Se puede leer el capítulo saltando las demostraciones y entender qué se probó y por qué importa?
- ¿Cada entrada del diccionario dice dónde dejan de coincidir los dos lados, y cada afirmación sobre la práctica es
  exacta?
- ¿Cada noción usada antes de construirse está declarada en el lugar y en `supone`? ¿Cada afirmación metamatemática
  o postura está dicha como tal (sección 1)?
