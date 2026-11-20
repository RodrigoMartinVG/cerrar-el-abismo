# Especificación del proyecto — Matemática y práctica

*Título provisional · Versión 0.4 · 20 de noviembre de 2026*

Este documento sustituye como plan vigente al «Índice temático revisado» de *Métodos Matemáticos para Ingeniería de Motores 3D* (76 capítulos y un motor didáctico en paralelo). Recoge las decisiones del 20 de noviembre de 2026: una obra de matemática de nivel licenciatura, sin motor, con aplicaciones variadas, pensada para la web y con una misión central: cerrar el abismo entre la matemática que se estudia y la que se usa. La sección 15 indica dónde quedó cada capítulo del índice anterior. La versión 0.2 suma la arista de la física: la matemática que necesitan los físicos, con su propio hilo, su propio puente y un décimo tomo. La versión 0.3 añade el perfil de egreso (2.1): qué puede hacer el lector fuera de la matemática al terminar la obra. La versión 0.4 registra las primeras decisiones de infraestructura (sección 11): el sitio se construye con Astro y Starlight, y el índice temático pasa a ser datos, desde los que se genera la sección 13. El documento vive en el repositorio `cerrar-el-abismo`, en `docs/especificacion.md`; el índice anterior está en `docs/historico/`.

## 0. Organización de este documento

| Secciones | Contenido |
| --- | --- |
| 1–5 | Qué es la obra y por qué: visión, contrato y perfil de egreso, diagnóstico del abismo, principios y alcance |
| 6–12 | Cómo está hecha: tomos, plantilla de capítulo, el puente, aplicaciones, ejercicios, plataforma web y convenciones |
| 13 | Índice temático completo de los diez tomos |
| 14–17 | Extensión, correspondencia con el índice anterior, plan de trabajo y decisiones abiertas |

## 1. Visión

Quien estudia matemática se encuentra a menudo con situaciones prácticas en las que parece haber un abismo entre lo que aprendió y cómo se usa. El caso paradigmático es el motor 3D: el estudiante llega con un curso completo de álgebra lineal y descubre que lo que se usa en un motor parece otra cosa. Las matrices son de 4×4, los puntos y los vectores se distinguen, las normales se transforman con una receta extraña, las rotaciones se guardan en cuaterniones y el vocabulario no se parece al del curso. Lo que sabe no parece aplicable, y lo que le explican escapa a su experiencia.

La obra quiere cerrar ese abismo sin dejar de ser una obra de matemática. Cada tema se construye con rigor de licenciatura y, en el mismo capítulo, se enseña a reconocerlo en la práctica: su vocabulario, sus convenciones, sus representaciones y sus aproximaciones. Los motores 3D son un hilo que recorre toda la obra, pero no el único. El mismo abismo existe entre la probabilidad y el aprendizaje automático, entre Fourier y el procesamiento de audio, o entre las ecuaciones diferenciales y la simulación física.

La física merece un lugar propio en esa lista: es la segunda práctica de la obra. Su abismo tiene las mismas capas que el del motor 3D y va en dos sentidos. Al matemático que abre un libro de física le falta la traducción: índices, notación de Dirac, una delta que se manipula como si fuera una función. Al físico le falta el rigor que justifica esas manipulaciones. Además, las dos prácticas se tocan: la física es la teoría, y el motor, su simulación.

## 2. Contrato de la obra

- **Qué es.** Una obra de matemática de nivel licenciatura en diez tomos ordenados por áreas, con definiciones, teoremas y demostraciones completas, y con aplicaciones de varios campos en cada capítulo. Se publica primero en la web, con código en vivo y figuras interactivas.
- **Qué no es.** No es un manual de programación, de un motor ni de una herramienta. Ningún capítulo trata de ingeniería o de informática por sí mismas, y no hay un motor que crezca en paralelo.
- **Lector.** Estudiantes de matemática, física, ingeniería e informática; profesionales que quieren entender la matemática de lo que usan; autodidactas dispuestos a leer demostraciones. A los físicos, la obra les da el rigor; a los matemáticos, la traducción a la notación de la física.
- **Punto de partida.** La matemática de la escuela secundaria. El Tomo I empieza por la lógica y la demostración.
- **Nivel.** El de una licenciatura en matemática con orientación aplicada. Todo resultado que se usa se demuestra. Cuando una prueba excede la obra, el resultado se enuncia con una referencia exacta y se dice qué se pierde al no demostrarlo.
- **Misión transversal.** Cerrar el abismo entre teoría y práctica (secciones 3 y 8).

### 2.1 Perfil de egreso

El contrato dice qué es la obra; el perfil de egreso dice qué puede hacer, fuera de la matemática, quien la termina. La obra no forma físicos, programadores de motores ni ingenieros: no enseña el oficio de ningún campo ni da intuición experimental. Forma un matemático capaz de **traducir**. Ante una fórmula de física o una línea de código, sabe qué teorema la sostiene, qué da por supuesto y cuándo deja de valer; ante un teorema, sabe dónde aparece en la práctica. Con esa base, el oficio de cada campo se aprende sin que haya un abismo.

El perfil es un compromiso que se puede comprobar, no una declaración de intenciones. Cada capacidad se apoya en los fragmentos de salida (8.1) y en los ejercicios de traducción (8.4) de los capítulos citados entre paréntesis, y cada bloque corresponde al itinerario que indica su título (9.6).

**Capacidades comunes (itinerario de núcleo).**

- **Reconocer el teorema detrás de la práctica, y al revés.** Ver `transpose(inverse(M))` y pensar en la aplicación dual (II.5); ver `|ψ⟩` y pensar en un vector de un espacio con producto interno (II.8).
- **Preguntar qué se da por supuesto y cuándo falla.** En el código, la aritmética exacta (I.10, II.16); en la física, intercambiar límites o tratar la delta como una función (III.6, VII.5).
- **Tratar las convenciones como elecciones.** Vectores fila o columna, mano derecha o izquierda, el signo de la transformada de Fourier: quien entiende que una convención es la elección de un isomorfismo (II.14) pasa de un libro o de un motor a otro sin perderse (sección 12).
- **Pasar de la demostración al programa** que la usa y leer el resultado numérico con un criterio de error (II.12, III.10).
- **Leer literatura técnica de otro campo** (artículos, documentación, textos de física o de ingeniería) sin que la notación sea un obstáculo, con el diccionario academia–práctica como apoyo (8.5).

**Física (itinerario de física).** El lector puede seguir los cursos de física de grado distinguiendo lo riguroso de la heurística útil.

- **Mecánica clásica:** las formulaciones lagrangiana y hamiltoniana como cálculo de variaciones, con corchetes de Poisson y Hamilton–Jacobi, y el sólido rígido como dinámica en SO(3) (VI.7–VI.9).
- **Electromagnetismo:** las ecuaciones de Maxwell en forma integral y diferencial, con el teorema que pasa de una a otra (IV.11), y después en el lenguaje de las formas diferenciales (IV.13); la carga puntual como distribución (VII.5).
- **Mecánica cuántica:** estados en espacios de Hilbert y operadores autoadjuntos; por qué ningún par de matrices finitas cumple `[x, p] = iħ`; el espín como representación de SU(2); los orbitales como armónicos esféricos; funciones especiales, perturbaciones y WKB (II.8, VII.13, IX.3, IX.5, X.2, X.7, X.8).
- **Mecánica estadística:** la entropía de Boltzmann y la de Shannon como una misma idea, el modelo de Ising con MCMC, el movimiento browniano y las funciones de partición por métodos asintóticos (VII.10, VIII.8, VIII.10, VIII.14).
- **Relatividad especial y general:** Minkowski y Lorentz, variedades, curvatura, geodésicas y gravitación, con la corrección de los relojes del GPS como prueba de que importa (X.3–X.6).
- **Medios continuos:** calor, ondas, acústica, fluidos y elasticidad, con funciones de Green y elementos finitos (Tomo IX).

Límite: la teoría cuántica de campos, las teorías gauge y los fibrados quedan fuera (5.4). El lector llega a su puerta con lo necesario para empezarlas.

**Gráficos y 3D (itinerario de gráficos y 3D).** El lector puede leer el código de un motor o un artículo de gráficos reconociendo la estructura que hay debajo de cada truco y, cuando algo falla (una rotación que se degenera, una sombra que parpadea), saber qué hipótesis se rompió.

- **Del vértice al píxel:** marcos de referencia, matrices 4×4, cámara, proyección y Reverse-Z; las normales como covectores (II.3, II.5, II.13, V.3).
- **Rotaciones y animación:** cuaterniones y SLERP, *skinning* con grupos de Lie y curvas para cámaras (II.15, V.4–V.6).
- **Simulación:** paso fijo, integradores que conservan la estructura, sólido rígido, contactos, tela y cuerdas (VI.9–VI.12).
- **Render:** trazado de caminos como ecuación integral, muestreo por importancia, microfacetas, iluminación con armónicos esféricos y *Gaussian Splatting* (VII.13, VIII.2, VIII.3, VIII.5, VIII.6, VIII.11).
- **Geometría computacional:** selección con el ratón, colisiones, mallas de navegación, *ray marching* y BVH (V.9–V.11, V.13, V.14).
- **Números en la máquina:** por qué un mundo grande tiembla lejos del origen y por qué una simulación diverge entre plataformas (I.10, II.16).

Límite: las APIs gráficas, los *shaders*, la arquitectura de un motor y la optimización en GPU son oficio, no matemática. La obra hace que se aprendan más rápido, pero no los enseña.

**Otros campos (itinerario de núcleo).** Las demás etiquetas (9.1) dan salidas igual de concretas. El número de aplicaciones de cada campo sale de la sección 14; cuando una capacidad depende de un capítulo complementario, se indica.

| Campo | Aplicaciones | Qué puede hacer el lector |
| --- | --- | --- |
| Ingeniería [Ing] | 73 | Robótica: cinemática de eslabones y planificación de movimientos (II.13, V.10). Control: espacio de estados, estabilidad, Bode y Nyquist (VI.3, VI.4, VII.8, VII.9). Estructuras con elementos finitos y aerodinámica (IX.7, IX.9). Navegación inercial y filtrado (II.16, VIII.13). CAD y fabricación aditiva (V.5, V.9, V.13) |
| Datos [Datos] | 43 | Entender por qué funciona lo que se usa como caja negra: regresión, PCA y SVD, optimización convexa y vectores soporte, entrenamiento con diferenciación automática, inferencia bayesiana y MCMC, entropía cruzada (II.8, II.10, IV.5, IV.7, IV.8, VIII.8, VIII.13, VIII.14). Con el itinerario de datos, redes equivariantes (X.1) |
| Biología, medicina, economía y finanzas [Bio/Eco] | 35 | Poblaciones y epidemias, farmacocinética, imagen médica, ensayos clínicos y pruebas diagnósticas (II.6, VI.1, VI.4, VII.4, V.13, VIII.1, VIII.12). Insumo-producto, utilidad con presupuesto y equilibrio de mercado (II.1, IV.4, VI.12). Valoración de opciones por Monte Carlo (VIII.6) |
| Señales [Señales] | 25 | Fourier, muestreo, filtros, audio digital y JPEG (VII.3, VII.4, VII.6, VII.12). Con un complementario, ondículas y JPEG 2000 (VII.7) |
| Criptografía y computación [Cripto] | 13 | RSA y Diffie–Hellman, Reed–Solomon, CRC y AES, colisiones de *hash*, compresión de Huffman y determinismo entre plataformas (I.4, I.5, I.8, I.10, VIII.14) |

Los dos hilos fijos tienen 106 aplicaciones ([3D]) y 77 ([Física]). La ingeniería no es hilo fijo ni tiene itinerario, pero tiene casi tantas aplicaciones como la física; si merece un itinerario propio es una decisión abierta (17).

**En suma.** Quien termina la obra puede sentarse con un físico, un programador de gráficos, un ingeniero de control o un científico de datos, entender sus cuentas, aportar rigor y aprender su oficio rápido. Eso abre caminos como la física matemática, la investigación en gráficos, la simulación, la robótica, el aprendizaje automático o las finanzas cuantitativas.

## 3. Diagnóstico: por qué existe el abismo

Tomando el caso del álgebra lineal frente a un motor 3D, el abismo tiene siete capas, y cada una pide un remedio distinto.

| Capa | En qué consiste | Ejemplo | Remedio en la obra |
| --- | --- | --- | --- |
| 1. Matemática que la carrera omite | La práctica usa temas que un plan de estudios típico no cubre | Coordenadas homogéneas, geometría proyectiva, cuaterniones, precisión finita | Incluirlos con rigor completo como «eslabones perdidos» (5.2) |
| 2. Lo que se sabe pero no se reconoce | La matemática es la misma, pero presentada de otra forma | «Normales con la transpuesta de la inversa» es la aplicación dual | Sección Puente y recuadro «Una línea, un teorema» (8.2 y 8.3) |
| 3. Convenciones | Elecciones arbitrarias que nadie declara | Vector fila o columna, y almacenamiento por filas o columnas, son dos elecciones independientes; combinadas, dos transposiciones se cancelan | Capítulo propio (II.14), convenciones declaradas de la obra (sección 12) y conversor interactivo (8.5) |
| 4. Representación como decisión | Lo que es equivalente en teoría no lo es en la práctica | Matriz, cuaternión, ángulos de Euler o eje y ángulo para la misma rotación | Pregunta fija del Puente: qué representaciones compiten y qué cuesta cada una |
| 5. Dimensión baja y precisión finita | El curso general omite lo que no se generaliza y supone aritmética exacta | Producto vectorial, Cramer en 3×3, deriva de las rotaciones en float32 | Resultados propios de las dimensiones 2, 3 y 4; comparador exacto frente a float32 (8.5) |
| 6. Aproximaciones | La práctica usa atajos que parecen errores | NLERP en lugar de SLERP, Schlick en lugar de Fresnel | Cotas de error en el régimen que importa |
| 7. Vocabulario y fuentes | Otros nombres y otro tipo de literatura | «*World space*», «*model matrix*»; charlas, especificaciones y código | Diccionario academia–práctica y ejercicios con fragmentos reales (8.4 y 8.5) |

El abismo con la física tiene las mismas siete capas:

| Capa | En la física |
| --- | --- |
| 1. Matemática que la carrera omite | Tensores con índices, funciones especiales, métodos asintóticos, representaciones de grupos, espacio de Minkowski |
| 2. Lo que se sabe pero no se reconoce | ⟨φ\|ψ⟩ es el teorema de Riesz; «se transforma como un tensor» es una aplicación multilineal más un cambio de base; el corchete de Poisson anticipa el conmutador |
| 3. Convenciones | Signatura de la métrica, ħ = c = 1, papeles de θ y φ en las coordenadas esféricas, posición de los índices |
| 4. Representación como decisión | Imágenes de Schrödinger y de Heisenberg; representaciones de posición y de momento; formulaciones lagrangiana y hamiltoniana |
| 5. Lo que se da por supuesto | Manipulaciones formales: la delta como función, intercambiar límites, series divergentes |
| 6. Aproximaciones | Perturbaciones, ángulo pequeño, series asintóticas |
| 7. Vocabulario y fuentes | «Hermítico» por autoadjunto; libros de física con su propia notación |

## 4. Principios de diseño

1. **El orden lo dicta la matemática.** Las aplicaciones nunca imponen dependencias: solo usan matemática de los requisitos del capítulo, y pueden señalar otros capítulos como aviso.
2. **Rigor completo dentro del alcance.** Lo que entra se construye entero y en orden.
3. **Cada capítulo tiende su puente** entre el teorema y la práctica (sección 8).
4. **Aplicaciones variadas.** Cada capítulo toca al menos dos campos; el 3D y la física son hilos fijos, pero no los únicos (sección 9).
5. **Dependencias explícitas y verificables,** por capítulo y por tomo, comprobadas automáticamente (sección 11).
6. **La web es el formato principal;** el PDF de cada tomo es una salida derivada.
7. **Las convenciones son contenido:** la obra declara las suyas y enseña a traducir las ajenas.

## 5. Alcance

### 5.1 Criterio de entrada

Un tema entra como capítulo si cumple una de estas dos condiciones:

- **Núcleo de licenciatura:** forma parte del núcleo de una licenciatura con orientación aplicada y tiene aplicaciones que se pueden mostrar, o lo necesita un capítulo posterior que las tiene.
- **Eslabón perdido:** es matemática que la práctica usa a diario y que la carrera suele omitir o tratar de pasada.

Dentro del alcance no se recorta: las construcciones se muestran completas y en orden.

### 5.2 Eslabones perdidos

| Tema | Capítulo |
| --- | --- |
| Representación de números en la máquina y coma flotante | I.10 |
| Producto tensorial y notación de índices | II.11 |
| Espacios afines y coordenadas homogéneas | II.13 |
| Convenciones como elección de isomorfismo | II.14 |
| SO(3) y cuaterniones | II.15 |
| Álgebra lineal en precisión finita | II.16 |
| Polinomios de Bernstein, interpolación y *splines* | III.9, V.5 |
| Métodos numéricos con análisis de error en coma flotante | II.12, III.10 |
| Diferenciación automática | IV.8 |
| Coordenadas curvilíneas y cálculo tensorial | IV.12 |
| Geometría de cámaras y de varias vistas | V.3 |
| Predicados geométricos robustos | V.9 |
| Convexidad computacional (sumas de Minkowski, GJK) | V.10 |
| Geometría discreta de mallas | V.12 |
| Integración geométrica (simpléctica y en grupos de Lie) | VI.11 |
| Contacto y complementariedad | VI.12 |
| Distribuciones | VII.5 |
| Muestreo y transformada discreta | VII.6 |
| Métodos asintóticos | VII.10 |
| Generación de muestras, Monte Carlo y cuasi-Monte Carlo | VIII.5, VIII.6, VIII.7 |
| Ecuaciones integrales resueltas por caminos aleatorios | VIII.11 |
| Funciones especiales y polinomios ortogonales | IX.3 |
| Perturbaciones y WKB | IX.5 |
| Representaciones de grupos | X.1, X.2 |
| Espacio de Minkowski y grupo de Lorentz | X.3 |
| Operadores no acotados | X.7 |

### 5.3 Capítulos de núcleo y complementarios

Cada capítulo se marca como **núcleo** o **complementario**. Un capítulo complementario es uno del que no depende ningún capítulo de núcleo. El recorrido formado solo por capítulos de núcleo es una licenciatura aplicada completa en sí misma; los complementarios amplían sin romper nada. La sección 14 da la extensión de los dos recorridos.

### 5.4 Fuera de alcance

Quedan fuera las ramas puras sin aplicaciones al alcance de la obra. Cuando conviene señalarlas, aparecen en el recuadro «Para seguir» del capítulo más cercano.

| Tema | Dónde se señala |
| --- | --- |
| Teoría de Galois (se quedan los cuerpos finitos) | I.8 |
| Teoría de conjuntos axiomática y cardinales infinitos más allá de lo numerable | I.2 |
| Lenguajes formales, gramáticas y satisfacción de restricciones | I.6 |
| Teoría analítica de números | I.4 |
| Geometría algebraica | I.8 |
| Topología general más allá de los espacios métricos | III.11 |
| Topología algebraica | V.12 |
| Fibrados y teorías gauge | X.5 |
| Álgebra geométrica y álgebra geométrica proyectiva (PGA) | IV.13 |
| Análisis funcional más allá de los operadores en espacios de Hilbert | X.7 |
| Cálculo estocástico de Itô | VIII.10 |
| Representaciones de grupos no compactos más allá del grupo de Lorentz | X.3 |
| Teoría cuántica de campos | X.8 |

### 5.5 Algoritmos de ingeniería: de capítulo a aplicación

En el índice anterior varios algoritmos de motores eran capítulos. Ahora aparecen como aplicaciones del resultado matemático que los sostiene:

| Algoritmo o técnica | Resultado que lo sostiene | Capítulo |
| --- | --- | --- |
| Transformación de normales | Aplicación dual | II.5 |
| SLERP y el cambio de signo del cuaternión | Recubrimiento doble S³ → SO(3) | II.15 |
| Re-ortonormalización de cámaras | Descomposición polar y Gram–Schmidt en precisión finita | II.16 |
| Cinemática inversa | Gauss–Newton y Levenberg–Marquardt | IV.8 |
| Reverse-Z | Distribución de la coma flotante y proyección | V.3 |
| Rasterización con funciones de arista | Determinante como área orientada; coordenadas baricéntricas | V.3 |
| *Skinning* con cuaterniones duales | Grupos de Lie, SE(3) y números duales | V.4 |
| Möller–Trumbore | Regla de Cramer | V.9 |
| GJK y EPA | Convexidad, sumas de Minkowski y funciones de soporte | V.10 |
| BVH con SAH | Fórmula de Cauchy–Crofton | V.14 |
| Euler semi-implícito y Verlet | Integradores simplécticos | VI.11 |
| Impulsos secuenciales | Gauss–Seidel proyectado para complementariedad | VI.12 |
| *Mipmaps* y TAA | Teorema del muestreo y filtros de reconstrucción | VII.6 |
| Iluminación con armónicos esféricos | Base de L²(S²) y teorema de Funk–Hecke | VII.13 |
| Microfacetas GGX | Distribución de normales como densidad de probabilidad | VIII.2 |
| Trazado de caminos | Serie de Neumann y Monte Carlo | VIII.11 |
| *Stable Fluids* | Descomposición de Helmholtz–Hodge | IX.9 |

## 6. Estructura de la colección

La obra tiene diez tomos. Los Tomos I, II y III forman la base; los demás son tomos de área, y las dependencias entre ellos aparecen en las partes avanzadas.

| Tomo | Título | Requiere | Interfaces | Caps. |
| --- | --- | --- | --- | --- |
| I | Fundamentos: lógica, números y estructuras | — | — | 10 |
| II | Álgebra lineal y el espacio de la práctica | I | — | 16 |
| III | Análisis en una variable | I | — | 11 |
| IV | Análisis en varias variables y optimización | II, III | — | 13 |
| V | Geometría | II, III, IV | — | 14 |
| VI | Ecuaciones diferenciales, sistemas dinámicos y mecánica | II, III, IV | V.4 | 12 |
| VII | Medida, Fourier y variable compleja | III, IV | — | 13 |
| VIII | Probabilidad, estadística y métodos estocásticos | IV, VII | — | 14 |
| IX | Ecuaciones en derivadas parciales y medios continuos | VI, VII | VIII.9 | 10 |
| X | Simetría, variedades y operadores | V, VII, VIII | IX.3 | 8 |
| **Total** | | | | **121** |

```
                 ┌─► II  Álgebra lineal ───┐
I  Fundamentos ──┤                         ├─► IV  Varias variables
                 └─► III Análisis 1 var. ──┘

            IV ──► V    Geometría
            IV ──► VI   Ecuaciones diferenciales (+ interfaz V.4)
            IV ──► VII  Medida, Fourier y variable compleja
      IV + VII ──► VIII Probabilidad y estadística
      VI + VII ──► IX   EDP y medios continuos (+ interfaz VIII.9)
V + VII + VIII ──► X    Simetría, variedades y operadores (+ interfaz IX.3)
```

