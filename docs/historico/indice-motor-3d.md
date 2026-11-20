# Métodos Matemáticos para Ingeniería de Motores 3D — Índice temático revisado

Nov 19, 2026 · @puedes generar imagenes o musica?

## Qué cambió

Esta versión separa los capítulos comprimidos. El criterio es que cada capítulo cubra un solo tema del tamaño de un capítulo de un libro de texto de referencia, con espacio para demostraciones, ejemplos y ejercicios. Se dividieron 27 capítulos que juntaban dos o tres temas, que dan 56 capítulos nuevos. Así el libro pasa de 47 a 76 capítulos y de 13 a 14 partes, porque la antigua Parte X (EDO y mecánica) se separa en dos. Los capítulos que salen de una división llevan la marca *(dividido)*, y el orden de dependencias se volvió a verificar.

| Parte | Caps. antes | Caps. ahora | Temas que se separaron |
| --- | --- | --- | --- |
| I | 5 | 8 | Lógica y precálculo; trigonometría y complejos; aritmética modular y grafos |
| II | 5 | 7 | Sistemas lineales y determinantes; autovalores y SVD |
| III | 3 | 5 | Derivadas e integrales; ecuaciones no lineales y cuadratura |
| IV | 4 | 6 | Rotaciones en tres capítulos: matrices y ángulos de Euler, cuaterniones, grupos de Lie |
| V | 2 | 3 | Integración múltiple y teoremas integrales |
| VI | 3 | 5 | Optimización y diferenciación automática; Lagrange y KKT, y complementariedad |
| VII | 3 | 4 | Series de Fourier y transformada con FFT |
| VIII | 4 | 7 | Curvas y superficies paramétricas; topología, geometría discreta y procesamiento de mallas |
| IX | 3 | 5 | Convexidad y distancia entre convexos; triangulaciones y particiones del espacio |
| X y XI (antes X) | 5 | 8 | EDO y sistemas; integradores explícitos e implícitos; mecánica lagrangiana y contacto |
| XII (antes XI) | 3 | 6 | EDP y diferencias finitas; medios continuos y elementos finitos; Navier–Stokes y partículas |
| XIII (antes XII) | 3 | 6 | Probabilidad y distribuciones multivariantes; Monte Carlo y cuasi-Monte Carlo; procesos puntuales y campos aleatorios |
| XIV (antes XIII) | 4 | 6 | Radiometría y colorimetría; ecuación de renderizado y BRDF |
| **Total** | **47** | **76** | **27 capítulos divididos en 56** |

La matemática conserva su orden, y la ingeniería sigue como casos de aplicación dentro de cada capítulo. La extensión sube a unas 3.384 páginas, 982 más que antes (+41 %), y la media por capítulo baja de 48 a 43 páginas.

Esta versión agrega además el motor del libro: un motor 3D didáctico que crece con los mismos requisitos que los capítulos y permite estudiar por dos caminos, primero la matemática o primero el motor. Su sección está después del grafo de dependencias, y cada capítulo indica su hito con la línea «En el motor».

## Contrato pedagógico y estructura

Es un libro de matemática aplicada: cada capítulo desarrolla un tema matemático y muestra sus usos en motores 3D, pero ningún capítulo trata de ingeniería o de informática por sí mismas. Está pensado para programadores sin formación matemática universitaria; los Caps. 1 y 2 repasan la lógica y el álgebra de secundaria.

### Plantilla de cada capítulo

1. **Requisitos:** los capítulos previos cuya matemática usa.
2. **Desarrollo matemático:** definiciones, intuición geométrica, teoremas y demostraciones o derivaciones sin saltos.
3. **Análisis numérico:** errores, estabilidad y condicionamiento de los algoritmos que surgen de la teoría.
4. **Casos de aplicación en motores 3D:** los subsistemas que usan esa matemática. Solo se apoyan en capítulos anteriores; un capítulo posterior aparece únicamente como aviso de dónde se retoma el tema. El capítulo desarrolla la matemática y una versión mínima; el sistema completo vive en el motor del libro.
5. **Laboratorio en el motor del libro:** el módulo del capítulo implementa la operación central y sus pruebas verifican los invariantes. La línea «En el motor» dice en qué hito aparece y a partir de qué capítulo se abre.
6. **Ejercicios graduados,** con soluciones completas de los impares.

### Parámetros editoriales

- Formato de referencia: libro técnico universitario de 17 × 24 cm (7″ × 10″).
- Composición media por capítulo: \~50 % teoría y demostraciones, \~15 % análisis numérico, \~20 % casos de aplicación y laboratorio, \~15 % ejercicios.
- Extensión media: unas 43 páginas por capítulo, entre 28 y 56. Ningún capítulo junta temas que un libro de texto trataría en capítulos distintos.

### Criterios de orden

- Ninguna herramienta se usa antes de construirse; las referencias hacia adelante son solo avisos. Verificado con un script sobre los 76 capítulos.
- Primero el lenguaje, el número y la matemática discreta; después álgebra lineal, que solo necesita la Parte I, y luego cálculo.
- Las Partes I a VI forman un núcleo común. Después el libro se abre en cinco recorridos que pueden leerse en paralelo: Fourier (Parte VII), superficies (VIII), geometría computacional (IX), mecánica (X a XII), y azar y luz (XIII y XIV).
- El motor del libro sigue el mismo grafo: sus hitos son otro orden válido de los mismos capítulos, así que ninguno de los dos caminos de lectura rompe las dependencias.
- El Cap. 26 (PGA) se puede saltar: ningún capítulo depende de él.

## Grafo de dependencias

&#91;embedded content: dependencias entre partes · 14 partes, núcleo común y 5 recorridos\]

Las Partes I a VI forman un núcleo común que se lee en orden. Después salen cinco recorridos; el de mecánica ocupa las Partes X a XII y el de azar y luz, las XIII y XIV. Las flechas entre recorridos son las únicas dependencias cruzadas: Fourier alimenta las EDP y los campos aleatorios, y la geometría computacional aporta los rayos y las jerarquías de volúmenes al transporte de luz. El Cap. 26 (PGA) se puede saltar.

## El motor del libro y los dos caminos de lectura

El libro se acompaña de un motor 3D didáctico, escrito en TypeScript para el navegador, que existe solo para servir al libro. Cada módulo implementa la matemática de un capítulo y depende de los mismos capítulos que figuran en su línea «Requiere». Como el motor crece sobre el mismo grafo que el texto, se puede recorrer en dos sentidos, y los dos caminos pasan por los mismos módulos.

### Los dos caminos

- **Camino matemático, en el orden del libro.** Se leen los capítulos en orden. La línea «En el motor» de cada capítulo dice qué hito usa su matemática y a partir de qué capítulo se abre. Al llegar ahí, el lector descarga la etiqueta de ese hito y encuentra los módulos funcionando, con sus pruebas. Los casos de aplicación grandes, como el motor de física o el trazador de caminos, se estudian completos en el motor.
- **Camino práctico, primero el motor.** Se avanza por hitos. La página de cada hito en el sitio del motor empieza con «Antes de empezar», que enumera los capítulos que pide con enlaces al texto, y cada archivo cita el capítulo y la ecuación que implementa. El lector construye, encuentra la matemática que le falta, la estudia en el libro y vuelve al motor.

Se puede pasar de un camino al otro en cualquier momento, porque los dos usan los mismos módulos, las mismas pruebas y los mismos requisitos.

### Reglas del motor

1. **Un módulo por capítulo.** Una regla de *imports* en la integración continua rechaza cualquier módulo que use otro de un capítulo ausente de su «Requiere», así que el código verifica el orden del libro.
2. **Un hito es una etiqueta del repositorio:** los módulos necesarios para que algo nuevo aparezca en pantalla, cerrados bajo dependencias. Sus requisitos se calculan del grafo del libro, no se escriben a mano.
3. **Las pruebas son los teoremas.** Cada módulo trae pruebas que comprueban los invariantes de su capítulo, como que una rotación conserve las normas, que un integrador simpléctico no derive en energía o que el error de Monte Carlo baje como 1/√N. El mensaje de cada prueba cita el resultado que verifica, y los ejercicios del capítulo piden romperlas y arreglarlas.
4. **Claridad antes que rendimiento.** El motor implementa la versión que explica el libro: dibuja primero con un rasterizador por software y pasa a la GPU con WebGPU cuando el lector ya sabe qué hace cada etapa. Three.js y Rapier sirven de referencia para comparar resultados y velocidad, no como dependencias.
5. **Cada edición del libro fija una versión del motor**, para que texto y código no se desfasen.

### Hitos

El tronco, de H1 a H5, lleva del plano a un cubo con cámara. Desde ahí se abren ramas que se pueden seguir en cualquier orden respetando la columna «Hitos previos»: tiempo y física (H6 a H13), geometría (H14 y H15), imagen y luz (H16 a H18 y H22), mundos procedurales (H19) y medios continuos (H20 y H21). Cada capítulo entra como nuevo en un solo hito; el Cap. 26 (PGA), opcional, no tiene hito.

| Hito | Qué aparece en pantalla | Caps. nuevos | Hitos previos | Se abre tras el Cap. |
| --- | --- | --- | --- | --- |
| H0. Lienzo y bucle | Ventana con lienzo, bucle principal y entrada; sin matemática nueva (Apéndice B) | — | — | — |
| H1. Formas en el plano | Puntos, rectas y circunferencias; prueba de lado con el ratón; colores interpolados | 1–4 | H0 | 4 |
| H2. Movimiento circular en 2D | Objetos que orbitan y giran, con rotaciones por números complejos | 5, 6 | H1 | 6 |
| H3. Cubo de alambre | Cubo en alambre con proyección ortográfica, girado con matrices | 9–11 | H2 | 11 |
| H4. Cubo sólido en perspectiva | Rasterizador por software con z-buffer, descarte de caras traseras, sombreado de Lambert y grafo de escena | 8, 12, 13, 21, 22 | H3 | 22 |
| H5. Cámara y orientaciones | Cámaras orbital y en primera persona; interpolación de orientaciones con SLERP | 14, 23, 24 | H4 | 24 |
| H6. Animación suave | Funciones de *easing* y suavizado exponencial independiente del paso | 16–18 | H3 | 18 |
| H7. Partículas y paso fijo | Emisores con semillas reproducibles, gravedad, muelles amortiguados y bucle de paso fijo | 7, 51–53 | H5, H6 | 53 |
| H8. Selección con el ratón | Clic sobre objetos con intersección rayo–triángulo y predicados robustos | 19, 46 | H4, H6 | 46 |
| H9. Volúmenes envolventes | Cajas orientadas, BVH con SAH y *broadphase* | 15, 27, 28, 50 | H5, H8 | 50 |
| H10. Colisiones entre convexos | GJK, EPA y detección continua | 30, 47, 48 | H9 | 48 |
| H11. Personajes articulados | Esqueleto con cinemática inversa y *skinning* con cuaterniones duales | 25, 31, 56 | H10 | 56 |
| H12. Cuerpos rígidos | Cajas que caen y giran con su tensor de inercia | 29, 34, 54, 55 | H7, H11 | 55 |
| H13. Restricciones y contacto | Pilas de cajas, articulaciones, *ragdolls*, cuerdas y tela; comparación con Rapier | 32, 33, 57, 58 | H12 | 58 |
| H14. Curvas y recorridos de cámara | Rieles a velocidad constante, tubos sin giros bruscos y parches NURBS | 20, 39–41 | H9 | 41 |
| H15. Mallas y campos de distancia | Suavizado, subdivisión, niveles de detalle y *ray marching* | 42–45 | H12, H14 | 45 |
| H16. Texturas filtradas y posprocesado | *Mipmaps*, filtrado anisotrópico, *bloom* y TAA | 35–37 | H9 | 37 |
| H17. Luz en unidades físicas | Luces en lux y nits, exposición, color lineal, mapeo tonal y sombras por varianza | 65, 71, 72 | H7, H9 | 72 |
| H18. Materiales PBR | Microfacetas GGX e iluminación ambiental con armónicos esféricos | 38, 66, 67, 73, 74 | H16, H17 | 74 |
| H19. Mundos procedurales | Terreno fractal, vegetación con disco de Poisson y navegación sobre triangulaciones | 49, 69, 70 | H18 | 70 |
| H20. Agua y fluidos | Agua en campo de alturas, humo con *Stable Fluids* y SPH | 59, 60, 63, 64 | H12, H16 | 64 |
| H21. Sólidos deformables | Elementos finitos corrotacionales | 61, 62 | H20 | 62 |
| H22. Trazador de caminos | Imagen progresiva con caminos, ReSTIR y niebla volumétrica | 68, 75, 76 | H18 | 76 |

La última columna sirve al camino matemático: es el capítulo más avanzado entre los requisitos del hito. En el camino práctico, leer completos los requisitos acumulados son unas 158 páginas para H1, 292 para H3 y 630 para H5. Por eso el tronco tiene lectura mínima.

### Lectura mínima en el tronco

