import { describe, expect, it } from 'vitest';
import { revisarRegistroDeTerminologia, usosRechazados, type Termino } from './terminologia.ts';

const REGISTRO: Termino[] = [
  {
    termino: 'coclase',
    ingles: 'coset',
    variantes: [{ forma: 'clase lateral', uso: 'en España' }],
    rechazar: ['clase lateral', 'clases laterales'],
  },
  {
    termino: 'grupo diédrico',
    ingles: 'dihedral group',
    variantes: [{ forma: 'grupo diedral', uso: 'en América' }],
    rechazar: ['diedral'],
  },
];

describe('usosRechazados', () => {
  it('encuentra las formas rechazadas, sin importar mayúsculas ni saltos de línea, con su línea', () => {
    const texto = 'Primera línea.\nLas Clases\nlaterales de un subgrupo.\nEl grupo diedral.';
    expect(usosRechazados(texto, REGISTRO)).toEqual([
      { forma: 'clases laterales', termino: 'coclase', linea: 2 },
      { forma: 'diedral', termino: 'grupo diédrico', linea: 4 },
    ]);
  });

  it('respeta los límites de palabra: «diedrales» no es «diedral»', () => {
    expect(usosRechazados('Ángulos diedrales.', REGISTRO)).toEqual([]);
  });

  it('una forma nombrada entre comillas latinas, en el código o en una fórmula no es un uso', () => {
    const texto = [
      'Otros libros dicen «clase lateral».',
      '`clase_lateral = clase lateral`',
      '$\\text{clase lateral}$',
      '```python',
      '# una clase lateral',
      '```',
    ].join('\n');
    expect(usosRechazados(texto, REGISTRO)).toEqual([]);
  });
});

describe('revisarRegistroDeTerminologia', () => {
  it('acepta un registro bien escrito', () => {
    expect(revisarRegistroDeTerminologia(REGISTRO)).toEqual([]);
  });

  it('pide los campos y no deja que una forma esté en dos términos', () => {
    const problemas = revisarRegistroDeTerminologia([
      { termino: 'cuerpo', variantes: [] },
      { termino: 'campo', ingles: 'field', variantes: [{ forma: 'cuerpo', uso: 'x' }], rechazar: ['campo', 'cuerpo'] },
    ]);
    expect(problemas).toContainEqual(expect.stringContaining('necesita «termino» e «ingles»'));
    expect(problemas).toContainEqual(expect.stringContaining('al menos una variante'));
    expect(problemas).toContainEqual(expect.stringContaining('«cuerpo» aparece en «cuerpo» y en «campo»'));
    expect(problemas).toContainEqual(expect.stringContaining('no puede rechazarse a sí mismo'));
  });
});
