import type { Root, RootContent, PhrasingContent, Table } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { parse as leerYaml } from 'yaml';
import { NIVELES, TIPOS, seccionesDelCapitulo, type Tipo } from './ejercicios.ts';
import { ENTORNOS } from './entornos.ts';
import { etiquetasDelCapitulo } from './etiquetas.ts';

/**
 * EL PDF (especificación, 11.7; decisión 0007): un capítulo de Markdown, convertido a LaTeX recorriendo el mismo
 * árbol que la web. Las fórmulas pasan tal cual, porque ya están en LaTeX; los entornos se numeran con las mismas
 * reglas que el sitio, y las referencias escriben el mismo nombre («Teorema I.7.3») con un enlace interno. Las
 * figuras interactivas son un recuadro con su texto alternativo y la dirección de la versión web, hasta que haya
 * fotogramas; las celdas aparecen con su salida esperada.
 */

export interface OpcionesLatex {
  /** El nombre numerado de cada etiqueta de cada capítulo escrito («Teorema I.1.5»), de `etiquetasDelCapitulo`. */
  etiquetas: ReadonlyMap<string, ReadonlyMap<string, string>>;
  /** La dirección del sitio, para los enlaces a la versión web: «https://…/cerrar-el-abismo/». */
  sitio: string;
}

/** Los entornos que se componen en cursiva, como los enunciados de los libros; los demás, en redonda. */
const EN_CURSIVA = new Set(['axioma', 'teorema', 'lema', 'proposicion', 'corolario']);