Hasta H5, el camino práctico puede leer solo parte de algunos capítulos. Lo pendiente se completa en el primer hito posterior que pida ese capítulo, y la página del hito lo recuerda. Desde H6, los hitos piden capítulos completos. El grafo está verificado capítulo por capítulo; esta lectura mínima es una propuesta que hay que validar sección por sección al escribir el libro.

| Hito | Lectura mínima | Puede esperar |
| --- | --- | --- |
| H1 | Cap. 1: conjuntos, funciones y notación Σ · Cap. 2: funciones, composición e inversa · Cap. 3: IEEE 754 y comparaciones con tolerancia · Cap. 4 completo | Demostraciones por inducción, exponenciales y logaritmos, formatos de menor precisión |
| H2 | Cap. 5: círculo unitario, identidades, `atan2` y coordenadas polares · Cap. 6: forma polar y multiplicación como rotación | Parametrizaciones de la esfera, solución de la cúbica y raíces de la unidad |
| H3 | Caps. 9 y 11 completos · Cap. 10: productos escalar y vectorial | Gram–Schmidt |
| H4 | Cap. 8: árboles y recorridos · Cap. 12: eliminación e inversa · Cap. 13: determinante como volumen y orientación · Caps. 21 y 22 completos | Caminos mínimos, gramáticas y restricciones; rango y espacios fundamentales; condicionamiento y métodos iterativos |
| H5 | Cap. 10: Gram–Schmidt, pendiente de H3 · Cap. 14: autovalores, autovectores e iteración de potencias · Caps. 23 y 24 completos | Teorema Espectral y formas cuadráticas |

### Cómo se señalan el libro y el motor

- **Del libro al motor:** la línea «En el motor» de cada capítulo y el Apéndice B, con el mapa de módulos, hitos y etiquetas.
- **Del motor al libro:** la página de cada hito, con «Antes de empezar» y la lectura mínima; la cabecera de cada archivo, con capítulo y ecuación; y los mensajes de las pruebas, que citan el resultado que verifican.

## Parte I — Fundamentos: lenguaje, número, geometría y matemática discreta

*314 págs. (rango 273–336).* Lo mínimo para leer y escribir matemática, entender qué hace una computadora con los números y razonar sobre estructuras discretas.

### Capítulo 1. Lógica, conjuntos y demostración *(dividido)*

*36 págs. · Requiere: nada*

- Conjuntos, operaciones y producto cartesiano; relaciones y funciones como conjuntos.
- Lógica proposicional y cuantificadores; implicación, contrapositiva y negación.
- Notación de sumatorias (Σ) y productorias (Π), y manipulación de índices.
- Demostraciones directas, por contradicción y por inducción.

**Casos de aplicación:** invariantes de bucles y aserciones como enunciados lógicos, y pruebas por propiedades en el laboratorio.

**En el motor:** hito H1, *Formas en el plano* (se abre al terminar el Cap. 4).

**Bibliografía**

- Velleman, D. J. (2019). *How to Prove It: A Structured Approach* (3.ª ed.). Cambridge University Press.
- Rosen, K. H. (2019). *Discrete Mathematics and Its Applications* (8.ª ed.). McGraw-Hill — Caps. 1 y 2.

### Capítulo 2. Álgebra elemental y funciones *(dividido)*

*48 págs. · Requiere: Cap. 1*

- Polinomios, factorización y fracciones algebraicas.
- Ecuaciones, inecuaciones y valor absoluto.
- Funciones: dominio, imagen, composición, inversa y transformaciones de gráficas.
- Exponenciales y logaritmos.
- Sucesiones e iteración de punto fijo con una noción intuitiva de convergencia; el Cap. 16 la formaliza.

**Casos de aplicación:** funciones de remapeo (`clamp`, `lerp`, `smoothstep`), escalas logarítmicas (decibeles, exposición) e iteraciones de suavizado.

**En el motor:** hito H1, *Formas en el plano* (se abre al terminar el Cap. 4).

**Bibliografía**

- Stewart, J., Redlin, L., & Watson, S. (2017). *Precálculo: Matemáticas para el cálculo* (7.ª ed.). Cengage Learning.
- Zill, D. G., & Dewar, J. M. (2012). *Álgebra, trigonometría y geometría analítica* (3.ª ed.). McGraw-Hill.

### Capítulo 3. Aritmética de punto flotante y análisis de error

*40 págs. · Requiere: Cap. 2*

- Representación IEEE 754 (float32 y float64): mantisa, exponente, épsilon de máquina y ULP.
- Errores de redondeo, cancelación catastrófica y pérdida de significancia.
- Condicionamiento de un problema frente a estabilidad de un algoritmo; error hacia adelante y hacia atrás.
- Comparaciones con tolerancia absoluta y relativa, e invariantes numéricos.
- Formatos de menor precisión (float16, bfloat16, enteros normalizados y punto fijo) y su error de cuantización.

**Casos de aplicación:** deriva lejos del origen y *origin rebasing*, compresión de vértices y normales, determinismo entre plataformas (incluido que `Math.sin` puede variar entre navegadores) y emulación de float32 en TypeScript.

**En el motor:** hito H1, *Formas en el plano* (se abre al terminar el Cap. 4).

**Bibliografía**

- Goldberg, D. (1991). *What Every Computer Scientist Should Know About Floating-Point Arithmetic*. ACM Computing Surveys, 23(1), 5–48.
- Higham, N. J. (2002). *Accuracy and Stability of Numerical Algorithms* (2.ª ed.). SIAM.
- Muller, J.-M., et al. (2018). *Handbook of Floating-Point Arithmetic* (2.ª ed.). Birkhäuser.

### Capítulo 4. Geometría analítica cartesiana

*34 págs. · Requiere: Cap. 2*

- Recta real, plano R² y espacio R³; distancia euclidiana y normas L1 y L∞.
- Ecuaciones paramétricas e implícitas de rectas, circunferencias, planos y esferas.
- Lateralidad: el signo de una ecuación implícita dice de qué lado está un punto; es el preludio de los predicados del Cap. 46.

**Casos de aplicación:** pruebas de distancia y de lado en consultas espaciales sencillas.

**En el motor:** hito H1, *Formas en el plano* (se abre con este capítulo).

**Bibliografía**

- Dunn, F., & Parberry, I. (2011). *3D Math Primer for Graphics and Game Development* (2.ª ed.). CRC Press — Cap. 1.
- Zill, D. G., & Dewar, J. M. (2012). *Álgebra, trigonometría y geometría analítica* (3.ª ed.). McGraw-Hill.

### Capítulo 5. Trigonometría y coordenadas curvilíneas *(dividido)*

*44 págs. · Requiere: Cap. 4*

- Círculo unitario, radianes y funciones trigonométricas construidas geométricamente.
- Identidades, suma de ángulos, leyes de senos y cosenos, funciones inversas y `atan2`.
- Coordenadas polares, cilíndricas y esféricas; parametrizaciones de la esfera (equirectangular, cúbica y octaédrica) y su distorsión.
- Solución trigonométrica de la cúbica, que el Cap. 14 usa para autovalores 3×3.

**Casos de aplicación:** cámaras orbitales, *cubemaps* y codificación octaédrica de normales.

**En el motor:** hito H2, *Movimiento circular en 2D* (se abre al terminar el Cap. 6).

**Bibliografía**

- Zill, D. G., & Dewar, J. M. (2012). *Álgebra, trigonometría y geometría analítica* (3.ª ed.). McGraw-Hill.
- Dunn, F., & Parberry, I. (2011). *3D Math Primer for Graphics and Game Development* (2.ª ed.). CRC Press — Caps. 1 y 7.
- Cigolle, Z. H., et al. (2014). *A Survey of Efficient Representations for Independent Unit Vectors*. Journal of Computer Graphics Techniques, 3(2), 1–30 (aplicación).

### Capítulo 6. Números complejos *(dividido)*

*32 págs. · Requiere: Cap. 5*

- Forma cartesiana y polar, módulo y conjugado.
- Multiplicación como rotación y escalado; fórmula de De Moivre.
- Raíces de la unidad, base de la FFT del Cap. 36.
- Geometría del plano complejo; la fórmula de Euler se demuestra en el Cap. 18.

**Casos de aplicación:** rotaciones 2D sin matrices y fasores para representar oscilaciones.

**En el motor:** hito H2, *Movimiento circular en 2D* (se abre con este capítulo).

**Bibliografía**

- Needham, T. (1997). *Visual Complex Analysis*. Oxford University Press — Cap. 1.
- Zill, D. G., & Wright, W. S. (2015). *Matemáticas avanzadas para ingeniería* (4.ª ed.). McGraw-Hill — Cap. 17.

### Capítulo 7. Aritmética modular, combinatoria y números pseudoaleatorios *(dividido)*

*36 págs. · Requiere: Cap. 2*

- Divisibilidad, aritmética modular y máximo común divisor.
- Funciones de dispersión (*hash*) y el principio del palomar: por qué siempre hay colisiones.
- Combinatoria: conteo, permutaciones, combinaciones y coeficientes binomiales.
- Generadores pseudoaleatorios congruenciales y PCG: período y calidad estadística.

**Casos de aplicación:** semillas reproducibles para mundos procedurales, *hashing* espacial y colisiones de *hash*.

**En el motor:** hito H7, *Partículas y paso fijo* (se abre al terminar el Cap. 53).

**Bibliografía**

- Rosen, K. H. (2019). *Discrete Mathematics and Its Applications* (8.ª ed.). McGraw-Hill — Caps. 4 y 6.
- Knuth, D. E. (1997). *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms* (3.ª ed.). Addison-Wesley — Cap. 3.
- O'Neill, M. E. (2014). *PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation*. Informe técnico HMC-CS-2014-0905, Harvey Mudd College.

### Capítulo 8. Grafos, caminos mínimos y lenguajes formales *(dividido)*

*44 págs. · Requiere: Cap. 1*

- Grafos y árboles: caminos, conectividad, componentes conexas y recorridos.
- Caminos mínimos: Dijkstra y A\*, con la demostración de optimalidad para heurísticas admisibles.
- Gramáticas formales y sistemas de reescritura (L-systems).
- Problemas de satisfacción de restricciones y búsqueda con vuelta atrás.

**Casos de aplicación:** grafos de escena, islas de simulación con *union-find*, navegación por grafos, vegetación con L-systems y generación de niveles con *Wave Function Collapse*.

**En el motor:** hito H4, *Cubo sólido en perspectiva* (se abre al terminar el Cap. 22).

**Bibliografía**

- Rosen, K. H. (2019). *Discrete Mathematics and Its Applications* (8.ª ed.). McGraw-Hill — Caps. 10 y 11.
- Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). *A Formal Basis for the Heuristic Determination of Minimum Cost Paths*. IEEE Transactions on Systems Science and Cybernetics, 4(2), 100–107.
- Prusinkiewicz, P., & Lindenmayer, A. (1990). *The Algorithmic Beauty of Plants*. Springer.

## Parte II — Álgebra lineal

*302 págs. (rango 262–323).* Va antes del cálculo porque solo necesita la Parte I; construida desde la acción de las matrices sobre el espacio.

### Capítulo 9. Vectores, combinaciones lineales y bases

*40 págs. · Requiere: Cap. 4*

- Vectores como desplazamientos geométricos y como elementos algebraicos: suma, multiplicación escalar y normas.
- Combinaciones lineales, espacio generado, dependencia e independencia lineal.
- Bases, dimensión y cambio de coordenadas.

**Casos de aplicación:** posiciones, velocidades y fuerzas; paso entre el espacio de un objeto y el del mundo.

**En el motor:** hito H3, *Cubo de alambre* (se abre al terminar el Cap. 11).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Caps. 1 y 3.
- Lengyel, E. (2016). *Foundations of Game Engine Development, Vol. 1: Mathematics*. Terathon Software — Cap. 1.

### Capítulo 10. Producto escalar, producto vectorial y geometría métrica

*44 págs. · Requiere: Caps. 5 y 9*

- Producto escalar: definición algebraica y geométrica, ángulos, proyecciones ortogonales y descomposición en componentes.
- Ortogonalidad, bases ortonormales y Gram–Schmidt.
- Producto vectorial en R³: áreas orientadas, orientación de mano derecha o izquierda y triple producto escalar.

**Casos de aplicación:** ley del coseno en la iluminación difusa, descarte de caras traseras, normales de triángulos y re-ortonormalización de cámaras con deriva numérica.

**En el motor:** hito H3, *Cubo de alambre* (se abre al terminar el Cap. 11).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Cap. 4.
- Van Verth, J. M., & Bishop, L. M. (2015). *Essential Mathematics for Games and Interactive Applications* (3.ª ed.). CRC Press — Cap. 2.

### Capítulo 11. Matrices y transformaciones lineales

*46 págs. · Requiere: Cap. 10*

- Transformaciones lineales y lectura de una matriz por columnas.
- Producto matriz–vector y matriz–matriz como composición; no conmutatividad.
- Transpuesta; matrices simétricas, antisimétricas (\[v\]× del producto vectorial) y ortogonales.

**Casos de aplicación:** transformaciones de modelo, la matriz del producto vectorial en física y el orden por filas o por columnas en memoria (Three.js recibe filas y guarda columnas).

