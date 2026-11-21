# Especificación del proyecto — Matemática y práctica

*Título provisional · Versión 0.7 · 20 de noviembre de 2026*

Este documento sustituye como plan vigente al «Índice temático revisado» de *Métodos Matemáticos para Ingeniería de Motores 3D* (76 capítulos y un motor didáctico en paralelo). Recoge las decisiones del 20 de noviembre de 2026: una obra de matemática de nivel licenciatura, sin motor, con aplicaciones variadas, pensada para la web y con una misión central: cerrar el abismo entre la matemática que se estudia y la que se usa. La sección 15 indica dónde quedó cada capítulo del índice anterior. La versión 0.2 suma la arista de la física: la matemática que necesitan los físicos, con su propio hilo, su propio puente y un décimo tomo. La versión 0.3 añade el perfil de egreso (2.1): qué puede hacer el lector fuera de la matemática al terminar la obra. La versión 0.4 registra las primeras decisiones de infraestructura (sección 11): el sitio se construye con Astro y Starlight, y el índice temático pasa a ser datos, desde los que se genera la sección 13. El documento vive en el repositorio `cerrar-el-abismo`, en `docs/especificacion.md`; el índice anterior está en `docs/historico/`. La versión 0.5 completa las materias clásicas de una licenciatura en matemática: el álgebra hasta la teoría de Galois, la topología general y algebraica, el análisis funcional y los fundamentos. Suma tres tomos (V, VI y X) y tres capítulos; la colección pasa a trece tomos y se renumera. La versión 0.6 fija el estilo de redacción (7.1) y el orden de escritura: la obra se escribe desde el principio, empezando por I.1 (16). La versión 0.7 cubre huecos de alto impacto con catorce capítulos: órdenes, retículos y álgebras de Boole (en el núcleo), autómatas, teoría espectral de grafos, análisis de algoritmos, programación dinámica, teoría de juegos, geometrías no euclidianas, fractales, control óptimo, martingalas, aprendizaje estadístico, series temporales, transporte óptimo y leyes de conservación.

## 0. Organización de este documento

| Secciones | Contenido |
| --- | --- |
| 1–5 | Qué es la obra y por qué: visión, contrato y perfil de egreso, diagnóstico del abismo, principios y alcance |
| 6–12 | Cómo está hecha: tomos, plantilla de capítulo, el puente, aplicaciones, ejercicios, plataforma web y convenciones |
| 13 | Índice temático completo de los trece tomos |
| 14–17 | Extensión, correspondencia con el índice anterior, plan de trabajo y decisiones abiertas |

## 1. Visión

Quien estudia matemática se encuentra a menudo con situaciones prácticas en las que parece haber un abismo entre lo que aprendió y cómo se usa. El caso paradigmático es el motor 3D: el estudiante llega con un curso completo de álgebra lineal y descubre que lo que se usa en un motor parece otra cosa. Las matrices son de 4×4, los puntos y los vectores se distinguen, las normales se transforman con una receta extraña, las rotaciones se guardan en cuaterniones y el vocabulario no se parece al del curso. Lo que sabe no parece aplicable, y lo que le explican escapa a su experiencia.

La obra quiere cerrar ese abismo sin dejar de ser una obra de matemática. Cada tema se construye con rigor de licenciatura y, en el mismo capítulo, se enseña a reconocerlo en la práctica: su vocabulario, sus convenciones, sus representaciones y sus aproximaciones. Los motores 3D son un hilo que recorre toda la obra, pero no el único. El mismo abismo existe entre la probabilidad y el aprendizaje automático, entre Fourier y el procesamiento de audio, o entre las ecuaciones diferenciales y la simulación física.

La física merece un lugar propio en esa lista: es la segunda práctica de la obra. Su abismo tiene las mismas capas que el del motor 3D y va en dos sentidos. Al matemático que abre un libro de física le falta la traducción: índices, notación de Dirac, una delta que se manipula como si fuera una función. Al físico le falta el rigor que justifica esas manipulaciones. Además, las dos prácticas se tocan: la física es la teoría, y el motor, su simulación.

## 2. Contrato de la obra

- **Qué es.** Una obra de matemática de nivel licenciatura en trece tomos ordenados por áreas, con definiciones, teoremas y demostraciones completas, y con aplicaciones de varios campos en cada capítulo. Se publica primero en la web, con código en vivo y figuras interactivas.
- **Qué no es.** No es un manual de programación, de un motor ni de una herramienta. Ningún capítulo trata de ingeniería o de informática por sí mismas, y no hay un motor que crezca en paralelo.
- **Lector.** Estudiantes de matemática, física, ingeniería e informática; profesionales que quieren entender la matemática de lo que usan; autodidactas dispuestos a leer demostraciones. A los físicos, la obra les da el rigor; a los matemáticos, la traducción a la notación de la física.
- **Punto de partida.** La matemática de la escuela secundaria. El Tomo I empieza por la lógica y la demostración. No se supone saber programar ni haber estudiado física: el código y las fórmulas de la práctica se leen con las explicaciones que los acompañan.
- **Nivel.** El de una licenciatura en matemática con orientación aplicada. Todo resultado que se usa se demuestra. Cuando una prueba excede la obra, el resultado se enuncia con una referencia exacta y se dice qué se pierde al no demostrarlo.
- **Misión transversal.** Cerrar el abismo entre teoría y práctica (secciones 3 y 8).

### 2.1 Perfil de egreso

El contrato dice qué es la obra; el perfil de egreso dice qué puede hacer, fuera de la matemática, quien la termina. La obra no forma físicos, programadores de motores ni ingenieros: no enseña el oficio de ningún campo ni da intuición experimental. Forma un matemático capaz de **traducir**. Ante una fórmula de física o una línea de código, sabe qué teorema la sostiene, qué da por supuesto y cuándo deja de valer; ante un teorema, sabe dónde aparece en la práctica. Con esa base, el oficio de cada campo se aprende sin que haya un abismo.

El perfil es un compromiso que se puede comprobar, no una declaración de intenciones. Cada capacidad se apoya en los fragmentos de salida (8.1) y en los ejercicios de traducción (8.4) de los capítulos citados entre paréntesis, y cada bloque corresponde al itinerario que indica su título (9.6).

**Formación matemática (itinerario de núcleo).** El núcleo cubre las materias de una licenciatura en matemática: lógica, teoría de conjuntos y órdenes (Tomo I), álgebra lineal y álgebra hasta la teoría de Galois (Tomos II y V), análisis real, topología y análisis funcional hasta los espacios de Sobolev (Tomos III, IV, VI, IX y X), geometría, ecuaciones diferenciales y probabilidad. Quien lo termina puede seguir un posgrado en matemática pura o aplicada sin lagunas de base, y reconoce cada una de esas materias en la práctica.

**Capacidades comunes (itinerario de núcleo).**

- **Reconocer el teorema detrás de la práctica, y al revés.** Ver `transpose(inverse(M))` y pensar en la aplicación dual (II.5); ver `|ψ⟩` y pensar en un vector de un espacio con producto interno (II.8).
- **Preguntar qué se da por supuesto y cuándo falla.** En el código, la aritmética exacta (I.12, II.17); en la física, intercambiar límites o tratar la delta como una función (III.6, IX.6).
- **Tratar las convenciones como elecciones.** Vectores fila o columna, mano derecha o izquierda, el signo de la transformada de Fourier: quien entiende que una convención es la elección de un isomorfismo (II.15) pasa de un libro o de un motor a otro sin perderse (sección 12).
- **Pasar de la demostración al programa** que la usa y leer el resultado numérico con un criterio de error (II.12, III.10).
- **Leer literatura técnica de otro campo** (artículos, documentación, textos de física o de ingeniería) sin que la notación sea un obstáculo, con el diccionario academia–práctica como apoyo (8.5).

**Física (itinerario de física).** El lector puede seguir los cursos de física de grado distinguiendo lo riguroso de la heurística útil.

- **Mecánica clásica:** las formulaciones lagrangiana y hamiltoniana como cálculo de variaciones, con corchetes de Poisson y Hamilton–Jacobi, y el sólido rígido como dinámica en SO(3) (VIII.8–VIII.11).
- **Electromagnetismo:** las ecuaciones de Maxwell en forma integral y diferencial, con el teorema que pasa de una a otra (IV.12), y después en el lenguaje de las formas diferenciales (IV.14); la carga puntual como distribución (IX.6).
- **Mecánica cuántica:** estados en espacios de Hilbert y operadores autoadjuntos; por qué ningún par de matrices finitas cumple `[x, p] = iħ`; el espín como representación de SU(2); los orbitales como armónicos esféricos; funciones especiales, perturbaciones y WKB (II.8, IX.14, XII.3, XII.5, XIII.2, X.6, XIII.7).
- **Mecánica estadística:** la entropía de Boltzmann y la de Shannon como una misma idea, el modelo de Ising con MCMC, el movimiento browniano y las funciones de partición por métodos asintóticos (IX.11, XI.8, XI.10, XI.17).
- **Relatividad especial y general:** Minkowski y Lorentz, variedades, curvatura, geodésicas y gravitación, con la corrección de los relojes del GPS como prueba de que importa (XIII.3–XIII.6).
- **Medios continuos:** calor, ondas, acústica, fluidos y elasticidad, con funciones de Green y elementos finitos (Tomo XII).

Límite: la teoría cuántica de campos, las teorías gauge y los fibrados quedan fuera (5.4). El lector llega a su puerta con lo necesario para empezarlas.

**Gráficos y 3D (itinerario de gráficos y 3D).** El lector puede leer el código de un motor o un artículo de gráficos reconociendo la estructura que hay debajo de cada truco y, cuando algo falla (una rotación que se degenera, una sombra que parpadea), saber qué hipótesis se rompió.

- **Del vértice al píxel:** marcos de referencia, matrices 4×4, cámara, proyección y Reverse-Z; las normales como covectores (II.3, II.5, II.14, VII.3).
- **Rotaciones y animación:** cuaterniones y SLERP, *skinning* con grupos de Lie y curvas para cámaras (II.16, VII.4–VII.7).
- **Simulación:** paso fijo, integradores que conservan la estructura, sólido rígido, contactos, tela y cuerdas (VIII.11–VIII.14).
- **Render:** trazado de caminos como ecuación integral, muestreo por importancia, microfacetas, iluminación con armónicos esféricos y *Gaussian Splatting* (IX.14, XI.2, XI.3, XI.5, XI.6, XI.12).
- **Geometría computacional:** selección con el ratón, colisiones, mallas de navegación, *ray marching* y BVH (VII.10–VII.12, VII.14, VII.15).
- **Números en la máquina:** por qué un mundo grande tiembla lejos del origen y por qué una simulación diverge entre plataformas (I.12, II.17).

Límite: las APIs gráficas, los *shaders*, la arquitectura de un motor y la optimización en GPU son oficio, no matemática. La obra hace que se aprendan más rápido, pero no los enseña.

**Otros campos (itinerario de núcleo).** Las demás etiquetas (9.1) dan salidas igual de concretas. El número de aplicaciones de cada campo sale de la sección 14; cuando una capacidad depende de un capítulo complementario, se indica.

| Campo | Aplicaciones | Qué puede hacer el lector |
| --- | --- | --- |
| Ingeniería [Ing] | 98 | Robótica: cinemática de eslabones y planificación de movimientos (II.14, VII.11). Control: espacio de estados, estabilidad, Bode y Nyquist (VIII.3, VIII.4, IX.9, IX.10). Estructuras con elementos finitos y aerodinámica (XII.8, XII.10). Navegación inercial y filtrado (II.17, XI.15). CAD y fabricación aditiva (VII.6, VII.10, VII.14) |
| Datos [Datos] | 61 | Entender por qué funciona lo que se usa como caja negra: regresión, PCA y SVD, optimización convexa y vectores soporte, entrenamiento con diferenciación automática, inferencia bayesiana y MCMC, entropía cruzada (II.8, II.10, IV.5, IV.7, IV.8, XI.8, XI.15, XI.17). Con el itinerario de datos, redes equivariantes (XIII.1) |
| Biología, medicina, economía y finanzas [Bio/Eco] | 48 | Poblaciones y epidemias, farmacocinética, imagen médica, ensayos clínicos y pruebas diagnósticas (II.6, VIII.1, VIII.4, IX.5, VII.14, XI.1, XI.13). Insumo-producto, utilidad con presupuesto y equilibrio de mercado (II.1, IV.4, VIII.14). Valoración de opciones por Monte Carlo (XI.6) |
| Señales [Señales] | 32 | Fourier, muestreo, filtros, audio digital y JPEG (IX.4, IX.5, IX.7, IX.13). Con un complementario, ondículas y JPEG 2000 (IX.8) |
| Criptografía y computación [Cripto] | 26 | RSA y Diffie–Hellman, Reed–Solomon, CRC y AES, colisiones de *hash*, compresión de Huffman y determinismo entre plataformas (I.5, I.6, I.10, I.12, XI.17). Criptografía de retículos con la forma normal de Hermite (V.4) |

Los dos hilos fijos tienen 140 aplicaciones ([3D]) y 101 ([Física]). La ingeniería no es hilo fijo ni tiene itinerario, pero tiene casi tantas aplicaciones como la física; si merece un itinerario propio es una decisión abierta (17).

**En suma.** Quien termina la obra puede sentarse con un físico, un programador de gráficos, un ingeniero de control o un científico de datos, entender sus cuentas, aportar rigor y aprender su oficio rápido. Eso abre caminos como la física matemática, la investigación en gráficos, la simulación, la robótica, el aprendizaje automático o las finanzas cuantitativas.

## 3. Diagnóstico: por qué existe el abismo

Tomando el caso del álgebra lineal frente a un motor 3D, el abismo tiene siete capas, y cada una pide un remedio distinto.

| Capa | En qué consiste | Ejemplo | Remedio en la obra |
| --- | --- | --- | --- |
| 1. Matemática que la carrera omite | La práctica usa temas que un plan de estudios típico no cubre | Coordenadas homogéneas, geometría proyectiva, cuaterniones, precisión finita | Incluirlos con rigor completo como «eslabones perdidos» (5.2) |
| 2. Lo que se sabe pero no se reconoce | La matemática es la misma, pero presentada de otra forma | «Normales con la transpuesta de la inversa» es la aplicación dual | Sección Puente y recuadro «Una línea, un teorema» (8.2 y 8.3) |
| 3. Convenciones | Elecciones arbitrarias que nadie declara | Vector fila o columna, y almacenamiento por filas o columnas, son dos elecciones independientes; combinadas, dos transposiciones se cancelan | Capítulo propio (II.15), convenciones declaradas de la obra (sección 12) y conversor interactivo (8.5) |
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
| Representación de números en la máquina y coma flotante | I.12 |
| Producto tensorial y notación de índices | II.11 |
| Espacios afines y coordenadas homogéneas | II.14 |
| Convenciones como elección de isomorfismo | II.15 |
| SO(3) y cuaterniones | II.16 |
| Álgebra lineal en precisión finita | II.17 |
| Polinomios de Bernstein, interpolación y *splines* | III.9, VII.6 |
| Métodos numéricos con análisis de error en coma flotante | II.12, III.10 |
| Diferenciación automática | IV.8 |
| Coordenadas curvilíneas y cálculo tensorial | IV.13 |
| Geometría de cámaras y de varias vistas | VII.3 |
| Predicados geométricos robustos | VII.10 |
| Convexidad computacional (sumas de Minkowski, GJK) | VII.11 |
| Geometría discreta de mallas | VII.13 |
| Integración geométrica (simpléctica y en grupos de Lie) | VIII.13 |
| Contacto y complementariedad | VIII.14 |
| Distribuciones | IX.6 |
| Muestreo y transformada discreta | IX.7 |
| Métodos asintóticos | IX.11 |
| Generación de muestras, Monte Carlo y cuasi-Monte Carlo | XI.5, XI.6, XI.7 |
| Ecuaciones integrales resueltas por caminos aleatorios | XI.12 |
| Funciones especiales y polinomios ortogonales | XII.3 |
| Perturbaciones y WKB | XII.5 |
| Representaciones de grupos | XIII.1, XIII.2 |
| Espacio de Minkowski y grupo de Lorentz | XIII.3 |
| Operadores no acotados | X.6 |

### 5.3 Capítulos de núcleo y complementarios

Cada capítulo se marca como **núcleo** o **complementario**. Un capítulo complementario es uno del que no depende ningún capítulo de núcleo. El recorrido formado solo por capítulos de núcleo es una licenciatura aplicada completa en sí misma; los complementarios amplían sin romper nada. La sección 14 da la extensión de los dos recorridos.

### 5.4 Fuera de alcance

Quedan fuera las ramas propias de un posgrado o de una orientación específica. Cuando conviene señalarlas, aparecen en el recuadro «Para seguir» del capítulo más cercano. Desde la versión 0.5, la teoría de Galois, la teoría axiomática de conjuntos, la topología general y algebraica y el análisis funcional están dentro de la obra; desde la 0.7, también los autómatas y los lenguajes regulares.

| Tema | Dónde se señala |
| --- | --- |
| Teoría de Galois infinita y teoría algebraica de números | V.6 |
| Geometría algebraica más allá de las bases de Gröbner | V.9 |
| Gramáticas libres de contexto y análisis sintáctico | I.13 |
| Teoría de la complejidad computacional | I.14 |
| Teoría analítica de números | I.5 |
| Álgebra homológica y teoría de categorías | VI.7 |
| Topología diferencial: transversalidad y teoría de Morse | XIII.4 |
| Fibrados y teorías gauge | XIII.5 |
| Álgebra geométrica y álgebra geométrica proyectiva (PGA) | IV.14 |
| Cálculo estocástico de Itô | XI.10 |
| Representaciones de grupos no compactos más allá del grupo de Lorentz | XIII.3 |
| Teoría cuántica de campos | XIII.7 |

### 5.5 Algoritmos de ingeniería: de capítulo a aplicación

En el índice anterior varios algoritmos de motores eran capítulos. Ahora aparecen como aplicaciones del resultado matemático que los sostiene:

| Algoritmo o técnica | Resultado que lo sostiene | Capítulo |
| --- | --- | --- |
| Transformación de normales | Aplicación dual | II.5 |
| SLERP y el cambio de signo del cuaternión | Recubrimiento doble S³ → SO(3) | II.16 |
| Re-ortonormalización de cámaras | Descomposición polar y Gram–Schmidt en precisión finita | II.17 |
| Cinemática inversa | Gauss–Newton y Levenberg–Marquardt | IV.8 |
| Reverse-Z | Distribución de la coma flotante y proyección | VII.3 |
| Rasterización con funciones de arista | Determinante como área orientada; coordenadas baricéntricas | VII.3 |
| *Skinning* con cuaterniones duales | Grupos de Lie, SE(3) y números duales | VII.4 |
| Möller–Trumbore | Regla de Cramer | VII.10 |
| GJK y EPA | Convexidad, sumas de Minkowski y funciones de soporte | VII.11 |
| BVH con SAH | Fórmula de Cauchy–Crofton | VII.15 |
| Euler semi-implícito y Verlet | Integradores simplécticos | VIII.13 |
| Impulsos secuenciales | Gauss–Seidel proyectado para complementariedad | VIII.14 |
| *Mipmaps* y TAA | Teorema del muestreo y filtros de reconstrucción | IX.7 |
| Iluminación con armónicos esféricos | Base de L²(S²) y teorema de Funk–Hecke | IX.14 |
| Microfacetas GGX | Distribución de normales como densidad de probabilidad | XI.2 |
| Trazado de caminos | Serie de Neumann y Monte Carlo | XI.12 |
| *Stable Fluids* | Descomposición de Helmholtz–Hodge | XII.10 |

## 6. Estructura de la colección

La obra tiene trece tomos. Los Tomos I, II y III forman la base; los demás son tomos de área, y las dependencias entre ellos aparecen en las partes avanzadas. La tabla sale de los datos del índice (11.4).

<!-- tomos: generado desde indice/ con `npm run indice:spec`; no editar a mano -->

| Tomo | Título | Requiere | Interfaces | Caps. |
| --- | --- | --- | --- | --- |
| I | Fundamentos: lógica, números y estructuras | — | — | 14 |
| II | Álgebra lineal y el espacio de la práctica | I | — | 17 |
| III | Análisis en una variable | I | — | 12 |
| IV | Análisis en varias variables y optimización | II, III | — | 14 |
| V | Álgebra: grupos, anillos, módulos y cuerpos | II | — | 9 |
| VI | Topología | II, III | IV.6, V.2, V.4 | 11 |
| VII | Geometría | II, III, IV | — | 15 |
| VIII | Ecuaciones diferenciales, sistemas dinámicos y mecánica | II, III, IV | VII.4 | 14 |
| IX | Medida, Fourier y variable compleja | III, IV | — | 14 |
| X | Análisis funcional | VI, IX | VII.4 | 8 |
| XI | Probabilidad, estadística y métodos estocásticos | IV, IX | — | 18 |
| XII | Ecuaciones en derivadas parciales y medios continuos | VIII, IX, X | XI.9 | 11 |
| XIII | Simetría, variedades y teoría cuántica | VII, IX, X, XI | XII.3 | 7 |
| **Total** | | | | **164** |

<!-- /tomos -->

```
                   ┌─► II  Álgebra lineal ───┐
I  Fundamentos ────┤                         ├─► IV  Varias variables
                   └─► III Análisis 1 var. ──┘

               II ──► V    Álgebra
         II + III ──► VI   Topología (+ interfaz IV.6, V.2 y V.4)
    II + III + IV ──► VII  Geometría
    II + III + IV ──► VIII Ecuaciones diferenciales (+ interfaz VII.4)
         III + IV ──► IX   Medida, Fourier y variable compleja
          VI + IX ──► X    Análisis funcional (+ interfaz VII.4)
          IV + IX ──► XI   Probabilidad y estadística
    VIII + IX + X ──► XII  EDP y medios continuos (+ interfaz XI.9)
VII + IX + X + XI ──► XIII Simetría, variedades y teoría cuántica (+ interfaz XII.3)
```

**Reglas de interdependencia**

- Un tomo depende de otros completos (columna «Requiere») o importa capítulos concretos (columna «Interfaces»).
- Cada tomo abre con **«Lo que este tomo importa»**: para cada tomo o capítulo del que depende, de 4 a 8 páginas con los enunciados, las garantías y la notación que usa, y los capítulos que hay que leer para entenderlos a fondo. Quien no leyó un tomo previo puede avanzar usando ese resumen como contrato.
- Cada tomo cierra con **«Lo que este tomo exporta»**: los resultados que otros tomos importan.
- Atajos que respetan el grafo: VII.1, VII.2, VII.3 y VII.6 solo usan los Tomos II y III, así que la geometría afín, proyectiva y de cámaras se puede leer justo después del álgebra lineal. VIII.1 a VIII.3 también usan solo los Tomos II y III. El álgebra del Tomo V solo necesita el álgebra lineal, y la topología general (VI.1 a VI.4), los Tomos I a III.
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

### 7.1 Estilo de redacción

La obra se escribe con el estilo de los mejores libros de matemática: el equilibrio entre explicar y ser preciso, buenas introducciones y la claridad de quien quiere que el lector entienda. La guía completa está en `docs/guia-de-estilo.md`; sus reglas centrales son estas:

- **Dos capas que no se reemplazan.** Definiciones, enunciados y demostraciones con precisión total; alrededor, la prosa que dice de dónde sale cada idea, qué significa y para qué sirve.
- **Abrir bien.** Cada capítulo convierte su fragmento de entrada en una pregunta y trabaja primero el caso más chico; cada sección abre diciendo qué problema resuelve.
- **Definiciones motivadas**, seguidas de ejemplos y contraejemplos; **teoremas** con título, enunciado completo y, cuando hace falta, una frase «en palabras».
- **Demostraciones completas**, con la idea antes y sin «es fácil ver» ni «obviamente»; se dice dónde se usa cada hipótesis.
- **Licencias declaradas.** Lo que se usa antes de construirse (un uso anticipado), lo que se dice *sobre* la matemática y no dentro de ella (metamatemática) y lo que se toma de un capítulo posterior solo por su forma se declaran en el lugar, en una frase, con el capítulo donde se trata con rigor; cada capítulo lista sus usos anticipados en el recuadro «Lo que este capítulo da por conocido». Ninguna demostración se apoya en una licencia.
- **Prosa en primera persona del plural**, ejercicios en infinitivo, una idea por párrafo, ninguna frase que empiece con una fórmula.
- **Cerrar bien.** La Salida explica el fragmento de entrada y termina con «Lo esencial».

Las reglas mecánicas se comprueban automáticamente en cada capítulo (11.5).

## 8. El puente

### 8.1 Fragmento de entrada y de salida

Cada capítulo abre con un fragmento real que el lector todavía no puede explicar y cierra explicándolo línea por línea. Así el abismo es el hilo narrativo del capítulo y, a la vez, un objetivo que se puede comprobar: al terminar, el lector puede leer ese fragmento. Los fragmentos son código o fórmulas y notación de física. Salen de código abierto con licencia permisiva, de especificaciones públicas o de la notación estándar de los textos de física, siempre citados; cuando no hay uno adecuado, se escribe uno propio en el estilo real.

La Entrada no supone que el lector programe. Si el fragmento es código, se elige la forma más legible que conserve lo esencial (Python, cuando el lenguaje no importa) y una frase dice qué hace cada instrucción. En los primeros capítulos de la obra, sobre todo en el Tomo I, el fragmento llega después de una pregunta matemática concreta, y el código aparece como la misma pregunta escrita en otro idioma.

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
| `vec4(p, 1.0)` y `vec4(v, 0.0)` | Espacio afín como hiperplano w = 1 | II.14 |
| `if (dot(q1, q2) < 0.0) q2 = -q2;` | Recubrimiento doble S³ → SO(3) | II.16 |
| `x = lerp(x, target, 1 - exp(-k * dt))` | Solución exacta de una EDO lineal | III.8 |
| `y = y * (1.5 - 0.5 * x * y * y)` | Un paso de Newton para 1/√x | III.10 |
| `t += sdf(origin + t * dir)` | Constante de Lipschitz y *sphere tracing* | VII.14 |
| `v += a * dt; x += v * dt;` | Integrador simpléctico | VIII.13 |
| `color += f(x) / pdf(x)` | Estimador insesgado de Monte Carlo | XI.6 |
| `x - max(x)` antes de un *softmax* | Estabilidad numérica en coma flotante | I.12 |
| `np.einsum('ij,jk->ik', A, B)` | Contracción de tensores y convención de Einstein | II.11 |
| `∫ δ(x) f(x) dx = f(0)` | La delta como distribución | IX.6 |
| `[x, p] = iħ` | Imposible con matrices finitas, porque la traza de un conmutador es 0: exige operadores no acotados | X.6 |
| `state = kron(q0, q1)` | Producto tensorial y entrelazamiento | XIII.7 |

