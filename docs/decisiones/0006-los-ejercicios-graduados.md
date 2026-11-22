# 0006. Los ejercicios dicen su dificultad, su tipo y su sección, y los de cálculo se comprueban

*Fecha: 2026-11-22 · Estado: aceptada*

## Contexto

La especificación pide, en la sección 10, de 15 a 20 ejercicios por capítulo, de tipos mezclados, cada uno con su
dificultad y la sección a la que corresponde, y que los de cálculo comprueben la respuesta en el navegador. Hasta
ahora los ejercicios eran un entorno sin más datos que su número: nada decía cuáles eran rutina y cuáles un desafío,
ni a qué parte del Desarrollo volver para hacerlos, y la regla de que los impares tienen solución dependía de que
nadie se equivocara al agregar uno. La lectura previa del Tomo I encontró justamente eso en el piloto de I.7: un
ejercicio duplicado corrió la paridad de los siguientes.

## Decisión

- **Los atributos.** Cada ejercicio los lleva en su directiva:

  ```markdown
  :::ejercicio{#ej-manos nivel=1 tipo=calculo seccion="combinaciones-y-coeficientes-binomiales" respuesta=2598960 comprobacion="math.comb(52, 5)"}
  ```

  - `nivel`: `1`, rutina, que aplica una definición o un resultado tal como está; `2`, pide una idea, como elegir el
    resultado que sirve o combinar dos; `3`, desafío, con una idea que el capítulo no da hecha. El sitio lo muestra
    con estrellas.
  - `tipo`: `demostracion`, `calculo`, `exploracion` (con una figura o una celda), `traduccion` (entre la notación de
    la obra y la de la práctica, 8.4) o `proyecto` (que combina capítulos).
  - `seccion`: el identificador de la sección a la que corresponde, el mismo que el sitio da a su título: un `###` del
    Desarrollo, o Cálculo, Puente o Aplicaciones. El sitio lo muestra como un enlace a la sección.
  - `respuesta`, en los de cálculo: un entero, una fracción `a/b` o un decimal. El sitio pone un campo para que el
    lector escriba la suya, y las compara exactamente si las dos son enteros o fracciones, y con una tolerancia
    relativa si alguna es decimal (`tolerancia`, por omisión una parte en un millón).
  - `comprobacion`, opcional: una expresión de Python que las pruebas evalúan, con `math` y `Fraction` a mano, para
    confirmar que la respuesta escrita es la correcta.
- **Las soluciones.** Los impares la tienen, en el entorno `solucion` que sigue al ejercicio, y los pares no. Una
  prueba lo exige, junto con los atributos.
- **La transición.** Los quince capítulos del Tomo I se gradúan en su pasada de la fase D; hasta entonces una lista
  de pendientes en la prueba los exime, y la lista desaparece al terminar la fase.

## Consecuencias

- Agregar un ejercicio en el medio obliga a mover las soluciones que cambian de paridad, y la prueba lo señala.
- Las respuestas simbólicas, que la especificación quiere comprobar con SymPy, quedan para cuando un capítulo las
  necesite: el Tomo I pide sobre todo números, y cargar SymPy en el navegador cuesta varios megabytes.
- El reporte de densidad puede contar los ejercicios por tipo y por nivel, para ver si un capítulo los mezcla.

## Alternativas descartadas

- **Escribir la dificultad y la sección en el texto del ejercicio.** Se lee igual, pero ninguna prueba puede
  comprobar que la sección existe ni que la paridad de las soluciones sigue bien.
- **Numerar la sección en lugar de nombrarla.** Las secciones no tienen número en la obra, y un número se rompe al
  agregar una.
- **Comprobar las respuestas solo en las pruebas.** El valor está en que el lector lo haga en el momento.
