# Temas clásicos: candidatos, ubicación y consecuencias

*Propuesta del 2026-11-21, adoptada el mismo día (versión 0.8 de la especificación) con un cambio: la función Gamma
pasó a IX.13, la de las transformadas de Laplace, y no a IX.10, para no llevar IX.10 más allá de 52 páginas. Quedan
pendientes el itinerario «Matemática» y la página de problemas abiertos.*

La pregunta es qué temas clásicos de la matemática le faltan a la obra, empezando por la hipótesis de Riemann y su
versión generalizada, dónde irían y qué implicaría agregarlos. Esta propuesta parte del índice actual (165 capítulos,
unas 7.036 páginas, 5.204 de núcleo) y de las reglas de la especificación.

## 1. El punto de partida

**El criterio de entrada (5.1).** Un tema entra como capítulo si es núcleo de una licenciatura con orientación
aplicada y tiene aplicaciones que se pueden mostrar, o si es un eslabón perdido. Además, todo capítulo necesita un
Puente con un fragmento real y de 2 a 4 aplicaciones de al menos dos campos (9.2). Esas dos exigencias son el filtro
de cualquier tema clásico: entra el que se puede contar desde la práctica.

**Lo que está fuera (5.4).** La especificación deja fuera la teoría analítica de números y la señala en el «Para
seguir» de I.5. La hipótesis de Riemann, por lo tanto, no está fuera por olvido sino por una decisión, y esta
propuesta la revisa.

**Lo que ya está.** La mayor parte del canon clásico ya tiene lugar, y conviene no duplicarlo:

| Tema clásico | Dónde está |
| --- | --- |
| Construcciones con regla y compás, primos de Fermat | V.5 |
| Teoría de Galois y teorema de Abel–Ruffini | V.6, V.7 |
| Teoremas de Sylow | V.1 |
| Enteros de Gauss | V.3 |
| Curvas elípticas | V.8 |
| Teorema fundamental del álgebra | I.11 (enunciado), III.8 y IX.10 |
| Teorema de Cantor–Schröder–Bernstein, hipótesis del continuo, Banach–Tarski | I.4 |
| Incompletitud de Gödel, problema de la parada, décimo problema de Hilbert | I.14 |
| Fórmula de Euler para grafos planos | I.8 |
| Clasificación de superficies, Gauss–Bonnet | VI.8, VII.9 |
| Brouwer, Borsuk–Ulam, bola peluda | VI.9 |
| Braquistócrona y teorema de Noether | VIII.8 |
| Caos: Lorenz y Feigenbaum | VIII.5 |
| Función Gamma y fórmula de Stirling | XII.3, III.11, IX.11 |
| Ecuaciones de Navier–Stokes | XII.10 |

Los huecos están en otro lado: en la teoría de números (la analítica y una parte de la elemental), en la aproximación
de irracionales y los números trascendentes, y en la visibilidad de los problemas abiertos.

## 2. Tres maneras de agregar un tema

| Forma | Costo | Cuándo conviene |
| --- | --- | --- |
| Capítulo complementario nuevo | De 36 a 52 páginas; no toca el núcleo | Un tema con cuerpo propio, Puente y aplicaciones |
| Una línea más en un capítulo existente | De 2 a 6 páginas; si el capítulo es de núcleo, el núcleo crece | Un resultado que completa lo que el capítulo ya hace |
| Un enunciado, en una observación o en «Para seguir» | Casi nada | Un problema abierto o un resultado de posgrado |

Un capítulo nuevo va al final de su tomo, o de una parte que esté al final, para no renumerar: cambiar la numeración
rompería las referencias del índice y de los capítulos escritos. Fue lo que se hizo con I.15.

## 3. Los candidatos recomendados

### 3.1 La función zeta, los números primos y la hipótesis de Riemann

**Propuesta:** un capítulo complementario nuevo, **IX.15 «La función zeta y los números primos»**, de 52 páginas,
en una parte nueva del Tomo IX. Requisitos: IX.7, IX.10, IX.11 e I.5.

**Por qué entra.** El teorema de los números primos es la aplicación clásica de la variable compleja, y está en los
cursos de análisis complejo de licenciatura (Stein y Shakarchi lo hacen en su segundo tomo). Con la demostración de
Newman (1980, en la versión de Zagier de 1997), sale en pocas páginas a partir de la teoría de Cauchy de IX.10. Y tiene
aplicaciones que se pueden mostrar en dos hilos, la criptografía y la física, así que cumple el criterio 5.1 sin
cambiarlo.

**Contenidos propuestos**, en el formato del índice:

- Los primos y su distribución: el producto de Euler, ζ(2) = π²/6 con la identidad de Parseval, las cotas de Chebyshev
  y los teoremas de Mertens.
