---
title: Lo que el Tomo I exporta
description: Los resultados, las garantías y la notación del Tomo I que usan los demás tomos, capítulo por capítulo, con los capítulos que los requieren.
---

Cada tomo abre con lo que importa de los anteriores y cierra con lo que deja para los siguientes (especificación,
sección 6). El Tomo I no importa nada; esta página dice lo que exporta: los resultados que los demás tomos usan, con
el capítulo de cada uno y los capítulos que lo requieren directamente. Quien llega a un tomo posterior sin haber leído
el Tomo I encuentra aquí qué tiene que saber y dónde está demostrado.

## La notación

La obra fija sus convenciones en la sección 12 de la especificación, y el Tomo I es donde aparecen por primera vez:

- $\mathbb N = \{0, 1, 2, \dots\}$, con el $0$;
- $\mathbb Z/n\mathbb Z$ para los restos módulo $n$, y $(\mathbb Z/n\mathbb Z)^\times$ para las clases invertibles;
- $S_n$ para el grupo simétrico, $A_n$ para el alternado y $D_n$ para el grupo diédrico, de orden $2n$;
- $\mathbb F_q$ para el cuerpo finito de $q$ elementos;
- los decimales con coma en el texto y con punto en el código, y la terminología del registro de la obra (cuerpo,
  coclase, subgrupo normal).

## Lo que usa toda la obra

