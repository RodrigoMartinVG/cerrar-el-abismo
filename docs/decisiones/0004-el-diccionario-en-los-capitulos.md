# 0004. El diccionario academia–práctica se escribe en los capítulos

*Fecha: 2026-11-21 · Estado: aceptada*

## Contexto

La séptima capa del abismo (especificación, sección 3) es el vocabulario: la práctica llama de otra manera a lo que la
matemática ya nombró («normal» por covector, «*lerp*» por combinación afín, «hermítico» por autoadjunto). El remedio es
el diccionario academia–práctica (8.5), que también funciona de español a inglés. La sección 16.2 pide que todo
capítulo terminado agregue sus términos, y cada tomo tendrá el suyo (sección 14). Hacía falta decidir dónde viven los
términos antes de que hubiera muchos.

## Decisión

- **Cada capítulo declara sus términos** en el campo `diccionario` de su frontmatter, junto a `supone`. Un término
  pertenece al capítulo que lo define, y ningún término se define en dos capítulos.
- **Una entrada** tiene:
  - `termino`: el término de la obra;
  - `ingles`: su nombre académico en inglés;
  - `practica`: cómo se lo llama o se lo escribe en la práctica, una lista;
  - `nota`: una o dos frases que dicen en qué coinciden los dos lados y dónde dejan de coincidir;
  - `ancla` (opcional): la etiqueta del entorno del capítulo que lo define;
  - `campos` (opcional): los campos de aplicación de los nombres prácticos.

  Los textos son Markdown en línea, sin fórmulas.
- **La página `/diccionario/`** reúne las entradas de todos los capítulos escritos, en orden alfabético, con un
  buscador que encuentra cualquiera de los lados: «*lerp*» lleva a «combinación afín». El diccionario de un tomo es el
  mismo filtrado por tomo.
- **Comprobaciones** (`packages/libro/src/diccionario.ts`, desde las pruebas de los capítulos):
  - que cada capítulo escrito tenga al menos una entrada;
  - que cada entrada esté completa y sin fórmulas;
  - que el ancla exista en el capítulo;
  - que los campos sean los del índice;
  - que ningún término se repita en la obra.

## Consecuencias

- Escribir un capítulo incluye escribir sus entradas, en el mismo archivo y en el mismo commit.
- La nota es obligatoria. Lo que el diccionario aporta no es la equivalencia sino sus límites: «autoadjunto» y
  «hermítico» coinciden en dimensión finita y se separan en los operadores no acotados.
- El PDF puede armar el diccionario de cada tomo con los mismos datos.

## Alternativas descartadas

- **Un archivo central por tomo** (`diccionario/tomo-01.yaml`), como el índice. Separa los términos del texto que los
  define, y el autor tendría que acordarse de editar dos archivos, con una prueba que lo vigile.
- **Marcar los términos en el texto** con una directiva nueva. Agrega una directiva al conjunto cerrado, y la nota, que
  es lo valioso, no tiene lugar natural en medio de una frase.
