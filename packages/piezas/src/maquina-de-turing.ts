import {
  BLANCO,
  MAQUINAS,
  clave,
  contenido,
  ejecutar,
  leer,
  maquinaPorId,
  reglaActual,
  revisarEntrada,
  unos,
  ventana,
  type Configuracion,
  type MaquinaDeTuring,
  type Regla,
  type Traza,
} from './turing.ts';

/**
 * PIEZA «maquina-de-turing» (I.14). Una máquina de Turing paso a paso: la cinta, con el cabezal y el estado encima de la
 * celda que lee; la tabla del programa, con la fila del estado actual y la regla que se va a aplicar marcadas; y una
 * lectura que dice qué hace esa regla, o cómo terminó el cálculo. Se elige la máquina (la que decide 0ⁿ1ⁿ, la que suma
 * uno en binario o un castor afanoso de dos, tres o cuatro estados) y, si lee una entrada, se la escribe.
 *
 * Atributos opcionales: `data-maquina` (el identificador de una máquina de `turing.ts`), `data-entrada` y `data-paso`
 * (un número, o «final»).
 */

/** El blanco, como se lo ve en la cinta y en la tabla. */
const verSimbolo = (s: string) => (s === BLANCO ? '⊔' : s);
const FLECHA = { izquierda: '←', derecha: '→' } as const;
const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** «escribir x, mover el cabezal a la izquierda y pasar a D», o «dejar el 1» si escribe lo que lee. */
function queHace(regla: Regla, leido: string, m: MaquinaDeTuring): string {
  const escribe =
    regla.escribe === leido
      ? `dejar ${leido === BLANCO ? 'el blanco' : `el ${leido}`}`
      : regla.escribe === BLANCO
        ? 'borrar la celda'
        : `escribir ${regla.escribe}`;
  const pasa = regla.pasaA in m.paradas ? `pasar al estado de parada ${regla.pasaA}` : `pasar a ${regla.pasaA}`;
  return `${escribe}, mover el cabezal a la ${regla.mueve} y ${pasa}`;
}

