import {
  bitsDe,
  escribirByte,
  inversoDeByte,
  leerByte,
  multiplicarBytes,
  POLINOMIOS_DE_REDUCCION,
  polinomioDeBits,
  potenciaDeX,
  type NombreDePolinomio,
} from './cuerpos-finitos.ts';

/**
 * PIEZA «multiplicacion-de-bytes» (I.8). Dos bytes, escritos en hexadecimal, y su producto en GF(2⁸) hecho bit a bit:
 * una tabla con una columna por cada potencia de x, de x¹⁴ a x⁰, muestra las copias de a corridas, una por cada bit
 * de b que vale 1, su suma sin acarreo, y cada paso de la reducción módulo el polinomio elegido, hasta que el
 * resultado cabe en un byte. El polinomio puede ser el de AES, el de los códigos QR o x⁸ + 1, que es reducible: con
 * él aparecen productos nulos de bytes no nulos. Los valores iniciales vienen de `data-a`, `data-b` y
 * `data-polinomio` (`aes`, `qr` o `reducible`).
 */
const ANCHO = 15;

const NOMBRES: Record<NombreDePolinomio, string> = {
  aes: 'AES: x⁸ + x⁴ + x³ + x + 1',
  qr: 'QR: x⁸ + x⁴ + x³ + x² + 1',
  reducible: 'x⁸ + 1, reducible',
};

export function montar(raiz: HTMLElement): () => void {
  raiz.textContent = '';
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';

  const campo = (nombre: string, inicial: string) => {
    const etiqueta = document.createElement('label');
    const control = document.createElement('input');
    Object.assign(control, { type: 'text', value: inicial, size: 5, spellcheck: false, autocomplete: 'off' });
    control.setAttribute('inputmode', 'text');
    etiqueta.append(`${nombre} `, control);
    controles.append(etiqueta);
    return control;
  };
  const a = campo('Byte a', `0x${raiz.dataset['a'] ?? '57'}`);
  const b = campo('Byte b', `0x${raiz.dataset['b'] ?? '83'}`);

  const etiquetaPolinomio = document.createElement('label');
  const polinomio = document.createElement('select');
  for (const [valor, texto] of Object.entries(NOMBRES)) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    polinomio.append(opcion);
  }
  const inicial = raiz.dataset['polinomio'] ?? 'aes';
  polinomio.value = inicial in NOMBRES ? inicial : 'aes';
  etiquetaPolinomio.append('Polinomio ', polinomio);
  controles.append(etiquetaPolinomio);

  const contenedor = document.createElement('div');
  contenedor.className = 'pieza-tabla pieza-bytes';
  // La tabla tiene dieciséis columnas: en una pantalla angosta se desplaza ella, no la página.
  contenedor.style.overflowX = 'auto';
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(controles, contenedor, lectura);

  /** Una fila de la tabla: su rótulo y un bit por columna; los unos se destacan, y las columnas de x⁸ en adelante, también. */
  function fila(cuerpo: HTMLTableSectionElement, rotulo: string, valor: number, clase?: string) {
    const tr = cuerpo.insertRow();
    if (clase) tr.className = clase;
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = rotulo;
    tr.append(th);
    const bits = bitsDe(valor, ANCHO);
    for (let i = 0; i < ANCHO; i++) {
      const celda = tr.insertCell();
      celda.textContent = bits[i]!;
      celda.className = bits[i] === '1' ? 'verdadero' : 'falso';
      if (ANCHO - 1 - i >= 8) celda.classList.add('alto');
    }
  }

  function dibujar() {
    const x = leerByte(a.value);
    const y = leerByte(b.value);
    contenedor.textContent = '';
    if (x === null || y === null) {
      lectura.textContent = 'Escribir cada byte en hexadecimal, de 00 a FF, como 57 o 0x83.';
      lectura.classList.add('pieza-error');
      return;
    }
    lectura.classList.remove('pieza-error');
    const nombre = polinomio.value as NombreDePolinomio;
    const m = POLINOMIOS_DE_REDUCCION[nombre];
    const r = multiplicarBytes(x, y, m);

    const tabla = document.createElement('table');
    const cabeza = tabla.createTHead().insertRow();
    const esquina = document.createElement('td');
    cabeza.append(esquina);
    for (let k = ANCHO - 1; k >= 0; k--) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = potenciaDeX(k);
      if (k >= 8) th.className = 'alto';
      cabeza.append(th);
    }
    const datos = tabla.createTBody();
    fila(datos, `a = ${escribirByte(x)}`, x);
    fila(datos, `b = ${escribirByte(y)}`, y, 'separa');
    for (const copia of r.copias) fila(datos, `a · ${potenciaDeX(copia.bit)}`, copia.valor);
    const resultado = `a · b = ${escribirByte(r.resultado)}`;
    // Sin pasos de reducción, la suma ya es el resultado; con pasos, el último deja el resultado.
    fila(datos, r.pasos.length === 0 ? `suma: ${resultado}` : 'suma', r.sinAcarreo, r.pasos.length === 0 ? 'resultado' : 'total');
    r.pasos.forEach((paso, i) => {
      const corrimiento = paso.grado - 8;
      fila(datos, corrimiento === 0 ? '+ m' : `+ m · ${potenciaDeX(corrimiento)}`, paso.sumando);
      const ultimo = i === r.pasos.length - 1;
      fila(datos, ultimo ? resultado : '=', paso.despues, ultimo ? 'resultado' : 'total');
    });
    contenedor.append(tabla);

    const copias = r.copias.length;
    const pasos = r.pasos.length;
    const partes = [
      `${escribirByte(x)} · ${escribirByte(y)} = ${escribirByte(r.resultado)} módulo ${polinomioDeBits(m)}.`,
      copias === 0
        ? 'Como b es 0, no hay copias que sumar.'
        : `${copias === 1 ? 'Una copia corrida de a, por el único bit de b en 1' : `${copias} copias corridas de a, una por cada bit de b en 1`}; su suma sin acarreo es ${polinomioDeBits(r.sinAcarreo)}${
            pasos === 0
              ? ', que ya cabe en un byte.'
              : `, y ${pasos === 1 ? 'un paso' : `${pasos} pasos`} de reducción la ${pasos === 1 ? 'lleva' : 'llevan'} a ${polinomioDeBits(r.resultado)}.`
          }`,
    ];
    if (x !== 0 && y !== 0 && r.resultado === 0)
      partes.push('El producto de dos bytes no nulos dio 0: con un polinomio reducible, el cociente tiene divisores de cero.');
    if (x !== 0) {
      const inverso = inversoDeByte(x, m);
      partes.push(
        inverso === null
          ? `Con este polinomio, ${escribirByte(x)} no tiene inverso.`
          : `Con este polinomio, el inverso de ${escribirByte(x)} es ${escribirByte(inverso)}.`,
      );
    }
    lectura.textContent = partes.join(' ');
  }

  for (const control of [a, b]) control.addEventListener('input', dibujar);
  polinomio.addEventListener('change', dibujar);
  dibujar();
  return () => {
    for (const control of [a, b]) control.removeEventListener('input', dibujar);
    polinomio.removeEventListener('change', dibujar);
  };
}