### 8.4 Ejercicios de traducción

- **Leer:** dado un fragmento real, identificar la matemática, la convención y la aproximación que usa.
- **Traducir:** pasar un código o una fórmula de una convención a otra.
- **Encontrar el error:** por ejemplo, normales transformadas con M bajo una escala no uniforme.

### 8.5 Herramientas transversales de la web

- **Diccionario academia–práctica,** que también funciona de español a inglés: «cambio de base» ↔ «*transform from object space to world space*», «covector» ↔ «normal», «combinación afín» ↔ «*lerp*», «autoadjunto» ↔ «hermítico», «aplicación multilineal» ↔ «tensor con índices», etc. Cada entrada dice también dónde dejan de coincidir los dos lados. Cada capítulo declara los términos que define, y la página del diccionario los reúne (decisión 0004 del repositorio).
- **Conversor de convenciones:** se eligen la mano de los ejes, el tipo de vector (fila o columna) y el orden de almacenamiento, y se ve cómo cambian la matriz y su disposición en memoria. Para la física, también la signatura de la métrica y la convención de las coordenadas esféricas.
- **Comparador exacto frente a float32:** celdas que muestran el mismo cálculo con SymPy y en coma flotante, para ver un teorema cumplirse y luego derivar.

### 8.6 Partes puente

Además de la sección Puente de cada capítulo, hay partes enteras donde la carrera omite temas completos: Tomo I, Parte C; Tomo II, Parte C; Tomo III, Parte C; Tomo VII, Partes A y D; Tomo VIII, Parte C; Tomo IX, Partes B y C (distribuciones y métodos asintóticos); Tomo XI, Parte B; Tomo XII, Parte A; y el Tomo XIII entero.

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
| I | Coma flotante, determinismo y *origin rebasing* (I.12); grafos de escena (I.8); jerarquías de escena sin ciclos (I.4); geometría constructiva de sólidos (I.7) y máquinas de estados (I.13) |
| II | Cambio de marco (II.3), normales (II.5), matrices 4×4 (II.14), convenciones (II.15), cuaterniones y SLERP (II.16), re-ortonormalización (II.17), procesamiento espectral de mallas (II.13) |
| III | *Smoothstep* y *easing* (III.4), suavizado independiente del paso (III.8), curvas de Bézier (III.9), raíz inversa rápida (III.10), estructuras espaciales frente a fuerza bruta (III.11) |
| IV | Normales por gradiente y huella de un píxel (IV.2), cinemática inversa (IV.8), ángulo sólido e irradiancia (IV.10), masa e inercia de mallas (IV.12), planificación de caminos (IV.9) |
| V | Simetrías de mosaicos (V.1), el cubo de Rubik (V.2), intersecciones exactas (V.3), texturas periódicas (V.4), núcleos geométricos exactos (V.5), intersección de un rayo con un toro (V.7), implicitación de superficies (V.9) |
| VI | Mundos periódicos (VI.1), mallas de navegación (VI.2), *skinning* con particiones de la unidad (VI.3), ángulos acumulados (VI.5), portales (VI.6), agujeros en mallas (VI.7), género y cortes (VI.8), el vector «arriba» de la cámara (VI.9), reconstrucción de superficies (VI.11), inteligencia artificial de juegos (VI.10) |
| VII | Cámara, rasterización y Reverse-Z (VII.3), *skinning* (VII.4), rieles de cámara (VII.6 y VII.7), *normal mapping* (VII.8), selección con el ratón (VII.10), colisiones (VII.11), mallas de navegación (VII.12), niveles de detalle (VII.13), *ray marching* (VII.14), BVH (VII.15), mundos hiperbólicos (VII.5) |
| VIII | Paso fijo (VIII.12), tela y cuerdas (VIII.13), pilas de cajas (VIII.14), sólido rígido (VIII.11), terrenos fractales (VIII.6) y control de personajes (VIII.10) |
| IX | Desenfoque y *bloom* (IX.5), *mipmaps* y TAA (IX.7), iluminación con armónicos esféricos (IX.14), pesos del muestreo por importancia (IX.2) |
| X | Separación de convexos (X.1), superficies de energía mínima (X.3), radiosidad (X.4), energía de Dirichlet en mallas (X.5), humo por división de operadores (X.8) |
| XI | Microfacetas (XI.2), *Gaussian Splatting* (XI.3), sombras por varianza (XI.4), muestreo de BRDF (XI.5), Monte Carlo y ReSTIR (XI.6), terreno procedural (XI.9), trazado de caminos (XI.12), transferencia de color (XI.18) |
| XII | Humo con *Stable Fluids* (XII.10), océanos y agua (XII.11), cuerpos blandos (XII.9), fluidos con volúmenes finitos (XII.7) |
| XIII | Rotación de armónicos esféricos (XIII.2), visualización relativista (XIII.3), optimización sobre SO(3) (XIII.4), geodésicas sobre mallas (XIII.5), agujeros negros (XIII.6) |

### 9.5 Recorrido del hilo de física

| Tomo | Aplicaciones del hilo de física |
| --- | --- |
| I | Simetrías de moléculas y cristales (I.9), la paradoja de Banach–Tarski (I.4) |
| II | Análisis dimensional (II.3), torque (II.4), modos normales (II.6), notación de Dirac (II.8), principio de Rayleigh–Ritz (II.9), tensores (II.11), matrices de Pauli y espín (II.16), redes de resortes (II.13) |
| III | Doppler (III.4), trabajo y energía (III.5), péndulo y ángulo pequeño (III.7), la aproximación de Stirling (III.11) |
| IV | Fuerzas de restricción (IV.4), ecuaciones de Maxwell (IV.12), coordenadas curvilíneas (IV.13), electromagnetismo con formas (IV.14) |
| V | Grupos espaciales en cristalografía (V.1), grupos de trenzas (V.2), redes recíprocas (V.4) |
| VI | Condiciones de contorno periódicas (VI.1), funciones sin derivada y movimiento browniano (VI.4), efecto Aharonov–Bohm (VI.5), espín y el recubrimiento SU(2) → SO(3) (VI.6), campos irrotacionales sin potencial (VI.7) |
| VII | Cristalografía (VII.1), simetrías continuas (VII.4), membranas (VII.8), velocidades relativistas (VII.5) |
| VIII | Oscilador y resonancia (VIII.2), sistema de Lorenz (VIII.5), mecánica lagrangiana y hamiltoniana (VIII.8 y VIII.9), sólido rígido (VIII.11), dinámica molecular (VIII.13), atractores fractales (VIII.6) y Hamilton–Jacobi desde el control (VIII.10) |
| IX | Estados cuánticos en un espacio de Hilbert (IX.3), difracción (IX.5), distribuciones y cargas puntuales (IX.6), Kramers–Kronig (IX.10), funciones de partición (IX.11), orbitales atómicos (IX.14), densidades de carga y de masa (IX.2) |
| X | Métodos variacionales (X.3), dispersión de ondas (X.4), energía y regularidad de los campos (X.5), operadores no acotados y teorema de Stone (X.6), evolución cuántica (X.8) |
| XI | Maxwell–Boltzmann (XI.2), modelo de Ising (XI.8), movimiento browniano (XI.10), transporte de radiación (XI.12), mecánica estadística (XI.17), flujos de Wasserstein (XI.18) |
| XII | Calor y acústica (XII.1), funciones especiales en cuántica (XII.3), gravitación (XII.4), WKB (XII.5), fluidos (XII.10), oleaje (XII.11), ondas de choque (XII.7) |
| XIII | El tomo entero: espín, relatividad especial y general, mecánica cuántica |

### 9.6 Itinerarios por perfil

Además del orden de los tomos, la web ofrece itinerarios: selecciones de capítulos según el perfil del lector. Todos respetan el grafo de dependencias, y la sección 14 da su extensión.

<!-- itinerarios: generado desde indice/ con `npm run indice:spec`; no editar a mano -->

| Itinerario | Capítulos |
| --- | --- |
| Núcleo | Todos los capítulos de núcleo: la licenciatura aplicada mínima (5.3) |
| Física | Núcleo, más IV.14, VII.5, VIII.5, IX.11, IX.12, X.6, X.8, XI.9, XI.12, XII.5, XII.7, XII.9, XII.11 y el Tomo XIII |
| Gráficos y 3D | Núcleo, más II.13, IV.9, VI.8, VI.9, VII.5, VII.15, VIII.5, VIII.6, XI.7, XI.9, XI.12, XII.7, XII.9 y XII.11 |
| Datos | Núcleo, más II.13, IV.9, VI.11, IX.8, XI.7, XI.9, XI.11, XI.14, XI.16, XI.18 y XIII.1 |

<!-- /itinerarios -->

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
- El código de las celdas se puede editar y volver a ejecutar; cada celda tiene una versión de referencia que se puede restaurar. El editor es CodeMirror, con el resaltado de Python y los mismos colores que los bloques de código de solo lectura, y Ctrl+Enter ejecuta la celda.

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

En cada cambio, la integración continua comprueba lo siguiente. Ya se comprueban: las reglas del índice (los puntos 1 y 2, los hilos de 9.2, los itinerarios de 9.6 y las referencias entre capítulos, en `packages/indice`); en los capítulos escritos, la plantilla, el Puente, las referencias internas, la ejecución de todas las celdas, el texto alternativo de las figuras (decisión 0003), las reglas mecánicas de la guía de estilo (7.1) y las entradas del diccionario academia–práctica (decisión 0004). Faltan la verificación automática de las respuestas de los ejercicios y la de los enlaces externos.

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

*Requiere: escuela secundaria · 14 capítulos.* El lenguaje de la matemática, los sistemas numéricos y las estructuras algebraicas y discretas que usan todos los tomos, incluida la forma en que una computadora representa los números.

**Parte A — Lenguaje y números**

#### I.1 Lógica y demostración
*40 págs. · Requiere: — · Núcleo*
- Lógica proposicional: conectivos, tablas de verdad, equivalencias, implicación, contrapositiva y negación.
- Cuantificadores, su negación y su orden.
- Técnicas de demostración: directa, por contradicción, por casos y por contraejemplo; inducción simple y fuerte.
- Notación de sumatorias y productorias; manipulación de índices.

**Puente.** Entrada: la regularidad 1 + 3 + ⋯ + (2n − 1) = n², y la misma afirmación dentro de un bucle, como `assert i <= n and s == i * i`. Un invariante de bucle es un enunciado que se demuestra por inducción; una aserción es una implicación que el programa comprueba al ejecutarse.
**Aplicaciones.** [Cripto] invariantes y corrección de algoritmos · [Datos] pruebas basadas en propiedades · [3D] precondiciones de las funciones geométricas, como exigir un vector no nulo antes de normalizar.
**Lecturas.** Velleman, *How to Prove It*; Hammack, *Book of Proof*.

#### I.2 Conjuntos, relaciones y funciones
*44 págs. · Requiere: I.1 · Núcleo*
- Conjuntos, operaciones, producto cartesiano y conjunto de partes.
- Relaciones de equivalencia, clases y particiones; relaciones de orden.
- Funciones inyectivas, sobreyectivas y biyectivas; composición, inversa, imagen y preimagen.
- Cardinalidad: conjuntos finitos, numerables y no numerables; argumento diagonal de Cantor. Los cardinales infinitos en general llegan en I.4.

**Puente.** Entrada: `Map<Key, Value>` y una función `hash(key)`. Un diccionario es una función parcial, y una función de dispersión no puede ser inyectiva cuando el dominio es más grande que el codominio.
**Aplicaciones.** [Cripto] tablas de dispersión y clases de equivalencia · [Datos] bases de datos como relaciones · [3D] soldar vértices duplicados como paso al cociente por una relación de equivalencia.
**Lecturas.** Halmos, *Naive Set Theory*; Velleman, *How to Prove It*.

#### I.3 Naturales, enteros y divisibilidad
*40 págs. · Requiere: I.2 · Núcleo*
- Axiomas de Peano, inducción y definición por recursión; principio del buen orden.
- Los enteros, construidos a partir de ℕ; algoritmo de la división y divisibilidad.
- Máximo común divisor, algoritmo de Euclides y su versión extendida; identidad de Bézout.
- Números primos, infinitud de los primos y teorema fundamental de la aritmética.

**Puente.** Entrada: `while (b != 0) { t = b; b = a % b; a = t; }`. Es el algoritmo de Euclides, y su terminación es el principio del buen orden.
**Aplicaciones.** [Cripto] aritmética racional exacta · [Señales] períodos de señales combinadas y mínimo común múltiplo · [3D] repetición de texturas con períodos coprimos para evitar patrones visibles.
**Lecturas.** Rosen, *Elementary Number Theory and Its Applications*; Stillwell, *Elements of Number Theory*.

#### I.4 Teoría axiomática de conjuntos: ZFC, elección y ordinales
*40 págs. · Requiere: I.3 · Núcleo*
- La paradoja de Russell y los axiomas de Zermelo–Fraenkel; los naturales como ordinales de von Neumann.
- Axioma de elección y sus equivalentes: lema de Zorn y principio del buen orden; existencia de bases en todo espacio vectorial.
- Ordinales, inducción transfinita y recursión transfinita.
- Cardinales: teorema de Cantor–Schröder–Bernstein, aritmética cardinal e hipótesis del continuo (su independencia, enunciada).

**Puente.** Entrada: `def ack : Nat → Nat → Nat` en Lean, que el asistente solo acepta si se demuestra que termina. La función de Ackermann termina porque el par (m, n) decrece en el orden lexicográfico, un buen orden de tipo ω²: toda demostración de terminación es una inducción sobre un buen orden.
**Aplicaciones.** [Cripto] demostraciones de terminación de programas con órdenes bien fundados · [Física] la paradoja de Banach–Tarski y por qué la masa solo se define sobre conjuntos medibles · [3D] jerarquías de escena sin ciclos: relaciones bien fundadas y recorridos que terminan.
**Lecturas.** Halmos, *Naive Set Theory*; Hrbacek y Jech, *Introduction to Set Theory*.

#### I.5 Congruencias y aritmética modular
*40 págs. · Requiere: I.3 · Núcleo*
- Congruencias y el anillo ℤ/nℤ; inversos modulares.
- Teorema chino del resto.
- Pequeño teorema de Fermat, función φ de Euler y teorema de Euler.
- Exponenciación rápida y el problema del logaritmo discreto. Para seguir: teoría analítica de números.

**Puente.** Entrada: `state = state * 6364136223846793005 + 1442695040888963407`. Un generador congruencial lineal es una iteración en ℤ/2⁶⁴ℤ, y su período lo deciden condiciones de aritmética modular (teorema de Hull–Dobell).
**Aplicaciones.** [Cripto] RSA, Diffie–Hellman y dígitos de control (ISBN, IBAN) · [3D] semillas reproducibles para mundos procedurales y *hashing* espacial · [Datos] reparto de datos entre servidores por dispersión.
**Lecturas.** Hoffstein, Pipher y Silverman, *An Introduction to Mathematical Cryptography*; Knuth, *The Art of Computer Programming*, vol. 2.

#### I.6 Combinatoria
*44 págs. · Requiere: I.3 · Núcleo*
- Principios de la suma y del producto; permutaciones y combinaciones.
- Coeficientes binomiales, teorema del binomio y triángulo de Pascal.
- Principio de inclusión–exclusión y principio del palomar.
- Recurrencias lineales y funciones generatrices.

**Puente.** Entrada: el triángulo de Pascal dentro de un código de curvas de Bézier. Los coeficientes de los polinomios de Bernstein son binomiales, y la recurrencia de Pascal es la que hace funcionar el algoritmo de De Casteljau (aviso de III.9 y VII.6).
**Aplicaciones.** [Datos] conteo de configuraciones y probabilidad elemental · [Cripto] colisiones de *hash* y paradoja del cumpleaños · [3D] coeficientes de las curvas de Bézier · [Física] conteo de microestados y entropía de Boltzmann.
**Lecturas.** Graham, Knuth y Patashnik, *Concrete Mathematics*; Stanley, *Enumerative Combinatorics*, vol. 1.

**Parte B — Estructuras discretas y algebraicas**

#### I.7 Órdenes, retículos y álgebras de Boole
*40 págs. · Requiere: I.2, I.4 · Núcleo*
- Conjuntos parcialmente ordenados, cadenas y anticadenas; elementos maximales, supremos e ínfimos; diagramas de Hasse.
- Retículos, retículos completos y distributivos; teorema del punto fijo de Knaster–Tarski.
- Álgebras de Boole: el álgebra de partes y el álgebra de las proposiciones; formas normales disyuntiva y conjuntiva; minimización de circuitos.
- Filtros e ideales; teorema de representación de Stone, para las álgebras finitas y, con el lema de Zorn, en general.

**Puente.** Entrada: el bucle de un analizador de flujo de datos, que repite «la entrada de cada nodo es la unión de las salidas de sus predecesores» hasta que nada cambia. Los conjuntos de hechos forman un retículo y cada vuelta aplica una función monótona: el teorema de Knaster–Tarski garantiza que existe el menor punto fijo, y la altura finita del retículo, que el bucle llega a él.
**Aplicaciones.** [Cripto] análisis estático de programas y diseño de circuitos lógicos · [3D] geometría constructiva de sólidos: unión, intersección y diferencia como operaciones de un álgebra de Boole · [Datos] análisis formal de conceptos y estructuras de datos replicadas sin conflictos (CRDT).
**Lecturas.** Davey y Priestley, *Introduction to Lattices and Order*; Givant y Halmos, *Introduction to Boolean Algebras*.

#### I.8 Grafos
*44 págs. · Requiere: I.2, I.6 · Núcleo*
- Grafos, grados, caminos, ciclos y conectividad; árboles y sus caracterizaciones.
- Recorridos en anchura y en profundidad; árboles generadores mínimos.
- Caminos mínimos: Dijkstra y A\*, con la demostración de optimalidad para heurísticas admisibles.
- Grafos planos y fórmula de Euler V − E + F = 2; coloración.

**Puente.** Entrada: `node.children.forEach(update)` en un grafo de escena. La escena es un árbol y la actualización es un recorrido en profundidad; la fórmula de Euler es la primera comprobación de que una malla cerrada está bien formada.
**Aplicaciones.** [3D] grafos de escena, validación de mallas y búsqueda de caminos · [Ing] rutas y redes de transporte · [Datos] redes sociales y componentes conexas.
**Lecturas.** Bondy y Murty, *Graph Theory*; West, *Introduction to Graph Theory*.

#### I.9 Grupos
*48 págs. · Requiere: I.5 · Núcleo*
- Grupos, subgrupos y teorema de Lagrange; grupos cíclicos.
- Homomorfismos, subgrupos normales y grupos cociente.
- Grupos de permutaciones y signo de una permutación.
- Acciones de grupo, órbitas y estabilizadores; lema de Burnside.

**Puente.** Entrada: `cameraView = inverse(cameraTransform)`. Las transformaciones de un motor forman grupos: componer transformaciones es la operación del grupo, y la matriz de vista de una cámara es el inverso de su transformación en ese grupo.
**Aplicaciones.** [Física] simetrías de moléculas y cristales · [Cripto] grupos en la criptografía de clave pública · [3D] simetrías de patrones y teselaciones · [Datos] contar coloraciones distintas con el lema de Burnside.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Artin, *Algebra*.

#### I.10 Anillos, cuerpos y polinomios
*48 págs. · Requiere: I.9 · Núcleo*
- Anillos, ideales y anillos cociente; dominios de integridad y dominios euclídeos.
- Anillos de polinomios: división, raíces, factorización y polinomios irreducibles.
- Cuerpos y extensiones simples; ℚ construido como cuerpo de fracciones de ℤ; ℝ, ℂ y ℤ/pℤ como cuerpos.
- Cuerpos finitos GF(pⁿ): existencia, construcción y aritmética. La teoría de Galois llega en V.6, y las bases de Gröbner, en V.9.

**Puente.** Entrada: `x = (x << 1) ^ ((x & 0x80) ? 0x1B : 0)`. Es multiplicar por x en GF(2⁸) módulo un polinomio irreducible: la operación con la que se construyen AES y los códigos de los QR.
**Aplicaciones.** [Cripto] códigos Reed–Solomon, CRC y AES · [Señales] corrección de errores en almacenamiento y transmisión · [3D] evaluación de polinomios con el esquema de Horner.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Lidl y Niederreiter, *Introduction to Finite Fields and Their Applications*.

**Parte C — Los números reales y la máquina**

#### I.11 Números reales y complejos
*40 págs. · Requiere: I.10 · Núcleo*
- Cuerpos ordenados; por qué ℚ no basta: √2 y los huecos de ℚ.
- Construcción de ℝ por cortaduras de Dedekind; axioma del supremo; unicidad del cuerpo ordenado completo.
- ℝ no es numerable, con la diagonal de Cantor de I.2 aplicada a los desarrollos binarios.
- ℂ como ℝ[x]/(x² + 1): conjugado, módulo y desigualdad triangular.
- Forma polar y multiplicación como rotación y escala, con la trigonometría de la secundaria (III.8 la fundamenta).
- Teorema fundamental del álgebra: enunciado y factorización en ℂ[x] y en ℝ[x]; se demuestra en III.8.

**Puente.** Entrada: `z = z * complex(cos(a), sin(a))` en un juego 2D. Multiplicar por un número complejo de módulo 1 es rotar: es la versión plana de lo que harán los cuaterniones (aviso de II.16).
**Aplicaciones.** [3D] rotaciones 2D sin matrices · [Señales] fasores para representar oscilaciones · [Ing] impedancias en circuitos de corriente alterna · [Física] amplitudes complejas en óptica ondulatoria.
**Lecturas.** Spivak, *Calculus* (construcción de ℝ); Needham, *Visual Complex Analysis*.

#### I.12 Números en la máquina
*40 págs. · Requiere: I.5, I.11 · Núcleo*
- Representación posicional y cambio de base; enteros de máquina y complemento a dos como aritmética módulo 2ⁿ.
- Coma flotante IEEE 754: mantisa, exponente, valores especiales, épsilon de máquina y ULP.
- Redondeo y error relativo; cancelación catastrófica; condicionamiento frente a estabilidad.
- Formatos reducidos (float16, bfloat16, punto fijo y enteros normalizados) y error de cuantización.

**Puente.** Entrada: `0.1 + 0.2 == 0.3` da falso, y `if (abs(a - b) < 1e-6)`. Ninguno de esos números es representable exactamente, y la comparación correcta depende de la magnitud (tolerancia relativa), no de un épsilon fijo.
**Aplicaciones.** [3D] pérdida de precisión lejos del origen y *origin rebasing*; compresión de vértices y normales · [Datos] entrenamiento en bfloat16 y la resta del máximo antes de un *softmax* · [Ing] desbordamiento de enteros en sistemas embebidos · [Cripto] determinismo entre plataformas.
**Lecturas.** Goldberg, «What Every Computer Scientist Should Know About Floating-Point Arithmetic»; Overton, *Numerical Computing with IEEE Floating Point Arithmetic*; Higham, *Accuracy and Stability of Numerical Algorithms*.

#### I.13 Autómatas finitos y lenguajes regulares
*36 págs. · Requiere: I.2, I.8 · Complementario*
- Alfabetos, palabras y lenguajes; autómatas finitos deterministas y no deterministas; construcción de subconjuntos.
- Expresiones regulares y teorema de Kleene: describen exactamente los lenguajes que reconocen los autómatas.
- Teorema de Myhill–Nerode y minimización de autómatas.
- Lema del bombeo: lenguajes que no son regulares, como el de los paréntesis balanceados. Para seguir: gramáticas libres de contexto y análisis sintáctico.

**Puente.** Entrada: `re.compile(r"[0-9]+(\.[0-9]*)?")` en el analizador léxico de un lenguaje de programación. Una expresión regular se compila en un autómata finito, y el teorema de Kleene dice que eso siempre es posible; el lema del bombeo explica por qué ninguna expresión regular reconoce los paréntesis balanceados.
**Aplicaciones.** [Cripto] analizadores léxicos de compiladores y validación de entradas · [3D] máquinas de estados de animación y de comportamiento en videojuegos · [Bio/Eco] búsqueda de motivos en secuencias de ADN · [Ing] verificación de protocolos de comunicación.
**Lecturas.** Sipser, *Introduction to the Theory of Computation*; Hopcroft, Motwani y Ullman, *Introduction to Automata Theory, Languages, and Computation*.

#### I.14 Lógica de primer orden y computabilidad
*48 págs. · Requiere: I.1, I.3, I.13 · Complementario*
- Lenguajes de primer orden, estructuras y satisfacción; consecuencia lógica y deducción formal.
- Teorema de completitud de Gödel y teorema de compacidad; modelos no estándar.
- Funciones recursivas, máquinas de Turing y tesis de Church–Turing; indecidibilidad del problema de la parada, teorema de Rice y décimo problema de Hilbert (enunciado).
- Teoremas de incompletitud de Gödel: idea de la demostración. Para seguir: teoría de la complejidad computacional.

**Puente.** Entrada: `solver.check()` devuelve `unknown` en un resolvedor SMT. Sobre la aritmética entera con multiplicación la satisfacibilidad es indecidible (décimo problema de Hilbert), así que ningún resolvedor puede responder siempre: el `unknown` es un teorema, no un defecto.
**Aplicaciones.** [Cripto] análisis estático de programas y los límites que impone el teorema de Rice · [Datos] SQL como lógica de primer orden y resolvedores SAT y SMT · [Ing] verificación formal de sistemas críticos con asistentes de demostración.
**Lecturas.** Enderton, *A Mathematical Introduction to Logic*; Sipser, *Introduction to the Theory of Computation*.