- Prolongación analítica y ecuación funcional de ζ, con la función theta y la fórmula de sumación de Poisson; ceros
  triviales y franja crítica. Qué significa «ζ(−1) = −1/12», y qué no.
- Teorema de los números primos con la demostración de Newman. La fórmula explícita: los ceros de ζ son las
  frecuencias de la distribución de los primos.
- Hipótesis de Riemann: enunciado, formas equivalentes (el error del teorema de los números primos) y evidencia
  numérica, con más de diez billones de ceros comprobados. Funciones L de Dirichlet, primos en progresiones
  aritméticas (enunciado) e hipótesis de Riemann generalizada, con sus consecuencias algorítmicas. Para seguir: formas
  modulares y la conjetura de Montgomery.

**Puente posible.** `while not es_primo_probable(n): n += 2`, la búsqueda de un primo de 1024 bits para una clave RSA
de 2048. El teorema de los números primos dice cuántas vueltas da en promedio: la densidad de los primos cerca de
2¹⁰²⁴ es 1/ln(2¹⁰²⁴) ≈ 1/710, así que, probando solo impares, unas 355. Y la hipótesis de Riemann generalizada, si es
cierta, vuelve determinista el test: basta probar las bases menores que 2 (ln n)² (Bach, 1990).

**Aplicaciones:**

- *Cripto:* generación de claves y tests de primalidad: Miller–Rabin, su versión determinista bajo la hipótesis
  generalizada (Miller, 1976) y el algoritmo AKS, que es determinista sin ninguna hipótesis (2002).
- *Física:* ζ(4) = π⁴/90 en la ley de Stefan–Boltzmann, ζ(3/2) en la condensación de Bose–Einstein, y la
  regularización por la función zeta en el efecto Casimir.
- *Señales:* la fórmula explícita como suma de oscilaciones. Una figura interactiva reconstruye la escalera de los
  primos con los primeros N ceros, y un deslizador cambia N. Los ceros se calculan con mpmath, que Pyodide ya trae.

**Lo que implica:**

- *La especificación:* la fila «Teoría analítica de números → I.5» de la sección 5.4 se reemplaza por «Formas modulares
  y teoría analítica avanzada → IX.15», y el «Para seguir» de I.5 apunta a IX.15.
- *La función Gamma:* hoy está en XII.3, y el Tomo XII viene después del IX, así que IX.15 no puede requerirla. Hay dos
  salidas: IX.15 desarrolla lo que necesita (unas cuatro páginas: la integral de Euler, la ecuación funcional y la
  fórmula de reflexión), o la Gamma pasa al Tomo IX como el ejemplo clásico de prolongación analítica, y XII.3 la cita.
  Recomiendo la segunda: queda mejor ubicada y no duplica. (Se adoptó en IX.13, donde además aparece en la
  transformada de Laplace de tᵃ.)
- *La fórmula de sumación de Poisson:* no figura en el índice. Conviene sumarla a IX.7, de núcleo, porque es la
  matemática del muestreo: el teorema de Nyquist–Shannon se demuestra con ella. IX.7 pasa de 48 a 50 páginas.
- *Los resultados condicionales:* la guía de estilo tendría que decir cómo se enuncia un teorema que vale «si la
  hipótesis de Riemann generalizada es cierta». Encaja con las licencias declaradas: es un tercer tipo de afirmación,
  la condicional, que se marca como tal en el enunciado.
- *Los hilos:* el Tomo IX pasa de 11 a 12 aplicaciones de física sobre 46, lejos del límite de un tercio.

**Riesgos.** La hipótesis solo se puede enunciar; el capítulo tiene que evitar el sensacionalismo y ser preciso con lo
que está demostrado. El caso de «1 + 2 + 3 + ⋯ = −1/12» es bueno para eso: es una licencia mal declarada de la
divulgación, y el capítulo puede mostrar qué afirma de verdad la prolongación analítica.

Si se quiere demostrar el teorema de Dirichlet completo (la no anulación de L(1, χ) lleva unas diez páginas), el tema
da para dos capítulos: IX.15 sobre ζ y el teorema de los números primos, e IX.16 sobre las funciones L y la hipótesis
generalizada. Recomiendo empezar con uno solo.

### 3.2 La aritmética que la criptografía del Tomo I usa y no tiene

**Propuesta:** dos líneas nuevas en capítulos de núcleo del Tomo I.

- En **I.5**: «Residuos cuadráticos, símbolo de Legendre y ley de reciprocidad cuadrática; raíces cuadradas módulo
  p.» y «Primos para la criptografía: test de Fermat, números de Carmichael y test de Miller–Rabin.» I.5 pasa de 40 a
  44 páginas.
