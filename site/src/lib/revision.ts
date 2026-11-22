import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { carpetaDelIndice, slug } from '@cerrar-el-abismo/indice';
import {
  ASPECTOS,
  avanceDeRevision,
  resultadosDelCapitulo,
  type AvanceDeRevision,
  type EntradaDeRevision,
} from '@cerrar-el-abismo/libro';

/**
 * LA REVISIÓN DE CADA CAPÍTULO (decisión 0005), para mostrarla junto a su estado y en la página /revision/. El
 * registro vive en revision/, en la raíz del repositorio; las pruebas comprueban que sea válido y que alcance para el
 * estado del capítulo (site/src/capitulos.test.ts).
 */
/** Cómo se muestra cada estado de un capítulo. */
export const NOMBRES_DE_ESTADOS: Readonly<Record<string, string>> = {
  borrador: 'Borrador',
  revision: 'En revisión',
  terminado: 'Terminado',
};

function registroDe(id: string): unknown {
  const archivo = join(carpetaDelIndice(), '..', 'revision', `${slug(id)}.yaml`);
  return existsSync(archivo) ? parse(readFileSync(archivo, 'utf8')) : undefined;
}

export function avanceDe(id: string, cuerpo: string): AvanceDeRevision {
  return avanceDeRevision(registroDe(id), cuerpo);
}

export interface RevisionVigente extends EntradaDeRevision {
  /** El ancla del resultado o el nombre del aspecto. */
  clave: string;
  aspecto: boolean;
}

/**
 * Las revisiones registradas que siguen contando: las de los aspectos y las de los resultados cuyo texto no cambió
 * desde entonces. Las desactualizadas quedan en el registro como historia, pero no se muestran.
 */
export function revisionesVigentes(id: string, cuerpo: string): RevisionVigente[] {
  const registro = (registroDe(id) ?? {}) as {
    resultados?: Record<string, EntradaDeRevision[]>;
    aspectos?: Record<string, EntradaDeRevision[]>;
  };
  const huellas = new Map(resultadosDelCapitulo(cuerpo).map((r) => [r.ancla, r.huella]));
  return [
    ...[...huellas].flatMap(([ancla, h]) =>
      (registro.resultados?.[ancla] ?? []).filter((e) => e.huella === h).map((e) => ({ ...e, clave: ancla, aspecto: false })),
    ),
    ...Object.keys(ASPECTOS).flatMap((a) => (registro.aspectos?.[a] ?? []).map((e) => ({ ...e, clave: a, aspecto: true }))),
  ];
}
