/**
 * EL PDF DE UN TOMO (especificación, 11.7; decisión 0007): escribe `pdf/tomo-i.tex` con los capítulos escritos del
 * tomo, en orden de lectura, convertidos a LaTeX. Se compila con LuaLaTeX, dos veces para el índice:
 *
 *     npm run pdf
 *     cd pdf && lualatex tomo-i.tex && lualatex tomo-i.tex
 *
 * El trabajo «PDF» de la integración continua hace las dos cosas y guarda el resultado.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarIndice, carpetaDelIndice, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import { capituloALatex, etiquetasDelCapitulo, preambulo } from '../src/index.ts';

const raiz = join(carpetaDelIndice(), '..');
const carpeta = join(raiz, 'site', 'src', 'content', 'docs', 'capitulos');
const escritos = new Set(readdirSync(carpeta).map((f) => f.replace(/\.md$/, '')));
const obra = cargarIndice();
const tomo = obra.tomos[0]!;
const capitulos = todosLosCapitulos({ ...obra, tomos: [tomo] }).filter((c) => escritos.has(slug(c.id)));
const textos = new Map(capitulos.map((c) => [c.id, readFileSync(join(carpeta, `${slug(c.id)}.md`), 'utf8')]));
const etiquetas = new Map([...textos].map(([id, texto]) => [id, etiquetasDelCapitulo(texto, id)]));
const sitio = 'https://rodrigomartinvg.github.io/cerrar-el-abismo/';

const cuerpo = capitulos.map((c) => capituloALatex(textos.get(c.id)!, { etiquetas, sitio })).join('\n\\clearpage\n');
const documento = `${preambulo(`Tomo ${tomo.id}. ${tomo.titulo}`)}
\\begin{document}
\\maketitle
\\tableofcontents
${cuerpo}
\\end{document}
`;
const salida = join(raiz, 'pdf');
if (!existsSync(salida)) mkdirSync(salida);
writeFileSync(join(salida, 'tomo-i.tex'), documento);
console.log(`pdf/tomo-i.tex: ${capitulos.length} capítulos, ${documento.length} caracteres.`);
