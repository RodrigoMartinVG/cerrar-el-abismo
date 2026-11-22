import { describe, expect, it } from 'vitest';
import {
  BLANCO,
  MAQUINAS,
  avanzar,
  clave,
  configuracionInicial,
  contenido,
  ejecutar,
  leer,
  maquinaPorId,
  reglaActual,
  revisarEntrada,
  unos,
  ventana,
  type Configuracion,
} from './turing.ts';

const maquina = (id: string) => maquinaPorId(id)!;
/** La cinta entre dos celdas, con el cabezal entre corchetes: «x0[1]x». */
const dibujo = (c: Configuracion, desde: number, hasta: number) =>
  Array.from({ length: hasta - desde + 1 }, (_, k) => {
    const s = leer(c, desde + k);
    return desde + k === c.cabezal ? `[${s}]` : s;
  }).join('');
/** Todas las palabras sobre un alfabeto, hasta un largo, de las más cortas a las más largas. */
function palabras(alfabeto: string[], largo: number): string[] {
  let ultimas = [''];
  const todas = [''];
  for (let k = 1; k <= largo; k++) {
    ultimas = ultimas.flatMap((w) => alfabeto.map((s) => w + s));
    todas.push(...ultimas);
  }
  return todas;
}

describe('las máquinas de la pieza', () => {
  it('tienen identificadores distintos, y sus reglas usan sus estados y sus símbolos', () => {
    expect(new Set(MAQUINAS.map((m) => m.id)).size).toBe(MAQUINAS.length);
    for (const m of MAQUINAS) {
      expect(m.simbolos).toContain(BLANCO);
      for (const s of m.alfabetoDeEntrada) expect(m.simbolos).toContain(s);
      for (const [par, regla] of Object.entries(m.programa)) {
        const [estado, simbolo] = par.split(' ');
        expect(m.estados).toContain(estado);
        expect(m.simbolos).toContain(simbolo);
        expect(m.simbolos).toContain(regla.escribe);
        expect([...m.estados, ...Object.keys(m.paradas)]).toContain(regla.pasaA);
      }
      expect(revisarEntrada(m, m.entrada)).toBeNull();
    }
  });

  it('solo dejan sin regla los pares que el capítulo dice que no se alcanzan', () => {
    const faltan = MAQUINAS.flatMap((m) =>
      m.estados.flatMap((e) => m.simbolos.filter((s) => !(clave(e, s) in m.programa)).map((s) => `${m.id}: ${e} ${s}`)),
    );
    expect(faltan).toEqual(['ceros-unos: C _', 'ceros-unos: D _']);
  });
});

describe('la máquina que decide 0ⁿ1ⁿ', () => {
  const m = maquina('ceros-unos');

  it('se detiene con toda palabra de largo a lo sumo 10, y acepta exactamente las de la forma 0ⁿ1ⁿ', () => {
    for (const w of palabras(['0', '1'], 10)) {
      const { configuraciones, final } = ejecutar(m, w);
      expect(final, w).toBe('parada');
      const n = w.length / 2;
      const esDeLaForma = Number.isInteger(n) && w === '0'.repeat(n) + '1'.repeat(n);
      expect(configuraciones[configuraciones.length - 1]!.estado, w).toBe(esDeLaForma ? 'S' : 'N');
    }
  });

  it('con la entrada 0ⁿ1ⁿ da (n + 1)(2n + 1) pasos, como en el ejercicio del capítulo', () => {
    for (let n = 0; n <= 10; n++) {
      const pasos = ejecutar(m, '0'.repeat(n) + '1'.repeat(n)).configuraciones.length - 1;
      expect(pasos).toBe((n + 1) * (2 * n + 1));
    }
  });

  it('hace con 0011 el cálculo de la tabla del capítulo, en quince pasos', () => {
    const { configuraciones } = ejecutar(m, '0011');
    expect(configuraciones).toHaveLength(16);
    const [desde, hasta] = ventana(configuraciones);
    expect([desde, hasta]).toEqual([0, 4]);
    const filas = configuraciones.map((c) => `${c.estado} ${dibujo(c, 0, 4)}`);
    expect(filas).toEqual([
      'A [0]011_',
      'B x[0]11_',
      'B x0[1]1_',
      'B x01[1]_',
      'B x011[_]',
      'C x01[1]_',
      'D x0[1]x_',
      'D x[0]1x_',
      'D [x]01x_',
      'A x[0]1x_',
      'B xx[1]x_',
      'B xx1[x]_',
      'C xx[1]x_',
      'D x[x]xx_',
      'A xx[x]x_',
      'S xxx[x]_',
    ]);
  });

  it('rechaza 001 y 0101 en diez pasos', () => {
    for (const w of ['001', '0101']) {
      const { configuraciones } = ejecutar(m, w);
      expect(configuraciones).toHaveLength(11);
      expect(configuraciones[10]!.estado).toBe('N');
    }
  });
});

describe('la máquina que suma uno en binario', () => {
  const m = maquina('sumar-uno');
  it('escribe n + 1 a partir de n, para n de 0 a 300', () => {
    for (let n = 0; n <= 300; n++) {
      const { configuraciones, final } = ejecutar(m, n.toString(2));
      expect(final).toBe('parada');
      expect(contenido(configuraciones[configuraciones.length - 1]!)).toBe((n + 1).toString(2));
    }
  });
  it('con 1011 da ocho pasos y deja 1100', () => {
    const { configuraciones } = ejecutar(m, '1011');
    expect(configuraciones).toHaveLength(9);
    expect(contenido(configuraciones[8]!)).toBe('1100');
  });
});

describe('los castores afanosos', () => {
  it.each([
    ['castor-2', 6, 4],
    ['castor-3', 14, 6],
    ['castor-3-pasos', 21, 5],
    ['castor-4', 107, 13],
  ] as const)('%s se detiene después de %i pasos con %i unos', (id, pasos, cuantos) => {
    const { configuraciones, final } = ejecutar(maquina(id), '');
    expect(final).toBe('parada');
    expect(configuraciones.length - 1).toBe(pasos);
    expect(unos(configuraciones[configuraciones.length - 1]!)).toBe(cuantos);
  });
});

describe('los pasos sueltos', () => {
  const m = maquina('ceros-unos');
  it('no avanzan desde un estado de parada, ni sin regla', () => {
    const parada: Configuracion = { estado: 'S', cabezal: 0, cinta: new Map() };
    expect(reglaActual(m, parada)).toBeNull();
    expect(avanzar(m, parada)).toBeNull();
    const sinRegla: Configuracion = { estado: 'C', cabezal: 0, cinta: new Map() };
    expect(avanzar(m, sinRegla)).toBeNull();
    expect(ejecutar(m, '').final).toBe('parada');
  });
  it('no cambian la configuración anterior', () => {
    const inicial = configuracionInicial(m, '01');
    avanzar(m, inicial);
    expect(contenido(inicial)).toBe('01');
  });
  it('cortan en el límite', () => {
    expect(ejecutar(maquina('castor-4'), '', 50).final).toBe('limite');
  });
});

describe('las entradas', () => {
  it('se revisan contra el alfabeto de la máquina y su largo', () => {
    expect(revisarEntrada(maquina('ceros-unos'), '0012')).toMatch(/«2»/);
    expect(revisarEntrada(maquina('ceros-unos'), '0'.repeat(17))).toMatch(/16/);
    expect(revisarEntrada(maquina('castor-2'), '1')).toMatch(/blanco/);
    expect(revisarEntrada(maquina('castor-2'), '')).toBeNull();
  });
});
