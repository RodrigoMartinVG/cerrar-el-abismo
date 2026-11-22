import { describe, expect, it } from 'vitest';
import { evaluarDensidad, medirDensidad } from './densidad.ts';

const CAPITULO = [
  '---',
  'title: Prueba',
  '---',
  '## Entrada',
  'Un fragmento.',
  '## Desarrollo',
  ':::definicion[Grupo]{#def-grupo}',
  'Un grupo es…',
  ':::',
  '',
  ':::ejemplo[Grupos chicos]',
  'Los restos módulo n.',
  ':::',
  '',
  'El ejemplo siguiente muestra que la recíproca no vale.',
  '',
  ':::ejemplo[La recíproca de Lagrange es falsa]{#ej-a4 .contraejemplo}',
  'El grupo alternado.',
  ':::',
  ':::teorema[Lagrange]{#teo-lagrange}',
  'El orden divide.',
  ':::',
  '## Cálculo',
  '```python celda',
  'print(1)',
  '```',
  '::figura[Una figura]{#fig pieza="x" alt="y"}',
  '## Ejercicios',
  ':::ejercicio{nivel=1 tipo=demostracion seccion="calculo"}',
  'Demostrar algo.',
  ':::',
  '',
  ':::solucion',
  'Así.',
  ':::',
  '',
  ':::ejercicio{nivel=3 tipo=calculo seccion="calculo" respuesta=2}',
  'Contar algo.',
  ':::',
].join('\n');

describe('medirDensidad', () => {
  it('cuenta definiciones, resultados, ejemplos, contraejemplos marcados, figuras, celdas y ejercicios', () => {
    expect(medirDensidad(CAPITULO)).toMatchObject({
      definiciones: 1,
      resultados: 1,
      ejemplos: 2,
      contraejemplos: 1,
      figuras: 1,
      celdas: 1,
      ejercicios: 2,
      porTipo: { demostracion: 1, calculo: 1 },
      porNivel: { '1': 1, '3': 1 },
    });
  });

  it('mide la racha más larga de bloques sin una frase entre ellos, con la demostración pegada a su resultado', () => {
    expect(medirDensidad(CAPITULO).rachaSinProsa).toBe(2);
    const sinFrase = CAPITULO.replace('El ejemplo siguiente muestra que la recíproca no vale.\n\n', '');
    expect(medirDensidad(sinFrase).rachaSinProsa).toBe(4);
  });

  it('cuenta como contraejemplo solo lo marcado, no las palabras del título', () => {
    expect(medirDensidad(CAPITULO.replace(' .contraejemplo', '')).contraejemplos).toBe(0);
  });

  it('no cuenta el frontmatter ni lo que está fuera del Desarrollo como ejemplos', () => {
    const d = medirDensidad(CAPITULO.replace('## Desarrollo', '## Otra cosa'));
    expect(d.ejemplos).toBe(0);
    expect(d.palabrasDesarrollo).toBe(0);
  });
});

describe('evaluarDensidad', () => {
  it('dice qué metas se cumplen, con rangos y proporciones', () => {
    const metas = evaluarDensidad(medirDensidad(CAPITULO), 40);
    expect(Object.fromEntries(metas.map((m) => [m.nombre, m.cumple]))).toEqual({
      'ejemplos por definición': true,
      'bloques seguidos sin prosa': true,
      'ejemplo más largo': true,
      contraejemplos: false,
      figuras: true,
      ejercicios: false,
      'mezcla de ejercicios': false,
      niveles: false,
      extensión: false,
    });
  });

  it('la extensión tiene piso y no techo: por encima del 115 % solo se señala', () => {
    const d = { ...medirDensidad(CAPITULO), paginasEstimadas: 46 };
    const extension = (paginas: number) => evaluarDensidad(d, paginas).find((m) => m.nombre === 'extensión')!;
    expect(extension(40).cumple).toBe(true);
    expect(extension(30)).toMatchObject({ cumple: true, valor: expect.stringContaining('la ronda crítica dice por qué') });
    expect(extension(52).cumple).toBe(false); // 46 de 52 no llega al 90 %
  });

  it('cuenta una fórmula del texto como una palabra, sin los comandos de LaTeX', () => {
    const corto = medirDensidad(CAPITULO).palabras;
    const conRuido = CAPITULO.replace('Un fragmento.', 'Un fragmento con $\\operatorname{mcd}(a, b) = \\mathbb Z$.');
    expect(medirDensidad(conRuido).palabras - corto).toBe(2);
  });
});