/** Escapa un texto para LaTeX. */
export function escapar(texto: string): string {
  return texto
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([{}$&#%_])/g, '\\$1')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}');
}

/**
 * Una fórmula de KaTeX, lista para LaTeX. El español de babel le agrega un espacio al porcentaje, y dentro de una
 * fórmula eso choca con el espacio fino que suele precederlo; como texto, no.
 */
const formula = (tex: string) => tex.replaceAll(String.raw`\%`, String.raw`\text{\%}`);

/** El nombre de un destino interno del PDF: sin «#» ni «.», que LaTeX trataría como especiales. */
const ancla = (capitulo: string, id: string) => `${capitulo}-${id}`.replace(/[^A-Za-z0-9-]/g, '-');

export function capituloALatex(markdown: string, opciones: OpcionesLatex): string {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(markdown);
  const datos = (m ? leerYaml(m[1]!) : {}) as { title?: string; capitulo?: string };
  const capitulo = datos.capitulo ?? '';
  const cuerpo = m ? markdown.slice(m[0].length) : markdown;
  const arbol = unified().use(remarkParse).use(remarkMath).use(remarkDirective).use(remarkGfm).parse(cuerpo) as Root;
  const secciones = seccionesDelCapitulo(markdown);
  const propias = etiquetasDelCapitulo(markdown, capitulo);
  const contadores = { resultados: 0, ejercicios: 0, figuras: 0 };
  const urlCapitulo = `${opciones.sitio}capitulos/${capitulo.toLowerCase().replace('.', '-')}/`;

  const enLinea = (nodos: readonly PhrasingContent[]): string => nodos.map(frase).join('');

  function frase(nodo: PhrasingContent): string {
    switch (nodo.type) {
      case 'text':
        return escapar(nodo.value).replace(/\[\[([^\][]+)\]\]/g, (_, id: string) => {
          const destino = `${opciones.sitio}capitulos/${id.toLowerCase().replace('.', '-')}/`;
          return `\\href{${destino}}{${escapar(id)}}`;
        });
      case 'emphasis':
        return `\\emph{${enLinea(nodo.children)}}`;
      case 'strong':
        return `\\textbf{${enLinea(nodo.children)}}`;
      case 'inlineCode':
        return `\\texttt{${escapar(nodo.value)}}`;
      case 'inlineMath':
        return `$${formula(nodo.value)}$`;
      case 'break':
        return '\\\\\n';
      case 'link':
        return `\\href{${nodo.url.replace(/([#%])/g, '\\$1')}}{${enLinea(nodo.children)}}`;
      case 'delete':
        return enLinea(nodo.children);
      case 'textDirective':
        return referencia(nodo as TextDirective);
      default:
        return 'children' in nodo ? enLinea((nodo as { children: PhrasingContent[] }).children) : '';
    }
  }

  function referencia(nodo: TextDirective): string {
    if (nodo.name !== 'ref') return enLinea(nodo.children as PhrasingContent[]);
    const texto = (nodo.children[0] as { value?: string } | undefined)?.value ?? '';
    const [otro, id] = texto.includes('#') ? texto.split('#') : [capitulo, texto];
    const nombre = (otro === capitulo ? propias : opciones.etiquetas.get(otro!))?.get(id!) ?? texto;
    return `\\hyperlink{${ancla(otro!, id!)}}{${escapar(nombre)}}`;
  }

  function bloque(nodo: RootContent): string {
    switch (nodo.type) {
      case 'heading': {
        const titulo = enLinea(nodo.children);
        if (nodo.depth === 2) return `\\section*{${titulo}}\n`;
        return `\\subsection*{${titulo}}\n`;
      }
      case 'paragraph':
        return `${enLinea(nodo.children)}\n`;
      case 'math':
        return `\\[\n${formula(nodo.value)}\n\\]\n`;
      case 'list': {
        const tipo = nodo.ordered ? 'enumerate' : 'itemize';
        const items = nodo.children.map((item) => `\\item ${item.children.map(bloque).join('\n').trim()}`).join('\n');
        return `\\begin{${tipo}}\n${items}\n\\end{${tipo}}\n`;
      }
      case 'blockquote':
        return `\\begin{quote}\n${nodo.children.map(bloque).join('\n')}\\end{quote}\n`;
      case 'code': {
        if (nodo.lang === 'python' && /\bcelda\b/.test(nodo.meta ?? '')) return `\\begin{celda}\n${nodo.value}\n\\end{celda}\n`;
        if (nodo.lang === 'text' && /\bsalida\b/.test(nodo.meta ?? '')) return `\\begin{salida}\n${nodo.value}\n\\end{salida}\n`;
        return `\\begin{codigo}\n${nodo.value}\n\\end{codigo}\n`;
      }
      case 'table':
        return tabla(nodo);
      case 'thematicBreak':
        return '\\medskip\\hrule\\medskip\n';
      case 'containerDirective':
        return entorno(nodo as ContainerDirective);
      case 'leafDirective':
        return figura(nodo as LeafDirective);
      default:
        return '';
    }
  }

  function tabla(nodo: Table): string {
    const columnas = nodo.children[0]?.children.length ?? 0;
    const filas = nodo.children.map(
      (fila) => fila.children.map((celda) => enLinea(celda.children as PhrasingContent[])).join(' & ') + ' \\\\',
    );
    return `\\begin{center}\\small\n\\begin{tabular}{${'l'.repeat(columnas)}}\n\\hline\n${filas[0]}\n\\hline\n${filas.slice(1).join('\n')}\n\\hline\n\\end{tabular}\n\\end{center}\n`;
  }

  function entorno(nodo: ContainerDirective): string {
    const hijos = [...nodo.children];
    const primero = hijos[0];
    let titulo = '';
    if (primero?.type === 'paragraph' && (primero.data as { directiveLabel?: boolean } | undefined)?.directiveLabel) {
      titulo = enLinea(primero.children);
      hijos.shift();
    }
    const contenido = hijos.map(bloque).join('\n');
    const id = nodo.attributes?.id;
    const marca = id ? `\\hypertarget{${ancla(capitulo, id)}}{}` : '';
    if (nodo.name === 'demostracion') return `\\begin{proof}\n${contenido}\\end{proof}\n`;
    if (nodo.name === 'solucion') return `\\begin{solucion}\n${contenido}\\end{solucion}\n`;
    if (nodo.name === 'puente') return `\\begin{recuadro}{Puente}\n${contenido}\\end{recuadro}\n`;
    if (nodo.name === 'linea') return `\\begin{recuadro}{Una línea, un teorema}\n${contenido}\\end{recuadro}\n`;
    const definicion = ENTORNOS[nodo.name];
    if (!definicion) return contenido;
    const numero = definicion.contador ? ++contadores[definicion.contador] : undefined;
    const contraejemplo = nodo.name === 'ejemplo' && /\bcontraejemplo\b/.test(String(nodo.attributes?.class ?? ''));
    const base = contraejemplo ? 'Contraejemplo' : definicion.nombre;
    const nombre = numero === undefined ? base : `${base} ${capitulo}.${numero}`;
    let encabezado = `\\textbf{${escapar(nombre)}}${titulo ? ` (${titulo})` : ''}.`;
    if (nodo.name === 'ejercicio') {
      const { nivel, tipo, seccion, respuesta } = nodo.attributes ?? {};
      const partes = [
        nivel && nivel in NIVELES ? '★'.repeat(Number(nivel)) : '',
        seccion ? escapar(secciones.get(seccion) ?? seccion) : '',
        tipo && tipo in TIPOS ? TIPOS[tipo as Tipo] : '',
      ].filter(Boolean);
      if (partes.length) encabezado += ` {\\small\\color{gris} ${partes.join(' · ')}}`;
      const final = respuesta ? `\n{\\small\\color{gris} Respuesta para comprobar: $${respuesta}$.}\n` : '';
      return `\\begin{bloque}{${marca}${encabezado}}\n${contenido}${final}\\end{bloque}\n`;
    }
    const tipoDeEntorno = EN_CURSIVA.has(nodo.name) ? 'enunciado' : 'bloque';
    return `\\begin{${tipoDeEntorno}}{${marca}${encabezado}}\n${contenido}\\end{${tipoDeEntorno}}\n`;
  }

  function figura(nodo: LeafDirective): string {
    if (nodo.name !== 'figura') return '';
    const numero = ++contadores.figuras;
    const leyenda = enLinea(nodo.children as PhrasingContent[]);
    const id = nodo.attributes?.id;
    const alt = escapar(nodo.attributes?.alt ?? '');
    const url = `${urlCapitulo}${id ? `\\#${id}` : ''}`;
    return [
      '\\begin{figure}[htbp]\\centering',
      id ? `\\hypertarget{${ancla(capitulo, id)}}{}` : '',
      `\\fbox{\\parbox{0.92\\linewidth}{\\small\\textit{Figura interactiva.} ${alt}\\\\[0.3em]Versión web: \\url{${url}}}}`,
      `\\caption*{\\textbf{Figura ${escapar(capitulo)}.${numero}.} ${leyenda}}`,
      '\\end{figure}',
      '',
    ].join('\n');
  }

  const titulo = escapar(datos.title ?? capitulo);
  return [
    `\\chapter*{${titulo}}`,
    `\\addcontentsline{toc}{chapter}{${titulo}}`,
    `\\markboth{${titulo}}{${titulo}}`,
    '',
    ...arbol.children.map(bloque),
  ].join('\n');
}

/** El preámbulo del tomo: LuaLaTeX, en español, con los entornos que usa `capituloALatex`. */
export function preambulo(tituloDelTomo: string): string {
  return String.raw`\documentclass[11pt,openany]{book}
\usepackage{fontspec}
\usepackage{amsmath,amssymb,amsthm}
\usepackage[spanish,es-noshorthands,es-nodecimaldot]{babel}
\setmainfont{DejaVu Serif}[Scale=0.92]
\setmonofont{DejaVu Sans Mono}[Scale=0.85]
\usepackage[a4paper,margin=2.5cm]{geometry}
\usepackage{xcolor}
\definecolor{gris}{gray}{0.4}
\usepackage{fancyvrb}
\usepackage[most]{tcolorbox}
\usepackage{caption}
\usepackage[hidelinks]{hyperref}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0.5em}
\newenvironment{enunciado}[1]{\par\medskip\noindent #1\ \itshape\ignorespaces}{\par\medskip}
\newenvironment{bloque}[1]{\par\medskip\noindent #1\ \ignorespaces}{\par\medskip}
\newenvironment{solucion}{\par\small\noindent\textit{Solución.}\ \ignorespaces}{\par\medskip}
\newtcolorbox{recuadro}[1]{colback=gray!5,colframe=gray!50,title={#1},fonttitle=\bfseries,breakable}
\DefineVerbatimEnvironment{celda}{Verbatim}{frame=leftline,framerule=1.5pt,rulecolor=\color{gray},fontsize=\small,label=Python}
\DefineVerbatimEnvironment{salida}{Verbatim}{frame=single,rulecolor=\color{gris},fontsize=\small,label=Salida}
\DefineVerbatimEnvironment{codigo}{Verbatim}{fontsize=\small}
\title{${tituloDelTomo}}
\author{Cerrar el abismo}
\date{}
`;
}
