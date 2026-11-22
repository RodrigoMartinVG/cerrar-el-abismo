import { PIEZAS, type NombreDePieza } from '@cerrar-el-abismo/piezas';

/**
 * Los elementos que la capa de libro deja en el HTML de un capítulo (packages/libro):
 *
 * - `<celda-python>`: el código como texto; se vuelve un editor (CodeMirror, src/scripts/editor.ts), con «Ejecutar»,
 *   «Restaurar» y, mientras corre, «Detener» (sección 11.2). Todas las celdas de una página comparten un mismo
 *   intérprete, como un cuaderno, aunque cada una se puede ejecutar sola (decisión 0003).
 * - `<figura-interactiva data-pieza="…">`: el texto alternativo como contenido; se reemplaza por la pieza.
 *
 * Sin JavaScript, los dos quedan legibles: el código y la descripción de la figura.
 */

let trabajador: Worker | undefined;
let siguiente = 0;
const pendientes = new Map<number, (r: { salida: string; error?: string }) => void>();

let primeraVez = true;

/**
 * Un bucle que no termina deja el intérprete ocupado para siempre, y Pyodide no se puede interrumpir sin aislar la
 * página entre orígenes, algo que GitHub Pages no permite configurar. «Detener» termina el trabajador; el próximo
 * «Ejecutar» crea uno nuevo, y lo que habían definido las otras celdas se pierde.
 */
function detenerPython(): void {
  abandonar('Ejecución detenida. Python se reinició, así que lo que habían definido otras celdas ya no existe.');
}

/** Responde a todas las celdas que esperan con el mismo error, y deja el intérprete listo para crearse de nuevo. */
function abandonar(error: string): void {
  for (const responder of pendientes.values()) responder({ salida: '', error });
  pendientes.clear();
  trabajador?.terminate();
  trabajador = undefined;
  primeraVez = true;
}

function ejecutarPython(codigo: string): Promise<{ salida: string; error?: string }> {
  if (!trabajador) {
    trabajador = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' });
    trabajador.onmessage = (e: MessageEvent<{ id: number; salida: string; error?: string }>) => {
      pendientes.get(e.data.id)?.(e.data);
      pendientes.delete(e.data.id);
    };
    trabajador.onerror = () => abandonar('No se pudo iniciar Python en esta página. Recargarla suele resolverlo.');
  }
  const id = siguiente++;
  return new Promise((resolver) => {
    pendientes.set(id, resolver);
    trabajador!.postMessage({ id, codigo });
  });
}

class CeldaPython extends HTMLElement {
  async connectedCallback() {
    if (this.dataset['montada']) return;
    this.dataset['montada'] = 'si';
    const referencia = (this.textContent ?? '').replace(/\n+$/, '');

    // Mientras llega el editor, el código sigue a la vista como texto.
    const { crearEditor } = await import('./editor.ts');
    this.textContent = '';
    const marco = document.createElement('div');
    marco.className = 'celda-editor not-content';

    const barra = document.createElement('div');
    barra.className = 'celda-barra not-content';
    const ejecutar = boton('Ejecutar');
    ejecutar.title = 'Ctrl+Enter o ⌘+Enter desde el editor';
    const restaurar = boton('Restaurar');
    const detener = boton('Detener');
    detener.hidden = true;
    detener.addEventListener('click', detenerPython);
    barra.append(ejecutar, restaurar, detener);

    const salida = document.createElement('pre');
    salida.className = 'celda-salida';
    salida.setAttribute('aria-live', 'polite');
    salida.hidden = true;

    const correr = async () => {
      if (ejecutar.disabled) return;
      ejecutar.disabled = true;
      salida.hidden = false;
      salida.classList.remove('celda-error');
      salida.textContent = primeraVez ? 'Cargando Python en el navegador (solo la primera vez)…' : 'Ejecutando…';
      primeraVez = false;
      detener.hidden = false;
      const r = await ejecutarPython(editor.valor());
      salida.textContent = (r.salida + (r.error ? `\n${r.error}` : '')).trim() || '(sin salida)';
      salida.classList.toggle('celda-error', Boolean(r.error));
      ejecutar.disabled = false;
      detener.hidden = true;
    };

    this.append(marco, barra, salida);
    const editor = crearEditor(marco, referencia, 'Código Python de la celda, editable', () => void correr());
    ejecutar.addEventListener('click', () => void correr());
    restaurar.addEventListener('click', () => {
      editor.reemplazar(referencia);
      salida.hidden = true;
    });
  }
}

class FiguraInteractiva extends HTMLElement {
  private desmontar: (() => void) | undefined;

  async connectedCallback() {
    const nombre = this.dataset['pieza'] as NombreDePieza | undefined;
    const cargar = nombre ? PIEZAS[nombre] : undefined;
    if (!cargar || this.desmontar) return;
    const { montar } = await cargar();
    this.desmontar = montar(this);
  }

  disconnectedCallback() {
    this.desmontar?.();
    this.desmontar = undefined;
  }
}

function boton(texto: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  return b;
}

if (!customElements.get('celda-python')) customElements.define('celda-python', CeldaPython);
if (!customElements.get('figura-interactiva')) customElements.define('figura-interactiva', FiguraInteractiva);
