/**
 * LA DENSIDAD Y EL EQUILIBRIO DE LOS CAPÍTULOS ESCRITOS, frente a sus metas (guía de estilo, sección 6).
 *
 *     npm run densidad
 *
 * Una línea por capítulo, con ✓ para cada meta que cumple y · para la que no; debajo, las que no cumple, con su valor,
 * y lo que ocupa cada parte de la plantilla frente al peso que le da la especificación (sección 7).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarIndice, carpetaDelIndice, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import { evaluarDensidad, medirDensidad } from '../src/index.ts';

const carpeta = join(carpetaDelIndice(), '..', 'site', 'src', 'content', 'docs', 'capitulos');
const escritos = new Set(readdirSync(carpeta).map((f) => f.replace(/\.md$/, '')));
const capitulos = todosLosCapitulos(cargarIndice()).filter((c) => escritos.has(slug(c.id)));

const CORTOS = ['ej/def', 'racha', 'largo', 'contra', 'fig', 'ejerc', 'mezcla', 'niveles', 'aplic', 'extensión'];
console.log(`${'cap.'.padEnd(6)}${'págs.'.padEnd(9)}${'des.  apl.  '}${CORTOS.map((c) => c.padEnd(10)).join('')}`);
const porciento = (x: number | undefined) => `${Math.round(100 * (x ?? 0))}%`.padEnd(6);
let cumplen = 0;
const pendientes: string[] = [];
/** Las partes de la plantilla con peso propio, y ese peso (especificación, sección 7). */
const PESOS: [string, string, number][] = [
  ['Desarrollo', 'des.', 0.45],
  ['Cálculo', 'cál.', 0.1],
  ['Puente', 'pue.', 0.1],
  ['Aplicaciones', 'apl.', 0.2],
  ['Ejercicios', 'ejer.', 0.15],
];
const proporciones: string[] = [];
for (const c of capitulos) {
  const d = medirDensidad(readFileSync(join(carpeta, `${slug(c.id)}.md`), 'utf8'));
  proporciones.push(`${c.id.padEnd(11)}${PESOS.map(([seccion]) => porciento(d.proporciones[seccion])).join('')}`);
  const metas = evaluarDensidad(d, c.paginas);
  if (metas.every((m) => m.cumple)) cumplen++;
  console.log(
    `${c.id.padEnd(6)}${`${d.paginasEstimadas}/${c.paginas}`.padEnd(9)}${porciento(d.proporciones['Desarrollo'])}${porciento(d.proporciones['Aplicaciones'])}${metas.map((m) => (m.cumple ? '✓' : '·').padEnd(10)).join('')}`,
  );
  for (const m of metas.filter((x) => !x.cumple)) pendientes.push(`  ${c.id.padEnd(5)} ${m.nombre}: ${m.valor}`);
}
console.log(`\n${cumplen} de ${capitulos.length} capítulos cumplen todas las metas.`);
console.log(`\nLo que ocupa cada parte de la plantilla:\n${''.padEnd(11)}${PESOS.map(([, corto]) => corto.padEnd(6)).join('')}`);
console.log(`${'plantilla'.padEnd(11)}${PESOS.map(([, , peso]) => porciento(peso)).join('')}`);
console.log(proporciones.join('\n'));
if (pendientes.length) console.log(`\nLo que falta:\n${pendientes.join('\n')}`);
