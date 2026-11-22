import { describe, expect, it } from 'vitest';
import { enConvencion, enMemoria, esfericas, metrica, transformacion, transpuesta } from './convenciones.ts';

const M = transformacion(Math.PI / 2, [1, 2, 3]);
const cerca = (m: number[][]) => m.map((fila) => fila.map((x) => Math.round(x * 1e9) / 1e9 + 0));

describe('el conversor de convenciones', () => {
  it('la transformación de la obra rota alrededor de Y y después traslada', () => {
    // El punto (1, 0, 0) gira 90° alrededor de Y hasta (0, 0, −1), y se traslada a (1, 2, 2).
    const x = [1, 0, 0, 1];
    const y = M.map((fila) => fila.reduce((s, v, j) => s + v * x[j]!, 0));
    expect(y.map((v) => Math.round(v * 1e9) / 1e9 + 0)).toEqual([1, 2, 2, 1]);
  });

  it('en mano izquierda, la rotación cambia de sentido y la traslación cambia el signo de z', () => {
    expect(cerca(enConvencion(M, 'izquierda', 'columna'))).toEqual(cerca(transformacion(-Math.PI / 2, [1, 2, -3])));
  });

  it('con vectores fila, la matriz es la transpuesta', () => {
    expect(enConvencion(M, 'derecha', 'fila')).toEqual(transpuesta(M));
  });

  it('columnas con vectores columna y filas con vectores fila dan los mismos 16 números en memoria', () => {
    const columnaPorColumnas = enMemoria(enConvencion(M, 'derecha', 'columna'), 'columnas');
    const filaPorFilas = enMemoria(enConvencion(M, 'derecha', 'fila'), 'filas');
    expect(filaPorFilas).toEqual(columnaPorColumnas);
    // Por columnas, la traslación queda en los lugares 12, 13 y 14.
    expect(columnaPorColumnas.slice(12, 15)).toEqual([1, 2, 3]);
  });

  it('las dos signaturas de la métrica difieren en el signo, y las dos convenciones esféricas intercambian los ángulos', () => {
    expect(metrica('-+++').diagonal.map((x) => -x)).toEqual(metrica('+---').diagonal);
    expect(esfericas('iso').z).toBe('r cos θ');
    expect(esfericas('calculo').z).toBe('r cos φ');
  });
});
