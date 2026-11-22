import { describe, expect, it } from 'vitest';
import {
  aplicarAPunto,
  aplicarAVector,
  cubo,
  cuaternionDeEje,
  elemento,
  escala,
  identidad,
  matrizDeCuaternion,
  matrizDeNormales,
  mirarHacia,
  perspectiva,
  producto,
  productoDeCuaterniones,
  proyectarAlambre,
  rotacion,
  slerp,
  traslacion,
  type Vec3,
} from './demos3d.ts';

const cerca = (v: readonly number[], w: readonly number[]) => v.forEach((x, i) => expect(x).toBeCloseTo(w[i]!, 5));

describe('la biblioteca común de las demos 3D, en las convenciones de la obra (especificación, 12)', () => {
  it('guarda por columnas: la traslación queda en los lugares 12, 13 y 14', () => {
    const t = traslacion([1, 2, 3]);
    expect([...t.slice(12, 15)]).toEqual([1, 2, 3]);
    expect(elemento(t, 0, 3)).toBe(1);
  });

  it('compone de derecha a izquierda: (T R) x es rotar y después trasladar', () => {
    const m = producto(traslacion([1, 2, 3]), rotacion('y', Math.PI / 2));
    // (1, 0, 0) gira alrededor de Y hasta (0, 0, −1), como en el conversor de convenciones, y se traslada.
    cerca(aplicarAPunto(m, [1, 0, 0]), [1, 2, 2]);
    cerca(aplicarAVector(m, [1, 0, 0]), [0, 0, -1]);
  });

  it('la cámara lleva el ojo al origen y la dirección de la mirada a −Z, con Y hacia arriba', () => {
    const vista = mirarHacia([0, 0, 5], [0, 0, 0]);
    cerca(aplicarAPunto(vista, [0, 0, 5]), [0, 0, 0]);
    cerca(aplicarAPunto(vista, [0, 0, 0]), [0, 0, -5]);
    cerca(aplicarAPunto(vista, [0, 1, 5]), [0, 1, 0]);
  });

  it('la perspectiva lleva el plano cercano a la profundidad 0 y el lejano a la 1, como WebGPU', () => {
    const p = perspectiva(Math.PI / 2, 1, 0.1, 100);
    expect(aplicarAPunto(p, [0, 0, -0.1])[2]).toBeCloseTo(0, 6);
    expect(aplicarAPunto(p, [0, 0, -100])[2]).toBeCloseTo(1, 6);
    // Con un campo de 90°, el borde superior del plano cercano cae en y = 1.
    expect(aplicarAPunto(p, [0, 0.1, -0.1])[1]).toBeCloseTo(1, 6);
  });

  it('las normales se transforman con la inversa transpuesta: una escala no uniforme no las deja perpendiculares si no', () => {
    const m = escala([2, 1, 1]);
    const n = matrizDeNormales(m);
    // La normal (1, 1, 0) del plano x + y = 0 pasa a ser proporcional a (1/2, 1, 0).
    const normal: Vec3 = [1, 1, 0];
    const nueva = n.map((fila) => fila[0]! * normal[0] + fila[1]! * normal[1] + fila[2]! * normal[2]);
    cerca(nueva, [0.5, 1, 0]);
  });

  it('los cuaterniones (w, x, y, z) giran como las matrices, y el producto compone', () => {
    const q = cuaternionDeEje([0, 1, 0], Math.PI / 2);
    cerca(aplicarAVector(matrizDeCuaternion(q), [1, 0, 0]), [0, 0, -1]);
    const dos = productoDeCuaterniones(q, q);
    cerca(aplicarAVector(matrizDeCuaternion(dos), [1, 0, 0]), [-1, 0, 0]);
    cerca(slerp([1, 0, 0, 0], q, 0.5), cuaternionDeEje([0, 1, 0], Math.PI / 4));
    cerca([...matrizDeCuaternion([1, 0, 0, 0])], [...identidad()]);
  });

  it('proyecta un cubo de alambre al lienzo y descarta lo que queda detrás de la cámara', () => {
    const { vertices, aristas } = cubo();
    expect(aristas).toHaveLength(12);
    const mvp = producto(perspectiva(Math.PI / 3, 1, 0.1, 100), mirarHacia([3, 3, 5], [0, 0, 0]));
    expect(proyectarAlambre(vertices, aristas, mvp, 200, 200)).toHaveLength(12);
    const detras = producto(perspectiva(Math.PI / 3, 1, 0.1, 100), mirarHacia([0, 0, 0.5], [0, 0, 5]));
    expect(proyectarAlambre(vertices, aristas, detras, 200, 200).length).toBeLessThan(12);
  });
});
