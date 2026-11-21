import { describe, expect, it } from 'vitest';
import { claveDeTermino, revisarDiccionario } from './diccionario.ts';

const CAMPOS = ['3d', 'fisica', 'datos'];
const TEXTO = ':::definicion[Combinación afín]{#def-afin}\n…\n:::\n';
const buena = {
  termino: 'combinación afín',
  ingles: 'affine combination',
  practica: ['*lerp*', '`mix` en GLSL'],
  nota: 'Un *lerp* es la combinación afín de dos puntos con pesos 1 − t y t.',
  ancla: 'def-afin',
  campos: ['3d'],
};

describe('revisarDiccionario', () => {
  it('acepta entradas completas, con o sin ancla y campos', () => {
    expect(revisarDiccionario([buena], TEXTO, CAMPOS)).toEqual([]);
    const minima = { termino: buena.termino, ingles: buena.ingles, practica: buena.practica, nota: buena.nota };
    expect(revisarDiccionario([minima], TEXTO, CAMPOS)).toEqual([]);
  });

  it('exige que el capítulo agregue al menos un término (especificación, 16.2)', () => {
    expect(revisarDiccionario(undefined, TEXTO, CAMPOS)).toEqual([expect.stringContaining('no agrega términos')]);
    expect(revisarDiccionario([], TEXTO, CAMPOS)).toEqual([expect.stringContaining('no agrega términos')]);
  });

  it.each([
    ['una lista', { a: 1 }, 'tiene que ser una lista'],
    ['un término', [{ ...buena, termino: ' ' }], 'no tiene «termino»'],
    ['el inglés', [{ ...buena, ingles: undefined }], 'no tiene «ingles»'],
    ['la nota', [{ ...buena, nota: '' }], 'no tiene «nota»'],
    ['algún nombre práctico', [{ ...buena, practica: [] }], '«practica» tiene que ser una lista'],
    ['textos sin fórmulas', [{ ...buena, nota: 'Es $(1 - t)a + tb$.' }], 'tiene una fórmula'],
    ['un ancla que exista', [{ ...buena, ancla: 'def-otra' }], 'no tiene la etiqueta «def-otra»'],
    ['campos del índice', [{ ...buena, campos: ['cocina'] }], '«cocina» no es un campo'],
    ['solo los campos conocidos', [{ ...buena, sinonimos: ['x'] }], '«sinonimos» no es un campo de las entradas'],
    ['términos distintos', [buena, { ...buena, termino: 'Combinacion afin' }], 'aparece dos veces'],
  ])('pide %s', (_, diccionario, mensaje) => {
    expect(revisarDiccionario(diccionario, TEXTO, CAMPOS)).toEqual([expect.stringContaining(mensaje)]);
  });

  it('no confunde una etiqueta con otra que empieza igual', () => {
    expect(revisarDiccionario([{ ...buena, ancla: 'def' }], TEXTO, CAMPOS)).toEqual([
      expect.stringContaining('no tiene la etiqueta «def»'),
    ]);
  });
});

describe('claveDeTermino', () => {
  it('compara sin mayúsculas ni tildes', () => {
    expect(claveDeTermino('Álgebra de Boole')).toBe(claveDeTermino('algebra de boole'));
  });
});