**En el motor:** hito H3, *Cubo de alambre* (se abre con este capítulo).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Caps. 2 y 8.
- Dunn, F., & Parberry, I. (2011). *3D Math Primer for Graphics and Game Development* (2.ª ed.). CRC Press — Caps. 4 y 5.

### Capítulo 12. Sistemas lineales: eliminación, rango y espacios fundamentales *(dividido)*

*44 págs. · Requiere: Cap. 11*

- Eliminación gaussiana, pivoteo parcial y factorización LU.
- Cálculo de la inversa por eliminación.
- Rango, núcleo y espacio columna; el teorema fundamental del álgebra lineal.

**Casos de aplicación:** inversión de transformaciones y sistemas pequeños en consultas geométricas.

**En el motor:** hito H4, *Cubo sólido en perspectiva* (se abre al terminar el Cap. 22).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Caps. 2 y 3.
- Trefethen, L. N., & Bau, D. (1997). *Numerical Linear Algebra*. SIAM.

### Capítulo 13. Determinantes, condicionamiento y métodos iterativos *(dividido)*

*36 págs. · Requiere: Cap. 12*

- El determinante como factor de cambio de volumen y orientación; propiedades.
- Cofactores y regla de Cramer.
- Normas matriciales inducidas y número de condición.
- Métodos iterativos de Jacobi y Gauss–Seidel, con convergencia por dominancia diagonal.

**Casos de aplicación:** orientación de triángulos, detección de reflexiones en transformaciones y los *solvers* iterativos de física, que se retoman en el Cap. 33.

**En el motor:** hito H4, *Cubo sólido en perspectiva* (se abre al terminar el Cap. 22).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Cap. 5.
- Trefethen, L. N., & Bau, D. (1997). *Numerical Linear Algebra*. SIAM.

### Capítulo 14. Autovalores, autovectores y Teorema Espectral *(dividido)*

*48 págs. · Requiere: Caps. 5 y 13*

- Av = λv y polinomio característico; para simétricas 3×3, la solución trigonométrica de la cúbica (Cap. 5).
- Diagonalización.
- Teorema Espectral para matrices simétricas reales.
- Formas cuadráticas y matrices definidas positivas.
- Cálculo numérico: iteración de potencias y método de Jacobi.

**Casos de aplicación:** ejes principales de inercia y elipsoides definidos por formas cuadráticas.

**En el motor:** hito H5, *Cámara y orientaciones* (se abre al terminar el Cap. 24).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Cap. 6.
- Golub, G. H., & Van Loan, C. F. (2013). *Matrix Computations* (4.ª ed.). Johns Hopkins University Press.

### Capítulo 15. SVD, mínimos cuadrados y descomposición polar *(dividido)*

*44 págs. · Requiere: Cap. 14*

- SVD: rotación–escala–rotación y aproximación de rango bajo.
- Pseudoinversa y mínimos cuadrados lineales: ecuaciones normales y factorización QR.
- Número de condición σmáx/σmín.
- Matriz de dispersión de una nube de puntos y análisis de componentes principales; el Cap. 66 la reinterpreta como covarianza.
- Descomposición polar: rotación por estiramiento.

**Casos de aplicación:** cajas orientadas (OBB) por componentes principales, ajuste de planos, *shape matching* y compresión de datos.

**En el motor:** hito H9, *Volúmenes envolventes* (se abre al terminar el Cap. 50).

**Bibliografía**

- Strang, G. (2016). *Introduction to Linear Algebra* (5.ª ed.). Wellesley-Cambridge Press — Cap. 7.
- Golub, G. H., & Van Loan, C. F. (2013). *Matrix Computations* (4.ª ed.). Johns Hopkins University Press.
- Shoemake, K., & Duff, T. (1992). *Matrix Animation and Polar Decomposition*. Proceedings of Graphics Interface '92, 258–264.
- Ericson, C. (2004). *Real-Time Collision Detection*. Morgan Kaufmann — Cap. 4 (aplicación).

## Parte III — Cálculo de una variable y análisis numérico elemental

*200 págs. (rango 174–215).* Las series de Taylor sostienen la fórmula de Euler, el mapa exponencial y todos los integradores.

### Capítulo 16. Límites y derivadas *(dividido)*

*48 págs. · Requiere: Caps. 3 y 5*

- Límites y continuidad, formalizando la convergencia intuitiva del Cap. 2.
- La derivada como tasa de cambio y mejor aproximación lineal; reglas, regla de la cadena y derivación implícita.
- Máximos, mínimos y teorema del valor medio.
- Derivación numérica por diferencias finitas y su error en coma flotante (Cap. 3).

**Casos de aplicación:** cinemática 1D, suavidad de las funciones de *easing* y efecto Doppler como derivada de la distancia.

**En el motor:** hito H6, *Animación suave* (se abre al terminar el Cap. 18).

**Bibliografía**

- Stewart, J. (2018). *Cálculo de una variable: Trascendentes tempranas* (8.ª ed.). Cengage Learning — Caps. 2 a 4.
- Strang, G. (1991/2017). *Calculus*. Edición abierta, MIT OpenCourseWare.

### Capítulo 17. Integrales *(dividido)*

*40 págs. · Requiere: Cap. 16*

- Sumas de Riemann e integral definida.
- Teorema Fundamental del Cálculo.
- Técnicas: sustitución, integración por partes e integrales impropias.
- Aplicaciones: áreas, valores medios y longitud de arco de curvas planas.

**Casos de aplicación:** distancia recorrida a partir de la velocidad, energía acumulada y promedios de señales.

**En el motor:** hito H6, *Animación suave* (se abre al terminar el Cap. 18).

**Bibliografía**

- Stewart, J. (2018). *Cálculo de una variable: Trascendentes tempranas* (8.ª ed.). Cengage Learning — Caps. 5 a 7.
- Strang, G. (1991/2017). *Calculus*. Edición abierta, MIT OpenCourseWare.

### Capítulo 18. Series, aproximación de Taylor y la exponencial compleja

*40 págs. · Requiere: Caps. 6, 11 y 17*

- Sucesiones y series; convergencia absoluta, también para series de números complejos.
- Series de Taylor con resto y error de truncamiento.
- La exponencial real y compleja: demostración de e^(iθ) = cos θ + i·sen θ.
- La exponencial de una matriz como serie.

**Casos de aplicación:** aproximaciones baratas en *shaders* y suavizado exponencial que no depende del paso de tiempo.

**En el motor:** hito H6, *Animación suave* (se abre con este capítulo).

**Bibliografía**

- Stewart, J. (2018). *Cálculo de una variable: Trascendentes tempranas* (8.ª ed.). Cengage Learning — Cap. 11.
- Needham, T. (1997). *Visual Complex Analysis*. Oxford University Press — Cap. 1.

### Capítulo 19. Ecuaciones no lineales y raíces de polinomios *(dividido)*

*36 págs. · Requiere: Caps. 3 y 18*

- Bisección, Newton–Raphson, secante y método de Brent: convergencia y criterios de parada.
- Iteración de punto fijo y teorema de la aplicación contractiva.
- Raíces de polinomios: cuadráticas estables, cúbicas y cuárticas robustas, y evaluación de Horner.

**Casos de aplicación:** raíz cuadrada inversa rápida (un paso de Newton) e inversión de funciones de *easing*; las raíces vuelven en las intersecciones del Cap. 46.

**En el motor:** hito H8, *Selección con el ratón* (se abre al terminar el Cap. 46).

**Bibliografía**

- Burden, R. L., Faires, J. D., & Burden, A. M. (2016). *Análisis Numérico* (10.ª ed.). Cengage Learning — Cap. 2.
- Press, W. H., Teukolsky, S. A., Vetterling, W. T., & Flannery, B. P. (2007). *Numerical Recipes* (3.ª ed.). Cambridge University Press — Caps. 5 y 9.

### Capítulo 20. Cuadratura y aproximación de funciones *(dividido)*

*36 págs. · Requiere: Cap. 18*

- Trapecio, Simpson y Gauss–Legendre, con su análisis de error.
- Cuadratura adaptativa.
- Polinomios de Chebyshev y aproximación minimax (Remez).

**Casos de aplicación:** funciones trigonométricas rápidas en *shaders* y longitud de arco de curvas, que se retoma en el Cap. 39.

**En el motor:** hito H14, *Curvas y recorridos de cámara* (se abre al terminar el Cap. 41).

**Bibliografía**

- Burden, R. L., Faires, J. D., & Burden, A. M. (2016). *Análisis Numérico* (10.ª ed.). Cengage Learning — Caps. 4 y 8.
- Trefethen, L. N. (2019). *Approximation Theory and Approximation Practice* (ed. ampliada). SIAM.

## Parte IV — Geometría afín, proyectiva y grupos de rotación

*280 págs. (rango 244–301).* El paso del álgebra lineal a la geometría del espacio 3D: puntos, proyecciones y rotaciones.

### Capítulo 21. Espacios afines y coordenadas homogéneas

*50 págs. · Requiere: Caps. 8 y 12*

- Por qué un espacio vectorial no basta: distinción entre punto y vector.
- Combinaciones afines y convexas, y coordenadas baricéntricas en segmentos, triángulos y tetraedros.
- Coordenadas homogéneas: traslación, rotación, escala y cizallamiento con matrices 4×4.
- Composición jerárquica de transformaciones sobre un árbol (Cap. 8).
- Normales y planos como covectores: por qué se transforman con (M⁻¹)ᵀ.

**Casos de aplicación:** grafos de escena, espacios local, mundo y vista, y equivalencias de convenciones entre Three.js, glTF y WebGPU.

**En el motor:** hito H4, *Cubo sólido en perspectiva* (se abre al terminar el Cap. 22).

**Bibliografía**

- Lengyel, E. (2016). *Foundations of Game Engine Development, Vol. 1: Mathematics*. Terathon Software — Cap. 2.
- Van Verth, J. M., & Bishop, L. M. (2015). *Essential Mathematics for Games and Interactive Applications* (3.ª ed.). CRC Press — Cap. 4.

### Capítulo 22. Geometría proyectiva y rasterización

*52 págs. · Requiere: Caps. 13 y 21*

- Espacio proyectivo; proyección ortográfica y en perspectiva; la división por w.
- Volumen de visión, coordenadas de recorte y normalizadas, y extracción de los seis planos del volumen.
- Distribución no lineal de la profundidad y su precisión en coma flotante.
- Matemática de la rasterización: funciones de arista, cobertura e interpolación baricéntrica con corrección perspectivística.

**Casos de aplicación:** el *pipeline* de cámara de la GPU, el Z-buffer y Reverse-Z (que rinde con profundidad en \[0, 1\], como en WebGPU, y no en \[−1, 1\], como en WebGL), *frustum culling* y mapas de sombras como proyección desde la luz.

**En el motor:** hito H4, *Cubo sólido en perspectiva* (se abre con este capítulo).

**Bibliografía**

- Lengyel, E. (2019). *Foundations of Game Engine Development, Vol. 2: Rendering*. Terathon Software — Cap. 6.
- Akenine-Möller, T., et al. (2018). *Real-Time Rendering* (4.ª ed.). CRC Press — Cap. 4.
- Pineda, J. (1988). *A Parallel Algorithm for Polygon Rasterization*. Proceedings of SIGGRAPH '88, 17–20.

### Capítulo 23. Rotaciones en 3D: matrices, eje–ángulo y ángulos de Euler *(dividido)*

*40 págs. · Requiere: Caps. 14 y 21*

- El grupo SO(3): matrices ortogonales con determinante 1.
- Representación eje–ángulo y fórmula de Rodrigues; el eje como autovector (Cap. 14).
- Ángulos de Euler y Tait–Bryan; demostración geométrica del *gimbal lock*.
- Re-ortonormalización de matrices de rotación con deriva numérica.

**Casos de aplicación:** cámaras en primera persona, orientación de objetos y *gimbal lock* en editores.

**En el motor:** hito H5, *Cámara y orientaciones* (se abre al terminar el Cap. 24).

**Bibliografía**

- Dunn, F., & Parberry, I. (2011). *3D Math Primer for Graphics and Game Development* (2.ª ed.). CRC Press — Cap. 8.
- Lengyel, E. (2016). *Foundations of Game Engine Development, Vol. 1: Mathematics*. Terathon Software — Cap. 2.

### Capítulo 24. Cuaterniones e interpolación de orientaciones *(dividido)*

*44 págs. · Requiere: Caps. 6 y 23*

- Álgebra de cuaterniones como extensión de los complejos; conjugado, norma e inversa.
- Cuaterniones unitarios en S³ y doble cobertura de SO(3); conversión entre representaciones.
- Interpolación LERP, NLERP, SLERP y SQUAD.
- Promedio de orientaciones por autovector dominante.

**Casos de aplicación:** interpolación de animaciones, cámaras suaves y compresión *smallest-three* para red.

**En el motor:** hito H5, *Cámara y orientaciones* (se abre con este capítulo).

**Bibliografía**

