import { describe, expect, it } from 'vitest';
import { revisarCumple } from './cumple.ts';

const TEXTO = ':::teorema[Recursión]{#teo-recursion}\n…\n:::\n\n:::definicion{#def-enteros}\n…\n:::\n';
const promesa = { de: 'I.1', nocion: 'las definiciones por recursión' };

describe('revisarCumple', () => {
  it('acepta un capítulo que cumple lo que le prometieron, y uno al que no le prometieron nada', () => {
    expect(revisarCumple([{ ...promesa, anclas: ['teo-recursion'] }], TEXTO, [promesa])).toEqual([]);
    expect(revisarCumple(undefined, TEXTO, [])).toEqual([]);
  });

  it('señala una promesa sin cumplir', () => {
    expect(revisarCumple(undefined, TEXTO, [promesa])).toEqual([expect.stringContaining('falta en «cumple»')]);
  });

  it('señala un cumplimiento que no responde a ninguna promesa, por ejemplo porque la noción cambió', () => {
    expect(revisarCumple([{ ...promesa, nocion: 'la recursión', anclas: ['teo-recursion'] }], TEXTO, [promesa])).toEqual([
      expect.stringContaining('falta en «cumple»'),
      expect.stringContaining('no es ninguna noción'),
    ]);
  });

  it('pide anclas que existan', () => {
    expect(revisarCumple([{ ...promesa, anclas: ['teo-otro'] }], TEXTO, [promesa])).toEqual([
      expect.stringContaining('no tiene la etiqueta «teo-otro»'),
    ]);
    expect(revisarCumple([{ ...promesa, anclas: [] }], TEXTO, [promesa])).toEqual([
      expect.stringContaining('al menos una ancla'),
      expect.stringContaining('falta en «cumple»'),
    ]);
  });
});