**Reglas de interdependencia**

- Un tomo depende de otros completos (columna «Requiere») o importa capítulos concretos (columna «Interfaces»).
- Cada tomo abre con **«Lo que este tomo importa»**: para cada tomo o capítulo del que depende, de 4 a 8 páginas con los enunciados, las garantías y la notación que usa, y los capítulos que hay que leer para entenderlos a fondo. Quien no leyó un tomo previo puede avanzar usando ese resumen como contrato.
- Cada tomo cierra con **«Lo que este tomo exporta»**: los resultados que otros tomos importan.
- Atajos que respetan el grafo: V.1, V.2, V.3 y V.5 solo usan los Tomos II y III, así que la geometría afín, proyectiva y de cámaras se puede leer justo después del álgebra lineal. VI.1 a VI.3 también usan solo los Tomos II y III.
- Las dependencias se verifican automáticamente (11.5).

## 7. Plantilla de capítulo

Cada capítulo empieza con su línea de metadatos: extensión, requisitos, tipo (núcleo o complementario) e hilos de aplicación.

| Elemento | Contenido | Peso orientativo |
| --- | --- | --- |
| 1. Entrada | Un fragmento real de código, de una especificación o de un texto de física que el lector todavía no puede explicar | 1 página |
| 2. Motivación | Una aplicación que plantea la pregunta del capítulo | — |
| 3. Desarrollo | Definiciones, intuición, teoremas y demostraciones completas; en la web las demostraciones se pueden plegar | 45 % |
| 4. Cálculo | Los métodos numéricos que surgen de la teoría, con código en vivo y comparación entre cálculo exacto y float32 | 10 % |
| 5. Puente | Las cinco preguntas fijas (8.2) y el recuadro «Una línea, un teorema» | 10 % |
| 6. Aplicaciones | De 2 a 4, de al menos dos campos, con al menos una interactiva | 20 % |
| 7. Salida | El fragmento de entrada explicado línea por línea | 1 página |
| 8. Ejercicios | De demostración, de cálculo con verificación automática, de exploración y de traducción (sección 10) | 15 % |
| 9. Notas y «Para seguir» | Historia del tema y hacia dónde continúa fuera de la obra | — |

Los capítulos tienen entre 28 y 52 páginas.

## 8. El puente

### 8.1 Fragmento de entrada y de salida

Cada capítulo abre con un fragmento real que el lector todavía no puede explicar y cierra explicándolo línea por línea. Así el abismo es el hilo narrativo del capítulo y, a la vez, un objetivo que se puede comprobar: al terminar, el lector puede leer ese fragmento. Los fragmentos son código o fórmulas y notación de física. Salen de código abierto con licencia permisiva, de especificaciones públicas o de la notación estándar de los textos de física, siempre citados; cuando no hay uno adecuado, se escribe uno propio en el estilo real.

### 8.2 Las cinco preguntas del Puente

1. ¿Cómo se llama esto en la práctica?
2. ¿Qué convenciones hay y cómo se pasa de una a otra?
3. ¿Qué representaciones compiten y qué cuesta cada una?
4. ¿Qué se da por supuesto y cuándo falla? En el código, la aritmética exacta; en la física, manipulaciones formales como tratar la delta como una función o intercambiar límites.
5. ¿Qué aproximaciones se usan y cuánto error tienen?

No todas las preguntas aplican a todos los capítulos; la sección responde las que tienen contenido y dice explícitamente cuando una no aplica.

### 8.3 «Una línea, un teorema»

Recuadro recurrente: una línea de código o una fórmula de la práctica que contiene un resultado matemático. Algunos ejemplos:

| Línea | Resultado | Capítulo |
| --- | --- | --- |
| `n2 = transpose(inverse(M)) * n` | Aplicación dual | II.5 |
| `vec4(p, 1.0)` y `vec4(v, 0.0)` | Espacio afín como hiperplano w = 1 | II.13 |
| `if (dot(q1, q2) < 0.0) q2 = -q2;` | Recubrimiento doble S³ → SO(3) | II.15 |
| `x = lerp(x, target, 1 - exp(-k * dt))` | Solución exacta de una EDO lineal | III.8 |
| `y = y * (1.5 - 0.5 * x * y * y)` | Un paso de Newton para 1/√x | III.10 |
| `t += sdf(origin + t * dir)` | Constante de Lipschitz y *sphere tracing* | V.13 |
| `v += a * dt; x += v * dt;` | Integrador simpléctico | VI.11 |
| `color += f(x) / pdf(x)` | Estimador insesgado de Monte Carlo | VIII.6 |
| `x - max(x)` antes de un *softmax* | Estabilidad numérica en coma flotante | I.10 |
| `np.einsum('ij,jk->ik', A, B)` | Contracción de tensores y convención de Einstein | II.11 |
| `∫ δ(x) f(x) dx = f(0)` | La delta como distribución | VII.5 |
| `[x, p] = iħ` | Imposible con matrices finitas, porque la traza de un conmutador es 0: exige operadores no acotados | X.7 |
| `state = kron(q0, q1)` | Producto tensorial y entrelazamiento | X.8 |

### 8.4 Ejercicios de traducción

- **Leer:** dado un fragmento real, identificar la matemática, la convención y la aproximación que usa.
- **Traducir:** pasar un código o una fórmula de una convención a otra.
- **Encontrar el error:** por ejemplo, normales transformadas con M bajo una escala no uniforme.

### 8.5 Herramientas transversales de la web

- **Diccionario academia–práctica,** que también funciona de español a inglés: «cambio de base» ↔ «*transform from object space to world space*», «covector» ↔ «normal», «combinación afín» ↔ «*lerp*», «autoadjunto» ↔ «hermítico», «aplicación multilineal» ↔ «tensor con índices», etc.
- **Conversor de convenciones:** se eligen la mano de los ejes, el tipo de vector (fila o columna) y el orden de almacenamiento, y se ve cómo cambian la matriz y su disposición en memoria. Para la física, también la signatura de la métrica y la convención de las coordenadas esféricas.
- **Comparador exacto frente a float32:** celdas que muestran el mismo cálculo con SymPy y en coma flotante, para ver un teorema cumplirse y luego derivar.

### 8.6 Partes puente

Además de la sección Puente de cada capítulo, hay partes enteras donde la carrera omite temas completos: Tomo I, Parte C; Tomo II, Parte C; Tomo III, Parte C; Tomo V, Partes A y D; Tomo VI, Parte C; Tomo VII, Partes B y C (distribuciones y métodos asintóticos); Tomo VIII, Parte B; Tomo IX, Parte A; y el Tomo X entero.

## 9. Aplicaciones e hilos

### 9.1 Campos y etiquetas

| Etiqueta | Campo |
| --- | --- |
| [3D] | Gráficos por computadora, motores 3D y videojuegos |
| [Física] | Física |
| [Ing] | Ingeniería, control y robótica |
| [Datos] | Datos, estadística aplicada, aprendizaje automático y visión por computador |
| [Señales] | Señales, audio e imagen |
| [Cripto] | Criptografía, códigos y computación |
| [Bio/Eco] | Biología, medicina, economía y finanzas |

### 9.2 Reglas

- Cada capítulo tiene de 2 a 4 aplicaciones, de al menos dos campos, y al menos una es interactiva.
- Los hilos [3D] y [Física] aparecen en todos los tomos, y ninguno supera un tercio de las aplicaciones de un tomo.
- Las aplicaciones solo usan matemática de los requisitos del capítulo; pueden señalar otros capítulos como aviso.

### 9.3 Páginas de hilo

En la web, cada hilo tiene una página que encadena sus aplicaciones en orden de lectura. Es lo que queda del antiguo motor: un recorrido guiado por demostraciones interactivas, sin un código con hitos que mantener. Las demos del hilo 3D comparten una pequeña biblioteca de utilidades (vectores, matrices, cámara y lienzo) para que se vean y se comporten igual. Las páginas del hilo de física enlazan además cada resultado con el curso de física donde aparece: mecánica clásica, electromagnetismo, mecánica cuántica, mecánica estadística o relatividad.

### 9.4 Recorrido del hilo 3D

| Tomo | Aplicaciones del hilo 3D |
| --- | --- |
| I | Coma flotante, determinismo y *origin rebasing* (I.10); grafos de escena (I.6) |
| II | Cambio de marco (II.3), normales (II.5), matrices 4×4 (II.13), convenciones (II.14), cuaterniones y SLERP (II.15), re-ortonormalización (II.16) |
| III | *Smoothstep* y *easing* (III.4), suavizado independiente del paso (III.8), curvas de Bézier (III.9), raíz inversa rápida (III.10) |
| IV | Normales por gradiente y huella de un píxel (IV.2), cinemática inversa (IV.8), ángulo sólido e irradiancia (IV.9), masa e inercia de mallas (IV.11) |
| V | Cámara, rasterización y Reverse-Z (V.3), *skinning* (V.4), rieles de cámara (V.5 y V.6), *normal mapping* (V.7), selección con el ratón (V.9), colisiones (V.10), mallas de navegación (V.11), niveles de detalle (V.12), *ray marching* (V.13), BVH (V.14) |
| VI | Paso fijo (VI.10), tela y cuerdas (VI.11), pilas de cajas (VI.12), sólido rígido (VI.9) |
| VII | Desenfoque y *bloom* (VII.4), *mipmaps* y TAA (VII.6), iluminación con armónicos esféricos (VII.13) |
| VIII | Microfacetas (VIII.2), *Gaussian Splatting* (VIII.3), sombras por varianza (VIII.4), muestreo de BRDF (VIII.5), Monte Carlo y ReSTIR (VIII.6), terreno procedural (VIII.9), trazado de caminos (VIII.11) |
| IX | Humo con *Stable Fluids* (IX.9), océanos y agua (IX.10), cuerpos blandos (IX.8) |
| X | Rotación de armónicos esféricos (X.2), visualización relativista (X.3), optimización sobre SO(3) (X.4), geodésicas sobre mallas (X.5), agujeros negros (X.6) |

### 9.5 Recorrido del hilo de física

| Tomo | Aplicaciones del hilo de física |
| --- | --- |
| I | Simetrías de moléculas y cristales (I.7) |
| II | Análisis dimensional (II.3), torque (II.4), modos normales (II.6), notación de Dirac (II.8), principio de Rayleigh–Ritz (II.9), tensores (II.11), matrices de Pauli y espín (II.15) |
| III | Doppler (III.4), trabajo y energía (III.5), péndulo y ángulo pequeño (III.7) |
| IV | Fuerzas de restricción (IV.4), ecuaciones de Maxwell (IV.11), coordenadas curvilíneas (IV.12), electromagnetismo con formas (IV.13) |
| V | Cristalografía (V.1), simetrías continuas (V.4), membranas (V.7) |
| VI | Oscilador y resonancia (VI.2), sistema de Lorenz (VI.5), mecánica lagrangiana y hamiltoniana (VI.7 y VI.8), sólido rígido (VI.9), dinámica molecular (VI.11) |
| VII | Estados cuánticos en un espacio de Hilbert (VII.2), difracción (VII.4), distribuciones y cargas puntuales (VII.5), Kramers–Kronig (VII.9), funciones de partición (VII.10), orbitales atómicos (VII.13) |
| VIII | Maxwell–Boltzmann (VIII.2), modelo de Ising (VIII.8), movimiento browniano (VIII.10), transporte de radiación (VIII.11), mecánica estadística (VIII.14) |
| IX | Calor y acústica (IX.1), funciones especiales en cuántica (IX.3), gravitación (IX.4), WKB (IX.5), fluidos (IX.9), oleaje (IX.10) |
| X | El tomo entero: espín, relatividad especial y general, mecánica cuántica |

### 9.6 Itinerarios por perfil

Además del orden de los tomos, la web ofrece itinerarios: selecciones de capítulos según el perfil del lector. Todos respetan el grafo de dependencias, y la sección 14 da su extensión.

| Itinerario | Capítulos |
| --- | --- |
| Núcleo | Todos los capítulos de núcleo: la licenciatura aplicada mínima (5.3) |
| Física | Núcleo, más IV.13, VI.5, VII.10, VII.11, VIII.9, VIII.11, IX.5, IX.8, IX.10 y el Tomo X |
| Gráficos y 3D | Núcleo, más V.14, VIII.7, VIII.9, VIII.11, IX.8 e IX.10 |
| Datos | Núcleo, más VII.7, VIII.7, VIII.9 y X.1 |

## 10. Ejercicios

- **Tipos:** demostraciones; cálculos con verificación automática (numérica o simbólica); exploraciones con las figuras interactivas; ejercicios de traducción (8.4); proyectos cortos que combinan varios capítulos.
- **Graduación:** cada ejercicio indica su dificultad y la sección a la que corresponde.
- **Soluciones:** completas para los impares en la obra; las de los pares, en un espacio para docentes (decisión abierta, sección 17).
- **Verificación:** los ejercicios de cálculo comprueban la respuesta en el navegador, con SymPy para respuestas simbólicas y tolerancias relativas para las numéricas.

## 11. Plataforma web

### 11.1 Herramienta de edición

Decidido (decisión 0001 del repositorio): **Astro con Starlight**, en TypeScript, el mismo stack que el otro proyecto del autor. Starlight da la navegación, la búsqueda, el modo oscuro y la interfaz en español; la capa de libro (numeración «II.5.3», referencias entre tomos, bibliografía y PDF) es propia. El contenido de los capítulos se escribe en Markdown con un conjunto cerrado de directivas (`:::teorema`, `:::demostracion`, `:::puente`, `::figura`, `::celda`), para que la misma fuente produzca la web y el PDF. Se descartaron Quarto, que trae la capa de libro pero es rígido para la interfaz, y MyST, más joven y con el Python en vivo más pesado.

### 11.2 Código en vivo

- **Python en el navegador** (Pyodide, con NumPy, SciPy y SymPy) para el cálculo y la verificación de ejercicios.
- **TypeScript** para las figuras interactivas y las demos 3D.
- El código de las celdas se puede editar y volver a ejecutar; cada celda tiene una versión de referencia que se puede restaurar.

### 11.3 Figuras

- **JSXGraph** para geometría dinámica.
- **Observable Plot** o **D3** para gráficos de datos.
- **Three.js** para escenas 3D.
- **Manim** para animar demostraciones, como vídeos ya renderizados.
- Si la obra se va a vender, hay que revisar la licencia de cualquier herramienta incrustada; GeoGebra, por ejemplo, restringe el uso comercial.

### 11.4 Metadatos de capítulo

Los metadatos de cada capítulo viven en el índice como datos (decisión 0002 del repositorio): un archivo por tomo en `indice/tomo-NN.yaml`, validado contra un esquema. Cuando se escriba un capítulo, su archivo declarará solo su `id`, y así hay una sola fuente para los requisitos y el tipo.

```yaml
- id: II.5
  titulo: Espacio dual y covectores
  paginas: 32
  requiere: [II.3]
  tipo: nucleo
  contenidos: [...]
  puente: 'Entrada: `n2 = transpose(inverse(M)) * n`. ...'
  aplicaciones:
    - campo: 3d
      texto: transformación de normales y de planos
  lecturas: Axler, *Linear Algebra Done Right*; ...
```

Con ellos se generan el grafo de dependencias navegable, las páginas de tomo, de hilo y de itinerario, la sección 13 de este documento y las comprobaciones automáticas.

### 11.5 Comprobaciones automáticas

En cada cambio, la integración continua comprueba lo siguiente. Las reglas del índice (los puntos 1 y 2, los hilos de 9.2, los itinerarios de 9.6 y las referencias entre capítulos) ya se comprueban en `packages/indice`; el resto llega con los capítulos.

1. Que cada requisito existe y es anterior dentro del mismo tomo, o pertenece a un tomo requerido o a una interfaz declarada.
2. Que ningún capítulo de núcleo depende de uno complementario.
3. Que cada capítulo tiene entrada, Puente y aplicaciones de al menos dos campos.
4. Que las referencias cruzadas y los enlaces externos funcionan.
5. Que todas las celdas de código se ejecutan y las respuestas de los ejercicios verifican.
6. Que las figuras tienen texto alternativo.

### 11.6 Rendimiento y accesibilidad

- Python pesa más de 10 MB en el navegador: se carga solo cuando el lector ejecuta código por primera vez.
- Las figuras interactivas tienen versión estática y descripción textual, y se pueden manejar con el teclado.
- Las fórmulas se escriben en LaTeX y se muestran con KaTeX o MathJax, accesibles a lectores de pantalla.

### 11.7 PDF e impresión

Cada tomo se puede exportar a PDF. Las figuras interactivas aparecen como fotogramas fijos con un enlace o un código QR a la versión web; las celdas de código aparecen con su salida.

### 11.8 Licencias y fuentes

- Los fragmentos reales se citan con su fuente y su licencia.
- Las licencias del texto y del código de la obra son una decisión abierta (sección 17).

## 12. Convenciones de la obra

La obra declara sus convenciones y, en cada sección Puente, las traduce a las de la práctica.

| Tema | Convención de la obra | Traducciones frecuentes que se enseñan |
| --- | --- | --- |
| Números naturales | ℕ = {0, 1, 2, …} | ℕ sin el 0 |
| Vectores | Vectores columna; las matrices actúan por la izquierda: y = Ax | Vectores fila, y = xA (DirectX y textos antiguos) |
| Composición | (AB)x = A(Bx): se aplica primero la matriz de la derecha | Orden inverso con vectores fila |
| Almacenamiento en las demos | Por columnas, como WGSL y glTF | Por filas |
| Ejes | Sistema dextrógiro; en las aplicaciones 3D, Y hacia arriba como en glTF | Sistemas levógiros; Z hacia arriba |
| Profundidad | Rango [0, 1], como WebGPU | [−1, 1], como WebGL |
| Cuaterniones | q = w + xi + yj + zk, escrito (w, x, y, z) | (x, y, z, w), como glTF |
| Producto interno complejo | Lineal en el primer argumento | Lineal en el segundo, como en física |
| Ángulos y logaritmos | Radianes; log es el logaritmo natural | Grados; log en base 10 |
| Transformada de Fourier | f̂(ξ) = ∫ f(x) e^(−2πixξ) dx | Convenciones con ω y factores 1/√(2π); normalizaciones de las bibliotecas de FFT |
| Coordenadas esféricas | θ polar y φ azimutal (norma ISO 80000-2, la de la física) | θ azimutal y φ polar, como en muchos textos de cálculo |
| Índices | Convención de Einstein; superíndices para las componentes de vectores y subíndices para las de covectores | Todos los índices abajo en coordenadas cartesianas |
| Signatura de la métrica de Minkowski | (−, +, +, +), como en geometría y relatividad general | (+, −, −, −), como en física de partículas |
| Unidades | Sistema Internacional; cuando se usa ħ = c = 1, se dice explícitamente | Unidades naturales sin aviso |
| Operadores | «Autoadjunto», distinguido de «simétrico» para operadores no acotados | «Hermítico» para ambos |
| Armónicos esféricos | Complejos, con la fase de Condon–Shortley | Sin esa fase, o reales, como en gráficos y geodesia |

## 13. Índice temático completo

Cada entrada da: el título; la extensión, los requisitos y el tipo; el contenido; el Puente (fragmento de entrada y lo que revela); las aplicaciones por campo; y las lecturas de referencia. Los requisitos usan la numeración «tomo.capítulo».

<!-- indice: generado desde indice/ con `npm run indice:spec`; no editar a mano -->

### Tomo I — Fundamentos: lógica, números y estructuras

*Requiere: escuela secundaria · 10 capítulos.* El lenguaje de la matemática, los sistemas numéricos y las estructuras algebraicas y discretas que usan todos los tomos, incluida la forma en que una computadora representa los números.

**Parte A — Lenguaje y números**

#### I.1 Lógica y demostración
*40 págs. · Requiere: — · Núcleo*
- Lógica proposicional: conectivos, tablas de verdad, equivalencias, implicación, contrapositiva y negación.
- Cuantificadores, su negación y su orden.
- Técnicas de demostración: directa, por contradicción, por casos y por contraejemplo; inducción simple y fuerte.
- Notación de sumatorias y productorias; manipulación de índices.

**Puente.** Entrada: `assert(i <= n)` dentro de un bucle. Un invariante de bucle es un enunciado que se demuestra por inducción; una aserción es una implicación que el programa comprueba al ejecutarse.
**Aplicaciones.** [Cripto] invariantes y corrección de algoritmos · [Datos] pruebas basadas en propiedades · [3D] precondiciones de las funciones geométricas, como exigir un vector no nulo antes de normalizar.
**Lecturas.** Velleman, *How to Prove It*; Hammack, *Book of Proof*.

#### I.2 Conjuntos, relaciones y funciones
*44 págs. · Requiere: I.1 · Núcleo*
- Conjuntos, operaciones, producto cartesiano y conjunto de partes.
- Relaciones de equivalencia, clases y particiones; relaciones de orden.
- Funciones inyectivas, sobreyectivas y biyectivas; composición, inversa, imagen y preimagen.
- Cardinalidad: conjuntos finitos, numerables y no numerables; argumento diagonal de Cantor.

**Puente.** Entrada: `Map<Key, Value>` y una función `hash(key)`. Un diccionario es una función parcial, y una función de dispersión no puede ser inyectiva cuando el dominio es más grande que el codominio.
**Aplicaciones.** [Cripto] tablas de dispersión y clases de equivalencia · [Datos] bases de datos como relaciones · [3D] soldar vértices duplicados como paso al cociente por una relación de equivalencia.
**Lecturas.** Halmos, *Naive Set Theory*; Velleman, *How to Prove It*.

#### I.3 Naturales, enteros y divisibilidad
*40 págs. · Requiere: I.2 · Núcleo*
- Axiomas de Peano, inducción y definición por recursión; principio del buen orden.
- Enteros, algoritmo de la división y divisibilidad.
- Máximo común divisor, algoritmo de Euclides y su versión extendida; identidad de Bézout.
- Números primos, infinitud de los primos y teorema fundamental de la aritmética.

**Puente.** Entrada: `while (b != 0) { t = b; b = a % b; a = t; }`. Es el algoritmo de Euclides, y su terminación es el principio del buen orden.
**Aplicaciones.** [Cripto] aritmética racional exacta · [Señales] períodos de señales combinadas y mínimo común múltiplo · [3D] repetición de texturas con períodos coprimos para evitar patrones visibles.
**Lecturas.** Rosen, *Elementary Number Theory and Its Applications*; Stillwell, *Elements of Number Theory*.

#### I.4 Congruencias y aritmética modular
*40 págs. · Requiere: I.3 · Núcleo*
- Congruencias y el anillo ℤ/nℤ; inversos modulares.
- Teorema chino del resto.
- Pequeño teorema de Fermat, función φ de Euler y teorema de Euler.
- Exponenciación rápida y el problema del logaritmo discreto.