### Tomo II — Álgebra lineal y el espacio de la práctica

*Requiere: Tomo I · 17 capítulos.* El álgebra lineal completa de una licenciatura, primero sobre un cuerpo cualquiera y luego sobre ℝ y ℂ, con su versión numérica. La Parte C cierra el tomo justo donde el estudiante siente el abismo y lleva el álgebra lineal al espacio de la práctica.

**Parte A — Estructura lineal**

#### II.1 Sistemas lineales y matrices
*40 págs. · Requiere: I.10 · Núcleo*
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
*36 págs. · Requiere: II.3, I.9 · Núcleo*
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

**Puente.** Entrada: `n2 = transpose(inverse(M)) * n`. Una normal es un covector: la forma lineal que se anula en el plano tangente. Tras transformar con M, la forma que sigue anulándose es n ∘ M⁻¹, cuya matriz es (M⁻¹)ᵀ. Con rotaciones (M⁻¹)ᵀ = M, y por eso el error solo aparece con escalas no uniformes.
**Aplicaciones.** [3D] transformación de normales y de planos · [Física] fuerzas y trabajo como covectores · [Datos] los pesos de un modelo lineal como funcional.
**Lecturas.** Axler, *Linear Algebra Done Right*; Halmos, *Finite-Dimensional Vector Spaces*.

#### II.6 Autovalores y autovectores
*40 págs. · Requiere: II.4, I.10 · Núcleo*
- Autovalores, autovectores y polinomio característico.
- Existencia de autovalores en espacios complejos de dimensión finita, por el teorema fundamental del álgebra (III.8).
- Diagonalización y subespacios invariantes.
- Teorema de Cayley–Hamilton y polinomio minimal.
- Autovalores de matrices 3×3: solución trigonométrica de la cúbica.

**Puente.** Entrada: `axis = eigenvector(R, 1)`. El eje de una rotación es el autovector de autovalor 1; el teorema de rotación de Euler (aviso de II.16) es un enunciado sobre autovalores.
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
*44 págs. · Requiere: II.5, I.11 · Núcleo*
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
*44 págs. · Requiere: II.10, I.12 · Núcleo*
- Normas matriciales y número de condición; error hacia adelante y hacia atrás.
- Estabilidad de LU con pivoteo, de QR con Householder y de Cholesky.
- Métodos iterativos de Jacobi y de Gauss–Seidel; convergencia por radio espectral; matrices dispersas.
- Autovalores numéricos: iteración de potencias, iteración inversa y algoritmo QR.

**Puente.** Entrada: `x = inverse(A) * b`. Casi nunca se invierte una matriz para resolver un sistema: es más caro y menos estable que factorizarla, y el número de condición dice cuánto se puede confiar en el resultado.
**Aplicaciones.** [Ing] sistemas dispersos de redes y estructuras · [Datos] PageRank por iteración de potencias · [3D] *solvers* iterativos de física · [Física] discretización de problemas de potencial.
**Lecturas.** Trefethen y Bau, *Numerical Linear Algebra*; Golub y Van Loan, *Matrix Computations*; Saad, *Iterative Methods for Sparse Linear Systems*.

#### II.13 Teoría espectral de grafos
*40 págs. · Requiere: II.9, I.8 · Complementario*
- Matrices de adyacencia y laplaciana de un grafo; el número de componentes como dimensión del núcleo del laplaciano.
- Valor de Fiedler, conductancia y desigualdad de Cheeger (enunciado y uso).
- Agrupamiento espectral e inmersiones por autovectores; paseos aleatorios y matriz de transición.
- Teorema de la matriz-árbol de Kirchhoff; laplacianos ponderados como discretización del laplaciano continuo.

**Puente.** Entrada: `L = D - A` seguido de `valores, vectores = eigh(L)` en un algoritmo de agrupamiento. El autovector del segundo autovalor más chico del laplaciano, el vector de Fiedler, parte el grafo en dos cortando pocas aristas; la desigualdad de Cheeger dice cuánto se puede confiar en ese corte.
**Aplicaciones.** [Datos] agrupamiento espectral y redes neuronales sobre grafos · [3D] procesamiento de mallas con el laplaciano: suavizado, parametrización y descomposición espectral · [Física] modos de vibración de redes de masas y resortes · [Ing] robustez de redes eléctricas y de comunicaciones.
**Lecturas.** Chung, *Spectral Graph Theory*; Spielman, *Spectral and Algebraic Graph Theory*.

**Parte C — Del álgebra lineal al espacio de la práctica**

#### II.14 Espacios afines y coordenadas homogéneas
*40 págs. · Requiere: II.4 · Núcleo*
- Por qué un espacio vectorial no basta: puntos y vectores; espacio afín y su espacio de direcciones.
- Combinaciones afines y convexas; coordenadas baricéntricas en segmentos, triángulos y tetraedros.
- Aplicaciones afines y su inmersión en ℝⁿ⁺¹ como el hiperplano w = 1: las matrices 4×4.
- Composición jerárquica de transformaciones; primera mirada a la proyección en perspectiva y a la división por w (VII.2 y VII.3 la desarrollan).

**Puente.** Entrada: `vec4(p, 1.0)` y `vec4(v, 0.0)`. Los puntos viven en w = 1 y las direcciones en w = 0; por eso una traslación mueve los puntos y deja quietas las direcciones. La «magia» de las matrices 4×4 es el espacio afín visto dentro de un espacio vectorial.
**Aplicaciones.** [3D] matrices 4×4 de modelo y grafos de escena · [Ing] transformaciones entre los eslabones de un robot · [Física] centro de masa como combinación afín.
**Lecturas.** Gallier, *Geometric Methods and Applications*; Lengyel, *Foundations of Game Engine Development*, vol. 1.

#### II.15 Convenciones como elección de isomorfismo
*28 págs. · Requiere: II.5, II.14 · Núcleo*
- Vectores fila y columna: la misma aplicación representada por A o por Aᵀ.
- Orden de almacenamiento por filas o por columnas: una elección independiente de la anterior; las cuatro combinaciones y por qué dos se ven idénticas en memoria.
- Orientación y mano del sistema de ejes; eje «arriba» Y o Z; transformaciones activas y pasivas.
- «Espacios» como marcos de referencia; la matriz de vista como inversa de la transformación de la cámara; cómo identificar una convención a partir de código o documentación, y cómo traducir.

**Puente.** Entrada: una matriz copiada de un tutorial de DirectX que «funciona al revés» en WebGL. Hay que identificar las dos elecciones de cada lado y componer los isomorfismos que las conectan; el capítulo da un procedimiento sistemático para hacerlo.
**Aplicaciones.** [3D] traducción entre las convenciones de Three.js, glTF y WebGPU · [Ing] marcos de referencia y convenciones de ángulos en robótica y aviación · [Física] convenciones de signo y de orientación en electromagnetismo.
**Lecturas.** Lengyel, *Foundations of Game Engine Development*, vol. 1; Dunn y Parberry, *3D Math Primer for Graphics and Game Development*.

#### II.16 Rotaciones: SO(3) y cuaterniones
*48 págs. · Requiere: II.9, II.15, I.9 · Núcleo*
- El grupo SO(3) y el teorema de rotación de Euler; eje y ángulo; fórmula de Rodrigues.
- Ángulos de Euler y de Tait–Bryan; demostración del bloqueo del cardán (*gimbal lock*).
- Cuaterniones de Hamilton: álgebra, conjugado, norma e inversa; cuaterniones unitarios y la esfera S³.
- El recubrimiento doble S³ → SO(3); interpolación SLERP, NLERP con su cota de error, y promedio de orientaciones.

**Puente.** Entrada: `if (dot(q1, q2) < 0.0) q2 = -q2;` antes de interpolar. q y −q representan la misma rotación porque S³ recubre dos veces SO(3); sin esa línea, la interpolación toma el camino largo.
**Aplicaciones.** [3D] cámaras, animación y compresión *smallest-three* · [Ing] actitud de satélites y drones · [Física] matrices de Pauli, SU(2) y espín (aviso de XIII.2).
**Lecturas.** Altmann, *Rotations, Quaternions, and Double Groups*; Hanson, *Visualizing Quaternions*; Shoemake, «Animating Rotation with Quaternion Curves».

#### II.17 Álgebra lineal en precisión finita
*32 págs. · Requiere: II.12, II.16 · Núcleo*
- Deriva de las matrices ortogonales al componerlas en coma flotante; medida de la pérdida de ortogonalidad.
- Re-ortonormalización: Gram–Schmidt frente a descomposición polar; renormalización de cuaterniones.
- Errores en cadenas de transformaciones; la transpuesta en lugar de la inversa para rotaciones.
- Predicados de orientación por determinantes y por qué fallan en coma flotante (VII.10 lo resuelve).

**Puente.** Entrada: `if (frame % 100 == 0) orthonormalize(cameraBasis);`. Tras miles de productos en float32, la matriz deja de ser ortogonal; re-ortonormalizar es proyectar de nuevo sobre SO(3), y la descomposición polar da la rotación más cercana.
**Aplicaciones.** [3D] cámaras y jerarquías que «se deforman» con el tiempo · [Ing] navegación inercial · [Datos] reproducibilidad numérica.
**Lecturas.** Higham, *Accuracy and Stability of Numerical Algorithms*; Shoemake y Duff, «Matrix Animation and Polar Decomposition».

### Tomo III — Análisis en una variable

*Requiere: Tomo I · 12 capítulos.* El análisis real riguroso, de la completitud de ℝ a las series de funciones, con la aproximación, los métodos numéricos y los espacios métricos que necesitan los tomos siguientes.

**Parte A — Límites**

#### III.1 Sucesiones reales y completitud
*44 págs. · Requiere: I.11 · Núcleo*
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

**Puente.** Entrada: `position += velocity * dt` acumulado en un bucle. Es una suma de Riemann: el teorema fundamental dice hacia qué converge, y VIII.12 mide el error cometido.
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
- Teorema fundamental del álgebra, con la demostración de Argand: el módulo de un polinomio alcanza su mínimo, y donde no se anula todavía puede bajar.
- Funciones hiperbólicas.

**Puente.** Entrada: `x = lerp(x, target, 1.0 - exp(-k * dt))`. A diferencia del suavizado de III.1, este no depende de los fotogramas por segundo: 1 − e^(−k·dt) es la fracción exacta que recorre la solución de x′ = k(objetivo − x) en un intervalo dt.
**Aplicaciones.** [3D] suavizado independiente del paso, `atan2` para orientar objetos y codificación gamma (sRGB) de los colores · [Señales] decibeles y escalas logarítmicas · [Bio/Eco] crecimiento y desintegración exponenciales.
**Lecturas.** Spivak, *Calculus*; Rudin, *Principles of Mathematical Analysis*.

**Parte C — Aproximación, cálculo numérico y espacios métricos**

#### III.9 Aproximación e interpolación
*48 págs. · Requiere: III.8, I.6 · Núcleo*
- Teorema de aproximación de Weierstrass, demostrado con polinomios de Bernstein.
- Interpolación de Lagrange y de Newton; error de interpolación y fenómeno de Runge.
- Nodos y polinomios de Chebyshev; aproximación minimax y teorema de equioscilación.
- Interpolación de Hermite y *splines* cúbicos.

**Puente.** Entrada: `pow(1-t,3)*p0 + 3*pow(1-t,2)*t*p1 + 3*(1-t)*t*t*p2 + t*t*t*p3`. Es una curva de Bézier: la combinación de polinomios de Bernstein con la que se demuestra el teorema de Weierstrass. La herramienta de diseño y la demostración son la misma construcción.
**Aplicaciones.** [3D] curvas de Bézier y *easing* de Hermite · [Señales] funciones trigonométricas rápidas por aproximación minimax · [Ing] tablas de calibración interpoladas.
**Lecturas.** Trefethen, *Approximation Theory and Approximation Practice*; Davis, *Interpolation and Approximation*.

#### III.10 Métodos numéricos en una variable
*44 págs. · Requiere: III.9, I.12 · Núcleo*
- Bisección, Newton, secante y punto fijo; orden de convergencia y criterios de parada.
- Raíces de polinomios: cuadráticas estables, esquema de Horner y deflación.
- Cuadratura: trapecio, Simpson, Gauss–Legendre y cuadratura adaptativa, con su análisis de error.
- Derivación numérica y elección del paso en coma flotante.

**Puente.** Entrada: `y = y * (1.5 - 0.5 * x * y * y)`. Es un paso de Newton para 1/√x, el corazón de la célebre raíz cuadrada inversa rápida; el análisis de convergencia de Newton dice cuántas cifras gana cada paso.
**Aplicaciones.** [3D] raíz inversa rápida e inversión de curvas de *easing* · [Ing] ecuaciones de estado no lineales · [Bio/Eco] tasa interna de retorno.
**Lecturas.** Burden, Faires y Burden, *Análisis numérico*; Süli y Mayers, *An Introduction to Numerical Analysis*.

#### III.11 Análisis de algoritmos
*36 págs. · Requiere: III.7, III.5, I.6 · Complementario*
- Modelos de costo; notaciones O, Ω y Θ; caso peor, caso promedio y costo amortizado.
- Recurrencias de divide y vencerás, árboles de recursión y teorema maestro.
- Sumas e integrales: cotas por comparación con integrales y la aproximación de Stirling.
- Análisis amortizado con potenciales; cotas inferiores por árboles de decisión: ordenar requiere Ω(n log n) comparaciones.

**Puente.** Entrada: `merge_sort(a)`, que parte el arreglo en dos, ordena cada mitad y mezcla los resultados. Su costo cumple T(n) = 2T(n/2) + n, y el teorema maestro da T(n) = Θ(n log n); un árbol de decisión muestra que ningún algoritmo que solo compare puede hacerlo mejor.
**Aplicaciones.** [Cripto] costo de los algoritmos y tamaño de las claves · [3D] estructuras espaciales frente a fuerza bruta en la detección de colisiones: de O(n²) a O(n log n) · [Datos] escalabilidad de los algoritmos sobre grandes volúmenes de datos · [Física] la aproximación de Stirling en la mecánica estadística.
**Lecturas.** Cormen, Leiserson, Rivest y Stein, *Introduction to Algorithms*; Graham, Knuth y Patashnik, *Concrete Mathematics*.

#### III.12 Espacios métricos
*48 págs. · Requiere: III.6 · Núcleo*
- Espacios métricos y normados; abiertos, cerrados y clausura.
- Convergencia, completitud y espacios de Banach; C[a, b] con la norma del supremo.
- Compacidad, conexidad y continuidad; teorema de Arzelà–Ascoli (enunciado y uso; se demuestra en VI.4).
- Teorema del punto fijo de Banach. La topología general llega en el Tomo VI.

**Puente.** Entrada: un *solver* iterativo que «a veces no converge». El teorema de Banach da la condición: si la iteración es contractiva, converge desde cualquier punto y con velocidad conocida; si no lo es, no hay garantía.
**Aplicaciones.** [Ing] convergencia de métodos iterativos · [Datos] distancias y medidas de similitud · [3D] distancia de Hausdorff para comparar mallas.
**Lecturas.** Rudin, *Principles of Mathematical Analysis*; Searcóid, *Metric Spaces*.

### Tomo IV — Análisis en varias variables y optimización

*Requiere: Tomos II y III · 14 capítulos.* Derivar e integrar en ℝⁿ, optimizar con y sin restricciones, y los teoremas integrales del cálculo vectorial.

**Parte A — Cálculo diferencial**

#### IV.1 Topología de ℝⁿ y continuidad
*28 págs. · Requiere: III.12, II.8 · Núcleo*
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

**Puente.** Entrada: `support(shape, dir)` en un detector de colisiones. Una forma convexa queda determinada por su función de soporte; GJK (aviso de VII.11) trabaja solo con ella, sobre la diferencia de Minkowski.
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

#### IV.9 Programación dinámica
*36 págs. · Requiere: I.8, III.12 · Complementario*
- Principio de optimalidad de Bellman; subproblemas que se solapan y memoización.
- Caminos mínimos con pesos negativos (Bellman–Ford y Floyd–Warshall); alineación de secuencias.
- Procesos de decisión de Markov finitos; ecuación de Bellman e iteración de valores como contracción, por el punto fijo de Banach.
- Algoritmo de Viterbi en los modelos ocultos de Markov.

**Puente.** Entrada: `V[s] = max(r[s][a] + γ * sum(P[s][a][t] * V[t] for t in estados) for a in acciones)`, la actualización de un agente de aprendizaje por refuerzo. Es la ecuación de Bellman, y como ese operador es una contracción de factor γ, el teorema del punto fijo de Banach garantiza que la iteración converge al valor óptimo.
**Aplicaciones.** [Datos] aprendizaje por refuerzo e iteración de valores · [Bio/Eco] alineación de secuencias de ADN y de proteínas · [Señales] decodificación de Viterbi en comunicaciones y en reconocimiento de voz · [3D] planificación de caminos y comportamiento de agentes en videojuegos.
**Lecturas.** Bertsekas, *Dynamic Programming and Optimal Control*; Sutton y Barto, *Reinforcement Learning: An Introduction*.

**Parte C — Cálculo integral**

#### IV.10 Integral múltiple
*48 págs. · Requiere: IV.3, III.5 · Núcleo*
- Integral de Riemann en rectángulos; conjuntos de medida nula y criterio de Lebesgue (enunciado).
- Teorema de Fubini.
- Teorema del cambio de variables, con demostración.
- Coordenadas polares, cilíndricas y esféricas; integración sobre la esfera y ángulo sólido.

**Puente.** Entrada: `E += L(dir) * cos(theta) * sin(theta) * dTheta * dPhi`. La irradiancia es una integral sobre el hemisferio respecto del ángulo sólido; el factor sen θ es el jacobiano de las coordenadas esféricas, y olvidarlo es el error más común al muestrear direcciones.
**Aplicaciones.** [3D] radiometría: irradiancia, intensidad y radiancia como densidades respecto del área y del ángulo sólido, con sus unidades fotométricas (lux, candelas y nits) · [Física] centros de masa y momentos de inercia · [Datos] densidades conjuntas (aviso de XI.2).
**Lecturas.** Munkres, *Analysis on Manifolds*; Marsden y Tromba, *Vector Calculus*.

#### IV.11 Integrales de línea y de superficie
*40 págs. · Requiere: IV.10 · Núcleo*
- Curvas parametrizadas, longitud de arco e integrales de línea.
- Campos vectoriales, trabajo y campos conservativos; potencial.
- Superficies parametrizadas, área e integrales de superficie.
- Flujo de un campo a través de una superficie.

**Puente.** Entrada: `area += 0.5 * length(cross(b - a, c - a))` sobre los triángulos de una malla. Es la integral de superficie de la función 1 discretizada: el producto vectorial es el elemento de área de la parametrización.
**Aplicaciones.** [Física] trabajo y circulación · [3D] área de mallas y flujo a través de superficies · [Ing] caudal a través de una sección.
**Lecturas.** Marsden y Tromba, *Vector Calculus*; Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*.

#### IV.12 Teoremas integrales del cálculo vectorial
*44 págs. · Requiere: IV.11 · Núcleo*
- Divergencia, rotacional y laplaciano.
- Teoremas de Green, de Stokes y de la divergencia.
- Identidades vectoriales; potenciales escalares y vectoriales.
- Descomposición de Helmholtz–Hodge en ℝ³.

**Puente.** Entrada: `volume += dot(a, cross(b, c)) / 6.0` sobre los triángulos de una malla cerrada. El volumen, la masa, el centroide y el tensor de inercia de un sólido se calculan solo con su borde: es el teorema de la divergencia.
**Aplicaciones.** [3D] masa, centroide e inercia exactos de mallas · [Física] ecuaciones de Maxwell en forma integral · [Ing] conservación de la masa en fluidos.
**Lecturas.** Marsden y Tromba, *Vector Calculus*; Mirtich, «Fast and Accurate Computation of Polyhedral Mass Properties».

#### IV.13 Coordenadas curvilíneas y cálculo tensorial en ℝⁿ
*40 págs. · Requiere: IV.12, II.11 · Núcleo*
- Coordenadas curvilíneas, base coordenada y factores de escala; coordenadas ortogonales.
- El tensor métrico en coordenadas; símbolos de Christoffel en el espacio euclídeo.
- Gradiente, divergencia, rotacional y laplaciano en coordenadas curvilíneas, deducidos de forma intrínseca.
- Derivada covariante de campos vectoriales y tensoriales en ℝⁿ.

**Puente.** Entrada: el laplaciano en esféricas tal como aparece en un libro de física, (1/r²) ∂_r(r² ∂_r f) + … . No es una fórmula para memorizar: sale de la métrica en esféricas, y los factores r² y sen θ vienen de la raíz del determinante del tensor métrico. El capítulo también traduce entre la convención de la física (θ polar) y la de muchos textos de cálculo (θ azimutal).
**Aplicaciones.** [Física] electromagnetismo y potenciales en geometrías esféricas y cilíndricas · [Ing] elasticidad en tubos y recipientes a presión · [3D] simulación sobre la superficie de un planeta en coordenadas esféricas.
**Lecturas.** Marsden y Tromba, *Vector Calculus*; Arfken, Weber y Harris, *Mathematical Methods for Physicists*.

#### IV.14 Formas diferenciales y teorema de Stokes general
*44 págs. · Requiere: IV.12, II.4 · Complementario*
- Álgebra exterior: producto exterior; bivectores y trivectores como áreas y volúmenes orientados.
- Formas diferenciales en ℝⁿ, derivada exterior y *pullback*.
- Integración de formas y teorema de Stokes general; Green, Stokes y Gauss como casos particulares.
- Formas cerradas y exactas; lema de Poincaré. Para seguir: álgebra geométrica y PGA.

**Puente.** Entrada: `cross(a, b)` en ℝ³ frente a `a ^ b` en una biblioteca de álgebra geométrica. El producto vectorial es un bivector disfrazado de vector, y por eso solo existe en dimensión 3; el álgebra exterior lo generaliza a cualquier dimensión.
**Aplicaciones.** [Física] electromagnetismo con formas diferenciales · [3D] áreas orientadas y álgebra geométrica · [Ing] termodinámica: diferenciales exactas e inexactas.
**Lecturas.** Hubbard y Hubbard, *Vector Calculus, Linear Algebra, and Differential Forms*; Spivak, *Calculus on Manifolds*.

### Tomo V — Álgebra: grupos, anillos, módulos y cuerpos

*Requiere: Tomo II · 9 capítulos.* El álgebra abstracta de una licenciatura, de la estructura de los grupos finitos a la teoría de Galois, con los módulos sobre un dominio de ideales principales como puente con el álgebra lineal. Explica por qué no hay fórmula para la quíntica y sostiene la criptografía de curvas elípticas y el cálculo simbólico.

**Parte A — Grupos**

#### V.1 Grupos: teoremas de isomorfismo, acciones y teoremas de Sylow
*48 págs. · Requiere: I.9 · Núcleo*
- Teoremas de isomorfismo y de correspondencia; productos directos y semidirectos.
- Acción por conjugación, ecuación de clases y centro de un p-grupo.
- Teoremas de Sylow y clasificación de los grupos de orden pequeño.
- Grupos simples; simplicidad de Aₙ para n ≥ 5.

**Puente.** Entrada: `SpaceGroup(225)` en una biblioteca de cristalografía. Un grupo espacial es una extensión de un retículo de traslaciones por un grupo puntual finito, muchas veces un producto semidirecto; el capítulo da las herramientas para clasificarlos.
**Aplicaciones.** [Física] grupos espaciales y puntuales en cristalografía · [3D] simetrías de mosaicos y teselaciones para la generación procedural · [Cripto] el ataque de Pohlig–Hellman y por qué se trabaja en subgrupos de orden primo.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Artin, *Algebra*.

#### V.2 Grupos resolubles, series de composición y presentaciones
*40 págs. · Requiere: V.1 · Núcleo*
- Series de composición y teorema de Jordan–Hölder.
- Conmutadores; grupos resolubles y nilpotentes.
- Grupos libres, generadores y relaciones; presentaciones de grupos.
- El problema de la palabra; grupos de trenzas y grupos de rompecabezas.

**Puente.** Entrada: `R U R' U'`, una secuencia del cubo de Rubik. Es un conmutador en el grupo del cubo; los conmutadores mueven pocas piezas, y por eso los métodos de resolución se construyen con ellos.
**Aplicaciones.** [3D] el cubo de Rubik y los rompecabezas como grupos de permutaciones · [Física] grupos de trenzas y estadística de partículas en el plano · [Cripto] criptografía basada en grupos no conmutativos.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Rotman, *An Introduction to the Theory of Groups*.

**Parte B — Anillos y módulos**

#### V.3 Anillos: ideales, factorización única y dominios de ideales principales
*44 págs. · Requiere: I.10, I.4 · Núcleo*
- Ideales primos y maximales; existencia de ideales maximales por el lema de Zorn.
- Dominios de factorización única, de ideales principales y euclídeos; enteros de Gauss.
- Lema de Gauss y criterio de Eisenstein; factorización en ℤ[x] y en k[x, y].
- Localización y cuerpo de fracciones; teorema chino del resto para anillos.

**Puente.** Entrada: `factor(x**4 + 1)` en un sistema de álgebra computacional, que responde distinto sobre ℚ, sobre ℤ/2ℤ y sobre ℂ. La factorización depende del anillo, y el capítulo dice cuándo es única y cómo decidir la irreducibilidad.
**Aplicaciones.** [Cripto] códigos cíclicos y BCH como ideales de 𝔽_q[x]/(xⁿ − 1) · [3D] cálculo exacto de intersecciones de curvas implícitas mediante factorización.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Atiyah y Macdonald, *Introduction to Commutative Algebra*.

#### V.4 Módulos y teorema de estructura sobre un dominio de ideales principales
*48 págs. · Requiere: V.3, II.7 · Núcleo*
- Módulos, submódulos, cocientes y sucesiones exactas; módulos libres.
- Forma normal de Smith para matrices sobre un dominio de ideales principales.
- Teorema de estructura de los módulos finitamente generados; clasificación de los grupos abelianos finitamente generados.
- Formas canónicas racional y de Jordan como corolario: un operador lineal es un k[x]-módulo.

