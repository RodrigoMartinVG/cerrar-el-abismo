import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPyodide } from 'pyodide';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { CAMPOS, carpetaDelIndice, cargarIndice, Grafo, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import { claveDeTermino, etiquetasDelCapitulo, revisarDiccionario, revisarEstilo, revisarSupone } from '@cerrar-el-abismo/libro';

/**
 * LOS CAPÍTULOS ESCRITOS (sección 11.5): cada uno está en el índice con su título, sigue la plantilla de la
 * sección 7 y las reglas mecánicas de la guía de estilo, declara bien lo que da por conocido, agrega sus términos al
 * diccionario (decisión 0004), y todas sus celdas de Python se ejecutan, con el mismo Pyodide que usa el navegador.
 */

const carpeta = join(carpetaDelIndice(), '..', 'site', 'src', 'content', 'docs', 'capitulos');
const archivos = readdirSync(carpeta).filter((f) => f.endsWith('.md'));
const indice = new Map(todosLosCapitulos(cargarIndice()).map((c) => [c.id, c]));
const ORDEN_DE_LECTURA = [...indice.keys()];
const GRAFO = new Grafo(cargarIndice());
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
  return {
    datos: parse(m[1]!) as { title: string; capitulo: string; supone?: unknown; diccionario?: unknown },
    texto,
    cuerpo: texto.slice(m[0].length),
  };
}

/** Las etiquetas de cada capítulo escrito, para comprobar las referencias de uno a otro (`:ref[I.1#teo-de-morgan]`). */
const ETIQUETAS = new Map(
  archivos.map((archivo) => {
    const { datos, texto } = leer(archivo);
    return [datos.capitulo, etiquetasDelCapitulo(texto, datos.capitulo)];
  }),
);

describe.each(archivos)('el capítulo %s', (archivo) => {
  const { datos, texto, cuerpo } = leer(archivo);

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
    expect(revisarEstilo(texto).map((p) => `línea ${p.linea}: ${p.mensaje}`)).toEqual([]);
  });

  it('declara bien lo que da por conocido: cada noción se trata con rigor en un capítulo posterior', () => {
    expect(revisarSupone(datos.supone, datos.capitulo, ORDEN_DE_LECTURA)).toEqual([]);
  });

  it('agrega sus términos al diccionario academia–práctica, completos y con anclas que existen', () => {
    expect(revisarDiccionario(datos.diccionario, texto, Object.keys(CAMPOS))).toEqual([]);
  });

  it('cita entornos de otros capítulos escritos que existen', () => {
    const rotas = [...cuerpo.matchAll(/:ref\[([^\]#]+)#([^\]]+)\]/g)]
      .filter(([, otro, id]) => !ETIQUETAS.get(otro!)?.has(id!))
      .map(([ref]) => ref);
    expect(rotas).toEqual([]);
  });

  it('solo cita resultados de capítulos de su recorrido: los que requiere, directa o indirectamente', () => {
    const fuera = [...cuerpo.matchAll(/:ref\[([^\]#]+)#[^\]]+\]/g)]
      .filter(([, otro]) => otro !== datos.capitulo && !GRAFO.depende(datos.capitulo, otro!))
      .map(([ref]) => ref);
    expect(fuera, 'un resultado de otro capítulo solo se usa si ese capítulo es un requisito').toEqual([]);
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

it('ningún término del diccionario se define en dos capítulos', () => {
  const donde = new Map<string, string[]>();
  for (const archivo of archivos) {
    const { datos } = leer(archivo);
    for (const { termino } of (datos.diccionario ?? []) as { termino: string }[]) {
      const clave = claveDeTermino(termino);
      donde.set(clave, [...(donde.get(clave) ?? []), datos.capitulo]);
    }
  }
  expect([...donde].filter(([, capitulos]) => capitulos.length > 1)).toEqual([]);
});
