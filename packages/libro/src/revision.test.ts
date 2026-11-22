import { describe, expect, it } from 'vitest';
import { ASPECTOS, avanceDeRevision, huella, resultadosDelCapitulo, revisarRegistro } from './revision.ts';

const TEXTO = [
  ':::definicion[Grupo]{#def-grupo}',
  '…',
  ':::',
  '',
  ':::teorema[Lagrange]{#teo-lagrange}',
  'El orden de un subgrupo divide al del grupo.',
  ':::',
  '',
  ':::demostracion',
  'Las coclases lo parten.',
  '',
  '```python',
  ':::lema{#no-es-un-lema}',
  '```',
  ':::',
  '',
  'Un párrafo.',
  '',
  ':::corolario{#cor-orden}',
  'El orden de un elemento divide al del grupo.',
  ':::',
].join('\n');

const [LAGRANGE, COROLARIO] = resultadosDelCapitulo(TEXTO).map((r) => r.huella) as [string, string];

const entrada = (pasada: 'primera' | 'segunda', por: string, h?: string) => ({
  pasada,
  por,
  fecha: '2026-11-25',
  contra: 'Dummit y Foote, sección 3.2',
  ...(h ? { huella: h } : {}),
});

const ASPECTOS_REVISADOS = Object.fromEntries(Object.keys(ASPECTOS).map((a) => [a, [entrada('primera', 'Ana Pérez')]]));

describe('resultadosDelCapitulo', () => {
  it('encuentra los teoremas, lemas, proposiciones y corolarios, sin contar lo que está dentro del código', () => {
    expect(resultadosDelCapitulo(TEXTO).map((r) => [r.entorno, r.ancla])).toEqual([
      ['teorema', 'teo-lagrange'],
      ['corolario', 'cor-orden'],
    ]);
  });

  it('la huella incluye la demostración y no cambia con los espacios', () => {
    expect(resultadosDelCapitulo(TEXTO.replace('Las coclases lo parten.', 'Las coclases  lo\nparten.'))[0]!.huella).toBe(
      LAGRANGE,
    );
    expect(resultadosDelCapitulo(TEXTO.replace('lo parten', 'lo dividen'))[0]!.huella).not.toBe(LAGRANGE);
    expect(resultadosDelCapitulo(TEXTO.replace('lo parten', 'lo dividen'))[1]!.huella).toBe(COROLARIO);
    expect(huella('a  b\n')).toBe(huella('a b'));
    expect(LAGRANGE).toMatch(/^[0-9a-f]{12}$/);
  });
});

