import { HILOS_FIJOS, ROMANOS, referenciasA, type Indice } from './esquema.ts';
import { capitulosDelItinerario, todosLosCapitulos, tomoDe, tomosRequeridos } from './consultas.ts';

/**
 * LAS REGLAS DEL ÍNDICE (sección 11.5 de la especificación). El esquema dice qué forma tiene un dato; estas reglas
 * dicen si el índice entero es coherente: el grafo de dependencias, la numeración, los hilos y los itinerarios.
 * Devuelve la lista de problemas: vacía, todo está bien.
 */

export interface Problema {
  regla: string;
  mensaje: string;
}

export function validarIndice(indice: Indice): Problema[] {
  const problemas: Problema[] = [];
  const problema = (regla: string, mensaje: string) => problemas.push({ regla, mensaje });
  const capitulos = todosLosCapitulos(indice);
  const porId = new Map(capitulos.map((c) => [c.id, c]));
  const tomosPorId = new Map(indice.tomos.map((t) => [t.id, t]));

  // Los tomos van en orden y cada uno solo requiere tomos anteriores.
  indice.tomos.forEach((t, i) => {
    if (t.id !== ROMANOS[i]) problema('orden-de-tomos', `El tomo en la posición ${i + 1} es ${t.id}; se esperaba ${ROMANOS[i]}.`);
    for (const r of t.requiere)
      if (ROMANOS.indexOf(r) >= ROMANOS.indexOf(t.id))
        problema('requisito-de-tomo', `El Tomo ${t.id} requiere el Tomo ${r}, que no es anterior.`);
    for (const itf of t.interfaces) {
      if (!porId.has(itf)) problema('interfaz', `El Tomo ${t.id} importa ${itf}, que no existe.`);
      else if (tomoDe(itf) === t.id) problema('interfaz', `El Tomo ${t.id} importa por interfaz su propio capítulo ${itf}.`);
    }
  });

  // Numeración contigua dentro de cada tomo, y partes A, B, C… en orden.
  for (const t of indice.tomos) {
    t.partes.forEach((p, i) => {
      const letra = String.fromCharCode(65 + i);
      if (p.letra !== letra) problema('partes', `Tomo ${t.id}: la parte ${i + 1} es la ${p.letra}; se esperaba la ${letra}.`);
    });
    t.partes
      .flatMap((p) => p.capitulos)
      .forEach((c, i) => {
        if (c.id !== `${t.id}.${i + 1}`)
          problema('numeracion', `Tomo ${t.id}: el capítulo ${i + 1} se llama ${c.id}; se esperaba ${t.id}.${i + 1}.`);
      });
  }
  const repetidos = capitulos.filter((c, i) => capitulos.findIndex((d) => d.id === c.id) !== i);
  for (const c of repetidos) problema('numeracion', `El capítulo ${c.id} aparece más de una vez.`);

  // El grafo de dependencias.
  for (const c of capitulos) {
    const t = tomosPorId.get(tomoDe(c.id));
    if (!t) continue;
    const requeridos = tomosRequeridos(indice, t);
    for (const r of c.requiere) {
      const req = porId.get(r);
      if (!req) {
        problema('requisito-inexistente', `${c.id} requiere ${r}, que no existe.`);
        continue;
      }
      const tr = tomoDe(r);
      if (tr === t.id) {
        if (Number(r.split('.')[1]) >= Number(c.id.split('.')[1]))
          problema('requisito-posterior', `${c.id} requiere ${r}, que no es anterior.`);
      } else if (!requeridos.has(tr) && !t.interfaces.includes(r)) {
        problema(
          'requisito-fuera-del-tomo',
          `${c.id} requiere ${r}, pero el Tomo ${t.id} no requiere el Tomo ${tr} ni importa ${r} por interfaz.`,
        );
      }
      if (c.tipo === 'nucleo' && req.tipo === 'complementario')
        problema(
          'nucleo-depende-de-complementario',
          `${c.id} es de núcleo y depende de ${r}, que es complementario (sección 5.3).`,
        );
    }
  }

  // Aplicaciones (sección 9.2): de 2 a 4 por capítulo, de al menos dos campos.
  for (const c of capitulos) {
    const n = c.aplicaciones.length;
    if (n < 2 || n > 4) problema('aplicaciones', `${c.id} tiene ${n} aplicaciones; se esperan de 2 a 4.`);
    if (new Set(c.aplicaciones.map((a) => a.campo)).size < 2)
      problema('aplicaciones', `${c.id} tiene aplicaciones de un solo campo.`);
  }

  // Hilos fijos (sección 9.2): en todos los tomos, y nunca más de un tercio de las aplicaciones de un tomo.
  for (const t of indice.tomos) {
    const apps = t.partes.flatMap((p) => p.capitulos.flatMap((c) => c.aplicaciones));
    for (const hilo of HILOS_FIJOS) {
      const k = apps.filter((a) => a.campo === hilo).length;
      if (k === 0) problema('hilos', `El Tomo ${t.id} no tiene aplicaciones del hilo ${hilo}.`);
      if (3 * k > apps.length)
        problema('hilos', `El hilo ${hilo} ocupa ${k} de ${apps.length} aplicaciones del Tomo ${t.id}: más de un tercio.`);
    }
  }

  // Referencias en el texto: todo capítulo que se nombra existe.
  for (const c of capitulos) {
    const texto = [...c.contenidos, c.puente, ...c.aplicaciones.map((a) => a.texto), c.lecturas].join(' ');
    for (const r of texto.match(referenciasA()) ?? [])
      if (!porId.has(r)) problema('referencia', `${c.id} nombra ${r}, que no existe.`);
  }

  // Itinerarios (sección 9.6): sus capítulos existen, no repiten el núcleo, y están cerrados bajo dependencias.
  for (const it of indice.itinerarios) {
    for (const id of it.capitulos) {
      const c = porId.get(id);
      if (!c) problema('itinerario', `El itinerario ${it.nombre} incluye ${id}, que no existe.`);
      else if (c.tipo === 'nucleo') problema('itinerario', `El itinerario ${it.nombre} incluye ${id}, que ya es de núcleo.`);
    }
    for (const tm of it.tomos)
      if (!tomosPorId.has(tm)) problema('itinerario', `El itinerario ${it.nombre} incluye el Tomo ${tm}, que no existe.`);
    const dentro = new Set(capitulosDelItinerario(indice, it).map((c) => c.id));
    for (const id of dentro)
      for (const r of porId.get(id)?.requiere ?? [])
        if (!dentro.has(r)) problema('itinerario-cerrado', `El itinerario ${it.nombre} incluye ${id} pero no su requisito ${r}.`);
  }

  return problemas;
}