- Shoemake, K. (1985). *Animating Rotation with Quaternion Curves*. Proceedings of SIGGRAPH '85, 245–254.
- Hanson, A. J. (2006). *Visualizing Quaternions*. Morgan Kaufmann.
- Markley, F. L., Cheng, Y., Crassidis, J. L., & Oshman, Y. (2007). *Averaging Quaternions*. Journal of Guidance, Control, and Dynamics, 30(4), 1193–1197.

### Capítulo 25. Grupos de Lie y movimientos rígidos *(dividido)*

*40 págs. · Requiere: Caps. 18 y 24*

- Grupos y álgebras de Lie: SO(3), so(3), SE(3) y se(3).
- Mapas exponencial y logarítmico con la serie del Cap. 18.
- Teorema de Chasles: todo movimiento rígido es un movimiento helicoidal.
- Números duales y cuaterniones duales.

**Casos de aplicación:** interpolación de transformaciones rígidas y *skinning* con cuaterniones duales.

**En el motor:** hito H11, *Personajes articulados* (se abre al terminar el Cap. 56).

**Bibliografía**

- Solà, J., Deray, J., & Atchuthan, D. (2018). *A Micro Lie Theory for State Estimation in Robotics*. arXiv:1812.01537.
- Lynch, K. M., & Park, F. C. (2017). *Modern Robotics: Mechanics, Planning, and Control*. Cambridge University Press — Cap. 3.
- Kavan, L., Collins, S., Žára, J., & O'Sullivan, C. (2008). *Geometric Skinning with Approximate Dual Quaternion Blending*. ACM Transactions on Graphics, 27(4) (aplicación).

### Capítulo 26. Álgebra exterior y Álgebra Geométrica Proyectiva (PGA) *(opcional)*

*54 págs. · Requiere: Caps. 10, 21 y 25*

- Ningún capítulo posterior depende de este: se puede saltar.
- Producto exterior, bivectores y trivectores como áreas y volúmenes orientados.
- Coordenadas de Plücker para rectas 3D.
- Operaciones *join* y *meet*, y motores de PGA como generalización de los cuaterniones duales.

**Casos de aplicación:** intersecciones y distancias entre puntos, rectas y planos sin casos especiales.

**En el motor:** sin hito, porque el capítulo es opcional.

**Bibliografía**

- Lengyel, E. (2016). *Foundations of Game Engine Development, Vol. 1: Mathematics*. Terathon Software — Caps. 3 y 4.
- Dorst, L., Fontijne, D., & Mann, S. (2007). *Geometric Algebra for Computer Science*. Morgan Kaufmann.
- De Keninck, S., & Gunn, C. (2019). *Geometric Algebra for Computer Graphics*. ACM SIGGRAPH 2019 Courses.

## Parte V — Cálculo multivariable

*132 págs. (rango 115–141).* Derivar e integrar en varias variables: la base de las superficies, la física y la luz.

### Capítulo 27. Cálculo diferencial multivariable

*48 págs. · Requiere: Caps. 12 y 18*

- Campos escalares en R³; derivadas parciales y direccionales.
- El gradiente como dirección de máximo crecimiento y normal a superficies de nivel.
- Matriz jacobiana y regla de la cadena multivariable.
- Matriz hessiana y aproximación de Taylor de segundo orden.
- Verificación numérica de derivadas por diferencias finitas.

**Casos de aplicación:** normales de superficies implícitas por gradiente y el jacobiano de la proyección que mide la huella de un píxel sobre una textura.

**En el motor:** hito H9, *Volúmenes envolventes* (se abre al terminar el Cap. 50).

**Bibliografía**

- Marsden, J. E., & Tromba, A. J. (2012). *Vector Calculus* (6.ª ed.). W. H. Freeman.
- Stewart, J. (2018). *Cálculo de varias variables: Trascendentes tempranas* (8.ª ed.). Cengage Learning — Cap. 14.

### Capítulo 28. Integración múltiple *(dividido)*

*40 págs. · Requiere: Caps. 5, 17 y 27*

- Integrales dobles y triples, e intercambio del orden de integración.
- Cambio de variables con el determinante jacobiano.
- Integrales en coordenadas polares, cilíndricas y esféricas.
- Integración sobre la esfera y el hemisferio; el ángulo sólido.

**Casos de aplicación:** ángulo sólido, irradiancia como integral sobre el hemisferio, volúmenes y centros de masa.

**En el motor:** hito H9, *Volúmenes envolventes* (se abre al terminar el Cap. 50).

**Bibliografía**

- Stewart, J. (2018). *Cálculo de varias variables: Trascendentes tempranas* (8.ª ed.). Cengage Learning — Cap. 15.
- Marsden, J. E., & Tromba, A. J. (2012). *Vector Calculus* (6.ª ed.). W. H. Freeman.

### Capítulo 29. Cálculo vectorial y teoremas integrales *(dividido)*

*44 págs. · Requiere: Cap. 28*

- Campos vectoriales, integrales de línea y campos conservativos.
- Divergencia, rotacional y operador laplaciano.
- Integrales de superficie y flujo.
- Teoremas de Green, Stokes y de la divergencia.

**Casos de aplicación:** masa, centroide e inercia exactos de mallas cerradas, flujo a través de superficies y campos de fuerza conservativos.

**En el motor:** hito H12, *Cuerpos rígidos* (se abre al terminar el Cap. 55).

**Bibliografía**

- Stewart, J. (2018). *Cálculo de varias variables: Trascendentes tempranas* (8.ª ed.). Cengage Learning — Cap. 16.
- Marsden, J. E., & Tromba, A. J. (2012). *Vector Calculus* (6.ª ed.). W. H. Freeman.
- Mirtich, B. (1996). *Fast and Accurate Computation of Polyhedral Mass Properties*. Journal of Graphics Tools, 1(2), 31–50 (aplicación).

## Parte VI — Optimización y álgebra lineal numérica

*200 págs. (rango 173–214).* Minimizar con y sin restricciones, derivar automáticamente y resolver sistemas enormes.

### Capítulo 30. Optimización sin restricciones *(dividido)*

*44 págs. · Requiere: Caps. 14, 19 y 27*

- Convexidad, mínimos locales y globales.
- Descenso de gradiente, búsqueda lineal y condiciones de Wolfe.
- Método de Newton y métodos cuasi-Newton (BFGS).
- Gauss–Newton y Levenberg–Marquardt para mínimos cuadrados no lineales.

**Casos de aplicación:** ajuste de curvas y parámetros, calibración de cámaras y cinemática inversa, que se retoma en el Cap. 56.

**En el motor:** hito H10, *Colisiones entre convexos* (se abre al terminar el Cap. 48).

**Bibliografía**

- Nocedal, J., & Wright, S. J. (2006). *Numerical Optimization* (2.ª ed.). Springer.
- Madsen, K., Nielsen, H. B., & Tingleff, O. (2004). *Methods for Non-Linear Least Squares Problems* (2.ª ed.). Notas, Technical University of Denmark.

### Capítulo 31. Diferenciación automática *(dividido)*

*28 págs. · Requiere: Caps. 25 y 27*

- El grafo de cómputo y la regla de la cadena.
- Modo directo con los números duales del Cap. 25.
- Modo inverso, cinta de operaciones y su costo.
- Puntos de control para ahorrar memoria.

**Casos de aplicación:** verificación de derivadas escritas a mano y gradientes de representaciones diferenciables, como el *Gaussian Splatting* del Cap. 66.

**En el motor:** hito H11, *Personajes articulados* (se abre al terminar el Cap. 56).

**Bibliografía**

- Griewank, A., & Walther, A. (2008). *Evaluating Derivatives* (2.ª ed.). SIAM.
- Baydin, A. G., Pearlmutter, B. A., Radul, A. A., & Siskind, J. M. (2018). *Automatic Differentiation in Machine Learning: a Survey*. Journal of Machine Learning Research, 18(153), 1–43.

### Capítulo 32. Multiplicadores de Lagrange, KKT y dualidad *(dividido)*

*44 págs. · Requiere: Cap. 30*

- Multiplicadores de Lagrange: significado geométrico de optimizar bajo C(x) = 0.
- Condiciones de Karush–Kuhn–Tucker para desigualdades.
- Dualidad lagrangiana básica.
- Programación cuadrática convexa.

**Casos de aplicación:** proyección sobre restricciones y cinemática inversa con límites articulares.

**En el motor:** hito H13, *Restricciones y contacto* (se abre al terminar el Cap. 58).

**Bibliografía**

- Nocedal, J., & Wright, S. J. (2006). *Numerical Optimization* (2.ª ed.). Springer — Caps. 12 y 16.
- Boyd, S., & Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press.

### Capítulo 33. Complementariedad y métodos iterativos proyectados *(dividido)*

*36 págs. · Requiere: Caps. 13 y 32*

- Problemas de complementariedad lineal (LCP): formulación y existencia de solución.
- Gauss–Seidel y Jacobi proyectados, y su convergencia.
- Restricciones cónicas: el cono de fricción de Coulomb y su aproximación por pirámides.

**Casos de aplicación:** impulsos secuenciales en motores de física; el Cap. 58 lo aplica a los contactos.

**En el motor:** hito H13, *Restricciones y contacto* (se abre al terminar el Cap. 58).

**Bibliografía**

- Cottle, R. W., Pang, J.-S., & Stone, R. E. (1992). *The Linear Complementarity Problem*. Academic Press.
- Erleben, K., Sporring, J., Henriksen, K., & Dohlmann, H. (2005). *Physics-Based Animation*. Charles River Media.
- Catto, E. (2005). *Iterative Dynamics with Temporal Coherence*. Game Developers Conference (aplicación).

### Capítulo 34. Álgebra lineal dispersa y métodos iterativos

*48 págs. · Requiere: Caps. 14 y 27*

- Matrices dispersas en formato CSR y su ensamblado desde mallas y grillas.
- Gradiente conjugado derivado como minimización de una forma cuadrática; convergencia y condicionamiento.
- Precondicionadores: Jacobi y Cholesky incompleta.
- Multigrid: la idea y el V-ciclo en grillas.

**Casos de aplicación:** suavizado de mallas, Euler implícito, presión en fluidos y elementos finitos, que se retoman en los Caps. 43, 54, 60 y 62.

**En el motor:** hito H12, *Cuerpos rígidos* (se abre al terminar el Cap. 55).

**Bibliografía**

- Shewchuk, J. R. (1994). *An Introduction to the Conjugate Gradient Method Without the Agonizing Pain*. Informe técnico, Carnegie Mellon University.
- Saad, Y. (2003). *Iterative Methods for Sparse Linear Systems* (2.ª ed.). SIAM.
- Briggs, W. L., Henson, V. E., & McCormick, S. F. (2000). *A Multigrid Tutorial* (2.ª ed.). SIAM.

## Parte VII — Análisis de Fourier, muestreo y funciones sobre la esfera

*164 págs. (rango 142–176).* Descomponer señales en frecuencias, muestrearlas sin perder información y hacer lo mismo sobre la esfera.

### Capítulo 35. Series de Fourier y funciones ortogonales *(dividido)*

*40 págs. · Requiere: Caps. 10, 17 y 18*

- Producto interno entre funciones y bases ortogonales, como extensión del Cap. 10.
- Series de Fourier reales y complejas; convergencia y fenómeno de Gibbs.
- Identidad de Parseval y energía de una señal.

**Casos de aplicación:** síntesis de formas de onda, vibraciones periódicas y sonido procedural.

**En el motor:** hito H16, *Texturas filtradas y posprocesado* (se abre al terminar el Cap. 37).

**Bibliografía**

- Zill, D. G., & Wright, W. S. (2015). *Matemáticas avanzadas para ingeniería* (4.ª ed.). McGraw-Hill — Cap. 12.
- Oppenheim, A. V., Willsky, A. S., & Nawab, S. H. (1996). *Signals and Systems* (2.ª ed.). Prentice Hall — Cap. 3.

### Capítulo 36. Transformada de Fourier, convolución y FFT *(dividido)*

*44 págs. · Requiere: Caps. 15 y 35*

- Transformada de Fourier y sus propiedades.
- Convolución, filtros lineales y teorema de convolución.
- Transformada discreta, raíces de la unidad (Cap. 6) y FFT de Cooley–Tukey; transformada en 2D.
- Filtros separables y matrices de rango 1 (Cap. 15).

**Casos de aplicación:** desenfoque gaussiano y *bloom*, audio espacial por convolución con HRTF y respuestas al impulso, y síntesis espectral de océanos, que se retoma en el Cap. 70.

**En el motor:** hito H16, *Texturas filtradas y posprocesado* (se abre al terminar el Cap. 37).

**Bibliografía**

- Oppenheim, A. V., Willsky, A. S., & Nawab, S. H. (1996). *Signals and Systems* (2.ª ed.). Prentice Hall — Caps. 4 y 5.
- Cooley, J. W., & Tukey, J. W. (1965). *An Algorithm for the Machine Calculation of Complex Fourier Series*. Mathematics of Computation, 19(90), 297–301.
- Smith, S. W. (1997). *The Scientist and Engineer's Guide to Digital Signal Processing*. California Technical Publishing.

### Capítulo 37. Teoría del muestreo y reconstrucción

*44 págs. · Requiere: Caps. 27 y 36*

