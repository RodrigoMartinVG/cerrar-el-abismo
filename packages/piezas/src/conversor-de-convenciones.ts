import {
  enConvencion,
  enMemoria,
  esfericas,
  metrica,
  transformacion,
  type Almacenamiento,
  type Mano,
  type TipoDeVector,
} from './convenciones.ts';

/**
 * PIEZA «conversor-de-convenciones» (especificación, 8.5). Se eligen la mano de los ejes, el tipo de vector y el orden
 * de almacenamiento, y se ve cómo cambian la matriz de una rotación seguida de una traslación y sus 16 números en
 * memoria. Para la física, la signatura de la métrica y la convención de las coordenadas esféricas.
 */
export function montar(raiz: HTMLElement): () => void {
  raiz.textContent = '';
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';

  const grupo = <T extends string>(nombre: string, opciones: [T, string][], inicial: T) => {
    const conjunto = document.createElement('fieldset');
    const leyenda = document.createElement('legend');
    leyenda.textContent = nombre;
    conjunto.append(leyenda);
    const id = `${nombre}-${Math.random().toString(36).slice(2, 8)}`;
    for (const [valor, texto] of opciones) {
      const etiqueta = document.createElement('label');
      const control = document.createElement('input');
      Object.assign(control, { type: 'radio', name: id, value: valor, checked: valor === inicial });
      etiqueta.append(control, ` ${texto}`);
      conjunto.append(etiqueta);
    }
    controles.append(conjunto);
    return () => (conjunto.querySelector<HTMLInputElement>('input:checked')?.value ?? inicial) as T;
  };
  const mano = grupo<Mano>(
    'Mano de los ejes',
    [
      ['derecha', 'derecha'],
      ['izquierda', 'izquierda'],
    ],
    'derecha',
  );
  const vector = grupo<TipoDeVector>(
    'Vectores',
    [
      ['columna', 'columna (y = Mx)'],
      ['fila', 'fila (y = xM)'],
    ],
    'columna',
  );
  const almacen = grupo<Almacenamiento>(
    'Almacenamiento',
    [
      ['columnas', 'por columnas'],
      ['filas', 'por filas'],
    ],
    'columnas',
  );
  const signatura = grupo<'-+++' | '+---'>(
    'Signatura',
    [
      ['-+++', '(−, +, +, +)'],
      ['+---', '(+, −, −, −)'],
    ],
    '-+++',
  );
  const esfera = grupo<'iso' | 'calculo'>(
    'Esféricas',
    [
      ['iso', 'θ polar (ISO)'],
      ['calculo', 'θ azimutal'],
    ],
    'iso',
  );

  const angulo = document.createElement('label');
  const deslizador = document.createElement('input');
  Object.assign(deslizador, { type: 'range', min: '0', max: '360', step: '15', value: '90' });
  const valorAngulo = document.createElement('span');
  valorAngulo.className = 'pieza-valor';
  angulo.append('Rotación alrededor de Y ', deslizador, ' ', valorAngulo);
  controles.append(angulo);

  const tabla = document.createElement('table');
  tabla.className = 'pieza-matriz';
  const memoria = document.createElement('output');
  memoria.className = 'pieza-lectura pieza-memoria';
  const fisica = document.createElement('output');
  fisica.className = 'pieza-lectura';
  raiz.append(controles, tabla, memoria, fisica);

  const formato = (x: number) => {
    const r = Math.round(x * 1000) / 1000 + 0;
    return Number.isInteger(r) ? String(r) : r.toFixed(3);
  };

  function dibujar() {
    const grados = Number(deslizador.value);
    valorAngulo.textContent = `${grados}° = ${(grados / 180).toFixed(3).replace(/\.?0+$/, '')}π rad`;
    const m = enConvencion(transformacion((grados * Math.PI) / 180, [1, 2, 3]), mano(), vector());
    tabla.replaceChildren(
      ...m.map((fila) => {
        const tr = document.createElement('tr');
        for (const x of fila) {
          const td = document.createElement('td');
          td.textContent = formato(x);
          tr.append(td);
        }
        return tr;
      }),
    );
    const numeros = enMemoria(m, almacen());
    const iguales =
      (vector() === 'columna') === (almacen() === 'columnas')
        ? 'Columnas con vectores columna y filas con vectores fila dan los mismos 16 números: por eso equivocarse en las dos convenciones a la vez no se nota.'
        : 'Esta combinación da la transpuesta de la otra en memoria: equivocarse en una sola convención sí se nota.';
    memoria.textContent = `En memoria: [${numeros.map(formato).join(', ')}]. ${iguales}`;
    const g = metrica(signatura());
    const e = esfericas(esfera());
    fisica.textContent = `Métrica: diag(${g.diagonal.join(', ')}), ${g.intervalo}. Esféricas: x = ${e.x}, y = ${e.y}, z = ${e.z}; ${e.nota}`;
  }

  controles.addEventListener('input', dibujar);
  dibujar();
  return () => controles.removeEventListener('input', dibujar);
}
