import type { Blockquote, Paragraph, PhrasingContent, Root, RootContent, Text } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import { SKIP, visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import GithubSlugger from 'github-slugger';
import { NIVELES, TIPOS, type Nivel, type Tipo } from './ejercicios.ts';
import { DIRECTIVAS_DE_STARLIGHT, ENTORNOS } from './entornos.ts';
import { leerNumero } from './respuestas.ts';
import { revisarSupone, type Supuesto } from './supone.ts';

/**
 * LA CAPA DE LIBRO (decisión 0001), como plugin de remark. Sobre el árbol de un capítulo:
 *
 * - convierte los entornos (`:::teorema[Título]{#id}`) en bloques numerados «Teorema II.5.3»;
 * - convierte `::figura{pieza="…" alt="…"}` en una figura interactiva numerada, con su texto alternativo;
 * - agrega a cada ejercicio su dificultad, su tipo y un enlace a su sección, y a los de cálculo, un campo para
 *   comprobar la respuesta (decisión 0006);
 * - convierte los bloques ` ```python celda ` en celdas de Python que se ejecutan en el navegador, y el bloque
 *   ` ```text salida ` que puede seguir a una celda en su salida esperada, que el lector ve sin ejecutarla;
 * - resuelve `:ref[id]` (un entorno o figura del capítulo), `:ref[I.1#id]` (uno de otro capítulo escrito) y `[[II.3]]`
 *   (un capítulo de la obra);
 * - si el frontmatter declara `supone` (supone.ts), pone después del primer párrafo del Desarrollo el recuadro «Lo que
 *   este capítulo da por conocido», con un enlace al capítulo que trata cada noción con rigor.
 *
 * Todo lo que no reconoce hace fallar la construcción, con el lugar exacto: el conjunto de directivas es cerrado.
 */

export interface CapituloEnlazable {
  url: string;
  titulo: string;
}

export interface OpcionesLibro {
  /** Para resolver `[[II.3]]`: la dirección y el título de cada capítulo de la obra. */
  capitulos: ReadonlyMap<string, CapituloEnlazable>;
  /** Las piezas interactivas que existen, para validar `::figura{pieza="…"}`. */
  piezas: readonly string[];
  /**
   * Para resolver `:ref[I.1#teo-de-morgan]`: las etiquetas de cada capítulo escrito con su nombre numerado
   * («Teorema I.1.9»), calculadas con `etiquetasDelCapitulo`.
   */
  etiquetas?: ReadonlyMap<string, ReadonlyMap<string, string>>;
}

/** Una celda de Python en el árbol: remark-rehype la convierte en `<celda-python>` con el código como texto. */
interface CeldaPython {
  type: 'celdaPython';
  value: string;
  data: { hName: string; hProperties: Record<string, unknown>; hChildren: { type: 'text'; value: string }[] };
}

const REFERENCIA_A_CAPITULO = /\[\[([^\][]+)\]\]/g;

const texto = (value: string): Text => ({ type: 'text', value });

/** El frontmatter de un capítulo, tal como Astro lo deja en el archivo. */
function frontmatterDe(file: VFile): Record<string, unknown> {
  return (file.data as { astro?: { frontmatter?: Record<string, unknown> } }).astro?.frontmatter ?? {};
}

/** El identificador del capítulo en su frontmatter: `capitulo: II.5`. */
function capituloDe(file: VFile): string | undefined {
  const valor = frontmatterDe(file)['capitulo'];
  return typeof valor === 'string' ? valor : undefined;
}

/** El recuadro «Lo que este capítulo da por conocido». Los `[[I.9]]` se resuelven después, con las demás referencias. */
function recuadroSupone(supone: readonly Supuesto[]): Blockquote {
  const parrafo = (children: PhrasingContent[], className?: string): Paragraph => ({
    type: 'paragraph',
    ...(className ? { data: { hProperties: { className: [className] } } } : {}),
    children,
  });
  return {
    type: 'blockquote',
    data: { hName: 'aside', hProperties: { className: ['supone'], ariaLabel: 'Lo que este capítulo da por conocido' } },
    children: [
      parrafo([{ type: 'strong', children: [texto('Lo que este capítulo da por conocido.')] }], 'supone-titulo'),
      parrafo([
        texto(
          'Estas nociones se usan aquí como se conocen de la escuela secundaria o del lenguaje de todos los días; cada una se trata con todo rigor en el capítulo que se indica.',
        ),
      ]),
      {
        type: 'list',
        ordered: false,
        spread: false,
        children: supone.map((s) => ({
          type: 'listItem',
          spread: false,
          children: [parrafo([texto(`${s.nocion}: [[${s.en}]].`)])],
        })),
      },
    ],
  };
}

/** El texto plano de un nodo, para calcular el identificador de un título como lo hace el sitio. */
function textoPlano(nodo: unknown): string {
  const n = nodo as { value?: string; children?: unknown[] };
  if (typeof n.value === 'string') return n.value;
  return (n.children ?? []).map(textoPlano).join('');
}

/**
 * Las secciones a las que puede corresponder un ejercicio, con el identificador que Astro da a cada título: los `###`
 * y las secciones Cálculo, Puente y Aplicaciones (el mismo cálculo que `seccionesDelCapitulo`, sobre el árbol).
 */
function seccionesDelArbol(arbol: Root): Map<string, string> {
  const slugger = new GithubSlugger();
  const secciones = new Map<string, string>();
  for (const nodo of arbol.children) {
    if (nodo.type !== 'heading' || nodo.depth < 2) continue;
    const titulo = textoPlano(nodo).trim();
    const id = slugger.slug(titulo);
    if (nodo.depth === 3 || ['Cálculo', 'Puente', 'Aplicaciones'].includes(titulo)) secciones.set(id, titulo);
  }
  return secciones;
}

/** El campo para comprobar la respuesta de un ejercicio de cálculo; src/scripts/elementos.ts lo hace funcionar. */
function campoDeRespuesta(respuesta: string, tolerancia: string | undefined): Paragraph {
  const elemento = (tagName: string, properties: Record<string, unknown>, children: unknown[] = []) => ({
    type: 'element',
    tagName,
    properties,
    children,
  });
  return {
    type: 'paragraph',
    data: {
      hName: 'form',
      hProperties: {
        className: ['verificar', 'not-content'],
        dataRespuesta: respuesta,
        ...(tolerancia ? { dataTolerancia: tolerancia } : {}),
      },
      hChildren: [
        elemento('label', {}, [
          { type: 'text', value: 'Respuesta ' },
          elemento('input', { type: 'text', name: 'respuesta', inputMode: 'decimal', autoComplete: 'off', size: 12 }),
        ]),
        { type: 'text', value: ' ' },
        elemento('button', { type: 'submit' }, [{ type: 'text', value: 'Comprobar' }]),
        { type: 'text', value: ' ' },
        elemento('output', { ariaLive: 'polite' }),
      ],
    } as Paragraph['data'],
    children: [],
  };
}

/** Saca el párrafo de etiqueta (`[Título]`) de una directiva de bloque, si lo tiene. */
function sacarEtiqueta(nodo: ContainerDirective): PhrasingContent[] | undefined {
  const primero = nodo.children[0];
  if (primero?.type === 'paragraph' && (primero.data as { directiveLabel?: boolean } | undefined)?.directiveLabel) {
    nodo.children.shift();
    return primero.children;
  }
  return undefined;
}

export function remarkLibro(opciones: OpcionesLibro) {
  return function transformar(arbol: Root, file: VFile) {
    const capitulo = capituloDe(file);
    const prefijo = capitulo ? `${capitulo}.` : '';
    const contadores = { resultados: 0, ejercicios: 0, figuras: 0 };
    const etiquetas = new Map<string, string>();
    const fallar = (mensaje: string, nodo: RootContent): never => file.fail(mensaje, nodo);
    const secciones = seccionesDelArbol(arbol);

    const registrar = (id: string | null | undefined, nombre: string, nodo: RootContent) => {
      if (!id) return;
      if (etiquetas.has(id)) fallar(`La etiqueta «${id}» está repetida en el capítulo.`, nodo);
      etiquetas.set(id, nombre);
    };

    // Primera pasada: entornos, figuras y celdas. Numera y registra las etiquetas.
    visit(arbol, (nodo, indice, padre) => {
      if (nodo.type === 'containerDirective') {
        if (DIRECTIVAS_DE_STARLIGHT.has(nodo.name)) return;
        const entorno = ENTORNOS[nodo.name];
        if (!entorno) {
          return fallar(
            `«:::${nodo.name}» no es una directiva de la obra. Las permitidas son: ${Object.keys(ENTORNOS).join(', ')} (decisión 0001).`,
            nodo,
          );
        }
        const etiqueta = sacarEtiqueta(nodo);
        const numero = entorno.contador ? ++contadores[entorno.contador] : undefined;
        // Un ejemplo marcado {.contraejemplo} se nombra «Contraejemplo», con el mismo contador (guía de estilo, 6).
        const contraejemplo = nodo.name === 'ejemplo' && /\bcontraejemplo\b/.test(String(nodo.attributes?.class ?? ''));
        const base = contraejemplo ? 'Contraejemplo' : entorno.nombre;
        const nombre = numero === undefined ? base : `${base} ${prefijo}${numero}`;
        registrar(nodo.attributes?.id, nombre, nodo);
        const encabezado: Paragraph = {
          type: 'paragraph',
          data: { hName: entorno.htmlTitulo ?? 'p', hProperties: { className: ['entorno-titulo'] } },
          children: [
            { type: 'strong', children: [texto(nombre)] },
            ...(etiqueta ? [texto(' ('), ...etiqueta, texto(')')] : []),
            ...(entorno.htmlTitulo ? [] : [texto('.')]),
          ],
        };
        if (nodo.name === 'ejercicio') {
          const { nivel, tipo, seccion, respuesta, tolerancia } = nodo.attributes ?? {};
          const partes: PhrasingContent[] = [];
          if (nivel && nivel in NIVELES)
            partes.push({
              type: 'emphasis',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['ejercicio-nivel'],
                  title: `Dificultad: ${NIVELES[nivel as Nivel]}`,
                  ariaLabel: `Dificultad ${nivel} de 3: ${NIVELES[nivel as Nivel]}`,
                },
              },
              children: [texto('★'.repeat(Number(nivel)))],
            });
          if (seccion) {
            const titulo = secciones.get(seccion);
            if (!titulo) return fallar(`La sección «${seccion}» del ejercicio no existe en el capítulo.`, nodo);
            partes.push({ type: 'link', url: `#${seccion}`, children: [texto(titulo)] });
          }
          if (tipo && tipo in TIPOS) partes.push(texto(TIPOS[tipo as Tipo]));
          if (partes.length)
            encabezado.children.push(texto(' '), {
              type: 'emphasis',
              data: { hName: 'span', hProperties: { className: ['ejercicio-meta'] } },
              children: partes.flatMap((p, i) => (i ? [texto(' · '), p] : [p])),
            });
          if (respuesta !== undefined && respuesta !== null) {
            if (!leerNumero(respuesta))
              return fallar(`La respuesta «${respuesta}» no es un número, una fracción ni un decimal.`, nodo);
            nodo.children.push(campoDeRespuesta(respuesta, tolerancia ?? undefined));
          }
        }
        nodo.children.unshift(encabezado);
        if (entorno.cierre) {
          nodo.children.push({
            type: 'paragraph',
            data: { hName: 'p', hProperties: { className: ['qed'], ariaLabel: 'Fin de la demostración' } },
            children: [texto('∎')],
          });
        }
        nodo.data = {
          hName: entorno.html ?? 'section',
          hProperties: {
            className: ['entorno', `entorno-${nodo.name}`, ...(contraejemplo ? ['contraejemplo'] : [])],
            id: nodo.attributes?.id ?? undefined,
            open: entorno.abierto || undefined,
          },
        };
        return;
      }

      if (nodo.type === 'leafDirective') {
        if (nodo.name !== 'figura')
          return fallar(`«::${nodo.name}» no es una directiva de la obra; la única de una línea es «::figura».`, nodo);
        figura(nodo);
        return SKIP;
      }

      if (nodo.type === 'code' && nodo.lang === 'python' && /\bcelda\b/.test(nodo.meta ?? '') && padre && indice !== undefined) {
        const celda: CeldaPython = {
          type: 'celdaPython',
          value: nodo.value,
          data: { hName: 'celda-python', hProperties: { className: ['celda'] }, hChildren: [texto(nodo.value)] },
        };
        padre.children[indice] = celda as unknown as RootContent;
        return SKIP;
      }

      // La salida esperada de una celda: solo vale inmediatamente después de una, y las pruebas la comparan con lo que
      // la celda imprime (guía de capítulos, «Celdas de Python»).
      if (nodo.type === 'code' && nodo.lang === 'text' && /\bsalida\b/.test(nodo.meta ?? '') && padre && indice !== undefined) {
        const anterior = padre.children[indice - 1] as { type: string } | undefined;
        if (anterior?.type !== 'celdaPython')
          return fallar('Un bloque «```text salida» va inmediatamente después de una celda de Python.', nodo);
        const salida: CeldaPython = {
          type: 'celdaPython',
          value: nodo.value,
          data: {
            hName: 'pre',
            hProperties: { className: ['salida-esperada'], ariaLabel: 'Salida de la celda' },
            hChildren: [texto(nodo.value)],
          },
        };
        padre.children[indice] = salida as unknown as RootContent;
        return SKIP;
      }
      return undefined;
    });

    function figura(nodo: LeafDirective) {
      const pieza = nodo.attributes?.pieza;
      const alt = nodo.attributes?.alt;
      if (!pieza || !opciones.piezas.includes(pieza)) {
        fallar(`La figura pide la pieza «${pieza ?? ''}», que no existe. Las piezas son: ${opciones.piezas.join(', ')}.`, nodo);
      }
      if (!alt) fallar('Toda figura necesita texto alternativo: ::figura{pieza="…" alt="…"} (sección 11.5).', nodo);
      const nombre = `Figura ${prefijo}${++contadores.figuras}`;
      // Los demás atributos configuran la pieza: `formula="…"` llega como `data-formula`.
      const configuracion = Object.fromEntries(
        Object.entries(nodo.attributes ?? {})
          .filter(([clave]) => !['pieza', 'alt', 'id', 'class'].includes(clave))
          .map(([clave, valor]) => [`data${clave[0]!.toUpperCase()}${clave.slice(1)}`, valor]),
      );
      registrar(nodo.attributes?.id, nombre, nodo);
      const pie = nodo.children;
      nodo.children = [
        {
          type: 'paragraph',
          data: { hName: 'figura-interactiva', hProperties: { dataPieza: pieza, dataAlt: alt, ...configuracion } },
          children: [texto(alt!)],
        } as unknown as PhrasingContent,
        {
          type: 'paragraph',
          data: { hName: 'figcaption' },
          children: [{ type: 'strong', children: [texto(`${nombre}.`)] }, ...(pie.length > 0 ? [texto(' '), ...pie] : [])],
        } as unknown as PhrasingContent,
      ];
      nodo.data = { hName: 'figure', hProperties: { className: ['figura'], id: nodo.attributes?.id ?? undefined } };
    }

    // Lo que el capítulo da por conocido: el recuadro va después del primer párrafo del Desarrollo, que lo presenta.
    const supone = frontmatterDe(file)['supone'];
    if (supone !== undefined) {
      const problemas = revisarSupone(supone, capitulo ?? '', [...opciones.capitulos.keys()]);
      if (problemas.length > 0) file.fail(`En «supone»: ${problemas.join(' ')}`);
      const desarrollo = arbol.children.findIndex(
        (n) =>
          n.type === 'heading' && n.depth === 2 && n.children.map((h) => ('value' in h ? h.value : '')).join('') === 'Desarrollo',
      );
      if (desarrollo === -1) file.fail('El capítulo declara «supone» pero no tiene sección «## Desarrollo».');
      const primero = arbol.children[desarrollo + 1];
      const lugar = primero?.type === 'paragraph' ? desarrollo + 2 : desarrollo + 1;
      arbol.children.splice(lugar, 0, recuadroSupone(supone as Supuesto[]));
    }

    // Segunda pasada: referencias a entornos y figuras (`:ref[id]`) y a capítulos (`[[II.3]]`).
    visit(arbol, (nodo, indice, padre) => {
      if (nodo.type === 'textDirective' && nodo.name === 'ref' && padre && indice !== undefined) {
        const ref = (nodo as TextDirective).children.map((h) => ('value' in h ? h.value : '')).join('');
        const [otro, id] = ref.includes('#') ? ref.split('#', 2) : [undefined, ref];
        if (otro === undefined || otro === capitulo) {
          const nombre = etiquetas.get(id!);
          if (!nombre) return fallar(`:ref[${ref}] no apunta a ningún entorno ni figura de este capítulo.`, nodo);
          padre.children[indice] = { type: 'link', url: `#${id}`, children: [texto(nombre)] };
          return SKIP;
        }
        const nombre = opciones.etiquetas?.get(otro)?.get(id!);
        const destino = opciones.capitulos.get(otro);
        if (!nombre || !destino) return fallar(`:ref[${ref}] no apunta a ningún entorno ni figura de un capítulo escrito.`, nodo);
        padre.children[indice] = { type: 'link', url: `${destino.url}#${id}`, children: [texto(nombre)] };
        return SKIP;
      }
      if (nodo.type === 'text' && padre && indice !== undefined && REFERENCIA_A_CAPITULO.test(nodo.value)) {
        REFERENCIA_A_CAPITULO.lastIndex = 0;
        const partes: PhrasingContent[] = [];
        let desde = 0;
        for (const m of nodo.value.matchAll(REFERENCIA_A_CAPITULO)) {
          const id = m[1]!;
          const destino = opciones.capitulos.get(id);
          if (!destino) return fallar(`[[${id}]] no es un capítulo de la obra.`, nodo);
          if (m.index > desde) partes.push(texto(nodo.value.slice(desde, m.index)));
          partes.push({ type: 'link', url: destino.url, title: destino.titulo, children: [texto(id)] });
          desde = m.index + m[0].length;
        }
        if (desde < nodo.value.length) partes.push(texto(nodo.value.slice(desde)));
        (padre.children as PhrasingContent[]).splice(indice, 1, ...partes);
        return [SKIP, indice + partes.length];
      }
      return undefined;
    });
  };
}
