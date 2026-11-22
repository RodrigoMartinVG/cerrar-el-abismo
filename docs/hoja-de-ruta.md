# Hoja de ruta: el Tomo I y la coherencia de la obra

*Versión del 22 de noviembre de 2026. Se actualiza en el mismo commit que cierra cada casilla.*

Este documento reúne todo lo que falta para dar por terminado el Tomo I (especificación, 16.1 y 16.2) y lo que
conviene revisar en el resto de la obra mientras tanto. Ordena el trabajo en fases, dice qué depende de qué y quién
hace cada cosa: **[autor]**, **[Claude]** o **[ambos]**. El origen de cada punto es la revisión del 22 de noviembre,
la especificación o el análisis de densidad del mismo día.

## Dónde estamos

- Los quince capítulos del Tomo I están escritos en **borrador** y pasan todas las comprobaciones automáticas. Las
  comprobaciones verifican la forma, no la verdad: de los **183 resultados**, ninguno está revisado todavía
  (`npm run revision`).
- Los 33 libros de las lecturas están en `libros/`, con su texto extraído para buscar en ellos.
- Ya está hecho: el registro de revisión (decisión 0005); las correcciones puntuales de la revisión; las celdas
  independientes y con semilla; el registro de terminología; la conjugación y el producto directo en I.7; «Detener»,
  el aviso cuando Python no carga y «Reportar un error»; las licencias; la página «Cómo se hace»; el nuevo orden del
  tomo, con los conjuntos y los órdenes en I.11 e I.12; la regla de la Entrada y la Salida sin licencias.
- **El texto es demasiado denso para su lector.** Trata los mismos temas que los libros de referencia en entre la cuarta
  y la octava parte del espacio: hay 17 ejemplos con entorno propio para 89 definiciones y 183 resultados, 6 figuras
  y 4 menciones de un contraejemplo. Las causas son tres: el alcance de cada capítulo, que los capítulos quedaron al
  70 % de su extensión prevista, con el recorte en los ejemplos, y un borrador escrito de una vez siguiendo la lista
  de contenidos. La guía de estilo ya pedía ejemplos y contraejemplos, pero nada lo comprueba.

## Cómo se avanza

- **La revisión marca el ritmo.** Lo que cambia un resultado (su enunciado o su demostración) se hace antes de la
  pasada del autor, porque después invalidaría su revisión. Lo que no toca resultados, como los ejemplos, las figuras
  y los ejercicios, puede avanzar en paralelo con ella.
- **Las decisiones van antes que el trabajo, y un piloto antes de un cambio en todo el tomo.**
- **Cada punto termina en un commit** que pasa `npm run verify` y, si toca el sitio, `npm run e2e`. Se sube a `main`
  con la aprobación del autor.

Las fases A y B van primero. C se hace antes de la pasada del autor (F1); D y E pueden avanzar en paralelo con F1; G
es la condición para empezar el Tomo II.

## Fase A. Calibrar y decidir

- [ ] **A1. Piloto de densidad** [Claude; el autor juzga]. Reescribir «Subgrupos y el teorema de Lagrange» de I.7 con
      el patrón de A2: el caso chico hecho a mano, la definición, dos ejemplos y un no-ejemplo, el resultado con su
      idea, la demostración, un ejemplo que lo use y un contraejemplo (la recíproca de Lagrange falla en $A_4$).
      Medir el antes y el después.
- [ ] **A2. El ritmo en la guía de estilo** [Claude], una vez aprobado el piloto: el patrón de cada concepto central,
      metas medibles (ejemplos por definición, contraejemplos por capítulo, casos hechos a mano) y un reporte de
      densidad por capítulo, como el de `npm run revision`. Si las metas se exigen en las pruebas o solo se informan,
      se decide con el piloto a la vista.
