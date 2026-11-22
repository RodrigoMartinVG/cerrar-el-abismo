/**
 * El registro de piezas interactivas. Cada una se carga solo cuando un capítulo la usa, y la capa de libro valida
 * con NOMBRES_DE_PIEZAS que toda `::figura{pieza="…"}` exista.
 */
export const PIEZAS = {
  'busqueda-en-grafos': () => import('./busqueda-en-grafos.ts'),
  coclases: () => import('./coclases.ts'),
  'comparador-flotante': () => import('./comparador-flotante.ts'),
  'conversor-de-convenciones': () => import('./conversor-de-convenciones.ts'),
  'cortadura-de-dedekind': () => import('./cortadura-de-dedekind.ts'),
  'cuadrado-de-impares': () => import('./cuadrado-de-impares.ts'),
  cubetas: () => import('./cubetas.ts'),
  'de-casteljau': () => import('./de-casteljau.ts'),
  'multiplicacion-compleja': () => import('./multiplicacion-compleja.ts'),
  'multiplicacion-de-bytes': () => import('./multiplicacion-de-bytes.ts'),
  'multiplicacion-modular': () => import('./multiplicacion-modular.ts'),
  'normal-covector': () => import('./normal-covector.ts'),
  'recta-flotante': () => import('./recta-flotante.ts'),
  'rectangulo-de-euclides': () => import('./rectangulo-de-euclides.ts'),
  'rompecabezas-de-quince': () => import('./rompecabezas-de-quince.ts'),
  'reticulo-de-divisores': () => import('./reticulo-de-divisores.ts'),
  'tabla-de-verdad': () => import('./tabla-de-verdad.ts'),
} satisfies Record<string, () => Promise<{ montar: (raiz: HTMLElement) => () => void }>>;

export type NombreDePieza = keyof typeof PIEZAS;

export const NOMBRES_DE_PIEZAS = Object.keys(PIEZAS) as NombreDePieza[];

export * from './algebra.ts';
export * from './convenciones.ts';
export * as demos3d from './demos3d.ts';
export * from './dispersion.ts';
export * from './divisores.ts';
export * from './euclides.ts';
export * from './flotante.ts';
export * from './modular.ts';
export * from './logica.ts';
export * from './impares.ts';
