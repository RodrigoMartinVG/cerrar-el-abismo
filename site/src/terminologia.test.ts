import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { carpetaDelIndice } from '@cerrar-el-abismo/indice';
import { revisarRegistroDeTerminologia, usosRechazados, type Termino } from '@cerrar-el-abismo/libro';

/**
 * LA TERMINOLOGÍA DE LA OBRA (guía de estilo, sección 7): el registro de `ortografia/terminologia.yaml` está bien
 * escrito, y sus formas rechazadas no se usan en los capítulos, el índice ni la especificación. Nombrarlas entre
 * comillas latinas, en el código o en una fórmula no es usarlas.
 */

const raiz = join(carpetaDelIndice(), '..');
const datos: unknown = parse(readFileSync(join(raiz, 'ortografia', 'terminologia.yaml'), 'utf8'));
const capitulos = join(raiz, 'site', 'src', 'content', 'docs', 'capitulos');
const ARCHIVOS = [
  ...readdirSync(capitulos)
    .filter((f) => f.endsWith('.md'))
    .map((f) => join(capitulos, f)),
  ...readdirSync(carpetaDelIndice())
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => join(carpetaDelIndice(), f)),
  join(raiz, 'docs', 'especificacion.md'),
];

it('el registro de terminología está bien escrito', () => {
  expect(revisarRegistroDeTerminologia(datos)).toEqual([]);
});

it('la obra no usa las formas que el registro rechaza', () => {
  const registro = datos as Termino[];
  const usos = ARCHIVOS.flatMap((archivo) =>
    usosRechazados(readFileSync(archivo, 'utf8'), registro).map(
      ({ forma, termino, linea }) => `${archivo.slice(raiz.length + 1)}:${linea}: «${forma}»; la obra dice «${termino}»`,
    ),
  );
  expect(usos).toEqual([]);
});