**Puente.** Entrada: `state = state * 6364136223846793005 + 1442695040888963407`. Un generador congruencial lineal es una iteración en ℤ/2⁶⁴ℤ, y su período lo deciden condiciones de aritmética modular (teorema de Hull–Dobell).
**Aplicaciones.** [Cripto] RSA, Diffie–Hellman y dígitos de control (ISBN, IBAN) · [3D] semillas reproducibles para mundos procedurales y *hashing* espacial · [Datos] reparto de datos entre servidores por dispersión.
**Lecturas.** Hoffstein, Pipher y Silverman, *An Introduction to Mathematical Cryptography*; Knuth, *The Art of Computer Programming*, vol. 2.

#### I.5 Combinatoria
*44 págs. · Requiere: I.3 · Núcleo*
- Principios de la suma y del producto; permutaciones y combinaciones.
- Coeficientes binomiales, teorema del binomio y triángulo de Pascal.
- Principio de inclusión–exclusión y principio del palomar.
- Recurrencias lineales y funciones generatrices.

**Puente.** Entrada: el triángulo de Pascal dentro de un código de curvas de Bézier. Los coeficientes de los polinomios de Bernstein son binomiales, y la recurrencia de Pascal es la que hace funcionar el algoritmo de De Casteljau (aviso de III.9 y V.5).
**Aplicaciones.** [Datos] conteo de configuraciones y probabilidad elemental · [Cripto] colisiones de *hash* y paradoja del cumpleaños · [3D] coeficientes de las curvas de Bézier · [Física] conteo de microestados y entropía de Boltzmann.
**Lecturas.** Graham, Knuth y Patashnik, *Concrete Mathematics*; Stanley, *Enumerative Combinatorics*, vol. 1.

**Parte B — Estructuras discretas y algebraicas**

#### I.6 Grafos
*44 págs. · Requiere: I.2, I.5 · Núcleo*
- Grafos, grados, caminos, ciclos y conectividad; árboles y sus caracterizaciones.
- Recorridos en anchura y en profundidad; árboles generadores mínimos.
- Caminos mínimos: Dijkstra y A\*, con la demostración de optimalidad para heurísticas admisibles.
- Grafos planos y fórmula de Euler V − E + F = 2; coloración.

**Puente.** Entrada: `node.children.forEach(update)` en un grafo de escena. La escena es un árbol y la actualización es un recorrido en profundidad; la fórmula de Euler es la primera comprobación de que una malla cerrada está bien formada.
**Aplicaciones.** [3D] grafos de escena, validación de mallas y búsqueda de caminos · [Ing] rutas y redes de transporte · [Datos] redes sociales y componentes conexas.
**Lecturas.** Bondy y Murty, *Graph Theory*; West, *Introduction to Graph Theory*.

#### I.7 Grupos
*48 págs. · Requiere: I.4 · Núcleo*
- Grupos, subgrupos y teorema de Lagrange; grupos cíclicos.
- Homomorfismos, subgrupos normales y grupos cociente.
- Grupos de permutaciones y signo de una permutación.
- Acciones de grupo, órbitas y estabilizadores; lema de Burnside.

**Puente.** Entrada: `cameraView = inverse(cameraTransform)`. Las transformaciones de un motor forman grupos: componer transformaciones es la operación del grupo, y la matriz de vista de una cámara es el inverso de su transformación en ese grupo.
**Aplicaciones.** [Física] simetrías de moléculas y cristales · [Cripto] grupos en la criptografía de clave pública · [3D] simetrías de patrones y teselaciones · [Datos] contar coloraciones distintas con el lema de Burnside.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Artin, *Algebra*.

#### I.8 Anillos, cuerpos y polinomios
*48 págs. · Requiere: I.7 · Núcleo*
- Anillos, ideales y anillos cociente; dominios de integridad y dominios euclídeos.
- Anillos de polinomios: división, raíces, factorización y polinomios irreducibles.
- Cuerpos y extensiones simples; ℚ, ℝ, ℂ y ℤ/pℤ como cuerpos.
- Cuerpos finitos GF(pⁿ): existencia, construcción y aritmética. Para seguir: teoría de Galois; geometría algebraica.

**Puente.** Entrada: `x = (x << 1) ^ ((x & 0x80) ? 0x1B : 0)`. Es multiplicar por x en GF(2⁸) módulo un polinomio irreducible: la operación con la que se construyen AES y los códigos de los QR.
**Aplicaciones.** [Cripto] códigos Reed–Solomon, CRC y AES · [Señales] corrección de errores en almacenamiento y transmisión · [3D] evaluación de polinomios con el esquema de Horner.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Lidl y Niederreiter, *Introduction to Finite Fields and Their Applications*.

**Parte C — Los números reales y la máquina**

#### I.9 Números reales y complejos
*40 págs. · Requiere: I.8 · Núcleo*
- Cuerpos ordenados; por qué ℚ no basta: √2 y los huecos de ℚ.
- Construcción de ℝ por cortaduras de Dedekind; axioma del supremo; unicidad del cuerpo ordenado completo.
- ℂ como ℝ[x]/(x² + 1): conjugado, módulo y desigualdad triangular.
- Forma polar y multiplicación como rotación y escala, con la trigonometría de la secundaria (III.8 la fundamenta).

**Puente.** Entrada: `z = z * complex(cos(a), sin(a))` en un juego 2D. Multiplicar por un número complejo de módulo 1 es rotar: es la versión plana de lo que harán los cuaterniones (aviso de II.15).
**Aplicaciones.** [3D] rotaciones 2D sin matrices · [Señales] fasores para representar oscilaciones · [Ing] impedancias en circuitos de corriente alterna · [Física] amplitudes complejas en óptica ondulatoria.
**Lecturas.** Spivak, *Calculus* (construcción de ℝ); Needham, *Visual Complex Analysis*.

#### I.10 Números en la máquina
*40 págs. · Requiere: I.4, I.9 · Núcleo*
- Representación posicional y cambio de base; enteros de máquina y complemento a dos como aritmética módulo 2ⁿ.
- Coma flotante IEEE 754: mantisa, exponente, valores especiales, épsilon de máquina y ULP.
- Redondeo y error relativo; cancelación catastrófica; condicionamiento frente a estabilidad.
- Formatos reducidos (float16, bfloat16, punto fijo y enteros normalizados) y error de cuantización.

**Puente.** Entrada: `0.1 + 0.2 == 0.3` da falso, y `if (abs(a - b) < 1e-6)`. Ninguno de esos números es representable exactamente, y la comparación correcta depende de la magnitud (tolerancia relativa), no de un épsilon fijo.
**Aplicaciones.** [3D] pérdida de precisión lejos del origen y *origin rebasing*; compresión de vértices y normales · [Datos] entrenamiento en bfloat16 y la resta del máximo antes de un *softmax* · [Ing] desbordamiento de enteros en sistemas embebidos · [Cripto] determinismo entre plataformas.
**Lecturas.** Goldberg, «What Every Computer Scientist Should Know About Floating-Point Arithmetic»; Overton, *Numerical Computing with IEEE Floating Point Arithmetic*; Higham, *Accuracy and Stability of Numerical Algorithms*.

### Tomo II — Álgebra lineal y el espacio de la práctica

*Requiere: Tomo I · 16 capítulos.* El álgebra lineal completa de una licenciatura, primero sobre un cuerpo cualquiera y luego sobre ℝ y ℂ, con su versión numérica. La Parte C cierra el tomo justo donde el estudiante siente el abismo y lleva el álgebra lineal al espacio de la práctica.

**Parte A — Estructura lineal**

#### II.1 Sistemas lineales y matrices
*40 págs. · Requiere: I.8 · Núcleo*
- Sistemas de ecuaciones lineales sobre un cuerpo; eliminación de Gauss y forma escalonada reducida.
- Matrices, producto e inversa; matrices elementales.
- Factorización LU y pivoteo.
- Existencia y unicidad de soluciones según la forma escalonada.

**Puente.** Entrada: `solve3x3(A, b)` escrito a mano en un motor de física. Es la eliminación de Gauss desenrollada para n = 3: en dimensión fija, la práctica prefiere fórmulas cerradas a algoritmos generales.
**Aplicaciones.** [Ing] análisis de circuitos y de estructuras · [Bio/Eco] modelo de insumo-producto de Leontief · [3D] intersección de tres planos.
**Lecturas.** Strang, *Introduction to Linear Algebra*; Hoffman y Kunze, *Linear Algebra*.

#### II.2 Espacios vectoriales
*40 págs. · Requiere: II.1 · Núcleo*
- Espacios vectoriales y subespacios; combinaciones lineales y subespacio generado.
- Independencia lineal, bases y dimensión.
- Coordenadas respecto de una base.
- Suma directa y espacio cociente.

**Puente.** Entrada: `struct Vec3 { float x, y, z; }`. Un `Vec3` no es un vector: son sus coordenadas en una base que el código nunca nombra. Saber en qué base está cada `Vec3` es la mitad del trabajo en un motor.
**Aplicaciones.** [3D] posiciones, velocidades y fuerzas · [Señales] espacios de señales y de polinomios · [Datos] vectores de características.
**Lecturas.** Axler, *Linear Algebra Done Right*; Hoffman y Kunze, *Linear Algebra*.

#### II.3 Transformaciones lineales
*40 págs. · Requiere: II.2 · Núcleo*
- Transformaciones lineales, núcleo e imagen; teorema de la dimensión.
- Matriz de una transformación en bases dadas; lectura de una matriz por columnas.
- Cambio de base y matrices semejantes.
- Isomorfismos y espacio de las transformaciones lineales.

**Puente.** Entrada: `worldPos = modelMatrix * localPos`. «Espacio local» y «espacio mundo» son dos bases; la matriz de modelo es una matriz de cambio de coordenadas, y sus columnas son los ejes del objeto escritos en el mundo.
**Aplicaciones.** [3D] espacios local, mundo y vista; espacios de color (RGB, XYZ) como cambios de base · [Señales] filtros lineales · [Física] cambios de sistema de referencia y análisis dimensional con el teorema π de Buckingham.
**Lecturas.** Axler, *Linear Algebra Done Right*; Lax, *Linear Algebra and Its Applications*.

#### II.4 Determinantes
*36 págs. · Requiere: II.3, I.7 · Núcleo*
- Formas multilineales alternadas; existencia y unicidad del determinante.
- Propiedades; determinante del producto; desarrollo por cofactores y regla de Cramer.
- El determinante como volumen orientado; orientación de una base.
- Producto vectorial y producto mixto en ℝ³ como determinantes.

**Puente.** Entrada: `if (dot(cross(b - a, c - a), n) < 0) cull();`. Descartar caras traseras es calcular el signo de un determinante 3×3: la orientación de un triángulo.
**Aplicaciones.** [3D] descarte de caras traseras y detección de reflexiones en una transformación · [Física] momento angular y torque · [Ing] cambio de volumen en mecánica de materiales.
**Lecturas.** Axler, *Linear Algebra Done Right*; Hoffman y Kunze, *Linear Algebra*.

#### II.5 Espacio dual y covectores
*32 págs. · Requiere: II.3 · Núcleo*
- Espacio dual, base dual y coordenadas como funcionales.
- Aplicación dual y su matriz: la transpuesta.
- Anuladores, doble dual e isomorfismo canónico.
- Hiperplanos como núcleos de covectores; el gradiente como covector (se retoma en IV.2).

**Puente.** Entrada: `n2 = transpose(inverse(M)) * n`. Una normal es un covector: la forma lineal que se anula en el plano tangente. Tras transformar con M, la forma que sigue anulándose es n ∘ M⁻¹, cuya matriz es (M⁻¹)ᵀ. Con rotaciones (M⁻¹)ᵀ = M, y por eso el error solo aparece con escalas no uniformes. Es el capítulo piloto de la obra (sección 16).
**Aplicaciones.** [3D] transformación de normales y de planos · [Física] fuerzas y trabajo como covectores · [Datos] los pesos de un modelo lineal como funcional.
**Lecturas.** Axler, *Linear Algebra Done Right*; Halmos, *Finite-Dimensional Vector Spaces*.

#### II.6 Autovalores y autovectores
*40 págs. · Requiere: II.4, I.8 · Núcleo*
- Autovalores, autovectores y polinomio característico.
- Diagonalización y subespacios invariantes.
- Teorema de Cayley–Hamilton y polinomio minimal.
- Autovalores de matrices 3×3: solución trigonométrica de la cúbica.

**Puente.** Entrada: `axis = eigenvector(R, 1)`. El eje de una rotación es el autovector de autovalor 1; el teorema de rotación de Euler (aviso de II.15) es un enunciado sobre autovalores.
**Aplicaciones.** [Física] modos normales de vibración · [Bio/Eco] crecimiento de poblaciones con matrices de Leslie · [3D] eje de una rotación dada por su matriz.
**Lecturas.** Axler, *Linear Algebra Done Right*; Strang, *Introduction to Linear Algebra*.

#### II.7 Forma canónica de Jordan
*36 págs. · Requiere: II.6 · Núcleo*
- Descomposición primaria y subespacios invariantes generalizados.
- Operadores nilpotentes y bloques de Jordan.
- Existencia y unicidad de la forma de Jordan.
- Potencias de matrices y recurrencias lineales.

**Puente.** Entrada: `x[n+1] = A * x[n]` en un muelle discretizado con amortiguamiento crítico. El término n·λⁿ que aparece en la solución es un bloque de Jordan: el caso crítico es justo el que no se puede diagonalizar.
**Aplicaciones.** [Ing] respuesta de sistemas discretos con amortiguamiento crítico · [Cripto] recurrencias lineales y Fibonacci por potencias de matrices · [Bio/Eco] modelos de poblaciones por edades.
**Lecturas.** Hoffman y Kunze, *Linear Algebra*; Axler, *Linear Algebra Done Right*.

**Parte B — Geometría métrica y descomposiciones**

#### II.8 Espacios con producto interno
*44 págs. · Requiere: II.5, I.9 · Núcleo*
- Producto interno, norma y desigualdad de Cauchy–Schwarz; ángulos.
- Ortogonalidad, bases ortonormales y Gram–Schmidt; factorización QR.
- Proyección ortogonal y mínimos cuadrados; ecuaciones normales.
- Representación de Riesz en dimensión finita y operador adjunto.

**Puente.** Entrada: `diffuse = max(dot(n, l), 0.0)`. La ley del coseno de Lambert es un producto interno de vectores unitarios; el `max` recorta el hemisferio al que la luz no llega. En física, la misma estructura se escribe ⟨φ|ψ⟩: el *bra* ⟨φ| es el covector que el teorema de Riesz asocia a |φ⟩, y |ψ⟩⟨ψ| es el proyector ortogonal sobre ψ.
**Aplicaciones.** [3D] iluminación difusa y proyección sobre planos · [Datos] regresión lineal por mínimos cuadrados · [Ing] ajuste de curvas a mediciones · [Física] notación de Dirac y proyecciones en mecánica cuántica.
**Lecturas.** Axler, *Linear Algebra Done Right*; Strang, *Introduction to Linear Algebra*.

#### II.9 Teorema espectral y formas cuadráticas
*48 págs. · Requiere: II.6, II.8 · Núcleo*
- Operadores autoadjuntos y normales; teorema espectral real y complejo.
- Formas bilineales y cuadráticas; ley de inercia de Sylvester.
- Matrices definidas positivas, criterio de Sylvester y factorización de Cholesky.
- Cociente de Rayleigh y caracterización variacional de los autovalores; perturbación de autovalores: fórmulas de primer orden y teorema de Weyl.

**Puente.** Entrada: `inertiaTensor` y sus «ejes principales». El tensor de inercia es una forma cuadrática simétrica, y sus ejes principales son los autovectores que garantiza el teorema espectral.
**Aplicaciones.** [Física] ejes principales de inercia y principio variacional de Rayleigh–Ritz · [Datos] matrices de covarianza · [3D] elipsoides envolventes · [Ing] análisis de tensiones.
**Lecturas.** Axler, *Linear Algebra Done Right*; Horn y Johnson, *Matrix Analysis*.

#### II.10 Descomposición en valores singulares
*40 págs. · Requiere: II.9 · Núcleo*
- Existencia de la SVD e interpretación geométrica: rotación, escala, rotación.
- Pseudoinversa de Moore–Penrose y mínimos cuadrados de norma mínima.
- Aproximación de rango bajo: teorema de Eckart–Young.
- Descomposición polar y análisis de componentes principales.

**Puente.** Entrada: `R = polarDecomposition(F).rotation` en un simulador de cuerpos deformables. Extraer la «parte de rotación» de una matriz cualquiera es la descomposición polar; la SVD la calcula y dice cuándo es única.
**Aplicaciones.** [Datos] PCA y compresión de imágenes · [3D] cajas orientadas por componentes principales y *shape matching* · [Señales] reducción de ruido · [Ing] calibración por transformación lineal directa (DLT).
**Lecturas.** Trefethen y Bau, *Numerical Linear Algebra*; Strang, *Introduction to Linear Algebra*.

#### II.11 Producto tensorial y álgebra multilineal
*44 págs. · Requiere: II.5, II.8 · Núcleo*
- Aplicaciones multilineales; producto tensorial de espacios por su propiedad universal y en coordenadas (producto de Kronecker).
- Tensores de tipo (p, q): componentes, cambio de base y la ley de transformación que los físicos usan como definición.
- Notación de índices y convención de Einstein; contracción; subir y bajar índices con un producto interno o una métrica.
- Tensores simétricos y antisimétricos; potencias exteriores y el determinante revisitado.

**Puente.** Entrada: `C = np.einsum('ij,jk->ik', A, B)` y, en un libro de física, `T'^μ_ν = Λ^μ_α T^α_β (Λ⁻¹)^β_ν`. Las dos son contracciones de índices: la primera es un producto de matrices escrito con la convención de Einstein, y la segunda es la ley de cambio de base de un tensor de tipo (1, 1). «Se transforma como un tensor» no es una definición misteriosa: es lo que le pasa en coordenadas a una aplicación multilineal.
**Aplicaciones.** [Física] tensor de inercia, tensor de tensiones y estados entrelazados como tensores no descomponibles · [Datos] operaciones con tensores en aprendizaje automático y descomposiciones de tensores · [3D] tensores de estructura y de curvatura en el procesamiento de mallas.
**Lecturas.** Roman, *Advanced Linear Algebra*; Jeevanjee, *An Introduction to Tensors and Group Theory for Physicists*.

#### II.12 Álgebra lineal numérica
*44 págs. · Requiere: II.10, I.10 · Núcleo*
- Normas matriciales y número de condición; error hacia adelante y hacia atrás.
- Estabilidad de LU con pivoteo, de QR con Householder y de Cholesky.
- Métodos iterativos de Jacobi y de Gauss–Seidel; convergencia por radio espectral; matrices dispersas.
- Autovalores numéricos: iteración de potencias, iteración inversa y algoritmo QR.

**Puente.** Entrada: `x = inverse(A) * b`. Casi nunca se invierte una matriz para resolver un sistema: es más caro y menos estable que factorizarla, y el número de condición dice cuánto se puede confiar en el resultado.
**Aplicaciones.** [Ing] sistemas dispersos de redes y estructuras · [Datos] PageRank por iteración de potencias · [3D] *solvers* iterativos de física · [Física] discretización de problemas de potencial.
**Lecturas.** Trefethen y Bau, *Numerical Linear Algebra*; Golub y Van Loan, *Matrix Computations*; Saad, *Iterative Methods for Sparse Linear Systems*.

**Parte C — Del álgebra lineal al espacio de la práctica**

#### II.13 Espacios afines y coordenadas homogéneas
*40 págs. · Requiere: II.4 · Núcleo*
- Por qué un espacio vectorial no basta: puntos y vectores; espacio afín y su espacio de direcciones.
- Combinaciones afines y convexas; coordenadas baricéntricas en segmentos, triángulos y tetraedros.
- Aplicaciones afines y su inmersión en ℝⁿ⁺¹ como el hiperplano w = 1: las matrices 4×4.
- Composición jerárquica de transformaciones; primera mirada a la proyección en perspectiva y a la división por w (V.2 y V.3 la desarrollan).

**Puente.** Entrada: `vec4(p, 1.0)` y `vec4(v, 0.0)`. Los puntos viven en w = 1 y las direcciones en w = 0; por eso una traslación mueve los puntos y deja quietas las direcciones. La «magia» de las matrices 4×4 es el espacio afín visto dentro de un espacio vectorial.
**Aplicaciones.** [3D] matrices 4×4 de modelo y grafos de escena · [Ing] transformaciones entre los eslabones de un robot · [Física] centro de masa como combinación afín.
**Lecturas.** Gallier, *Geometric Methods and Applications*; Lengyel, *Foundations of Game Engine Development*, vol. 1.

#### II.14 Convenciones como elección de isomorfismo
*28 págs. · Requiere: II.5, II.13 · Núcleo*
- Vectores fila y columna: la misma aplicación representada por A o por Aᵀ.
- Orden de almacenamiento por filas o por columnas: una elección independiente de la anterior; las cuatro combinaciones y por qué dos se ven idénticas en memoria.
- Orientación y mano del sistema de ejes; eje «arriba» Y o Z; transformaciones activas y pasivas.
- «Espacios» como marcos de referencia; la matriz de vista como inversa de la transformación de la cámara; cómo identificar una convención a partir de código o documentación, y cómo traducir.

**Puente.** Entrada: una matriz copiada de un tutorial de DirectX que «funciona al revés» en WebGL. Hay que identificar las dos elecciones de cada lado y componer los isomorfismos que las conectan; el capítulo da un procedimiento sistemático para hacerlo.
**Aplicaciones.** [3D] traducción entre las convenciones de Three.js, glTF y WebGPU · [Ing] marcos de referencia y convenciones de ángulos en robótica y aviación · [Física] convenciones de signo y de orientación en electromagnetismo.
**Lecturas.** Lengyel, *Foundations of Game Engine Development*, vol. 1; Dunn y Parberry, *3D Math Primer for Graphics and Game Development*.

#### II.15 Rotaciones: SO(3) y cuaterniones
*48 págs. · Requiere: II.9, II.14, I.7 · Núcleo*
- El grupo SO(3) y el teorema de rotación de Euler; eje y ángulo; fórmula de Rodrigues.
- Ángulos de Euler y de Tait–Bryan; demostración del bloqueo del cardán (*gimbal lock*).
- Cuaterniones de Hamilton: álgebra, conjugado, norma e inversa; cuaterniones unitarios y la esfera S³.
- El recubrimiento doble S³ → SO(3); interpolación SLERP, NLERP con su cota de error, y promedio de orientaciones.

**Puente.** Entrada: `if (dot(q1, q2) < 0.0) q2 = -q2;` antes de interpolar. q y −q representan la misma rotación porque S³ recubre dos veces SO(3); sin esa línea, la interpolación toma el camino largo.
**Aplicaciones.** [3D] cámaras, animación y compresión *smallest-three* · [Ing] actitud de satélites y drones · [Física] matrices de Pauli, SU(2) y espín (aviso de X.2).
**Lecturas.** Altmann, *Rotations, Quaternions, and Double Groups*; Hanson, *Visualizing Quaternions*; Shoemake, «Animating Rotation with Quaternion Curves».

