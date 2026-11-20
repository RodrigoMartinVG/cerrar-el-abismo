import { leerFormula, tablaDeVerdad } from './logica.ts';

/**
 * PIEZA «tabla-de-verdad» (I.1). Un campo para escribir una fórmula proposicional, botones para los conectivos, la
 * tabla de verdad completa y el veredicto: tautología, contradicción o contingencia. La fórmula inicial viene del
 * atributo `data-formula`, si el capítulo lo da.
 */
export function montar(raiz: HTMLElement): () => void {
  const inicial = raiz.dataset['formula'] ?? '¬(p ∧ q) ↔ (¬p ∨ ¬q)';
  raiz.textContent = '';

  const etiqueta = document.createElement('label');
  etiqueta.className = 'pieza-campo not-content';
  etiqueta.textContent = 'Fórmula ';
  const campo = document.createElement('input');
  campo.type = 'text';
  campo.value = inicial;
  campo.spellcheck = false;
  campo.autocomplete = 'off';
  etiqueta.append(campo);

  const botones = document.createElement('div');
  botones.className = 'pieza-controles pieza-botones not-content';
  for (const simbolo of ['¬', '∧', '∨', '→', '↔', '(', ')']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = simbolo;
    b.setAttribute('aria-label', `Insertar ${simbolo}`);
    b.addEventListener('click', () => {
      const inicio = campo.selectionStart ?? campo.value.length;
      const fin = campo.selectionEnd ?? inicio;
      campo.setRangeText(simbolo, inicio, fin, 'end');
      campo.focus();
      actualizar();
    });
    botones.append(b);
  }

  const veredicto = document.createElement('output');
  veredicto.className = 'pieza-lectura';
  veredicto.setAttribute('aria-live', 'polite');
  const contenedor = document.createElement('div');
  contenedor.className = 'pieza-tabla';
  raiz.append(etiqueta, botones, veredicto, contenedor);

  function actualizar() {
    contenedor.textContent = '';
    try {
      const tabla = tablaDeVerdad(leerFormula(campo.value));
      const t = document.createElement('table');
      const cabeza = t.createTHead().insertRow();
      for (const v of [...tabla.variables, campo.value.trim()]) {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = v;
        cabeza.append(th);
      }
      const cuerpo = t.createTBody();
      for (const fila of tabla.filas) {
        const tr = cuerpo.insertRow();
        for (const v of tabla.variables) tr.insertCell().textContent = fila.valuacion[v] ? 'V' : 'F';
        const celda = tr.insertCell();
        celda.textContent = fila.valor ? 'V' : 'F';
        celda.className = fila.valor ? 'verdadero' : 'falso';
      }
      contenedor.append(t);
      const n = tabla.filas.length;
      veredicto.textContent =
        tabla.clase === 'tautología'
          ? `Tautología: verdadera en las ${n} filas.`
          : tabla.clase === 'contradicción'
            ? `Contradicción: falsa en las ${n} filas.`
            : `Contingencia: verdadera en ${tabla.filas.filter((x) => x.valor).length} de ${n} filas.`;
      veredicto.classList.remove('pieza-error');
    } catch (error) {
      veredicto.textContent = error instanceof Error ? error.message : String(error);
      veredicto.classList.add('pieza-error');
    }
  }

  campo.addEventListener('input', actualizar);
  actualizar();
  return () => campo.removeEventListener('input', actualizar);
}