- En **I.9**: «La cota de Miller–Rabin: los testigos falsos caben en un subgrupo propio, por el teorema de Lagrange.»
  I.9 pasa de 48 a 50 páginas.

**Por qué.** I.5 ya cita RSA entre sus aplicaciones, pero el índice no tiene cómo encontrar los primos que RSA
necesita. La reciprocidad cuadrática es, además, el teorema clásico de la aritmética elemental (el *theorema aureum*
de Gauss), y tiene un uso concreto: descomprimir un punto de una curva elíptica (V.8) es calcular una raíz cuadrada
módulo p.

**Lo que implica.** El núcleo crece seis páginas. Es lo más urgente de esta propuesta, porque el Tomo I es el que se
está escribiendo.

### 3.3 Aproximación racional y números trascendentes

**Propuesta:** un capítulo complementario nuevo, **III.13 «Aproximación racional y números trascendentes»**, de 44
páginas, al final del Tomo III. Requisitos: III.8 e I.10.

**Contenidos propuestos:**

- Fracciones continuas: reducidas y mejores aproximaciones; teorema de Lagrange sobre las fracciones periódicas y
  ecuación de Pell.
- Aproximación diofántica: teoremas de Dirichlet y de Hurwitz; la razón áurea como el número peor aproximable.
- Números de Liouville. Los algebraicos son numerables (I.2), así que casi todos los reales son trascendentes;
  trascendencia de e (Hermite, 1873) y de π (Lindemann, 1882), que V.5 hoy solo enuncia.
- Equidistribución de Weyl: la sucesión nα módulo 1, y su relación con la fracción continua de α.

**Puente posible.** `Fraction(math.pi).limit_denominator(1000)` da 355/113. El método recorre la fracción continua de
π, y la teoría de las mejores aproximaciones dice que ninguna fracción con denominador menor que 16.604 se acerca más.

**Aplicaciones:**

- *Señales:* por qué la escala tiene doce notas. 7/12 es una reducida de log₂(3/2), y otra reducida, 31/53, explica la
  escala de 53 notas.
- *Ingeniería:* relaciones de engranajes (Huygens las calculó así para su planetario, hacia 1682) y calendarios. El ciclo
  persa de 8 bisiestos cada 33 años es una reducida; el gregoriano, 97 cada 400, se eligió por comodidad decimal.
- *Cripto:* el ataque de Wiener (1990) a RSA con exponente privado chico.
- *3D:* el muestreo de la esfera con la espiral de Fibonacci y el ángulo áureo.
- *Física* (alternativa a alguna de las anteriores): resonancias y pequeños denominadores, como los huecos de Kirkwood
  del cinturón de asteroides, con un aviso del teorema KAM.

**Lo que implica.** V.5 puede remitir a III.13 para la trascendencia de π, como aviso: V.5 es de núcleo y no puede
depender de un complementario. XI.7 (cuasi-Monte Carlo) puede sumar las sucesiones de Kronecker apoyándose en III.13:
los dos son complementarios. El Tomo III pasa de 11 a 12 aplicaciones de 3D sobre 41.

### 3.4 Los problemas abiertos, a la vista

**Propuesta:** enunciar cada gran problema, abierto o resuelto hace poco, en el capítulo donde viven sus objetos. No
cuesta páginas, y le muestra al estudiante dónde termina lo que se sabe, que es parte de cerrar el abismo.

| Problema | Estado | Dónde se enuncia |
| --- | --- | --- |
| Hipótesis de Riemann y su versión generalizada | Abierto (problema del milenio) | IX.15, propuesto |
| P frente a NP | Abierto (problema del milenio) | I.14: «las clases P y NP; por qué la criptografía supone P ≠ NP» |
| Existencia y suavidad de Navier–Stokes | Abierto (problema del milenio) | XII.10 |
| Conjetura de Birch y Swinnerton-Dyer | Abierto (problema del milenio) | V.8, con el rango de una curva elíptica |
| Yang–Mills y la brecha de masa | Abierto (problema del milenio) | «Para seguir» de XIII.7 |
| Conjetura de Poincaré | Resuelta por Perelman (2003) | «Para seguir» de VI.8 |
| Último teorema de Fermat | Resuelto por Wiles (1995) | «Para seguir» de V.8, por la modularidad |
| Teorema de los cuatro colores | Resuelto con computadora (1976), formalizado en Coq (2005) | I.8 y una aplicación de I.15 |
| Goldbach, primos gemelos y Collatz | Abiertos | Observaciones o ejercicios en I.3 y I.5 |

