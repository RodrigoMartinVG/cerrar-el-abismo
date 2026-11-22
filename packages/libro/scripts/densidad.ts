/**
 * LA DENSIDAD DE LOS CAPÍTULOS ESCRITOS, frente a sus metas (guía de estilo, sección 6; hoja de ruta, A2).
 *
 *     npm run densidad
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarIndice, carpetaDelIndice, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import { evaluarDensidad, medirDensidad } from '../src/index.ts';

const carpeta = join(carpetaDelIndice(), '..', 'site', 'src', 'content', 'docs', 'capitulos');
const escritos = new Set(readdirSync(carpeta).map((f) => f.replace(/\.md$/, '')));
const capitulos = todosLosCapitulos(cargarIndice()).filter((c) => escritos.has(slug(c.id)));

const marca = (cumple: boolean) => (cumple ? '✓' : '·');
console.log(
  `${'cap.'.padEnd(6)}${'palabras'.padStart(9)}${'desarr.'.padStart(9)}${'def'.padStart(5)}${'res'.padStart(5)}` +
    `   ejemplos/def   contraej.   figuras   ejercicios   extensión`,
);
let cumplen = 0;
for (const c of capitulos) {
  const d = medirDensidad(readFileSync(join(carpeta, `${slug(c.id)}.md`), 'utf8'));
  const metas = evaluarDensidad(d, c.paginas);
  if (metas.every((m) => m.cumple)) cumplen++;
  const celda = (i: number, ancho: number) => `${marca(metas[i]!.cumple)} ${metas[i]!.valor}`.padEnd(ancho);
  console.log(
    `${c.id.padEnd(6)}${String(d.palabras).padStart(9)}${String(d.palabrasDesarrollo).padStart(9)}` +
      `${String(d.definiciones).padStart(5)}${String(d.resultados).padStart(5)}   ` +
      `${celda(0, 15)}${celda(1, 12)}${celda(2, 10)}${celda(3, 13)}${celda(4, 18)}`,
  );
}
console.log(`\n${cumplen} de ${capitulos.length} capítulos cumplen todas las metas.`);