**Puente.** Entrada: `smith_normal_form(A)` aplicado a la matriz de un retículo. La forma de Smith diagonaliza una matriz entera con cambios de base enteros, y de ella se leen el grupo cociente ℤⁿ/Aℤⁿ y los invariantes del retículo: es el mismo teorema que da la forma de Jordan.
**Aplicaciones.** [Física] retículos cristalinos y redes recíprocas · [Cripto] la forma normal de Hermite en la criptografía de retículos postcuántica · [3D] texturas periódicas y dominios fundamentales de un retículo.
**Lecturas.** Dummit y Foote, *Abstract Algebra*; Hungerford, *Algebra*.

**Parte C — Cuerpos y teoría de Galois**

#### V.5 Extensiones de cuerpos y construcciones con regla y compás
*44 págs. · Requiere: V.3, II.2 · Núcleo*
- Extensiones algebraicas y trascendentes; grado y ley de la torre.
- Cuerpo de descomposición de un polinomio y clausura algebraica, que existe por el lema de Zorn.
- Números construibles con regla y compás; imposibilidad de duplicar el cubo, trisecar el ángulo y cuadrar el círculo (la trascendencia de π, enunciada).
- Polígonos regulares construibles y primos de Fermat.

**Puente.** Entrada: `sqrt` es la única raíz que ofrece un núcleo geométrico exacto. Con sumas, productos, cocientes y raíces cuadradas solo se alcanzan números de grado 2ᵏ sobre ℚ: por eso ese núcleo no puede trisecar un ángulo sin salir de esas operaciones.
**Aplicaciones.** [3D] aritmética exacta con raíces cuadradas en núcleos geométricos robustos · [Cripto] cuerpos finitos como extensiones de ℤ/pℤ en AES y en los códigos correctores · [Ing] plegado de papel y estructuras desplegables: construcciones que resuelven cúbicas.
**Lecturas.** Stewart, *Galois Theory*; Artin, *Algebra*.

#### V.6 Teoría de Galois
*48 págs. · Requiere: V.5, V.1 · Núcleo*
- Extensiones normales y separables; grupo de Galois de una extensión.
- Teorema fundamental de la teoría de Galois: correspondencia entre subgrupos y cuerpos intermedios.
- Grupos de Galois de los cuerpos finitos y automorfismo de Frobenius; extensiones ciclotómicas.
- Grupos de Galois de polinomios de grado bajo; discriminante. Para seguir: teoría de Galois infinita y teoría algebraica de números.

**Puente.** Entrada: `y = x ** p` en la aritmética de 𝔽_{pⁿ}, que deja fijos los elementos del subcuerpo primo. Es el automorfismo de Frobenius, que genera el grupo de Galois de un cuerpo finito: los subcuerpos de 𝔽_{pⁿ} corresponden a los divisores de n.
**Aplicaciones.** [Cripto] el Frobenius en la aritmética rápida de cuerpos finitos y de curvas · [Señales] raíces de la unidad, polinomios ciclotómicos y algoritmos de FFT para longitudes primas.
**Lecturas.** Stewart, *Galois Theory*; Dummit y Foote, *Abstract Algebra*.

#### V.7 Solubilidad por radicales y ecuaciones polinomiales
*36 págs. · Requiere: V.6, V.2 · Núcleo*
- Extensiones radicales y grupos de Galois resolubles.
- Las fórmulas de la cúbica y de la cuártica, deducidas de su grupo de Galois.
- Teorema de Abel–Ruffini: la quíntica general no es resoluble por radicales; un ejemplo explícito con grupo S₅.
- Consecuencias para el cálculo: por qué las raíces de grado mayor o igual que 5 se calculan con métodos iterativos.

**Puente.** Entrada: `roots = np.roots(coeffs)`, que calcula los autovalores de la matriz compañera en lugar de aplicar una fórmula. Para grado 5 o más no hay fórmula con radicales, por el teorema de Abel–Ruffini, así que toda biblioteca itera; para grado 3 y 4 la fórmula existe, pero es numéricamente inestable.
**Aplicaciones.** [3D] intersección de un rayo con un toro: una cuártica, y cuándo conviene la fórmula o la iteración · [Ing] polinomios característicos en control y criterios de estabilidad que evitan calcular raíces.
**Lecturas.** Stewart, *Galois Theory*; Tignol, *Galois’ Theory of Algebraic Equations*.

**Parte D — Álgebra computacional**

#### V.8 Curvas elípticas y criptografía
*44 págs. · Requiere: V.5, I.10 · Complementario*
- Curvas cúbicas en el plano proyectivo; forma de Weierstrass y discriminante.
- Ley de grupo por cuerdas y tangentes; asociatividad.
- Curvas sobre cuerpos finitos: teorema de Hasse (enunciado) y conteo de puntos.
- El logaritmo discreto elíptico: intercambio de claves y firmas (ECDH y ECDSA); por qué ciertas curvas son débiles.

**Puente.** Entrada: `X25519(private_key, public_key)`, el intercambio de claves de casi toda conexión segura de la web. Es multiplicar un punto de una curva elíptica sobre 𝔽_p por un entero, y su seguridad es la dificultad del logaritmo discreto en ese grupo.
**Aplicaciones.** [Cripto] TLS, firmas digitales y criptomonedas · [Ing] firmas digitales en sistemas embebidos y actualizaciones seguras de *firmware*.
**Lecturas.** Silverman y Tate, *Rational Points on Elliptic Curves*; Washington, *Elliptic Curves: Number Theory and Cryptography*.

#### V.9 Bases de Gröbner y geometría algebraica computacional
*44 págs. · Requiere: V.3 · Complementario*
- Órdenes monomiales, división multivariable y bases de Gröbner; algoritmo de Buchberger.
- Eliminación de variables e implicitación de curvas y superficies paramétricas.
- Variedades afines e ideales; Nullstellensatz de Hilbert (enunciado y uso).
- Resolución de sistemas polinomiales y su costo. Para seguir: geometría algebraica.

**Puente.** Entrada: `groebner([x**2 + y**2 - 1, x - y], x, y)`. Una base de Gröbner es al sistema polinomial lo que la forma escalonada es al sistema lineal: triangula, y de ella se leen las soluciones.
**Aplicaciones.** [3D] implicitación de superficies paramétricas para el trazado de rayos · [Ing] cinemática inversa de robots resuelta en forma exacta.
**Lecturas.** Cox, Little y O’Shea, *Ideals, Varieties, and Algorithms*; Sturmfels, *Solving Systems of Polynomial Equations*.

### Tomo VI — Topología

*Requiere: Tomos II y III; importa IV.6, V.2 y V.4 por interfaz · 11 capítulos.* La topología general, de los espacios topológicos a la metrización y el teorema de Baire, y la topología algebraica básica: el grupo fundamental, los recubrimientos y la homología simplicial. Da el lenguaje de la convergencia que usa el análisis funcional y los invariantes que explican las mallas, los mundos periódicos y la forma de los datos. VI.1 a VI.5 solo usan los Tomos I, II y III.

**Parte A — Topología general**

#### VI.1 Espacios topológicos y continuidad
*44 págs. · Requiere: III.12, I.2 · Núcleo*
- Topologías, bases y subbases; interior, clausura y frontera; sucesiones y redes.
- Funciones continuas y homeomorfismos; topologías inicial y final.
- Subespacios, productos y cocientes; pegado de espacios.
- Ejemplos: la recta de Sorgenfrey, la topología de Zariski y el toro como cociente del cuadrado.

**Puente.** Entrada: `pos = (pos + vel * dt) % worldSize`, el mundo que se cierra sobre sí mismo en un videojuego. Ese mundo es un toro, el cociente del rectángulo que identifica los bordes opuestos, y la continuidad en el cociente es lo que hace que un objeto cruce el borde sin saltar.
**Aplicaciones.** [3D] mundos periódicos y mapas que se cierran sobre sí mismos · [Física] condiciones de contorno periódicas en simulaciones de materiales · [Datos] topologías en espacios de modelos y de funciones.
**Lecturas.** Munkres, *Topology*; Willard, *General Topology*.

#### VI.2 Conexión y compacidad
*44 págs. · Requiere: VI.1, I.4 · Núcleo*
- Espacios conexos y arcoconexos; componentes.
- Compacidad, compacidad por sucesiones y propiedad de la intersección finita.
- Teorema de Tychonoff, con el lema de Zorn.
- Compacidad local y compactificación de Alexandroff; la esfera de Riemann.

**Puente.** Entrada: `assert(isConnected(navmesh))` antes de buscar un camino. Que dos puntos se puedan unir por un camino es la arcoconexión; las componentes de la malla de navegación son las regiones a las que un agente nunca podrá llegar desde las otras.
**Aplicaciones.** [3D] componentes conexas de mallas y de mallas de navegación · [Bio/Eco] existencia de equilibrios por compacidad en economía · [Datos] agrupamiento por componentes conexas de un grafo de vecindad.
**Lecturas.** Munkres, *Topology*; Willard, *General Topology*.

#### VI.3 Separación, numerabilidad y metrización
*40 págs. · Requiere: VI.2 · Núcleo*
- Axiomas de numerabilidad: primero y segundo; separabilidad.
- Axiomas de separación: espacios de Hausdorff, regulares y normales.
- Lema de Urysohn y teorema de extensión de Tietze; particiones de la unidad.
- Teorema de metrización de Urysohn.

**Puente.** Entrada: `blend = sum(w[i](x) * f[i](x))` con pesos que suman 1, la mezcla suave de aproximaciones locales. Es una partición de la unidad, y su existencia en los espacios normales sale del lema de Urysohn: la misma herramienta que pega las cartas locales de una variedad.
**Aplicaciones.** [3D] mezcla suave de deformaciones y *skinning* con particiones de la unidad · [Ing] interpolación con funciones de base radial y métodos sin malla en simulación · [Física] la condición de Hausdorff en la definición de espacio-tiempo.
**Lecturas.** Munkres, *Topology*; Willard, *General Topology*.

#### VI.4 Espacios métricos completos: Baire, completación y Arzelà–Ascoli
*36 págs. · Requiere: VI.1 · Núcleo*
- Completación de un espacio métrico; ℝ como completación de ℚ, revisitada.
- Teorema de Baire y sus consecuencias: las funciones continuas que no son derivables en ningún punto son genéricas.
- Teorema de Arzelà–Ascoli, con demostración.
- Compacidad en espacios de funciones y teorema de Stone–Weierstrass.

**Puente.** Entrada: una prueba que compara dos curvas por su distancia máxima, `max(abs(f(t) - g(t)))`. Es la métrica del supremo en C[a, b]: Arzelà–Ascoli dice cuándo una familia de curvas tiene subsucesiones convergentes, y Stone–Weierstrass, por qué los polinomios bastan para aproximarlas.
**Aplicaciones.** [Señales] aproximación de señales por polinomios trigonométricos · [Física] funciones continuas sin derivada y el movimiento browniano · [Datos] aproximación universal de las redes neuronales vía Stone–Weierstrass.
**Lecturas.** Munkres, *Topology*; Rudin, *Principles of Mathematical Analysis*.

**Parte B — Topología algebraica**

#### VI.5 Homotopía y grupo fundamental
*44 págs. · Requiere: VI.2, I.9 · Núcleo*
- Homotopía de aplicaciones y de caminos; espacios contráctiles; equivalencia homotópica.
- Grupo fundamental e invariancia por homotopía.
- Grupo fundamental del círculo: grado de un lazo y número de vueltas.
- Retractos y retractos por deformación; teorema de Brouwer en dimensión 2.

**Puente.** Entrada: `angle += wrapToPi(newAngle - angle)`, el truco para acumular un ángulo sin saltos de 2π. El ángulo acumulado es el levantamiento del lazo por el recubrimiento ℝ → S¹, y su total dividido por 2π es el número de vueltas: un elemento del grupo fundamental del círculo.
**Aplicaciones.** [3D] ángulos acumulados y desenrollado de fase en animación · [Física] el efecto Aharonov–Bohm y el grupo fundamental del plano sin un punto · [Ing] número de vueltas y criterio de estabilidad de Nyquist.
**Lecturas.** Hatcher, *Algebraic Topology*; Massey, *A Basic Course in Algebraic Topology*.

#### VI.6 Recubrimientos y teorema de Seifert–van Kampen
*44 págs. · Requiere: VI.5, V.2 · Núcleo*
- Espacios recubridores; levantamiento de caminos y de homotopías.
- Recubrimiento universal y clasificación de los recubrimientos por subgrupos del grupo fundamental.
- Teorema de Seifert–van Kampen; grupos fundamentales de grafos, del toro y de las superficies.
- Acciones de grupos propiamente discontinuas y espacios de órbitas.

**Puente.** Entrada: un nivel de videojuego con portales, o un mapa que se repite al infinito. El mundo infinito que se repite es el recubrimiento universal del nivel, y el grupo de traslaciones que lo repite es su grupo fundamental, que actúa por transformaciones de recubrimiento.
**Aplicaciones.** [3D] portales, mundos que se repiten y espacios de órbitas en videojuegos · [Física] el espín y el recubrimiento SU(2) → SO(3) · [Ing] planificación de trayectorias por clases de homotopía.
**Lecturas.** Hatcher, *Algebraic Topology*; Massey, *A Basic Course in Algebraic Topology*.

#### VI.7 Complejos simpliciales y homología
*48 págs. · Requiere: VI.5, V.4 · Núcleo*
- Complejos simpliciales, triangulaciones y realización geométrica.
- Complejos de cadenas, homología simplicial y números de Betti.
- Invariancia topológica (enunciada) y homología singular como idea; sucesión de Mayer–Vietoris.
- Característica de Euler–Poincaré; cálculo de la homología con la forma normal de Smith. Para seguir: álgebra homológica y teoría de categorías.

**Puente.** Entrada: `rank(boundary_matrix)` en una biblioteca de geometría discreta. Los números de Betti, que cuentan componentes, túneles y cavidades, son dimensiones de núcleos módulo imágenes de matrices de borde: la homología es álgebra lineal sobre un complejo.
**Aplicaciones.** [3D] detección de agujeros y túneles en mallas y en vóxeles · [Ing] cobertura de redes de sensores sin conocer sus posiciones · [Física] campos irrotacionales sin potencial en dominios con agujeros.
**Lecturas.** Hatcher, *Algebraic Topology*; Munkres, *Elements of Algebraic Topology*.

#### VI.8 Clasificación de superficies
*36 págs. · Requiere: VI.7, VI.6 · Complementario*
- Superficies como cocientes de polígonos; orientabilidad.
- Teorema de clasificación de las superficies compactas.
- Característica de Euler, orientabilidad y género como invariantes completos.
- Superficies con borde y suma conexa.

**Puente.** Entrada: `genus = (2 - V + E - F) / 2` en un procesador de mallas. La fórmula vale porque toda superficie cerrada orientable es una esfera con g asas, y la característica de Euler V − E + F = 2 − 2g las distingue: el capítulo demuestra ese teorema de clasificación.
**Aplicaciones.** [3D] género, asas y cortes para parametrizar mallas · [Bio/Eco] topología de las superficies corticales en neuroimagen · [Ing] mallado de superficies para la fabricación.
**Lecturas.** Massey, *A Basic Course in Algebraic Topology*; Kinsey, *Topology of Surfaces*.

**Parte C — Topología aplicada**

#### VI.9 Grado y teoremas de punto fijo
*40 págs. · Requiere: VI.7 · Complementario*
- Grado de una aplicación entre esferas; teorema de la bola peluda.
- Teorema del punto fijo de Brouwer en dimensión n y teorema de Borsuk–Ulam.
- Lema de Sperner y su demostración combinatoria del teorema de Brouwer.
- Número de Lefschetz (enunciado) y teorema de Kakutani.

**Puente.** Entrada: `lookAt(eye, target, up)`, que falla cuando la cámara mira justo hacia arriba. No es un error del código: el teorema de la bola peluda dice que no hay un campo continuo de vectores tangentes no nulos sobre la esfera, así que toda regla para elegir el «arriba» de la cámara tiene una singularidad.
**Aplicaciones.** [3D] cámaras, marcos de referencia y la singularidad inevitable del vector «arriba» · [Bio/Eco] existencia del equilibrio de Nash y del equilibrio general en economía · [Física] puntos de calma en un campo de viento sobre la superficie terrestre.
**Lecturas.** Milnor, *Topology from the Differentiable Viewpoint*; Hatcher, *Algebraic Topology*.

#### VI.10 Teoría de juegos
*36 págs. · Requiere: VI.9, IV.6 · Complementario*
- Juegos en forma normal; estrategias puras y mixtas; dominancia.
- Juegos de suma cero y teorema minimax de von Neumann, por dualidad lineal.
- Equilibrio de Nash: existencia por el teorema de Kakutani y cálculo en juegos de dos jugadores.
- Juegos en forma extensiva e inducción hacia atrás; dinámica del replicador.

**Puente.** Entrada: `minimax(nodo, profundidad)` en la inteligencia artificial de un juego de tablero. Recorre el árbol del juego alternando máximos y mínimos; el teorema minimax de von Neumann dice que, con estrategias mixtas, el valor de un juego de suma cero no depende de quién elige primero.
**Aplicaciones.** [3D] inteligencia artificial de juegos: búsqueda minimax y poda alfa-beta · [Bio/Eco] subastas, mercados y teoría evolutiva de juegos · [Datos] entrenamiento adversario como juego de dos jugadores · [Ing] asignación de recursos y enrutamiento en redes.
**Lecturas.** Osborne y Rubinstein, *A Course in Game Theory*; Maschler, Solan y Zamir, *Game Theory*.

#### VI.11 Homología persistente y análisis topológico de datos
*40 págs. · Requiere: VI.7 · Complementario*
- Filtraciones de complejos: complejos de Čech y de Vietoris–Rips.
- Homología persistente, diagramas de persistencia y códigos de barras.
- Teorema de estabilidad (enunciado) y distancia de cuello de botella.
- El algoritmo de reducción matricial y su costo; el método Mapper.

**Puente.** Entrada: `ripser(points)`, que devuelve pares (nacimiento, muerte). Cada par es un agujero que aparece y desaparece al engordar los puntos; los que viven mucho son la forma de los datos, y el teorema de estabilidad garantiza que el ruido solo produce pares cortos.
**Aplicaciones.** [Datos] la forma de las nubes de puntos y la detección de ciclos en los datos · [Bio/Eco] estructura de proteínas y de redes neuronales biológicas · [3D] reconstrucción robusta de superficies a partir de escaneos.
**Lecturas.** Edelsbrunner y Harer, *Computational Topology*; Carlsson, «Topology and Data».

### Tomo VII — Geometría

*Requiere: Tomos II, III y IV · 15 capítulos.* Las geometrías clásicas como estudio de grupos de transformaciones, las curvas y superficies de diseño, la geometría diferencial clásica y la geometría computacional y discreta. VII.1, VII.2, VII.3 y VII.6 solo usan los Tomos II y III, así que se pueden leer justo después del álgebra lineal.

**Parte A — Geometrías y grupos de transformaciones**

#### VII.1 Isometrías y simetría
*40 págs. · Requiere: II.16, I.9 · Núcleo*
- Las isometrías de ℝⁿ son afines; clasificación en el plano y en el espacio.
- Todo movimiento es producto de reflexiones.
- Grupos de simetría finitos: cíclicos, diédricos y de los poliedros regulares.
- Grupos de friso y grupos cristalográficos del plano.

**Puente.** Entrada: `scale(-1, 1, 1)` en un editor que «da vuelta» las normales de un modelo. Una reflexión invierte la orientación (determinante −1); la clasificación de las isometrías explica qué se puede componer y qué no.
**Aplicaciones.** [3D] teselaciones, simetrías de modelos, espejos y orientación · [Física] cristalografía · [Bio/Eco] simetrías de virus y de moléculas.
**Lecturas.** Coxeter, *Introduction to Geometry*; Armstrong, *Groups and Symmetry*.

#### VII.2 Geometría proyectiva
*44 págs. · Requiere: II.14 · Núcleo*
- Plano y espacio proyectivos; coordenadas homogéneas y puntos del infinito.
- Dualidad punto–recta; transformaciones proyectivas y su teorema fundamental.
- Razón doble y su invariancia.
- Cónicas proyectivas; teoremas de Desargues y de Pappus.

**Puente.** Entrada: `vec3 line = cross(p, q)` con puntos en coordenadas homogéneas. En el plano proyectivo, la recta por dos puntos y el punto de corte de dos rectas son el mismo producto vectorial: dualidad sin casos especiales, incluidas las rectas paralelas.
**Aplicaciones.** [3D] intersecciones robustas en coordenadas homogéneas · [Datos] visión por computador: rectificación de fotografías · [Ing] fotogrametría y topografía.
**Lecturas.** Richter-Gebert, *Perspectives on Projective Geometry*; Coxeter, *Projective Geometry*.

#### VII.3 Cámaras, proyección y geometría de varias vistas
*44 págs. · Requiere: VII.2, II.10, II.17 · Núcleo*
- Cámara estenopeica; matrices de proyección en perspectiva y ortográfica; volumen de visión.
- Coordenadas de recorte y normalizadas; distribución de la profundidad y su precisión en coma flotante.
- Rasterización: funciones de arista como determinantes, coordenadas baricéntricas e interpolación con corrección de perspectiva.
- Homografías, geometría epipolar y matriz fundamental; calibración por DLT.

**Puente.** Entrada: `gl_Position = proj * view * model * vec4(p, 1.0)`, seguido de la división por w. Es una cadena de cambios de marco afines (II.14) y una transformación proyectiva; Reverse-Z funciona porque la coma flotante es más densa cerca de 0, justo donde la proyección comprime la profundidad lejana.
**Aplicaciones.** [3D] *pipeline* de cámara, Reverse-Z, *frustum culling* y mapas de sombras · [Datos] reconstrucción 3D a partir de fotografías · [Ing] calibración de cámaras industriales.
**Lecturas.** Hartley y Zisserman, *Multiple View Geometry in Computer Vision*; Lengyel, *Foundations of Game Engine Development*, vol. 2.

#### VII.4 Grupos de Lie de matrices
*48 págs. · Requiere: II.16, III.8, IV.3 · Núcleo*
- Grupos de matrices como subvariedades: SO(n), SE(n) y SU(2); álgebras de Lie y corchete.
- Exponencial y logaritmo de matrices; fórmula de Baker–Campbell–Hausdorff (enunciado).
- SU(2) → SO(3) como recubrimiento doble; interpolación y promedios en grupos.
- SE(3), teorema de Chasles en el espacio, números duales y cuaterniones duales.

**Puente.** Entrada: `pose = exp(twist * t)` en una biblioteca de robótica. Interpolar un movimiento rígido es recorrer un subgrupo a un parámetro de SE(3); por eso interpolar matrices entrada por entrada deforma los objetos y la exponencial no.
**Aplicaciones.** [3D] *skinning* con cuaterniones duales y cinemática directa como producto de exponenciales · [Ing] robótica y estimación de estado · [Física] simetrías continuas (aviso de VIII.8).
**Lecturas.** Stillwell, *Naive Lie Theory*; Hall, *Lie Groups, Lie Algebras, and Representations*; Lynch y Park, *Modern Robotics*.

#### VII.5 Geometrías no euclidianas
*40 págs. · Requiere: VII.1, VII.2, VII.4 · Complementario*
- El quinto postulado y su independencia; geometría esférica: geodésicas, triángulos y trigonometría esférica.
- El plano hiperbólico: modelos del semiplano, del disco de Poincaré y del hiperboloide; el modelo de Klein como geometría proyectiva.
- Isometrías hiperbólicas como transformaciones de Möbius; el grupo PSL(2, ℝ).
- Triángulos hiperbólicos: suma de ángulos y área; teselaciones hiperbólicas.

**Puente.** Entrada: `d = acosh(1 + 2 * |u - v|² / ((1 - |u|²) * (1 - |v|²)))`, la distancia entre dos puntos en una biblioteca de representaciones hiperbólicas de datos. Es la distancia del disco de Poincaré: cerca del borde las distancias crecen sin límite, y por eso un árbol con muchas ramas cabe sin apretarse.
**Aplicaciones.** [Ing] navegación por círculos máximos y trigonometría esférica · [Física] el espacio de velocidades de la relatividad especial es hiperbólico · [Datos] representaciones hiperbólicas de jerarquías y de grafos · [3D] mundos y teselaciones hiperbólicas en videojuegos.
**Lecturas.** Stillwell, *Geometry of Surfaces*; Anderson, *Hyperbolic Geometry*.

**Parte B — Curvas y superficies de diseño**

#### VII.6 Curvas y superficies de Bézier y B-splines
*48 págs. · Requiere: III.9, VII.2 · Núcleo*
- Curvas de Bézier: algoritmo de De Casteljau, subdivisión, elevación de grado y propiedad de la envolvente convexa.
- B-splines: recurrencia de Cox–de Boor, vector de nodos y soporte local; Catmull–Rom.
- Continuidad paramétrica Cⁿ frente a continuidad geométrica Gⁿ.
- NURBS como proyección de curvas polinómicas en coordenadas homogéneas; superficies producto tensorial.

**Puente.** Entrada: `p = deCasteljau(controlPoints, t)` en un riel de cámara que acelera solo en las curvas. El parámetro t no es la longitud de arco; reparametrizar con la cuadratura y el método de Newton de III.10 da velocidad constante.
**Aplicaciones.** [3D] rieles de cámara, trayectorias y teselación de parches · [Ing] diseño asistido por computadora y tipografía digital · [Física] trayectorias suaves de partículas en simulaciones.
**Lecturas.** Farin, *Curves and Surfaces for CAGD*; Piegl y Tiller, *The NURBS Book*.

**Parte C — Geometría diferencial**

#### VII.7 Curvas en el espacio
*36 págs. · Requiere: IV.2 · Núcleo*
- Curvas regulares y parametrización por longitud de arco.
- Curvatura, torsión y triedro de Frenet–Serret; teorema fundamental de las curvas.
- Marcos móviles y marcos de rotación mínima.
- Curvas planas: curvatura con signo e índice de rotación.

