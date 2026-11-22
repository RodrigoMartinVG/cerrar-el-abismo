---
title: Conversor de convenciones
description: La misma transformación escrita con la mano de los ejes, el tipo de vector y el orden de almacenamiento de cada biblioteca, y la métrica y las coordenadas esféricas de cada tradición.
---

La misma matemática se escribe de maneras distintas según la biblioteca o el libro. La obra fija sus convenciones en
la sección 12 de la especificación: sistemas de mano derecha, vectores columna, matrices almacenadas por columnas,
la signatura (−, +, +, +) y las coordenadas esféricas de la norma ISO 80000-2. Esta herramienta traduce entre esas
convenciones y las otras.

La transformación de ejemplo es una rotación alrededor del eje Y seguida de una traslación por $(1, 2, 3)$. Pasar a un
sistema de mano izquierda es cambiar el signo de la coordenada $z$, y por eso la rotación cambia de sentido y la
traslación cambia de signo en $z$. Pasar a vectores fila es transponer, porque $y = Mx$ equivale a $y^\top = x^\top M^\top$. El orden de almacenamiento no cambia la matriz, sino el orden de sus 16 números en
memoria, que es lo que recibe una GPU.

::figura[La matriz de una rotación seguida de una traslación, y sus 16 números en memoria, en cada combinación de convenciones; debajo, la métrica de Minkowski y las coordenadas esféricas en las suyas.]{#fig-conversor pieza="conversor-de-convenciones" alt="Botones para elegir la mano de los ejes, el tipo de vector, el orden de almacenamiento, la signatura de la métrica y la convención de las coordenadas esféricas, y un deslizador para el ángulo de la rotación. Debajo, la matriz de cuatro por cuatro, sus dieciséis números en el orden de la memoria, y las fórmulas de la métrica y de las coordenadas esféricas."}

Una observación explica muchos errores que no se notan: almacenar por columnas una matriz para vectores columna da
los mismos 16 números que almacenar por filas su transpuesta para vectores fila. Así trabajan, por ejemplo, glTF y
WGSL, por un lado, y DirectXMath, por el otro, y por eso un programa que se equivoca en las dos convenciones a la vez
funciona igual.
