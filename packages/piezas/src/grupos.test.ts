import { describe, expect, it } from 'vitest';
import {
  TABLERO_ORDENADO,
  alcanzable,
  casillasVecinas,
  coclasesPorLaDerecha,
  coclasesPorLaIzquierda,
  componerPermutaciones,
  cicloDe,
  deslizarPieza,
  distanciaDelHueco,
  esNormal,
  grupoD4,
  grupoS3,
  intercambiarCasillas,
  inversaDePermutacion,
  inversosDe,
  mezclarTablero,
  nombreDeCoclase,
  signoDePermutacion,
  subgrupoGenerado,
  subgruposDe,
  tablaDeCayley,
  tablaDelCociente,
  testigoDeQueNoEsNormal,
  type GrupoChico,
} from './grupos.ts';

/** Los subgrupos con los nombres de sus elementos, para leer las pruebas como el texto del capítulo. */
const conNombres = (G: GrupoChico, H: readonly number[]) => H.map((i) => G.elementos[i]!.nombre);
const buscar = (G: GrupoChico, ...nombres: string[]) => nombres.map((n) => G.elementos.findIndex((x) => x.nombre === n));

describe('las permutaciones', () => {
  it('se componen de derecha a izquierda, como en el capítulo: (1 3)(1 2) = (1 2 3)', () => {
    expect(componerPermutaciones(cicloDe(3, 1, 3), cicloDe(3, 1, 2))).toEqual(cicloDe(3, 1, 2, 3));
    expect(componerPermutaciones(cicloDe(3, 1, 2), cicloDe(3, 1, 3))).toEqual(cicloDe(3, 1, 3, 2));
  });

  it('el signo es un homomorfismo, y una transposición es impar', () => {
    const muestras = [cicloDe(5, 1, 3, 5), cicloDe(5, 2, 4), cicloDe(5, 1, 2, 3, 4, 5), cicloDe(5, 1, 5)];
    for (const a of muestras) {
      expect(componerPermutaciones(a, inversaDePermutacion(a))).toEqual(cicloDe(5));
      for (const b of muestras)
        expect(signoDePermutacion(componerPermutaciones(a, b))).toBe(signoDePermutacion(a) * signoDePermutacion(b));
    }
    expect(signoDePermutacion(cicloDe(5, 1, 5))).toBe(-1);
    // (1 3 5)(2 4) tiene 7 inversiones: es impar, como el producto de tres transposiciones.
    expect(signoDePermutacion(componerPermutaciones(cicloDe(5, 1, 3, 5), cicloDe(5, 2, 4)))).toBe(-1);
  });
});

