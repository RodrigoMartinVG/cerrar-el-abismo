// Reescribe la sección 13 de la especificación desde los datos de indice/ (decisión 0002): `npm run indice:spec`.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarIndice, carpetaDelIndice, conIndice, validarIndice } from '../src/index.ts';

const indice = cargarIndice();
const problemas = validarIndice(indice);
if (problemas.length > 0) {
  for (const p of problemas) console.error(`✗ [${p.regla}] ${p.mensaje}`);
  console.error('El índice tiene problemas: la especificación no se reescribe.');
  process.exit(1);
}

const archivo = join(carpetaDelIndice(), '..', 'docs', 'especificacion.md');
const antes = readFileSync(archivo, 'utf8');
const despues = conIndice(antes, indice);
if (despues === antes) console.log('La sección 13 ya estaba al día.');
else {
  writeFileSync(archivo, despues);
  console.log('Sección 13 reescrita desde indice/.');
}
