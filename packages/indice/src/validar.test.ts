import { describe, expect, it } from 'vitest';
import { cargarIndice } from './cargar.ts';
import type { Capitulo, Indice } from './esquema.ts';
import { validarIndice } from './validar.ts';

/** Un capítulo mínimo válido: dos aplicaciones de dos campos. */
function cap(id: string, extra: Partial<Capitulo> = {}): Capitulo {
  return {
    id,
    titulo: `Capítulo ${id}`,
    paginas: 30,
    requiere: [],
    tipo: 'nucleo',
    contenidos: ['Un tema.'],
    puente: 'Entrada: `x`.',
    aplicaciones: [
      { campo: '3d', texto: 'una' },
      { campo: 'fisica', texto: 'otra' },
      { campo: 'datos', texto: 'una más' },
      { campo: 'ing', texto: 'y otra' },
    ],
    lecturas: 'Un libro.',
    ...extra,
  };
}

/** Dos tomos: el II requiere el I. */
function indiceMinimo(): Indice {
  return {
    tomos: [
      {
        id: 'I',
        titulo: 'Uno',
        requiere: [],
        interfaces: [],
        presentacion: 'P.',
        partes: [{ letra: 'A', titulo: 'A', capitulos: [cap('I.1'), cap('I.2', { requiere: ['I.1'] })] }],
      },
      {
        id: 'II',
        titulo: 'Dos',
        requiere: ['I'],
        interfaces: [],
        presentacion: 'P.',
        partes: [{ letra: 'A', titulo: 'A', capitulos: [cap('II.1', { requiere: ['I.2'] })] }],
      },
    ],
    itinerarios: [{ id: 'nucleo', nombre: 'Núcleo', capitulos: [], tomos: [] }],
  };
}

const reglas = (indice: Indice) => validarIndice(indice).map((p) => p.regla);

describe('validarIndice', () => {
  it('acepta el índice de la obra', () => {
    expect(validarIndice(cargarIndice())).toEqual([]);
  });

  it('acepta el índice mínimo de estas pruebas', () => {
    expect(validarIndice(indiceMinimo())).toEqual([]);
  });

  it('rechaza un requisito que no existe', () => {
    const i = indiceMinimo();
    i.tomos[0]!.partes[0]!.capitulos[1]!.requiere = ['I.9'];
    expect(reglas(i)).toContain('requisito-inexistente');
  });

  it('rechaza un requisito posterior dentro del mismo tomo', () => {
    const i = indiceMinimo();
    i.tomos[0]!.partes[0]!.capitulos[0]!.requiere = ['I.2'];
    expect(reglas(i)).toContain('requisito-posterior');
  });

  it('rechaza un requisito de un tomo que no se requiere, salvo por interfaz', () => {
    const i = indiceMinimo();
    i.tomos[1]!.requiere = [];
    expect(reglas(i)).toContain('requisito-fuera-del-tomo');
    i.tomos[1]!.interfaces = ['I.2'];
    expect(reglas(i)).not.toContain('requisito-fuera-del-tomo');
  });

  it('rechaza que un capítulo de núcleo dependa de uno complementario', () => {
    const i = indiceMinimo();
    i.tomos[0]!.partes[0]!.capitulos[0]!.tipo = 'complementario';
    expect(reglas(i)).toContain('nucleo-depende-de-complementario');
  });

  it('rechaza una numeración con huecos', () => {
    const i = indiceMinimo();
    i.tomos[0]!.partes[0]!.capitulos[1]!.id = 'I.3';
    expect(reglas(i)).toContain('numeracion');
  });

  it('exige de 2 a 4 aplicaciones de al menos dos campos', () => {
    const i = indiceMinimo();
    const c = i.tomos[0]!.partes[0]!.capitulos[0]!;
    c.aplicaciones = [{ campo: 'datos', texto: 'sola' }];
    expect(reglas(i)).toContain('aplicaciones');
    c.aplicaciones = [
      { campo: 'datos', texto: 'una' },
      { campo: 'datos', texto: 'otra' },
    ];
    expect(reglas(i)).toContain('aplicaciones');
  });

  it('exige los hilos fijos en cada tomo y sin pasar de un tercio', () => {
    const i = indiceMinimo();
    for (const c of i.tomos[1]!.partes[0]!.capitulos) c.aplicaciones = c.aplicaciones.filter((a) => a.campo !== 'fisica');
    expect(validarIndice(i).some((p) => p.regla === 'hilos' && p.mensaje.includes('no tiene'))).toBe(true);
    const j = indiceMinimo();
    for (const c of j.tomos[0]!.partes[0]!.capitulos)
      c.aplicaciones = [
        { campo: '3d', texto: 'a' },
        { campo: 'fisica', texto: 'b' },
      ];
    expect(validarIndice(j).some((p) => p.regla === 'hilos' && p.mensaje.includes('más de un tercio'))).toBe(true);
  });

  it('rechaza nombrar en el texto un capítulo que no existe', () => {
    const i = indiceMinimo();
    i.tomos[0]!.partes[0]!.capitulos[0]!.contenidos = ['Se retoma en IV.2.'];
    expect(reglas(i)).toContain('referencia');
  });

  it('exige itinerarios cerrados bajo dependencias y sin capítulos de núcleo', () => {
    const i = indiceMinimo();
    const [c1, c2] = i.tomos[0]!.partes[0]!.capitulos;
    c1!.tipo = 'complementario';
    c2!.tipo = 'complementario';
    i.tomos[1]!.partes[0]!.capitulos[0]!.tipo = 'complementario';
    i.itinerarios.push({ id: 'prueba', nombre: 'Prueba', capitulos: ['I.2'], tomos: [] });
    expect(reglas(i)).toContain('itinerario-cerrado');
    i.itinerarios[1]!.capitulos = ['I.1', 'I.2'];
    expect(reglas(i)).not.toContain('itinerario-cerrado');
    c1!.tipo = 'nucleo';
    expect(reglas(i)).toContain('itinerario');
  });
});