- Teorema de Nyquist–Shannon y origen matemático del *aliasing*.
- Prefiltrado y filtros de reconstrucción: caja, tienda, Mitchell–Netravali y Lanczos.
- Muestreo en 2D y huella anisotrópica de un píxel calculada con el jacobiano (filtro EWA).
- Muestreo temporal y *aliasing* temporal.

**Casos de aplicación:** *mipmapping*, filtrado anisotrópico, *supersampling*, antialiasing temporal (TAA) y escalado de imágenes.

**En el motor:** hito H16, *Texturas filtradas y posprocesado* (se abre con este capítulo).

**Bibliografía**

- Oppenheim, A. V., Willsky, A. S., & Nawab, S. H. (1996). *Signals and Systems* (2.ª ed.). Prentice Hall — Cap. 7.
- Mitchell, D. P., & Netravali, A. N. (1988). *Reconstruction Filters in Computer Graphics*. Proceedings of SIGGRAPH '88, 221–228.
- Heckbert, P. S. (1989). *Fundamentals of Texture Mapping and Image Warping*. Tesis de maestría, UC Berkeley.

### Capítulo 38. Armónicos esféricos y funciones sobre la esfera

*36 págs. · Requiere: Caps. 14, 28 y 35*

- Funciones sobre la esfera y su producto interno con la medida de ángulo sólido.
- Polinomios de Legendre y base de armónicos esféricos; proyección y reconstrucción.
- Rotación de coeficientes y armónicos zonales.
- Convolución sobre la esfera (teorema de Funk–Hecke) e irradiancia como convolución con el coseno truncado.

**Casos de aplicación:** iluminación difusa en tiempo real, sondas de luz e iluminación difusa basada en imagen.

**En el motor:** hito H18, *Materiales PBR* (se abre al terminar el Cap. 74).

**Bibliografía**

- Atkinson, K., & Han, W. (2012). *Spherical Harmonics and Approximations on the Unit Sphere: An Introduction*. Springer.
- Ramamoorthi, R., & Hanrahan, P. (2001). *An Efficient Representation for Irradiance Environment Maps*. Proceedings of SIGGRAPH 2001, 497–500.
- Sloan, P.-P. (2008). *Stupid Spherical Harmonics (SH) Tricks*. Game Developers Conference (aplicación).

## Parte VIII — Curvas, superficies y geometría diferencial

*306 págs. (rango 265–328).* Recorrido de geometría: de las curvas suaves a su versión discreta en mallas y a las superficies implícitas.

### Capítulo 39. Curvas paramétricas: interpolación, Bézier y B-splines *(dividido)*

*48 págs. · Requiere: Caps. 19, 20 y 21*

- Interpolación polinómica, fenómeno de Runge y polinomios a trozos.
- Curvas de Hermite, Bézier (polinomios de Bernstein y algoritmo de De Casteljau), B-splines y Catmull–Rom.
- Continuidad paramétrica (C⁰, C¹, C²) frente a geométrica (G⁰, G¹, G²).
- Reparametrización por longitud de arco con la cuadratura del Cap. 20 y el Newton del Cap. 19; punto más cercano en una curva.

**Casos de aplicación:** recorridos de cámara a velocidad constante y trayectorias de animación.

**En el motor:** hito H14, *Curvas y recorridos de cámara* (se abre al terminar el Cap. 41).

**Bibliografía**

- Farin, G. (2002). *Curves and Surfaces for CAGD: A Practical Guide* (5.ª ed.). Morgan Kaufmann.
- Piegl, L., & Tiller, W. (1997). *The NURBS Book* (2.ª ed.). Springer — Caps. 1 a 3.

### Capítulo 40. Superficies paramétricas y NURBS *(dividido)*

*36 págs. · Requiere: Caps. 27 y 39*

- Parches tensoriales de Bézier y de B-splines.
- Curvas y superficies racionales: NURBS como proyección de coordenadas homogéneas.
- Derivadas parciales, normales y teselación de parches.

**Casos de aplicación:** modelado con NURBS, teselación en GPU y PN triangles.

**En el motor:** hito H14, *Curvas y recorridos de cámara* (se abre al terminar el Cap. 41).

**Bibliografía**

- Piegl, L., & Tiller, W. (1997). *The NURBS Book* (2.ª ed.). Springer — Caps. 3 y 4.
- Farin, G. (2002). *Curves and Surfaces for CAGD: A Practical Guide* (5.ª ed.). Morgan Kaufmann.
- Vlachos, A., Peters, J., Boyd, C., & Mitchell, J. L. (2001). *Curved PN Triangles*. Proceedings of I3D 2001, 159–166 (aplicación).

### Capítulo 41. Geometría diferencial de curvas y superficies

*54 págs. · Requiere: Caps. 27 y 40*

- Curvas: curvatura, torsión y triedro de Frenet–Serret; marcos de rotación mínima.
- Superficies: plano tangente, primera y segunda forma fundamental.
- Curvaturas normal, principales, gaussiana y media.
- Marcos tangentes (tangente, bitangente y normal) en superficies parametrizadas.

**Casos de aplicación:** tubos, cuerdas y rieles de cámara sin giros bruscos, y *normal mapping* con la convención MikkTSpace.

**En el motor:** hito H14, *Curvas y recorridos de cámara* (se abre con este capítulo).

**Bibliografía**

- do Carmo, M. P. (2016). *Differential Geometry of Curves and Surfaces* (2.ª ed. rev.). Dover.
- Wang, W., Jüttler, B., Zheng, D., & Liu, Y. (2008). *Computation of Rotation Minimizing Frames*. ACM Transactions on Graphics, 27(1).
- Mikkelsen, M. (2008). *Simulation of Wrinkled Surfaces Revisited*. Tesis de maestría, Universidad de Copenhague (aplicación).

### Capítulo 42. Topología y estructura de mallas *(dividido)*

*36 págs. · Requiere: Caps. 8 y 21*

- Complejos simpliciales y variedades con borde.
- Orientabilidad, característica de Euler y género.
- La estructura *half-edge* como representación combinatoria y la navegación de adyacencias.
- Condiciones de malla variedad y cómo verificarlas.

**Casos de aplicación:** validación y reparación de mallas importadas, recorridos de vecindad y detección de bordes.

**En el motor:** hito H15, *Mallas y campos de distancia* (se abre al terminar el Cap. 45).

**Bibliografía**

- Edelsbrunner, H., & Harer, J. (2010). *Computational Topology: An Introduction*. American Mathematical Society.
- Botsch, M., Kobbelt, L., Pauly, M., Alliez, P., & Lévy, B. (2010). *Polygon Mesh Processing*. A K Peters / CRC Press — Cap. 2.

### Capítulo 43. Geometría diferencial discreta *(dividido)*

*44 págs. · Requiere: Caps. 34, 41 y 42*

- Normales de vértice ponderadas y curvaturas discretas.
- El laplaciano cotangente y su derivación.
- Teorema de Gauss–Bonnet discreto.
- Suavizado como difusión: explícito e implícito con el gradiente conjugado del Cap. 34.

**Casos de aplicación:** suavizado de mallas y estimación de curvatura para sombreado y detalle.

**En el motor:** hito H15, *Mallas y campos de distancia* (se abre al terminar el Cap. 45).

**Bibliografía**

- Crane, K. (2023). *Discrete Differential Geometry: An Applied Introduction*. Notas de curso, Carnegie Mellon University.
- Meyer, M., Desbrun, M., Schröder, P., & Barr, A. H. (2003). *Discrete Differential-Geometry Operators for Triangulated 2-Manifolds*. En *Visualization and Mathematics III*, 35–57. Springer.
- Desbrun, M., Meyer, M., Schröder, P., & Barr, A. H. (1999). *Implicit Fairing of Irregular Meshes Using Diffusion and Curvature Flow*. Proceedings of SIGGRAPH '99, 317–324.

### Capítulo 44. Procesamiento de mallas: subdivisión, simplificación y parametrización *(dividido)*

*44 págs. · Requiere: Caps. 6, 15 y 43*

- Subdivisión de Catmull–Clark y de Loop; superficies límite por análisis de autovalores.
- Simplificación con métricas de error cuádrico.
- Parametrización conforme (LSCM) con mínimos cuadrados y números complejos.

**Casos de aplicación:** niveles de detalle (LOD), desplegado UV y suavizado de modelos por subdivisión.

**En el motor:** hito H15, *Mallas y campos de distancia* (se abre al terminar el Cap. 45).

**Bibliografía**

- Botsch, M., et al. (2010). *Polygon Mesh Processing*. A K Peters / CRC Press.
- Garland, M., & Heckbert, P. S. (1997). *Surface Simplification Using Quadric Error Metrics*. Proceedings of SIGGRAPH '97, 209–216.
- Lévy, B., Petitjean, S., Ray, N., & Maillot, J. (2002). *Least Squares Conformal Maps for Automatic Texture Atlas Generation*. ACM Transactions on Graphics, 21(3), 362–371.

### Capítulo 45. Superficies implícitas y campos de distancia

*44 págs. · Requiere: Caps. 19 y 41*

- Teorema de la función implícita y superficies de nivel.
- Funciones de distancia con signo: propiedad eikonal |∇d| = 1 y constante de Lipschitz.
- Operaciones booleanas suaves y operadores de dominio.
- *Sphere tracing* como búsqueda de raíces con paso garantizado.

**Casos de aplicación:** modelado con campos de distancia, *ray marching* en *shaders*, colisión contra campos de distancia y extracción de mallas con Marching Cubes y Dual Contouring.

**En el motor:** hito H15, *Mallas y campos de distancia* (se abre con este capítulo).

**Bibliografía**

- Hart, J. C. (1996). *Sphere Tracing: A Geometric Method for the Antialiased Ray Tracing of Implicit Surfaces*. The Visual Computer, 12(10), 527–545.
- Osher, S., & Fedkiw, R. (2003). *Level Set Methods and Dynamic Implicit Surfaces*. Springer.
- Ju, T., Losasso, F., Schaefer, S., & Warren, J. (2002). *Dual Contouring of Hermite Data*. ACM Transactions on Graphics, 21(3), 339–346 (aplicación).

## Parte IX — Geometría computacional

*216 págs. (rango 189–232).* Preguntas geométricas exactas sobre objetos discretos: dónde se cortan, a qué distancia están y cómo dividir el espacio para responder rápido.

### Capítulo 46. Predicados robustos, consultas e intersecciones

*56 págs. · Requiere: Caps. 3, 13, 19 y 21*

- Predicados de orientación e *incircle* como signos de determinantes (Cap. 13).
- Fallos de los predicados en coma flotante (Cap. 3): tolerancias, aritmética exacta y predicados adaptativos.
- Intersecciones rayo–plano, rayo–esfera, rayo–caja (*slabs*) y rayo–triángulo (Möller–Trumbore como regla de Cramer).
- Rayo contra superficies de grado alto: cuárticas y toros con los métodos del Cap. 19.
- Puntos más cercanos: punto–triángulo, segmento–segmento y punto–caja.

**Casos de aplicación:** selección con el ratón, *raycasts* de juego y el núcleo del trazado de rayos, que se retoma en el Cap. 75.

**En el motor:** hito H8, *Selección con el ratón* (se abre con este capítulo).

**Bibliografía**

- Ericson, C. (2005). *Real-Time Collision Detection*. Morgan Kaufmann — Caps. 3 y 5.
- Shewchuk, J. R. (1997). *Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates*. Discrete & Computational Geometry, 18(3), 305–363.
- Möller, T., & Trumbore, B. (1997). *Fast, Minimum Storage Ray-Triangle Intersection*. Journal of Graphics Tools, 2(1), 21–28.

### Capítulo 47. Conjuntos convexos y separación *(dividido)*

*40 págs. · Requiere: Caps. 21 y 46*

- Conjuntos convexos, envolvente convexa y teorema de Carathéodory.
- Sumas de Minkowski y funciones de soporte.
- Teorema del hiperplano separador y teorema de los ejes separadores (SAT).
- Algoritmo Quickhull.

**Casos de aplicación:** pruebas de colisión entre cajas orientadas y entre polígonos convexos, y generación de envolventes para física.

**En el motor:** hito H10, *Colisiones entre convexos* (se abre al terminar el Cap. 48).

**Bibliografía**

- Boyd, S., & Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press — Cap. 2.
- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3.ª ed.). Springer — Cap. 11.
- Ericson, C. (2005). *Real-Time Collision Detection*. Morgan Kaufmann — Cap. 5 (aplicación).

### Capítulo 48. Distancia entre convexos y tiempo de impacto *(dividido)*

*40 págs. · Requiere: Caps. 24, 30 y 47*

- Algoritmo GJK como descenso sobre la diferencia de Minkowski y su convergencia.
- Algoritmo EPA para profundidad y dirección de penetración.
- Tiempo de impacto bajo movimiento rígido (Cap. 24) y avance conservador.

**Casos de aplicación:** detección de colisiones entre convexos, puntos de contacto, detección continua (CCD) y descomposición convexa aproximada (V-HACD).

**En el motor:** hito H10, *Colisiones entre convexos* (se abre con este capítulo).

