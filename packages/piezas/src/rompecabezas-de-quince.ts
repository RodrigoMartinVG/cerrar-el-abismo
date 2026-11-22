import {
  TABLERO_ORDENADO,
  alcanzable,
  deslizarPieza,
  distanciaDelHueco,
  intercambiarCasillas,
  inversionesDe,
  mezclarTablero,
  permutacionDelTablero,
  type Tablero,
} from './grupos.ts';

/**
 * PIEZA «rompecabezas-de-quince» (I.7). El tablero de 4 × 4, con las casillas pintadas como un tablero de ajedrez; un
 * clic en una pieza vecina del hueco la desliza. «Mezclar» hace jugadas al azar, e «Intercambiar 14 y 15» saca las dos
 * piezas y las vuelve a poner cambiadas, que no es una jugada. Debajo se lee el signo de la permutación de las dieciséis
 * casillas, con el hueco como la pieza 16, la distancia del hueco a su casilla y si la posición se puede alcanzar desde
 * la ordenada: en toda posición alcanzable, el signo es −1 elevado a esa distancia.
 */
export function montar(raiz: HTMLElement): () => void {
  const alt = raiz.dataset['alt'] ?? '';
  raiz.textContent = '';

  const tablero = document.createElement('div');
  tablero.className = 'pieza-controles not-content';
  tablero.setAttribute('role', 'group');
  tablero.setAttribute('aria-label', alt || 'El tablero del rompecabezas');
  tablero.style.cssText = 'display: grid; grid-template-columns: repeat(4, 2.8rem); gap: 0.3rem; width: max-content;';

  const controles = document.createElement('div');
  controles.className = 'pieza-controles not-content';
  const boton = (texto: string, accion: () => void) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = texto;
    b.addEventListener('click', accion);
    controles.append(b);
  };
  const lectura = document.createElement('output');
  lectura.className = 'pieza-lectura';
  lectura.setAttribute('aria-live', 'polite');
  raiz.append(tablero, controles, lectura);

  let t: Tablero = TABLERO_ORDENADO;
  let jugadas = 0;
  let trampas = 0;

  boton('Mezclar', () => {
    t = mezclarTablero(t, 60);
    jugadas += 60;
    dibujar();
  });
  boton('Intercambiar 14 y 15', () => {
    t = intercambiarCasillas(t, t.indexOf(14), t.indexOf(15));
    trampas++;
    dibujar();
  });
  boton('Ordenar', () => {
    t = TABLERO_ORDENADO;
    jugadas = 0;
    trampas = 0;
    dibujar();
  });

  function dibujar() {
    tablero.replaceChildren(
      ...t.map((pieza, c) => {
        const casilla = document.createElement('button');
        casilla.type = 'button';
        const oscura = (Math.floor(c / 4) + (c % 4)) % 2 === 1;
        casilla.style.cssText = `height: 2.8rem; font-variant-numeric: tabular-nums; background: ${
          oscura ? 'color-mix(in srgb, currentColor 14%, transparent)' : 'transparent'
        };`;
        if (pieza === 0) {
          casilla.disabled = true;
          casilla.style.borderStyle = 'dashed';
          casilla.setAttribute('aria-label', `Hueco, en una casilla ${oscura ? 'oscura' : 'clara'}`);
        } else {
          casilla.textContent = String(pieza);
          casilla.setAttribute('aria-label', `Pieza ${pieza}`);
          casilla.addEventListener('click', () => {
            const hueco = t.indexOf(0);
            const nuevo = deslizarPieza(t, c);
            if (!nuevo) return;
            t = nuevo;
            jugadas++;
            dibujar();
            // La pieza quedó donde estaba el hueco: el foco la sigue.
            (tablero.children[hueco] as HTMLButtonElement | undefined)?.focus();
          });
        }
        return casilla;
      }),
    );
    const inversiones = inversionesDe(permutacionDelTablero(t));
    const d = distanciaDelHueco(t);
    const veredicto = alcanzable(t)
      ? 'El signo es (−1) elevado a la distancia, como en toda posición que se alcanza jugando. Story demostró en 1880 que esa condición también alcanza: esta posición se puede ordenar.'
      : 'El signo no es (−1) elevado a la distancia: ninguna sucesión de jugadas lleva de la posición ordenada a esta, ni de esta a la ordenada.';
    lectura.textContent =
      `Jugadas: ${jugadas}${trampas > 0 ? `; intercambios fuera de las reglas: ${trampas}` : ''}. ` +
      `La permutación de las dieciséis casillas tiene ${inversiones} inversiones: es ${inversiones % 2 === 0 ? 'par' : 'impar'}. ` +
      `El hueco está a ${d} ${d === 1 ? 'paso' : 'pasos'} de su casilla. ${veredicto}`;
  }

  dibujar();
  return () => tablero.replaceChildren();
}
