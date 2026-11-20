/**
 * El registro de piezas interactivas. Cada una se carga solo cuando un capítulo la usa, y la capa de libro valida
 * con NOMBRES_DE_PIEZAS que toda `::figura{pieza="…"}` exista.
 */
export const PIEZAS = {
  'normal-covector': () => import('./normal-covector.ts'),
  'tabla-de-verdad': () => import('./tabla-de-verdad.ts'),
} satisfies Record<string, () => Promise<{ montar: (raiz: HTMLElement) => () => void }>>;

export type NombreDePieza = keyof typeof PIEZAS;

export const NOMBRES_DE_PIEZAS = Object.keys(PIEZAS) as NombreDePieza[];

export * from './algebra.ts';
export * from './logica.ts';
