---
title: II.5 Espacio dual y covectores
description: Borrador de prueba de la fase 0. El espacio dual, la aplicación dual y por qué las normales se transforman con la inversa transpuesta.
capitulo: II.5
estado: borrador
---

:::note[Borrador de prueba]
Este es el capítulo de prueba de la fase 0: ejercita cada parte de la plantilla (sección 7 de la especificación) y cada elemento de la capa de libro. El capítulo completo, de unas 32 páginas, es el piloto de la fase 1.
:::

## Entrada

En casi todo motor 3D hay una línea como esta, en el programa de vértices o al cargar una malla:

```glsl
n2 = transpose(inverse(M)) * n;
```

Mueve la normal `n` de una superficie con la transformación `M` del objeto. ¿Por qué no basta con `M * n`, como con los puntos y las tangentes? Al final del capítulo, cada símbolo de esa línea tendrá su teorema.

## Motivación

Una normal no es una flecha cualquiera: su único trabajo es anularse sobre el plano tangente. Si $M$ es una rotación, girar la normal con $M$ conserva los ángulos, y la normal sigue siendo perpendicular. Con una escala no uniforme, en cambio, $M n$ deja de serlo, como muestra la :ref[fig-normal]. La razón es que una normal no es un vector del espacio, sino una forma lineal sobre él: un covector.

