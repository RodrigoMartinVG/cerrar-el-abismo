/**
 * LA DENSIDAD Y EL EQUILIBRIO DE LOS CAPÍTULOS ESCRITOS, frente a sus metas (guía de estilo, sección 6).
 *
 *     npm run densidad
 *
 * Una línea por capítulo, con ✓ para cada meta que cumple y · para la que no; debajo, las que no cumple, con su valor.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarIndice, carpetaDelIndice, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import { evaluarDensidad, medirDensidad } from '../src/index.ts';

const carpeta = join(carpetaDelIndice(), '..', 'site', 'src', 'content', 'docs', 'capitulos');
const escritos = new Set(readdirSync(carpeta).map((f) => f.replace(/\.md$/, '')));
const capitulos = todosLosCapitulos(cargarIndice()).filter((c) => escritos.has(slug(c.id)));

const CORTOS = ['ej/def', 'racha', 'largo', 'contra', 'fig', 'ejerc', 'mezcla', 'niveles', 'extensión'];
console.log(`${'cap.'.padEnd(6)}${'págs.'.padEnd(9)}${CORTOS.map((c) => c.padEnd(10)).join('')}`);
let cumplen = 0;
const pendientes: string[] = [];
for (const c of capitulos) {
  const d = medirDensidad(readFileSync(join(carpeta, `${slug(c.id)}.md`), 'utf8'));
  const metas = evaluarDensidad(d, c.paginas);
  if (metas.every((m) => m.cumple)) cumplen++;
  console.log(
    `${c.id.padEnd(6)}${`${d.paginasEstimadas}/${c.paginas}`.padEnd(9)}${metas.map((m) => (m.cumple ? '✓' : '·').padEnd(10)).join('')}`,
  );
  for (const m of metas.filter((x) => !x.cumple)) pendientes.push(`  ${c.id.padEnd(5)} ${m.nombre}: ${m.valor}`);
}
console.log(`\n${cumplen} de ${capitulos.length} capítulos cumplen todas las metas.`);
if (pendientes.length) console.log(`\nLo que falta:\n${pendientes.join('\n')}`);