- [ ] **A3. Decisiones del autor** [autor]:
  - [ ] la extensión: llevar los capítulos a la prevista (28 a 52 páginas) con ejemplos, o recortar el alcance de los
        más cargados (I.7, I.13, I.6, I.8) y llevar temas a «Para seguir» o a otro capítulo;
  - [ ] las figuras estáticas: hoy `::figura` solo admite piezas interactivas, y temas como los autómatas necesitan
        diagramas; si se agregan, es una enmienda de la decisión 0003;
  - [ ] los ejercicios: cuántos por capítulo, la mezcla de los cinco tipos (sección 10) y el mecanismo de
        verificación automática;
  - [ ] congelar el índice en la versión 1.0, con las ideas nuevas en `docs/propuestas/`;
  - [ ] la regla del repaso para los tomos siguientes: con los libros al final de cada tomo, como ahora, o capítulo
        por capítulo;
  - [ ] I.12 es de núcleo y ningún capítulo lo requiere: confirmarlo así o pasarlo a complementario;
  - [ ] quién hace la segunda pasada, y con qué estudiantes se prueba I.1.
- [ ] **A4. El protocolo de la prueba con estudiantes** [Claude]: preguntas sobre I.1 según el modelo de
      Mejía-Ramos y otros (2012), con el criterio de 16.1, que el estudiante explique el fragmento de la Salida.

## Fase B. La coherencia de la obra

Va antes de reescribir el Tomo I, porque lo que piden los otros tomos define lo que el Tomo I tiene que entregar.

- [ ] **B1. Requisitos que faltan en el índice** [Claude; el autor aprueba]. Encontrados el 22 de noviembre, buscando
      capítulos que usan un tema del Tomo I sin depender de su capítulo:
  - [ ] II.6 usa los complejos y el teorema fundamental del álgebra, y no requiere I.9;
  - [ ] III.2 abre con una suma en float32 que deja de crecer, y no requiere I.10, así que su Salida violaría la regla
        de 8.1;
  - [ ] III.7 compara el error de truncamiento con el de redondeo, y no requiere I.10;
  - [ ] VI.6 calcula grupos fundamentales de grafos, y no requiere I.6;
  - [ ] IV.8 usa el grafo de cómputo de la diferenciación automática: decidir si requiere I.6 o se basta solo;
  - [ ] II.14, VI.2 y VIII.5 mencionan grafos de escena, componentes conexas y redondeo en sus aplicaciones o en el
        Puente: confirmar que son avisos legítimos.
- [ ] **B2. La interfaz del Tomo I** [Claude]. Veintiocho capítulos de otros tomos requieren directamente uno del
      Tomo I: I.7 tiene seis dependientes, I.6 e I.8 cinco cada uno, e I.12 a I.15 ninguno. Hacer una tabla con lo que
      usa cada uno, comprobar que el capítulo del Tomo I lo entrega y completar lo que falte. De la tabla sale la
      página «Lo que este tomo exporta» (E5).
- [x] **B3. Las promesas a otros tomos.** Las licencias que el Tomo I deja para otros tomos (II.2, II.14, II.16,
      III.8, III.11, VI.8, VII.12, VIII.2, IX.1 y XI.1) están todas en los contenidos del índice del capítulo prometido.
      Se verifica de nuevo cuando cambie el índice.
- [ ] **B4. Las fronteras entre capítulos** [Claude; el autor aprueba]. Para cada par, qué hace el capítulo del
      Tomo I, qué agrega el posterior y qué hay que ajustar en el índice:
  - [ ] I.4 y V.3, el teorema chino del resto;
  - [ ] I.8 con V.3 y V.5, los anillos y los cuerpos;
  - [ ] I.6 con VI.2, VI.6 y II.13, las componentes conexas, los grafos como espacios y el espectro;
  - [ ] I.10 con II.12, II.17, III.10, VII.3 y VII.10, la coma flotante;
  - [ ] I.11 con V.3, VI.2 y X.1, el lema de Zorn;
  - [ ] I.14 y III.11, la complejidad;
  - [ ] I.7 y V.8, el cofactor de una curva elíptica, que ahora aparece en los dos.