#### II.16 Álgebra lineal en precisión finita
*32 págs. · Requiere: II.12, II.15 · Núcleo*
- Deriva de las matrices ortogonales al componerlas en coma flotante; medida de la pérdida de ortogonalidad.
- Re-ortonormalización: Gram–Schmidt frente a descomposición polar; renormalización de cuaterniones.
- Errores en cadenas de transformaciones; la transpuesta en lugar de la inversa para rotaciones.
- Predicados de orientación por determinantes y por qué fallan en coma flotante (V.9 lo resuelve).

**Puente.** Entrada: `if (frame % 100 == 0) orthonormalize(cameraBasis);`. Tras miles de productos en float32, la matriz deja de ser ortogonal; re-ortonormalizar es proyectar de nuevo sobre SO(3), y la descomposición polar da la rotación más cercana.
**Aplicaciones.** [3D] cámaras y jerarquías que «se deforman» con el tiempo · [Ing] navegación inercial · [Datos] reproducibilidad numérica.
**Lecturas.** Higham, *Accuracy and Stability of Numerical Algorithms*; Shoemake y Duff, «Matrix Animation and Polar Decomposition».

### Tomo III — Análisis en una variable

*Requiere: Tomo I · 11 capítulos.* El análisis real riguroso, de la completitud de ℝ a las series de funciones, con la aproximación, los métodos numéricos y los espacios métricos que necesitan los tomos siguientes.

**Parte A — Límites**

#### III.1 Sucesiones reales y completitud
*44 págs. · Requiere: I.9 · Núcleo*
- Límite de una sucesión; álgebra de límites; sucesiones monótonas.
- Subsucesiones y teorema de Bolzano–Weierstrass; límites superior e inferior.
- Sucesiones de Cauchy y completitud de ℝ.
- Iteración de punto fijo como sucesión: primeros ejemplos de convergencia.

**Puente.** Entrada: `x = x + (target - x) * 0.1;` en cada fotograma. Es una sucesión que converge geométricamente al objetivo, pero su velocidad depende de los fotogramas por segundo, problema que resuelve III.8.
**Aplicaciones.** [3D] suavizado de cámaras · [Bio/Eco] interés compuesto y crecimiento discreto · [Ing] algoritmos iterativos y criterios de parada.
**Lecturas.** Abbott, *Understanding Analysis*; Spivak, *Calculus*.

#### III.2 Series numéricas
*40 págs. · Requiere: III.1 · Núcleo*
- Convergencia de series; series geométricas y telescópicas.
- Criterios de comparación, del cociente, de la raíz y de Leibniz.
- Convergencia absoluta y condicional; teorema de reordenamiento de Riemann; producto de Cauchy.
- Series de números complejos.

**Puente.** Entrada: sumar `1.0f / n` en float32 hasta que la suma deja de crecer. La serie armónica diverge, pero la suma en coma flotante se estanca: el orden de suma importa, y la suma compensada de Kahan lo corrige.
**Aplicaciones.** [Datos] suma compensada de Kahan · [Física] desarrollos en serie de potenciales · [Bio/Eco] valor presente de flujos de pagos.
**Lecturas.** Abbott, *Understanding Analysis*; Knopp, *Theory and Application of Infinite Series*.

#### III.3 Límites y continuidad
*44 págs. · Requiere: III.1 · Núcleo*
- Límite de una función: definición ε–δ y caracterización por sucesiones.
- Continuidad; teoremas de Bolzano y del valor intermedio; teorema de Weierstrass sobre extremos.
- Continuidad uniforme y teorema de Heine.
- Funciones monótonas y continuidad de la inversa.

**Puente.** Entrada: `t = clamp((x - a) / (b - a), 0.0, 1.0)`. Recortar es componer con una función continua pero no derivable: la continuidad garantiza que no haya saltos, aunque el cambio brusco de pendiente se note en una animación (III.4).
**Aplicaciones.** [3D] funciones de remapeo y recorte · [Ing] bisección para encontrar raíces, garantizada por el teorema de Bolzano · [Señales] cuantización y discontinuidades.
**Lecturas.** Abbott, *Understanding Analysis*; Spivak, *Calculus*.

**Parte B — Cálculo**

#### III.4 La derivada
*48 págs. · Requiere: III.3 · Núcleo*
- Derivada como límite y como mejor aproximación lineal; reglas, regla de la cadena y derivada de la inversa.
- Teoremas de Rolle y del valor medio; regla de L'Hôpital.
- Extremos, monotonía y convexidad.
- Teorema de Darboux; funciones derivables con derivada discontinua.

**Puente.** Entrada: `t * t * (3.0 - 2.0 * t)` (*smoothstep*). Es el polinomio cúbico que vale 0 y 1 en los extremos y tiene derivada nula en ambos; esa derivada nula es lo que hace que el movimiento arranque y frene suave.
**Aplicaciones.** [3D] suavidad de las funciones de *easing* · [Física] velocidad, aceleración y efecto Doppler como derivada de la distancia · [Bio/Eco] costo marginal.
**Lecturas.** Spivak, *Calculus*; Apostol, *Calculus*, vol. 1.

#### III.5 La integral de Riemann
*48 págs. · Requiere: III.4 · Núcleo*
- Sumas de Darboux, integrabilidad y criterio de Riemann.
- Propiedades de la integral; teorema fundamental del cálculo.
- Cambio de variable, integración por partes e integrales impropias.
- Longitud de arco, áreas y valores medios.

**Puente.** Entrada: `position += velocity * dt` acumulado en un bucle. Es una suma de Riemann: el teorema fundamental dice hacia qué converge, y VI.10 mide el error cometido.
**Aplicaciones.** [Física] trabajo, energía y distancia recorrida · [Señales] valor medio y energía de una señal · [3D] longitud de una curva de animación.
**Lecturas.** Spivak, *Calculus*; Apostol, *Calculus*, vol. 1.

#### III.6 Sucesiones y series de funciones
*44 págs. · Requiere: III.2, III.5 · Núcleo*
- Convergencia puntual y uniforme; criterio de Cauchy uniforme y criterio M de Weierstrass.
- Intercambio de límites con la continuidad, la integral y la derivada.
- Series de potencias: radio de convergencia, derivación e integración término a término.
- Funciones analíticas reales; una función continua que no es derivable en ningún punto.

**Puente.** Entrada: la serie de Fourier de una onda cuadrada en un sintetizador. Las sumas parciales convergen puntualmente pero no uniformemente; el sobreimpulso que no desaparece (fenómeno de Gibbs) es la diferencia entre las dos convergencias.
**Aplicaciones.** [Señales] síntesis aditiva · [Física] soluciones en series de potencias · [3D] aproximaciones de funciones en *shaders* como series truncadas.
**Lecturas.** Abbott, *Understanding Analysis*; Rudin, *Principles of Mathematical Analysis*.

#### III.7 Fórmula de Taylor
*36 págs. · Requiere: III.6 · Núcleo*
- Polinomio de Taylor y restos de Lagrange, de Cauchy e integral.
- Series de Taylor y funciones que no coinciden con su serie, como e^(−1/x²).
- Órdenes de aproximación y notación O.
- Error de truncamiento frente a error de redondeo en las diferencias finitas.

**Puente.** Entrada: `sin(x) ≈ x` para ángulos pequeños en un péndulo de juego. Es el polinomio de Taylor de grado 1, y el resto de Lagrange dice hasta qué ángulo el error es invisible.
**Aplicaciones.** [Física] péndulo y aproximaciones de ángulo pequeño · [3D] aproximaciones baratas de funciones · [Ing] linealización de modelos.
**Lecturas.** Spivak, *Calculus*; Apostol, *Calculus*, vol. 1.

#### III.8 Funciones elementales
*40 págs. · Requiere: III.7 · Núcleo*
- Exponencial y logaritmo definidos por series o por la integral; potencias reales.
- Seno y coseno definidos por series; el número π; funciones trigonométricas inversas y `atan2`.
- La exponencial compleja y la fórmula de Euler e^(iθ) = cos θ + i sen θ.
- Funciones hiperbólicas.

**Puente.** Entrada: `x = lerp(x, target, 1.0 - exp(-k * dt))`. A diferencia del suavizado de III.1, este no depende de los fotogramas por segundo: 1 − e^(−k·dt) es la fracción exacta que recorre la solución de x′ = k(objetivo − x) en un intervalo dt.
**Aplicaciones.** [3D] suavizado independiente del paso, `atan2` para orientar objetos y codificación gamma (sRGB) de los colores · [Señales] decibeles y escalas logarítmicas · [Bio/Eco] crecimiento y desintegración exponenciales.
**Lecturas.** Spivak, *Calculus*; Rudin, *Principles of Mathematical Analysis*.

**Parte C — Aproximación, cálculo numérico y espacios métricos**

#### III.9 Aproximación e interpolación
*48 págs. · Requiere: III.8, I.5 · Núcleo*
- Teorema de aproximación de Weierstrass, demostrado con polinomios de Bernstein.
- Interpolación de Lagrange y de Newton; error de interpolación y fenómeno de Runge.
- Nodos y polinomios de Chebyshev; aproximación minimax y teorema de equioscilación.
- Interpolación de Hermite y *splines* cúbicos.

**Puente.** Entrada: `pow(1-t,3)*p0 + 3*pow(1-t,2)*t*p1 + 3*(1-t)*t*t*p2 + t*t*t*p3`. Es una curva de Bézier: la combinación de polinomios de Bernstein con la que se demuestra el teorema de Weierstrass. La herramienta de diseño y la demostración son la misma construcción.
**Aplicaciones.** [3D] curvas de Bézier y *easing* de Hermite · [Señales] funciones trigonométricas rápidas por aproximación minimax · [Ing] tablas de calibración interpoladas.
**Lecturas.** Trefethen, *Approximation Theory and Approximation Practice*; Davis, *Interpolation and Approximation*.

#### III.10 Métodos numéricos en una variable
*44 págs. · Requiere: III.9, I.10 · Núcleo*
- Bisección, Newton, secante y punto fijo; orden de convergencia y criterios de parada.
- Raíces de polinomios: cuadráticas estables, esquema de Horner y deflación.
- Cuadratura: trapecio, Simpson, Gauss–Legendre y cuadratura adaptativa, con su análisis de error.
- Derivación numérica y elección del paso en coma flotante.

**Puente.** Entrada: `y = y * (1.5 - 0.5 * x * y * y)`. Es un paso de Newton para 1/√x, el corazón de la célebre raíz cuadrada inversa rápida; el análisis de convergencia de Newton dice cuántas cifras gana cada paso.
**Aplicaciones.** [3D] raíz inversa rápida e inversión de curvas de *easing* · [Ing] ecuaciones de estado no lineales · [Bio/Eco] tasa interna de retorno.
**Lecturas.** Burden, Faires y Burden, *Análisis numérico*; Süli y Mayers, *An Introduction to Numerical Analysis*.

#### III.11 Espacios métricos
*48 págs. · Requiere: III.6 · Núcleo*
- Espacios métricos y normados; abiertos, cerrados y clausura.
- Convergencia, completitud y espacios de Banach; C[a, b] con la norma del supremo.
- Compacidad, conexidad y continuidad; teorema de Arzelà–Ascoli (enunciado y uso).
- Teorema del punto fijo de Banach. Para seguir: topología general.

**Puente.** Entrada: un *solver* iterativo que «a veces no converge». El teorema de Banach da la condición: si la iteración es contractiva, converge desde cualquier punto y con velocidad conocida; si no lo es, no hay garantía.
**Aplicaciones.** [Ing] convergencia de métodos iterativos · [Datos] distancias y medidas de similitud · [3D] distancia de Hausdorff para comparar mallas.
**Lecturas.** Rudin, *Principles of Mathematical Analysis*; Searcóid, *Metric Spaces*.

### Tomo IV — Análisis en varias variables y optimización

*Requiere: Tomos II y III · 13 capítulos.* Derivar e integrar en ℝⁿ, optimizar con y sin restricciones, y los teoremas integrales del cálculo vectorial.

**Parte A — Cálculo diferencial**

#### IV.1 Topología de ℝⁿ y continuidad
*28 págs. · Requiere: III.11, II.8 · Núcleo*
- ℝⁿ como espacio normado; equivalencia de las normas en dimensión finita.
- Teorema de Heine–Borel y compacidad.
- Funciones continuas de varias variables; límites por caminos y sus trampas.
- Aplicaciones lineales continuas y norma de operador.

**Puente.** Entrada: `length(v)`, `abs(v.x) + abs(v.y)` y `max(abs(v.x), abs(v.y))`. Son las normas L², L¹ y L∞; en dimensión finita son equivalentes, y por eso las pruebas de distancia baratas sirven de filtro antes de la exacta.
**Aplicaciones.** [3D] pruebas de distancia rápidas y cajas alineadas con los ejes · [Ing] distancia de Manhattan en logística · [Datos] normas en la regularización de modelos.
**Lecturas.** Munkres, *Analysis on Manifolds*; Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*.

#### IV.2 Diferenciabilidad
*44 págs. · Requiere: IV.1, II.5, III.7 · Núcleo*
- Derivada como aplicación lineal; derivadas parciales y direccionales.
- El gradiente como covector y como vector (vía el producto interno); matriz jacobiana; regla de la cadena.
- Funciones de clase C¹ y teorema de Schwarz.
- Derivadas de orden superior, matriz hessiana y fórmula de Taylor en varias variables.

**Puente.** Entrada: `n = normalize(vec3(f(p+ex)-f(p-ex), f(p+ey)-f(p-ey), f(p+ez)-f(p-ez)))`. La normal de una superficie implícita es su gradiente aproximado por diferencias centrales; `dFdx` y `dFdy` en la GPU son derivadas en el espacio de la pantalla.
**Aplicaciones.** [3D] normales de superficies implícitas y jacobiano de la proyección que mide la huella de un píxel sobre una textura · [Física] gradientes de potencial y fuerzas · [Datos] gradientes de funciones de pérdida.
**Lecturas.** Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*; Marsden y Tromba, *Vector Calculus*.

#### IV.3 Funciones inversa e implícita
*40 págs. · Requiere: IV.2 · Núcleo*
- Teorema de la función inversa, demostrado con el punto fijo de Banach.
- Teorema de la función implícita.
- Superficies de nivel y subvariedades de ℝⁿ; espacio tangente.
- Cambios de coordenadas locales.

**Puente.** Entrada: un *ray marcher* que trata `f(p) = 0` como una superficie. El teorema de la función implícita dice cuándo el conjunto de nivel es de verdad una superficie suave: donde el gradiente no se anula.
**Aplicaciones.** [3D] superficies implícitas y su plano tangente · [Ing] mecanismos y cinemática de lazos cerrados · [Bio/Eco] estática comparativa en economía.
**Lecturas.** Spivak, *Calculus on Manifolds*; Munkres, *Analysis on Manifolds*.

#### IV.4 Extremos y multiplicadores de Lagrange
*36 págs. · Requiere: IV.3, II.9 · Núcleo*
- Puntos críticos y su clasificación con la hessiana.
- Extremos condicionados; multiplicadores de Lagrange y su significado geométrico.
- Condiciones de segundo orden con restricciones.
- Los multiplicadores como sensibilidad del óptimo.

**Puente.** Entrada: `lambda` en un *solver* de restricciones de física. El multiplicador de Lagrange de una restricción es, físicamente, la fuerza que la mantiene: el «impulso de la restricción» de un motor es esa λ.
**Aplicaciones.** [Física] fuerzas de restricción · [Bio/Eco] maximización de la utilidad con un presupuesto · [3D] punto más cercano sobre una superficie.
**Lecturas.** Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*; Marsden y Tromba, *Vector Calculus*.

**Parte B — Optimización**

#### IV.5 Convexidad
*40 págs. · Requiere: IV.4 · Núcleo*
- Conjuntos convexos, envolvente convexa y teorema de Carathéodory.
- Teoremas de separación y de hiperplano soporte.
- Sumas de Minkowski y funciones de soporte.
- Funciones convexas, desigualdad de Jensen y caracterización por la hessiana.

**Puente.** Entrada: `support(shape, dir)` en un detector de colisiones. Una forma convexa queda determinada por su función de soporte; GJK (aviso de V.10) trabaja solo con ella, sobre la diferencia de Minkowski.
**Aplicaciones.** [3D] envolventes convexas para colisiones · [Datos] funciones de pérdida convexas · [Bio/Eco] aversión al riesgo y desigualdad de Jensen.
**Lecturas.** Boyd y Vandenberghe, *Convex Optimization*; Rockafellar, *Convex Analysis*.

#### IV.6 Programación lineal
*36 págs. · Requiere: IV.5, II.12 · Núcleo*
- Poliedros, vértices y soluciones básicas.
- Método símplex y su terminación.
- Dualidad y lema de Farkas.
- Flujo en redes y problema de transporte.

**Puente.** Entrada: un planificador que «elige la mezcla de recursos más barata». Es un programa lineal: el óptimo está en un vértice del poliedro, y los precios sombra son las variables duales.
**Aplicaciones.** [Ing] logística y transporte · [Bio/Eco] dietas y asignación de recursos · [Datos] problemas de asignación.
**Lecturas.** Bertsimas y Tsitsiklis, *Introduction to Linear Optimization*; Matoušek y Gärtner, *Understanding and Using Linear Programming*.

#### IV.7 Optimización con restricciones: KKT y dualidad
*36 págs. · Requiere: IV.5 · Núcleo*
- Condiciones de Karush–Kuhn–Tucker y calificaciones de las restricciones.
- Dualidad lagrangiana; dualidad débil y fuerte; condición de Slater.
- Programación cuadrática convexa.
- Proyección sobre conjuntos convexos.

**Puente.** Entrada: `lambda = max(lambda + delta, 0.0)` en un *solver* de contactos. La desigualdad λ ≥ 0 y la complementariedad son condiciones KKT: el contacto empuja, pero no tira.
**Aplicaciones.** [3D] contacto unilateral y límites articulares · [Datos] máquinas de vectores soporte · [Ing] diseño óptimo con restricciones.
**Lecturas.** Boyd y Vandenberghe, *Convex Optimization*; Nocedal y Wright, *Numerical Optimization*.

#### IV.8 Métodos de optimización y diferenciación automática
*52 págs. · Requiere: IV.7, II.12 · Núcleo*
- Descenso de gradiente, búsqueda lineal y condiciones de Wolfe; convergencia en el caso convexo.
- Método de Newton y métodos cuasi-Newton (BFGS).
- Mínimos cuadrados no lineales: Gauss–Newton y Levenberg–Marquardt; gradiente conjugado como minimización de una forma cuadrática.
- Diferenciación automática: grafo de cómputo, modo directo con números duales, modo inverso (retropropagación) y su costo.

**Puente.** Entrada: `loss.backward()`. Es el modo inverso de la diferenciación automática: la regla de la cadena aplicada al grafo de cómputo en orden inverso, con un costo proporcional al de evaluar la función.
**Aplicaciones.** [Datos] entrenamiento de redes neuronales · [3D] cinemática inversa por mínimos cuadrados amortiguados y calibración de cámaras · [Ing] ajuste de modelos a mediciones.
**Lecturas.** Nocedal y Wright, *Numerical Optimization*; Griewank y Walther, *Evaluating Derivatives*; Shewchuk, «An Introduction to the Conjugate Gradient Method Without the Agonizing Pain».

**Parte C — Cálculo integral**

#### IV.9 Integral múltiple
*48 págs. · Requiere: IV.3, III.5 · Núcleo*
- Integral de Riemann en rectángulos; conjuntos de medida nula y criterio de Lebesgue (enunciado).
- Teorema de Fubini.
- Teorema del cambio de variables, con demostración.
- Coordenadas polares, cilíndricas y esféricas; integración sobre la esfera y ángulo sólido.

**Puente.** Entrada: `E += L(dir) * cos(theta) * sin(theta) * dTheta * dPhi`. La irradiancia es una integral sobre el hemisferio respecto del ángulo sólido; el factor sen θ es el jacobiano de las coordenadas esféricas, y olvidarlo es el error más común al muestrear direcciones.
**Aplicaciones.** [3D] radiometría: irradiancia, intensidad y radiancia como densidades respecto del área y del ángulo sólido, con sus unidades fotométricas (lux, candelas y nits) · [Física] centros de masa y momentos de inercia · [Datos] densidades conjuntas (aviso de VIII.2).
**Lecturas.** Munkres, *Analysis on Manifolds*; Marsden y Tromba, *Vector Calculus*.

#### IV.10 Integrales de línea y de superficie
*40 págs. · Requiere: IV.9 · Núcleo*
- Curvas parametrizadas, longitud de arco e integrales de línea.
- Campos vectoriales, trabajo y campos conservativos; potencial.
- Superficies parametrizadas, área e integrales de superficie.
- Flujo de un campo a través de una superficie.

**Puente.** Entrada: `area += 0.5 * length(cross(b - a, c - a))` sobre los triángulos de una malla. Es la integral de superficie de la función 1 discretizada: el producto vectorial es el elemento de área de la parametrización.
**Aplicaciones.** [Física] trabajo y circulación · [3D] área de mallas y flujo a través de superficies · [Ing] caudal a través de una sección.
**Lecturas.** Marsden y Tromba, *Vector Calculus*; Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*.

#### IV.11 Teoremas integrales del cálculo vectorial
*44 págs. · Requiere: IV.10 · Núcleo*
- Divergencia, rotacional y laplaciano.
- Teoremas de Green, de Stokes y de la divergencia.
- Identidades vectoriales; potenciales escalares y vectoriales.
- Descomposición de Helmholtz–Hodge en ℝ³.

**Puente.** Entrada: `volume += dot(a, cross(b, c)) / 6.0` sobre los triángulos de una malla cerrada. El volumen, la masa, el centroide y el tensor de inercia de un sólido se calculan solo con su borde: es el teorema de la divergencia.
**Aplicaciones.** [3D] masa, centroide e inercia exactos de mallas · [Física] ecuaciones de Maxwell en forma integral · [Ing] conservación de la masa en fluidos.
**Lecturas.** Marsden y Tromba, *Vector Calculus*; Mirtich, «Fast and Accurate Computation of Polyhedral Mass Properties».

#### IV.12 Coordenadas curvilíneas y cálculo tensorial en ℝⁿ
*40 págs. · Requiere: IV.11, II.11 · Núcleo*
- Coordenadas curvilíneas, base coordenada y factores de escala; coordenadas ortogonales.
- El tensor métrico en coordenadas; símbolos de Christoffel en el espacio euclídeo.
- Gradiente, divergencia, rotacional y laplaciano en coordenadas curvilíneas, deducidos de forma intrínseca.
- Derivada covariante de campos vectoriales y tensoriales en ℝⁿ.