**Bibliografía**

- Gilbert, E. G., Johnson, D. W., & Keerthi, S. S. (1988). *A Fast Procedure for Computing the Distance Between Complex Objects in Three-Dimensional Space*. IEEE Journal of Robotics and Automation, 4(2), 193–203.
- van den Bergen, G. (2003). *Collision Detection in Interactive 3D Environments*. Morgan Kaufmann.
- Mirtich, B. (1996). *Impulse-based Dynamic Simulation of Rigid Body Systems*. Tesis doctoral, UC Berkeley (aplicación).

### Capítulo 49. Triangulaciones y diagramas de Voronoi *(dividido)*

*40 págs. · Requiere: Caps. 8 y 46*

- Triangulación de polígonos por recorte de orejas y descomposición monótona.
- Triangulación de Delaunay: círculo vacío, maximización del ángulo mínimo y volteo de aristas.
- Diagrama de Voronoi como dual de Delaunay.
- Teselaciones de Voronoi centroidales y algoritmo de Lloyd.

**Casos de aplicación:** mallas de navegación, particiones procedurales del mapa y mallas de terreno.

**En el motor:** hito H19, *Mundos procedurales* (se abre al terminar el Cap. 70).

**Bibliografía**

- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3.ª ed.). Springer — Caps. 3, 7 y 9.
- Du, Q., Faber, V., & Gunzburger, M. (1999). *Centroidal Voronoi Tessellations: Applications and Algorithms*. SIAM Review, 41(4), 637–676.

### Capítulo 50. Particiones del espacio, curvas de llenado y geometría integral *(dividido)*

*40 págs. · Requiere: Caps. 8, 28 y 46*

- Árboles BSP, k-d y octrees como particiones recursivas.
- Curvas de Morton y de Hilbert: orden espacial y localidad.
- Fórmula de Cauchy–Crofton y heurística de área de superficie (SAH) como probabilidad geométrica.

**Casos de aplicación:** jerarquías de volúmenes envolventes (BVH), *broadphase* con barrido y poda y árboles dinámicos, construcción paralela de BVH y *hashing* espacial.

**En el motor:** hito H9, *Volúmenes envolventes* (se abre con este capítulo).

**Bibliografía**

- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3.ª ed.). Springer — Caps. 5 y 12.
- Santaló, L. A. (2004). *Integral Geometry and Geometric Probability* (2.ª ed.). Cambridge University Press.
- Sagan, H. (1994). *Space-Filling Curves*. Springer.
- MacDonald, J. D., & Booth, K. S. (1990). *Heuristics for Ray Tracing Using Space Subdivision*. The Visual Computer, 6(3), 153–166 (aplicación).

## Parte X — Ecuaciones diferenciales ordinarias e integración numérica

*180 págs. (rango 157–192).* Recorrido de mecánica, primera etapa: modelar sistemas que cambian y avanzarlos en el tiempo sin que exploten.

### Capítulo 51. EDO de primer y segundo orden *(dividido)*

*48 págs. · Requiere: Caps. 17 y 18*

- Modelado con ecuaciones diferenciales y campos de direcciones.
- Ecuaciones separables, lineales y factor integrante.
- Oscilador armónico: amortiguado, forzado y resonancia.
- Teorema de existencia y unicidad.

**Casos de aplicación:** amortiguación de cámara y funciones tipo *SmoothDamp*, y atenuación de Beer–Lambert, que se retoma en el Cap. 76.

**En el motor:** hito H7, *Partículas y paso fijo* (se abre al terminar el Cap. 53).

**Bibliografía**

- Zill, D. G. (2018). *Ecuaciones diferenciales con aplicaciones de modelado* (11.ª ed.). Cengage — Caps. 1 a 5.
- Strang, G. (2014). *Differential Equations and Linear Algebra*. Wellesley-Cambridge Press — Caps. 1 y 2.

### Capítulo 52. Sistemas de EDO, estabilidad y control *(dividido)*

*48 págs. · Requiere: Caps. 14 y 51*

- Sistemas lineales ẋ = Ax y exponencial de matrices con los autovalores del Cap. 14.
- Retratos de fase y clasificación de puntos de equilibrio.
- Linealización de sistemas no lineales y funciones de Lyapunov.
- Control proporcional, integral y derivativo (PID) como sistema realimentado.

**Casos de aplicación:** seguimiento de objetivos, vehículos con controladores y estabilidad de muelles acoplados.

**En el motor:** hito H7, *Partículas y paso fijo* (se abre al terminar el Cap. 53).

**Bibliografía**

- Zill, D. G. (2018). *Ecuaciones diferenciales con aplicaciones de modelado* (11.ª ed.). Cengage — Cap. 8.
- Strogatz, S. H. (2015). *Nonlinear Dynamics and Chaos* (2.ª ed.). CRC Press — Caps. 5 y 6.
- Åström, K. J., & Murray, R. M. (2021). *Feedback Systems: An Introduction for Scientists and Engineers* (2.ª ed.). Princeton University Press.

### Capítulo 53. Integradores explícitos y estabilidad *(dividido)*

*44 págs. · Requiere: Cap. 52*

- Euler explícito, Euler semi-implícito, Verlet y Runge–Kutta.
- Error local y global, orden de convergencia.
- Regiones de estabilidad absoluta y deriva de energía.

**Casos de aplicación:** bucle de física con paso de tiempo fijo y acumulador.

**En el motor:** hito H7, *Partículas y paso fijo* (se abre con este capítulo).

**Bibliografía**

- Burden, R. L., Faires, J. D., & Burden, A. M. (2016). *Análisis numérico* (10.ª ed.). Cengage — Cap. 5.
- Iserles, A. (2009). *A First Course in the Numerical Analysis of Differential Equations* (2.ª ed.). Cambridge University Press.
- Fiedler, G. (2004). *Fix Your Timestep!* Gaffer On Games (aplicación).

### Capítulo 54. Integradores implícitos, simplécticos y en grupos de Lie *(dividido)*

*40 págs. · Requiere: Caps. 25, 30, 34 y 53*

- Sistemas rígidos (*stiff*) y Euler implícito resuelto con Newton (Cap. 30) y gradiente conjugado (Cap. 34).
- Estructura hamiltoniana e integradores simplécticos.
- Integradores en grupos de Lie para rotaciones (Cap. 25).

**Casos de aplicación:** muelles rígidos estables, tela con pasos grandes y subpasos en simuladores modernos.

**En el motor:** hito H12, *Cuerpos rígidos* (se abre al terminar el Cap. 55).

**Bibliografía**

- Hairer, E., Lubich, C., & Wanner, G. (2006). *Geometric Numerical Integration* (2.ª ed.). Springer.
- Iserles, A. (2009). *A First Course in the Numerical Analysis of Differential Equations* (2.ª ed.). Cambridge University Press.
- Macklin, M., Storey, K., Lu, M., Terdiman, P., Chentanez, N., Jeschke, S., & Müller, M. (2019). *Small Steps in Physics Simulation*. Proceedings of SCA 2019 (aplicación).

## Parte XI — Mecánica de sólidos

*208 págs. (rango 181–223).* Recorrido de mecánica, segunda etapa: cuerpos rígidos, cadenas articuladas, restricciones y contacto.

### Capítulo 55. Mecánica del sólido rígido

*56 págs. · Requiere: Caps. 24, 29 y 54*

- Leyes de Newton para sistemas de partículas; momento lineal y angular.
- Tensor de inercia calculado con el teorema de la divergencia (Cap. 29); teorema de Steiner y ejes principales.
- Ecuaciones de Euler para el cuerpo rígido y término giroscópico.
- Integración de la orientación con cuaterniones (Cap. 24) y los integradores del Cap. 54.

**Casos de aplicación:** núcleo de un motor de física de cuerpos rígidos y peonzas estables.

**En el motor:** hito H12, *Cuerpos rígidos* (se abre con este capítulo).

**Bibliografía**

- Taylor, J. R. (2005). *Classical Mechanics*. University Science Books — Cap. 10.
- Goldstein, H., Poole, C., & Safko, J. (2002). *Classical Mechanics* (3.ª ed.). Addison-Wesley.
- Baraff, D. (1997). *An Introduction to Physically Based Modeling: Rigid Body Simulation I*. Notas de curso SIGGRAPH '97.

### Capítulo 56. Cinemática de cadenas articuladas

*52 págs. · Requiere: Caps. 25 y 30*

- Cinemática directa como producto de exponenciales (Cap. 25).
- Jacobiano de la cadena y cinemática inversa por mínimos cuadrados amortiguados (DLS) y FABRIK.
- Mezcla de transformaciones: *skinning* lineal (LBS) y con cuaterniones duales (DQS).
- Interpolación de poses con funciones de base radial (RBF).

**Casos de aplicación:** animación esquelética, IK de pies y manos, y *blend shapes* guiados por pose.

**En el motor:** hito H11, *Personajes articulados* (se abre con este capítulo).

**Bibliografía**

- Lynch, K. M., & Park, F. C. (2017). *Modern Robotics: Mechanics, Planning, and Control*. Cambridge University Press.
- Buss, S. R. (2009). *Introduction to Inverse Kinematics with Jacobian Transpose, Pseudoinverse and Damped Least Squares Methods*. UC San Diego.
- Kavan, L., Collins, S., Žára, J., & O'Sullivan, C. (2008). *Geometric Skinning with Approximate Dual Quaternion Blending*. ACM Transactions on Graphics, 27(4).

### Capítulo 57. Mecánica lagrangiana y restricciones *(dividido)*

*52 págs. · Requiere: Caps. 32, 55 y 56*

- Principio de d'Alembert y ecuaciones de Lagrange.
- Restricciones holónomas con multiplicadores de Lagrange (Cap. 32).
- Estabilización de Baumgarte y deriva de las restricciones.
- Coordenadas reducidas frente a maximales y algoritmo de Featherstone.

**Casos de aplicación:** articulaciones (bisagras, rótulas, deslizaderas) y *ragdolls*.

**En el motor:** hito H13, *Restricciones y contacto* (se abre al terminar el Cap. 58).

**Bibliografía**

- Goldstein, H., Poole, C., & Safko, J. (2002). *Classical Mechanics* (3.ª ed.). Addison-Wesley — Caps. 1 y 2.
- Witkin, A. (1997). *Physically Based Modeling: Constrained Dynamics*. Notas de curso SIGGRAPH '97.
- Featherstone, R. (2008). *Rigid Body Dynamics Algorithms*. Springer.

### Capítulo 58. Contacto, fricción y métodos por posiciones *(dividido)*

*48 págs. · Requiere: Caps. 33 y 57*

- Contacto unilateral como problema de complementariedad (Cap. 33).
- Fricción de Coulomb, cono de fricción y coeficiente de restitución.
- Dinámica basada en posiciones (PBD) y su versión con *compliance* (XPBD).

**Casos de aplicación:** pilas de cajas estables con la geometría de contacto del Cap. 48, comparación con un motor real como Rapier, y cuerdas y tela.

**En el motor:** hito H13, *Restricciones y contacto* (se abre con este capítulo).

**Bibliografía**

- Baraff, D. (1997). *An Introduction to Physically Based Modeling: Rigid Body Simulation II*. Notas de curso SIGGRAPH '97.
- Stewart, D. E. (2000). *Rigid-Body Dynamics with Friction and Impact*. SIAM Review, 42(1), 3–39.
- Macklin, M., Müller, M., & Chentanez, N. (2016). *XPBD: Position-Based Simulation of Compliant Constrained Dynamics*. Proceedings of MIG 2016, 49–54.

## Parte XII — Medios continuos y ecuaciones en derivadas parciales

*260 págs. (rango 226–278).* Recorrido de mecánica, tercera etapa: materiales deformables y fluidos descritos con ecuaciones en derivadas parciales.

### Capítulo 59. EDP clásicas y separación de variables *(dividido)*

*44 págs. · Requiere: Caps. 29 y 35*

- Clasificación de EDP de segundo orden: elípticas, parabólicas e hiperbólicas.
- Ecuaciones del calor, de onda y de Laplace–Poisson con el cálculo vectorial del Cap. 29.
- Condiciones iniciales y de contorno; separación de variables con series de Fourier (Cap. 35).
- Principio del máximo y conservación de la energía.

**Casos de aplicación:** cuerdas vibrantes, difusión de calor y ondas en superficies de agua, que se retoman en el Cap. 60.

**En el motor:** hito H20, *Agua y fluidos* (se abre al terminar el Cap. 64).

**Bibliografía**

- Zill, D. G., & Wright, W. S. (2015). *Matemáticas avanzadas para ingeniería* (4.ª ed.). McGraw-Hill — Caps. 13 y 14.
- Strauss, W. A. (2008). *Partial Differential Equations: An Introduction* (2.ª ed.). Wiley.

### Capítulo 60. Diferencias finitas y estabilidad *(dividido)*

*40 págs. · Requiere: Caps. 34, 53 y 59*

- Aproximaciones por diferencias y error de truncamiento.
- Consistencia, estabilidad y convergencia: teorema de equivalencia de Lax.
- Análisis de estabilidad de von Neumann y condición CFL.
- Ecuación de Poisson discreta resuelta con gradiente conjugado (Cap. 34) y multigrid.

