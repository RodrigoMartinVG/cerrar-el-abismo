/**
 * EL REGISTRO DE REVISIÓN DESDE LA TERMINAL (decisión 0005).
 *
 *     npm run revision
 *         Cómo va la revisión de cada capítulo escrito.
 *     npm run revision -- I.9
 *         La revisión de I.9, resultado por resultado y aspecto por aspecto, con sus dos pasadas.
 *     npm run revision -- I.9 teo-lagrange --por "Nombre Apellido" --contra "Dummit y Foote, sección 3.2, teorema 8"
 *         Registra una revisión de un resultado, con la huella de su texto actual, o de un aspecto (estilo, practica,
 *         calculos, ejercicios, historia). Opciones: --pasada segunda (por defecto, primera), --notas "…" y
 *         --fecha AAAA-MM-DD (por defecto, hoy).
 *
 * Solo registra quien revisó, o una sesión a pedido suyo y con sus datos: una revisión la firma una persona.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { format, resolveConfig } from 'prettier';
import { parse, parseDocument } from 'yaml';
import { cargarIndice, carpetaDelIndice, slug, todosLosCapitulos } from '@cerrar-el-abismo/indice';
import {
  ASPECTOS,
  avanceDeRevision,
  etiquetasDelCapitulo,
  PASADAS,
  resultadosDelCapitulo,
  revisarRegistro,
  type EntradaDeRevision,
  type Estado,
  type Pasada,
} from '../src/index.ts';

const raiz = join(carpetaDelIndice(), '..');
const carpetaDeCapitulos = join(raiz, 'site', 'src', 'content', 'docs', 'capitulos');
const carpetaDeRevision = join(raiz, 'revision');

function salir(mensaje: string): never {
  console.error(mensaje);
  process.exit(1);
}

function capitulo(id: string) {
  const archivo = join(carpetaDeCapitulos, `${slug(id)}.md`);
  if (!existsSync(archivo)) salir(`${id} no está escrito: no existe ${archivo}.`);
  const texto = readFileSync(archivo, 'utf8');
  const datos = parse(/^---\n([\s\S]*?)\n---\n/.exec(texto)?.[1] ?? '') as { estado?: Estado };
  const rutaDelRegistro = join(carpetaDeRevision, `${slug(id)}.yaml`);
  const registro: unknown = existsSync(rutaDelRegistro) ? parse(readFileSync(rutaDelRegistro, 'utf8')) : undefined;
  return { texto, estado: datos.estado ?? 'borrador', rutaDelRegistro, registro };
}

const fraccion = (a: number, b: number) => `${a} de ${b}`;

const { values: opciones, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    por: { type: 'string' },
    contra: { type: 'string' },
    pasada: { type: 'string', default: 'primera' },
    notas: { type: 'string' },
    fecha: { type: 'string' },
  },
});
const [id, clave] = positionals;

if (!id) {
  // El resumen de todos los capítulos escritos, en orden de lectura.
  const escritos = new Set(readdirSync(carpetaDeCapitulos).map((f) => f.replace(/\.md$/, '')));
  for (const c of todosLosCapitulos(cargarIndice()).filter((x) => escritos.has(slug(x.id)))) {
    const { texto, estado, registro } = capitulo(c.id);
    const a = avanceDeRevision(registro, texto);
    console.log(
      `${c.id.padEnd(6)} ${estado.padEnd(10)} primera pasada: ${fraccion(a.primera, a.resultados).padEnd(9)} ` +
        `segunda: ${fraccion(a.segunda, a.resultados).padEnd(9)} aspectos: ${fraccion(a.aspectos, 5)}`,
    );
  }
} else if (!clave) {
  // La revisión de un capítulo, en detalle.
  const { texto, estado, registro } = capitulo(id);
  const a = avanceDeRevision(registro, texto);
  const nombres = etiquetasDelCapitulo(texto, id);
  console.log(
    `${id} · ${estado} · primera pasada: ${fraccion(a.primera, a.resultados)} resultados · ` +
      `segunda: ${fraccion(a.segunda, a.resultados)} · aspectos: ${fraccion(a.aspectos, 5)}\n`,
  );
  for (const [ancla, p] of a.porResultado)
    console.log(
      `  ${(nombres.get(ancla) ?? '').padEnd(18)} ${ancla.padEnd(26)} primera: ${p.primera.padEnd(15)} segunda: ${p.segunda}`,
    );
  console.log();
  for (const [aspecto, p] of a.porAspecto)
    console.log(`  ${aspecto.padEnd(45)} primera: ${p.primera.padEnd(15)} segunda: ${p.segunda}`);
  const problemas = revisarRegistro(registro, texto, estado);
  if (problemas.length > 0) console.log(`\nProblemas del registro:\n${problemas.map((x) => `  - ${x}`).join('\n')}`);
} else {
  // Registrar una revisión.
  const { texto, estado, rutaDelRegistro, registro } = capitulo(id);
  const resultado = resultadosDelCapitulo(texto).find((r) => r.ancla === clave);
  if (!resultado && !(clave in ASPECTOS))
    salir(
      `«${clave}» no es el ancla de un resultado de ${id} ni un aspecto (${Object.keys(ASPECTOS).join(', ')}).\n` +
        'Con «npm run revision -- ' +
        id +
        '» se ven las anclas.',
    );
  if (!opciones.por || !opciones.contra)
    salir('Faltan --por (quién revisó) y --contra (con qué se contrastó: libro y número de teorema o página).');
  if (!PASADAS.includes(opciones.pasada as Pasada)) salir('--pasada es «primera» o «segunda».');
  const hoy = new Date();
  const fecha =
    opciones.fecha ??
    `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const entrada: EntradaDeRevision = {
    pasada: opciones.pasada as Pasada,
    por: opciones.por,
    fecha,
    contra: opciones.contra,
    ...(resultado ? { huella: resultado.huella } : {}),
    ...(opciones.notas ? { notas: opciones.notas } : {}),
  };
  const parte = resultado ? 'resultados' : 'aspectos';

  const documento = existsSync(rutaDelRegistro)
    ? parseDocument(readFileSync(rutaDelRegistro, 'utf8'))
    : parseDocument(`# El registro de revisión de ${id} (decisión 0005). Se escribe con «npm run revision».\n`);
  if (documento.hasIn([parte, clave])) documento.addIn([parte, clave], entrada);
  else documento.setIn([parte, clave], [entrada]);

  // Nada se escribe si la entrada nueva agrega problemas: una firma que no es de una persona, una segunda pasada de
  // quien hizo la primera.
  const antes = new Set(revisarRegistro(registro, texto, 'borrador'));
  const nuevos = revisarRegistro(documento.toJS(), texto, 'borrador').filter((x) => !antes.has(x));
  if (nuevos.length > 0) salir(`No se registra:\n${nuevos.map((x) => `  - ${x}`).join('\n')}`);

  const yaml = await format(documento.toString({ lineWidth: 0 }), {
    ...(await resolveConfig(rutaDelRegistro)),
    filepath: rutaDelRegistro,
  });
  mkdirSync(carpetaDeRevision, { recursive: true });
  writeFileSync(rutaDelRegistro, yaml);
  const de = resultado ? `de ${etiquetasDelCapitulo(texto, id).get(clave)} (${clave})` : `del aspecto «${clave}»`;
  console.log(`Registrada la ${entrada.pasada} pasada ${de}, por ${entrada.por}, el ${fecha}, contra ${entrada.contra}.`);
  const pendientes = revisarRegistro(documento.toJS(), texto, estado);
  if (pendientes.length > 0)
    console.log(`Para el estado «${estado}» todavía falta:\n${pendientes.map((x) => `  - ${x}`).join('\n')}`);
}
