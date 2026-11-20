import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { itinerarios, tomo, type Indice } from './esquema.ts';

/**
 * Busca la carpeta `indice/` subiendo desde `desde`. Se corre desde la raíz (pruebas, scripts) y desde `site/`
 * (Astro), y una vez empaquetado el código ya no sabe dónde estaba su archivo: la carpeta de trabajo sí.
 */
export function carpetaDelIndice(desde: string = process.cwd()): string {
  for (let dir = resolve(desde); ; dir = dirname(dir)) {
    const candidata = join(dir, 'indice');
    if (existsSync(join(candidata, 'itinerarios.yaml'))) return candidata;
    if (dirname(dir) === dir) throw new Error(`No encuentro la carpeta indice/ desde ${desde}.`);
  }
}

function leer<T>(archivo: string, esquema: z.ZodType<T>): T {
  const resultado = esquema.safeParse(parse(readFileSync(archivo, 'utf8')));
  if (!resultado.success) throw new Error(`${archivo} no cumple el esquema del índice:\n${z.prettifyError(resultado.error)}`);
  return resultado.data;
}

/** Lee y valida contra el esquema los tomos (`tomo-NN.yaml`, en orden) y los itinerarios. */
export function cargarIndice(carpeta: string = carpetaDelIndice()): Indice {
  const archivos = readdirSync(carpeta)
    .filter((f) => /^tomo-\d{2}\.yaml$/.test(f))
    .sort();
  return {
    tomos: archivos.map((f) => leer(join(carpeta, f), tomo)),
    itinerarios: leer(join(carpeta, 'itinerarios.yaml'), itinerarios),
  };
}
