import { describe, expect, it } from 'vitest';
import { revisarEstilo } from './estilo.ts';

const reglas = (md: string) => revisarEstilo(md).map((p) => p.regla);

describe('revisarEstilo', () => {
  it('acepta prosa que sigue la guía', () => {
    const md = [
      '---',
      'title: Asumir no está mal en el frontmatter',
      '---',
      '',
      '## Motivación',
      '',
      'Veamos un caso concreto. La matriz $A$ es invertible, y por lo tanto $A x = b$ tiene solución.',
      '',
      ':::ejercicio',
      'Calcular la inversa de $A$ y demostrar que es única.',
      ':::',
      '',
      '```python celda',
      'print("obviamente esto es código")',
      '```',
    ].join('\n');
    expect(revisarEstilo(md)).toEqual([]);
  });

  it('marca las palabras prohibidas y los anglicismos', () => {
    expect(reglas('Obviamente, es cierto.')).toEqual(['palabra-prohibida']);
    expect(reglas('Es fácil ver que converge.')).toEqual(['palabra-prohibida']);
    expect(reglas('Asumimos que T es lineal.')).toEqual(['palabra-prohibida']);
    expect(reglas('Vamos a chequear el resultado.')).toEqual(['palabra-prohibida']);
  });

  it('ignora el código, la matemática y las direcciones', () => {
    expect(reglas('El código `obviamente()` y la fórmula $asumir$ no cuentan.')).toEqual([]);
    expect(reglas('$$\n\\text{claramente}\n$$')).toEqual([]);
  });

  it('marca los párrafos que empiezan con una fórmula', () => {
    expect(reglas('Texto.\n\n$A$ es invertible.')).toEqual(['parrafo-con-formula']);
    expect(reglas('- $A$ es invertible.')).toEqual(['parrafo-con-formula']);
    expect(reglas('1. $p \\to q \\equiv \\neg q \\to \\neg p$;\n2. $p \\equiv p$.')).toEqual([]);
  });

  it('marca las secciones que no abren con texto', () => {
    expect(reglas('## Desarrollo\n\n:::definicion\nX.\n:::')).toEqual(['seccion-sin-texto']);
    expect(reglas('### Ejemplo\n\n```python\nx = 1\n```')).toEqual(['seccion-sin-texto']);
    expect(reglas('## Desarrollo\n\nEmpecemos por un ejemplo.')).toEqual([]);
  });

  it('marca los imperativos dirigidos al lector, en tú, usted o vos', () => {
    expect(reglas('Calcula la inversa.')).toEqual(['imperativo-al-lector']);
    expect(reglas('Sea A una matriz. Demuestre que es invertible.')).toEqual(['imperativo-al-lector']);
    expect(reglas('¿Para qué M vale? Demuéstralo.')).toEqual(['imperativo-al-lector']);
    expect(reglas('Probá que converge.')).toEqual(['imperativo-al-lector']);
    expect(reglas('La figura muestra la recta, y la prueba usa el teorema.')).toEqual([]);
  });
});