describe('revisarRegistro', () => {
  it('un borrador puede no tener registro, o tenerlo a medias', () => {
    expect(revisarRegistro(undefined, TEXTO)).toEqual([]);
    expect(revisarRegistro({ resultados: { 'teo-lagrange': [entrada('primera', 'Ana Pérez', LAGRANGE)] } }, TEXTO)).toEqual([]);
  });

  it('señala entradas incompletas, anclas y aspectos que no existen, y campos de más', () => {
    const problemas = revisarRegistro(
      {
        resultados: {
          'teo-otro': [entrada('primera', 'Ana Pérez', LAGRANGE)],
          'cor-orden': [{ pasada: 'tercera', por: '', fecha: '25/11/2026', huella: 'x', revisor: 'Ana' }],
        },
        aspectos: { estilo: [entrada('primera', 'Ana Pérez', LAGRANGE)], ortografia: [entrada('primera', 'Ana Pérez')] },
        otros: {},
      },
      TEXTO,
    );
    for (const texto of [
      '«otros» no es una parte',
      '«teo-otro» no es el ancla',
      '«revisor» no es un campo',
      '«pasada» es «primera» o «segunda»',
      'falta «por»',
      '«fecha» tiene que ser una fecha',
      'falta «contra»',
      'falta «huella»',
      'los aspectos no llevan huella',
      '«ortografia» no es un aspecto',
    ])
      expect(problemas).toContainEqual(expect.stringContaining(texto));
  });

  it('rechaza fechas imposibles', () => {
    const r = { resultados: { 'teo-lagrange': [{ ...entrada('primera', 'Ana Pérez', LAGRANGE), fecha: '2026-02-30' }] } };
    expect(revisarRegistro(r, TEXTO)).toEqual([expect.stringContaining('«fecha»')]);
  });

  it('una revisión la firma una persona, nunca una IA', () => {
    for (const por of ['Claude', 'Claude Opus 5.5', 'una IA', 'GPT-6'])
      expect(revisarRegistro({ aspectos: { estilo: [entrada('primera', por)] } }, TEXTO)).toEqual([
        expect.stringContaining('no puede firmar'),
      ]);
  });

  it('la segunda pasada la hace otra persona', () => {
    const r = {
      resultados: { 'teo-lagrange': [entrada('primera', 'Ana Pérez', LAGRANGE), entrada('segunda', 'Ana Pérez', LAGRANGE)] },
    };
    expect(revisarRegistro(r, TEXTO)).toEqual([expect.stringContaining('otra persona')]);
    expect(avanceDeRevision(r, TEXTO).porResultado.get('teo-lagrange')).toEqual({ primera: 'vigente', segunda: 'falta' });
  });

  it('en «revision» exige la primera pasada vigente de cada resultado y de cada aspecto', () => {
    const completo = {
      resultados: {
        'teo-lagrange': [entrada('primera', 'Ana Pérez', LAGRANGE)],
        'cor-orden': [entrada('primera', 'Ana Pérez', COROLARIO)],
      },
      aspectos: ASPECTOS_REVISADOS,
    };
    expect(revisarRegistro(completo, TEXTO, 'revision')).toEqual([]);
    expect(revisarRegistro({ ...completo, aspectos: {} }, TEXTO, 'revision')).toHaveLength(Object.keys(ASPECTOS).length);
    expect(revisarRegistro(undefined, TEXTO, 'revision')).toContainEqual(
      expect.stringContaining('«teo-lagrange»: un capítulo en «revision» necesita la primera pasada vigente (hoy: falta)'),
    );
  });

  it('si el texto cambia después de revisarlo, la revisión queda desactualizada y deja de contar', () => {
    const r = {
      resultados: {
        'teo-lagrange': [entrada('primera', 'Ana Pérez', LAGRANGE)],
        'cor-orden': [entrada('primera', 'Ana Pérez', COROLARIO)],
      },
      aspectos: ASPECTOS_REVISADOS,
    };
    const cambiado = TEXTO.replace('lo parten', 'lo dividen');
    expect(revisarRegistro(r, cambiado, 'revision')).toEqual([expect.stringContaining('(hoy: desactualizada)')]);
    expect(avanceDeRevision(r, cambiado)).toMatchObject({ resultados: 2, primera: 1, segunda: 0, aspectos: 5 });
    // Basta con registrar la revisión del texto nuevo: la entrada vieja queda como historia.
    const nueva = resultadosDelCapitulo(cambiado)[0]!.huella;
    r.resultados['teo-lagrange'].push(entrada('primera', 'Ana Pérez', nueva));
    expect(revisarRegistro(r, cambiado, 'revision')).toEqual([]);
  });

  it('terminado exige además la segunda pasada vigente de cada resultado', () => {
    const r = {
      resultados: {
        'teo-lagrange': [entrada('primera', 'Ana Pérez', LAGRANGE), entrada('segunda', 'Luis Gómez', LAGRANGE)],
        'cor-orden': [entrada('primera', 'Ana Pérez', COROLARIO)],
      },
      aspectos: ASPECTOS_REVISADOS,
    };
    expect(revisarRegistro(r, TEXTO, 'terminado')).toEqual([
      expect.stringContaining('«cor-orden»: un capítulo terminado necesita la segunda pasada'),
    ]);
    r.resultados['cor-orden'].push(entrada('segunda', 'Luis Gómez', COROLARIO));
    expect(revisarRegistro(r, TEXTO, 'terminado')).toEqual([]);
    expect(avanceDeRevision(r, TEXTO)).toMatchObject({ resultados: 2, primera: 2, segunda: 2, aspectos: 5 });
  });
});
