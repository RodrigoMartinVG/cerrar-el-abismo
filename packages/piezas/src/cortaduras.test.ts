import { describe, expect, it } from 'vitest';
import {
  compararFracciones,
  distanciaEntreFracciones,
  mayorEnLaCortadura,
  menorFueraDeLaCortadura,
  racionalesEnVentana,
  REALES_POR_CORTADURA,
  reducirFraccion,
  type FraccionEntera,
  type RealPorCortadura,
} from './cortaduras.ts';

const real = (clave: string): RealPorCortadura => REALES_POR_CORTADURA.find((r) => r.clave === clave)!;

/** Todos los racionales p/q con q ≤ n y |p/q| ≤ 3, para buscar por fuerza bruta. */
function todos(n: number): FraccionEntera[] {
  const fracciones: FraccionEntera[] = [];
  for (let q = 1; q <= n; q++) for (let p = -3 * q; p <= 3 * q; p++) fracciones.push([p, q]);
  return fracciones;
}

describe('las cortaduras de Dedekind (I.9)', () => {
  it('cada regla decide con enteros lo mismo que el valor aproximado, lejos del borde', () => {
    for (const r of REALES_POR_CORTADURA)
      for (const [p, q] of todos(30)) {
        const x = p / q;
        if (Math.abs(x - r.aproximado) > 1e-9) expect(r.contiene(p, q), `${r.nombre} y ${p}/${q}`).toBe(x < r.aproximado);
      }
  });

  it('la cortadura de un racional no lo contiene a él, y es cerrada hacia abajo', () => {
    for (const r of REALES_POR_CORTADURA) {
      if (r.racional) expect(r.contiene(...r.racional)).toBe(false);
      for (const [p, q] of todos(12)) if (r.contiene(p, q)) expect(r.contiene(p - 1, q)).toBe(true);
    }
  });

  it('con denominadores hasta 12, √2 queda entre 7/5 y 17/12, a distancia 1/60', () => {
    const r = real('raiz-de-2');
    expect(mayorEnLaCortadura(r, 12)).toEqual([7, 5]);
    expect(menorFueraDeLaCortadura(r, 12)).toEqual([17, 12]);
    expect(distanciaEntreFracciones([7, 5], [17, 12])).toEqual([1, 60]);
    expect(mayorEnLaCortadura(r, 17)).toEqual([24, 17]);
    expect(mayorEnLaCortadura(r, 29)).toEqual([41, 29]);
    expect(menorFueraDeLaCortadura(r, 70)).toEqual([99, 70]);
  });

  it('coincide con la búsqueda por fuerza bruta, para todos los reales y varios N', () => {
    for (const r of REALES_POR_CORTADURA)
      for (const n of [1, 2, 5, 12, 25]) {
        const fracciones = todos(n);
        const adentro = fracciones.filter(([p, q]) => r.contiene(p, q));
        const afuera = fracciones.filter(([p, q]) => !r.contiene(p, q));
        const mayor = adentro.reduce((a, b) => (compararFracciones(b, a) > 0 ? b : a));
        const menor = afuera.reduce((a, b) => (compararFracciones(b, a) < 0 ? b : a));
        expect(mayorEnLaCortadura(r, n)).toEqual(reducirFraccion(mayor));
        expect(menorFueraDeLaCortadura(r, n)).toEqual(reducirFraccion(menor));
      }
  });

  it('lo que queda afuera de la cortadura de un racional tiene mínimo: el racional mismo', () => {
    const r = real('un-medio');
    for (const n of [2, 3, 10, 100]) expect(menorFueraDeLaCortadura(r, n)).toEqual([1, 2]);
    expect(mayorEnLaCortadura(r, 12)).toEqual([5, 11]);
  });

  it('dibuja solo fracciones irreducibles de la ventana, cada una de su lado', () => {
    const r = real('raiz-de-2');
    const dibujados = racionalesEnVentana(r, 6, 1, 2);
    expect(dibujados.map(({ p, q }) => `${p}/${q}`)).toEqual([
      '1/1',
      '2/1',
      '3/2',
      '4/3',
      '5/3',
      '5/4',
      '7/4',
      '6/5',
      '7/5',
      '8/5',
      '9/5',
      '7/6',
      '11/6',
    ]);
    expect(dibujados.filter((d) => d.adentro).map(({ p, q }) => `${p}/${q}`)).toEqual(['1/1', '4/3', '5/4', '6/5', '7/5', '7/6']);
  });
});