Los de la última fila se enuncian con lo que se sabe desde el primer capítulo, y sirven para insistir en una idea de
I.1: la evidencia numérica no es una demostración. La conjetura de Hodge queda fuera; enunciarla pide demasiado.

Como opción, el índice podría tener un campo `abiertos` por capítulo y una página «Problemas abiertos» que los reúna,
del mismo modo que el diccionario reúne los términos. Es un cambio chico en el esquema del índice.

## 4. Lo que se evaluó y no se recomienda como capítulo

| Tema | Por qué no | Qué hacer en su lugar |
| --- | --- | --- |
| Formas modulares y teoría algebraica de números | Posgrado | «Para seguir» de V.6 (ya está) y de IX.15 |
| Teoría de la complejidad completa | Es más informática que matemática clásica | El enunciado de P frente a NP en I.14; un capítulo, más adelante, si se quiere |
| Teoría de nudos | Pocas aplicaciones que se puedan mostrar | «Para seguir» de VI.5, con el ADN como ejemplo |
| Teoría de Ramsey | Ídem | Un ejercicio en I.6: R(3, 3) = 6 |
| Números p-ádicos | Pocas aplicaciones a este nivel | Un ejemplo de completación en VI.4, y el lema de Hensel en el «Para seguir» de V.9 |
| Desigualdad isoperimétrica y problema de Basilea | Son resultados, no capítulos | Una línea en IX.4: la demostración de Hurwitz y ζ(2) por Parseval (+2 páginas de núcleo) |
| Teorema ergódico | Lo necesita poco la obra | «Para seguir» de XI.8 |

## 5. Las consecuencias, sumadas

Si se adopta todo lo recomendado:

| Cambio | Capítulos | Páginas | Núcleo |
| --- | --- | --- | --- |
| IX.15 La función zeta y los números primos | +1 | +52 | — |
| III.13 Aproximación racional y números trascendentes | +1 | +44 | — |
| I.5: reciprocidad cuadrática y tests de primalidad | — | +4 | +4 |
| I.9: la cota de Miller–Rabin | — | +2 | +2 |
| IX.7: fórmula de sumación de Poisson | — | +2 | +2 |
| IX.4: isoperimetría y ζ(2) | — | +2 | +2 |
| Gamma de XII.3 a IX.13 | — | 0 (se mueve) | — |
| Enunciados de problemas abiertos | — | 0 | — |
| **Total** | **165 → 167** | **unas 7.036 → 7.142** | **5.204 → 5.214** |

El núcleo casi no cambia: lo que se agrega es sobre todo complementario, como manda 5.3. Además:

- **La especificación:** se ajustan las secciones 5.4 (lo que está fuera) y 2.1 (las cifras de las aplicaciones). Las
  secciones 6, 9.6, 13 y 14 se regeneran solas con `npm run indice:spec`.
- **Los itinerarios:** los cuatro actuales (núcleo, física, gráficos y datos) no incluirían los capítulos nuevos. Si se
  quiere un recorrido para quien siga un posgrado en matemática, un itinerario «Matemática» podría reunir IX.15,
  III.13, I.14, I.15, V.8, V.9, VI.8 a VI.11, VII.5 y el Tomo X. Es una decisión aparte.
- **El criterio de entrada:** no hace falta cambiarlo para nada de lo recomendado, porque cada tema entra por sus
  aplicaciones. Si en el futuro se quisiera aceptar un tema solo por clásico, sí habría que agregarle a 5.1 un tercer
  criterio, y conviene no hacerlo sin pensarlo: es la puerta por la que una obra así crece sin límite.
- **El orden de escritura:** nada de esto atrasa el trabajo. Lo que toca al Tomo I (I.3, I.5, I.8, I.9 e I.14) conviene
  decidirlo ahora, porque esos capítulos se escriben pronto; el resto es solo un cambio en el índice hasta que llegue
  su tomo.

## 6. Recomendación

1. **Ahora, porque toca al Tomo I:**
   - la reciprocidad cuadrática y los tests de primalidad en I.5, y la cota de Miller–Rabin en I.9;
   - los enunciados de Goldbach, los primos gemelos y Collatz en I.3 y en I.5;
   - los cuatro colores en I.8, y P frente a NP en I.14.
2. **En el índice, sin escribir todavía:** IX.15 sobre la función zeta y la hipótesis de Riemann, con la Gamma en IX.13 y
   la fórmula de Poisson en IX.7, y III.13 sobre la aproximación racional y los números trascendentes.
3. **Cuando se escriban esos tomos:** los enunciados de los problemas del milenio en su lugar y, si se quiere, la página
   de problemas abiertos.
4. **Aparte:** decidir si se agrega un itinerario «Matemática».