**Puente.** Entrada: un tubo generado a lo largo de una curva que se retuerce en los puntos de inflexión. El triedro de Frenet no está definido donde la curvatura se anula; los marcos de rotación mínima evitan el problema.
**Aplicaciones.** [3D] tubos, cuerdas y rieles de cámara sin giros bruscos · [Ing] trazado de carreteras y vías con clotoides · [Bio/Eco] geometría del ADN.
**Lecturas.** do Carmo, *Differential Geometry of Curves and Surfaces*; Pressley, *Elementary Differential Geometry*.

#### VII.8 Superficies: formas fundamentales y curvatura
*48 págs. · Requiere: IV.3, VII.7 · Núcleo*
- Superficies regulares, plano tangente y primera forma fundamental; longitudes y áreas.
- Aplicación de Gauss y segunda forma fundamental.
- Curvaturas normal, principales, gaussiana y media; líneas de curvatura.
- Marcos tangentes en superficies parametrizadas.

**Puente.** Entrada: la matriz TBN (tangente, bitangente, normal) de un *normal map*. Es un marco del plano tangente de la superficie parametrizada por sus coordenadas de textura; la convención MikkTSpace fija cómo calcularlo para que la herramienta que genera el mapa y el motor coincidan.
**Aplicaciones.** [3D] *normal mapping* y espacio tangente · [Ing] curvatura de carrocerías y control de reflejos · [Física] membranas y tensión superficial.
**Lecturas.** do Carmo, *Differential Geometry of Curves and Surfaces*; Pressley, *Elementary Differential Geometry*.

#### VII.9 Geometría intrínseca y Gauss–Bonnet
*44 págs. · Requiere: VII.8, IV.12, I.8 · Núcleo*
- *Theorema egregium*: la curvatura gaussiana es intrínseca.
- Geodésicas y curvatura geodésica.
- Teorema de Gauss–Bonnet local y global; característica de Euler.
- Por qué no existe un mapa plano perfecto de la esfera. Las variedades y la geometría riemanniana llegan en XIII.4 y XIII.5.

**Puente.** Entrada: una textura que se estira en los polos de una esfera. Ninguna parametrización plana de la esfera conserva distancias, porque lo prohíbe el *theorema egregium*; elegir entre la proyección equirectangular, la cúbica o la octaédrica es elegir qué distorsión aceptar.
**Aplicaciones.** [3D] parametrizaciones de la esfera para texturas y mapas de entorno · [Ing] cartografía y proyecciones de mapas · [Física] superficies curvas y relatividad (aviso).
**Lecturas.** do Carmo, *Differential Geometry of Curves and Surfaces*; Needham, *Visual Differential Geometry and Forms*.

**Parte D — Geometría computacional y discreta**

#### VII.10 Predicados geométricos e intersecciones
*40 págs. · Requiere: II.4, II.17, III.10 · Núcleo*
- Predicados de orientación y de círculo circunscrito (*incircle*) como signos de determinantes.
- Fallos en coma flotante; aritmética exacta y predicados adaptativos.
- Intersecciones rayo–plano, rayo–esfera, rayo–caja y rayo–triángulo (Möller–Trumbore como regla de Cramer); rayo contra superficies algebraicas de grado alto.
- Puntos más cercanos: punto–triángulo, segmento–segmento y punto–caja.

**Puente.** Entrada: `if (abs(det) < EPSILON) return NO_HIT;` en una intersección rayo–triángulo. Es la regla de Cramer con una protección contra determinantes pequeños; los predicados adaptativos sustituyen ese épsilon arbitrario por una decisión exacta cuando hace falta.
**Aplicaciones.** [3D] selección con el ratón, *raycasts* y núcleo del trazado de rayos · [Ing] CAD robusto · [Datos] sistemas de información geográfica.
**Lecturas.** Ericson, *Real-Time Collision Detection*; Shewchuk, «Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates».

#### VII.11 Convexidad computacional: envolventes, separación y distancia
*44 págs. · Requiere: VII.10, IV.5 · Núcleo*
- Envolvente convexa en 2D y en 3D: algoritmos de Graham y Quickhull.
- Teorema de los ejes separadores para politopos, como corolario del teorema del hiperplano separador.
- Distancia entre convexos como problema convexo; algoritmo GJK sobre la diferencia de Minkowski y su convergencia.
- Profundidad de penetración (EPA) y avance conservador para el tiempo de impacto.

**Puente.** Entrada: el bucle principal de GJK, que solo llama a `support()`. Toda la geometría de los dos objetos entra por sus funciones de soporte; el algoritmo es un descenso sobre la diferencia de Minkowski que IV.5 justifica.
**Aplicaciones.** [3D] detección de colisiones, puntos de contacto y detección continua · [Ing] planificación de movimientos de robots · [Datos] clasificación lineal por separación.
**Lecturas.** de Berg, Cheong, van Kreveld y Overmars, *Computational Geometry*; van den Bergen, *Collision Detection in Interactive 3D Environments*; Gilbert, Johnson y Keerthi, «A Fast Procedure for Computing the Distance Between Complex Objects in Three-Dimensional Space».

#### VII.12 Triangulaciones y diagramas de Voronoi
*40 págs. · Requiere: VII.10, IV.10, I.8 · Núcleo*
- Triangulación de polígonos: existencia, recorte de orejas y descomposición monótona.
- Triangulación de Delaunay: círculo vacío, maximización del ángulo mínimo y volteo de aristas.
- Diagrama de Voronoi como dual de Delaunay.
- Teselaciones de Voronoi centroidales y algoritmo de Lloyd.

**Puente.** Entrada: una malla de navegación generada a partir del plano de un nivel. Es una triangulación del espacio libre: Delaunay evita triángulos degenerados, y su grafo dual se recorre con A\* (I.8).
**Aplicaciones.** [3D] mallas de navegación y terrenos · [Ing] mallado para elementos finitos · [Bio/Eco] modelos de territorio y de crecimiento celular.
**Lecturas.** de Berg, Cheong, van Kreveld y Overmars, *Computational Geometry*; Okabe, Boots, Sugihara y Chiu, *Spatial Tessellations*.

#### VII.13 Mallas: topología y geometría discreta
*48 págs. · Requiere: VII.9, II.12, I.8 · Núcleo*
- Complejos simpliciales, variedades con borde, orientabilidad, característica de Euler y género; la estructura *half-edge*.
- Normales de vértice, curvaturas discretas y Gauss–Bonnet discreto.
- Laplaciano cotangente y suavizado como difusión, explícito e implícito.
- Subdivisión de Catmull–Clark y de Loop con análisis espectral de la máscara; simplificación con métricas de error cuádrico; parametrización conforme por mínimos cuadrados. La teoría detrás, la homología y la clasificación de superficies, está en VI.7 y VI.8.

**Puente.** Entrada: `w = cot(alpha) + cot(beta)` en un código de suavizado de mallas. Son los pesos del laplaciano cotangente, la discretización del laplaciano de la superficie; el defecto angular alrededor de un vértice es la curvatura gaussiana discreta.
**Aplicaciones.** [3D] validación y reparación de mallas, niveles de detalle y desplegado UV · [Ing] mallas para simulación · [Bio/Eco] superficies de órganos en imágenes médicas.
**Lecturas.** Botsch, Kobbelt, Pauly, Alliez y Lévy, *Polygon Mesh Processing*; Crane, *Discrete Differential Geometry: An Applied Introduction*.

#### VII.14 Superficies implícitas y campos de distancia
*36 págs. · Requiere: VII.8, III.10 · Núcleo*
- Conjuntos de nivel y funciones de distancia con signo; ecuación eikonal |∇d| = 1.
- Constante de Lipschitz y *sphere tracing* como búsqueda de raíces con paso garantizado.
- Operaciones booleanas suaves y operadores de dominio.
- Extracción de mallas: Marching Cubes y sus ambigüedades.

**Puente.** Entrada: `t += sdf(origin + t * dir)`. Es *sphere tracing*: si la función tiene constante de Lipschitz 1, avanzar exactamente su valor nunca atraviesa la superficie.
**Aplicaciones.** [3D] *ray marching* y modelado con campos de distancia · [Ing] fabricación aditiva y trayectorias de herramientas · [Bio/Eco] reconstrucción de órganos a partir de tomografías.
**Lecturas.** Hart, «Sphere Tracing: A Geometric Method for the Antialiased Ray Tracing of Implicit Surfaces»; Osher y Fedkiw, *Level Set Methods and Dynamic Implicit Surfaces*.

#### VII.15 Geometría integral y particiones del espacio
*40 págs. · Requiere: VII.11, IV.10 · Complementario*
- Medida invariante en el espacio de rectas; fórmula de Cauchy–Crofton.
- Probabilidad de que una recta al azar corte un convexo: proporcional a su perímetro en el plano y a su área de superficie en el espacio.
- Particiones recursivas: árboles BSP, árboles k-d y *octrees*.
- Curvas que llenan el espacio (Peano, Hilbert y Morton): construcción, continuidad y localidad.

**Puente.** Entrada: `cost = Ct + (SA(L)/SA(P)) * N(L) * Ci + (SA(R)/SA(P)) * N(R) * Ci`. La heurística de área de superficie (SAH) usa cocientes de áreas como probabilidades: es la fórmula de Cauchy–Crofton aplicada a rayos al azar.
**Aplicaciones.** [3D] jerarquías de volúmenes envolventes y *hashing* espacial · [Datos] índices espaciales en bases de datos · [Física] estereología: estimar áreas y volúmenes a partir de cortes.
**Lecturas.** Santaló, *Integral Geometry and Geometric Probability*; Sagan, *Space-Filling Curves*.

### Tomo VIII — Ecuaciones diferenciales, sistemas dinámicos y mecánica

*Requiere: Tomos II, III y IV; importa VII.4 por interfaz · 14 capítulos.* Teoría de las ecuaciones diferenciales ordinarias y de los sistemas dinámicos, mecánica analítica y métodos numéricos. VIII.1 a VIII.3 solo usan los Tomos II y III.

**Parte A — Teoría**

#### VIII.1 Ecuaciones de primer orden
*44 págs. · Requiere: III.12, III.8 · Núcleo*
- Modelado con ecuaciones diferenciales; campos de direcciones.
- Ecuaciones separables, lineales y exactas; factor integrante.
- Teorema de existencia y unicidad de Picard–Lindelöf, con el punto fijo de Banach.
- Dependencia continua de los datos y desigualdad de Grönwall.

**Puente.** Entrada: `transmittance *= exp(-sigma * stepLength)` en un efecto de niebla volumétrica. Es la solución exacta de la ecuación lineal T′ = −σT (ley de Beer–Lambert) en cada paso.
**Aplicaciones.** [3D] niebla y atenuación de Beer–Lambert · [Bio/Eco] crecimiento logístico y farmacocinética · [Física] ley de enfriamiento de Newton y desintegración radiactiva.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Arnold, *Ordinary Differential Equations*.

#### VIII.2 Ecuaciones lineales de orden superior
*40 págs. · Requiere: VIII.1, II.3 · Núcleo*
- Ecuaciones lineales de orden n y espacio de soluciones; wronskiano.
- Coeficientes constantes y ecuación característica.
- Oscilador armónico libre, amortiguado y forzado; resonancia.
- Variación de parámetros.

**Puente.** Entrada: `smoothDamp(x, target, v, smoothTime, dt)`, la función de seguimiento suave de muchos motores. Es un oscilador con amortiguamiento crítico resuelto en forma cerrada: llega al objetivo lo más rápido posible sin oscilar.
**Aplicaciones.** [3D] seguimiento de cámaras con amortiguamiento crítico · [Ing] circuitos RLC y suspensiones · [Física] resonancia en estructuras.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Boyce y DiPrima, *Elementary Differential Equations and Boundary Value Problems*.

#### VIII.3 Sistemas lineales y exponencial de matrices
*44 págs. · Requiere: VIII.2, II.7, III.6 · Núcleo*
- Sistemas x′ = Ax; exponencial de una matriz como serie y mediante la forma de Jordan.
- Matriz fundamental y sistemas no homogéneos.
- Estabilidad de los sistemas lineales según sus autovalores; retratos de fase en el plano.
- Sistemas lineales discretos x_{n+1} = A x_n.

**Puente.** Entrada: muelles acoplados que «explotan» al aumentar la rigidez. Los autovalores del sistema dicen qué modos oscilan y a qué frecuencia; la explosión aparece cuando el método numérico no respeta esa estructura (VIII.12).
**Aplicaciones.** [Física] modos de vibración acoplados · [Ing] modelos en espacio de estados · [Bio/Eco] modelos compartimentales.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Perko, *Differential Equations and Dynamical Systems*.

#### VIII.4 Sistemas no lineales y estabilidad
*48 págs. · Requiere: VIII.3, IV.3 · Núcleo*
- Puntos de equilibrio y linealización; teorema de Hartman–Grobman (enunciado).
- Funciones de Lyapunov y estabilidad asintótica.
- Plano de fase, órbitas periódicas y ciclos límite.
- Teorema de Poincaré–Bendixson.

**Puente.** Entrada: un péndulo de juego que gana energía con el tiempo. El sistema continuo conserva la energía, que es una función de Lyapunov; que la simulación no la conserve es un defecto del integrador, no de la física.
**Aplicaciones.** [Bio/Eco] modelos depredador–presa de Lotka–Volterra y epidemias SIR · [Física] péndulo no lineal · [Ing] estabilidad de sistemas realimentados.
**Lecturas.** Hirsch, Smale y Devaney, *Differential Equations, Dynamical Systems, and an Introduction to Chaos*; Strogatz, *Nonlinear Dynamics and Chaos*.

#### VIII.5 Bifurcaciones y caos
*40 págs. · Requiere: VIII.4 · Complementario*
- Bifurcaciones silla–nodo, transcrítica, de horquilla y de Hopf.
- Aplicación logística, duplicación de período y constante de Feigenbaum.
- Sensibilidad a las condiciones iniciales; sistema de Lorenz y atractores extraños.
- Exponentes de Lyapunov y su cálculo numérico.

**Puente.** Entrada: dos simulaciones con la misma semilla que divergen entre plataformas. Un sistema caótico amplifica exponencialmente las diferencias de redondeo: el determinismo exige aritmética idéntica, no solo el mismo código.
**Aplicaciones.** [Física] meteorología y el modelo de Lorenz · [Cripto] determinismo en juegos en red · [Bio/Eco] dinámica de poblaciones.
**Lecturas.** Strogatz, *Nonlinear Dynamics and Chaos*; Alligood, Sauer y Yorke, *Chaos: An Introduction to Dynamical Systems*.

#### VIII.6 Fractales y dimensión
*36 págs. · Requiere: VIII.5, III.12 · Complementario*
- Conjuntos autosimilares: el conjunto de Cantor, la curva de Koch y el triángulo de Sierpinski.
- Sistemas de funciones iteradas y su atractor, por el punto fijo de Banach en la métrica de Hausdorff.
- Dimensión de conteo de cajas y dimensión de Hausdorff; la dimensión de los conjuntos autosimilares.
- Conjuntos de Julia y de Mandelbrot; atractores extraños como fractales.

**Puente.** Entrada: `for (i = 0; i < octavas; i++) { h += amplitud * ruido(frecuencia * p); frecuencia *= 2; amplitud *= ganancia; }`, el ruido fractal de un generador de terrenos. Sumar copias del mismo ruido a escalas que se duplican produce una superficie autosimilar, y la ganancia de una octava a la siguiente fija su dimensión fractal.
**Aplicaciones.** [3D] terrenos, nubes y vegetación procedurales · [Física] dimensión de atractores extraños y de frentes de crecimiento · [Señales] compresión fractal de imágenes · [Ing] antenas fractales.
**Lecturas.** Falconer, *Fractal Geometry: Mathematical Foundations and Applications*; Barnsley, *Fractals Everywhere*.

#### VIII.7 Sistemas con entrada: control y realimentación
*36 págs. · Requiere: VIII.4 · Complementario*
- Sistemas de control lineales; controlabilidad y observabilidad (criterio de Kalman).
- Realimentación de estado y asignación de polos.
- Controladores PID y su análisis en el dominio del tiempo.
- Discretización de controladores.

**Puente.** Entrada: `force = kp * error + ki * integral + kd * derivative`. Un PID es un sistema realimentado cuyos polos se eligen con kp, ki y kd; la estabilidad del vehículo o de la cámara se decide con los autovalores de VIII.3.
**Aplicaciones.** [Ing] control de motores y de drones · [3D] vehículos y personajes que siguen objetivos · [Bio/Eco] regulación de la glucosa.
**Lecturas.** Åström y Murray, *Feedback Systems*; Sontag, *Mathematical Control Theory*.

**Parte B — Mecánica**

#### VIII.8 Cálculo de variaciones y mecánica lagrangiana
*48 págs. · Requiere: VIII.4, IV.4 · Núcleo*
- Funcionales y ecuación de Euler–Lagrange; problema de la braquistócrona.
- Principio de mínima acción y coordenadas generalizadas.
- Restricciones holónomas con multiplicadores de Lagrange.
- Simetrías y cantidades conservadas: teorema de Noether.

**Puente.** Entrada: un *ragdoll* modelado como cuerpos unidos por «articulaciones». Cada articulación es una restricción holónoma y su fuerza es un multiplicador de Lagrange (IV.4); las coordenadas reducidas y las maximales son dos formas de escribir el mismo lagrangiano.
**Aplicaciones.** [3D] articulaciones y *ragdolls* · [Física] mecánica clásica y principio de Fermat en óptica · [Ing] trayectorias óptimas.
**Lecturas.** Arnold, *Mathematical Methods of Classical Mechanics*; Goldstein, Poole y Safko, *Classical Mechanics*; Gelfand y Fomin, *Calculus of Variations*.

#### VIII.9 Mecánica hamiltoniana
*44 págs. · Requiere: VIII.8 · Núcleo*
- Transformada de Legendre y ecuaciones de Hamilton.
- Espacio de fases y teorema de Liouville.
- Estructura simpléctica en forma matricial; transformaciones canónicas.
- Corchetes de Poisson e integrales primeras; su relación con los conmutadores de la mecánica cuántica (aviso de XIII.7).
- Ecuación de Hamilton–Jacobi, variables de acción–ángulo y sistemas integrables.

**Puente.** Entrada: el gráfico de energía de una simulación que deriva lentamente. El flujo hamiltoniano conserva el volumen en el espacio de fases, y los integradores que respetan esa estructura (VIII.13) no derivan.
**Aplicaciones.** [Física] órbitas planetarias y dinámica molecular · [3D] simulación estable a largo plazo · [Datos] Monte Carlo hamiltoniano (aviso de XI.8).
**Lecturas.** Arnold, *Mathematical Methods of Classical Mechanics*; José y Saletan, *Classical Dynamics: A Contemporary Approach*.

#### VIII.10 Control óptimo
*40 págs. · Requiere: VIII.7, VIII.9, IV.9 · Complementario*
- Problemas de control óptimo; principio del máximo de Pontryagin y su relación con la mecánica hamiltoniana.
- Ecuación de Hamilton–Jacobi–Bellman como límite continuo de la programación dinámica.
- Regulador lineal cuadrático y ecuación de Riccati; el filtro de Kalman como problema dual.
- Control predictivo por modelo y métodos numéricos de disparo.

**Puente.** Entrada: `K = lqr(A, B, Q, R)` y después `u = -K @ x` en el controlador de un dron. La ganancia K sale de resolver una ecuación de Riccati, y el principio de Bellman garantiza que esa realimentación lineal minimiza el costo cuadrático desde cualquier estado inicial.
**Aplicaciones.** [Ing] control de drones, robots y vehículos · [3D] control físico de personajes animados · [Física] la ecuación de Hamilton–Jacobi vista desde el control · [Bio/Eco] modelos de crecimiento óptimo en economía.
**Lecturas.** Liberzon, *Calculus of Variations and Optimal Control Theory*; Bertsekas, *Dynamic Programming and Optimal Control*.

#### VIII.11 Dinámica del sólido rígido
*44 págs. · Requiere: VIII.8, II.16, VII.4 · Núcleo*
- Sistemas de partículas: momento lineal y momento angular.
- Tensor de inercia, teorema de Steiner y ejes principales.
- Ecuaciones de Euler y término giroscópico; estabilidad de la rotación en torno a los ejes principales (teorema de la raqueta de tenis).
- La orientación como curva en SO(3) y su descripción con cuaterniones.

**Puente.** Entrada: `w += inverse(I) * (torque - cross(w, I * w)) * dt`. El término `cross(w, I * w)` es el término giroscópico de las ecuaciones de Euler; omitirlo hace que las peonzas y los objetos alargados giren mal.
**Aplicaciones.** [3D] núcleo de un motor de cuerpos rígidos · [Ing] satélites y giróscopos · [Física] peonzas y precesión.
**Lecturas.** Goldstein, Poole y Safko, *Classical Mechanics*; Taylor, *Classical Mechanics*; Baraff, «An Introduction to Physically Based Modeling: Rigid Body Simulation».

**Parte C — Métodos numéricos**

#### VIII.12 Métodos numéricos para ecuaciones diferenciales ordinarias
*48 págs. · Requiere: VIII.3, III.10 · Núcleo*
- Euler explícito; error local y global; orden de convergencia.
- Métodos de Runge–Kutta y métodos multipaso.
- Regiones de estabilidad absoluta y ecuaciones rígidas.
- Métodos implícitos resueltos con Newton; control del paso.

**Puente.** Entrada: `while (accumulator >= dt) { step(dt); accumulator -= dt; }`, el bucle de paso fijo. Separar el paso de integración del de dibujo es una decisión de estabilidad: la región de estabilidad del método exige un dt acotado.
**Aplicaciones.** [3D] bucle de física con paso fijo · [Física] trayectorias balísticas y orbitales · [Bio/Eco] simulación de modelos epidemiológicos.
**Lecturas.** Hairer, Nørsett y Wanner, *Solving Ordinary Differential Equations I*; Iserles, *A First Course in the Numerical Analysis of Differential Equations*.

#### VIII.13 Integración geométrica y restricciones
*40 págs. · Requiere: VIII.12, VIII.9, VII.4 · Núcleo*
- Integradores simplécticos: Störmer–Verlet y Euler semi-implícito; conservación de una energía modificada (enunciado).
- Integradores en grupos de Lie para las rotaciones.
- Restricciones en la integración: proyección, SHAKE y RATTLE.
- Dinámica basada en posiciones (PBD y XPBD) como método de proyección.

**Puente.** Entrada: `v += a * dt; x += v * dt;` frente a `x += v * dt; v += a * dt;`. Cambiar el orden de dos líneas convierte un método que gana energía en uno simpléctico, que la conserva en promedio.
**Aplicaciones.** [3D] tela, cuerdas y cuerpos blandos con PBD y XPBD · [Física] dinámica molecular · [Ing] mecanismos con restricciones.
**Lecturas.** Hairer, Lubich y Wanner, *Geometric Numerical Integration*; Macklin, Müller y Chentanez, «XPBD: Position-Based Simulation of Compliant Constrained Dynamics».

#### VIII.14 Contacto y complementariedad
*40 págs. · Requiere: VIII.13, IV.7, II.12 · Núcleo*
- El contacto unilateral como problema de complementariedad lineal (LCP); existencia y unicidad.
- Fricción de Coulomb, cono de fricción y su aproximación poliédrica; coeficiente de restitución.
- Métodos de Gauss–Seidel y de Jacobi proyectados; convergencia.
- Los impulsos secuenciales como método iterativo proyectado.

**Puente.** Entrada: el bucle de iteraciones de un *solver* de contactos que acumula y recorta impulsos. Es Gauss–Seidel proyectado sobre un LCP, y el número de iteraciones decide si una pila de cajas se sostiene.
**Aplicaciones.** [3D] pilas de cajas estables y fricción · [Ing] robótica de manipulación · [Bio/Eco] modelos de equilibrio de mercado.
**Lecturas.** Cottle, Pang y Stone, *The Linear Complementarity Problem*; Stewart, «Rigid-Body Dynamics with Friction and Impact»; Erleben, Sporring, Henriksen y Dohlmann, *Physics-Based Animation*.

### Tomo IX — Medida, Fourier y variable compleja

*Requiere: Tomos III y IV · 14 capítulos.* La integral de Lebesgue y los espacios de funciones, el análisis de Fourier continuo y discreto, las distribuciones, la variable compleja con sus métodos asintóticos, y el análisis en la esfera.

**Parte A — Medida y espacios de funciones**

#### IX.1 Medida e integral de Lebesgue
*52 págs. · Requiere: IV.10 · Núcleo*
- σ-álgebras, medida exterior y medida de Lebesgue; existencia de conjuntos no medibles.
- Funciones medibles e integral de Lebesgue.
- Teoremas de la convergencia monótona y de la convergencia dominada; lema de Fatou.
- Medida producto y teorema de Fubini–Tonelli; comparación con la integral de Riemann.

**Puente.** Entrada: un estimador que promedia los valores de una función con infinitos saltos. La integral de Lebesgue es la que se puede intercambiar con límites sin sorpresas, y es el marco en el que la probabilidad (XI.2) y Monte Carlo están bien definidos.
**Aplicaciones.** [Datos] esperanza de variables aleatorias (aviso de XI.2) · [Física] distribuciones de masa y de carga · [Señales] energía de señales con discontinuidades.
**Lecturas.** Stein y Shakarchi, *Real Analysis*; Folland, *Real Analysis*.

#### IX.2 Medidas con signo, Radon–Nikodym y diferenciación
*44 págs. · Requiere: IX.1 · Núcleo*
- Espacios de medida abstractos y teorema de extensión de Carathéodory; medidas de Lebesgue–Stieltjes.
- Medidas con signo; descomposiciones de Hahn y de Jordan.
- Continuidad absoluta, teorema de Radon–Nikodym y descomposición de Lebesgue.
- Teorema de diferenciación de Lebesgue; funciones de variación acotada y absolutamente continuas; el teorema fundamental del cálculo para la integral de Lebesgue.

