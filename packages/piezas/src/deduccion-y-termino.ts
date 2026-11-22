import {
  CATALOGO,
  deduccion,
  escribirFormula,
  escribirTermino,
  escribirTipo,
  fragmentar,
  nombreDeRegla,
  reducir,
  subtermino,
  type Fragmento,
  type Linea,
  type Reduccion,
} from './curry-howard.ts';

/**
 * PIEZA «deduccion-y-termino» (I.15). Una deducción natural intuicionista y su término λ, lado a lado: se elige una
 * demostración (el intercambio de la Entrada, la currificación, A → ¬¬A, la conmutatividad de la disyunción o una de
 * las leyes de De Morgan) y se la recorre de a una línea. En cada línea se marcan a la vez la fila de la deducción, con
 * su regla, y la parte del término que le corresponde; lo que todavía no se construyó queda en gris. Cada aparición de
 * una variable es una línea de hipótesis. Al terminar la deducción, el término se aplica a unas demostraciones
 * concretas y se reduce paso a paso, de afuera hacia adentro, con cada rodeo marcado y lo que queda en su lugar.
 *
 * Atributos opcionales: `data-deduccion` (`intercambio`, `currificacion`, `doble-negacion`, `conmutatividad` o
 * `de-morgan`) y `data-paso` (un número, o «final»).
 */

/** «1», «1 y 2», «1, 2 y 3». */
const enumerar = (cosas: (string | number)[]) =>
  cosas.length <= 1 ? String(cosas[0] ?? '') : `${cosas.slice(0, -1).join(', ')} y ${cosas[cosas.length - 1]}`;

const ctxFormulas = (l: Linea) => l.contexto.map(([, t]) => escribirFormula(t)).join(', ');
const juicio = (l: Linea) =>
  l.contexto.length === 0 ? `⊢ ${escribirFormula(l.tipo)}` : `${ctxFormulas(l)} ⊢ ${escribirFormula(l.tipo)}`;
const conTipo = (l: Linea) => `${escribirTermino(l.termino)} : ${escribirTipo(l.tipo)}`;

/** Qué dice una línea, en palabras: la regla de la deducción y la parte del término que le corresponde. */
function describirLinea(l: Linea, lineas: readonly Linea[]): string {
  const f = (n: number) => escribirFormula(lineas[n - 1]!.tipo);
  const F = escribirFormula(l.tipo);
  const t = escribirTermino(l.termino);
  const encabezado = `Línea ${l.numero}, ${nombreDeRegla(l)}`;
  const [p, q, r] = l.premisas;
  switch (l.regla) {
    case 'hipotesis':
      return `${encabezado}: ${F} es una de las hipótesis. En el término, es la variable ${t}, de tipo ${escribirTipo(l.tipo)}.`;
    case 'intro-imp': {
      const x = l.descarga[0]!;
      const premisa = lineas[p! - 1]!;
      const descargada = escribirFormula(premisa.contexto[premisa.contexto.length - 1]![1]);
      return `${encabezado}: de la línea ${p}, que deduce ${f(p!)} con la hipótesis ${descargada}, se pasa a ${F}, y la hipótesis ${descargada} se descarga. En el término, es la función λ${x}, que liga la variable ${x}: ${t}.`;
    }
    case 'elim-imp':
      return `${encabezado}: de ${f(p!)} (línea ${p}) y ${f(q!)} (línea ${q}) se pasa a ${F}. En el término, es la aplicación ${t}.`;
    case 'intro-y':
      return `${encabezado}: de ${f(p!)} (línea ${p}) y ${f(q!)} (línea ${q}) se pasa a ${F}. En el término, es el par ${t}.`;
    case 'elim-y-1':
    case 'elim-y-2':
      return `${encabezado}: de ${f(p!)} (línea ${p}) se pasa a ${F}. En el término, es la proyección ${t}.`;
    case 'intro-o-1':
    case 'intro-o-2':
      return `${encabezado}: de ${f(p!)} (línea ${p}) se pasa a ${F}. En el término, es ${t}, que además dice cuál de las dos vale.`;
    case 'elim-o': {
      const [x, y] = l.descarga;
      const suma = lineas[p! - 1]!.tipo;
      const [a, b] = suma.k === 'suma' ? [escribirFormula(suma.a), escribirFormula(suma.b)] : ['', ''];
      return `${encabezado}, por casos: de ${f(p!)} (línea ${p}), de ${F} con la hipótesis ${a} (línea ${q}) y de ${F} con la hipótesis ${b} (línea ${r}) se pasa a ${F}, y las dos hipótesis se descargan. En el término, es el análisis de casos, que liga ${x} en una rama e ${y} en la otra.`;
    }
    case 'absurdo':
      return `${encabezado}: de ⊥ (línea ${p}) se pasa a ${F}. En el término, es ${t}.`;
  }
}