**Puente.** Entrada: el laplaciano en esféricas tal como aparece en un libro de física, (1/r²) ∂_r(r² ∂_r f) + … . No es una fórmula para memorizar: sale de la métrica en esféricas, y los factores r² y sen θ vienen de la raíz del determinante del tensor métrico. El capítulo también traduce entre la convención de la física (θ polar) y la de muchos textos de cálculo (θ azimutal).
**Aplicaciones.** [Física] electromagnetismo y potenciales en geometrías esféricas y cilíndricas · [Ing] elasticidad en tubos y recipientes a presión · [3D] simulación sobre la superficie de un planeta en coordenadas esféricas.
**Lecturas.** Marsden y Tromba, *Vector Calculus*; Arfken, Weber y Harris, *Mathematical Methods for Physicists*.

#### IV.13 Formas diferenciales y teorema de Stokes general
*44 págs. · Requiere: IV.11, II.4 · Complementario*
- Álgebra exterior: producto exterior; bivectores y trivectores como áreas y volúmenes orientados.
- Formas diferenciales en ℝⁿ, derivada exterior y *pullback*.
- Integración de formas y teorema de Stokes general; Green, Stokes y Gauss como casos particulares.
- Formas cerradas y exactas; lema de Poincaré. Para seguir: álgebra geométrica y PGA.

**Puente.** Entrada: `cross(a, b)` en ℝ³ frente a `a ^ b` en una biblioteca de álgebra geométrica. El producto vectorial es un bivector disfrazado de vector, y por eso solo existe en dimensión 3; el álgebra exterior lo generaliza a cualquier dimensión.
**Aplicaciones.** [Física] electromagnetismo con formas diferenciales · [3D] áreas orientadas y álgebra geométrica · [Ing] termodinámica: diferenciales exactas e inexactas.
**Lecturas.** Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*; Spivak, *Calculus on Manifolds*.

### Tomo V — Geometría

*Requiere: Tomos II, III y IV · 14 capítulos.* Las geometrías clásicas como estudio de grupos de transformaciones, las curvas y superficies de diseño, la geometría diferencial clásica y la geometría computacional y discreta. V.1, V.2, V.3 y V.5 solo usan los Tomos II y III, así que se pueden leer justo después del álgebra lineal.

**Parte A — Geometrías y grupos de transformaciones**

#### V.1 Isometrías y simetría
*40 págs. · Requiere: II.15, I.7 · Núcleo*
- Las isometrías de ℝⁿ son afines; clasificación en el plano y en el espacio.
- Todo movimiento es producto de reflexiones.
- Grupos de simetría finitos: cíclicos, diédricos y de los poliedros regulares.
- Grupos de friso y grupos cristalográficos del plano.

**Puente.** Entrada: `scale(-1, 1, 1)` en un editor que «da vuelta» las normales de un modelo. Una reflexión invierte la orientación (determinante −1); la clasificación de las isometrías explica qué se puede componer y qué no.
**Aplicaciones.** [3D] teselaciones, simetrías de modelos, espejos y orientación · [Física] cristalografía · [Bio/Eco] simetrías de virus y de moléculas.
**Lecturas.** Coxeter, *Introduction to Geometry*; Armstrong, *Groups and Symmetry*.

#### V.2 Geometría proyectiva
*44 págs. · Requiere: II.13 · Núcleo*
- Plano y espacio proyectivos; coordenadas homogéneas y puntos del infinito.
- Dualidad punto–recta; transformaciones proyectivas y su teorema fundamental.
- Razón doble y su invariancia.
- Cónicas proyectivas; teoremas de Desargues y de Pappus.

**Puente.** Entrada: `vec3 line = cross(p, q)` con puntos en coordenadas homogéneas. En el plano proyectivo, la recta por dos puntos y el punto de corte de dos rectas son el mismo producto vectorial: dualidad sin casos especiales, incluidas las rectas paralelas.
**Aplicaciones.** [3D] intersecciones robustas en coordenadas homogéneas · [Datos] visión por computador: rectificación de fotografías · [Ing] fotogrametría y topografía.
**Lecturas.** Richter-Gebert, *Perspectives on Projective Geometry*; Coxeter, *Projective Geometry*.

#### V.3 Cámaras, proyección y geometría de varias vistas
*44 págs. · Requiere: V.2, II.10, II.16 · Núcleo*
- Cámara estenopeica; matrices de proyección en perspectiva y ortográfica; volumen de visión.
- Coordenadas de recorte y normalizadas; distribución de la profundidad y su precisión en coma flotante.
- Rasterización: funciones de arista como determinantes, coordenadas baricéntricas e interpolación con corrección de perspectiva.
- Homografías, geometría epipolar y matriz fundamental; calibración por DLT.

**Puente.** Entrada: `gl_Position = proj * view * model * vec4(p, 1.0)`, seguido de la división por w. Es una cadena de cambios de marco afines (II.13) y una transformación proyectiva; Reverse-Z funciona porque la coma flotante es más densa cerca de 0, justo donde la proyección comprime la profundidad lejana.
**Aplicaciones.** [3D] *pipeline* de cámara, Reverse-Z, *frustum culling* y mapas de sombras · [Datos] reconstrucción 3D a partir de fotografías · [Ing] calibración de cámaras industriales.
**Lecturas.** Hartley y Zisserman, *Multiple View Geometry in Computer Vision*; Lengyel, *Foundations of Game Engine Development*, vol. 2.

#### V.4 Grupos de Lie de matrices
*48 págs. · Requiere: II.15, III.8, IV.3 · Núcleo*
- Grupos de matrices como subvariedades: SO(n), SE(n) y SU(2); álgebras de Lie y corchete.
- Exponencial y logaritmo de matrices; fórmula de Baker–Campbell–Hausdorff (enunciado).
- SU(2) → SO(3) como recubrimiento doble; interpolación y promedios en grupos.
- SE(3), teorema de Chasles en el espacio, números duales y cuaterniones duales.

**Puente.** Entrada: `pose = exp(twist * t)` en una biblioteca de robótica. Interpolar un movimiento rígido es recorrer un subgrupo a un parámetro de SE(3); por eso interpolar matrices entrada por entrada deforma los objetos y la exponencial no.
**Aplicaciones.** [3D] *skinning* con cuaterniones duales y cinemática directa como producto de exponenciales · [Ing] robótica y estimación de estado · [Física] simetrías continuas (aviso de VI.7).
**Lecturas.** Stillwell, *Naive Lie Theory*; Hall, *Lie Groups, Lie Algebras, and Representations*; Lynch y Park, *Modern Robotics*.

**Parte B — Curvas y superficies de diseño**

#### V.5 Curvas y superficies de Bézier y B-splines
*48 págs. · Requiere: III.9, V.2 · Núcleo*
- Curvas de Bézier: algoritmo de De Casteljau, subdivisión, elevación de grado y propiedad de la envolvente convexa.
- B-splines: recurrencia de Cox–de Boor, vector de nodos y soporte local; Catmull–Rom.
- Continuidad paramétrica Cⁿ frente a continuidad geométrica Gⁿ.
- NURBS como proyección de curvas polinómicas en coordenadas homogéneas; superficies producto tensorial.

**Puente.** Entrada: `p = deCasteljau(controlPoints, t)` en un riel de cámara que acelera solo en las curvas. El parámetro t no es la longitud de arco; reparametrizar con la cuadratura y el método de Newton de III.10 da velocidad constante.
**Aplicaciones.** [3D] rieles de cámara, trayectorias y teselación de parches · [Ing] diseño asistido por computadora y tipografía digital · [Física] trayectorias suaves de partículas en simulaciones.
**Lecturas.** Farin, *Curves and Surfaces for CAGD*; Piegl y Tiller, *The NURBS Book*.

**Parte C — Geometría diferencial**

#### V.6 Curvas en el espacio
*36 págs. · Requiere: IV.2 · Núcleo*
- Curvas regulares y parametrización por longitud de arco.
- Curvatura, torsión y triedro de Frenet–Serret; teorema fundamental de las curvas.
- Marcos móviles y marcos de rotación mínima.
- Curvas planas: curvatura con signo e índice de rotación.

**Puente.** Entrada: un tubo generado a lo largo de una curva que se retuerce en los puntos de inflexión. El triedro de Frenet no está definido donde la curvatura se anula; los marcos de rotación mínima evitan el problema.
**Aplicaciones.** [3D] tubos, cuerdas y rieles de cámara sin giros bruscos · [Ing] trazado de carreteras y vías con clotoides · [Bio/Eco] geometría del ADN.
**Lecturas.** do Carmo, *Differential Geometry of Curves and Surfaces*; Pressley, *Elementary Differential Geometry*.

#### V.7 Superficies: formas fundamentales y curvatura
*48 págs. · Requiere: IV.3, V.6 · Núcleo*
- Superficies regulares, plano tangente y primera forma fundamental; longitudes y áreas.
- Aplicación de Gauss y segunda forma fundamental.
- Curvaturas normal, principales, gaussiana y media; líneas de curvatura.
- Marcos tangentes en superficies parametrizadas.

**Puente.** Entrada: la matriz TBN (tangente, bitangente, normal) de un *normal map*. Es un marco del plano tangente de la superficie parametrizada por sus coordenadas de textura; la convención MikkTSpace fija cómo calcularlo para que la herramienta que genera el mapa y el motor coincidan.
**Aplicaciones.** [3D] *normal mapping* y espacio tangente · [Ing] curvatura de carrocerías y control de reflejos · [Física] membranas y tensión superficial.
**Lecturas.** do Carmo, *Differential Geometry of Curves and Surfaces*; Pressley, *Elementary Differential Geometry*.

#### V.8 Geometría intrínseca y Gauss–Bonnet
*44 págs. · Requiere: V.7, IV.11, I.6 · Núcleo*
- *Theorema egregium*: la curvatura gaussiana es intrínseca.
- Geodésicas y curvatura geodésica.
- Teorema de Gauss–Bonnet local y global; característica de Euler.
- Por qué no existe un mapa plano perfecto de la esfera. Las variedades y la geometría riemanniana llegan en X.4 y X.5.

**Puente.** Entrada: una textura que se estira en los polos de una esfera. Ninguna parametrización plana de la esfera conserva distancias, porque lo prohíbe el *theorema egregium*; elegir entre la proyección equirectangular, la cúbica o la octaédrica es elegir qué distorsión aceptar.
**Aplicaciones.** [3D] parametrizaciones de la esfera para texturas y mapas de entorno · [Ing] cartografía y proyecciones de mapas · [Física] superficies curvas y relatividad (aviso).
**Lecturas.** do Carmo, *Differential Geometry of Curves and Surfaces*; Needham, *Visual Differential Geometry and Forms*.

**Parte D — Geometría computacional y discreta**

#### V.9 Predicados geométricos e intersecciones
*40 págs. · Requiere: II.4, II.16, III.10 · Núcleo*
- Predicados de orientación y de círculo circunscrito (*incircle*) como signos de determinantes.
- Fallos en coma flotante; aritmética exacta y predicados adaptativos.
- Intersecciones rayo–plano, rayo–esfera, rayo–caja y rayo–triángulo (Möller–Trumbore como regla de Cramer); rayo contra superficies algebraicas de grado alto.
- Puntos más cercanos: punto–triángulo, segmento–segmento y punto–caja.

**Puente.** Entrada: `if (abs(det) < EPSILON) return NO_HIT;` en una intersección rayo–triángulo. Es la regla de Cramer con una protección contra determinantes pequeños; los predicados adaptativos sustituyen ese épsilon arbitrario por una decisión exacta cuando hace falta.
**Aplicaciones.** [3D] selección con el ratón, *raycasts* y núcleo del trazado de rayos · [Ing] CAD robusto · [Datos] sistemas de información geográfica.
**Lecturas.** Ericson, *Real-Time Collision Detection*; Shewchuk, «Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates».

#### V.10 Convexidad computacional: envolventes, separación y distancia
*44 págs. · Requiere: V.9, IV.5 · Núcleo*
- Envolvente convexa en 2D y en 3D: algoritmos de Graham y Quickhull.
- Teorema de los ejes separadores para politopos, como corolario del teorema del hiperplano separador.
- Distancia entre convexos como problema convexo; algoritmo GJK sobre la diferencia de Minkowski y su convergencia.
- Profundidad de penetración (EPA) y avance conservador para el tiempo de impacto.

**Puente.** Entrada: el bucle principal de GJK, que solo llama a `support()`. Toda la geometría de los dos objetos entra por sus funciones de soporte; el algoritmo es un descenso sobre la diferencia de Minkowski que IV.5 justifica.
**Aplicaciones.** [3D] detección de colisiones, puntos de contacto y detección continua · [Ing] planificación de movimientos de robots · [Datos] clasificación lineal por separación.
**Lecturas.** de Berg, Cheong, van Kreveld y Overmars, *Computational Geometry*; van den Bergen, *Collision Detection in Interactive 3D Environments*; Gilbert, Johnson y Keerthi, «A Fast Procedure for Computing the Distance Between Complex Objects in Three-Dimensional Space».

#### V.11 Triangulaciones y diagramas de Voronoi
*40 págs. · Requiere: V.9, IV.9, I.6 · Núcleo*
- Triangulación de polígonos: existencia, recorte de orejas y descomposición monótona.
- Triangulación de Delaunay: círculo vacío, maximización del ángulo mínimo y volteo de aristas.
- Diagrama de Voronoi como dual de Delaunay.
- Teselaciones de Voronoi centroidales y algoritmo de Lloyd.

**Puente.** Entrada: una malla de navegación generada a partir del plano de un nivel. Es una triangulación del espacio libre: Delaunay evita triángulos degenerados, y su grafo dual se recorre con A\* (I.6).
**Aplicaciones.** [3D] mallas de navegación y terrenos · [Ing] mallado para elementos finitos · [Bio/Eco] modelos de territorio y de crecimiento celular.
**Lecturas.** de Berg, Cheong, van Kreveld y Overmars, *Computational Geometry*; Okabe, Boots, Sugihara y Chiu, *Spatial Tessellations*.

#### V.12 Mallas: topología y geometría discreta
*48 págs. · Requiere: V.8, II.12, I.6 · Núcleo*
- Complejos simpliciales, variedades con borde, orientabilidad, característica de Euler y género; la estructura *half-edge*.
- Normales de vértice, curvaturas discretas y Gauss–Bonnet discreto.
- Laplaciano cotangente y suavizado como difusión, explícito e implícito.
- Subdivisión de Catmull–Clark y de Loop con análisis espectral de la máscara; simplificación con métricas de error cuádrico; parametrización conforme por mínimos cuadrados. Para seguir: topología algebraica.

**Puente.** Entrada: `w = cot(alpha) + cot(beta)` en un código de suavizado de mallas. Son los pesos del laplaciano cotangente, la discretización del laplaciano de la superficie; el defecto angular alrededor de un vértice es la curvatura gaussiana discreta.
**Aplicaciones.** [3D] validación y reparación de mallas, niveles de detalle y desplegado UV · [Ing] mallas para simulación · [Bio/Eco] superficies de órganos en imágenes médicas.
**Lecturas.** Botsch, Kobbelt, Pauly, Alliez y Lévy, *Polygon Mesh Processing*; Crane, *Discrete Differential Geometry: An Applied Introduction*.

#### V.13 Superficies implícitas y campos de distancia
*36 págs. · Requiere: V.7, III.10 · Núcleo*
- Conjuntos de nivel y funciones de distancia con signo; ecuación eikonal |∇d| = 1.
- Constante de Lipschitz y *sphere tracing* como búsqueda de raíces con paso garantizado.
- Operaciones booleanas suaves y operadores de dominio.
- Extracción de mallas: Marching Cubes y sus ambigüedades.

**Puente.** Entrada: `t += sdf(origin + t * dir)`. Es *sphere tracing*: si la función tiene constante de Lipschitz 1, avanzar exactamente su valor nunca atraviesa la superficie.
**Aplicaciones.** [3D] *ray marching* y modelado con campos de distancia · [Ing] fabricación aditiva y trayectorias de herramientas · [Bio/Eco] reconstrucción de órganos a partir de tomografías.
**Lecturas.** Hart, «Sphere Tracing: A Geometric Method for the Antialiased Ray Tracing of Implicit Surfaces»; Osher y Fedkiw, *Level Set Methods and Dynamic Implicit Surfaces*.

#### V.14 Geometría integral y particiones del espacio
*40 págs. · Requiere: V.10, IV.9 · Complementario*
- Medida invariante en el espacio de rectas; fórmula de Cauchy–Crofton.
- Probabilidad de que una recta al azar corte un convexo: proporcional a su perímetro en el plano y a su área de superficie en el espacio.
- Particiones recursivas: árboles BSP, árboles k-d y *octrees*.
- Curvas que llenan el espacio (Peano, Hilbert y Morton): construcción, continuidad y localidad.

**Puente.** Entrada: `cost = Ct + (SA(L)/SA(P)) * N(L) * Ci + (SA(R)/SA(P)) * N(R) * Ci`. La heurística de área de superficie (SAH) usa cocientes de áreas como probabilidades: es la fórmula de Cauchy–Crofton aplicada a rayos al azar.
**Aplicaciones.** [3D] jerarquías de volúmenes envolventes y *hashing* espacial · [Datos] índices espaciales en bases de datos · [Física] estereología: estimar áreas y volúmenes a partir de cortes.
**Lecturas.** Santaló, *Integral Geometry and Geometric Probability*; Sagan, *Space-Filling Curves*.

### Tomo VI — Ecuaciones diferenciales, sistemas dinámicos y mecánica

*Requiere: Tomos II, III y IV; importa V.4 por interfaz · 12 capítulos.* Teoría de las ecuaciones diferenciales ordinarias y de los sistemas dinámicos, mecánica analítica y métodos numéricos. VI.1 a VI.3 solo usan los Tomos II y III.

**Parte A — Teoría**

#### VI.1 Ecuaciones de primer orden
*44 págs. · Requiere: III.11, III.8 · Núcleo*
- Modelado con ecuaciones diferenciales; campos de direcciones.
- Ecuaciones separables, lineales y exactas; factor integrante.
- Teorema de existencia y unicidad de Picard–Lindelöf, con el punto fijo de Banach.
- Dependencia continua de los datos y desigualdad de Grönwall.

**Puente.** Entrada: `transmittance *= exp(-sigma * stepLength)` en un efecto de niebla volumétrica. Es la solución exacta de la ecuación lineal T′ = −σT (ley de Beer–Lambert) en cada paso.
**Aplicaciones.** [3D] niebla y atenuación de Beer–Lambert · [Bio/Eco] crecimiento logístico y farmacocinética · [Física] ley de enfriamiento de Newton y desintegración radiactiva.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Arnold, *Ordinary Differential Equations*.

#### VI.2 Ecuaciones lineales de orden superior
*40 págs. · Requiere: VI.1, II.3 · Núcleo*
- Ecuaciones lineales de orden n y espacio de soluciones; wronskiano.
- Coeficientes constantes y ecuación característica.
- Oscilador armónico libre, amortiguado y forzado; resonancia.
- Variación de parámetros.

**Puente.** Entrada: `smoothDamp(x, target, v, smoothTime, dt)`, la función de seguimiento suave de muchos motores. Es un oscilador con amortiguamiento crítico resuelto en forma cerrada: llega al objetivo lo más rápido posible sin oscilar.
**Aplicaciones.** [3D] seguimiento de cámaras con amortiguamiento crítico · [Ing] circuitos RLC y suspensiones · [Física] resonancia en estructuras.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Boyce y DiPrima, *Elementary Differential Equations and Boundary Value Problems*.

#### VI.3 Sistemas lineales y exponencial de matrices
*44 págs. · Requiere: VI.2, II.7, III.6 · Núcleo*
- Sistemas x′ = Ax; exponencial de una matriz como serie y mediante la forma de Jordan.
- Matriz fundamental y sistemas no homogéneos.
- Estabilidad de los sistemas lineales según sus autovalores; retratos de fase en el plano.
- Sistemas lineales discretos x_{n+1} = A x_n.

**Puente.** Entrada: muelles acoplados que «explotan» al aumentar la rigidez. Los autovalores del sistema dicen qué modos oscilan y a qué frecuencia; la explosión aparece cuando el método numérico no respeta esa estructura (VI.10).
**Aplicaciones.** [Física] modos de vibración acoplados · [Ing] modelos en espacio de estados · [Bio/Eco] modelos compartimentales.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Perko, *Differential Equations and Dynamical Systems*.

#### VI.4 Sistemas no lineales y estabilidad
*48 págs. · Requiere: VI.3, IV.3 · Núcleo*
- Puntos de equilibrio y linealización; teorema de Hartman–Grobman (enunciado).
- Funciones de Lyapunov y estabilidad asintótica.
- Plano de fase, órbitas periódicas y ciclos límite.
- Teorema de Poincaré–Bendixson.

**Puente.** Entrada: un péndulo de juego que gana energía con el tiempo. El sistema continuo conserva la energía, que es una función de Lyapunov; que la simulación no la conserve es un defecto del integrador, no de la física.
**Aplicaciones.** [Bio/Eco] modelos depredador–presa de Lotka–Volterra y epidemias SIR · [Física] péndulo no lineal · [Ing] estabilidad de sistemas realimentados.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Strogatz, *Nonlinear Dynamics and Chaos*.

#### VI.5 Bifurcaciones y caos
*40 págs. · Requiere: VI.4 · Complementario*
- Bifurcaciones silla–nodo, transcrítica, de horquilla y de Hopf.
- Aplicación logística, duplicación de período y constante de Feigenbaum.
- Sensibilidad a las condiciones iniciales; sistema de Lorenz y atractores extraños.
- Exponentes de Lyapunov y su cálculo numérico.

**Puente.** Entrada: dos simulaciones con la misma semilla que divergen entre plataformas. Un sistema caótico amplifica exponencialmente las diferencias de redondeo: el determinismo exige aritmética idéntica, no solo el mismo código.
**Aplicaciones.** [Física] meteorología y el modelo de Lorenz · [Cripto] determinismo en juegos en red · [Bio/Eco] dinámica de poblaciones.
**Lecturas.** Strogatz, *Nonlinear Dynamics and Chaos*; Alligood, Sauer y Yorke, *Chaos: An Introduction to Dynamical Systems*.

#### VI.6 Sistemas con entrada: control y realimentación
*36 págs. · Requiere: VI.4 · Complementario*
- Sistemas de control lineales; controlabilidad y observabilidad (criterio de Kalman).
- Realimentación de estado y asignación de polos.
- Controladores PID y su análisis en el dominio del tiempo.
- Discretización de controladores.

**Puente.** Entrada: `force = kp * error + ki * integral + kd * derivative`. Un PID es un sistema realimentado cuyos polos se eligen con kp, ki y kd; la estabilidad del vehículo o de la cámara se decide con los autovalores de VI.3.
**Aplicaciones.** [Ing] control de motores y de drones · [3D] vehículos y personajes que siguen objetivos · [Bio/Eco] regulación de la glucosa.
**Lecturas.** Åström y Murray, *Feedback Systems*; Sontag, *Mathematical Control Theory*.

