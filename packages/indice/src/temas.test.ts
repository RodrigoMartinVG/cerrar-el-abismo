import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { carpetaDelIndice } from './cargar.ts';
import { cargarIndice, todosLosCapitulos } from './index.ts';

/**
 * LOS TEMAS RECURRENTES (indice/temas.yaml; hoja de ruta, B5): cada vuelta de un tema dice qué agrega, y el registro
 * está completo: todo capítulo cuyo índice usa una de las claves de un tema figura en él, y todo capítulo del tema la
 * usa.
 */

interface Tema {
  tema: string;
  claves: string;
  vueltas: { capitulo: string; aporta: string }[];
}

const temas = parse(readFileSync(join(carpetaDelIndice(), 'temas.yaml'), 'utf8')) as Tema[];
const capitulos = todosLosCapitulos(cargarIndice());
const texto = (c: (typeof capitulos)[number]) =>
  [c.titulo, ...c.contenidos, c.puente ?? '', ...c.aplicaciones.map((a) => a.texto)].join(' | ');

it('cada tema tiene claves y al menos dos vueltas, cada una con lo que aporta', () => {
  for (const t of temas) {
    expect(t.claves, t.tema).toBeTruthy();
    expect(t.vueltas.length, t.tema).toBeGreaterThanOrEqual(2);
    for (const v of t.vueltas) expect(v.aporta?.trim(), `${t.tema}, ${v.capitulo}`).toBeTruthy();
  }
});

it('el registro de temas está completo y al día con el índice', () => {
  const problemas: string[] = [];
  for (const t of temas) {
    const re = new RegExp(t.claves, 'i');
    const declarados = new Set(t.vueltas.map((v) => v.capitulo));
    for (const c of capitulos) {
      const usa = re.test(texto(c));
      if (usa && !declarados.has(c.id)) problemas.push(`${c.id} habla de «${t.tema}» y no figura en el tema.`);
      if (!usa && declarados.has(c.id)) problemas.push(`${c.id} figura en «${t.tema}», pero su índice no usa las claves.`);
    }
  }
  expect(problemas).toEqual([]);
});

it('los capítulos del Tomo I declaran sus lecturas por función, al menos las de rigor y las de práctica', () => {
  const sinFuncion = capitulos.filter((c) => c.id.startsWith('I.') && typeof c.lecturas === 'string').map((c) => c.id);
  expect(sinFuncion).toEqual([]);
});
