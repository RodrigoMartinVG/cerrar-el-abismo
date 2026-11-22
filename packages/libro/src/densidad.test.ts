import { describe, expect, it } from 'vitest';
import { evaluarDensidad, medirDensidad } from './densidad.ts';

const CAPITULO = [
  '---',
  'title: Prueba',
  '---',
  '## Entrada',
  'Un fragmento.',
  '## Desarrollo',
  ':::definicion[Grupo]{#def-grupo}',
  'Un grupo es…',
  ':::',
  ':::ejemplo[Grupos chicos]',
  'Los restos módulo n.',
  ':::',
  ':::ejemplo[La recíproca de Lagrange es falsa]{#ej-a4}',
  'El grupo alternado.',
  ':::',
  ':::teorema[Lagrange]{#teo-lagrange}',
  'El orden divide.',
  ':::',
  '## Cálculo',
  '```python celda',
  'print(1)',
  '```',
  '::figura[Una figura]{#fig pieza="x" alt="y"}',
  '## Ejercicios',
  ':::ejercicio',
  'Demostrar algo.',
  ':::',
].join('\n');

describe('medirDensidad', () => {
  it('cuenta definiciones, resultados, ejemplos, contraejemplos, figuras, celdas y ejercicios', () => {
    expect(medirDensidad(CAPITULO)).toMatchObject({
      definiciones: 1,
      resultados: 1,
      ejemplos: 2,
      contraejemplos: 1,
      figuras: 1,
      celdas: 1,
      ejercicios: 1,
    });
  });

  it('no cuenta el frontmatter ni lo que está fuera del Desarrollo como ejemplos', () => {
    const d = medirDensidad(CAPITULO.replace('## Desarrollo', '## Otra cosa'));
    expect(d.ejemplos).toBe(0);
    expect(d.palabrasDesarrollo).toBe(0);
  });
});

describe('evaluarDensidad', () => {
  it('dice qué metas se cumplen', () => {
    const metas = evaluarDensidad(medirDensidad(CAPITULO), 40);
    expect(Object.fromEntries(metas.map((m) => [m.nombre, m.cumple]))).toEqual({
      'ejemplos por definición': true,
      contraejemplos: false,
      figuras: true,
      ejercicios: false,
      extensión: false,
    });
  });
});