::figura[La normal tras una escala no uniforme: con $M$ deja de ser perpendicular; con $(M^{-1})^{\mathsf T}$, no.]{#fig-normal pieza="normal-covector" alt="Una recta del plano escalada horizontalmente, con dos flechas que salen del origen: la normal transformada con M, discontinua, que ya no forma un ángulo recto con la recta, y la transformada con la inversa transpuesta, continua, que sigue siendo perpendicular."}

## Desarrollo

En todo el capítulo, $V$ y $W$ son espacios vectoriales de dimensión finita sobre un cuerpo $k$.

:::definicion[Espacio dual]{#def-dual}
El **espacio dual** de $V$ es $V^* = \mathcal L(V, k)$, el espacio de las aplicaciones lineales de $V$ en $k$. Sus elementos se llaman **funcionales** o **covectores**.
:::

:::definicion[Familia dual]{#def-familia-dual}
Si $(e_1, \dots, e_n)$ es una base de $V$, los funcionales $e^1, \dots, e^n \in V^*$ definidos por $e^i(e_j) = \delta^i_j$ forman la **familia dual** de esa base.
:::

:::teorema[Dimensión del dual]{#teo-dim}
La familia dual de una base de $V$ es una base de $V^*$. En particular, $\dim V^* = \dim V$.
:::

:::demostracion
*Genera.* Sean $\varphi \in V^*$ y $\psi = \sum_i \varphi(e_i)\, e^i$. Para cada $j$, $\psi(e_j) = \sum_i \varphi(e_i)\,\delta^i_j = \varphi(e_j)$; dos aplicaciones lineales que coinciden en una base son iguales, así que $\varphi = \psi$.

*Es independiente.* Si $\sum_i a_i e^i = 0$, al evaluar en $e_j$ queda $a_j = 0$ para todo $j$.
:::

La demostración da además las coordenadas de un covector en la base dual: son sus valores en la base, $\varphi = \sum_i \varphi(e_i)\, e^i$.

:::definicion[Aplicación dual]{#def-aplicacion-dual}
Si $T\colon V \to W$ es lineal, su **aplicación dual** es $T^*\colon W^* \to V^*$, dada por $T^*(\varphi) = \varphi \circ T$.
:::

:::proposicion[Matriz de la aplicación dual]{#prop-transpuesta}
Sean $(e_j)$ y $(f_i)$ bases de $V$ y de $W$, y sea $A$ la matriz de $T$ en ellas. La matriz de $T^*$ en las bases duales $(f^i)$ y $(e^j)$ es $A^{\mathsf T}$.
:::

:::demostracion
Por definición de $A$, $T(e_j) = \sum_i A_{ij} f_i$. Las coordenadas de $T^*(f^i)$ en la base dual son sus valores en la base: $T^*(f^i)(e_j) = f^i(T e_j) = A_{ij}$. Así, $T^*(f^i) = \sum_j A_{ij}\, e^j$, y la columna $i$ de la matriz de $T^*$ es la fila $i$ de $A$.
:::

:::corolario[Cómo se transforma un covector]{#cor-covectores}
Sean $T\colon V \to V$ invertible, con matriz $A$, y $U = \ker\varphi$ un hiperplano. Entonces $T(U) = \ker(\varphi \circ T^{-1})$, y las coordenadas de $\varphi \circ T^{-1}$ en la base dual son las de $\varphi$ multiplicadas por $(A^{-1})^{\mathsf T}$.
:::

:::demostracion
Un vector $v$ está en $T(U)$ si y solo si $T^{-1} v \in U$, es decir, si y solo si $\varphi(T^{-1} v) = 0$. Además, $\varphi \circ T^{-1} = (T^{-1})^*(\varphi)$, y por la :ref[prop-transpuesta] su matriz es la transpuesta de la de $T^{-1}$, que es $A^{-1}$.
:::

:::observacion{#obs-ortogonal}
Si $A$ es ortogonal, $(A^{-1})^{\mathsf T} = A$. Por eso, mientras $M$ solo rota, `M * n` da el resultado correcto, y el error aparece recién con una escala no uniforme.
:::

## Cálculo

La celda comprueba el :ref[cor-covectores] con una escala que estira el eje $x$ al doble. Se puede editar y volver a ejecutar.

```python celda
import numpy as np

M = np.diag([2.0, 1.0, 1.0])     # escala no uniforme
t = np.array([1.0, 1.0, 0.0])    # una tangente de la superficie
n = np.array([-1.0, 1.0, 0.0])   # su normal: n · t = 0

t2 = M @ t
print("con M:      ", t2 @ (M @ n))
print("con (M⁻¹)ᵀ: ", t2 @ (np.linalg.inv(M).T @ n))
```

## Puente

:::puente
1. **¿Cómo se llama esto en la práctica?** «Matriz normal» o «transformación de normales»: la matriz $(M^{-1})^{\mathsf T}$ de la parte lineal de $M$.
2. **¿Qué convenciones hay?** Con vectores fila, la misma regla se escribe `n2 = n * inverse(M)`, sin transponer: es la misma aplicación dual en la otra convención ([[II.14]]).
3. **¿Qué representaciones compiten?** Calcular la inversa transpuesta una vez por objeto, en lugar de por vértice, o usar la matriz de cofactores, que es $\det(M)\,(M^{-1})^{\mathsf T}$: la misma dirección sin dividir, pero con el sentido invertido si $\det M < 0$.
4. **¿Qué se da por supuesto y cuándo falla?** Que $M$ sea invertible: con una escala nula, el plano transformado degenera y la normal no existe.
5. **¿Qué aproximaciones se usan?** Ninguna en la regla. En coma flotante, invertir una matriz mal condicionada amplifica el error, y por eso la normal se renormaliza al final.
:::

:::linea
`transpose(inverse(M)) * n` es el :ref[cor-covectores]: la normal es un covector, y los covectores se transforman con la aplicación dual de $M^{-1}$.
:::

## Aplicaciones

- **3D.** Un plano $\{x : p \cdot x = 0\}$ en coordenadas homogéneas ([[II.13]]) es un covector $p$ de cuatro componentes, y una transformación afín $M$ de $4 \times 4$ lo lleva a $(M^{-1})^{\mathsf T} p$: la misma regla para planos de recorte y de reflexión.
- **Física.** El trabajo $W = F(v)$ es lineal en el desplazamiento, así que la fuerza es un covector: al cambiar de coordenadas, sus componentes se transforman con la inversa transpuesta.
- **Datos.** Un modelo lineal $y = w^{\mathsf T} x$ es un funcional. Si las variables se reescalan, $x' = S x$, los pesos que dan las mismas predicciones son $w' = (S^{-1})^{\mathsf T} w$.

## Salida

La línea de la entrada, `n2 = transpose(inverse(M)) * n`, símbolo por símbolo:

- `n` son las coordenadas de un covector: el funcional que se anula en el plano tangente (:ref[def-dual]).
- `inverse(M)` aparece porque el plano transformado es el núcleo de $\varphi \circ M^{-1}$ (:ref[cor-covectores]).
- `transpose` aparece porque la aplicación dual se representa con la matriz transpuesta (:ref[prop-transpuesta]).
- Con rotaciones, las dos operaciones se cancelan (:ref[obs-ortogonal]).

## Ejercicios

:::ejercicio
Sea $M = \operatorname{diag}(a, b, c)$ con $abc \neq 0$. Calcula $(M^{-1})^{\mathsf T}$ y comprueba que transforma la normal $(1, 1, 1)$ del plano $x + y + z = 0$ en una normal del plano transformado.
:::

:::solucion
$(M^{-1})^{\mathsf T} = \operatorname{diag}(1/a, 1/b, 1/c)$, que lleva $(1, 1, 1)$ a $(1/a, 1/b, 1/c)$. Un punto del plano transformado es $(a x_1, b x_2, c x_3)$ con $x_1 + x_2 + x_3 = 0$, y $\tfrac1a (a x_1) + \tfrac1b (b x_2) + \tfrac1c (c x_3) = x_1 + x_2 + x_3 = 0$.
:::

:::ejercicio
*Encontrar el error.* Un motor transforma las normales con `M * n` y después las renormaliza. ¿Para qué transformaciones el resultado es correcto? Demuéstralo.
:::

:::solucion
Para aquellas cuya parte lineal es un múltiplo de una matriz ortogonal, $A = \lambda Q$ con $\lambda \neq 0$: entonces $(A^{-1})^{\mathsf T} = \lambda^{-1} Q$, que tiene la misma dirección y el mismo sentido que $A$, y la renormalización corrige el factor. Recíprocamente, si $A n$ es paralelo a $(A^{-1})^{\mathsf T} n$ para todo $n$, al aplicar $A^{\mathsf T}$ resulta que $A^{\mathsf T} A n$ es paralelo a $n$ para todo $n$. Entonces todo vector es autovector de $A^{\mathsf T} A$, que por lo tanto es $\mu I$ con $\mu > 0$, y $A = \sqrt{\mu}\, Q$ con $Q$ ortogonal.
:::

## Notas y «Para seguir»

**Lecturas.** Axler, *Linear Algebra Done Right*, sección 3.F; Halmos, *Finite-Dimensional Vector Spaces*.

**Para seguir.** El doble dual y los tensores llegan en [[II.11]]; el gradiente como covector, en [[IV.2]].