**Puente.** Entrada: `pdf = np.gradient(cdf, x)`, una densidad obtenida derivando una función de distribución empírica. Una densidad es una derivada de Radon–Nikodym y existe solo si la distribución es absolutamente continua: por eso la derivada numérica de una distribución con átomos produce picos que no convergen.
**Aplicaciones.** [Datos] razones de verosimilitud y cambio de medida en estadística · [Física] densidades de carga y de masa frente a cargas puntuales · [3D] los pesos del muestreo por importancia en el trazado de caminos como cocientes de densidades.
**Lecturas.** Folland, *Real Analysis*; Royden y Fitzpatrick, *Real Analysis*.

#### IX.3 Espacios Lᵖ y espacios de Hilbert
*48 págs. · Requiere: IX.1, II.9 · Núcleo*
- Espacios Lᵖ, desigualdades de Hölder y de Minkowski; completitud (teorema de Riesz–Fischer).
- Espacios de Hilbert: proyección ortogonal, bases ortonormales e identidad de Parseval.
- Teorema de representación de Riesz.
- Operadores compactos autoadjuntos y su teorema espectral; operadores integrales y alternativa de Fredholm. La teoría en espacios de Banach llega en X.4, y los operadores no acotados, en X.6.

**Puente.** Entrada: «proyectar» una señal sobre unas pocas funciones base para comprimirla. Es la proyección ortogonal de II.8 en un espacio de dimensión infinita, y la identidad de Parseval dice cuánta energía se pierde.
**Aplicaciones.** [Señales] compresión por truncamiento en una base · [Física] mecánica cuántica: estados como vectores de un espacio de Hilbert · [3D] iluminación con funciones base (aviso de IX.14).
**Lecturas.** Stein y Shakarchi, *Real Analysis*; Kreyszig, *Introductory Functional Analysis with Applications*.

**Parte B — Análisis de Fourier**

#### IX.4 Series de Fourier
*44 págs. · Requiere: IX.3, III.8 · Núcleo*
- Coeficientes de Fourier; núcleos de Dirichlet y de Fejér.
- Convergencia puntual (teorema de Dirichlet), sumabilidad de Cesàro y fenómeno de Gibbs.
- Convergencia en L² y completitud del sistema trigonométrico.
- Suavidad de una función y decaimiento de sus coeficientes.

**Puente.** Entrada: un ecualizador gráfico de audio. Cada barra multiplica un rango de coeficientes de Fourier, y la suavidad de esa ganancia controla los artefactos (Gibbs) que aparecen en el tiempo.
**Aplicaciones.** [Señales] síntesis y análisis de audio · [Física] cuerdas vibrantes y conducción del calor · [3D] formas de onda para animación procedural.
**Lecturas.** Stein y Shakarchi, *Fourier Analysis*; Körner, *Fourier Analysis*.

#### IX.5 Transformada de Fourier
*48 págs. · Requiere: IX.4 · Núcleo*
- Transformada en L¹; lema de Riemann–Lebesgue; fórmula de inversión.
- Teorema de Plancherel en L².
- Convolución y teorema de convolución; aproximaciones de la identidad.
- Principio de incertidumbre y gaussianas; la delta de Dirac como límite de gaussianas (IX.6 la formaliza).

**Puente.** Entrada: un desenfoque gaussiano separable, `blurX(blurY(image))`. Convolucionar con una gaussiana 2D equivale a convolucionar dos veces con gaussianas 1D porque la gaussiana es un producto de funciones de cada coordenada; en frecuencia es un filtro pasabajos.
**Aplicaciones.** [3D] desenfoque y *bloom* · [Señales] filtros y respuesta en frecuencia · [Física] óptica de Fourier y difracción · [Bio/Eco] resonancia magnética.
**Lecturas.** Stein y Shakarchi, *Fourier Analysis*; Folland, *Fourier Analysis and Its Applications*.

#### IX.6 Distribuciones
*40 págs. · Requiere: IX.5 · Núcleo*
- Funciones de prueba y distribuciones; la delta de Dirac y sus derivadas.
- Derivada distribucional, producto por funciones suaves y convergencia de distribuciones.
- Distribuciones temperadas y su transformada de Fourier.
- Valor principal, fórmula de Sokhotski–Plemelj y soluciones fundamentales.

**Puente.** Entrada: `∫ δ(x) f(x) dx = f(0)` y `1/(x − iε) → P(1/x) + iπ δ(x)` en un libro de física. Ninguna función cumple la primera igualdad; las distribuciones la convierten en una definición rigurosa y dicen cuándo es legítimo manipular la delta como si fuera una función y cuándo no: su cuadrado, por ejemplo, no tiene sentido.
**Aplicaciones.** [Física] cargas puntuales, densidades singulares y propagadores · [Señales] el impulso unitario y la respuesta al impulso de un sistema lineal · [Ing] fuerzas concentradas en vigas.
**Lecturas.** Strichartz, *A Guide to Distribution Theory and Fourier Transforms*; Friedlander y Joshi, *Introduction to the Theory of Distributions*.

#### IX.7 Muestreo y transformada discreta
*48 págs. · Requiere: IX.5, II.12 · Núcleo*
- Teorema de Nyquist–Shannon y origen del *aliasing*.
- Filtros de reconstrucción: caja, tienda, Mitchell–Netravali y Lanczos.
- Transformada discreta de Fourier, FFT de Cooley–Tukey y convolución circular; transformada del coseno.
- Muestreo en 2D, huella anisotrópica de un píxel y muestreo temporal.

**Puente.** Entrada: `textureSampleLevel(tex, samp, uv, lod)` con `lod = log2(footprint)`. Los *mipmaps* son versiones prefiltradas de la textura para no muestrear por debajo de la frecuencia de Nyquist, y el nivel se elige con el tamaño de la huella del píxel (IV.2).
**Aplicaciones.** [3D] *mipmapping*, filtrado anisotrópico, *supersampling* y TAA · [Señales] audio digital y JPEG · [Ing] adquisición de datos.
**Lecturas.** Oppenheim y Schafer, *Discrete-Time Signal Processing*; Heckbert, *Fundamentals of Texture Mapping and Image Warping*.

#### IX.8 Ondículas y análisis tiempo–frecuencia
*40 págs. · Requiere: IX.7 · Complementario*
- Transformada de Fourier de tiempo corto y espectrogramas.
- Análisis de multirresolución; ondícula de Haar.
- Ondículas de soporte compacto de Daubechies.
- Transformada rápida de ondículas.

**Puente.** Entrada: el tamaño de ventana de un espectrograma en una herramienta de audio. Elegirlo es elegir entre resolución en el tiempo y resolución en frecuencia: el principio de incertidumbre (IX.5) en acción.
**Aplicaciones.** [Señales] JPEG 2000 y eliminación de ruido · [Bio/Eco] análisis de electrocardiogramas · [3D] compresión de texturas y de geometría por niveles.
**Lecturas.** Mallat, *A Wavelet Tour of Signal Processing*; Daubechies, *Ten Lectures on Wavelets*.

**Parte C — Variable compleja**

#### IX.9 Funciones holomorfas
*40 págs. · Requiere: IV.11, III.8 · Núcleo*
- Derivada compleja y ecuaciones de Cauchy–Riemann.
- Funciones elementales complejas; ramas del logaritmo.
- Series de potencias complejas.
- Integrales de contorno.

**Puente.** Entrada: `atan2(y, x)` y su salto en ±π. Es el argumento de un número complejo: el salto es un corte de rama del logaritmo, y «desenrollar» ángulos en una animación es cambiar de rama.
**Aplicaciones.** [3D] desenrollado de ángulos y conjunto de Mandelbrot · [Ing] diagramas de Bode · [Física] flujo potencial en el plano.
**Lecturas.** Ahlfors, *Complex Analysis*; Needham, *Visual Complex Analysis*.

#### IX.10 Teoría de Cauchy y residuos
*52 págs. · Requiere: IX.9 · Núcleo*
- Teorema y fórmula integral de Cauchy; analiticidad de las funciones holomorfas.
- Teorema de Liouville y una segunda demostración del teorema fundamental del álgebra (la primera está en III.8); principio del módulo máximo.
- Series de Laurent y clasificación de las singularidades.
- Teorema de los residuos y cálculo de integrales reales; principio del argumento.

**Puente.** Entrada: un buscador de raíces de polinomios que cuenta cuántas hay dentro de un círculo. El principio del argumento cuenta ceros con una integral de contorno y es la base de los métodos robustos para localizar raíces.
**Aplicaciones.** [Ing] criterio de estabilidad de Nyquist · [Física] relaciones de Kramers–Kronig entre causalidad y analiticidad; integrales en óptica · [Señales] diseño de filtros.
**Lecturas.** Ahlfors, *Complex Analysis*; Stein y Shakarchi, *Complex Analysis*.

#### IX.11 Métodos asintóticos
*40 págs. · Requiere: IX.10 · Complementario*
- Series asintóticas y su diferencia con las series convergentes; lema de Watson.
- Método de Laplace y fórmula de Stirling.
- Fase estacionaria y método del punto de silla (descenso más rápido).
- Comportamiento asintótico de integrales y de funciones especiales.

**Puente.** Entrada: `log(n!) ≈ n * log(n) - n` en un cálculo de entropía. Es la aproximación de Stirling truncada; el método de Laplace la deduce, da el término siguiente, ½·log(2πn), y dice cuánto error se comete para cada n.
**Aplicaciones.** [Física] funciones de partición en mecánica estadística y óptica de la difracción · [Datos] aproximación de Laplace en inferencia bayesiana · [Señales] análisis de señales moduladas en frecuencia por fase estacionaria.
**Lecturas.** Bender y Orszag, *Advanced Mathematical Methods for Scientists and Engineers*; de Bruijn, *Asymptotic Methods in Analysis*.

#### IX.12 Aplicaciones conformes y funciones armónicas
*40 págs. · Requiere: IX.10 · Complementario*
- Conformidad y transformaciones de Möbius.
- Teorema de la aplicación de Riemann (enunciado y discusión).
- Funciones armónicas, principio del máximo y problema de Dirichlet en el disco.
- Transformación de Joukowski y transformación de Schwarz–Christoffel (introducción).

**Puente.** Entrada: una parametrización UV que conserva los ángulos de la textura. Conservar ángulos es ser conforme; en dimensión 2 eso equivale a ser holomorfa, y por eso las parametrizaciones conformes de mallas (VII.13) se escriben con números complejos.
**Aplicaciones.** [Física] perfil alar de Joukowski y flujo potencial · [3D] parametrizaciones conformes · [Ing] campos electrostáticos en el plano.
**Lecturas.** Needham, *Visual Complex Analysis*; Ahlfors, *Complex Analysis*.

#### IX.13 Transformadas de Laplace y z
*40 págs. · Requiere: IX.10, IX.5 · Núcleo*
- Transformada de Laplace, propiedades e inversión por residuos.
- Resolución de ecuaciones diferenciales lineales; función de transferencia y estabilidad.
- Transformada z y sistemas discretos.
- Filtros digitales FIR e IIR.

**Puente.** Entrada: `y = a * y + (1.0 - a) * x` como filtro de suavizado. Es un filtro IIR de un polo: su transformada z dice cómo atenúa cada frecuencia y por qué introduce retardo.
**Aplicaciones.** [Señales] filtros de audio · [Ing] análisis de sistemas de control · [3D] filtrado de las entradas del ratón y del mando.
**Lecturas.** Oppenheim y Willsky, *Signals and Systems*; Oppenheim y Schafer, *Discrete-Time Signal Processing*.

**Parte D — Análisis en la esfera**

#### IX.14 Armónicos esféricos
*44 págs. · Requiere: IX.4, IV.12, II.16 · Núcleo*
- Laplaciano en la esfera; polinomios armónicos homogéneos.
- Polinomios de Legendre y armónicos esféricos como base ortonormal de L²(S²).
- Rotación de coeficientes: la acción de SO(3) sobre cada banda.
- Teorema de Funk–Hecke y convolución sobre la esfera. XIII.2 los estudia como representaciones de SO(3).

**Puente.** Entrada: `irradiance = dot(shCoeffs, shBasis(normal))` con nueve coeficientes. Tres bandas de armónicos esféricos bastan para la iluminación difusa porque la convolución con el coseno truncado (Funk–Hecke) atenúa casi a cero las bandas altas.
**Aplicaciones.** [3D] iluminación difusa basada en imagen y sondas de luz · [Física] gravedad, geodesia y orbitales atómicos · [Señales] audio ambisónico.
**Lecturas.** Atkinson y Han, *Spherical Harmonics and Approximations on the Unit Sphere*; Ramamoorthi y Hanrahan, «An Efficient Representation for Irradiance Environment Maps».

### Tomo X — Análisis funcional

*Requiere: Tomos VI y IX; importa VII.4 por interfaz · 8 capítulos.* Los espacios de Banach y sus grandes teoremas, la dualidad y las topologías débiles, los operadores compactos y los espacios de Sobolev, y los operadores no acotados de la mecánica cuántica. Es el marco donde las ecuaciones en derivadas parciales tienen solución, donde los elementos finitos convergen y donde los observables cuánticos tienen sentido.

**Parte A — Espacios de Banach y dualidad**

#### X.1 Espacios de Banach y teorema de Hahn–Banach
*44 págs. · Requiere: IX.3, I.4 · Núcleo*
- Espacios normados y de Banach; operadores acotados y espacio de operadores; cocientes.
- Ejemplos: ℓᵖ, Lᵖ, c₀ y C(K).
- Teorema de Hahn–Banach, analítico y geométrico (separación de convexos), con el lema de Zorn.
- Consecuencias: extensión de funcionales, norma por dualidad y doble dual.

**Puente.** Entrada: `w·x + b ≥ 0`, el clasificador lineal que separa dos clases. Que dos convexos disjuntos se puedan separar con un hiperplano es la forma geométrica de Hahn–Banach; en dimensión infinita, la misma afirmación sostiene los métodos de núcleos y la dualidad en optimización.
**Aplicaciones.** [Datos] separación por hiperplanos y máquinas de vectores soporte en espacios de funciones · [3D] separación de convexos en la detección de colisiones · [Ing] dualidad y certificados de optimalidad en control óptimo.
**Lecturas.** Brezis, *Functional Analysis, Sobolev Spaces and Partial Differential Equations*; Kreyszig, *Introductory Functional Analysis with Applications*.

#### X.2 Acotación uniforme, aplicación abierta y gráfico cerrado
*40 págs. · Requiere: X.1, VI.4 · Núcleo*
- Principio de acotación uniforme (Banach–Steinhaus), por el teorema de Baire.
- Teorema de la aplicación abierta y teorema de la inversa acotada.
- Teorema del gráfico cerrado.
- Aplicaciones: series de Fourier de funciones continuas que divergen en un punto; teorema de equivalencia de Lax.

**Puente.** Entrada: un esquema numérico consistente que igual explota al refinar la malla. El teorema de equivalencia de Lax dice que, para un problema lineal bien planteado, convergencia equivale a consistencia más estabilidad, y su demostración es el principio de acotación uniforme.
**Aplicaciones.** [Ing] estabilidad de esquemas numéricos y teorema de Lax · [Señales] divergencia de series de Fourier e inestabilidad en la reconstrucción de señales · [Bio/Eco] problemas inversos mal planteados en tomografía.
**Lecturas.** Brezis, *Functional Analysis, Sobolev Spaces and Partial Differential Equations*; Kreyszig, *Introductory Functional Analysis with Applications*.

#### X.3 Dualidad, topologías débiles y teorema de Banach–Alaoglu
*44 págs. · Requiere: X.2, VI.2, IX.2 · Núcleo*
- Duales de los Lᵖ por el teorema de Radon–Nikodym; dual de C(K) y teorema de representación de Riesz–Markov (enunciado).
- Topologías débil y débil-*; convergencia débil.
- Teorema de Banach–Alaoglu, con Tychonoff; espacios reflexivos.
- Minimización en espacios reflexivos: los funcionales convexos y semicontinuos alcanzan su mínimo.

**Puente.** Entrada: una sucesión de oscilaciones cada vez más rápidas, `sin(n * x)`, que «tiende a cero» en promedio pero no en norma. Converge débilmente a 0: la topología débil es la que conserva la compacidad en dimensión infinita, y con ella el método directo garantiza que los problemas variacionales tienen solución.
**Aplicaciones.** [Física] métodos variacionales y existencia de estados de mínima energía · [3D] existencia de superficies de energía mínima en modelado y animación · [Datos] convergencia débil de medidas y distancias entre distribuciones.
**Lecturas.** Brezis, *Functional Analysis, Sobolev Spaces and Partial Differential Equations*; Rudin, *Functional Analysis*.

**Parte B — Operadores compactos y espacios de Sobolev**

#### X.4 Operadores compactos y teoría de Fredholm
*40 págs. · Requiere: X.3 · Complementario*
- Operadores compactos en espacios de Banach; límites de operadores de rango finito.
- Teoría de Riesz–Schauder: el espectro de un operador compacto.
- Alternativa de Fredholm y operadores de Fredholm; índice.
- Ecuaciones integrales de segunda especie y su resolución numérica por el método de Nyström.

**Puente.** Entrada: `solve(I - K, f)`, con K una matriz que discretiza un núcleo integral. La alternativa de Fredholm dice que la ecuación tiene solución única salvo para una cantidad numerable de valores del parámetro, y eso explica por qué el sistema discreto está bien condicionado lejos de ellos.
**Aplicaciones.** [3D] radiosidad: el transporte de la luz como ecuación integral de segunda especie · [Ing] métodos de elementos de contorno en acústica y electromagnetismo · [Física] dispersión de ondas y ecuación de Lippmann–Schwinger.
**Lecturas.** Kress, *Linear Integral Equations*; Brezis, *Functional Analysis, Sobolev Spaces and Partial Differential Equations*.

#### X.5 Espacios de Sobolev
*48 págs. · Requiere: X.3, IX.6 · Núcleo*
- Derivadas débiles y espacios Wᵏ·ᵖ; densidad de las funciones suaves.
- El espacio H¹₀ y la desigualdad de Poincaré; trazas en el borde.
- Teoremas de inmersión de Sobolev (enunciados) y teorema de compacidad de Rellich–Kondrachov.
- Espacios Hˢ por la transformada de Fourier; regularidad.

**Puente.** Entrada: la energía `sum(|grad u|^2) * area` que minimiza un suavizado de mallas o un programa de elementos finitos. Esa energía es la norma de H¹; las funciones con energía finita forman un espacio de Sobolev, y en él el problema discreto converge al continuo.
**Aplicaciones.** [3D] energía de Dirichlet en el suavizado y la deformación de mallas · [Ing] espacios de elementos finitos y estimaciones del error · [Física] energía de los campos y regularidad de las soluciones.
**Lecturas.** Evans, *Partial Differential Equations*; Brezis, *Functional Analysis, Sobolev Spaces and Partial Differential Equations*.

**Parte C — Teoría espectral y evolución**

#### X.6 Operadores en espacios de Hilbert
*48 págs. · Requiere: IX.3, IX.6, VII.4, X.2 · Complementario*
- Operadores acotados y no acotados; dominio, clausura y adjunto.
- Operadores simétricos frente a autoadjuntos, y por qué la diferencia importa.
- Espectro puntual, continuo y residual; teorema espectral para operadores autoadjuntos (enunciado, con medidas espectrales).
- Grupos unitarios a un parámetro y teorema de Stone: los generadores autoadjuntos.

**Puente.** Entrada: `[x, p] = iħ`. Ningún par de matrices finitas lo cumple, porque la traza de un conmutador es 0 y la de iħ·I no lo es; la relación canónica exige operadores no acotados en dimensión infinita, y por eso los físicos necesitan algo más que el álgebra lineal del Tomo II.
**Aplicaciones.** [Física] observables de la mecánica cuántica · [Ing] operador de Koopman para analizar sistemas dinámicos no lineales · [Datos] operadores integrales y métodos de núcleos.
**Lecturas.** Hall, *Quantum Theory for Mathematicians*; Reed y Simon, *Methods of Modern Mathematical Physics*, vol. 1.

#### X.7 Álgebras de Banach y teoría espectral
*44 págs. · Requiere: X.4, IX.9 · Complementario*
- Álgebras de Banach; espectro, resolvente y radio espectral (fórmula de Gelfand).
- Teorema de Gelfand–Mazur y transformada de Gelfand en las álgebras conmutativas.
- Cálculo funcional holomorfo y continuo; álgebras C* (teorema de Gelfand–Naimark, enunciado).
- Teorema espectral para operadores normales acotados.

**Puente.** Entrada: `rho = max(abs(eigvals(A)))` para decidir si una iteración converge. El radio espectral es lím ‖Aⁿ‖^{1/n}, la fórmula de Gelfand, y vale en cualquier álgebra de Banach: por eso decide la convergencia de un método iterativo aunque la norma de A sea mayor que 1.
**Aplicaciones.** [Ing] convergencia de métodos iterativos y estabilidad de sistemas discretos · [Física] observables acotados y álgebras de operadores en mecánica cuántica · [Señales] cálculo funcional y filtros espectrales sobre grafos.
**Lecturas.** Conway, *A Course in Functional Analysis*; Rudin, *Functional Analysis*.

#### X.8 Semigrupos de operadores y ecuaciones de evolución
*40 págs. · Requiere: X.6, X.5 · Complementario*
- Semigrupos fuertemente continuos y su generador.
- Teoremas de Hille–Yosida y de Lumer–Phillips.
- Las ecuaciones del calor, de ondas y de Schrödinger como semigrupos.
- Fórmulas de Trotter y división de operadores.

**Puente.** Entrada: `u = expm(dt * L) @ u` en un integrador exponencial. Para un operador diferencial L, `exp(tL)` no es una serie de potencias sino un semigrupo, y Hille–Yosida dice cuándo existe; la fórmula de Trotter justifica integrar por separado cada término de la ecuación.
**Aplicaciones.** [3D] división de operadores en la simulación de fluidos y de humo · [Física] evolución cuántica y división de Trotter en simulación · [Ing] sistemas de control en dimensión infinita.
**Lecturas.** Engel y Nagel, *A Short Course on Operator Semigroups*; Pazy, *Semigroups of Linear Operators and Applications to Partial Differential Equations*.

### Tomo XI — Probabilidad, estadística y métodos estocásticos

*Requiere: Tomos IV y IX · 18 capítulos.* Probabilidad con teoría de la medida, métodos de Monte Carlo, procesos estocásticos, estadística y teoría de la información.

**Parte A — Probabilidad**

#### XI.1 Probabilidad discreta
*44 págs. · Requiere: I.6, III.2 · Núcleo*
- Espacios de probabilidad finitos y numerables; probabilidad condicional y teorema de Bayes.
- Independencia.
- Variables aleatorias discretas, esperanza y varianza.
- Distribuciones binomial, geométrica y de Poisson.

**Puente.** Entrada: `if (random() < dropChance) giveItem();` en una tabla de botín. Es una variable de Bernoulli; el número de intentos hasta conseguir el objeto sigue una distribución geométrica, que explica por qué los jugadores perciben «rachas».
**Aplicaciones.** [3D] tablas de botín y diseño de juegos · [Bio/Eco] pruebas diagnósticas y teorema de Bayes · [Cripto] probabilidad de colisión en tablas de dispersión.
**Lecturas.** Blitzstein y Hwang, *Introduction to Probability*; Ross, *A First Course in Probability*.

#### XI.2 Probabilidad con medida
*44 págs. · Requiere: XI.1, IX.2, IV.10 · Núcleo*
- Espacios de probabilidad generales; variables aleatorias como funciones medibles.
- Distribuciones, funciones de distribución y densidades como derivadas de Radon–Nikodym.
- Esperanza como integral de Lebesgue.
- Cambio de variables en densidades con el jacobiano.

**Puente.** Entrada: `D = a2 / (PI * pow(NdotH * NdotH * (a2 - 1.0) + 1.0, 2.0))`, la distribución GGX de un material PBR. Es una densidad de probabilidad de las normales de las microfacetas, normalizada respecto del área proyectada; verla como densidad explica sus condiciones de normalización.
**Aplicaciones.** [3D] distribuciones de microfacetas en materiales PBR · [Física] distribución de velocidades de Maxwell–Boltzmann · [Datos] modelos de densidad.
**Lecturas.** Grimmett y Stirzaker, *Probability and Random Processes*; Williams, *Probability with Martingales*.

#### XI.3 Vectores aleatorios
*44 págs. · Requiere: XI.2, II.9 · Núcleo*
- Distribuciones conjuntas, marginales y condicionales; independencia.
- Covarianza y matriz de covarianza.
- Gaussiana multivariante y su factorización por Cholesky o por autovalores.
- Esperanza condicional, cuya existencia da el teorema de Radon–Nikodym.

**Puente.** Entrada: `sample = mean + L * randn3()` con `L = cholesky(Sigma)`. Transformar una gaussiana estándar con el factor de Cholesky da la covarianza deseada: es la forma cuadrática de II.9 aplicada al azar.
**Aplicaciones.** [3D] *Gaussian Splatting*: gaussianas anisótropas y su proyección en pantalla · [Datos] modelos gaussianos · [Ing] errores de medición correlacionados.
**Lecturas.** Grimmett y Stirzaker, *Probability and Random Processes*; Blitzstein y Hwang, *Introduction to Probability*.

#### XI.4 Desigualdades y teoremas límite
*52 págs. · Requiere: XI.3, IX.5 · Núcleo*
- Desigualdades de Markov, de Chebyshev, de Cantelli y de Chernoff.
- Modos de convergencia; leyes débil y fuerte de los grandes números.
- La función característica como transformada de Fourier; teorema de continuidad de Lévy.
- Teorema central del límite; cota de Berry–Esseen (enunciado).

**Puente.** Entrada: `pMax = variance / (variance + (t - mean) * (t - mean))` en las sombras por varianza. Es la desigualdad de Cantelli: una cota superior de la probabilidad de que la profundidad supere t, usada como visibilidad aproximada.
**Aplicaciones.** [3D] sombras por varianza (VSM) · [Datos] intervalos de confianza y tamaño de muestra · [Ing] control de calidad.
**Lecturas.** Durrett, *Probability: Theory and Examples*; Grimmett y Stirzaker, *Probability and Random Processes*.

