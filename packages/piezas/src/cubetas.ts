import { leerClaves, repartir, type FuncionDeDispersion } from './dispersion.ts';

/**
 * PIEZA «cubetas» (I.2). Un campo con claves, un deslizador para la cantidad m de cubetas y la elección de la función
 * de dispersión. Cada cubeta muestra sus claves, que son una fibra de la función; las que tienen más de una se marcan.
 * Debajo se lee lo que garantiza el principio del palomar y lo que pasó de verdad. Las claves iniciales vienen del
 * atributo `data-claves`, si el capítulo lo da.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  const inicial = raiz.dataset['claves'] ?? 'ana, luis, eva, juan, sol, amor, roma, mora, ramo, pedro';
  raiz.textContent = '';

  const etiquetaClaves = document.createElement('label');
  etiquetaClaves.className = 'pieza-campo not-content';
  etiquetaClaves.textContent = 'Claves ';
  const campo = document.createElement('input');
  Object.assign(campo, { type: 'text', value: inicial, spellcheck: false, autocomplete: 'off' });
  etiquetaClaves.append(campo);

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaM = document.createElement('label');
  const deslizador = document.createElement('input');
  Object.assign(deslizador, { type: 'range', min: '1', max: '12', step: '1', value: raiz.dataset['m'] ?? '8' });
  const valor = document.createElement('span');
  valor.className = 'pieza-valor';
  etiquetaM.append('Cubetas m ', deslizador, ' ', valor);
  const etiquetaF = document.createElement('label');
  const eleccion = document.createElement('select');
  for (const [v, texto] of [
    ['suma', 'suma de los códigos'],
    ['polinomial', 'polinomial, como String.hashCode de Java'],
  ] as const) {
    const opcion = document.createElement('option');
    opcion.value = v;
    opcion.textContent = texto;
    eleccion.append(opcion);
  }
  eleccion.value = raiz.dataset['funcion'] === 'polinomial' ? 'polinomial' : 'suma';
  etiquetaF.append('Función ', eleccion);
  controles.append(etiquetaM, etiquetaF);

  const lista = document.createElement('ol');
  lista.className = 'pieza-cubetas';
  lista.start = 0;
  lista.setAttribute('aria-label', alt || 'Las cubetas y sus claves');
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(etiquetaClaves, controles, lista, lectura);

  function dibujar() {
    const claves = leerClaves(campo.value);
    const m = Number(deslizador.value);
    valor.textContent = String(m);
    const r = repartir(claves, m, eleccion.value as FuncionDeDispersion);
    lista.replaceChildren(
      ...r.cubetas.map((contenido, i) => {
        const li = document.createElement('li');
        if (contenido.length > 1) li.classList.add('choque');
        const numero = document.createElement('span');
        numero.className = 'cubeta-numero';
        numero.textContent = String(i);
        const claves = document.createElement('span');
        claves.className = 'cubeta-claves';
        claves.textContent = contenido.length === 0 ? '—' : contenido.join(', ');
        li.setAttribute('aria-label', `Cubeta ${i}: ${contenido.length === 0 ? 'vacía' : contenido.join(', ')}`);
        li.append(numero, claves);
        return li;
      }),
    );
    const n = claves.length;
    const garantia =
      n > m
        ? `Hay más claves que cubetas, así que alguna recibe por lo menos ${r.garantia}: es el principio del palomar.`
        : 'No hay más claves que cubetas: el palomar no garantiza ningún choque.';
    const hecho = r.inyectiva
      ? 'Aquí la función es inyectiva sobre estas claves: no hay choques.'
      : `Aquí la cubeta más llena tiene ${r.maxima}.`;
    lectura.textContent = `${n} ${n === 1 ? 'clave' : 'claves'} en ${m} ${m === 1 ? 'cubeta' : 'cubetas'}. ${garantia} ${hecho}`;
  }

  campo.addEventListener('input', dibujar);
  deslizador.addEventListener('input', dibujar);
  eleccion.addEventListener('change', dibujar);
  dibujar();
  return () => {
    campo.removeEventListener('input', dibujar);
    deslizador.removeEventListener('input', dibujar);
    eleccion.removeEventListener('change', dibujar);
  };
}