**Casos de aplicación:** agua sobre un campo de alturas y erosión de terreno.

**En el motor:** hito H20, *Agua y fluidos* (se abre al terminar el Cap. 64).

**Bibliografía**

- LeVeque, R. J. (2007). *Finite Difference Methods for Ordinary and Partial Differential Equations*. SIAM.
- Strang, G. (2007). *Computational Science and Engineering*. Wellesley-Cambridge Press.
- Zill, D. G., & Wright, W. S. (2015). *Matemáticas avanzadas para ingeniería* (4.ª ed.). McGraw-Hill — Cap. 16.

### Capítulo 61. Mecánica de medios continuos: deformación, tensión y energía *(dividido)*

*44 págs. · Requiere: Caps. 15 y 29*

- Gradiente de deformación y tensores de deformación de Green y de pequeñas deformaciones.
- Descomposición polar con la SVD del Cap. 15: separar rotación y estiramiento.
- Tensiones de Cauchy y de Piola; ecuación de equilibrio con el teorema de la divergencia (Cap. 29).
- Modelos hiperelásticos: St. Venant–Kirchhoff, neo-hookeano y corrotacional.

**Casos de aplicación:** cuerpos blandos, músculos y objetos que se aplastan y recuperan su forma.

**En el motor:** hito H21, *Sólidos deformables* (se abre al terminar el Cap. 62).

**Bibliografía**

- Bonet, J., & Wood, R. D. (2008). *Nonlinear Continuum Mechanics for Finite Element Analysis* (2.ª ed.). Cambridge University Press.
- Gonzalez, O., & Stuart, A. M. (2008). *A First Course in Continuum Mechanics*. Cambridge University Press.

### Capítulo 62. Método de elementos finitos *(dividido)*

*48 págs. · Requiere: Caps. 54, 59 y 61*

- Formulación débil y espacios de funciones de prueba.
- Elementos lineales en triángulos y tetraedros; matrices de rigidez y de masa.
- Ensamblado y condiciones de contorno.
- Dinámica implícita de sólidos deformables con el Euler implícito del Cap. 54.

**Casos de aplicación:** sólidos deformables en tiempo real y tela con pasos grandes.

**En el motor:** hito H21, *Sólidos deformables* (se abre con este capítulo).

**Bibliografía**

- Sifakis, E., & Barbič, J. (2012). *FEM Simulation of 3D Deformable Solids: A Practitioner's Guide to Theory, Discretization and Model Reduction*. Curso SIGGRAPH 2012.
- Hughes, T. J. R. (2000). *The Finite Element Method: Linear Static and Dynamic Finite Element Analysis*. Dover.
- Baraff, D., & Witkin, A. (1998). *Large Steps in Cloth Simulation*. Proceedings of SIGGRAPH '98, 43–54 (aplicación).

### Capítulo 63. Ecuaciones de Navier–Stokes y descomposición de Helmholtz–Hodge *(dividido)*

*44 págs. · Requiere: Caps. 29 y 60*

- Derivada material y leyes de conservación de masa y momento.
- Ecuaciones de Euler y de Navier–Stokes incompresibles.
- Descomposición de Helmholtz–Hodge y proyección de presión mediante la Poisson del Cap. 60.
- Advección semilagrangiana y división de operadores.

**Casos de aplicación:** el método *Stable Fluids*, humo y fuego en rejilla.

**En el motor:** hito H20, *Agua y fluidos* (se abre al terminar el Cap. 64).

**Bibliografía**

- Chorin, A. J., & Marsden, J. E. (1993). *A Mathematical Introduction to Fluid Mechanics* (3.ª ed.). Springer.
- Bridson, R. (2015). *Fluid Simulation for Computer Graphics* (2.ª ed.). CRC Press.
- Stam, J. (1999). *Stable Fluids*. Proceedings of SIGGRAPH '99, 121–128.

### Capítulo 64. Métodos de partículas y aguas someras *(dividido)*

*40 págs. · Requiere: Cap. 63*

- SPH como aproximación por núcleos: interpolación, gradiente y laplaciano.
- Ecuaciones de aguas someras.
- Flotabilidad y principio de Arquímedes.

**Casos de aplicación:** fluidos SPH con el *hashing* espacial del Cap. 50, fluidos basados en posiciones con el XPBD del Cap. 58, y barcos que flotan.

**En el motor:** hito H20, *Agua y fluidos* (se abre con este capítulo).

**Bibliografía**

- Monaghan, J. J. (1992). *Smoothed Particle Hydrodynamics*. Annual Review of Astronomy and Astrophysics, 30, 543–574.
- Müller, M., Charypar, D., & Gross, M. (2003). *Particle-Based Fluid Simulation for Interactive Applications*. Proceedings of SCA 2003, 154–159.
- Macklin, M., & Müller, M. (2013). *Position Based Fluids*. ACM Transactions on Graphics, 32(4).

## Parte XIII — Probabilidad y procesos estocásticos

*244 págs. (rango 212–261).* Recorrido de azar y luz, primera etapa: probabilidad, muestreo y ruido.

### Capítulo 65. Probabilidad: variables aleatorias y distribuciones *(dividido)*

*48 págs. · Requiere: Caps. 7 y 17*

- Espacios de probabilidad, probabilidad condicional y teorema de Bayes.
- Variables aleatorias discretas y continuas; funciones de densidad y de distribución.
- Esperanza, varianza, ley de los grandes números y teorema central del límite.
- Desigualdades de Chebyshev y de Cantelli.

**Casos de aplicación:** sombras por varianza (VSM) con la desigualdad de Cantelli, probabilidad de colisión en tablas *hash* y tablas de botín.

**En el motor:** hito H17, *Luz en unidades físicas* (se abre al terminar el Cap. 72).

**Bibliografía**

- Blitzstein, J. K., & Hwang, J. (2019). *Introduction to Probability* (2.ª ed.). CRC Press.
- Ross, S. (2019). *A First Course in Probability* (10.ª ed.). Pearson.

### Capítulo 66. Distribuciones multivariantes y generación de muestras *(dividido)*

*40 págs. · Requiere: Caps. 15, 28 y 65*

- Distribuciones conjuntas, marginales y condicionales; covarianza.
- Gaussiana multivariante y su factorización con autovalores o Cholesky (Cap. 15).
- Cambio de variables en densidades con el jacobiano (Cap. 28).
- Generación de muestras: inversión de la distribución, rechazo y método alias de Walker.

**Casos de aplicación:** *Gaussian Splatting*, con la proyección de gaussianas que usa los Caps. 30 y 31, y emisión de partículas con distribuciones dadas.

**En el motor:** hito H18, *Materiales PBR* (se abre al terminar el Cap. 74).

**Bibliografía**

- Blitzstein, J. K., & Hwang, J. (2019). *Introduction to Probability* (2.ª ed.). CRC Press.
- Walker, A. J. (1977). *An Efficient Method for Generating Discrete Random Variables with General Distributions*. ACM Transactions on Mathematical Software, 3(3), 253–256.
- Kerbl, B., Kopanas, G., Leimkühler, T., & Drettakis, G. (2023). *3D Gaussian Splatting for Real-Time Radiance Field Rendering*. ACM Transactions on Graphics, 42(4) (aplicación).

### Capítulo 67. Integración de Monte Carlo y muestreo por importancia *(dividido)*

*44 págs. · Requiere: Cap. 66*

- Estimador de Monte Carlo: sesgo, varianza y convergencia de orden 1/√N.
- Muestreo por importancia y muestreo múltiple por importancia (MIS) con la heurística de balance.
- Estratificación y variables de control.
- Muestreo uniforme de esfera y hemisferio, y muestreo proporcional al coseno.

**Casos de aplicación:** oclusión ambiental e iluminación por luces de área.

**En el motor:** hito H18, *Materiales PBR* (se abre al terminar el Cap. 74).

**Bibliografía**

- Owen, A. B. (2013). *Monte Carlo Theory, Methods and Examples*. Libro en línea, Stanford University.
- Veach, E. (1997). *Robust Monte Carlo Methods for Light Transport Simulation*. Tesis doctoral, Stanford University.
- Pharr, M., Jakob, W., & Humphreys, G. (2023). *Physically Based Rendering* (4.ª ed.). MIT Press — Cap. 2.

### Capítulo 68. Cuasi-Monte Carlo y remuestreo *(dividido)*

*36 págs. · Requiere: Caps. 7 y 67*

- Discrepancia y desigualdad de Koksma–Hlawka.
- Inverso radical y secuencias de Halton y de Sobol.
- Remuestreo por importancia (RIS) y muestreo de reservorio.

**Casos de aplicación:** secuencias de desplazamiento para el TAA y el remuestreo espaciotemporal ReSTIR, que se retoma en el Cap. 75.

**En el motor:** hito H22, *Trazador de caminos* (se abre al terminar el Cap. 76).

**Bibliografía**

- Owen, A. B. (2013). *Monte Carlo Theory, Methods and Examples*. Libro en línea, Stanford University.
- Niederreiter, H. (1992). *Random Number Generation and Quasi-Monte Carlo Methods*. SIAM.
- Talbot, J., Cline, D., & Egbert, P. (2005). *Importance Resampling for Global Illumination*. Proceedings of EGSR 2005, 139–146.

### Capítulo 69. Procesos puntuales y ruido azul *(dividido)*

*32 págs. · Requiere: Caps. 36 y 67*

- Procesos de Poisson y procesos con distancia mínima.
- Espectro de potencia de un conjunto de puntos y ruido azul con la transformada del Cap. 36.
- Muestreo de disco de Poisson y máscaras de ruido azul.

**Casos de aplicación:** distribución de vegetación, *dithering* y patrones de muestreo para sombras y oclusión.

**En el motor:** hito H19, *Mundos procedurales* (se abre al terminar el Cap. 70).

**Bibliografía**

- Bridson, R. (2007). *Fast Poisson Disk Sampling in Arbitrary Dimensions*. SIGGRAPH 2007 Sketches.
- Ulichney, R. A. (1988). *Dithering with Blue Noise*. Proceedings of the IEEE, 76(1), 56–79.
- Illian, J., Penttinen, A., Stoyan, H., & Stoyan, D. (2008). *Statistical Analysis and Modelling of Spatial Point Patterns*. Wiley.

### Capítulo 70. Campos aleatorios, ruido procedural y fractales *(dividido)*

*44 págs. · Requiere: Caps. 36 y 66*

- Campos aleatorios estacionarios, autocorrelación y teorema de Wiener–Khinchin.
- Ruido de gradiente (Perlin y *simplex*) y ruido celular, emparentado con los diagramas de Voronoi del Cap. 49.
- Movimiento browniano fraccionario, sumas fBm y exponente de Hurst.
- Síntesis espectral de superficies con la FFT del Cap. 36.

**Casos de aplicación:** terreno procedural, nubes, texturas y el océano de Tessendorf.

**En el motor:** hito H19, *Mundos procedurales* (se abre con este capítulo).

**Bibliografía**

- Lagae, A., Lefebvre, S., Cook, R., DeRose, T., Drettakis, G., Ebert, D. S., Lewis, J. P., Perlin, K., & Zwicker, M. (2010). *A Survey of Procedural Noise Functions*. Computer Graphics Forum, 29(8), 2579–2600.
- Ebert, D. S., Musgrave, F. K., Peachey, D., Perlin, K., & Worley, S. (2003). *Texturing and Modeling: A Procedural Approach* (3.ª ed.). Morgan Kaufmann.
- Perlin, K. (2002). *Improving Noise*. ACM Transactions on Graphics, 21(3), 681–682.
- Tessendorf, J. (2001). *Simulating Ocean Water*. Notas de curso SIGGRAPH 2001 (aplicación).

## Parte XIV — Transporte de luz

*248 págs. (rango 214–267).* Recorrido de azar y luz, segunda etapa: medir la luz, modelar cómo rebota y resolver la ecuación que la describe.

### Capítulo 71. Radiometría y fotometría *(dividido)*

*36 págs. · Requiere: Cap. 28*

- Flujo, irradiancia, intensidad y radiancia como densidades respecto del área y del ángulo sólido (Cap. 28).
- Invariancia de la radiancia a lo largo de un rayo, ley del inverso del cuadrado y ley del coseno de Lambert.
- Fotometría: función de eficiencia luminosa, lúmenes, candelas, lux y nits.

**Casos de aplicación:** luces en unidades físicas y exposición de cámara.

**En el motor:** hito H17, *Luz en unidades físicas* (se abre al terminar el Cap. 72).

**Bibliografía**

- Pharr, M., Jakob, W., & Humphreys, G. (2023). *Physically Based Rendering* (4.ª ed.). MIT Press — Cap. 4.
- McCluney, W. R. (2014). *Introduction to Radiometry and Photometry* (2.ª ed.). Artech House.
- Lagarde, S., & de Rousiers, C. (2014). *Moving Frostbite to Physically Based Rendering*. Curso SIGGRAPH 2014 (aplicación).