describe('las tablas de S₃ y D₄ (I.7)', () => {
  it('son tablas de grupo: cada fila y cada columna tiene a todos los elementos una vez', () => {
    for (const G of [grupoS3(), grupoD4()]) {
      const tabla = tablaDeCayley(G);
      const n = G.elementos.length;
      for (let i = 0; i < n; i++) {
        expect(new Set(tabla[i]).size).toBe(n);
        expect(new Set(tabla.map((fila) => fila[i])).size).toBe(n);
      }
      expect(tabla[0]).toEqual([...Array(n).keys()]);
    }
  });

  it('reproducen las filas que escribe el capítulo', () => {
    const S3 = grupoS3();
    const nombre = (G: GrupoChico, i: number) => G.elementos[i]!.nombre;
    expect(tablaDeCayley(S3)[3]!.map((i) => nombre(S3, i))).toEqual(['(1 2)', '(2 3)', '(1 3)', 'id', '(1 3 2)', '(1 2 3)']);
    const D4 = grupoD4();
    expect(tablaDeCayley(D4)[4]!.map((i) => nombre(D4, i))).toEqual(['s', 'r³s', 'r²s', 'rs', 'e', 'r³', 'r²', 'r']);
    expect(conNombres(D4, inversosDe(D4))).toEqual(['e', 'r³', 'r²', 'r', 's', 'rs', 'r²s', 'r³s']);
  });

  it('S₃ tiene seis subgrupos, y los de orden 2 no son normales', () => {
    const S3 = grupoS3();
    const subgrupos = subgruposDe(S3);
    expect(subgrupos.map((H) => H.length)).toEqual([1, 2, 2, 2, 3, 6]);
    expect(subgrupos.map((H) => esNormal(S3, H))).toEqual([true, false, false, false, true, true]);
    expect(conNombres(S3, subgrupos[4]!)).toEqual(['id', '(1 2 3)', '(1 3 2)']);
  });

  it('D₄ tiene diez subgrupos; los normales son siete, y los cuatro generados por una reflexión no lo son', () => {
    const D4 = grupoD4();
    const subgrupos = subgruposDe(D4);
    expect(subgrupos.map((H) => H.length)).toEqual([1, 2, 2, 2, 2, 2, 4, 4, 4, 8]);
    const noNormales = subgrupos.filter((H) => !esNormal(D4, H)).map((H) => conNombres(D4, H));
    expect(noNormales).toEqual([
      ['e', 's'],
      ['e', 'rs'],
      ['e', 'r²s'],
      ['e', 'r³s'],
    ]);
  });

  it('las coclases por la izquierda y por la derecha coinciden si y solo si el subgrupo es normal', () => {
    for (const G of [grupoS3(), grupoD4()])
      for (const H of subgruposDe(G)) {
        const ordenar = (clases: number[][]) => clases.map((C) => [...C].sort((a, b) => a - b).join(',')).sort();
        const iguales = ordenar(coclasesPorLaIzquierda(G, H)).join('|') === ordenar(coclasesPorLaDerecha(G, H)).join('|');
        expect(iguales).toBe(esNormal(G, H));
        expect(testigoDeQueNoEsNormal(G, H) === undefined).toBe(esNormal(G, H));
        expect(tablaDelCociente(G, H) !== undefined).toBe(esNormal(G, H));
        // Las coclases parten al grupo en partes de |H| elementos (lema de las coclases).
        const izquierda = coclasesPorLaIzquierda(G, H);
        expect(izquierda.flat().sort((a, b) => a - b)).toEqual([...G.elementos.keys()]);
        expect(izquierda.every((C) => C.length === H.length)).toBe(true);
      }
  });

  it('las coclases de ⟨(1 2)⟩ en S₃ son las del capítulo', () => {
    const S3 = grupoS3();
    const H = subgrupoGenerado(S3, buscar(S3, '(1 2)'));
    // Cada coclase se nombra por su primer elemento en el orden del grupo: (1 2 3)H es la (1 3)H del capítulo.
    expect(coclasesPorLaIzquierda(S3, H).map((C) => conNombres(S3, C))).toEqual([
      ['id', '(1 2)'],
      ['(1 2 3)', '(1 3)'],
      ['(1 3 2)', '(2 3)'],
    ]);
    expect(coclasesPorLaDerecha(S3, H).map((C) => conNombres(S3, C))).toEqual([
      ['id', '(1 2)'],
      ['(1 2 3)', '(2 3)'],
      ['(1 3 2)', '(1 3)'],
    ]);
  });

  it('D₄/⟨r²⟩ es el grupo de Klein: cuatro coclases, y cada una al cuadrado da el neutro', () => {
    const D4 = grupoD4();
    const H = subgrupoGenerado(D4, buscar(D4, 'r²'));
    const cociente = tablaDelCociente(D4, H)!;
    expect(cociente.length).toBe(4);
    expect(cociente.map((fila, i) => fila[i])).toEqual([0, 0, 0, 0]);
    expect(coclasesPorLaIzquierda(D4, H).map((C) => nombreDeCoclase(D4, C, 'izquierda'))).toEqual(['H', 'rH', 'sH', 'rsH']);
  });

  it('ser normal no es transitivo: ⟨s⟩ es normal en {e, r², s, r²s}, que es normal en D₄, pero no en D₄', () => {
    const D4 = grupoD4();
    const V = subgrupoGenerado(D4, buscar(D4, 's', 'r²'));
    expect(conNombres(D4, V)).toEqual(['e', 'r²', 's', 'r²s']);
    expect(esNormal(D4, V)).toBe(true);
    expect(esNormal(D4, subgrupoGenerado(D4, buscar(D4, 's')))).toBe(false);
    // Dentro de V, que es abeliano, todo subgrupo es normal.
    const tabla = tablaDeCayley(D4);
    expect(V.every((a) => V.every((b) => tabla[a]![b] === tabla[b]![a]))).toBe(true);
  });
});

describe('el rompecabezas de quince piezas', () => {
  it('las casillas tienen dos, tres o cuatro vecinas', () => {
    expect(casillasVecinas(0).sort()).toEqual([1, 4]);
    expect(casillasVecinas(5).sort((a, b) => a - b)).toEqual([1, 4, 6, 9]);
    expect(casillasVecinas(15).sort((a, b) => a - b)).toEqual([11, 14]);
  });

  it('solo se desliza una pieza vecina del hueco', () => {
    expect(deslizarPieza(TABLERO_ORDENADO, 0)).toBeUndefined();
    const t = deslizarPieza(TABLERO_ORDENADO, 14)!;
    expect(t.slice(12)).toEqual([13, 14, 0, 15]);
    expect(distanciaDelHueco(t)).toBe(1);
  });

  it('toda posición que se alcanza cumple el invariante, y cambiar dos piezas lo rompe', () => {
    let semilla = 7;
    const azar = () => (semilla = (semilla * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    for (let k = 0; k < 200; k++) {
      const t = mezclarTablero(TABLERO_ORDENADO, k, azar);
      expect(alcanzable(t)).toBe(true);
      const a = t.indexOf(14);
      const b = t.indexOf(15);
      expect(alcanzable(intercambiarCasillas(t, a, b))).toBe(false);
    }
  });

  it('la posición de Sam Loyd, con el 14 y el 15 cambiados, no se alcanza', () => {
    expect(alcanzable(intercambiarCasillas(TABLERO_ORDENADO, 13, 14))).toBe(false);
  });

  it('la prueba de los programas, inversiones de las piezas más la fila del hueco, dice lo mismo', () => {
    let semilla = 3;
    const azar = () => (semilla = (semilla * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    for (let k = 0; k < 100; k++) {
      let t = mezclarTablero(TABLERO_ORDENADO, 50 + k, azar);
      if (k % 2 === 1) t = intercambiarCasillas(t, t.indexOf(1), t.indexOf(2));
      const piezas = t.filter((x) => x !== 0);
      let inversiones = 0;
      for (let i = 0; i < 15; i++) for (let j = i + 1; j < 15; j++) if (piezas[i]! > piezas[j]!) inversiones++;
      const filaDelHueco = Math.floor(t.indexOf(0) / 4);
      expect((inversiones + filaDelHueco) % 2 === 1).toBe(alcanzable(t));
    }
  });
});