export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  let maquina = maquinaPorId(raiz.dataset['maquina']) ?? MAQUINAS[0]!;
  let entrada = raiz.dataset['entrada'] ?? maquina.entrada;
  if (revisarEntrada(maquina, entrada) !== null) entrada = maquina.entrada;
  let traza: Traza | null = null;
  let paso = 0;
  raiz.textContent = '';

  // Los controles: la máquina y la entrada.
  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const etiquetaMaquina = document.createElement('label');
  const eleccion = document.createElement('select');
  for (const m of MAQUINAS) {
    const opcion = document.createElement('option');
    opcion.value = m.id;
    opcion.textContent = m.nombre;
    eleccion.append(opcion);
  }
  etiquetaMaquina.append('Máquina ', eleccion);
  const etiquetaEntrada = document.createElement('label');
  const campo = document.createElement('input');
  Object.assign(campo, { type: 'text', spellcheck: false, autocomplete: 'off', size: 12 });
  campo.style.fontFamily = 'var(--sl-font-mono, monospace)';
  etiquetaEntrada.append('Entrada ', campo);
  controles.append(etiquetaMaquina, etiquetaEntrada);

  // Los botones para avanzar y retroceder.
  const botones = document.createElement('div');
  botones.className = 'pieza-controles not-content';
  const boton = (texto: string, etiqueta: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = texto;
    b.setAttribute('aria-label', etiqueta);
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

  // La cinta: una fila con el estado y una flecha sobre la celda que lee, y otra con las celdas.
  const marcoDeCinta = document.createElement('div');
  marcoDeCinta.style.overflowX = 'auto';
  const cinta = document.createElement('table');
  cinta.className = 'pieza-matriz pieza-cinta not-content';
  marcoDeCinta.append(cinta);

  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');

  // El programa: una fila por estado, una columna por símbolo.
  const marcoDePrograma = document.createElement('div');
  marcoDePrograma.style.overflowX = 'auto';
  const programa = document.createElement('table');
  programa.className = 'pieza-matriz pieza-tabla-grafo pieza-programa not-content';
  marcoDePrograma.append(programa);
  const paradas = document.createElement('p');
  paradas.className = 'pieza-lectura';
  raiz.append(controles, botones, marcoDeCinta, lectura, marcoDePrograma, paradas);

  function dibujarPrograma(actual: Configuracion | null) {
    programa.replaceChildren();
    const cabeza = programa.createTHead().insertRow();
    for (const titulo of ['estado', ...maquina.simbolos.map(verSimbolo)]) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = titulo;
      cabeza.append(th);
    }
    const cuerpo = programa.createTBody();
    const regla = actual ? reglaActual(maquina, actual) : null;
    for (const estado of maquina.estados) {
      const tr = cuerpo.insertRow();
      if (actual?.estado === estado) tr.classList.add('actual');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = estado;
      tr.append(th);
      for (const simbolo of maquina.simbolos) {
        const td = tr.insertCell();
        const r = maquina.programa[clave(estado, simbolo)];
        const texto = r ? `${verSimbolo(r.escribe)} ${FLECHA[r.mueve]} ${r.pasaA}` : '—';
        if (r && regla && actual?.estado === estado && leer(actual, actual.cabezal) === simbolo) {
          td.classList.add('regla');
          const fuerte = document.createElement('strong');
          fuerte.textContent = texto;
          td.append(fuerte);
        } else td.textContent = texto;
      }
    }
    paradas.textContent = `Estados de parada: ${Object.entries(maquina.paradas)
      .map(([e, sentido]) => `${e} (${sentido})`)
      .join(', ')}. Cada regla se lee «escribe, mueve, pasa a».`;
  }

  function dibujarCinta(actual: Configuracion, desde: number, hasta: number) {
    cinta.replaceChildren();
    const arriba = cinta.insertRow();
    arriba.className = 'fila-del-cabezal';
    const abajo = cinta.insertRow();
    for (let i = desde; i <= hasta; i++) {
      const marca = arriba.insertCell();
      const celda = abajo.insertCell();
      celda.textContent = verSimbolo(leer(actual, i));
      if (i === actual.cabezal) {
        marca.textContent = `${actual.estado} ▼`;
        marca.classList.add('cabezal');
        celda.classList.add('cabezal');
      }
    }
    const simbolos = Array.from({ length: hasta - desde + 1 }, (_, k) => verSimbolo(leer(actual, desde + k))).join(' ');
    cinta.setAttribute(
      'aria-label',
      `La cinta: ${simbolos}. El cabezal lee la celda ${actual.cabezal - desde + 1} de la izquierda, con ${verSimbolo(leer(actual, actual.cabezal))}, en el estado ${actual.estado}.`,
    );
  }

  function describir(t: Traza, k: number): string {
    const c = t.configuraciones[k]!;
    const n = t.configuraciones.length - 1;
    const leido = leer(c, c.cabezal);
    const verLeido = leido === BLANCO ? 'un blanco' : leido;
    if (k === n) {
      if (t.final === 'sin-regla')
        return `No hay regla para el estado ${c.estado} con ${verLeido}: la máquina se cuelga sin llegar a un estado de parada.`;
      if (t.final === 'limite') return `La máquina no se detuvo en los primeros ${n} pasos.`;
      const pasos = plural(n, 'paso', 'pasos');
      if (maquina.id === 'ceros-unos') {
        const palabra = entrada === '' ? 'la palabra vacía' : `la entrada ${entrada}`;
        return `La máquina llegó al estado de parada ${c.estado} después de ${pasos}: ${maquina.paradas[c.estado]} ${palabra}.`;
      }
      if (maquina.id === 'sumar-uno') {
        const antes = parseInt(entrada === '' ? '0' : entrada, 2);
        const despues = contenido(c);
        return `La máquina se detuvo en ${c.estado} después de ${pasos}. La cinta dice ${despues}, que es ${parseInt(despues, 2)} en binario: ${antes} + 1.`;
      }
      return `La máquina se detuvo en ${c.estado} después de ${pasos}, con ${plural(unos(c), 'uno', 'unos')} en la cinta.`;
    }
    const regla = reglaActual(maquina, c)!;
    const comienzo =
      k === 0
        ? maquina.alfabetoDeEntrada.length === 0
          ? `Al comienzo, la cinta está en blanco y la máquina está en el estado ${c.estado}; lee ${verLeido}.`
          : `Al comienzo, la máquina está en el estado ${c.estado}, con el cabezal sobre la primera celda de la entrada; lee ${verLeido}.`
        : `Después de ${plural(k, 'paso', 'pasos')}, la máquina está en el estado ${c.estado} y lee ${verLeido}.`;
    return `${comienzo} La regla (${c.estado}, ${verSimbolo(leido)}) dice: ${queHace(regla, leido, maquina)}.`;
  }

  function dibujar() {
    eleccion.value = maquina.id;
    etiquetaEntrada.hidden = maquina.alfabetoDeEntrada.length === 0;
    const error = revisarEntrada(maquina, entrada);
    const deshabilitar = (si: boolean) => {
      alComienzo.disabled = anterior.disabled = si || paso === 0;
      alFinal.disabled = siguiente.disabled = si || !traza || paso === traza.configuraciones.length - 1;
    };
    if (error !== null || !traza) {
      lectura.textContent = error ?? '';
      lectura.classList.add('pieza-error');
      contador.textContent = '';
      cinta.replaceChildren();
      dibujarPrograma(null);
      deshabilitar(true);
      return;
    }
    lectura.classList.remove('pieza-error');
    const actual = traza.configuraciones[paso]!;
    const [desde, hasta] = ventana(traza.configuraciones);
    dibujarCinta(actual, desde - 1, hasta + 1);
    dibujarPrograma(actual);
    lectura.textContent = describir(traza, paso);
    contador.textContent = `paso ${paso} de ${traza.configuraciones.length - 1}`;
    deshabilitar(false);
    raiz.setAttribute('aria-label', `${alt} Ahora: ${maquina.nombre}, paso ${paso}.`.trim());
  }

  /** Rehace la traza con la máquina y la entrada actuales, y vuelve al comienzo. */
  function calcular() {
    traza = revisarEntrada(maquina, entrada) === null ? ejecutar(maquina, entrada) : null;
    paso = 0;
    dibujar();
  }

  const ir = (nuevo: number) => {
    if (!traza) return;
    paso = Math.max(0, Math.min(traza.configuraciones.length - 1, nuevo));
    dibujar();
  };
  const alElegir = () => {
    maquina = maquinaPorId(eleccion.value) ?? MAQUINAS[0]!;
    entrada = maquina.entrada;
    campo.value = entrada;
    calcular();
  };
  const alEscribir = () => {
    entrada = campo.value.trim();
    calcular();
  };
  const alComenzar = () => ir(0);
  const alRetroceder = () => ir(paso - 1);
  const alAvanzar = () => ir(paso + 1);
  const alTerminar = () => ir(Number.POSITIVE_INFINITY);

  eleccion.addEventListener('change', alElegir);
  campo.addEventListener('input', alEscribir);
  alComienzo.addEventListener('click', alComenzar);
  anterior.addEventListener('click', alRetroceder);
  siguiente.addEventListener('click', alAvanzar);
  alFinal.addEventListener('click', alTerminar);

  campo.value = entrada;
  calcular();
  const pasoInicial = raiz.dataset['paso'];
  if (pasoInicial === 'final') ir(Number.POSITIVE_INFINITY);
  else if (pasoInicial !== undefined && Number.isFinite(Number(pasoInicial))) ir(Number(pasoInicial));

  return () => {
    eleccion.removeEventListener('change', alElegir);
    campo.removeEventListener('input', alEscribir);
    alComienzo.removeEventListener('click', alComenzar);
    anterior.removeEventListener('click', alRetroceder);
    siguiente.removeEventListener('click', alAvanzar);
    alFinal.removeEventListener('click', alTerminar);
  };
}
