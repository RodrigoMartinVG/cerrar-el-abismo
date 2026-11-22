import {
  bitsSimple,
  cancelacion,
  errorRelativo,
  ordenDeLaSuma,
  sumaRepetida,
  type Racional,
  type TresCuentas,
} from './flotante.ts';

/**
 * PIEZA «comparador-flotante» (I.10; especificación, 8.5). La misma cuenta, hecha con racionales exactos, en doble
 * precisión y en precisión simple, lado a lado, con el error relativo de cada una y los 32 bits del resultado simple.
 * Tres experimentos: sumar un decimal muchas veces, el orden de una suma, y (1 + x) − 1.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';

  const etiquetaExperimento = document.createElement('label');
  const experimento = document.createElement('select');
  for (const [valor, texto] of [
    ['suma', 'sumar un decimal n veces'],
    ['orden', 'el orden de una suma: 1 y m veces 10⁻⁸'],
    ['cancelacion', '(1 + x) − 1'],
  ] as const) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    experimento.append(opcion);
  }
  experimento.value = raiz.dataset['experimento'] ?? 'suma';
  etiquetaExperimento.append('Experimento ', experimento);

  const etiquetaDecimal = document.createElement('label');
  const decimal = document.createElement('input');
  Object.assign(decimal, { type: 'text', value: raiz.dataset['decimal'] ?? '0.1', size: 8, spellcheck: false });
  etiquetaDecimal.append('Decimal ', decimal);

  const etiquetaN = document.createElement('label');
  const n = document.createElement('input');
  Object.assign(n, { type: 'range', min: '1', max: '1000', step: '1', value: raiz.dataset['n'] ?? '10' });
  const valorN = document.createElement('span');
  valorN.className = 'pieza-valor';
  etiquetaN.append('Veces ', n, ' ', valorN);

  const etiquetaOrden = document.createElement('label');
  const orden = document.createElement('select');
  for (const [valor, texto] of [
    ['grande-primero', 'el 1 primero'],
    ['chicos-primero', 'el 1 al final'],
  ] as const) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    orden.append(opcion);
  }
  etiquetaOrden.append('Orden ', orden);

  controles.append(etiquetaExperimento, etiquetaDecimal, etiquetaN, etiquetaOrden);
  const tabla = document.createElement('table');
  tabla.className = 'pieza-tabla pieza-comparador';
  const bits = document.createElement('p');
  bits.className = 'pieza-bits';
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(controles, tabla, bits, lectura);

  const fila = (nombre: string, valor: string, error: string) => {
    const tr = document.createElement('tr');
    for (const [i, t] of [nombre, valor, error].entries()) {
      const celda = document.createElement(i === 0 ? 'th' : 'td');
      celda.textContent = t;
      tr.append(celda);
    }
    return tr;
  };
  const errorComoTexto = (e: number) => (e === 0 ? '0' : e.toExponential(2).replace('.', ',').replace('e', ' · 10^'));
  /** Los valores de la máquina, con coma decimal como el resto de la tabla y del texto. */
  const coma = (x: number) => String(x).replace('.', ',');
  const comoDecimal = (r: Racional) => r.decimal(22);

  function calcular(): { cuentas: TresCuentas; descripcion: string } | undefined {
    const veces = Number(n.value);
    valorN.textContent = String(veces);
    const tipo = experimento.value;
    etiquetaDecimal.hidden = tipo === 'orden';
    etiquetaOrden.hidden = tipo !== 'orden';
    etiquetaN.hidden = tipo === 'cancelacion';
    try {
      if (tipo === 'suma')
        return { cuentas: sumaRepetida(decimal.value, veces), descripcion: `${decimal.value} sumado ${veces} veces` };
      if (tipo === 'orden')
        return {
          cuentas: ordenDeLaSuma(veces * 10, orden.value as 'grande-primero' | 'chicos-primero'),
          descripcion: `1 y ${veces * 10} veces 10⁻⁸, ${orden.value === 'grande-primero' ? 'con el 1 primero' : 'con el 1 al final'}`,
        };
      return { cuentas: cancelacion(decimal.value), descripcion: `(1 + ${decimal.value}) − 1` };
    } catch {
      return undefined;
    }
  }

  function dibujar() {
    const r = calcular();
    if (!r) {
      tabla.replaceChildren();
      bits.textContent = '';
      lectura.textContent = 'Escribir un decimal con punto, como 0.1 o 1e-8.';
      lectura.classList.add('pieza-error');
      return;
    }
    lectura.classList.remove('pieza-error');
    const { exacto, doble, simple } = r.cuentas;
    const encabezado = document.createElement('tr');
    for (const t of ['', 'Valor', 'Error relativo']) {
      const th = document.createElement('th');
      th.textContent = t;
      encabezado.append(th);
    }
    const eDoble = errorRelativo(doble, exacto);
    const eSimple = errorRelativo(simple, exacto);
    tabla.replaceChildren(
      encabezado,
      fila('Exacto', comoDecimal(exacto), '0'),
      fila('Doble (64 bits)', coma(doble), errorComoTexto(eDoble)),
      fila('Simple (32 bits)', coma(simple), errorComoTexto(eSimple)),
    );
    const b = bitsSimple(simple);
    bits.textContent = `Simple, en bits: ${b.signo} ${b.exponente} ${b.fraccion} (signo, exponente, fracción).`;
    lectura.textContent = `${r.descripcion}. El error relativo es de ${errorComoTexto(eDoble)} en doble precisión y de ${errorComoTexto(eSimple)} en simple; cada redondeo aporta a lo sumo 2^−53 ≈ 1,1 · 10^−16 o 2^−24 ≈ 6 · 10^−8.`;
    raiz.setAttribute('aria-label', `${alt} ${lectura.textContent}`);
  }

  controles.addEventListener('input', dibujar);
  controles.addEventListener('change', dibujar);
  dibujar();
  return () => {
    controles.removeEventListener('input', dibujar);
    controles.removeEventListener('change', dibujar);
  };
}