const RODEOS: Record<Reduccion['regla'], string> = {
  β: 'una función aplicada enseguida, es decir, una introducción de → seguida de su eliminación, y la reducción β pone el argumento en lugar de la variable',
  'π₁': 'un par proyectado enseguida, es decir, una introducción de ∧ seguida de su eliminación, y la proyección se queda con la primera componente',
  'π₂': 'un par proyectado enseguida, es decir, una introducción de ∧ seguida de su eliminación, y la proyección se queda con la segunda componente',
  'caso-inl':
    'un análisis de casos de un inl, es decir, una introducción de ∨ seguida de su eliminación, y se elige la primera rama, con la demostración que trae el inl',
  'caso-inr':
    'un análisis de casos de un inr, es decir, una introducción de ∨ seguida de su eliminación, y se elige la segunda rama, con la demostración que trae el inr',
};

export function montar(raiz: HTMLElement): () => void {
  let indice = Math.max(
    0,
    CATALOGO.findIndex((d) => d.clave === raiz.dataset['deduccion']),
  );
  let paso = 0;
  raiz.textContent = '';

  // El menú de las deducciones.
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiqueta = document.createElement('label');
  const eleccion = document.createElement('select');
  CATALOGO.forEach((d, i) => {
    const opcion = document.createElement('option');
    opcion.value = String(i);
    opcion.textContent = d.nombre;
    eleccion.append(opcion);
  });
  etiqueta.append('Demostración ', eleccion);
  controles.append(etiqueta);

  // El término entero, con la parte de la línea actual marcada.
  const termino = document.createElement('p');
  termino.className = 'pieza-termino not-content';

  // Los botones.
  const botones = document.createElement('div');
  botones.className = 'pieza-controles not-content';
  const boton = (texto: string, nombre: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = texto;
    b.setAttribute('aria-label', nombre);
    botones.append(b);
    return b;
  };
  const alComienzo = boton('⏮', 'Al comienzo');
  const anterior = boton('◀', 'Paso anterior');
  const siguiente = boton('▶', 'Paso siguiente');
  const alFinal = boton('⏭', 'Al final');
  const contador = document.createElement('span');
  contador.className = 'pieza-valor';
  botones.append(contador);

  // La deducción, una fila por línea, con el término de cada una al lado.
  const tabla = document.createElement('table');
  tabla.className = 'pieza-deduccion not-content';
  const marco = document.createElement('div');
  marco.style.overflowX = 'auto';
  marco.append(tabla);

  // La reducción, que aparece al terminar la deducción.
  const reduccion = document.createElement('div');
  reduccion.className = 'pieza-reduccion not-content';
  const tituloReduccion = document.createElement('p');
  const listaReduccion = document.createElement('ol');
  listaReduccion.start = 0;
  reduccion.append(tituloReduccion, listaReduccion);

  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(controles, termino, botones, marco, reduccion, lectura);

  let lineas: Linea[] = [];
  let pasos: Reduccion[] = [];

  function calcular() {
    const d = CATALOGO[indice]!;
    lineas = deduccion(d.termino);
    pasos = reducir(d.aplicacion.termino);
  }

  /** Pinta un término partido en fragmentos; `clase` dice cómo se ve cada parte, y una parte «actual» va en <mark>. */
  function pintar(f: Fragmento, clase: (camino: string) => string | null): HTMLElement {
    const c = clase(f.camino);
    const elemento = document.createElement(c?.split(' ').includes('actual') ? 'mark' : 'span');
    if (c) elemento.className = c;
    for (const parte of f.partes) elemento.append(typeof parte === 'string' ? parte : pintar(parte, clase));
    return elemento;
  }

  function dibujar() {
    const d = CATALOGO[indice]!;
    const n = lineas.length;
    const total = n + pasos.length;
    paso = Math.max(0, Math.min(total, paso));
    eleccion.value = String(indice);

    // El término: lo construido hasta la línea actual en el color del texto, lo demás en gris, y la parte de la línea, marcada.
    const construidos = new Set(lineas.slice(0, Math.min(paso, n)).map((l) => l.camino));
    const actual = paso >= 1 && paso <= n ? lineas[paso - 1]!.camino : null;
    termino.replaceChildren(
      pintar(fragmentar(d.termino), (camino) =>
        camino === actual ? 'construido actual' : paso > n || construidos.has(camino) ? 'construido' : 'pendiente',
      ),
    );

    // La tabla.
    tabla.replaceChildren();
    const cabeza = tabla.createTHead().insertRow();
    for (const titulo of ['', 'deducción', 'regla', 'término']) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = titulo;
      cabeza.append(th);
    }
    const cuerpo = tabla.createTBody();
    for (const l of lineas) {
      const tr = cuerpo.insertRow();
      if (l.numero === paso) tr.className = 'actual';
      else if (l.numero > paso) tr.className = 'pendiente';
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = l.numero === paso ? `▸ ${l.numero}` : String(l.numero);
      tr.append(th);
      tr.insertCell().textContent = juicio(l);
      // Como en las tablas del capítulo: «en 4» si sale de una línea, «, de 1 y 3» si sale de varias.
      const premisas =
        l.premisas.length === 0 ? '' : l.premisas.length === 1 ? ` en ${l.premisas[0]}` : `, de ${enumerar(l.premisas)}`;
      tr.insertCell().textContent = `${nombreDeRegla(l)}${premisas}`;
      tr.insertCell().textContent = conTipo(l);
    }

    // La reducción.
    reduccion.hidden = paso <= n;
    if (paso > n) {
      const hechos = paso - n;
      tituloReduccion.textContent = `La demostración aplicada a ${d.aplicacion.descripcion}, y su reducción:`;
      listaReduccion.replaceChildren();
      const terminos = [pasos[0]!.antes, ...pasos.slice(0, hechos).map((p) => p.despues)];
      terminos.forEach((t, i) => {
        const li = document.createElement('li');
        // En el término anterior al último se marca el rodeo que se redujo, y en el último, lo que quedó en su lugar.
        const marca = i === hechos - 1 ? pasos[i]!.camino : null;
        const resultado = i === hechos ? pasos[i - 1]!.camino : null;
        li.append(
          pintar(fragmentar(t), (camino) =>
            camino === marca ? 'actual rodeo' : camino === resultado ? 'actual resultado' : null,
          ),
        );
        listaReduccion.append(li);
      });
    }

    // El contador y la lectura.
    contador.textContent =
      paso === 0 ? `${n} líneas` : paso <= n ? `línea ${paso} de ${n}` : `reducción ${paso - n} de ${pasos.length}`;
    alComienzo.disabled = anterior.disabled = paso === 0;
    alFinal.disabled = siguiente.disabled = paso === total;
    const enunciado = escribirFormula(lineas[n - 1]!.tipo);
    let texto: string;
    if (paso === 0)
      texto = `La deducción de ${enunciado} tiene ${n} líneas, una por cada parte del término ${escribirTermino(d.termino)}. Con ▶ se la recorre de a una línea; al terminar, el término se aplica a ${d.aplicacion.descripcion}, y se reduce.`;
    else if (paso <= n) {
      texto = describirLinea(lineas[paso - 1]!, lineas);
      if (paso === n)
        texto += ` La deducción terminó: el término tiene el tipo ${escribirTipo(lineas[n - 1]!.tipo)}, que es el enunciado.`;
    } else {
      const r = pasos[paso - n - 1]!;
      const rodeo = escribirTermino(subtermino(r.antes, r.camino));
      const queda = escribirTermino(subtermino(r.despues, r.camino));
      texto = `Reducción ${paso - n}: ${rodeo} es un rodeo, ${RODEOS[r.regla]}. En su lugar queda ${queda}.`;
      if (paso === total)
        texto += ` El término llegó a su forma normal, ${escribirTermino(r.despues)}, en ${pasos.length} ${pasos.length === 1 ? 'reducción' : 'reducciones'}: es la misma demostración, sin rodeos.`;
    }
    lectura.textContent = texto;
    // La tabla se nombra con su estado; la lectura, que se anuncia sola, dice qué pasó en el paso.
    tabla.setAttribute('aria-label', `Deducción de ${enunciado}: ${contador.textContent}.`);
  }

  const ir = (nuevo: number) => {
    paso = nuevo;
    dibujar();
  };
  const alElegir = () => {
    indice = Number(eleccion.value);
    calcular();
    ir(0);
  };
  const alComenzar = () => ir(0);
  const alRetroceder = () => ir(paso - 1);
  const alAvanzar = () => ir(paso + 1);
  const alTerminar = () => ir(lineas.length + pasos.length);

  eleccion.addEventListener('change', alElegir);
  alComienzo.addEventListener('click', alComenzar);
  anterior.addEventListener('click', alRetroceder);
  siguiente.addEventListener('click', alAvanzar);
  alFinal.addEventListener('click', alTerminar);

  calcular();
  const inicial = raiz.dataset['paso'];
  if (inicial === 'final') paso = lineas.length + pasos.length;
  else if (inicial !== undefined && Number.isFinite(Number(inicial))) paso = Math.round(Number(inicial));
  dibujar();

  return () => {
    eleccion.removeEventListener('change', alElegir);
    alComienzo.removeEventListener('click', alComenzar);
    anterior.removeEventListener('click', alRetroceder);
    siguiente.removeEventListener('click', alAvanzar);
    alFinal.removeEventListener('click', alTerminar);
  };
}
