import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPyodide } from 'pyodide';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { carpetaDelIndice, cargarIndice, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import { revisarEstilo } from '@cerrar-el-abismo/libro';

/**
 * LOS CAPÍTULOS ESCRITOS (sección 11.5): cada uno está en el índice con su título, sigue la plantilla de la
 * sección 7 y las reglas mecánicas de la guía de estilo, y todas sus celdas de Python se ejecutan, con el mismo Pyodide
 * que usa el navegador.
 */

const carpeta = join(carpetaDelIndice(), '..', 'site', 'src', 'content', 'docs', 'capitulos');
const archivos = readdirSync(carpeta).filter((f) => f.endsWith('.md'));
const indice = new Map(todosLosCapitulos(cargarIndice()).map((c) => [c.id, c]));
const PLANTILLA = [
  'Entrada',
  'Motivación',
  'Desarrollo',
  'Cálculo',
  'Puente',
  'Aplicaciones',
  'Salida',
  'Ejercicios',
  'Notas y «Para seguir»',
];

function leer(archivo: string) {
  const texto = readFileSync(join(carpeta, archivo), 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n/.exec(texto);
  if (!m) throw new Error(`${archivo} no tiene frontmatter.`);
  return { datos: parse(m[1]!) as { title: string; capitulo: string }, cuerpo: texto.slice(m[0].length) };
}

describe.each(archivos)('el capítulo %s', (archivo) => {
  const { datos, cuerpo } = leer(archivo);

  it('está en el índice, con su título y con el nombre de archivo de su identificador', () => {
    const c = indice.get(datos.capitulo);
    expect(c, `«capitulo: ${datos.capitulo}» no está en el índice`).toBeDefined();
    expect(archivo).toBe(`${slug(datos.capitulo)}.md`);
    expect(datos.title).toBe(`${c!.id} ${c!.titulo}`);
  });

  it('tiene las secciones de la plantilla, en orden (sección 7)', () => {
    expect([...cuerpo.matchAll(/^## (.+)$/gm)].map((m) => m[1])).toEqual(PLANTILLA);
  });

  it('cumple las reglas mecánicas de la guía de estilo', () => {
    const texto = readFileSync(join(carpeta, archivo), 'utf8');
    expect(revisarEstilo(texto).map((p) => `línea ${p.linea}: ${p.mensaje}`)).toEqual([]);
  });

  it('tiene el recuadro del Puente', () => {
    expect(cuerpo).toMatch(/^:::puente$/m);
  });

  it('ejecuta todas sus celdas de Python sin errores', { timeout: 300_000 }, async () => {
    const celdas = [...cuerpo.matchAll(/^```python celda\n([\s\S]*?)^```$/gm)].map((m) => m[1]!);
    const py = await loadPyodide();
    for (const celda of celdas) {
      await py.loadPackagesFromImports(celda, { messageCallback: () => {} });
      await py.runPythonAsync(celda);
    }
  });
});
