import { PIEZAS, type NombreDePieza } from '@cerrar-el-abismo/piezas';

/**
 * Los elementos que la capa de libro deja en el HTML de un capítulo (packages/libro):
 *
 * - `<celda-python>`: el código como texto; se vuelve editable, con «Ejecutar» y «Restaurar» (sección 11.2).
 *   Todas las celdas de una página comparten un mismo intérprete, como un cuaderno.
 * - `<figura-interactiva data-pieza="…">`: el texto alternativo como contenido; se reemplaza por la pieza.
 *
 * Sin JavaScript, los dos quedan legibles: el código y la descripción de la figura.
 */

let trabajador: Worker | undefined;
let siguiente = 0;
const pendientes = new Map<number, (r: { salida: string; error?: string }) => void>();

function ejecutarPython(codigo: string): Promise<{ salida: string; error?: string }> {
  if (!trabajador) {
    trabajador = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' });
    trabajador.onmessage = (e: MessageEvent<{ id: number; salida: string; error?: string }>) => {
      pendientes.get(e.data.id)?.(e.data);
      pendientes.delete(e.data.id);
    };
  }
  const id = siguiente++;
  return new Promise((resolver) => {
    pendientes.set(id, resolver);
    trabajador!.postMessage({ id, codigo });
  });
}

let primeraVez = true;

class CeldaPython extends HTMLElement {
  connectedCallback() {
    if (this.dataset['montada']) return;
    this.dataset['montada'] = 'si';
    const referencia = (this.textContent ?? '').replace(/\n+$/, '');
    this.textContent = '';

    const editor = document.createElement('textarea');
    editor.value = referencia;
    editor.spellcheck = false;
    editor.rows = Math.max(3, referencia.split('\n').length);
    editor.setAttribute('aria-label', 'Código Python de la celda, editable');

    const barra = document.createElement('div');
    barra.className = 'celda-barra not-content';
    const ejecutar = boton('Ejecutar');
    const restaurar = boton('Restaurar');
    barra.append(ejecutar, restaurar);

    const salida = document.createElement('pre');
    salida.className = 'celda-salida';
    salida.setAttribute('aria-live', 'polite');
    salida.hidden = true;

    ejecutar.addEventListener('click', async () => {
      ejecutar.disabled = true;
      salida.hidden = false;
      salida.classList.remove('celda-error');
      salida.textContent = primeraVez ? 'Cargando Python en el navegador (solo la primera vez)…' : 'Ejecutando…';
      primeraVez = false;
      const r = await ejecutarPython(editor.value);
      salida.textContent = (r.salida + (r.error ? `\n${r.error}` : '')).trim() || '(sin salida)';
      salida.classList.toggle('celda-error', Boolean(r.error));
      ejecutar.disabled = false;
    });
    restaurar.addEventListener('click', () => {
      editor.value = referencia;
      salida.hidden = true;
    });

    this.append(editor, barra, salida);
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