**Parte B — Mecánica**

#### VI.7 Cálculo de variaciones y mecánica lagrangiana
*48 págs. · Requiere: VI.4, IV.4 · Núcleo*
- Funcionales y ecuación de Euler–Lagrange; problema de la braquistócrona.
- Principio de mínima acción y coordenadas generalizadas.
- Restricciones holónomas con multiplicadores de Lagrange.
- Simetrías y cantidades conservadas: teorema de Noether.

**Puente.** Entrada: un *ragdoll* modelado como cuerpos unidos por «articulaciones». Cada articulación es una restricción holónoma y su fuerza es un multiplicador de Lagrange (IV.4); las coordenadas reducidas y las maximales son dos formas de escribir el mismo lagrangiano.
**Aplicaciones.** [3D] articulaciones y *ragdolls* · [Física] mecánica clásica y principio de Fermat en óptica · [Ing] trayectorias óptimas.
**Lecturas.** Arnold, *Mathematical Methods of Classical Mechanics*; Goldstein, Poole y Safko, *Classical Mechanics*; Gelfand y Fomin, *Calculus of Variations*.

#### VI.8 Mecánica hamiltoniana
*44 págs. · Requiere: VI.7 · Núcleo*
- Transformada de Legendre y ecuaciones de Hamilton.
- Espacio de fases y teorema de Liouville.
- Estructura simpléctica en forma matricial; transformaciones canónicas.
- Corchetes de Poisson e integrales primeras; su relación con los conmutadores de la mecánica cuántica (aviso de X.8).
- Ecuación de Hamilton–Jacobi, variables de acción–ángulo y sistemas integrables.

**Puente.** Entrada: el gráfico de energía de una simulación que deriva lentamente. El flujo hamiltoniano conserva el volumen en el espacio de fases, y los integradores que respetan esa estructura (VI.11) no derivan.
**Aplicaciones.** [Física] órbitas planetarias y dinámica molecular · [3D] simulación estable a largo plazo · [Datos] Monte Carlo hamiltoniano (aviso de VIII.8).
**Lecturas.** Arnold, *Mathematical Methods of Classical Mechanics*; José y Saletan, *Classical Dynamics: A Contemporary Approach*.

#### VI.9 Dinámica del sólido rígido
*44 págs. · Requiere: VI.7, II.15, V.4 · Núcleo*
- Sistemas de partículas: momento lineal y momento angular.
- Tensor de inercia, teorema de Steiner y ejes principales.
- Ecuaciones de Euler y término giroscópico; estabilidad de la rotación en torno a los ejes principales (teorema de la raqueta de tenis).
- La orientación como curva en SO(3) y su descripción con cuaterniones.

**Puente.** Entrada: `w += inverse(I) * (torque - cross(w, I * w)) * dt`. El término `cross(w, I * w)` es el término giroscópico de las ecuaciones de Euler; omitirlo hace que las peonzas y los objetos alargados giren mal.
**Aplicaciones.** [3D] núcleo de un motor de cuerpos rígidos · [Ing] satélites y giróscopos · [Física] peonzas y precesión.
**Lecturas.** Goldstein, Poole y Safko, *Classical Mechanics*; Taylor, *Classical Mechanics*; Baraff, «An Introduction to Physically Based Modeling: Rigid Body Simulation».

**Parte C — Métodos numéricos**

#### VI.10 Métodos numéricos para ecuaciones diferenciales ordinarias
*48 págs. · Requiere: VI.3, III.10 · Núcleo*
- Euler explícito; error local y global; orden de convergencia.
- Métodos de Runge–Kutta y métodos multipaso.
- Regiones de estabilidad absoluta y ecuaciones rígidas.
- Métodos implícitos resueltos con Newton; control del paso.

**Puente.** Entrada: `while (accumulator >= dt) { step(dt); accumulator -= dt; }`, el bucle de paso fijo. Separar el paso de integración del de dibujo es una decisión de estabilidad: la región de estabilidad del método exige un dt acotado.
**Aplicaciones.** [3D] bucle de física con paso fijo · [Física] trayectorias balísticas y orbitales · [Bio/Eco] simulación de modelos epidemiológicos.
**Lecturas.** Hairer, Nørsett y Wanner, *Solving Ordinary Differential Equations I*; Iserles, *A First Course in the Numerical Analysis of Differential Equations*.

#### VI.11 Integración geométrica y restricciones
*40 págs. · Requiere: VI.10, VI.8, V.4 · Núcleo*
- Integradores simplécticos: Störmer–Verlet y Euler semi-implícito; conservación de una energía modificada (enunciado).
- Integradores en grupos de Lie para las rotaciones.
- Restricciones en la integración: proyección, SHAKE y RATTLE.
- Dinámica basada en posiciones (PBD y XPBD) como método de proyección.

**Puente.** Entrada: `v += a * dt; x += v * dt;` frente a `x += v * dt; v += a * dt;`. Cambiar el orden de dos líneas convierte un método que gana energía en uno simpléctico, que la conserva en promedio.
**Aplicaciones.** [3D] tela, cuerdas y cuerpos blandos con PBD y XPBD · [Física] dinámica molecular · [Ing] mecanismos con restricciones.
**Lecturas.** Hairer, Lubich y Wanner, *Geometric Numerical Integration*; Macklin, Müller y Chentanez, «XPBD: Position-Based Simulation of Compliant Constrained Dynamics».

#### VI.12 Contacto y complementariedad
*40 págs. · Requiere: VI.11, IV.7, II.12 · Núcleo*
- El contacto unilateral como problema de complementariedad lineal (LCP); existencia y unicidad.
- Fricción de Coulomb, cono de fricción y su aproximación poliédrica; coeficiente de restitución.
- Métodos de Gauss–Seidel y de Jacobi proyectados; convergencia.
- Los impulsos secuenciales como método iterativo proyectado.

**Puente.** Entrada: el bucle de iteraciones de un *solver* de contactos que acumula y recorta impulsos. Es Gauss–Seidel proyectado sobre un LCP, y el número de iteraciones decide si una pila de cajas se sostiene.
**Aplicaciones.** [3D] pilas de cajas estables y fricción · [Ing] robótica de manipulación · [Bio/Eco] modelos de equilibrio de mercado.
**Lecturas.** Cottle, Pang y Stone, *The Linear Complementarity Problem*; Stewart, «Rigid-Body Dynamics with Friction and Impact»; Erleben, Sporring, Henriksen y Dohlmann, *Physics-Based Animation*.

### Tomo VII — Medida, Fourier y variable compleja

*Requiere: Tomos III y IV · 13 capítulos.* La integral de Lebesgue y los espacios de funciones, el análisis de Fourier continuo y discreto, las distribuciones, la variable compleja con sus métodos asintóticos, y el análisis en la esfera.

**Parte A — Medida y espacios de funciones**

#### VII.1 Medida e integral de Lebesgue
*52 págs. · Requiere: IV.9 · Núcleo*
- σ-álgebras, medida exterior y medida de Lebesgue; existencia de conjuntos no medibles.
- Funciones medibles e integral de Lebesgue.
- Teoremas de la convergencia monótona y de la convergencia dominada; lema de Fatou.
- Medida producto y teorema de Fubini–Tonelli; comparación con la integral de Riemann.

**Puente.** Entrada: un estimador que promedia los valores de una función con infinitos saltos. La integral de Lebesgue es la que se puede intercambiar con límites sin sorpresas, y es el marco en el que la probabilidad (VIII.2) y Monte Carlo están bien definidos.
**Aplicaciones.** [Datos] esperanza de variables aleatorias (aviso de VIII.2) · [Física] distribuciones de masa y de carga · [Señales] energía de señales con discontinuidades.
**Lecturas.** Stein y Shakarchi, *Real Analysis*; Folland, *Real Analysis*.

#### VII.2 Espacios Lᵖ y espacios de Hilbert
*48 págs. · Requiere: VII.1, II.9 · Núcleo*
- Espacios Lᵖ, desigualdades de Hölder y de Minkowski; completitud (teorema de Riesz–Fischer).
- Espacios de Hilbert: proyección ortogonal, bases ortonormales e identidad de Parseval.
- Teorema de representación de Riesz.
- Operadores compactos autoadjuntos y su teorema espectral; operadores integrales y alternativa de Fredholm. Los operadores no acotados llegan en X.7.

**Puente.** Entrada: «proyectar» una señal sobre unas pocas funciones base para comprimirla. Es la proyección ortogonal de II.8 en un espacio de dimensión infinita, y la identidad de Parseval dice cuánta energía se pierde.
**Aplicaciones.** [Señales] compresión por truncamiento en una base · [Física] mecánica cuántica: estados como vectores de un espacio de Hilbert · [3D] iluminación con funciones base (aviso de VII.13).
**Lecturas.** Stein y Shakarchi, *Real Analysis*; Kreyszig, *Introductory Functional Analysis with Applications*.

**Parte B — Análisis de Fourier**

#### VII.3 Series de Fourier
*44 págs. · Requiere: VII.2, III.8 · Núcleo*
- Coeficientes de Fourier; núcleos de Dirichlet y de Fejér.
- Convergencia puntual (teorema de Dirichlet), sumabilidad de Cesàro y fenómeno de Gibbs.
- Convergencia en L² y completitud del sistema trigonométrico.
- Suavidad de una función y decaimiento de sus coeficientes.

**Puente.** Entrada: un ecualizador gráfico de audio. Cada barra multiplica un rango de coeficientes de Fourier, y la suavidad de esa ganancia controla los artefactos (Gibbs) que aparecen en el tiempo.
**Aplicaciones.** [Señales] síntesis y análisis de audio · [Física] cuerdas vibrantes y conducción del calor · [3D] formas de onda para animación procedural.
**Lecturas.** Stein y Shakarchi, *Fourier Analysis*; Körner, *Fourier Analysis*.

#### VII.4 Transformada de Fourier
*48 págs. · Requiere: VII.3 · Núcleo*
- Transformada en L¹; lema de Riemann–Lebesgue; fórmula de inversión.
- Teorema de Plancherel en L².
- Convolución y teorema de convolución; aproximaciones de la identidad.
- Principio de incertidumbre y gaussianas; la delta de Dirac como límite de gaussianas (VII.5 la formaliza).

**Puente.** Entrada: un desenfoque gaussiano separable, `blurX(blurY(image))`. Convolucionar con una gaussiana 2D equivale a convolucionar dos veces con gaussianas 1D porque la gaussiana es un producto de funciones de cada coordenada; en frecuencia es un filtro pasabajos.
**Aplicaciones.** [3D] desenfoque y *bloom* · [Señales] filtros y respuesta en frecuencia · [Física] óptica de Fourier y difracción · [Bio/Eco] resonancia magnética.
**Lecturas.** Stein y Shakarchi, *Fourier Analysis*; Folland, *Fourier Analysis and Its Applications*.

#### VII.5 Distribuciones
*40 págs. · Requiere: VII.4 · Núcleo*
- Funciones de prueba y distribuciones; la delta de Dirac y sus derivadas.
- Derivada distribucional, producto por funciones suaves y convergencia de distribuciones.
- Distribuciones temperadas y su transformada de Fourier.
- Valor principal, fórmula de Sokhotski–Plemelj y soluciones fundamentales.

**Puente.** Entrada: `∫ δ(x) f(x) dx = f(0)` y `1/(x − iε) → P(1/x) + iπ δ(x)` en un libro de física. Ninguna función cumple la primera igualdad; las distribuciones la convierten en una definición rigurosa y dicen cuándo es legítimo manipular la delta como si fuera una función y cuándo no: su cuadrado, por ejemplo, no tiene sentido.
**Aplicaciones.** [Física] cargas puntuales, densidades singulares y propagadores · [Señales] el impulso unitario y la respuesta al impulso de un sistema lineal · [Ing] fuerzas concentradas en vigas.
**Lecturas.** Strichartz, *A Guide to Distribution Theory and Fourier Transforms*; Friedlander y Joshi, *Introduction to the Theory of Distributions*.

#### VII.6 Muestreo y transformada discreta
*48 págs. · Requiere: VII.4, II.12 · Núcleo*
- Teorema de Nyquist–Shannon y origen del *aliasing*.
- Filtros de reconstrucción: caja, tienda, Mitchell–Netravali y Lanczos.
- Transformada discreta de Fourier, FFT de Cooley–Tukey y convolución circular; transformada del coseno.
- Muestreo en 2D, huella anisotrópica de un píxel y muestreo temporal.

**Puente.** Entrada: `textureSampleLevel(tex, samp, uv, lod)` con `lod = log2(footprint)`. Los *mipmaps* son versiones prefiltradas de la textura para no muestrear por debajo de la frecuencia de Nyquist, y el nivel se elige con el tamaño de la huella del píxel (IV.2).
**Aplicaciones.** [3D] *mipmapping*, filtrado anisotrópico, *supersampling* y TAA · [Señales] audio digital y JPEG · [Ing] adquisición de datos.
**Lecturas.** Oppenheim y Schafer, *Discrete-Time Signal Processing*; Heckbert, *Fundamentals of Texture Mapping and Image Warping*.

#### VII.7 Ondículas y análisis tiempo–frecuencia
*40 págs. · Requiere: VII.6 · Complementario*
- Transformada de Fourier de tiempo corto y espectrogramas.
- Análisis de multirresolución; ondícula de Haar.
- Ondículas de soporte compacto de Daubechies.
- Transformada rápida de ondículas.

**Puente.** Entrada: el tamaño de ventana de un espectrograma en una herramienta de audio. Elegirlo es elegir entre resolución en el tiempo y resolución en frecuencia: el principio de incertidumbre (VII.4) en acción.
**Aplicaciones.** [Señales] JPEG 2000 y eliminación de ruido · [Bio/Eco] análisis de electrocardiogramas · [3D] compresión de texturas y de geometría por niveles.
**Lecturas.** Mallat, *A Wavelet Tour of Signal Processing*; Daubechies, *Ten Lectures on Wavelets*.

**Parte C — Variable compleja**

#### VII.8 Funciones holomorfas
*40 págs. · Requiere: IV.10, III.8 · Núcleo*
- Derivada compleja y ecuaciones de Cauchy–Riemann.
- Funciones elementales complejas; ramas del logaritmo.
- Series de potencias complejas.
- Integrales de contorno.

**Puente.** Entrada: `atan2(y, x)` y su salto en ±π. Es el argumento de un número complejo: el salto es un corte de rama del logaritmo, y «desenrollar» ángulos en una animación es cambiar de rama.
**Aplicaciones.** [3D] desenrollado de ángulos y conjunto de Mandelbrot · [Ing] diagramas de Bode · [Física] flujo potencial en el plano.
**Lecturas.** Ahlfors, *Complex Analysis*; Needham, *Visual Complex Analysis*.

#### VII.9 Teoría de Cauchy y residuos
*52 págs. · Requiere: VII.8 · Núcleo*
- Teorema y fórmula integral de Cauchy; analiticidad de las funciones holomorfas.
- Teorema de Liouville y teorema fundamental del álgebra; principio del módulo máximo.
- Series de Laurent y clasificación de las singularidades.
- Teorema de los residuos y cálculo de integrales reales; principio del argumento.

**Puente.** Entrada: un buscador de raíces de polinomios que cuenta cuántas hay dentro de un círculo. El principio del argumento cuenta ceros con una integral de contorno y es la base de los métodos robustos para localizar raíces.
**Aplicaciones.** [Ing] criterio de estabilidad de Nyquist · [Física] relaciones de Kramers–Kronig entre causalidad y analiticidad; integrales en óptica · [Señales] diseño de filtros.
**Lecturas.** Ahlfors, *Complex Analysis*; Stein y Shakarchi, *Complex Analysis*.

#### VII.10 Métodos asintóticos
*40 págs. · Requiere: VII.9 · Complementario*
- Series asintóticas y su diferencia con las series convergentes; lema de Watson.
- Método de Laplace y fórmula de Stirling.
- Fase estacionaria y método del punto de silla (descenso más rápido).
- Comportamiento asintótico de integrales y de funciones especiales.

**Puente.** Entrada: `log(n!) ≈ n * log(n) - n` en un cálculo de entropía. Es la aproximación de Stirling truncada; el método de Laplace la deduce, da el término siguiente, ½·log(2πn), y dice cuánto error se comete para cada n.
**Aplicaciones.** [Física] funciones de partición en mecánica estadística y óptica de la difracción · [Datos] aproximación de Laplace en inferencia bayesiana · [Señales] análisis de señales moduladas en frecuencia por fase estacionaria.
**Lecturas.** Bender y Orszag, *Advanced Mathematical Methods for Scientists and Engineers*; de Bruijn, *Asymptotic Methods in Analysis*.

#### VII.11 Aplicaciones conformes y funciones armónicas
*40 págs. · Requiere: VII.9 · Complementario*
- Conformidad y transformaciones de Möbius.
- Teorema de la aplicación de Riemann (enunciado y discusión).
- Funciones armónicas, principio del máximo y problema de Dirichlet en el disco.
- Transformación de Joukowski y transformación de Schwarz–Christoffel (introducción).

**Puente.** Entrada: una parametrización UV que conserva los ángulos de la textura. Conservar ángulos es ser conforme; en dimensión 2 eso equivale a ser holomorfa, y por eso las parametrizaciones conformes de mallas (V.12) se escriben con números complejos.
**Aplicaciones.** [Física] perfil alar de Joukowski y flujo potencial · [3D] parametrizaciones conformes · [Ing] campos electrostáticos en el plano.
**Lecturas.** Needham, *Visual Complex Analysis*; Ahlfors, *Complex Analysis*.

#### VII.12 Transformadas de Laplace y z
*40 págs. · Requiere: VII.9, VII.4 · Núcleo*
- Transformada de Laplace, propiedades e inversión por residuos.
- Resolución de ecuaciones diferenciales lineales; función de transferencia y estabilidad.
- Transformada z y sistemas discretos.
- Filtros digitales FIR e IIR.

**Puente.** Entrada: `y = a * y + (1.0 - a) * x` como filtro de suavizado. Es un filtro IIR de un polo: su transformada z dice cómo atenúa cada frecuencia y por qué introduce retardo.
**Aplicaciones.** [Señales] filtros de audio · [Ing] análisis de sistemas de control · [3D] filtrado de las entradas del ratón y del mando.
**Lecturas.** Oppenheim y Willsky, *Signals and Systems*; Oppenheim y Schafer, *Discrete-Time Signal Processing*.

**Parte D — Análisis en la esfera**

#### VII.13 Armónicos esféricos
*44 págs. · Requiere: VII.3, IV.11, II.15 · Núcleo*
- Laplaciano en la esfera; polinomios armónicos homogéneos.
- Polinomios de Legendre y armónicos esféricos como base ortonormal de L²(S²).
- Rotación de coeficientes: la acción de SO(3) sobre cada banda.
- Teorema de Funk–Hecke y convolución sobre la esfera. X.2 los estudia como representaciones de SO(3).

**Puente.** Entrada: `irradiance = dot(shCoeffs, shBasis(normal))` con nueve coeficientes. Tres bandas de armónicos esféricos bastan para la iluminación difusa porque la convolución con el coseno truncado (Funk–Hecke) atenúa casi a cero las bandas altas.
**Aplicaciones.** [3D] iluminación difusa basada en imagen y sondas de luz · [Física] gravedad, geodesia y orbitales atómicos · [Señales] audio ambisónico.
**Lecturas.** Atkinson y Han, *Spherical Harmonics and Approximations on the Unit Sphere*; Ramamoorthi y Hanrahan, «An Efficient Representation for Irradiance Environment Maps».

### Tomo VIII — Probabilidad, estadística y métodos estocásticos

*Requiere: Tomos IV y VII · 14 capítulos.* Probabilidad con teoría de la medida, métodos de Monte Carlo, procesos estocásticos, estadística y teoría de la información.

**Parte A — Probabilidad**

#### VIII.1 Probabilidad discreta
*44 págs. · Requiere: I.5, III.2 · Núcleo*
- Espacios de probabilidad finitos y numerables; probabilidad condicional y teorema de Bayes.
- Independencia.
- Variables aleatorias discretas, esperanza y varianza.
- Distribuciones binomial, geométrica y de Poisson.

**Puente.** Entrada: `if (random() < dropChance) giveItem();` en una tabla de botín. Es una variable de Bernoulli; el número de intentos hasta conseguir el objeto sigue una distribución geométrica, que explica por qué los jugadores perciben «rachas».
**Aplicaciones.** [3D] tablas de botín y diseño de juegos · [Bio/Eco] pruebas diagnósticas y teorema de Bayes · [Cripto] probabilidad de colisión en tablas de dispersión.
**Lecturas.** Blitzstein y Hwang, *Introduction to Probability*; Ross, *A First Course in Probability*.

#### VIII.2 Probabilidad con medida
*44 págs. · Requiere: VIII.1, VII.1, IV.9 · Núcleo*
- Espacios de probabilidad generales; variables aleatorias como funciones medibles.
- Distribuciones, funciones de distribución y densidades.
- Esperanza como integral de Lebesgue.
- Cambio de variables en densidades con el jacobiano.

**Puente.** Entrada: `D = a2 / (PI * pow(NdotH * NdotH * (a2 - 1.0) + 1.0, 2.0))`, la distribución GGX de un material PBR. Es una densidad de probabilidad de las normales de las microfacetas, normalizada respecto del área proyectada; verla como densidad explica sus condiciones de normalización.
**Aplicaciones.** [3D] distribuciones de microfacetas en materiales PBR · [Física] distribución de velocidades de Maxwell–Boltzmann · [Datos] modelos de densidad.
**Lecturas.** Grimmett y Stirzaker, *Probability and Random Processes*; Williams, *Probability with Martingales*.

#### VIII.3 Vectores aleatorios
*44 págs. · Requiere: VIII.2, II.9 · Núcleo*
- Distribuciones conjuntas, marginales y condicionales; independencia.
- Covarianza y matriz de covarianza.
- Gaussiana multivariante y su factorización por Cholesky o por autovalores.
- Esperanza condicional.

**Puente.** Entrada: `sample = mean + L * randn3()` con `L = cholesky(Sigma)`. Transformar una gaussiana estándar con el factor de Cholesky da la covarianza deseada: es la forma cuadrática de II.9 aplicada al azar.
**Aplicaciones.** [3D] *Gaussian Splatting*: gaussianas anisótropas y su proyección en pantalla · [Datos] modelos gaussianos · [Ing] errores de medición correlacionados.
**Lecturas.** Grimmett y Stirzaker, *Probability and Random Processes*; Blitzstein y Hwang, *Introduction to Probability*.

#### VIII.4 Desigualdades y teoremas límite
*52 págs. · Requiere: VIII.3, VII.4 · Núcleo*
- Desigualdades de Markov, de Chebyshev, de Cantelli y de Chernoff.
- Modos de convergencia; leyes débil y fuerte de los grandes números.
- La función característica como transformada de Fourier; teorema de continuidad de Lévy.
- Teorema central del límite; cota de Berry–Esseen (enunciado).