**Parte B — Métodos estocásticos**

#### XI.5 Generación de muestras
*36 págs. · Requiere: XI.3, I.5 · Núcleo*
- Generadores pseudoaleatorios: período, calidad y pruebas estadísticas.
- Método de inversión y método de rechazo.
- Método alias de Walker y transformación de Box–Muller.
- Muestreo uniforme en el disco, la esfera y el hemisferio; muestreo proporcional al coseno.

**Puente.** Entrada: `d = vec3(sqrt(u1) * cos(2*PI*u2), sqrt(u1) * sin(2*PI*u2), sqrt(1.0 - u1))`. Es muestreo proporcional al coseno por el método de inversión; la raíz cuadrada aparece al invertir la distribución acumulada, y sin ella las muestras se amontonan.
**Aplicaciones.** [3D] muestreo de direcciones y de BRDF · [Física] simulación de partículas · [Datos] simulación y *bootstrap*.
**Lecturas.** Devroye, *Non-Uniform Random Variate Generation*; Owen, *Monte Carlo Theory, Methods and Examples*.

#### XI.6 Integración de Monte Carlo
*44 págs. · Requiere: XI.4, XI.5 · Núcleo*
- Estimador de Monte Carlo: insesgadez, varianza y convergencia de orden 1/√N.
- Muestreo por importancia y muestreo múltiple por importancia (MIS).
- Estratificación, variables de control y ruleta rusa.
- Remuestreo por importancia y muestreo de reservorio.

**Puente.** Entrada: `color += f(x) / pdf(x)` en un bucle de muestras. Dividir por la densidad es lo que hace insesgado al estimador; elegir una densidad parecida a f reduce la varianza, y en eso consiste todo el muestreo por importancia.
**Aplicaciones.** [3D] oclusión ambiental, luces de área y remuestreo espaciotemporal (ReSTIR) · [Bio/Eco] valoración de opciones financieras · [Física] integrales en dimensión alta.
**Lecturas.** Owen, *Monte Carlo Theory, Methods and Examples*; Veach, *Robust Monte Carlo Methods for Light Transport Simulation*.

#### XI.7 Cuasi-Monte Carlo
*36 págs. · Requiere: XI.6 · Complementario*
- Discrepancia y desigualdad de Koksma–Hlawka.
- Inverso radical; secuencias de Halton y de Sobol; redes digitales.
- Cuasi-Monte Carlo aleatorizado: desplazamientos y mezclas de Owen.
- Cuándo y por qué supera a Monte Carlo.

**Puente.** Entrada: `jitter = vec2(halton(i % 8, 2), halton(i % 8, 3))` en el antialiasing temporal. Las secuencias de baja discrepancia cubren el píxel de forma pareja en pocos fotogramas, y Koksma–Hlawka cuantifica la ventaja.
**Aplicaciones.** [3D] desplazamientos del TAA y muestreo de píxeles · [Bio/Eco] finanzas computacionales · [Ing] diseño de experimentos.
**Lecturas.** Niederreiter, *Random Number Generation and Quasi-Monte Carlo Methods*; Dick y Pillichshammer, *Digital Nets and Sequences*.

#### XI.8 Cadenas de Markov y MCMC
*48 págs. · Requiere: XI.4, II.9 · Núcleo*
- Cadenas de Markov finitas: matrices estocásticas y clasificación de estados.
- Distribución estacionaria y teorema de Perron–Frobenius.
- Convergencia y tiempos de mezcla.
- Algoritmo de Metropolis–Hastings y muestreo de Gibbs.

**Puente.** Entrada: el vector de PageRank calculado por iteración de potencias. Es la distribución estacionaria de un paseo aleatorio por la web, y Perron–Frobenius garantiza que existe y es única gracias al factor de amortiguamiento.
**Aplicaciones.** [Datos] PageRank e inferencia bayesiana por MCMC · [3D] generación procedural con cadenas de Markov · [Física] modelo de Ising.
**Lecturas.** Levin y Peres, *Markov Chains and Mixing Times*; Norris, *Markov Chains*.

#### XI.9 Procesos puntuales y campos aleatorios
*48 págs. · Requiere: XI.6, IX.7 · Complementario*
- Procesos de Poisson espaciales y procesos con distancia mínima.
- Espectro de potencia de un conjunto de puntos; ruido azul.
- Campos aleatorios estacionarios y teorema de Wiener–Khinchin.
- Ruido de gradiente, movimiento browniano fraccionario y sumas fBm; exponente de Hurst.

**Puente.** Entrada: `h += amp * noise(p * freq); amp *= gain; freq *= 2.0;` repetido por octavas. Una suma fBm construye un campo con espectro de potencia en ley de potencias; la ganancia entre octavas fija el exponente de Hurst y, con él, la rugosidad del terreno.
**Aplicaciones.** [3D] terreno procedural, vegetación con disco de Poisson y *dithering* · [Física] superficies rugosas · [Bio/Eco] distribución espacial de árboles y de células.
**Lecturas.** Illian, Penttinen, Stoyan y Stoyan, *Statistical Analysis and Modelling of Spatial Point Patterns*; Lagae et al., «A Survey of Procedural Noise Functions».

#### XI.10 Procesos en tiempo continuo: Poisson y browniano
*44 págs. · Requiere: XI.4 · Núcleo*
- Proceso de Poisson temporal y tiempos de espera exponenciales.
- Paseo aleatorio y su límite; construcción del movimiento browniano.
- Propiedades del movimiento browniano: continuidad, no derivabilidad y propiedad de Markov.
- Martingalas en tiempo discreto (introducción, que se desarrolla en XI.11); conexión con la ecuación del calor. Para seguir: cálculo de Itô.

**Puente.** Entrada: `nextSpawn = now - log(1.0 - random()) / rate`. Muestrear tiempos de espera exponenciales produce un proceso de Poisson: es la forma correcta de generar eventos «al azar» con una tasa dada.
**Aplicaciones.** [3D] aparición de eventos y partículas · [Ing] colas y tráfico en redes · [Física] difusión y movimiento browniano.
**Lecturas.** Durrett, *Probability: Theory and Examples*; Lawler, *Introduction to Stochastic Processes*.

#### XI.11 Martingalas
*36 págs. · Requiere: XI.3, XI.4, XI.10 · Complementario*
- Filtraciones, martingalas, submartingalas y tiempos de parada.
- Teorema de parada opcional y la ruina del jugador.
- Convergencia de martingalas; desigualdades de Doob y de Azuma–Hoeffding.
- Paseos aleatorios y precios sin arbitraje en el modelo binomial.

**Puente.** Entrada: un tablero de pruebas A/B que recalcula el valor p cada hora y detiene el experimento cuando baja de 0,05. Mirar los datos muchas veces y parar cuando conviene cambia la probabilidad de error; el teorema de parada opcional explica por qué, y las martingalas dan pruebas secuenciales que siguen siendo válidas.
**Aplicaciones.** [Datos] pruebas A/B secuenciales, válidas en cualquier momento · [Bio/Eco] valuación de opciones en el modelo binomial · [Cripto] concentración en algoritmos aleatorizados con la desigualdad de Azuma.
**Lecturas.** Williams, *Probability with Martingales*; Durrett, *Probability: Theory and Examples*.

#### XI.12 Ecuaciones integrales y transporte
*48 págs. · Requiere: XI.6, IX.3 · Complementario*
- Ecuaciones integrales de Fredholm de segunda especie; serie de Neumann y su convergencia.
- Solución por caminos aleatorios: estimadores de von Neumann–Ulam.
- La ecuación de renderizado: radiancia, BRDF (reciprocidad y conservación de la energía) y término geométrico; trazado de caminos con estimación de eventos siguientes.
- Medios participantes: ecuación de transferencia radiativa, funciones de fase y muestreo de distancias.

**Puente.** Entrada: `for (int b = 0; b < maxBounces; ++b) { ...; throughput *= brdf * cosTheta / pdf; }`. Cada rebote es un término de la serie de Neumann de la ecuación de renderizado, y la ruleta rusa permite cortar la serie sin introducir sesgo.
**Aplicaciones.** [3D] trazado de caminos, niebla volumétrica y atmósfera · [Física] transporte de neutrones y de radiación · [Ing] transferencia de calor por radiación.
**Lecturas.** Kress, *Linear Integral Equations*; Veach, *Robust Monte Carlo Methods for Light Transport Simulation*; Pharr, Jakob y Humphreys, *Physically Based Rendering*.

**Parte C — Estadística e información**

#### XI.13 Inferencia estadística
*48 págs. · Requiere: XI.4, II.8 · Núcleo*
- Estimadores: sesgo, varianza, consistencia y error cuadrático medio.
- Máxima verosimilitud y su comportamiento asintótico.
- Intervalos de confianza y contrastes de hipótesis.
- La regresión lineal como problema estadístico; *bootstrap*.

**Puente.** Entrada: el «milisegundos por fotograma» medido una sola vez antes y después de una optimización. Sin un intervalo de confianza no se puede afirmar que mejoró; la estadística convierte la medición de rendimiento en una afirmación con garantías.
**Aplicaciones.** [3D] medición de rendimiento y pruebas A/B en juegos · [Bio/Eco] ensayos clínicos · [Datos] regresión y validación de modelos.
**Lecturas.** Casella y Berger, *Statistical Inference*; Wasserman, *All of Statistics*.

#### XI.14 Aprendizaje estadístico
*40 págs. · Requiere: XI.13, XI.4, IV.5 · Complementario*
- Minimización del riesgo empírico; descomposición entre sesgo y varianza.
- Cotas de generalización: clases finitas, dimensión de Vapnik–Chervonenkis y complejidad de Rademacher.
- Regularización y selección de modelos; validación cruzada.
- Sobreajuste e interpolación: por qué los modelos con más parámetros que datos pueden generalizar (introducción).

**Puente.** Entrada: `model.fit(X_train, y_train)` seguido de `model.score(X_test, y_test)`. Separar datos de prueba es estimar el riesgo verdadero con una muestra independiente, y las desigualdades de concentración dicen cuántos datos de prueba hacen falta para confiar en esa estimación.
**Aplicaciones.** [Datos] selección de modelos y regularización en aprendizaje automático · [Bio/Eco] modelos predictivos en medicina y su validación · [Ing] identificación de sistemas a partir de datos.
**Lecturas.** Shalev-Shwartz y Ben-David, *Understanding Machine Learning*; Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*.

#### XI.15 Inferencia bayesiana y filtrado
*44 págs. · Requiere: XI.13, XI.3 · Núcleo*
- Distribuciones *a priori* y *a posteriori*; familias conjugadas.
- Estimación bayesiana y estimador MAP.
- Filtro de Kalman como inferencia gaussiana recursiva.
- Filtros de partículas.

**Puente.** Entrada: la posición de un jugador remoto estimada a partir de paquetes que llegan tarde o se pierden. Predecir y corregir con mediciones ruidosas es un filtro de Kalman: la mezcla óptima de predicción y medición según sus covarianzas.
**Aplicaciones.** [3D] predicción en juegos en red y seguimiento de controles de realidad virtual · [Ing] navegación y robótica · [Datos] modelos bayesianos.
**Lecturas.** Särkkä, *Bayesian Filtering and Smoothing*; Gelman et al., *Bayesian Data Analysis*.

#### XI.16 Series temporales
*40 págs. · Requiere: XI.9, XI.15 · Complementario*
- Procesos estacionarios; función de autocovarianza y densidad espectral.
- Modelos autorregresivos y de medias móviles (ARMA): estacionariedad, invertibilidad y ecuaciones de Yule–Walker.
- Estimación y pronóstico; modelos en espacio de estados y su relación con el filtro de Kalman.
- Tendencia, estacionalidad y diferenciación; series no estacionarias.

**Puente.** Entrada: `pronostico = modelo.predict(pasos=24)` en un tablero de demanda eléctrica. Un modelo ARMA predice combinando valores pasados con pesos que decaen; que la predicción no explote depende de que las raíces de un polinomio queden fuera del círculo unidad.
**Aplicaciones.** [Datos] pronóstico de demanda y detección de anomalías · [Señales] estimación espectral y modelos autorregresivos de la voz · [Ing] identificación de sistemas y mantenimiento predictivo · [Bio/Eco] econometría y series epidemiológicas.
**Lecturas.** Brockwell y Davis, *Introduction to Time Series and Forecasting*; Shumway y Stoffer, *Time Series Analysis and Its Applications*.

#### XI.17 Entropía e información
*40 págs. · Requiere: XI.13, IV.4 · Núcleo*
- Entropía de Shannon, entropías conjunta y condicional, información mutua.
- Divergencia de Kullback–Leibler; la máxima verosimilitud como minimización de esa divergencia.
- Principio de máxima entropía con multiplicadores de Lagrange: la distribución de Gibbs.
- Teorema de codificación de la fuente; grandes desviaciones y teorema de Cramér.

**Puente.** Entrada: `loss = -sum(y * log(p))`, la entropía cruzada con la que se entrenan los clasificadores. Minimizarla es minimizar la divergencia de Kullback–Leibler entre los datos y el modelo; maximizar la entropía con las mismas herramientas da la distribución de Boltzmann de la física.
**Aplicaciones.** [Física] mecánica estadística: ensambles, función de partición y segunda ley · [Datos] entropía cruzada y selección de modelos · [Cripto] compresión sin pérdida y códigos de Huffman.
**Lecturas.** Cover y Thomas, *Elements of Information Theory*; MacKay, *Information Theory, Inference, and Learning Algorithms*.

#### XI.18 Transporte óptimo
*40 págs. · Requiere: IV.6, XI.2, XI.17 · Complementario*
- Problema de Monge y relajación de Kantorovich; el caso discreto como programa lineal.
- Dualidad de Kantorovich y distancias de Wasserstein; el caso de la recta y las funciones de cuantiles.
- Regularización entrópica y algoritmo de Sinkhorn.
- Teorema de Brenier (enunciado) e interpolación de McCann.

**Puente.** Entrada: `ot.sinkhorn(a, b, M, reg)` en una biblioteca de transporte óptimo. Calcula cómo llevar una distribución sobre otra con el menor costo; la regularización entrópica convierte un programa lineal enorme en una iteración de escalados de filas y columnas que converge rápido.
**Aplicaciones.** [Datos] comparación de distribuciones y modelos generativos con la distancia de Wasserstein · [3D] transferencia de color entre imágenes e interpolación de formas · [Bio/Eco] asignación y emparejamiento en economía · [Física] la ecuación del calor como flujo de gradiente en el espacio de Wasserstein (introducción).
**Lecturas.** Villani, *Topics in Optimal Transportation*; Peyré y Cuturi, *Computational Optimal Transport*.

### Tomo XII — Ecuaciones en derivadas parciales y medios continuos

*Requiere: Tomos VIII, IX y X; importa XI.9 por interfaz · 11 capítulos.* Teoría clásica y numérica de las ecuaciones en derivadas parciales, con las funciones especiales y los métodos de perturbaciones que nacen de ellas, y su aplicación a sólidos deformables y fluidos.

**Parte A — Teoría**

#### XII.1 Ecuaciones en derivadas parciales clásicas
*48 págs. · Requiere: IV.12, VIII.4 · Núcleo*
- Clasificación de las ecuaciones de segundo orden.
- Ecuación de transporte y método de las características.
- Ecuaciones del calor, de onda y de Laplace–Poisson: derivación y fórmula de d'Alembert.
- Principio del máximo, energía y unicidad.

**Puente.** Entrada: `advect(field, velocity, dt)` en una simulación de humo. Transportar una magnitud con un campo de velocidades es resolver la ecuación de transporte, y sus características son las trayectorias de las partículas.
**Aplicaciones.** [3D] advección en humo y fluidos · [Física] conducción del calor y acústica · [Bio/Eco] difusión de sustancias en tejidos.
**Lecturas.** Evans, *Partial Differential Equations*; Strauss, *Partial Differential Equations: An Introduction*.

#### XII.2 Separación de variables y problemas de Sturm–Liouville
*44 págs. · Requiere: XII.1, IX.4 · Núcleo*
- Problemas de contorno y separación de variables.
- Problemas de Sturm–Liouville: autovalores, autofunciones y completitud.
- Separación en coordenadas polares y esféricas; primeras funciones de Bessel y de Legendre (XII.3 las estudia en general).
- Desarrollos en autofunciones para las ecuaciones del calor y de onda.

**Puente.** Entrada: el sonido de un tambor sintetizado como suma de modos. Los modos de una membrana circular son funciones de Bessel, y por eso un tambor no tiene armónicos enteros como una cuerda.
**Aplicaciones.** [Señales] síntesis modal de sonido · [Física] vibraciones de membranas · [3D] sonido procedural de impactos.
**Lecturas.** Strauss, *Partial Differential Equations: An Introduction*; Olver, *Introduction to Partial Differential Equations*.

#### XII.3 Funciones especiales y polinomios ortogonales
*48 págs. · Requiere: XII.2, IX.10 · Núcleo*
- Funciones Gamma y Beta; prolongación analítica de la función Gamma.
- Ecuaciones con puntos singulares regulares: método de Frobenius.
- Funciones de Bessel, polinomios y funciones asociadas de Legendre, polinomios de Hermite y de Laguerre: funciones generatrices, fórmulas de Rodrigues y recurrencias.
- Polinomios ortogonales en general: recurrencia de tres términos y cuadratura gaussiana; la función hipergeométrica como caso unificador.

**Puente.** Entrada: `scipy.special.jv(n, x)` y una tabla de ceros de Bessel en un libro de física. Las funciones especiales no son una colección de fórmulas: son las autofunciones que produce la separación de variables (XII.2), y su ortogonalidad, sus recurrencias y sus ceros salen de la teoría de Sturm–Liouville.
**Aplicaciones.** [Física] oscilador armónico cuántico (Hermite) y átomo de hidrógeno (Laguerre y Legendre) · [Señales] modulación en frecuencia y funciones de Bessel · [Ing] vibraciones de placas circulares y conducción del calor en cilindros.
**Lecturas.** Andrews, Askey y Roy, *Special Functions*; Lebedev, *Special Functions and Their Applications*; Olver et al., *NIST Handbook of Mathematical Functions*.

#### XII.4 Soluciones fundamentales y funciones de Green
*40 págs. · Requiere: XII.2, IX.6 · Núcleo*
- Transformada de Fourier para ecuaciones en todo el espacio.
- Núcleo del calor y solución fundamental de la ecuación de Laplace.
- Funciones de Green y representación de las soluciones.
- Potencial newtoniano.

**Puente.** Entrada: un desenfoque que «difunde» la imagen paso a paso. Aplicar la ecuación del calor durante un tiempo t es convolucionar con una gaussiana de varianza 2t: el núcleo del calor.
**Aplicaciones.** [3D] difusión en imágenes y edición de Poisson · [Física] gravitación y electrostática · [Bio/Eco] modelos de dispersión.
**Lecturas.** Evans, *Partial Differential Equations*; Olver, *Introduction to Partial Differential Equations*.

#### XII.5 Perturbaciones y aproximación WKB
*44 págs. · Requiere: XII.1, IX.11 · Complementario*
- Perturbaciones regulares de ecuaciones algebraicas y diferenciales.
- Perturbaciones singulares y capas límite; desarrollos asintóticos acoplados.
- Método de escalas múltiples y términos seculares.
- Aproximación WKB y fórmulas de conexión.

**Puente.** Entrada: un péndulo calculado con la aproximación de ángulo pequeño que, con amplitudes grandes, se adelanta respecto del real. El período depende de la amplitud; el método de escalas múltiples corrige la frecuencia y elimina el término secular que hace crecer el error con el tiempo.
**Aplicaciones.** [Física] mecánica cuántica semiclásica (WKB) y órbitas perturbadas · [Ing] capas límite en aerodinámica · [3D] péndulos y osciladores no lineales en animación.
**Lecturas.** Bender y Orszag, *Advanced Mathematical Methods for Scientists and Engineers*; Holmes, *Introduction to Perturbation Methods*.

**Parte B — Métodos numéricos**

#### XII.6 Diferencias finitas
*44 págs. · Requiere: XII.1, VIII.12, IX.7 · Núcleo*
- Aproximaciones por diferencias y error de truncamiento.
- Consistencia, estabilidad y convergencia; teorema de equivalencia de Lax.
- Análisis de estabilidad de von Neumann y condición CFL.
- Ecuación de Poisson discreta y su resolución con gradiente conjugado y multigrid.

**Puente.** Entrada: `hNew[i] = 2*h[i] - hOld[i] + (c*dt/dx)*(c*dt/dx) * (h[i-1] - 2*h[i] + h[i+1])` en un estanque. Si c·dt/dx supera 1, la simulación explota: es la condición CFL, que el análisis de von Neumann deduce.
**Aplicaciones.** [3D] agua sobre campos de alturas y erosión de terrenos · [Física] propagación de ondas · [Ing] transferencia de calor en piezas.
**Lecturas.** LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*; Strikwerda, *Finite Difference Schemes and Partial Differential Equations*.

#### XII.7 Leyes de conservación y ondas de choque
*40 págs. · Requiere: XII.1, XII.6, IX.6 · Complementario*
- Leyes de conservación escalares; la ecuación de Burgers y la formación de choques por el cruce de las características.
- Soluciones débiles, condición de Rankine–Hugoniot y condición de entropía; ondas de rarefacción.
- Problema de Riemann y método de Godunov; volúmenes finitos y condición CFL.
- Sistemas hiperbólicos: ecuaciones de aguas someras y de Euler compresibles (introducción).

**Puente.** Entrada: `u[i] -= dt / dx * (flujo[i + 1] - flujo[i])` en un simulador de tráfico o de fluidos, con `flujo[i]` calculado en la cara entre dos celdas. Es un método de volúmenes finitos: actualiza promedios por celda con los flujos de sus caras, y por eso conserva exactamente la cantidad total aunque la solución tenga choques.
**Aplicaciones.** [Ing] flujo de tráfico vehicular: los atascos como ondas de choque · [Física] dinámica de gases y ondas de choque · [3D] simulación de fluidos y de aguas someras en videojuegos.
**Lecturas.** LeVeque, *Finite Volume Methods for Hyperbolic Problems*; Evans, *Partial Differential Equations*.

#### XII.8 Formulación débil y elementos finitos
*52 págs. · Requiere: XII.4, IX.3, II.12, X.5 · Núcleo*
- Planteo en H¹₀ con los espacios de Sobolev de X.5; condiciones de borde esenciales y naturales.
- Formulación débil y teorema de Lax–Milgram.
- Método de Galerkin; elementos lineales en triángulos y tetraedros; matrices de rigidez y de masa.
- Lema de Céa y estimaciones del error.

**Puente.** Entrada: el ensamblado `K[i][j] += area * dot(grad_i, grad_j)` triángulo por triángulo. Es la formulación débil discretizada, y para elementos lineales esa matriz coincide con el laplaciano cotangente de VII.13.
**Aplicaciones.** [Ing] análisis estructural · [3D] sólidos deformables y relación con el laplaciano cotangente · [Física] electrostática en geometrías complejas.
**Lecturas.** Brenner y Scott, *The Mathematical Theory of Finite Element Methods*; Johnson, *Numerical Solution of Partial Differential Equations by the Finite Element Method*.

**Parte C — Medios continuos**

#### XII.9 Mecánica de medios continuos
*48 págs. · Requiere: XII.8, II.10 · Complementario*
- Gradiente de deformación; tensores de deformación de Green y de pequeñas deformaciones.
- Descomposición polar: rotación y estiramiento.
- Tensiones de Cauchy y de Piola; ecuación de equilibrio.
- Elasticidad lineal e hiperelasticidad: modelos de St. Venant–Kirchhoff, neo-hookeano y corrotacional.

**Puente.** Entrada: `F = Ds * inverse(Dm)` en un simulador de tetraedros. Es el gradiente de deformación de un elemento, la aplicación lineal que lleva la forma en reposo a la deformada; su descomposición polar separa la rotación, que no debe generar fuerza, del estiramiento.
**Aplicaciones.** [3D] cuerpos blandos y músculos · [Ing] resistencia de materiales · [Bio/Eco] biomecánica de tejidos.
**Lecturas.** Gonzalez y Stuart, *A First Course in Continuum Mechanics*; Bonet y Wood, *Nonlinear Continuum Mechanics for Finite Element Analysis*; Sifakis y Barbič, «FEM Simulation of 3D Deformable Solids».

#### XII.10 Mecánica de fluidos
*48 págs. · Requiere: XII.6, IV.12 · Núcleo*
- Derivada material y leyes de conservación de la masa y del momento.
- Ecuaciones de Euler y de Navier–Stokes incompresibles; vorticidad.
- Descomposición de Helmholtz–Hodge y proyección de la presión.
- Advección semilagrangiana y división de operadores.

**Puente.** Entrada: `velocity -= gradient(pressure)` tras resolver una ecuación de Poisson. Es la proyección de Helmholtz–Hodge (IV.12): quita al campo de velocidades su parte con divergencia, que es lo que hace incompresible al humo de *Stable Fluids*.
**Aplicaciones.** [3D] humo y fuego con *Stable Fluids* · [Ing] aerodinámica · [Física] meteorología.
**Lecturas.** Chorin y Marsden, *A Mathematical Introduction to Fluid Mechanics*; Bridson, *Fluid Simulation for Computer Graphics*; Stam, «Stable Fluids».

#### XII.11 Ondas en el agua, aguas someras y métodos de partículas
*44 págs. · Requiere: XII.10, XI.9 · Complementario*
- Ondas de superficie y relación de dispersión.
- Ecuaciones de aguas someras.
- Espectros de oleaje y síntesis de océanos con la FFT.
- Hidrodinámica de partículas suavizadas (SPH): aproximación por núcleos, gradiente y laplaciano; flotabilidad.

**Puente.** Entrada: `omega = sqrt(g * k)` en un *shader* de océano. Es la relación de dispersión de las ondas en aguas profundas: las olas largas viajan más rápido, y eso hace que el océano sintetizado con la FFT parezca real.
**Aplicaciones.** [3D] océanos, ríos y barcos que flotan · [Física] maremotos y oleaje · [Ing] ingeniería costera.
**Lecturas.** Tessendorf, «Simulating Ocean Water»; Monaghan, «Smoothed Particle Hydrodynamics»; Vreugdenhil, *Numerical Methods for Shallow-Water Flow*.