### Capítulo 72. Colorimetría *(dividido)*

*36 págs. · Requiere: Caps. 12 y 71*

- Funciones de igualación de color, espacio XYZ y diagrama de cromaticidad.
- Espacios RGB como cambio de base (Cap. 12): gama, punto blanco y adaptación cromática.
- Funciones de transferencia: gamma, sRGB y PQ para HDR.

**Casos de aplicación:** cadena de renderizado en espacio lineal, conversión entre espacios de color y mapeo tonal.

**En el motor:** hito H17, *Luz en unidades físicas* (se abre con este capítulo).

**Bibliografía**

- Wyszecki, G., & Stiles, W. S. (2000). *Color Science: Concepts and Methods, Quantitative Data and Formulae* (2.ª ed.). Wiley.
- Fairchild, M. D. (2013). *Color Appearance Models* (3.ª ed.). Wiley.

### Capítulo 73. La ecuación de renderizado como ecuación integral *(dividido)*

*36 págs. · Requiere: Caps. 13 y 71*

- Ecuación de reflexión y ecuación de renderizado.
- Forma por ángulo sólido y forma por área: término geométrico y visibilidad.
- Operador de transporte y ecuaciones integrales de Fredholm de segunda especie.
- Radiosidad como discretización que lleva a un sistema lineal (Cap. 13).

**Casos de aplicación:** radiosidad y mapas de luz precalculados.

**En el motor:** hito H18, *Materiales PBR* (se abre al terminar el Cap. 74).

**Bibliografía**

- Kajiya, J. T. (1986). *The Rendering Equation*. Proceedings of SIGGRAPH '86, 143–150.
- Arvo, J. (1995). *Analytic Methods for Simulated Light Transport*. Tesis doctoral, Yale University.
- Pharr, M., Jakob, W., & Humphreys, G. (2023). *Physically Based Rendering* (4.ª ed.). MIT Press — Cap. 13.

### Capítulo 74. BRDF y teoría de microfacetas *(dividido)*

*44 págs. · Requiere: Caps. 67 y 73*

- Definición de BRDF: reciprocidad y conservación de la energía.
- Modelos de Lambert y Phong normalizado; ecuaciones de Fresnel y aproximación de Schlick.
- Teoría de microfacetas: distribución de normales GGX y función de enmascaramiento de Smith.
- Muestreo por importancia de la BRDF y de normales visibles (Cap. 67).

**Casos de aplicación:** materiales PBR metálico–rugosidad, aproximación *split-sum* y cosenos transformados linealmente (LTC) para luces de área.

**En el motor:** hito H18, *Materiales PBR* (se abre con este capítulo).

**Bibliografía**

- Walter, B., Marschner, S. R., Li, H., & Torrance, K. E. (2007). *Microfacet Models for Refraction through Rough Surfaces*. Proceedings of EGSR 2007, 195–206.
- Heitz, E. (2014). *Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs*. Journal of Computer Graphics Techniques, 3(2), 48–107.
- Karis, B. (2013). *Real Shading in Unreal Engine 4*. Curso SIGGRAPH 2013 (aplicación).
- Heitz, E., Dupuy, J., Hill, S., & Neubelt, D. (2016). *Real-Time Polygonal-Light Shading with Linearly Transformed Cosines*. ACM Transactions on Graphics, 35(4) (aplicación).

### Capítulo 75. Solución de la ecuación de renderizado: serie de Neumann y caminos

*52 págs. · Requiere: Caps. 50, 68 y 74*

- Serie de Neumann y condiciones de convergencia.
- Formulación por integral de caminos.
- Trazado de caminos con estimación de eventos siguientes, ruleta rusa y MIS entre luces y BRDF.
- Esbozo del trazado bidireccional y remuestreo espaciotemporal (ReSTIR) con el RIS del Cap. 68.

**Casos de aplicación:** trazador de caminos sobre la BVH del Cap. 50 e iluminación directa con muchas luces en tiempo real.

**En el motor:** hito H22, *Trazador de caminos* (se abre al terminar el Cap. 76).

**Bibliografía**

- Veach, E. (1997). *Robust Monte Carlo Methods for Light Transport Simulation*. Tesis doctoral, Stanford University.
- Pharr, M., Jakob, W., & Humphreys, G. (2023). *Physically Based Rendering* (4.ª ed.). MIT Press — Cap. 13.
- Bitterli, B., Wyman, C., Pharr, M., Shirley, P., Lefohn, A., & Jarosz, W. (2020). *Spatiotemporal Reservoir Resampling for Real-Time Ray Tracing with Dynamic Direct Lighting*. ACM Transactions on Graphics, 39(4) (aplicación).

### Capítulo 76. Ecuación de transferencia radiativa

*44 págs. · Requiere: Cap. 75*

- Absorción, emisión y dispersión; transmitancia de Beer–Lambert (Cap. 51).
- Ecuación de transferencia radiativa en forma diferencial e integral.
- Funciones de fase: Henyey–Greenstein y Rayleigh.
- Muestreo de distancias: *delta tracking* y *ratio tracking*.

**Casos de aplicación:** niebla volumétrica, nubes, dispersión atmosférica y dispersión subsuperficial.

**En el motor:** hito H22, *Trazador de caminos* (se abre con este capítulo).

**Bibliografía**

- Chandrasekhar, S. (1960). *Radiative Transfer*. Dover.
- Novák, J., Georgiev, I., Hanika, J., & Jarosz, W. (2018). *Monte Carlo Methods for Volumetric Light Transport Simulation*. Computer Graphics Forum, 37(2), 551–576.
- Hillaire, S. (2020). *A Scalable and Production Ready Sky and Atmosphere Rendering Technique*. Computer Graphics Forum, 39(4) (aplicación).

## Material preliminar y final

**Material preliminar** (30 págs., rango 26–32)

- Prefacio y contrato pedagógico.
- El motor 3D como mapa de problemas matemáticos: qué hace un motor (bucle principal, escena, render y física) y qué parte del libro estudia cada pieza. Reemplaza al antiguo Cap. 1 y no es un capítulo *(movido)*.
- Grafo de dependencias por capítulo.
- Notación y convenciones: mano, ejes, orden de matrices y rangos de profundidad.
- Los dos caminos de lectura, por la matemática y por el motor, y los recorridos por partes.

**Material final** (100 págs., rango 87–107)

- Apéndice A. Referencia rápida: identidades, derivadas e integrales, fórmulas de rotación y conversiones entre representaciones.
- Apéndice B. El motor del libro: instalación, arquitectura, mapa de módulos y de hitos con sus etiquetas, reglas de dependencias y referencias de comparación (Three.js y Rapier); lenguajes de *shaders* (WGSL, TSL y GLSL).
- Apéndice C. Soluciones completas de los ejercicios impares; todas, en la edición web.
- Apéndice D. Glosario bilingüe español–inglés.
- Índice analítico.

## Tabla maestra de extensión

La obra suma unas 3.384 páginas: 982 más que la versión anterior (+41 %) y algo más del doble que el temario original, de 1.648.

| Sección | Caps. | Rango (págs.) | Holgada (págs.) | Peso dominante |
| --- | --- | --- | --- | --- |
| Material preliminar | — | 26–32 | 30 | Contrato, mapa del motor, dependencias y notación |
| Parte I: Fundamentos | 1–8 | 273–336 | 314 | Lógica, precálculo, error numérico, trigonometría, complejos y matemática discreta |
| Parte II: Álgebra lineal | 9–15 | 262–323 | 302 | Matrices, sistemas lineales, Teorema Espectral y SVD |
| Parte III: Cálculo de una variable | 16–20 | 174–215 | 200 | Derivadas, integrales, series, raíces y cuadratura |
| Parte IV: Geometría afín, proyectiva y rotaciones | 21–26 | 244–301 | 280 | Homogéneas, proyección, rasterización, cuaterniones y grupos de Lie |
| Parte V: Cálculo multivariable | 27–29 | 115–141 | 132 | Jacobianos, integración múltiple y teoremas integrales |
| Parte VI: Optimización y álgebra lineal numérica | 30–34 | 173–214 | 200 | Levenberg–Marquardt, KKT, complementariedad y gradiente conjugado |
| Parte VII: Fourier, muestreo y esfera | 35–38 | 142–176 | 164 | Series de Fourier, FFT, Nyquist–Shannon y armónicos esféricos |
| Parte VIII: Curvas, superficies y geometría diferencial | 39–45 | 265–328 | 306 | Splines, curvatura, mallas discretas y campos de distancia |
| Parte IX: Geometría computacional | 46–50 | 189–232 | 216 | Predicados, convexidad, GJK, Voronoi y particiones |
| Parte X: EDO e integración numérica | 51–54 | 157–192 | 180 | Estabilidad e integradores |
| Parte XI: Mecánica de sólidos | 55–58 | 181–223 | 208 | Sólido rígido, cadenas articuladas, restricciones y contacto |
| Parte XII: Medios continuos y EDP | 59–64 | 226–278 | 260 | Diferencias finitas, elementos finitos y Navier–Stokes |
| Parte XIII: Probabilidad y procesos estocásticos | 65–70 | 212–261 | 244 | Monte Carlo, ruido azul y campos aleatorios |
| Parte XIV: Transporte de luz | 71–76 | 214–267 | 248 | Radiometría, microfacetas, ecuación de renderizado y transferencia radiativa |
| Material final | — | 87–107 | 100 | Referencia, entorno de laboratorio, soluciones y glosario |
| **Total** | **76** | **2.940–3.626** | **3.384** | **\~43 págs. por capítulo** |

## División editorial

La opción recomendada son 6 tomos de entre 480 y 648 páginas. Los tres primeros reúnen el núcleo común y Fourier; los tres últimos, los recorridos de geometría, mecánica, y azar y luz.

**Opción A — 6 tomos (recomendada)**

| Tomo | Contenido | Págs. (holgada) | Hitos del motor que se abren |
| --- | --- | --- | --- |
| 1. Fundamentos y álgebra lineal | Material preliminar + Partes I y II (Caps. 1–15) | \~646 | H1 a H3 |
| 2. Cálculo y geometría del espacio 3D | Partes III y IV (Caps. 16–26) | \~480 | H4 a H6 |
| 3. Cálculo multivariable, optimización y Fourier | Partes V a VII (Caps. 27–38) | \~496 | H16 |
| 4. Geometría diferencial y computacional | Partes VIII y IX (Caps. 39–50) | \~522 | H8, H9, H10, H14 y H15 |
| 5. Mecánica | Partes X a XII (Caps. 51–64) | \~648 | H7, H11, H12, H13, H20 y H21 |
| 6. Probabilidad y transporte de luz | Partes XIII y XIV (Caps. 65–76) + material final | \~592 | H17, H18, H19 y H22 |

**Opción B — 4 tomos**

| Tomo | Contenido | Págs. (holgada) |
| --- | --- | --- |
| I. Fundamentos, álgebra lineal y cálculo | Material preliminar + Partes I a III (Caps. 1–20) | \~846 |
| II. Geometría 3D, optimización y Fourier | Partes IV a VII (Caps. 21–38) | \~776 |
| III. Geometría y primera mecánica | Partes VIII a XI (Caps. 39–58) | \~910 |
| IV. Medios continuos, probabilidad y luz | Partes XII a XIV (Caps. 59–76) + material final | \~852 |

La opción B deja tomos de hasta unas 900 páginas y reparte el recorrido de mecánica entre los tomos III y IV. En la opción A, el Tomo 1 funciona solo como libro de fundamentos y álgebra lineal, y con él se completan los tres primeros hitos del motor. En cualquiera de las dos, el Apéndice B y las soluciones completas pueden vivir solo en la edición web.

## Biblioteca núcleo (10 títulos)

Con el foco en la matemática, la biblioteca núcleo pasa a ser de textos de matemática más dos puentes hacia los motores; las referencias de ingeniería siguen citadas en los casos de aplicación de cada capítulo.

1. **Cálculo de una y varias variables:** Stewart, *Cálculo: Trascendentes tempranas*.
2. **EDO, Fourier, EDP y cálculo vectorial:** Zill & Wright, *Matemáticas avanzadas para ingeniería*, y Zill, *Ecuaciones diferenciales con aplicaciones de modelado*.
3. **Álgebra lineal:** Strang, *Introduction to Linear Algebra*.
4. **Análisis numérico:** Burden, Faires & Burden, *Análisis Numérico*.
5. **Optimización:** Nocedal & Wright, *Numerical Optimization*, y Boyd & Vandenberghe, *Convex Optimization* (gratuito en línea).
6. **Geometría diferencial:** do Carmo, *Differential Geometry of Curves and Surfaces*, con las notas de Crane para la versión discreta.
7. **Geometría computacional:** de Berg et al., *Computational Geometry: Algorithms and Applications*.
8. **Probabilidad:** Blitzstein & Hwang, *Introduction to Probability*.
9. **Puente hacia la geometría de motores:** Lengyel, *Foundations of Game Engine Development, Vol. 1: Mathematics*.
10. **Puente hacia el render:** Pharr, Jakob & Humphreys, *Physically Based Rendering* (4.ª ed., gratuito en línea).