**Puente.** Entrada: `pMax = variance / (variance + (t - mean) * (t - mean))` en las sombras por varianza. Es la desigualdad de Cantelli: una cota superior de la probabilidad de que la profundidad supere t, usada como visibilidad aproximada.
**Aplicaciones.** [3D] sombras por varianza (VSM) · [Datos] intervalos de confianza y tamaño de muestra · [Ing] control de calidad.
**Lecturas.** Durrett, *Probability: Theory and Examples*; Grimmett y Stirzaker, *Probability and Random Processes*.

**Parte B — Métodos estocásticos**

#### VIII.5 Generación de muestras
*36 págs. · Requiere: VIII.3, I.4 · Núcleo*
- Generadores pseudoaleatorios: período, calidad y pruebas estadísticas.
- Método de inversión y método de rechazo.
- Método alias de Walker y transformación de Box–Muller.
- Muestreo uniforme en el disco, la esfera y el hemisferio; muestreo proporcional al coseno.

**Puente.** Entrada: `d = vec3(sqrt(u1) * cos(2*PI*u2), sqrt(u1) * sin(2*PI*u2), sqrt(1.0 - u1))`. Es muestreo proporcional al coseno por el método de inversión; la raíz cuadrada aparece al invertir la distribución acumulada, y sin ella las muestras se amontonan.
**Aplicaciones.** [3D] muestreo de direcciones y de BRDF · [Física] simulación de partículas · [Datos] simulación y *bootstrap*.
**Lecturas.** Devroye, *Non-Uniform Random Variate Generation*; Owen, *Monte Carlo Theory, Methods and Examples*.

#### VIII.6 Integración de Monte Carlo
*44 págs. · Requiere: VIII.4, VIII.5 · Núcleo*
- Estimador de Monte Carlo: insesgadez, varianza y convergencia de orden 1/√N.
- Muestreo por importancia y muestreo múltiple por importancia (MIS).
- Estratificación, variables de control y ruleta rusa.
- Remuestreo por importancia y muestreo de reservorio.

**Puente.** Entrada: `color += f(x) / pdf(x)` en un bucle de muestras. Dividir por la densidad es lo que hace insesgado al estimador; elegir una densidad parecida a f reduce la varianza, y en eso consiste todo el muestreo por importancia.
**Aplicaciones.** [3D] oclusión ambiental, luces de área y remuestreo espaciotemporal (ReSTIR) · [Bio/Eco] valoración de opciones financieras · [Física] integrales en dimensión alta.
**Lecturas.** Owen, *Monte Carlo Theory, Methods and Examples*; Veach, *Robust Monte Carlo Methods for Light Transport Simulation*.

#### VIII.7 Cuasi-Monte Carlo
*36 págs. · Requiere: VIII.6 · Complementario*
- Discrepancia y desigualdad de Koksma–Hlawka.
- Inverso radical; secuencias de Halton y de Sobol; redes digitales.
- Cuasi-Monte Carlo aleatorizado: desplazamientos y mezclas de Owen.
- Cuándo y por qué supera a Monte Carlo.

**Puente.** Entrada: `jitter = vec2(halton(i % 8, 2), halton(i % 8, 3))` en el antialiasing temporal. Las secuencias de baja discrepancia cubren el píxel de forma pareja en pocos fotogramas, y Koksma–Hlawka cuantifica la ventaja.
**Aplicaciones.** [3D] desplazamientos del TAA y muestreo de píxeles · [Bio/Eco] finanzas computacionales · [Ing] diseño de experimentos.
**Lecturas.** Niederreiter, *Random Number Generation and Quasi-Monte Carlo Methods*; Dick y Pillichshammer, *Digital Nets and Sequences*.

#### VIII.8 Cadenas de Markov y MCMC
*48 págs. · Requiere: VIII.4, II.9 · Núcleo*
- Cadenas de Markov finitas: matrices estocásticas y clasificación de estados.
- Distribución estacionaria y teorema de Perron–Frobenius.
- Convergencia y tiempos de mezcla.
- Algoritmo de Metropolis–Hastings y muestreo de Gibbs.

**Puente.** Entrada: el vector de PageRank calculado por iteración de potencias. Es la distribución estacionaria de un paseo aleatorio por la web, y Perron–Frobenius garantiza que existe y es única gracias al factor de amortiguamiento.
**Aplicaciones.** [Datos] PageRank e inferencia bayesiana por MCMC · [3D] generación procedural con cadenas de Markov · [Física] modelo de Ising.
**Lecturas.** Levin y Peres, *Markov Chains and Mixing Times*; Norris, *Markov Chains*.

#### VIII.9 Procesos puntuales y campos aleatorios
*48 págs. · Requiere: VIII.6, VII.6 · Complementario*
- Procesos de Poisson espaciales y procesos con distancia mínima.
- Espectro de potencia de un conjunto de puntos; ruido azul.
- Campos aleatorios estacionarios y teorema de Wiener–Khinchin.
- Ruido de gradiente, movimiento browniano fraccionario y sumas fBm; exponente de Hurst.

**Puente.** Entrada: `h += amp * noise(p * freq); amp *= gain; freq *= 2.0;` repetido por octavas. Una suma fBm construye un campo con espectro de potencia en ley de potencias; la ganancia entre octavas fija el exponente de Hurst y, con él, la rugosidad del terreno.
**Aplicaciones.** [3D] terreno procedural, vegetación con disco de Poisson y *dithering* · [Física] superficies rugosas · [Bio/Eco] distribución espacial de árboles y de células.
**Lecturas.** Illian, Penttinen, Stoyan y Stoyan, *Statistical Analysis and Modelling of Spatial Point Patterns*; Lagae et al., «A Survey of Procedural Noise Functions».

#### VIII.10 Procesos en tiempo continuo: Poisson y browniano
*44 págs. · Requiere: VIII.4 · Núcleo*
- Proceso de Poisson temporal y tiempos de espera exponenciales.
- Paseo aleatorio y su límite; construcción del movimiento browniano.
- Propiedades del movimiento browniano: continuidad, no derivabilidad y propiedad de Markov.
- Martingalas en tiempo discreto (introducción); conexión con la ecuación del calor. Para seguir: cálculo de Itô.

**Puente.** Entrada: `nextSpawn = now - log(1.0 - random()) / rate`. Muestrear tiempos de espera exponenciales produce un proceso de Poisson: es la forma correcta de generar eventos «al azar» con una tasa dada.
**Aplicaciones.** [3D] aparición de eventos y partículas · [Ing] colas y tráfico en redes · [Física] difusión y movimiento browniano.
**Lecturas.** Durrett, *Probability: Theory and Examples*; Lawler, *Introduction to Stochastic Processes*.

#### VIII.11 Ecuaciones integrales y transporte
*48 págs. · Requiere: VIII.6, VII.2 · Complementario*
- Ecuaciones integrales de Fredholm de segunda especie; serie de Neumann y su convergencia.
- Solución por caminos aleatorios: estimadores de von Neumann–Ulam.
- La ecuación de renderizado: radiancia, BRDF (reciprocidad y conservación de la energía) y término geométrico; trazado de caminos con estimación de eventos siguientes.
- Medios participantes: ecuación de transferencia radiativa, funciones de fase y muestreo de distancias.

**Puente.** Entrada: `for (int b = 0; b < maxBounces; ++b) { ...; throughput *= brdf * cosTheta / pdf; }`. Cada rebote es un término de la serie de Neumann de la ecuación de renderizado, y la ruleta rusa permite cortar la serie sin introducir sesgo.
**Aplicaciones.** [3D] trazado de caminos, niebla volumétrica y atmósfera · [Física] transporte de neutrones y de radiación · [Ing] transferencia de calor por radiación.
**Lecturas.** Kress, *Linear Integral Equations*; Veach, *Robust Monte Carlo Methods for Light Transport Simulation*; Pharr, Jakob y Humphreys, *Physically Based Rendering*.

**Parte C — Estadística e información**

#### VIII.12 Inferencia estadística
*48 págs. · Requiere: VIII.4, II.8 · Núcleo*
- Estimadores: sesgo, varianza, consistencia y error cuadrático medio.
- Máxima verosimilitud y su comportamiento asintótico.
- Intervalos de confianza y contrastes de hipótesis.
- La regresión lineal como problema estadístico; *bootstrap*.

**Puente.** Entrada: el «milisegundos por fotograma» medido una sola vez antes y después de una optimización. Sin un intervalo de confianza no se puede afirmar que mejoró; la estadística convierte la medición de rendimiento en una afirmación con garantías.
**Aplicaciones.** [3D] medición de rendimiento y pruebas A/B en juegos · [Bio/Eco] ensayos clínicos · [Datos] regresión y validación de modelos.
**Lecturas.** Casella y Berger, *Statistical Inference*; Wasserman, *All of Statistics*.

#### VIII.13 Inferencia bayesiana y filtrado
*44 págs. · Requiere: VIII.12, VIII.3 · Núcleo*
- Distribuciones *a priori* y *a posteriori*; familias conjugadas.
- Estimación bayesiana y estimador MAP.
- Filtro de Kalman como inferencia gaussiana recursiva.
- Filtros de partículas.

**Puente.** Entrada: la posición de un jugador remoto estimada a partir de paquetes que llegan tarde o se pierden. Predecir y corregir con mediciones ruidosas es un filtro de Kalman: la mezcla óptima de predicción y medición según sus covarianzas.
**Aplicaciones.** [3D] predicción en juegos en red y seguimiento de controles de realidad virtual · [Ing] navegación y robótica · [Datos] modelos bayesianos.
**Lecturas.** Särkkä, *Bayesian Filtering and Smoothing*; Gelman et al., *Bayesian Data Analysis*.

#### VIII.14 Entropía e información
*40 págs. · Requiere: VIII.12, IV.4 · Núcleo*
- Entropía de Shannon, entropías conjunta y condicional, información mutua.
- Divergencia de Kullback–Leibler; la máxima verosimilitud como minimización de esa divergencia.
- Principio de máxima entropía con multiplicadores de Lagrange: la distribución de Gibbs.
- Teorema de codificación de la fuente; grandes desviaciones y teorema de Cramér.

**Puente.** Entrada: `loss = -sum(y * log(p))`, la entropía cruzada con la que se entrenan los clasificadores. Minimizarla es minimizar la divergencia de Kullback–Leibler entre los datos y el modelo; maximizar la entropía con las mismas herramientas da la distribución de Boltzmann de la física.
**Aplicaciones.** [Física] mecánica estadística: ensambles, función de partición y segunda ley · [Datos] entropía cruzada y selección de modelos · [Cripto] compresión sin pérdida y códigos de Huffman.
**Lecturas.** Cover y Thomas, *Elements of Information Theory*; MacKay, *Information Theory, Inference, and Learning Algorithms*.

### Tomo IX — Ecuaciones en derivadas parciales y medios continuos

*Requiere: Tomos VI y VII; importa VIII.9 por interfaz · 10 capítulos.* Teoría clásica y numérica de las ecuaciones en derivadas parciales, con las funciones especiales y los métodos de perturbaciones que nacen de ellas, y su aplicación a sólidos deformables y fluidos.

**Parte A — Teoría**

#### IX.1 Ecuaciones en derivadas parciales clásicas
*48 págs. · Requiere: IV.11, VI.4 · Núcleo*
- Clasificación de las ecuaciones de segundo orden.
- Ecuación de transporte y método de las características.
- Ecuaciones del calor, de onda y de Laplace–Poisson: derivación y fórmula de d'Alembert.
- Principio del máximo, energía y unicidad.

**Puente.** Entrada: `advect(field, velocity, dt)` en una simulación de humo. Transportar una magnitud con un campo de velocidades es resolver la ecuación de transporte, y sus características son las trayectorias de las partículas.
**Aplicaciones.** [3D] advección en humo y fluidos · [Física] conducción del calor y acústica · [Bio/Eco] difusión de sustancias en tejidos.
**Lecturas.** Evans, *Partial Differential Equations*; Strauss, *Partial Differential Equations: An Introduction*.

#### IX.2 Separación de variables y problemas de Sturm–Liouville
*44 págs. · Requiere: IX.1, VII.3 · Núcleo*
- Problemas de contorno y separación de variables.
- Problemas de Sturm–Liouville: autovalores, autofunciones y completitud.
- Separación en coordenadas polares y esféricas; primeras funciones de Bessel y de Legendre (IX.3 las estudia en general).
- Desarrollos en autofunciones para las ecuaciones del calor y de onda.

**Puente.** Entrada: el sonido de un tambor sintetizado como suma de modos. Los modos de una membrana circular son funciones de Bessel, y por eso un tambor no tiene armónicos enteros como una cuerda.
**Aplicaciones.** [Señales] síntesis modal de sonido · [Física] vibraciones de membranas · [3D] sonido procedural de impactos.
**Lecturas.** Strauss, *Partial Differential Equations: An Introduction*; Olver, *Introduction to Partial Differential Equations*.

#### IX.3 Funciones especiales y polinomios ortogonales
*48 págs. · Requiere: IX.2, VII.9 · Núcleo*
- Funciones Gamma y Beta; prolongación analítica de la función Gamma.
- Ecuaciones con puntos singulares regulares: método de Frobenius.
- Funciones de Bessel, polinomios y funciones asociadas de Legendre, polinomios de Hermite y de Laguerre: funciones generatrices, fórmulas de Rodrigues y recurrencias.
- Polinomios ortogonales en general: recurrencia de tres términos y cuadratura gaussiana; la función hipergeométrica como caso unificador.

**Puente.** Entrada: `scipy.special.jv(n, x)` y una tabla de ceros de Bessel en un libro de física. Las funciones especiales no son una colección de fórmulas: son las autofunciones que produce la separación de variables (IX.2), y su ortogonalidad, sus recurrencias y sus ceros salen de la teoría de Sturm–Liouville.
**Aplicaciones.** [Física] oscilador armónico cuántico (Hermite) y átomo de hidrógeno (Laguerre y Legendre) · [Señales] modulación en frecuencia y funciones de Bessel · [Ing] vibraciones de placas circulares y conducción del calor en cilindros.
**Lecturas.** Andrews, Askey y Roy, *Special Functions*; Lebedev, *Special Functions and Their Applications*; Olver et al., *NIST Handbook of Mathematical Functions*.

#### IX.4 Soluciones fundamentales y funciones de Green
*40 págs. · Requiere: IX.2, VII.5 · Núcleo*
- Transformada de Fourier para ecuaciones en todo el espacio.
- Núcleo del calor y solución fundamental de la ecuación de Laplace.
- Funciones de Green y representación de las soluciones.
- Potencial newtoniano.

**Puente.** Entrada: un desenfoque que «difunde» la imagen paso a paso. Aplicar la ecuación del calor durante un tiempo t es convolucionar con una gaussiana de varianza 2t: el núcleo del calor.
**Aplicaciones.** [3D] difusión en imágenes y edición de Poisson · [Física] gravitación y electrostática · [Bio/Eco] modelos de dispersión.
**Lecturas.** Evans, *Partial Differential Equations*; Olver, *Introduction to Partial Differential Equations*.

#### IX.5 Perturbaciones y aproximación WKB
*44 págs. · Requiere: IX.1, VII.10 · Complementario*
- Perturbaciones regulares de ecuaciones algebraicas y diferenciales.
- Perturbaciones singulares y capas límite; desarrollos asintóticos acoplados.
- Método de escalas múltiples y términos seculares.
- Aproximación WKB y fórmulas de conexión.

**Puente.** Entrada: un péndulo calculado con la aproximación de ángulo pequeño que, con amplitudes grandes, se adelanta respecto del real. El período depende de la amplitud; el método de escalas múltiples corrige la frecuencia y elimina el término secular que hace crecer el error con el tiempo.
**Aplicaciones.** [Física] mecánica cuántica semiclásica (WKB) y órbitas perturbadas · [Ing] capas límite en aerodinámica · [3D] péndulos y osciladores no lineales en animación.
**Lecturas.** Bender y Orszag, *Advanced Mathematical Methods for Scientists and Engineers*; Holmes, *Introduction to Perturbation Methods*.

**Parte B — Métodos numéricos**

#### IX.6 Diferencias finitas
*44 págs. · Requiere: IX.1, VI.10, VII.6 · Núcleo*
- Aproximaciones por diferencias y error de truncamiento.
- Consistencia, estabilidad y convergencia; teorema de equivalencia de Lax.
- Análisis de estabilidad de von Neumann y condición CFL.
- Ecuación de Poisson discreta y su resolución con gradiente conjugado y multigrid.

**Puente.** Entrada: `hNew[i] = 2*h[i] - hOld[i] + (c*dt/dx)*(c*dt/dx) * (h[i-1] - 2*h[i] + h[i+1])` en un estanque. Si c·dt/dx supera 1, la simulación explota: es la condición CFL, que el análisis de von Neumann deduce.
**Aplicaciones.** [3D] agua sobre campos de alturas y erosión de terrenos · [Física] propagación de ondas · [Ing] transferencia de calor en piezas.
**Lecturas.** LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*; Strikwerda, *Finite Difference Schemes and Partial Differential Equations*.

#### IX.7 Formulación débil y elementos finitos
*52 págs. · Requiere: IX.4, VII.2, II.12 · Núcleo*
- Espacios de Sobolev H¹ y trazas (introducción).
- Formulación débil y teorema de Lax–Milgram.
- Método de Galerkin; elementos lineales en triángulos y tetraedros; matrices de rigidez y de masa.
- Lema de Céa y estimaciones del error.

**Puente.** Entrada: el ensamblado `K[i][j] += area * dot(grad_i, grad_j)` triángulo por triángulo. Es la formulación débil discretizada, y para elementos lineales esa matriz coincide con el laplaciano cotangente de V.12.
**Aplicaciones.** [Ing] análisis estructural · [3D] sólidos deformables y relación con el laplaciano cotangente · [Física] electrostática en geometrías complejas.
**Lecturas.** Brenner y Scott, *The Mathematical Theory of Finite Element Methods*; Johnson, *Numerical Solution of Partial Differential Equations by the Finite Element Method*.

**Parte C — Medios continuos**

#### IX.8 Mecánica de medios continuos
*48 págs. · Requiere: IX.7, II.10 · Complementario*
- Gradiente de deformación; tensores de deformación de Green y de pequeñas deformaciones.
- Descomposición polar: rotación y estiramiento.
- Tensiones de Cauchy y de Piola; ecuación de equilibrio.
- Elasticidad lineal e hiperelasticidad: modelos de St. Venant–Kirchhoff, neo-hookeano y corrotacional.

**Puente.** Entrada: `F = Ds * inverse(Dm)` en un simulador de tetraedros. Es el gradiente de deformación de un elemento, la aplicación lineal que lleva la forma en reposo a la deformada; su descomposición polar separa la rotación, que no debe generar fuerza, del estiramiento.
**Aplicaciones.** [3D] cuerpos blandos y músculos · [Ing] resistencia de materiales · [Bio/Eco] biomecánica de tejidos.
**Lecturas.** Gonzalez y Stuart, *A First Course in Continuum Mechanics*; Bonet y Wood, *Nonlinear Continuum Mechanics for Finite Element Analysis*; Sifakis y Barbič, «FEM Simulation of 3D Deformable Solids».

#### IX.9 Mecánica de fluidos
*48 págs. · Requiere: IX.6, IV.11 · Núcleo*
- Derivada material y leyes de conservación de la masa y del momento.
- Ecuaciones de Euler y de Navier–Stokes incompresibles; vorticidad.
- Descomposición de Helmholtz–Hodge y proyección de la presión.
- Advección semilagrangiana y división de operadores.

**Puente.** Entrada: `velocity -= gradient(pressure)` tras resolver una ecuación de Poisson. Es la proyección de Helmholtz–Hodge (IV.11): quita al campo de velocidades su parte con divergencia, que es lo que hace incompresible al humo de *Stable Fluids*.
**Aplicaciones.** [3D] humo y fuego con *Stable Fluids* · [Ing] aerodinámica · [Física] meteorología.
**Lecturas.** Chorin y Marsden, *A Mathematical Introduction to Fluid Mechanics*; Bridson, *Fluid Simulation for Computer Graphics*; Stam, «Stable Fluids».

#### IX.10 Ondas en el agua, aguas someras y métodos de partículas
*44 págs. · Requiere: IX.9, VIII.9 · Complementario*
- Ondas de superficie y relación de dispersión.
- Ecuaciones de aguas someras.
- Espectros de oleaje y síntesis de océanos con la FFT.
- Hidrodinámica de partículas suavizadas (SPH): aproximación por núcleos, gradiente y laplaciano; flotabilidad.

**Puente.** Entrada: `omega = sqrt(g * k)` en un *shader* de océano. Es la relación de dispersión de las ondas en aguas profundas: las olas largas viajan más rápido, y eso hace que el océano sintetizado con la FFT parezca real.
**Aplicaciones.** [3D] océanos, ríos y barcos que flotan · [Física] maremotos y oleaje · [Ing] ingeniería costera.
**Lecturas.** Tessendorf, «Simulating Ocean Water»; Monaghan, «Smoothed Particle Hydrodynamics»; Vreugdenhil, *Numerical Methods for Shallow-Water Flow*.

### Tomo X — Simetría, variedades y operadores

*Requiere: Tomos V, VII y VIII; importa IX.3 por interfaz · 8 capítulos.* La matemática de la física moderna: representaciones de grupos, variedades y geometría del espacio-tiempo, y operadores en espacios de Hilbert. Es el cierre del itinerario de física, como el Tomo IX lo es del medio continuo. Sus capítulos son complementarios en el sentido de 5.3, porque nada del núcleo depende de ellos, pero son el centro del itinerario de física (9.6).

**Parte A — Simetría y representaciones**

#### X.1 Representaciones de grupos finitos
*44 págs. · Requiere: I.7, II.11, VII.6 · Complementario*
- Representaciones, subrepresentaciones, teorema de Maschke y lema de Schur.
- Caracteres y relaciones de ortogonalidad; tabla de caracteres.
- Descomposición de la representación regular; análisis de Fourier en un grupo finito, con la DFT como el caso del grupo cíclico.
- Producto tensorial de representaciones y reglas de selección.

**Puente.** Entrada: `X = np.fft.fft(x)`. La DFT descompone una señal en las representaciones irreducibles del grupo cíclico ℤ/nℤ; el capítulo hace lo mismo para cualquier grupo finito, que es lo que usa la química para clasificar las vibraciones de una molécula.
**Aplicaciones.** [Física] modos de vibración de moléculas y reglas de selección en espectroscopía · [Señales] la DFT como análisis armónico en ℤ/nℤ · [Datos] redes neuronales equivariantes respecto de grupos de simetría.
**Lecturas.** Serre, *Linear Representations of Finite Groups*; Sternberg, *Group Theory and Physics*.

