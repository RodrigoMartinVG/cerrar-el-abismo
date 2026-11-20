import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

/**
 * EL EDITOR DE LAS CELDAS DE PYTHON, con CodeMirror 6. Se carga aparte (import dinámico desde elementos.ts), solo en
 * las páginas que tienen celdas.
 *
 * Los colores no se fijan aquí: cada clase de símbolo apunta a una variable de src/styles/tema.css (--obra-codigo-*),
 * que cambia con el modo claro u oscuro y repite los de los bloques de código estáticos (Vitesse), para que una celda
 * editable y un bloque de solo lectura se vean iguales.
 */

const color = (nombre: string) => `var(--obra-codigo-${nombre})`;

const resaltado = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword], color: color('clave') },
  { tag: [t.operator, t.operatorKeyword, t.compareOperator, t.arithmeticOperator, t.logicOperator], color: color('operador') },
  { tag: [t.number, t.bool, t.null, t.atom], color: color('numero') },
  { tag: [t.string, t.special(t.string), t.escape], color: color('cadena') },
  { tag: [t.comment, t.lineComment, t.blockComment], color: color('comentario'), fontStyle: 'italic' },
  { tag: [t.function(t.definition(t.variableName)), t.function(t.variableName)], color: color('funcion') },
  { tag: [t.standard(t.variableName), t.self], color: color('integrado') },
  { tag: [t.className, t.definition(t.className), t.typeName], color: color('tipo') },
  { tag: [t.punctuation, t.paren, t.squareBracket, t.brace, t.separator], color: color('puntuacion') },
]);

const apariencia = EditorView.theme({
  '&': {
    color: color('texto'),
    backgroundColor: color('fondo'),
    border: '1px solid var(--sl-color-hairline)',
    borderRadius: '0.5rem',
    fontSize: 'var(--obra-texto-secundario)',
  },
  '&.cm-focused': { outline: '2px solid var(--sl-color-accent)', outlineOffset: '1px' },
  '.cm-scroller': { fontFamily: 'var(--sl-font-mono)', lineHeight: '1.6' },
  '.cm-content': { padding: '0.75rem 0', caretColor: 'var(--sl-color-accent)' },
  '.cm-line': { padding: '0 1rem 0 0.5rem' },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: color('puntuacion'),
    border: 'none',
    borderInlineEnd: '1px solid var(--sl-color-hairline)',
  },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 0.6rem 0 0.75rem', minWidth: '2.2rem' },
  // La línea del cursor se marca solo mientras se escribe; en reposo, la celda se ve como un bloque de código.
  '&.cm-focused .cm-activeLine': { backgroundColor: 'var(--obra-codigo-linea)' },
  '.cm-activeLine': { backgroundColor: 'transparent' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent' },
  '&.cm-focused .cm-activeLineGutter': { color: color('texto') },
  '.cm-cursor': { borderInlineStartColor: 'var(--sl-color-accent)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'var(--sl-color-accent-low)',
  },
  '.cm-matchingBracket': { backgroundColor: 'var(--sl-color-accent-low)', outline: 'none' },
});

export interface Editor {
  /** El código tal como está ahora. */
  valor(): string;
  /** Reemplaza todo el código (para «Restaurar»). */
  reemplazar(codigo: string): void;
}

/**
 * Monta un editor en `padre` con el código dado. `alEjecutar` corre con Ctrl+Enter o ⌘+Enter. Tab indenta; para
 * salir del editor con el teclado, Escape y después Tab (la convención de CodeMirror).
 */
export function crearEditor(padre: HTMLElement, codigo: string, etiqueta: string, alEjecutar: () => void): Editor {
  const vista = new EditorView({
    parent: padre,
    state: EditorState.create({
      doc: codigo,
      extensions: [
        lineNumbers(),
        history(),
        highlightActiveLine(),
        bracketMatching(),
        indentOnInput(),
        indentUnit.of('    '),
        EditorState.tabSize.of(4),
        python(),
        syntaxHighlighting(resaltado),
        apariencia,
        EditorView.contentAttributes.of({
          'aria-label': etiqueta,
          spellcheck: 'false',
          autocorrect: 'off',
          autocapitalize: 'off',
        }),
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              alEjecutar();
              return true;
            },
          },
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
      ],
    }),
  });
  return {
    valor: () => vista.state.doc.toString(),
    reemplazar: (nuevo) => vista.dispatch({ changes: { from: 0, to: vista.state.doc.length, insert: nuevo } }),
  };
}
