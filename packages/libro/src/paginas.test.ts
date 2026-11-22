import { describe, expect, it } from 'vitest';
import { paginasDelCapitulo, tramo } from './paginas.ts';

const CAPITULO = [
  '---',
  'title: x',
  '---',
  '## Entrada',
  'Un fragmento.',
  '## Motivación',
  'Una pregunta.',
  '## Desarrollo',
  'La introducción.',
  '### Grupos',
  ':::definicion[Grupo]{#def-grupo}',
  'Un grupo.',
  ':::',
  '### Subgrupos y órbitas',
  '::figura[Una tabla]{#fig-tabla pieza="x" alt="y"}',
  '```python celda',
  '# ### esto no es un título',
  '```',
  '## Cálculo',
  '## Puente',
  ':::puente',
  ':::',
  '## Aplicaciones',
  '## Salida',
  '## Ejercicios',
  ':::ejercicio{#ej-uno nivel=1 tipo=calculo seccion="grupos" respuesta=1}',
  'Contar.',
  ':::',
  '## Notas y «Para seguir»',
].join('\n');

describe('las páginas de un capítulo (decisión 0008)', () => {
  it('divide en portada, una página por sección del Desarrollo y las demás secciones', () => {
    expect(paginasDelCapitulo(CAPITULO).map((p) => [p.slug, p.titulo, p.desde])).toEqual([
      ['', 'Entrada y motivación', undefined],
      ['grupos', 'Grupos', 'desarrollo'],
      ['subgrupos-y-orbitas', 'Subgrupos y órbitas', 'subgrupos-y-órbitas'],
      ['calculo', 'Cálculo', 'cálculo'],
      ['puente', 'Puente y aplicaciones', 'puente'],
      ['salida', 'Salida', 'salida'],
      ['ejercicios', 'Ejercicios', 'ejercicios'],
      ['notas', 'Notas y «Para seguir»', 'notas-y-para-seguir'],
    ]);
  });

  it('dice en qué página queda cada ancla, y qué títulos no repite la página', () => {
    const paginas = paginasDelCapitulo(CAPITULO);
    const donde = (ancla: string) => paginas.find((p) => p.anclas.includes(ancla))?.slug;
    expect(donde('def-grupo')).toBe('grupos');
    expect(donde('desarrollo')).toBe('grupos');
    expect(donde('fig-tabla')).toBe('subgrupos-y-orbitas');
    expect(donde('ej-uno')).toBe('ejercicios');
    expect(donde('aplicaciones')).toBe('puente');
    expect(paginas[1]!.sinTitulo).toEqual(['desarrollo', 'grupos']);
    expect(paginas.find((p) => p.slug === 'puente')!.sinTitulo).toEqual([]);
  });

  it('el tramo de la dirección no lleva tildes', () => {
    expect(tramo('acciones-órbitas-y-el-lema-de-burnside')).toBe('acciones-orbitas-y-el-lema-de-burnside');
  });
});