#### X.2 SU(2), SO(3) y momento angular
*48 págs. · Requiere: X.1, V.4, VII.13 · Complementario*
- Representaciones de grupos de Lie compactos y de sus álgebras; medida de Haar (enunciado) y ortogonalidad.
- Representaciones irreducibles de su(2) mediante operadores escalera; pesos y espín.
- Producto tensorial de representaciones y coeficientes de Clebsch–Gordan.
- Los armónicos esféricos como representaciones irreducibles de SO(3); matrices D de Wigner. Para seguir: teorema de Peter–Weyl.

**Puente.** Entrada: `J± |j, m⟩ = ħ √(j(j+1) − m(m±1)) |j, m±1⟩` en un libro de mecánica cuántica. Es la construcción de las representaciones irreducibles de su(2) con operadores escalera: el «momento angular» de la física es teoría de representaciones, y el espín ½ es la representación de SU(2) que no baja a SO(3).
**Aplicaciones.** [Física] espín, acoplamiento de momentos angulares y estructura atómica · [3D] rotación de coeficientes de armónicos esféricos para iluminación · [Datos] redes equivariantes respecto de rotaciones en química computacional.
**Lecturas.** Hall, *Lie Groups, Lie Algebras, and Representations*; Sakurai y Napolitano, *Modern Quantum Mechanics*.

#### X.3 Espacio de Minkowski y grupo de Lorentz
*40 págs. · Requiere: II.9, V.4, X.2 · Complementario*
- Formas bilineales de signatura (1, 3) y espacio de Minkowski; vectores temporales, espaciales y nulos; cono de luz.
- Transformaciones de Lorentz, rapidez como ángulo hiperbólico y composición de velocidades.
- Tiempo propio, cuadrivectores y cinemática relativista.
- El grupo de Lorentz SO⁺(1, 3), su álgebra de Lie y el recubrimiento doble SL(2, ℂ) → SO⁺(1, 3); espinores (introducción). Para seguir: representaciones de grupos no compactos.

**Puente.** Entrada: `x' = gamma * (x - v * t)`, y una métrica escrita diag(−1, 1, 1, 1) en un texto y diag(1, −1, −1, −1) en otro. Una transformación de Lorentz es una isometría de una forma bilineal indefinida (ley de inercia de Sylvester, II.9), y las dos signaturas describen la misma geometría con el signo opuesto: el capítulo enseña a traducir entre ellas.
**Aplicaciones.** [Física] relatividad especial y cinemática de partículas · [Ing] corrección relativista de los relojes del GPS · [3D] visualización relativista: aberración de la luz y efecto Doppler.
**Lecturas.** Naber, *The Geometry of Minkowski Spacetime*; Taylor y Wheeler, *Spacetime Physics*.

**Parte B — Variedades y espacio-tiempo**

#### X.4 Variedades diferenciables
*48 págs. · Requiere: IV.3, IV.13, II.11 · Complementario*
- Variedades, cartas y atlas; aplicaciones diferenciables; subvariedades y teorema del valor regular.
- Espacio tangente y fibrado tangente; campos vectoriales, flujos y corchete de Lie.
- Campos tensoriales y formas diferenciales en variedades; derivada de Lie.
- Integración en variedades orientadas y teorema de Stokes.

**Puente.** Entrada: un optimizador de orientaciones que actualiza `q = normalize(q + dq)`. Sumar en ℝ⁴ y renormalizar es una retracción: la forma práctica de moverse por la variedad S³ sin salirse de ella. El capítulo da el marco general, espacios tangentes y retracciones, del que esa línea es un caso.
**Aplicaciones.** [Ing] espacios de configuración en robótica · [3D] optimización sobre SO(3) para cámaras y personajes · [Física] espacios de fases como variedades.
**Lecturas.** Lee, *Introduction to Smooth Manifolds*; Tu, *An Introduction to Manifolds*.

#### X.5 Geometría riemanniana
*48 págs. · Requiere: X.4, V.8, IV.12 · Complementario*
- Métricas riemannianas; longitud, distancia y volumen.
- Conexión de Levi-Civita, derivada covariante y transporte paralelo.
- Geodésicas y aplicación exponencial.
- Tensor de curvatura de Riemann, curvatura seccional, tensor de Ricci y curvatura escalar; el *theorema egregium* revisitado. Para seguir: fibrados y teorías gauge.

**Puente.** Entrada: `Γ^k_ij = ½ g^kl (∂_i g_jl + ∂_j g_il − ∂_l g_ij)` en un libro de relatividad. Los símbolos de Christoffel son los coeficientes de la conexión de Levi-Civita en coordenadas, y la fórmula se deduce de dos exigencias geométricas: que la conexión no tenga torsión y que conserve la métrica.
**Aplicaciones.** [3D] geodésicas y distancias sobre mallas con el método del calor · [Ing] navegación por círculos máximos · [Física] relatividad general (aviso de X.6).
**Lecturas.** do Carmo, *Riemannian Geometry*; Lee, *Introduction to Riemannian Manifolds*.

#### X.6 Geometría lorentziana y gravitación
*44 págs. · Requiere: X.5, X.3 · Complementario*
- Variedades lorentzianas; estructura causal; geodésicas temporales y nulas.
- Las ecuaciones de Einstein como ecuación geométrica; tensor de energía-impulso.
- Solución de Schwarzschild: órbitas, desviación de la luz y corrimiento al rojo gravitacional.
- Ondas gravitacionales linealizadas (introducción).

**Puente.** Entrada: un trazador de rayos que integra `d²x^μ/dλ² + Γ^μ_αβ (dx^α/dλ)(dx^β/dλ) = 0` para dibujar un agujero negro. Cada rayo es una geodésica nula de la métrica de Schwarzschild, y los anillos de luz alrededor del horizonte salen de resolver esa ecuación diferencial.
**Aplicaciones.** [3D] imágenes de agujeros negros y lentes gravitacionales con rayos curvos · [Ing] corrección gravitacional de los relojes del GPS · [Física] precesión del perihelio de Mercurio y ondas gravitacionales.
**Lecturas.** Carroll, *Spacetime and Geometry*; Wald, *General Relativity*.

**Parte C — Operadores y teoría cuántica**

#### X.7 Operadores en espacios de Hilbert
*48 págs. · Requiere: VII.2, VII.5, V.4 · Complementario*
- Operadores acotados y no acotados; dominio, clausura y adjunto.
- Operadores simétricos frente a autoadjuntos, y por qué la diferencia importa.
- Espectro puntual, continuo y residual; teorema espectral para operadores autoadjuntos (enunciado, con medidas espectrales).
- Grupos unitarios a un parámetro y teorema de Stone: los generadores autoadjuntos. Para seguir: análisis funcional general.

**Puente.** Entrada: `[x, p] = iħ`. Ningún par de matrices finitas lo cumple, porque la traza de un conmutador es 0 y la de iħ·I no lo es; la relación canónica exige operadores no acotados en dimensión infinita, y por eso los físicos necesitan algo más que el álgebra lineal del Tomo II.
**Aplicaciones.** [Física] observables de la mecánica cuántica · [Ing] operador de Koopman para analizar sistemas dinámicos no lineales · [Datos] operadores integrales y métodos de núcleos.
**Lecturas.** Hall, *Quantum Theory for Mathematicians*; Reed y Simon, *Methods of Modern Mathematical Physics*, vol. 1.

#### X.8 Estructura matemática de la mecánica cuántica
*52 págs. · Requiere: X.7, X.2, II.11, VIII.3, IX.3 · Complementario*
- Estados como rayos de un espacio de Hilbert, observables autoadjuntos y regla de Born como medida de probabilidad.
- Evolución unitaria y ecuación de Schrödinger; imágenes de Schrödinger y de Heisenberg; de los corchetes de Poisson a los conmutadores.
- Oscilador armónico con operadores escalera (funciones de Hermite) y átomo de hidrógeno (armónicos esféricos y polinomios de Laguerre).
- Sistemas compuestos: producto tensorial, entrelazamiento y matrices densidad. Para seguir: teoría cuántica de campos.

**Puente.** Entrada: `state = kron(q0, q1)` en un simulador de computación cuántica, y |ψ⟩ = (|00⟩ + |11⟩)/√2 en un libro. Un sistema de dos cúbits vive en el producto tensorial (II.11); un estado está entrelazado exactamente cuando no es un tensor descomponible, y esa es la propiedad que aprovecha la computación cuántica.
**Aplicaciones.** [Cripto] computación cuántica y distribución cuántica de claves · [Física] espectroscopía y estructura del átomo · [Bio/Eco] química cuántica de moléculas.
**Lecturas.** Hall, *Quantum Theory for Mathematicians*; Nielsen y Chuang, *Quantum Computation and Quantum Information*; Sakurai y Napolitano, *Modern Quantum Mechanics*.

<!-- /indice -->

## 14. Extensión

Calculada a partir de los metadatos del índice (sección 13) con el script de comprobación de la sección 11.5. Coincide con los números de capítulos de la sección 6.

| Tomo | Caps. | Págs. | Caps. de núcleo | Págs. de núcleo | Aplicaciones [3D] | Aplicaciones [Física] |
| --- | --- | --- | --- | --- | --- | --- |
| I | 10 | 428 | 10 | 428 | 10 de 34 (29 %) | 3 de 34 (9 %) |
| II | 16 | 632 | 16 | 632 | 15 de 52 (29 %) | 11 de 52 (21 %) |
| III | 11 | 484 | 11 | 484 | 10 de 33 (30 %) | 5 de 33 (15 %) |
| IV | 13 | 528 | 12 | 484 | 12 de 39 (31 %) | 7 de 39 (18 %) |
| V | 14 | 600 | 13 | 560 | 14 de 42 (33 %) | 6 de 42 (14 %) |
| VI | 12 | 516 | 10 | 440 | 9 de 36 (25 %) | 10 de 36 (28 %) |
| VII | 13 | 576 | 10 | 456 | 9 de 40 (22 %) | 10 de 40 (25 %) |
| VIII | 14 | 620 | 11 | 488 | 13 de 42 (31 %) | 8 de 42 (19 %) |
| IX | 10 | 460 | 7 | 324 | 9 de 30 (30 %) | 9 de 30 (30 %) |
| X | 8 | 372 | 0 | 0 | 5 de 24 (21 %) | 8 de 24 (33 %) |
| **Total** | **121** | **5.216** | **100** | **4.296** | **106 de 372 (28 %)** | **77 de 372 (21 %)** |

- Los capítulos tienen entre 28 y 52 páginas, con una media de 43,1.
- Cada tomo suma además unas 50 páginas de material propio: «Lo que este tomo importa», «Lo que este tomo exporta», notación y convenciones, diccionario academia–práctica del tomo, soluciones de los ejercicios impares e índice analítico. En total, unas 500 páginas, para unas 5.720 en toda la obra.
- El hilo 3D ocupa entre el 21 % y el 33 % de las aplicaciones de cada tomo, y el de física entre el 9 % y el 33 %: ninguno supera el límite de un tercio (9.2).
- El Tomo X no tiene capítulos de núcleo: todo él es complementario en el sentido de 5.3.

| Campo (9.1) | Aplicaciones | Proporción |
| --- | --- | --- |
| [3D] | 106 | 28 % |
| [Física] | 77 | 21 % |
| [Ing] | 73 | 20 % |
| [Datos] | 43 | 12 % |
| [Bio/Eco] | 35 | 9 % |
| [Señales] | 25 | 7 % |
| [Cripto] | 13 | 3 % |
| **Total** | **372** | **100 %** |

La ingeniería tiene casi tantas aplicaciones como la física sin ser un hilo fijo (2.1 y 17).

| Itinerario (9.6) | Caps. | Págs. de capítulos |
| --- | --- | --- |
| Núcleo | 100 | 4.296 |
| Física | 117 | 5.064 |
| Gráficos y 3D | 106 | 4.560 |
| Datos | 104 | 4.464 |

Los cuatro itinerarios están cerrados bajo dependencias: cada capítulo que incluyen tiene todos sus requisitos dentro del mismo itinerario. El de física abarca casi toda la obra, porque la física usa casi toda la matemática del índice; solo deja fuera V.14, VI.6, VII.7 y VIII.7.

El índice del motor sumaba 3.384 páginas, y la versión 0.1 de esta especificación, 4.536. La arista de la física añade 680 páginas: 224 entran en el núcleo, que pasa de 4.072 a 4.296, y el resto son complementarias, sobre todo el Tomo X.

## 15. Correspondencia con el índice anterior

Ningún tema del índice anterior se pierde sin decisión explícita. Esta tabla dice dónde queda cada uno de sus 76 capítulos.

| Cap. anterior | Tema | Dónde queda |
| --- | --- | --- |
| 1 | Lógica, conjuntos y demostración | I.1, I.2 |
| 2 | Álgebra elemental y funciones | Funciones en I.2; iteración y convergencia en III.1; exponenciales y logaritmos en III.8; el resto del precálculo se supone de la secundaria |
| 3 | Aritmética de punto flotante | I.10, II.16 |
| 4 | Geometría analítica cartesiana | Normas y distancias en II.8; rectas y planos en II.13; lateralidad como predicado en V.9 |
| 5 | Trigonometría y coordenadas curvilíneas | Trigonometría rigurosa y `atan2` en III.8; coordenadas curvilíneas en IV.9; cúbica trigonométrica en II.6; parametrizaciones de la esfera en V.8 |
| 6 | Números complejos | I.9, III.8, VII.8 |
| 7 | Aritmética modular, combinatoria y pseudoaleatorios | I.4, I.5, VIII.5 |
| 8 | Grafos, caminos mínimos y lenguajes formales | I.6; lenguajes formales y satisfacción de restricciones quedan fuera («Para seguir» en I.6) |
| 9 | Vectores, combinaciones lineales y bases | II.2 |
| 10 | Producto escalar, producto vectorial y geometría métrica | II.8; producto vectorial en II.4 |
| 11 | Matrices y transformaciones lineales | II.1, II.3; orden en memoria en II.14 |
| 12 | Sistemas lineales, rango y espacios fundamentales | II.1, II.3 |
| 13 | Determinantes, condicionamiento y métodos iterativos | II.4, II.12 |
| 14 | Autovalores, autovectores y teorema espectral | II.6, II.9 |
| 15 | SVD, mínimos cuadrados y descomposición polar | II.8, II.10 |
| 16 | Límites y derivadas | III.3, III.4; derivación numérica en III.10 |
| 17 | Integrales | III.5 |
| 18 | Series, Taylor y exponencial compleja | III.2, III.6, III.7, III.8; exponencial de matrices en VI.3 |
| 19 | Ecuaciones no lineales y raíces de polinomios | III.10; aplicación contractiva en III.11 |
| 20 | Cuadratura y aproximación de funciones | III.9, III.10 |
| 21 | Espacios afines y coordenadas homogéneas | II.13 |
| 22 | Geometría proyectiva y rasterización | V.2, V.3 |
| 23 | Rotaciones: matrices, eje y ángulo, ángulos de Euler | II.15 |
| 24 | Cuaterniones e interpolación de orientaciones | II.15 |
| 25 | Grupos de Lie y movimientos rígidos | V.4 |
| 26 | Álgebra exterior y PGA | Álgebra exterior en IV.13; PGA en «Para seguir» de IV.13 |
| 27 | Cálculo diferencial multivariable | IV.2 |
| 28 | Integración múltiple | IV.9 |
| 29 | Cálculo vectorial y teoremas integrales | IV.10, IV.11 |
| 30 | Optimización sin restricciones | IV.5, IV.8 |
| 31 | Diferenciación automática | IV.8 |
| 32 | Multiplicadores de Lagrange, KKT y dualidad | IV.4, IV.7 |
| 33 | Complementariedad y métodos iterativos proyectados | VI.12 |
| 34 | Álgebra lineal dispersa y métodos iterativos | II.12; gradiente conjugado en IV.8; multigrid en IX.6 |
| 35 | Series de Fourier y funciones ortogonales | VII.2, VII.3 |
| 36 | Transformada de Fourier, convolución y FFT | VII.4, VII.6 |
| 37 | Teoría del muestreo y reconstrucción | VII.6 |
| 38 | Armónicos esféricos | VII.13 |
| 39 | Curvas paramétricas: interpolación, Bézier y B-splines | III.9, V.5 |
| 40 | Superficies paramétricas y NURBS | V.5 |
| 41 | Geometría diferencial de curvas y superficies | V.6, V.7 |
| 42 | Topología y estructura de mallas | V.12 |
| 43 | Geometría diferencial discreta | V.12 |
| 44 | Procesamiento de mallas | V.12 |
| 45 | Superficies implícitas y campos de distancia | V.13 |
| 46 | Predicados robustos, consultas e intersecciones | V.9 |
| 47 | Conjuntos convexos y separación | IV.5, V.10 |
| 48 | Distancia entre convexos y tiempo de impacto | V.10 |
| 49 | Triangulaciones y diagramas de Voronoi | V.11 |
| 50 | Particiones del espacio, curvas de llenado y geometría integral | V.14 |
| 51 | EDO de primer y segundo orden | VI.1, VI.2 |
| 52 | Sistemas de EDO, estabilidad y control | VI.3, VI.4, VI.6 |
| 53 | Integradores explícitos y estabilidad | VI.10 |
| 54 | Integradores implícitos, simplécticos y en grupos de Lie | VI.10, VI.11 |
| 55 | Mecánica del sólido rígido | VI.9 |
| 56 | Cinemática de cadenas articuladas | Aplicaciones: cinemática directa y *skinning* en V.4; cinemática inversa en IV.8 |
| 57 | Mecánica lagrangiana y restricciones | VI.7, VI.11 |
| 58 | Contacto, fricción y métodos por posiciones | VI.11, VI.12 |
| 59 | EDP clásicas y separación de variables | IX.1, IX.2 |
| 60 | Diferencias finitas y estabilidad | IX.6 |
| 61 | Mecánica de medios continuos | IX.8 |
| 62 | Método de elementos finitos | IX.7 |
| 63 | Navier–Stokes y Helmholtz–Hodge | IV.11, IX.9 |
| 64 | Métodos de partículas y aguas someras | IX.10 |
| 65 | Probabilidad: variables aleatorias y distribuciones | VIII.1, VIII.2, VIII.4 |
| 66 | Distribuciones multivariantes y generación de muestras | VIII.3, VIII.5 |
| 67 | Monte Carlo y muestreo por importancia | VIII.6 |
| 68 | Cuasi-Monte Carlo y remuestreo | VIII.7; remuestreo en VIII.6 |
| 69 | Procesos puntuales y ruido azul | VIII.9 |
| 70 | Campos aleatorios, ruido procedural y fractales | VIII.9 |
| 71 | Radiometría y fotometría | Aplicaciones en IV.9 y VIII.11 |
| 72 | Colorimetría | Aplicaciones: espacios de color en II.3; codificación gamma en III.8 |
| 73 | La ecuación de renderizado | VIII.11 |
| 74 | BRDF y microfacetas | Aplicaciones en VIII.2, VIII.5 y VIII.11 |
| 75 | Serie de Neumann y trazado de caminos | VIII.11 |
| 76 | Ecuación de transferencia radiativa | VIII.11; Beer–Lambert en VI.1 |

Además:

- **Motor del libro (hitos H0 a H22):** se elimina. Lo sustituyen las demos de cada aplicación y las páginas de hilo (9.3 y 9.4).
- **Material preliminar:** «El motor 3D como mapa de problemas» pasa a ser la página del hilo 3D; el grafo de dependencias se genera desde los metadatos (11.4).
- **Apéndices:** pasan a cada tomo (sección 14).
- **Capítulos sin equivalente en el índice anterior,** añadidos en la versión 0.2 con la arista de la física: II.11, IV.12, VII.5, VII.10, VIII.14, IX.3, IX.5 y el Tomo X entero.

## 16. Plan de trabajo

### 16.1 Fases

| Fase | Trabajo | Criterio para pasar a la siguiente |
| --- | --- | --- |
| 0. Infraestructura | Repositorio, sitio (Astro y Starlight), plantilla de capítulo, metadatos, comprobaciones automáticas (el script que verificó este documento es la base), biblioteca común de las demos, primera versión del diccionario y del conversor de convenciones | Un capítulo de prueba se publica con todas las comprobaciones en verde |
| 1. Capítulo piloto | II.5, *Espacio dual y covectores*, con todos los elementos de la plantilla | Se prueba con 5 a 10 estudiantes que ya cursaron álgebra lineal: al terminar, explican el fragmento de salida; la plantilla se ajusta con lo aprendido |
| 2. Tomo II | Capítulos en orden, publicados uno a uno en la web | Tomo completo, con sus páginas de importación y exportación |
| 3. Tomos I y III | Se pueden escribir en paralelo | Base de la obra completa |
| 4. Tomo IV | En orden | Puerta de los tomos de área abierta |
| 5. Tomos de área | Orden propuesto: V, VII, VI, VIII, IX y X | Cada tomo, completo y verificado |

El Tomo II va primero porque es donde el abismo es paradigmático y donde está el lector que motiva la obra: quien ya cursó álgebra lineal. Ese lector puede leerlo con lo que sabe del Tomo I.

### 16.2 Cuándo un capítulo está terminado

- Requisitos, tipo y metadatos verificados automáticamente.
- Demostraciones revisadas por un segundo matemático.
- Fragmento de entrada explicado en la salida; las cinco preguntas del Puente respondidas o declaradas no aplicables.
- De 2 a 4 aplicaciones de al menos dos campos, con al menos una interactiva y todas con texto alternativo.
- Celdas de código ejecutadas, ejercicios verificados y soluciones de los impares escritas.
- Términos nuevos añadidos al diccionario academia–práctica.

## 17. Decisiones abiertas

| Decisión | Propuesta actual |
| --- | --- |
| Título definitivo | «Matemática y práctica» es provisional |
| Licencias del texto y del código; modelo de publicación | Por decidir: por ejemplo, web gratuita y PDF o impresión de pago. El repositorio es público y, mientras no tenga licencia, su contenido queda con todos los derechos reservados |
| Herramienta de edición | Decidido: Astro con Starlight (decisión 0001 del repositorio) |
| Lenguajes del código | Python (Pyodide) para el cálculo en vivo y TypeScript para el sitio y las figuras |
| Soluciones de los ejercicios pares | Espacio para docentes |
| Capítulos complementarios en la primera edición | Publicar primero el recorrido de núcleo y después los complementarios |
| Itinerario de ingeniería | La ingeniería tiene 73 aplicaciones, casi tantas como la física, pero no tiene itinerario (2.1). Propuesta: núcleo, más IV.13, VI.6, VIII.7, IX.8 y X.4 (termodinámica, control, diseño de experimentos, estructuras y espacios de configuración); son 105 capítulos y 4.508 páginas, cerrado bajo dependencias |
| Extensión | Unas 5.216 páginas de capítulos; si se quiere reducir, la primera palanca es el recorrido de núcleo (4.296) y la segunda, bajar la media de páginas por capítulo |
| Signatura de la métrica | (−, +, +, +), con traducción explícita a (+, −, −, −) |
| Idioma | Español; traducción al inglés por decidir |
| Revisión externa | Definir quiénes revisan las demostraciones y con qué estudiantes se prueba el piloto |
