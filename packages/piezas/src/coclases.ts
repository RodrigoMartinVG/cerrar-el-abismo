import {
  coclaseDeCadaElemento,
  coclasesPorLaDerecha,
  coclasesPorLaIzquierda,
  grupoD4,
  grupoS3,
  nombreDeCoclase,
  subgrupoGenerado,
  subgruposDe,
  tablaDeCayley,
  tablaDelCociente,
  testigoDeQueNoEsNormal,
  type GrupoChico,
} from './grupos.ts';

/**
 * PIEZA «coclases» (I.7). La tabla de multiplicar de S₃ o de D₄, con un subgrupo H marcado. Cada elemento lleva el
 * color de su coclase por la izquierda, aH; debajo se listan las coclases por la izquierda y por la derecha, con esos
 * mismos colores, así que H es normal exactamente cuando cada coclase por la derecha sale de un solo color. Con las
 * filas y las columnas agrupadas por coclases, la tabla se parte en bloques: si H es normal, cada bloque es de un solo
 * color, y la tabla de los bloques es la del cociente G/H, que la pieza escribe aparte. El grupo inicial viene del
 * atributo `data-grupo` («S3» o «D4»), y el subgrupo, de `data-genera` (los nombres de sus generadores, separados por
 * comas), si el capítulo los da. Un clic en el nombre de un elemento marca el subgrupo que genera.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';
  const grupos: Record<string, GrupoChico> = { S3: grupoS3(), D4: grupoD4() };

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaG = document.createElement('label');
  const eleccionG = document.createElement('select');
  for (const [valor, texto] of [
    ['S3', 'S₃, las permutaciones de tres elementos'],
    ['D4', 'D₄, las simetrías del cuadrado'],
  ] as const) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    eleccionG.append(opcion);
  }
  eleccionG.value = raiz.dataset['grupo'] === 'D4' ? 'D4' : 'S3';
  etiquetaG.append('Grupo ', eleccionG);
  const etiquetaH = document.createElement('label');
  const eleccionH = document.createElement('select');
  etiquetaH.append('Subgrupo H ', eleccionH);
  const etiquetaOrden = document.createElement('label');
  const agrupar = document.createElement('input');
  agrupar.type = 'checkbox';
  agrupar.checked = true;
  etiquetaOrden.append(agrupar, ' agrupar la tabla por coclases');
  controles.append(etiquetaG, etiquetaH, etiquetaOrden);

  const contenedor = document.createElement('div');
  contenedor.className = 'pieza-tabla';
  contenedor.style.overflowX = 'auto';
  const listas = document.createElement('div');
  listas.className = 'pieza-lectura';
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  const cociente = document.createElement('div');
  cociente.className = 'pieza-tabla';
  raiz.append(controles, contenedor, listas, lectura, cociente);

  let G = grupos[eleccionG.value]!;
  let subgrupos = subgruposDe(G);
  let H = subgrupos[0]!;

  /** Un color por coclase, con transparencia para que se lea sobre el fondo claro y sobre el oscuro. */
  const color = (k: number, total: number) => `hsl(${Math.round((360 * k) / Math.max(total, 1)) + 25} 70% 50% / 0.28)`;
  const nombre = (i: number) => G.elementos[i]!.nombre;
  const conjunto = (C: readonly number[]) => `{${C.map(nombre).join(', ')}}`;

  function llenarSubgrupos() {
    eleccionH.replaceChildren(
      ...subgrupos.map((S, i) => {
        const opcion = document.createElement('option');
        opcion.value = String(i);
        opcion.textContent = `${conjunto(S)}, de orden ${S.length}`;
        return opcion;
      }),
    );
  }

  function elegirGrupo() {
    G = grupos[eleccionG.value]!;
    subgrupos = subgruposDe(G);
    llenarSubgrupos();
  }

  function marcar(S: readonly number[]) {
    const i = subgrupos.findIndex((T) => T.join(',') === S.join(','));
    H = subgrupos[i]!;
    eleccionH.value = String(i);
    dibujar();
  }

  function dibujar() {
    const tabla = tablaDeCayley(G);
    const izquierda = coclasesPorLaIzquierda(G, H);
    const derecha = coclasesPorLaDerecha(G, H);
    const lugar = coclaseDeCadaElemento(G, izquierda);
    const k = izquierda.length;
    const orden = agrupar.checked ? izquierda.flat() : [...G.elementos.keys()];
    const comienzaBloque = (posicion: number) =>
      agrupar.checked && posicion > 0 && posicion % H.length === 0 ? '2px solid currentColor' : '';

    const t = document.createElement('table');
    t.setAttribute('aria-label', alt || `La tabla de multiplicar de ${G.nombre}`);
    const cabeza = t.createTHead().insertRow();
    const esquina = document.createElement('th');
    esquina.textContent = '·';
    cabeza.append(esquina);
    const encabezado = (i: number) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.textContent = nombre(i);
      boton.title = `Marcar el subgrupo generado por ${nombre(i)}`;
      boton.style.cssText = 'all: unset; cursor: pointer; padding: 0 0.2rem;';
      boton.addEventListener('click', () => marcar(subgrupoGenerado(G, [i])));
      return boton;
    };
    orden.forEach((b, posicion) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.style.background = color(lugar[b]!, k);
      th.style.borderLeft = comienzaBloque(posicion);
      th.append(encabezado(b));
      cabeza.append(th);
    });
    const cuerpo = t.createTBody();
    orden.forEach((a, fila) => {
      const tr = cuerpo.insertRow();
      const th = document.createElement('th');
      th.scope = 'row';
      th.style.background = color(lugar[a]!, k);
      th.style.borderTop = comienzaBloque(fila);
      th.append(encabezado(a));
      tr.append(th);
      orden.forEach((b, posicion) => {
        const producto = tabla[a]![b]!;
        const celda = tr.insertCell();
        celda.textContent = nombre(producto);
        celda.style.background = color(lugar[producto]!, k);
        celda.style.borderLeft = comienzaBloque(posicion);
        celda.style.borderTop = comienzaBloque(fila);
        celda.title = `${nombre(a)} · ${nombre(b)} = ${nombre(producto)}, en la coclase ${nombreDeCoclase(G, izquierda[lugar[producto]!]!, 'izquierda')}`;
      });
    });
    contenedor.replaceChildren(t);

    const lista = (titulo: string, clases: number[][], lado: 'izquierda' | 'derecha') => {
      const p = document.createElement('p');
      p.append(`${titulo}: `);
      clases.forEach((C, j) => {
        if (j > 0) p.append('; ');
        p.append(`${nombreDeCoclase(G, C, lado)} = {`);
        C.forEach((x, m) => {
          if (m > 0) p.append(', ');
          const marca = document.createElement('span');
          marca.textContent = nombre(x);
          marca.style.background = color(lugar[x]!, k);
          marca.style.padding = '0 0.15rem';
          p.append(marca);
        });
        p.append('}');
      });
      return p;
    };
    listas.replaceChildren(
      lista('Coclases por la izquierda', izquierda, 'izquierda'),
      lista('Coclases por la derecha', derecha, 'derecha'),
    );

    const testigo = testigoDeQueNoEsNormal(G, H);
    const indice = `H tiene ${H.length} ${H.length === 1 ? 'elemento' : 'elementos'} y ${k} ${k === 1 ? 'coclase' : 'coclases'} de cada lado.`;
    const cuadro = tablaDelCociente(G, H);
    if (testigo === undefined && cuadro) {
      lectura.textContent = `${indice} Las coclases por la izquierda y por la derecha son las mismas: H es normal. Cada bloque de la tabla agrupada es de un solo color, así que el producto de dos coclases es una coclase, y los bloques forman la tabla del cociente G/H, de orden ${k}.`;
      const tc = document.createElement('table');
      tc.setAttribute('aria-label', 'La tabla del cociente G/H');
      const filaCabeza = tc.createTHead().insertRow();
      const vacio = document.createElement('th');
      vacio.textContent = 'G/H';
      filaCabeza.append(vacio);
      const nombres = izquierda.map((C) => nombreDeCoclase(G, C, 'izquierda'));
      nombres.forEach((n, j) => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = n;
        th.style.background = color(j, k);
        filaCabeza.append(th);
      });
      const cuerpoCociente = tc.createTBody();
      cuadro.forEach((filaDelCociente, i) => {
        const tr = cuerpoCociente.insertRow();
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = nombres[i]!;
        th.style.background = color(i, k);
        tr.append(th);
        filaDelCociente.forEach((j) => {
          const celda = tr.insertCell();
          celda.textContent = nombres[j]!;
          celda.style.background = color(j, k);
        });
      });
      cociente.replaceChildren(tc);
    } else {
      const g = testigo ?? 0;
      const izquierdaDeG = H.map((h) => nombre(tabla[g]![h]!));
      const derechaDeG = H.map((h) => nombre(tabla[h]![g]!));
      lectura.textContent = `${indice} Las coclases de los dos lados no son las mismas: H no es normal. Por ejemplo, ${nombre(g)}H = {${izquierdaDeG.join(', ')}}, pero H${nombre(g)} = {${derechaDeG.join(', ')}}. En la tabla agrupada, algún bloque mezcla colores: el producto de dos coclases no es una coclase, y no hay cociente.`;
      cociente.replaceChildren();
    }
  }

  const alCambiarGrupo = () => {
    elegirGrupo();
    marcar(subgrupos[0]!);
  };
  const alCambiarSubgrupo = () => marcar(subgrupos[Number(eleccionH.value)]!);
  eleccionG.addEventListener('change', alCambiarGrupo);
  eleccionH.addEventListener('change', alCambiarSubgrupo);
  agrupar.addEventListener('change', dibujar);

  elegirGrupo();
  const generadores = (raiz.dataset['genera'] ?? '')
    .split(',')
    .map((n) => G.elementos.findIndex((x) => x.nombre === n.trim()))
    .filter((i) => i >= 0);
  marcar(subgrupoGenerado(G, generadores));
  return () => {
    eleccionG.removeEventListener('change', alCambiarGrupo);
    eleccionH.removeEventListener('change', alCambiarSubgrupo);
    agrupar.removeEventListener('change', dibujar);
  };
}