La lógica y las técnicas de demostración de [[I.1]], los conjuntos, las funciones y las relaciones de [[I.2]], y los
naturales, la inducción y la divisibilidad de [[I.3]] están en el recorrido de casi todos los capítulos. De ellos, el
que más se cita después es la correspondencia entre relaciones de equivalencia y particiones (:ref[I.2#teo-particiones]),
que está detrás de todo cociente: los restos módulo $n$, los grupos cociente, los espacios cociente y la topología
cociente de [[VI.1]].

## Capítulo por capítulo

| Capítulo | Lo que exporta | Lo requieren |
| --- | --- | --- |
| [[I.4]] | Las congruencias y su aritmética (:ref[I.4#prop-compatibles]), los inversos módulo $n$ (:ref[I.4#prop-inversos]), el teorema chino del resto (:ref[I.4#teo-chino]), los teoremas de Euler y de Fermat (:ref[I.4#teo-euler], :ref[I.4#cor-fermat]) y la exponenciación rápida (:ref[I.4#prop-exponenciacion]) | [[IX.15]], [[XI.5]] |
| [[I.5]] | El conteo de permutaciones y combinaciones (:ref[I.5#teo-combinaciones]), el teorema del binomio y los polinomios de Bernstein (:ref[I.5#teo-binomio]), la inclusión–exclusión (:ref[I.5#teo-inclusion-exclusion]) y las recurrencias lineales (:ref[I.5#teo-recurrencias]) | [[III.9]], [[III.11]], [[XI.1]] |
| [[I.6]] | Los árboles (:ref[I.6#teo-arboles]), los recorridos en anchura y en profundidad (:ref[I.6#teo-anchura], :ref[I.6#teo-profundidad]), el orden topológico (:ref[I.6#prop-orden-topologico]), los caminos mínimos (:ref[I.6#teo-dijkstra]) y la fórmula de Euler de los grafos planos (:ref[I.6#teo-euler]) | [[II.13]], [[IV.8]], [[IV.9]], [[VI.6]], [[VII.9]], [[VII.12]], [[VII.13]] |
| [[I.7]] | Los grupos y sus reglas de cálculo (:ref[I.7#prop-grupo-basicas]), el teorema de Lagrange (:ref[I.7#teo-lagrange]), los grupos cíclicos (:ref[I.7#teo-ciclicos]), los cocientes y el primer teorema de isomorfismo (:ref[I.7#teo-isomorfismo]), el producto directo (:ref[I.7#def-producto-directo]), el signo de una permutación (:ref[I.7#teo-signo]), las acciones (:ref[I.7#teo-orbita-estabilizador]) y las clases de conjugación (:ref[I.7#prop-clases-sn]) | [[II.4]], [[II.16]], [[V.1]], [[VI.5]], [[VII.1]], [[XIII.1]] |
| [[I.8]] | Los anillos, los cuerpos y los ideales (:ref[I.8#def-ideal]), la división de polinomios (:ref[I.8#teo-division-polinomios]) y la cantidad de raíces (:ref[I.8#teo-raices]), la interpolación (:ref[I.8#cor-interpolacion]), los racionales como cuerpo de fracciones (:ref[I.8#teo-fracciones]) y los cuerpos finitos, con su grupo multiplicativo cíclico (:ref[I.8#teo-existencia-finitos], :ref[I.8#teo-ciclico]) | [[II.1]], [[II.6]], [[III.13]], [[V.3]], [[V.8]] |
| [[I.9]] | Los reales como cuerpo ordenado completo (:ref[I.9#teo-reales]) y su unicidad (:ref[I.9#teo-unicidad]), la propiedad arquimediana (:ref[I.9#prop-arquimediano]), los complejos y su forma polar (:ref[I.9#teo-polar]), las raíces de la unidad (:ref[I.9#cor-raices-unidad]) y el enunciado del teorema fundamental del álgebra (:ref[I.9#teo-fundamental-algebra]), que se demuestra en [[III.8]] | [[II.6]], [[II.8]], [[III.1]] |
| [[I.10]] | Los números de coma flotante (:ref[I.10#def-flotante]), el error relativo del redondeo (:ref[I.10#teo-redondeo]), el error de una suma (:ref[I.10#prop-suma]), la cancelación (:ref[I.10#prop-cancelacion]) y el condicionamiento y la estabilidad (:ref[I.10#def-condicionamiento]) | [[II.12]], [[III.2]], [[III.7]], [[III.10]] |
| [[I.11]] | El lema de Zorn y el buen orden (:ref[I.11#teo-zorn]), la existencia de bases (:ref[I.11#cor-bases]), los ordinales y la recursión transfinita (:ref[I.11#teo-recursion-transfinita]) y los cardinales (:ref[I.11#teo-csb]) | [[V.3]], [[VI.2]], [[X.1]], [[I.12]], [[I.15]] |

Los capítulos [[I.12]] a [[I.15]] no tienen dependientes fuera del tomo. Los órdenes y los retículos de I.12 son
materia de núcleo por sí mismos; los autómatas, la lógica de primer orden y las demostraciones como programas son
complementarios, y sus resultados se citan desde las aplicaciones de otros tomos sin ser requisitos.

## Las fronteras con el Tomo II

Siete capítulos del Tomo II requieren directamente uno del Tomo I. Para cada uno, lo que toma, lo que agrega y lo que
no tiene que repetir; cuando se escriban, cada uno lo declara en su campo `cumple` o lo cita con `:ref`.

- **[[II.1]] Sistemas lineales y matrices**, de [[I.8]]. Toma la definición de cuerpo (:ref[I.8#def-cuerpo]) y los
  cuerpos finitos (:ref[I.8#teo-existencia-finitos]), así que la eliminación de Gauss se hace sobre un cuerpo
  cualquiera desde el principio, y un sistema sobre $\mathbb F_2$, como los de los códigos de I.8, es un ejemplo y
  no una generalización. No repite qué es un cuerpo ni por qué $\mathbb Z/p\mathbb Z$ lo es.
- **[[II.4]] Determinantes**, de [[I.7]]. Toma el grupo simétrico, la descomposición en ciclos
  (:ref[I.7#prop-ciclos]) y, sobre todo, el signo como homomorfismo (:ref[I.7#teo-signo]): la fórmula de Leibniz y la
  unicidad de la forma multilineal alternada descansan en él. Agrega el determinante como volumen orientado; no
  repite que el signo esté bien definido.
- **[[II.6]] Autovalores y autovectores**, de [[I.8]] y [[I.9]]. Toma la cantidad de raíces de un polinomio
  (:ref[I.8#teo-raices]), la relación entre raíces y factores (:ref[I.8#prop-raiz-factor]), la factorización única
  (:ref[I.8#teo-factorizacion]), los complejos (:ref[I.9#def-complejos]) y el teorema fundamental del álgebra con su
  consecuencia para los polinomios reales (:ref[I.9#teo-fundamental-algebra], :ref[I.9#cor-factorizacion]), que el
  Tomo I enuncia y [[III.8]] demuestra. La existencia de autovalores complejos es esa cita, no una demostración nueva.
- **[[II.8]] Espacios con producto interno**, de [[I.9]]. Toma el conjugado, el módulo y la desigualdad triangular
  de los complejos (:ref[I.9#prop-modulo]) y la raíz cuadrada real (:ref[I.9#prop-raiz-cuadrada]). Agrega la
  desigualdad de Cauchy–Schwarz, que da la desigualdad triangular en cualquier dimensión; la del módulo es el caso
  de $\mathbb C$ como espacio de dimensión uno.
- **[[II.12]] Álgebra lineal numérica**, de [[I.10]]. Toma el modelo del redondeo (:ref[I.10#teo-redondeo]), la
  acumulación de errores (:ref[I.10#lem-gamma]), la suma como primer algoritmo estable hacia atrás
  (:ref[I.10#prop-suma]), la cancelación (:ref[I.10#prop-cancelacion]) y las definiciones de condicionamiento y
  estabilidad (:ref[I.10#def-condicionamiento]). Agrega las normas matriciales y el número de condición de una
  matriz, que generalizan el de la resta.
- **[[II.13]] Teoría espectral de grafos**, de [[I.6]]. Toma los grafos y los digrafos (:ref[I.6#def-grafo],
  :ref[I.6#def-digrafo]), las componentes conexas (:ref[I.6#lem-componentes]) y los árboles generadores
  (:ref[I.6#teo-arboles]). Agrega el laplaciano: el número de componentes es la dimensión de su núcleo, y el teorema
  de Kirchhoff cuenta los árboles generadores que I.6 solo construye.
- **[[II.16]] Rotaciones: SO(3) y cuaterniones**, de [[I.7]]. Toma los grupos, los homomorfismos y el primer teorema
  de isomorfismo (:ref[I.7#teo-isomorfismo]), y las acciones con el teorema de la órbita y el estabilizador
  (:ref[I.7#teo-orbita-estabilizador]), que ya contó las rotaciones del cubo (:ref[I.7#ej-cubo]). El recubrimiento
  doble $S^3 \to SO(3)$ es un homomorfismo de núcleo $\{\pm 1\}$, y su lectura es el primer teorema de isomorfismo;
  no hay que volver a demostrarlo.

## Lo que el Tomo I deja prometido

Algunos capítulos del Tomo I usan, antes de tiempo y declarándolo, nociones que otros tomos construyen con rigor: el
logaritmo, el seno y el coseno ([[III.8]]), los puntos y las transformaciones del espacio ([[II.14]], [[II.16]]), la
probabilidad ([[XI.1]]) o la medida ([[IX.1]]). Cada promesa figura en el capítulo que la cumple, y el
[mapa de dependencias](../mapa/) muestra dónde se cumple cada una.