### Tomo XIII — Simetría, variedades y teoría cuántica

*Requiere: Tomos VII, IX, X y XI; importa XII.3 por interfaz · 7 capítulos.* La matemática de la física moderna: representaciones de grupos, variedades y geometría del espacio-tiempo, y la estructura matemática de la mecánica cuántica, sobre los operadores del Tomo X. Es el cierre del itinerario de física, como el Tomo XII lo es del medio continuo. Sus capítulos son complementarios en el sentido de 5.3, porque nada del núcleo depende de ellos, pero son el centro del itinerario de física (9.6).

**Parte A — Simetría y representaciones**

#### XIII.1 Representaciones de grupos finitos
*44 págs. · Requiere: I.9, II.11, IX.7 · Complementario*
- Representaciones, subrepresentaciones, teorema de Maschke y lema de Schur.
- Caracteres y relaciones de ortogonalidad; tabla de caracteres.
- Descomposición de la representación regular; análisis de Fourier en un grupo finito, con la DFT como el caso del grupo cíclico.
- Producto tensorial de representaciones y reglas de selección.

**Puente.** Entrada: `X = np.fft.fft(x)`. La DFT descompone una señal en las representaciones irreducibles del grupo cíclico ℤ/nℤ; el capítulo hace lo mismo para cualquier grupo finito, que es lo que usa la química para clasificar las vibraciones de una molécula.
**Aplicaciones.** [Física] modos de vibración de moléculas y reglas de selección en espectroscopía · [Señales] la DFT como análisis armónico en ℤ/nℤ · [Datos] redes neuronales equivariantes respecto de grupos de simetría.
**Lecturas.** Serre, *Linear Representations of Finite Groups*; Sternberg, *Group Theory and Physics*.

#### XIII.2 SU(2), SO(3) y momento angular
*48 págs. · Requiere: XIII.1, VII.4, IX.14 · Complementario*
- Representaciones de grupos de Lie compactos y de sus álgebras; medida de Haar (enunciado) y ortogonalidad.
- Representaciones irreducibles de su(2) mediante operadores escalera; pesos y espín.
- Producto tensorial de representaciones y coeficientes de Clebsch–Gordan.
- Los armónicos esféricos como representaciones irreducibles de SO(3); matrices D de Wigner. Para seguir: teorema de Peter–Weyl.

**Puente.** Entrada: `J± |j, m⟩ = ħ √(j(j+1) − m(m±1)) |j, m±1⟩` en un libro de mecánica cuántica. Es la construcción de las representaciones irreducibles de su(2) con operadores escalera: el «momento angular» de la física es teoría de representaciones, y el espín ½ es la representación de SU(2) que no baja a SO(3).
**Aplicaciones.** [Física] espín, acoplamiento de momentos angulares y estructura atómica · [3D] rotación de coeficientes de armónicos esféricos para iluminación · [Datos] redes equivariantes respecto de rotaciones en química computacional.
**Lecturas.** Hall, *Lie Groups, Lie Algebras, and Representations*; Sakurai y Napolitano, *Modern Quantum Mechanics*.

#### XIII.3 Espacio de Minkowski y grupo de Lorentz
*40 págs. · Requiere: II.9, VII.4, XIII.2 · Complementario*
- Formas bilineales de signatura (1, 3) y espacio de Minkowski; vectores temporales, espaciales y nulos; cono de luz.
- Transformaciones de Lorentz, rapidez como ángulo hiperbólico y composición de velocidades.
- Tiempo propio, cuadrivectores y cinemática relativista.
- El grupo de Lorentz SO⁺(1, 3), su álgebra de Lie y el recubrimiento doble SL(2, ℂ) → SO⁺(1, 3); espinores (introducción). Para seguir: representaciones de grupos no compactos.

**Puente.** Entrada: `x' = gamma * (x - v * t)`, y una métrica escrita diag(−1, 1, 1, 1) en un texto y diag(1, −1, −1, −1) en otro. Una transformación de Lorentz es una isometría de una forma bilineal indefinida (ley de inercia de Sylvester, II.9), y las dos signaturas describen la misma geometría con el signo opuesto: el capítulo enseña a traducir entre ellas.
**Aplicaciones.** [Física] relatividad especial y cinemática de partículas · [Ing] corrección relativista de los relojes del GPS · [3D] visualización relativista: aberración de la luz y efecto Doppler.
**Lecturas.** Naber, *The Geometry of Minkowski Spacetime*; Taylor y Wheeler, *Spacetime Physics*.

**Parte B — Variedades y espacio-tiempo**

#### XIII.4 Variedades diferenciables
*48 págs. · Requiere: IV.3, IV.14, II.11, VI.3 · Complementario*
- Variedades como espacios de Hausdorff con base numerable (VI.3), cartas y atlas; aplicaciones diferenciables; subvariedades y teorema del valor regular.
- Espacio tangente y fibrado tangente; campos vectoriales, flujos y corchete de Lie.
- Campos tensoriales y formas diferenciales en variedades; derivada de Lie.
- Integración en variedades orientadas y teorema de Stokes. Para seguir: topología diferencial (transversalidad y teoría de Morse).

**Puente.** Entrada: un optimizador de orientaciones que actualiza `q = normalize(q + dq)`. Sumar en ℝ⁴ y renormalizar es una retracción: la forma práctica de moverse por la variedad S³ sin salirse de ella. El capítulo da el marco general, espacios tangentes y retracciones, del que esa línea es un caso.
**Aplicaciones.** [Ing] espacios de configuración en robótica · [3D] optimización sobre SO(3) para cámaras y personajes · [Física] espacios de fases como variedades.
**Lecturas.** Lee, *Introduction to Smooth Manifolds*; Tu, *An Introduction to Manifolds*.

#### XIII.5 Geometría riemanniana
*48 págs. · Requiere: XIII.4, VII.9, IV.13 · Complementario*
- Métricas riemannianas; longitud, distancia y volumen.
- Conexión de Levi-Civita, derivada covariante y transporte paralelo.
- Geodésicas y aplicación exponencial.
- Tensor de curvatura de Riemann, curvatura seccional, tensor de Ricci y curvatura escalar; el *theorema egregium* revisitado. Para seguir: fibrados y teorías gauge.

**Puente.** Entrada: `Γ^k_ij = ½ g^kl (∂_i g_jl + ∂_j g_il − ∂_l g_ij)` en un libro de relatividad. Los símbolos de Christoffel son los coeficientes de la conexión de Levi-Civita en coordenadas, y la fórmula se deduce de dos exigencias geométricas: que la conexión no tenga torsión y que conserve la métrica.
**Aplicaciones.** [3D] geodésicas y distancias sobre mallas con el método del calor · [Ing] navegación por círculos máximos · [Física] relatividad general (aviso de XIII.6).
**Lecturas.** do Carmo, *Riemannian Geometry*; Lee, *Introduction to Riemannian Manifolds*.

#### XIII.6 Geometría lorentziana y gravitación
*44 págs. · Requiere: XIII.5, XIII.3 · Complementario*
- Variedades lorentzianas; estructura causal; geodésicas temporales y nulas.
- Las ecuaciones de Einstein como ecuación geométrica; tensor de energía-impulso.
- Solución de Schwarzschild: órbitas, desviación de la luz y corrimiento al rojo gravitacional.
- Ondas gravitacionales linealizadas (introducción).

**Puente.** Entrada: un trazador de rayos que integra `d²x^μ/dλ² + Γ^μ_αβ (dx^α/dλ)(dx^β/dλ) = 0` para dibujar un agujero negro. Cada rayo es una geodésica nula de la métrica de Schwarzschild, y los anillos de luz alrededor del horizonte salen de resolver esa ecuación diferencial.
**Aplicaciones.** [3D] imágenes de agujeros negros y lentes gravitacionales con rayos curvos · [Ing] corrección gravitacional de los relojes del GPS · [Física] precesión del perihelio de Mercurio y ondas gravitacionales.
**Lecturas.** Carroll, *Spacetime and Geometry*; Wald, *General Relativity*.

**Parte C — Teoría cuántica**

#### XIII.7 Estructura matemática de la mecánica cuántica
*52 págs. · Requiere: X.6, XIII.2, II.11, XI.3, XII.3 · Complementario*
- Estados como rayos de un espacio de Hilbert, observables autoadjuntos y regla de Born como medida de probabilidad.
- Evolución unitaria y ecuación de Schrödinger; imágenes de Schrödinger y de Heisenberg; de los corchetes de Poisson a los conmutadores.
- Oscilador armónico con operadores escalera (funciones de Hermite) y átomo de hidrógeno (armónicos esféricos y polinomios de Laguerre).
- Sistemas compuestos: producto tensorial, entrelazamiento y matrices densidad. Para seguir: teoría cuántica de campos.

**Puente.** Entrada: `state = kron(q0, q1)` en un simulador de computación cuántica, y |ψ⟩ = (|00⟩ + |11⟩)/√2 en un libro. Un sistema de dos cúbits vive en el producto tensorial (II.11); un estado está entrelazado exactamente cuando no es un tensor descomponible, y esa es la propiedad que aprovecha la computación cuántica.
**Aplicaciones.** [Cripto] computación cuántica y distribución cuántica de claves · [Física] espectroscopía y estructura del átomo · [Bio/Eco] química cuántica de moléculas.
**Lecturas.** Hall, *Quantum Theory for Mathematicians*; Nielsen y Chuang, *Quantum Computation and Quantum Information*; Sakurai y Napolitano, *Modern Quantum Mechanics*.

<!-- /indice -->

## 14. Extensión

Generada desde los datos del índice con `npm run indice:spec` (decisión 0002), como las tablas de las secciones 6 y 9.6 y el índice de la sección 13.

<!-- extension: generado desde indice/ con `npm run indice:spec`; no editar a mano -->

| Tomo | Caps. | Págs. | Caps. de núcleo | Págs. de núcleo | Aplicaciones [3D] | Aplicaciones [Física] |
| --- | --- | --- | --- | --- | --- | --- |
| I | 14 | 592 | 12 | 508 | 13 de 47 (28 %) | 4 de 47 (9 %) |
| II | 17 | 672 | 16 | 632 | 16 de 56 (29 %) | 12 de 56 (21 %) |
| III | 12 | 520 | 11 | 484 | 11 de 37 (30 %) | 6 de 37 (16 %) |
| IV | 14 | 564 | 12 | 484 | 13 de 43 (30 %) | 7 de 43 (16 %) |
| V | 9 | 396 | 7 | 308 | 7 de 22 (32 %) | 3 de 22 (14 %) |
| VI | 11 | 452 | 7 | 300 | 10 de 34 (29 %) | 7 de 34 (21 %) |
| VII | 15 | 640 | 13 | 560 | 15 de 46 (33 %) | 7 de 46 (15 %) |
| VIII | 14 | 592 | 10 | 440 | 11 de 44 (25 %) | 12 de 44 (27 %) |
| IX | 14 | 620 | 11 | 500 | 10 de 43 (23 %) | 11 de 43 (26 %) |
| X | 8 | 348 | 4 | 176 | 5 de 24 (21 %) | 6 de 24 (25 %) |
| XI | 18 | 776 | 11 | 488 | 14 de 56 (25 %) | 9 de 56 (16 %) |
| XII | 11 | 500 | 7 | 324 | 10 de 33 (30 %) | 10 de 33 (30 %) |
| XIII | 7 | 324 | 0 | 0 | 5 de 21 (24 %) | 7 de 21 (33 %) |
| **Total** | **164** | **6.996** | **121** | **5.204** | **140 de 506 (28 %)** | **101 de 506 (20 %)** |

- Los capítulos tienen entre 28 y 52 páginas, con una media de 42,7.
- Cada tomo suma además unas 50 páginas de material propio: «Lo que este tomo importa», «Lo que este tomo exporta», notación y convenciones, diccionario academia–práctica del tomo, soluciones de los ejercicios impares e índice analítico. En total, unas 650 páginas, para unas 7.646 en toda la obra.
- El hilo 3D ocupa entre el 21 % y el 33 % de las aplicaciones de cada tomo, y el de física entre el 9 % y el 33 %: ninguno supera el límite de un tercio (9.2).
- El Tomo XIII no tiene capítulos de núcleo: todo él es complementario en el sentido de 5.3.

| Campo (9.1) | Aplicaciones | Proporción |
| --- | --- | --- |
| [3D] | 140 | 28 % |
| [Física] | 101 | 20 % |
| [Ing] | 98 | 19 % |
| [Datos] | 61 | 12 % |
| [Bio/Eco] | 48 | 9 % |
| [Señales] | 32 | 6 % |
| [Cripto] | 26 | 5 % |
| **Total** | **506** | **100 %** |

| Itinerario (9.6) | Caps. | Págs. de capítulos |
| --- | --- | --- |
| Núcleo | 121 | 5.204 |
| Física | 141 | 6.092 |
| Gráficos y 3D | 135 | 5.776 |
| Datos | 132 | 5.644 |

Los cuatro itinerarios están cerrados bajo dependencias: cada capítulo que incluyen tiene todos sus requisitos dentro del mismo itinerario. El de física deja fuera 23 capítulos: I.13, I.14, II.13, III.11, IV.9, V.8, V.9, VI.8, VI.9, VI.10, VI.11, VII.15, VIII.6, VIII.7, VIII.10, IX.8, X.4, X.7, XI.7, XI.11, XI.14, XI.16 y XI.18.

<!-- /extension -->

La ingeniería tiene casi tantas aplicaciones como la física sin ser un hilo fijo (2.1 y 17).

El índice del motor sumaba 3.384 páginas, y la versión 0.1 de esta especificación, 4.536. La arista de la física añade 680 páginas: 224 entran en el núcleo, que pasa de 4.072 a 4.296, y el resto son complementarias, sobre todo el Tomo XIII. Las materias clásicas de la versión 0.5 (álgebra, topología, análisis funcional y fundamentos) añaden 1.244 páginas: 868 entran en el núcleo, que pasa de 4.296 a 5.164. Los catorce capítulos de alto impacto de la versión 0.7 añaden 536 páginas, de las cuales 40 entran en el núcleo, que llega a 5.204.

## 15. Correspondencia con el índice anterior

Ningún tema del índice anterior se pierde sin decisión explícita. Esta tabla dice dónde queda cada uno de sus 76 capítulos.

| Cap. anterior | Tema | Dónde queda |
| --- | --- | --- |
| 1 | Lógica, conjuntos y demostración | I.1, I.2 |
| 2 | Álgebra elemental y funciones | Funciones en I.2; iteración y convergencia en III.1; exponenciales y logaritmos en III.8; el resto del precálculo se supone de la secundaria |
| 3 | Aritmética de punto flotante | I.12, II.17 |
| 4 | Geometría analítica cartesiana | Normas y distancias en II.8; rectas y planos en II.14; lateralidad como predicado en VII.10 |
| 5 | Trigonometría y coordenadas curvilíneas | Trigonometría rigurosa y `atan2` en III.8; coordenadas curvilíneas en IV.10; cúbica trigonométrica en II.6; parametrizaciones de la esfera en VII.9 |
| 6 | Números complejos | I.11, III.8, IX.9 |
| 7 | Aritmética modular, combinatoria y pseudoaleatorios | I.5, I.6, XI.5 |
| 8 | Grafos, caminos mínimos y lenguajes formales | I.8; los lenguajes regulares y los autómatas, en I.13; las gramáticas libres de contexto quedan fuera («Para seguir» en I.13) |
| 9 | Vectores, combinaciones lineales y bases | II.2 |
| 10 | Producto escalar, producto vectorial y geometría métrica | II.8; producto vectorial en II.4 |
| 11 | Matrices y transformaciones lineales | II.1, II.3; orden en memoria en II.15 |
| 12 | Sistemas lineales, rango y espacios fundamentales | II.1, II.3 |
| 13 | Determinantes, condicionamiento y métodos iterativos | II.4, II.12 |
| 14 | Autovalores, autovectores y teorema espectral | II.6, II.9 |
| 15 | SVD, mínimos cuadrados y descomposición polar | II.8, II.10 |
| 16 | Límites y derivadas | III.3, III.4; derivación numérica en III.10 |
| 17 | Integrales | III.5 |
| 18 | Series, Taylor y exponencial compleja | III.2, III.6, III.7, III.8; exponencial de matrices en VIII.3 |
| 19 | Ecuaciones no lineales y raíces de polinomios | III.10; aplicación contractiva en III.12 |
| 20 | Cuadratura y aproximación de funciones | III.9, III.10 |
| 21 | Espacios afines y coordenadas homogéneas | II.14 |
| 22 | Geometría proyectiva y rasterización | VII.2, VII.3 |
| 23 | Rotaciones: matrices, eje y ángulo, ángulos de Euler | II.16 |
| 24 | Cuaterniones e interpolación de orientaciones | II.16 |
| 25 | Grupos de Lie y movimientos rígidos | VII.4 |
| 26 | Álgebra exterior y PGA | Álgebra exterior en IV.14; PGA en «Para seguir» de IV.14 |
| 27 | Cálculo diferencial multivariable | IV.2 |
| 28 | Integración múltiple | IV.10 |
| 29 | Cálculo vectorial y teoremas integrales | IV.11, IV.12 |
| 30 | Optimización sin restricciones | IV.5, IV.8 |
| 31 | Diferenciación automática | IV.8 |
| 32 | Multiplicadores de Lagrange, KKT y dualidad | IV.4, IV.7 |
| 33 | Complementariedad y métodos iterativos proyectados | VIII.14 |
| 34 | Álgebra lineal dispersa y métodos iterativos | II.12; gradiente conjugado en IV.8; multigrid en XII.6 |
| 35 | Series de Fourier y funciones ortogonales | IX.3, IX.4 |
| 36 | Transformada de Fourier, convolución y FFT | IX.5, IX.7 |
| 37 | Teoría del muestreo y reconstrucción | IX.7 |
| 38 | Armónicos esféricos | IX.14 |
| 39 | Curvas paramétricas: interpolación, Bézier y B-splines | III.9, VII.6 |
| 40 | Superficies paramétricas y NURBS | VII.6 |
| 41 | Geometría diferencial de curvas y superficies | VII.7, VII.8 |
| 42 | Topología y estructura de mallas | VII.13 |
| 43 | Geometría diferencial discreta | VII.13 |
| 44 | Procesamiento de mallas | VII.13 |
| 45 | Superficies implícitas y campos de distancia | VII.14 |
| 46 | Predicados robustos, consultas e intersecciones | VII.10 |
| 47 | Conjuntos convexos y separación | IV.5, VII.11 |
| 48 | Distancia entre convexos y tiempo de impacto | VII.11 |
| 49 | Triangulaciones y diagramas de Voronoi | VII.12 |
| 50 | Particiones del espacio, curvas de llenado y geometría integral | VII.15 |
| 51 | EDO de primer y segundo orden | VIII.1, VIII.2 |
| 52 | Sistemas de EDO, estabilidad y control | VIII.3, VIII.4, VIII.7 |
| 53 | Integradores explícitos y estabilidad | VIII.12 |
| 54 | Integradores implícitos, simplécticos y en grupos de Lie | VIII.12, VIII.13 |
| 55 | Mecánica del sólido rígido | VIII.11 |
| 56 | Cinemática de cadenas articuladas | Aplicaciones: cinemática directa y *skinning* en VII.4; cinemática inversa en IV.8 |
| 57 | Mecánica lagrangiana y restricciones | VIII.8, VIII.13 |
| 58 | Contacto, fricción y métodos por posiciones | VIII.13, VIII.14 |
| 59 | EDP clásicas y separación de variables | XII.1, XII.2 |
| 60 | Diferencias finitas y estabilidad | XII.6 |
| 61 | Mecánica de medios continuos | XII.9 |
| 62 | Método de elementos finitos | XII.8 |
| 63 | Navier–Stokes y Helmholtz–Hodge | IV.12, XII.10 |
| 64 | Métodos de partículas y aguas someras | XII.11 |
| 65 | Probabilidad: variables aleatorias y distribuciones | XI.1, XI.2, XI.4 |
| 66 | Distribuciones multivariantes y generación de muestras | XI.3, XI.5 |
| 67 | Monte Carlo y muestreo por importancia | XI.6 |
| 68 | Cuasi-Monte Carlo y remuestreo | XI.7; remuestreo en XI.6 |
| 69 | Procesos puntuales y ruido azul | XI.9 |
| 70 | Campos aleatorios, ruido procedural y fractales | XI.9 |
| 71 | Radiometría y fotometría | Aplicaciones en IV.10 y XI.12 |
| 72 | Colorimetría | Aplicaciones: espacios de color en II.3; codificación gamma en III.8 |
| 73 | La ecuación de renderizado | XI.12 |
| 74 | BRDF y microfacetas | Aplicaciones en XI.2, XI.5 y XI.12 |
| 75 | Serie de Neumann y trazado de caminos | XI.12 |
| 76 | Ecuación de transferencia radiativa | XI.12; Beer–Lambert en VIII.1 |

Además:

- **Motor del libro (hitos H0 a H22):** se elimina. Lo sustituyen las demos de cada aplicación y las páginas de hilo (9.3 y 9.4).
- **Material preliminar:** «El motor 3D como mapa de problemas» pasa a ser la página del hilo 3D; el grafo de dependencias se genera desde los metadatos (11.4).
- **Apéndices:** pasan a cada tomo (sección 14).
- **Capítulos sin equivalente en el índice anterior,** añadidos en la versión 0.2 con la arista de la física: II.11, IV.13, IX.6, IX.11, XI.17, XII.3, XII.5 y el Tomo XIII entero.
- **Capítulos añadidos en la versión 0.5** con las materias clásicas: I.4, I.14, IX.2 y los Tomos V, VI y X enteros (el capítulo X.6 es el antiguo capítulo de operadores en espacios de Hilbert).
- **Capítulos añadidos en la versión 0.7** por su impacto: I.7, I.13, II.13, III.11, IV.9, VI.10, VII.5, VIII.6, VIII.10, XI.11, XI.14, XI.16, XI.18 y XII.7.

## 16. Plan de trabajo

### 16.1 Fases

| Fase | Trabajo | Criterio para pasar a la siguiente |
| --- | --- | --- |
| 0. Infraestructura | Repositorio, sitio (Astro y Starlight), plantilla de capítulo, metadatos, comprobaciones automáticas (el script que verificó este documento es la base), biblioteca común de las demos, primera versión del diccionario y del conversor de convenciones | Un capítulo de prueba se publica con todas las comprobaciones en verde |
| 1. Primer capítulo | I.1, *Lógica y demostración*, con todos los elementos de la plantilla y de la guía de estilo (7.1) | Se prueba con 5 a 10 estudiantes que terminaron la escuela secundaria: al terminar, explican el fragmento de salida; la plantilla y la guía se ajustan con lo aprendido |
| 2. Tomo I | Capítulos en orden, publicados uno a uno en la web | Tomo completo, con sus páginas de importación y exportación |
| 3. Tomos II y III | En orden; se pueden escribir en paralelo | Base de la obra completa |
| 4. Tomo IV | En orden | Puerta de los tomos de área abierta |
| 5. Tomos de área | Orden propuesto: VII, V, VI, IX, X, VIII, XI, XII y XIII | Cada tomo, completo y verificado |

La obra se escribe desde el principio, en el orden de lectura. Así cada capítulo se apoya en capítulos ya escritos, las referencias apuntan a texto real y la voz de la obra se forma desde el primer capítulo. El Tomo II sigue siendo el lugar donde el abismo es paradigmático; llega tercero en el plan, pero el diseño de sus capítulos ya está en el índice.

### 16.2 Cuándo un capítulo está terminado

- Requisitos, tipo y metadatos verificados automáticamente.
- Demostraciones revisadas por un segundo matemático.
- Fragmento de entrada explicado en la salida; las cinco preguntas del Puente respondidas o declaradas no aplicables.
- De 2 a 4 aplicaciones de al menos dos campos, con al menos una interactiva y todas con texto alternativo.
- Celdas de código ejecutadas, ejercicios verificados y soluciones de los impares escritas.
- Términos nuevos añadidos al diccionario academia–práctica.
- Redacción conforme a la guía de estilo (7.1): las comprobaciones automáticas pasan y una lectura de estilo, con la lista de la guía, la aprueba.

## 17. Decisiones abiertas

| Decisión | Propuesta actual |
| --- | --- |
| Título definitivo | «Matemática y práctica» es provisional |
| Licencias del texto y del código; modelo de publicación | Por decidir: por ejemplo, web gratuita y PDF o impresión de pago. El repositorio es público y, mientras no tenga licencia, su contenido queda con todos los derechos reservados |
| Herramienta de edición | Decidido: Astro con Starlight (decisión 0001 del repositorio) |
| Lenguajes del código | Python (Pyodide) para el cálculo en vivo y TypeScript para el sitio y las figuras |
| Soluciones de los ejercicios pares | Espacio para docentes |
| Capítulos complementarios en la primera edición | Publicar primero el recorrido de núcleo y después los complementarios |
| Itinerario de ingeniería | La ingeniería tiene 98 aplicaciones, casi tantas como la física (101), pero no tiene itinerario (2.1). Propuesta: núcleo, más IV.14, VIII.7, XI.7, XII.9 y XIII.4 (termodinámica, control, diseño de experimentos, estructuras y espacios de configuración); son 126 capítulos y 5.416 páginas, cerrado bajo dependencias |
| Extensión | Unas 6.996 páginas de capítulos, 5.204 de núcleo. Si se quiere reducir el núcleo, la primera palanca son los capítulos clásicos que ningún otro capítulo de núcleo necesita (V.7, VI.3 y VI.6: unas 120 páginas); la segunda, bajar la media de páginas por capítulo |
| Signatura de la métrica | (−, +, +, +), con traducción explícita a (+, −, −, −) |
| Idioma | Español; traducción al inglés por decidir |
| Revisión externa | Definir quiénes revisan las demostraciones y con qué estudiantes se prueba el primer capítulo |
