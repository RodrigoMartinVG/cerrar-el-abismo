import { describe, expect, it } from 'vitest';
import { capituloALatex, escapar } from './latex.ts';

const opciones = {
  etiquetas: new Map([['I.1', new Map([['teo-de-morgan', 'Teorema I.1.5']])]]),
  sitio: 'https://ejemplo.org/obra/',
};
const capitulo = (cuerpo: string) => `---\ntitle: I.7 Grupos\ncapitulo: I.7\n---\n\n${cuerpo}`;

describe('el PDF: un capítulo convertido a LaTeX (decisión 0007)', () => {
  it('escapa los caracteres especiales del texto, y deja las fórmulas como están', () => {
    expect(escapar('50 % de $x_1$ & {y}')).toBe('50 \\% de \\$x\\_1\\$ \\& \\{y\\}');
    expect(capituloALatex(capitulo('Si $a_1 \\le b$, entonces\n\n$$\n\\sum_k a_k\n$$'), opciones)).toContain(
      'Si $a_1 \\le b$, entonces\n',
    );
  });

  it('el porcentaje de una fórmula pasa a texto, para que el español de babel no le agregue un espacio', () => {
    expect(capituloALatex(capitulo(String.raw`Un error de $26\,\%$.`), opciones)).toContain(String.raw`$26\,\text{\%}$`);
  });

  it('numera los entornos como el sitio y resuelve las referencias con un enlace interno', () => {
    const tex = capituloALatex(
      capitulo(
        ':::definicion[Grupo]{#def-grupo}\nUn grupo.\n:::\n\n:::teorema[Lagrange]{#teo-lagrange}\nDivide.\n:::\n\nPor el :ref[teo-lagrange] y el :ref[I.1#teo-de-morgan].',
      ),
      opciones,
    );
    expect(tex).toContain('\\begin{bloque}{\\hypertarget{I-7-def-grupo}{}\\textbf{Definición I.7.1} (Grupo).}');
    expect(tex).toContain('\\begin{enunciado}{\\hypertarget{I-7-teo-lagrange}{}\\textbf{Teorema I.7.2} (Lagrange).}');
    expect(tex).toContain('\\hyperlink{I-7-teo-lagrange}{Teorema I.7.2}');
    expect(tex).toContain('\\hyperlink{I-1-teo-de-morgan}{Teorema I.1.5}');
  });

  it('las celdas con su salida, las figuras con su texto y la dirección de la web, y los ejercicios con su grado', () => {
    const tex = capituloALatex(
      capitulo(
        '### Subgrupos\n\n```python celda\nprint(1)\n```\n\n```text salida\n1\n```\n\n::figura[Una tabla.]{#fig-t pieza="x" alt="Una tabla de colores."}\n\n:::ejercicio{nivel=2 tipo=calculo seccion="subgrupos" respuesta=6}\nContar.\n:::',
      ),
      opciones,
    );
    expect(tex).toContain('\\begin{celda}\nprint(1)\n\\end{celda}');
    expect(tex).toContain('\\begin{salida}\n1\n\\end{salida}');
    expect(tex).toContain('Una tabla de colores.');
    expect(tex).toContain('https://ejemplo.org/obra/capitulos/i-7/\\#fig-t');
    expect(tex).toContain('\\textbf{Figura I.7.1.} Una tabla.');
    expect(tex).toContain('\\textbf{Ejercicio I.7.1}. {\\small\\color{gris} ★★ · Subgrupos · Cálculo}');
  });
});