- [ ] **B5. Los temas recurrentes** [Claude]. Un registro (`indice/temas.yaml`) que diga en qué capítulos vuelve cada
      tema y qué agrega cada vuelta, con una prueba: cristalografía, teselaciones, simetrías de moléculas,
      característica de Euler, coma flotante, grafos de escena, curvas de Bézier, armónicos esféricos, los relojes del
      GPS y Pohlig–Hellman.
- [ ] **B6. Las lecturas con función declarada** [Claude]: rigor, práctica (la fuente del fragmento y de las
      aplicaciones), primer contacto, historia y texto en español. Primero en el Tomo I, después en los demás.
- [ ] **B7. La especificación al día** [Claude]: la sección 6 (lo que cada tomo importa y exporta), 9.4 (el hilo 3D
      del Tomo I con la regla nueva), 14 (la extensión, tras A3), 16 (qué quedó hecho de las fases 0 y 1) y 17 (las
      decisiones abiertas).
- [ ] **B8. Terminología y notación** [Claude]: ampliar el registro de terminología con lo que aparezca y comprobar
      el Tomo I contra las convenciones de la sección 12.

## Fase C. Corregir el texto antes de la pasada del autor

- [ ] **C1. Lectura previa contra los libros** [Claude], capítulo por capítulo, de I.1 a I.15: enunciados,
      demostraciones, hipótesis usadas, cifras, historia, afirmaciones sobre la práctica y la regla de 8.1 en lo que
      ninguna prueba ve. Se corrige lo que se encuentra, pero no se registra: no es una de las dos pasadas. Incluye lo
      que la revisión dejó pendiente:
  - [ ] mover la cota de Miller–Rabin al final del Desarrollo de I.7;
  - [ ] citar FIPS 197 en la Entrada de I.8, de donde sale `xtime`.
- [ ] **C2. Las demostraciones omitidas, con referencia exacta y lo que se pierde al omitirlas** [Claude]: I.14
      (Matiyasevich, Cook–Levin), I.7 (el teorema de Gauss sobre los $n$ con $(\mathbb Z/n\mathbb Z)^\times$
      cíclico), I.9 (el teorema fundamental del álgebra) y las que aparezcan en C1. Opcional: un atributo en el
      entorno que lo exija.
- [ ] **C3. Las demostraciones demasiado comprimidas** [Claude], señaladas en C1: se reescriben ahora, antes de que
      se registren.
- [ ] **C4. Las salidas de las celdas, comparadas con el texto** [Claude]: que una prueba falle si una celda cambia y
      el texto sigue citando la salida vieja.

## Fase D. Densidad y pedagogía

Se aplica capítulo por capítulo, en orden de lectura, con el patrón y las metas de A2 y la extensión de A3. Los
ejemplos nuevos no cambian la huella de ningún resultado, así que esta fase avanza en paralelo con F1.

- [ ] **D1.** I.1
- [ ] **D2.** I.2
- [ ] **D3.** I.3
- [ ] **D4.** I.4
- [ ] **D5.** I.5
- [ ] **D6.** I.6
- [ ] **D7.** I.7, con $S_3$ y $D_4$ trabajados enteros: tabla, subgrupos y cuáles son normales
- [ ] **D8.** I.8
- [ ] **D9.** I.9
- [ ] **D10.** I.10
- [ ] **D11.** I.11
- [ ] **D12.** I.12
- [ ] **D13.** I.13, con los autómatas dibujados
- [ ] **D14.** I.14
- [ ] **D15.** I.15

Cada capítulo cierra con su reporte de densidad dentro de las metas, la Motivación revisada y «Lo esencial» al día.

## Fase E. Completar la plantilla

