import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cargarIndice, carpetaDelIndice } from './cargar.ts';
import { conIndice, enumerar, itinerariosEnMarkdown, miles } from './markdown.ts';

describe('enumerar', () => {
  it('une como se escribe en español', () => {
    expect(enumerar([])).toBe('');
    expect(enumerar(['II'])).toBe('II');
    expect(enumerar(['II', 'III'])).toBe('II y III');
    expect(enumerar(['II', 'III', 'IV'])).toBe('II, III y IV');
  });
});

describe('los bloques generados de la especificación (secciones 6, 9.6, 13 y 14)', () => {
  it('son los que escriben los datos de indice/ (si falla: npm run indice:spec)', () => {
    const archivo = join(carpetaDelIndice(), '..', 'docs', 'especificacion.md');
    const especificacion = readFileSync(archivo, 'utf8');
    expect(conIndice(especificacion, cargarIndice())).toBe(especificacion);
  });
});

describe('miles', () => {
  it('separa los miles con punto, como la especificación', () => {
    expect(miles(5)).toBe('5');
    expect(miles(5164)).toBe('5.164');
    expect(miles(1234567)).toBe('1.234.567');
  });
});

describe('itinerariosEnMarkdown', () => {
  it('describe el núcleo y lo que suma cada itinerario', () => {
    const tabla = itinerariosEnMarkdown(cargarIndice());
    expect(tabla).toContain('| Núcleo | Todos los capítulos de núcleo');
    expect(tabla).toMatch(/\| Física \| Núcleo, más .* y el Tomo XIII \|/);
  });
});
