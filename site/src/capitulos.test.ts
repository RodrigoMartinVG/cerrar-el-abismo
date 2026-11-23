import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPyodide } from 'pyodide';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { CAMPOS, carpetaDelIndice, cargarIndice, Grafo, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import {
  claveDeTermino,
  coincide,
  ejerciciosDelCapitulo,
  etiquetasDelCapitulo,
  evaluarDensidad,
  medirDensidad,
  leerNumero,
  revisarEjercicios,
  revisarCumple,
  revisarDiccionario,
  revisarEstilo,
  revisarRegistro,
  revisarSupone,
  type Estado,
  type Promesa,
} from '@cerrar-el-abismo/libro';

/**
 * LOS CAPÍTULOS ESCRITOS (sección 11.5): cada uno está en el índice con su título, sigue la plantilla de la
 * sección 7 y las reglas mecánicas de la guía de estilo, declara bien lo que da por conocido, agrega sus términos al
 * diccionario (decisión 0004), tiene el registro de revisión que su estado exige (decisión 0005), y todas sus celdas
 * de Python se ejecutan, con el mismo Pyodide que usa el navegador.
 */

const carpeta = join(carpetaDelIndice(), '..', 'site', 'src', 'content', 'docs', 'capitulos');
const archivos = readdirSync(carpeta).filter((f) => f.endsWith('.md'));
/** Los registros de revisión, uno por capítulo, con el mismo nombre de archivo: «revision/i-9.yaml». */
const carpetaDeRevision = join(carpetaDelIndice(), '..', 'revision');
const indice = new Map(todosLosCapitulos(cargarIndice()).map((c) => [c.id, c]));
const ORDEN_DE_LECTURA = [...indice.keys()];
const GRAFO = new Grafo(cargarIndice());
/**
 * Las licencias con las que un fragmento ajeno puede entrar en la Entrada de un capítulo: las compatibles con la de la
 * obra (CC BY-NC-SA para el texto, MIT para el código).
 */
const LICENCIAS_COMPATIBLES = ['dominio público', 'CC0', 'MIT', 'BSD', 'Apache-2.0', 'CC BY 4.0', 'CC BY-SA 4.0'];
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
    datos: parse(m[1]!) as {
      title: string;
      capitulo: string;
      estado?: Estado;
      supone?: unknown;
      diccionario?: unknown;
      cumple?: unknown;
      fuente?: 'propia' | { de: string; url?: string; licencia: string };
    },
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

/** Las promesas: lo que cada capítulo escrito deja para otro en su campo `supone`. */
const PROMESAS = new Map<string, Promesa[]>();
for (const archivo of archivos) {
  const { datos } = leer(archivo);
  for (const { nocion, en } of (datos.supone ?? []) as { nocion: string; en: string }[])
    PROMESAS.set(en, [...(PROMESAS.get(en) ?? []), { de: datos.capitulo, nocion }]);
}

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

  it('cumple lo que los capítulos anteriores dejaron para él, en entornos que existen (el mapa hacia atrás)', () => {
    expect(revisarCumple(datos.cumple, texto, PROMESAS.get(datos.capitulo) ?? [])).toEqual([]);
  });

  it('tiene el registro de revisión que su estado exige, al día con su texto (decisión 0005)', () => {
    const registro = join(carpetaDeRevision, archivo.replace(/\.md$/, '.yaml'));
    const datosDelRegistro: unknown = existsSync(registro) ? parse(readFileSync(registro, 'utf8')) : undefined;
    expect(revisarRegistro(datosDelRegistro, texto, datos.estado ?? 'borrador')).toEqual([]);
  });

  it('explica la Entrada en la Salida sin licencias: ninguna de las dos menciona capítulos fuera de su recorrido', () => {
    const fuera = ['Entrada', 'Salida'].flatMap((seccion) => {
      const texto = new RegExp(`^## ${seccion}\\n([\\s\\S]*?)(?=^## )`, 'm').exec(cuerpo)?.[1] ?? '';
      return [...texto.matchAll(/\[\[([^\][]+)\]\]|:ref\[([^\]#]+)#/g)]
        .map((m) => (m[1] ?? m[2])!)
        .filter((otro) => otro !== datos.capitulo && !GRAFO.depende(datos.capitulo, otro))
        .map((otro) => `${seccion}: ${otro}`);
    });
    expect(fuera, 'la Entrada y la Salida solo usan el recorrido (especificación, 8.1)').toEqual([]);
  });

  it('sus ejercicios dicen dificultad, tipo y sección; los de cálculo, su respuesta; los impares tienen solución (decisión 0006)', () => {
    expect(revisarEjercicios(texto)).toEqual([]);
  });

  it('dice de dónde sale el fragmento de la Entrada, con una licencia compatible con la de la obra (especificación, 8.1)', () => {
    const { fuente } = datos;
    expect(fuente, 'falta el campo «fuente»: «propia» o la fuente con su licencia').toBeDefined();
    if (fuente === 'propia') {
      const entrada = /^## Entrada\n([\s\S]*?)(?=^## )/m.exec(cuerpo)?.[1] ?? '';
      expect(entrada, 'si el fragmento es propio, la Entrada lo dice').toMatch(
        /\bpropi[oa]\b|escrit[oa] para (esta obra|este capítulo)/,
      );
    } else {
      expect(LICENCIAS_COMPATIBLES).toContain(fuente!.licencia);
    }
  });

  it('cumple las metas de equilibrio: extensión, ejemplos, contraejemplos, ejercicios y figuras (guía de estilo, 6)', () => {
    const c = indice.get(datos.capitulo)!;
    const fallan = evaluarDensidad(medirDensidad(texto), c.paginas)
      .filter((m) => !m.cumple)
      .map((m) => `${m.nombre}: ${m.valor}`);
    expect(fallan).toEqual([]);
  });

  it('tiene el recuadro del Puente', () => {
    expect(cuerpo).toMatch(/^:::puente$/m);
  });

  it(
    'ejecuta cada una de sus celdas de Python sola y sin errores, con la salida que el texto escribe',
    { timeout: 300_000 },
    async () => {
      // Cada celda, con la salida esperada que puede seguirla en un bloque «```text salida».
      const celdas = [...cuerpo.matchAll(/^```python celda\n([\s\S]*?)^```\n(?:\n```text salida\n([\s\S]*?)^```\n)?/gm)].map(
        (m) => ({ codigo: m[1]!, esperada: m[2] }),
      );
      const py = await loadPyodide();
      for (const [i, { codigo: celda, esperada }] of celdas.entries()) {
        await py.loadPackagesFromImports(celda, { messageCallback: () => {} });
        // Un espacio de nombres nuevo para cada celda: ninguna puede usar lo que define otra (guía de capítulos).
        const globales = py.globals.get('dict')();
        let impreso = '';
        py.setStdout({ batched: (s: string) => (impreso += `${s}\n`) });
        try {
          await py.runPythonAsync(celda, { globals: globales });
        } catch (error) {
          throw new Error(`La celda ${i + 1} falla ejecutada sola: ${String(error).split('\n').slice(-2).join(' ')}`, {
            cause: error,
          });
        } finally {
          globales.destroy();
        }
        if (esperada !== undefined) {
          const limpiar = (t: string) => t.replace(/[ \t]+$/gm, '').trimEnd();
          expect(limpiar(impreso), `la celda ${i + 1} no imprime la salida que el texto escribe`).toBe(limpiar(esperada));
        }
      }
      // La respuesta de cada ejercicio de cálculo que trae su comprobación, evaluada en Python (decisión 0006).
      for (const { numero, atributos } of ejerciciosDelCapitulo(texto)) {
        if (!atributos['comprobacion'] || !atributos['respuesta']) continue;
        const globales = py.globals.get('dict')();
        try {
          await py.runPythonAsync('import math\nfrom fractions import Fraction', { globals: globales });
          const valor = String(await py.runPythonAsync(`str(${atributos['comprobacion']})`, { globals: globales }));
          const tolerancia = Number(atributos['tolerancia'] ?? '1e-6');
          expect(
            coincide(leerNumero(valor)!, leerNumero(atributos['respuesta'])!, tolerancia),
            `el ejercicio ${numero} dice que la respuesta es ${atributos['respuesta']}, y su comprobación da ${valor}`,
          ).toBe(true);
        } finally {
          globales.destroy();
        }
      }
    },
  );
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

it('cada tomo escrito entero tiene al menos tres proyectos, y cada uno combina capítulos (guía de estilo, sección 6)', () => {
  const escritos = new Map(archivos.map((archivo) => [leer(archivo).datos.capitulo, archivo]));
  const tomoDe = (id: string) => id.split('.')[0]!;
  for (const tomo of new Set([...indice.keys()].map(tomoDe))) {
    const capitulos = [...indice.keys()].filter((id) => tomoDe(id) === tomo);
    if (!capitulos.every((id) => escritos.has(id))) continue;
    const proyectos = capitulos.flatMap((id) =>
      ejerciciosDelCapitulo(leer(escritos.get(id)!).texto)
        .filter((e) => e.atributos['tipo'] === 'proyecto')
        .map((e) => ({ id, otros: new Set(e.enunciado.match(/\b[IVX]+\.\d+\b/g)?.filter((c) => c !== id)) })),
    );
    expect(
      proyectos.filter((p) => p.otros.size === 0).map((p) => p.id),
      `proyectos del Tomo ${tomo} sin otros capítulos`,
    ).toEqual([]);
    expect(proyectos.length, `proyectos del Tomo ${tomo}`).toBeGreaterThanOrEqual(3);
  }
});

it('cada registro de revisión corresponde a un capítulo escrito', () => {
  const registros = existsSync(carpetaDeRevision) ? readdirSync(carpetaDeRevision).filter((f) => f !== 'README.md') : [];
  expect(registros.filter((f) => !archivos.includes(f.replace(/\.yaml$/, '.md')))).toEqual([]);
});
