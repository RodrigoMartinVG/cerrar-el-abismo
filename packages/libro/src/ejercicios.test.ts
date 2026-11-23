import { describe, expect, it } from 'vitest';
import { ejerciciosDelCapitulo, leerAtributos, revisarEjercicios, seccionesDelCapitulo } from './ejercicios.ts';
import { coincide, leerNumero } from './respuestas.ts';

const capitulo = (ejercicios: string) =>
  `---\ntitle: x\n---\n\n## Desarrollo\n\n### Subgrupos y el teorema de Lagrange\n\nTexto.\n\n## Cálculo\n\n## Ejercicios\n\n${ejercicios}`;

describe('los ejercicios (decisión 0006)', () => {
  it('lee los atributos de la directiva, con y sin comillas', () => {
    expect(leerAtributos('{#ej-a nivel=2 tipo=calculo seccion="calculo" respuesta=7/12}')).toEqual({
      id: 'ej-a',
      nivel: '2',
      tipo: 'calculo',
      seccion: 'calculo',
      respuesta: '7/12',
    });
  });

  it('da a cada sección el identificador que le da el sitio', () => {
    expect([...seccionesDelCapitulo(capitulo('')).keys()]).toEqual(['subgrupos-y-el-teorema-de-lagrange', 'cálculo']);
  });

  it('acepta un capítulo con los ejercicios completos y los impares resueltos', () => {
    const texto = capitulo(
      ':::ejercicio{nivel=1 tipo=calculo seccion="cálculo" respuesta=10}\nA.\n:::\n\n:::solucion\nS.\n:::\n\n:::ejercicio{nivel=3 tipo=demostracion seccion="subgrupos-y-el-teorema-de-lagrange"}\nB.\n:::\n',
    );
    expect(ejerciciosDelCapitulo(texto).map((e) => e.conSolucion)).toEqual([true, false]);
    expect(revisarEjercicios(texto)).toEqual([]);
  });

  it('señala lo que falta: el nivel, la sección que no existe, la respuesta y la solución de un impar', () => {
    const problemas = revisarEjercicios(
      capitulo(
        ':::ejercicio{tipo=calculo seccion="nada"}\nA.\n:::\n\n:::ejercicio{nivel=1 tipo=exploracion seccion="cálculo"}\nB.\n:::\n\n:::solucion\nS.\n:::\n',
      ),
    );
    expect(problemas.join('\n')).toMatch(/falta «nivel»/);
    expect(problemas.join('\n')).toMatch(/la sección «nada» no existe/);
    expect(problemas.join('\n')).toMatch(/lleva su «respuesta»/);
    expect(problemas.join('\n')).toMatch(/es impar y no tiene solución/);
    expect(problemas.join('\n')).toMatch(/es par, el texto no lo cita, y tiene solución/);
  });

  it('los que el texto cita llevan solución aunque sean pares, y los proyectos van al final, fuera de la paridad', () => {
    const ejercicio = (id: string, tipo = 'calculo') =>
      `:::ejercicio{#${id} nivel=1 tipo=${tipo} seccion="cálculo" respuesta=1}\nA.\n:::\n\n`;
    const solucion = ':::solucion\nS.\n:::\n\n';
    const conCita = (ejercicios: string) => capitulo(ejercicios).replace('Texto.', 'Texto, que completa el :ref[ej-dos].');
    const bien = conCita(`${ejercicio('ej-uno')}${solucion}${ejercicio('ej-dos')}${solucion}${ejercicio('ej-p', 'proyecto')}`);
    expect(revisarEjercicios(bien)).toEqual([]);
    expect(ejerciciosDelCapitulo(bien).map((e) => [e.proyecto ? 'Proyecto' : 'Ejercicio', e.numero])).toEqual([
      ['Ejercicio', 1],
      ['Ejercicio', 2],
      ['Proyecto', 1],
    ]);
    const mal = conCita(`${ejercicio('ej-p', 'proyecto')}${ejercicio('ej-uno')}${solucion}${ejercicio('ej-dos')}`);
    expect(revisarEjercicios(mal).join('\n')).toMatch(/va después de un proyecto/);
    expect(revisarEjercicios(mal).join('\n')).toMatch(/el texto lo cita, así que lleva su solución/);
  });
});

describe('las respuestas', () => {
  it('lee enteros, fracciones y decimales con coma o con punto', () => {
    expect(leerNumero('2 598 960')?.exacto).toEqual({ numerador: 2598960n, denominador: 1n });
    expect(leerNumero('−14/24')?.exacto).toEqual({ numerador: -7n, denominador: 12n });
    expect(leerNumero('0,25')?.valor).toBe(0.25);
    expect(leerNumero('1.5e-3')?.valor).toBe(0.0015);
    expect(leerNumero('dos')).toBeUndefined();
    expect(leerNumero('1/0')).toBeUndefined();
  });

  it('compara exactamente las fracciones y con tolerancia los decimales', () => {
    expect(coincide(leerNumero('14/24')!, leerNumero('7/12')!)).toBe(true);
    expect(coincide(leerNumero('0,5833')!, leerNumero('7/12')!)).toBe(false);
    expect(coincide(leerNumero('0,5833')!, leerNumero('7/12')!, 1e-3)).toBe(true);
    expect(coincide(leerNumero('0.36788')!, leerNumero('0.367879')!, 1e-4)).toBe(true);
  });
});