- [ ] **E1. Figuras interactivas en los diez capítulos que no tienen** [Claude]:
  - I.5: el algoritmo de De Casteljau con puntos que se arrastran, y el triángulo de Pascal;
  - I.6: un grafo editable con BFS, Dijkstra y A*;
  - I.7: la tabla de Cayley de $S_3$ o de $D_4$, y el rompecabezas de quince piezas con su signo;
  - I.8: la multiplicación en $GF(2^8)$ bit a bit;
  - I.9: la multiplicación compleja como rotación y escala, y las cortaduras;
  - I.10: la recta de los números de coma flotante con su espaciado, y el error de una suma según el orden;
  - I.11: los ordinales hasta $\omega^2$, y una sucesión de Goodstein paso a paso;
  - I.13: un autómata que procesa una palabra, y la construcción de subconjuntos;
  - I.14: una máquina de Turing paso a paso;
  - I.15: una deducción natural y su término, lado a lado.
- [ ] **E2. Una aplicación interactiva en cada capítulo** (9.2) [Claude]; hoy faltan en I.7, I.13, I.14 e I.15.
- [ ] **E3. Fragmentos reales con su fuente** (8.1) [Claude]: hoy solo I.7 cita la suya. Candidatos: FIPS 197 en
      I.8, `Object3D.updateMatrixWorld` de three.js en I.6, el módulo `re` en I.13, el tutorial de Z3 en I.14 y la
      biblioteca de Lean en I.15. Cuando no haya uno adecuado, la Entrada dice que el fragmento es propio. Un campo
      `fuente` en el frontmatter y una prueba lo exigen, y la licencia del fragmento tiene que ser compatible con la de
      la obra.
- [ ] **E4. Ejercicios** [Claude], según A3: dificultad y sección en cada uno, más ejercicios de cálculo, de
      exploración y de traducción, verificación automática de las respuestas y las soluciones de los impares.
- [ ] **E5. La página «Lo que este tomo exporta»** [Claude], desde la tabla de B2.
- [ ] **E6. Un prototipo del PDF del Tomo I** [Claude]: elegir entre LaTeX y Typst (decisión 0001) y ver qué
      directivas y qué figuras necesitan una versión impresa, como un fotograma de cada figura (11.7).

## Fase F. La revisión registrada y el cierre

- [ ] **F1. La primera pasada** [autor]: capítulo por capítulo, con los libros, cada resultado y los cinco aspectos,
      registrados con `npm run revision`.
- [ ] **F2. La lectura de estilo** [autor], con la lista de la guía, como el aspecto `estilo` del registro.
- [ ] **F3. La prueba de I.1 con cinco a diez estudiantes** (16.1, fase 1) [autor], y los ajustes a la plantilla y a la
      guía que salgan de ella [ambos].
- [ ] **F4. La segunda pasada** [otro matemático], resultado por resultado.
- [ ] **F5. Los estados**: cada capítulo pasa a `revision` y a `terminado` cuando su registro lo permite; las pruebas
      lo comprueban.

El Tomo I está terminado cuando sus quince capítulos están en `terminado` y existe su página de exportación
(16.1, fase 2).

## Fase G. Antes del Tomo II

- [ ] **G1. Lo que quedó de la fase 0** [Claude]: el conversor de convenciones (8.5), el comparador exacto frente a
      float32, la biblioteca común de las demos 3D y las páginas de hilo (9.3).
- [ ] **G2. Una prueba con NumPy en Pyodide**, en el navegador y en Node [Claude], porque el Tomo II lo va a usar.
- [ ] **G3. Las fronteras entre el Tomo I y el Tomo II** [Claude]: II.1, II.4, II.6, II.8, II.12, II.13 e II.16
      dependen del Tomo I; lo general de B4, en detalle para ellos.
- [ ] **G4. Mantenimiento** [Claude]: avisos de actualización de las dependencias (Renovate o Dependabot), una nota
      «cifras a la fecha de la decisión» en la decisión 0001, y servir Pyodide desde el propio sitio o tener un
      respaldo, si las redes que bloquean la CDN resultan un problema.
