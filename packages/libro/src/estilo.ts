/**
 * LAS REGLAS DE ESTILO QUE SE PUEDEN COMPROBAR (docs/guia-de-estilo.md, sección 11). No reemplazan la lectura de
 * estilo: detectan lo mecánico, para que esa lectura se ocupe de lo que importa.
 */

export interface ProblemaDeEstilo {
  regla: 'palabra-prohibida' | 'parrafo-con-formula' | 'seccion-sin-texto' | 'imperativo-al-lector';
  linea: number;
  mensaje: string;
}

/** Sección 7 de la guía: palabras que esconden un paso o que son calcos del inglés. */
const PROHIBIDAS: readonly [RegExp, string][] = [
  [/\bobviamente\b/i, 'escribir la razón en media frase'],
  [/\bclaramente\b/i, 'escribir la razón en media frase'],
  [/\bevidentemente\b/i, 'escribir la razón en media frase'],
  [/\btrivialmente\b/i, 'escribir la razón en media frase'],
  [/\bes fácil (?:ver|comprobar|probar|demostrar)\b/i, 'dar la demostración o citar un ejercicio'],
  [/\bse deja al lector\b/i, 'dar la demostración o citar un ejercicio'],
  [/\basum(?:ir|e|en|imos|amos|iendo|ido|ida|a)\b/i, '«suponer»'],
  [/\bcheque(?:ar|a|o|amos|ado)\b/i, '«comprobar»'],
  [/\bremarc(?:ar|a|amos|ado)\b/i, '«señalar» u «observar»'],
  [/\ben orden a\b/i, '«para»'],
  [/\beventualmente\b/i, '«finalmente» o «tarde o temprano»'],
];

/** Sección 7 de la guía: el cuerpo no se dirige al lector, y los ejercicios van en infinitivo. */
const VERBOS = [
  'Calcul',
  'Demuestr',
  'Comprueb',
  'Hall',
  'Encuentr',
  'Prueb',
  'Muestr',
  'Verific',
  'Explic',
  'Escrib',
  'Consider',
  'Observ',
];
/** Fin de palabra que también reconoce las letras acentuadas («Probá»), que `\b` no considera letras. */
const FIN = '(?![\\p{L}])';
const IMPERATIVO = new RegExp(
  [
    // tú: «Calcula», «Demuestra», y con pronombre: «Demuéstralo»
    `(?:${VERBOS.join('|')})a${FIN}`,
    `(?:Demuéstr|Pruéb|Compruéb|Calcúl)(?:a|e)(?:lo|la|los|las)${FIN}`,
    // usted: «Calcule», «Demuestre»
    `(?:${VERBOS.join('|')})e${FIN}`,
    `(?:Halle|Deduzca|Use)${FIN}`,
    // vos: «Calculá», «Demostrá», «Probá»
    `(?:Calculá|Demostrá|Comprobá|Hallá|Encontrá|Probá|Mostrá|Verificá|Explicá|Escribí|Considerá|Observá|Usá|Deducí)${FIN}`,
  ].join('|'),
  'u',
);

/** Quita lo que no es prosa: código, matemática, atributos y direcciones; conserva las líneas para ubicar errores. */
function soloProsa(linea: string): string {
  return linea
    .replace(/`[^`]*`/g, ' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/\{[#.][^}]*\}/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/https?:\/\/\S+/g, ' ');
}

export function revisarEstilo(markdown: string): ProblemaDeEstilo[] {
  const problemas: ProblemaDeEstilo[] = [];
  const lineas = markdown.split('\n');
  let enCodigo = false;
  let enMatematica = false;
  let enFrontmatter = lineas[0] === '---';

  lineas.forEach((linea, i) => {
    const n = i + 1;
    if (enFrontmatter) {
      if (i > 0 && linea === '---') enFrontmatter = false;
      return;
    }
    if (/^\s*(```|~~~)/.test(linea)) {
      enCodigo = !enCodigo;
      return;
    }
    if (enCodigo) return;
    if (linea.trim() === '$$') {
      enMatematica = !enMatematica;
      return;
    }
    if (enMatematica) return;

    const prosa = soloProsa(linea);
    for (const [patron, alternativa] of PROHIBIDAS) {
      const m = patron.exec(prosa);
      if (m)
        problemas.push({
          regla: 'palabra-prohibida',
          linea: n,
          mensaje: `«${m[0]}»: ${alternativa} (guía de estilo, sección 7).`,
        });
    }
    for (const frase of prosa.split(/(?<=[.:;?!])\s+|^\s*(?:[-*]|\d+\.)\s+|\*\*|¿/)) {
      const m = IMPERATIVO.exec(frase.trimStart());
      if (m && m.index === 0) {
        problemas.push({
          regla: 'imperativo-al-lector',
          linea: n,
          mensaje: `«${m[0]}»: el cuerpo no se dirige al lector, y los ejercicios van en infinitivo (guía de estilo, sección 7).`,
        });
      }
    }

    // Un párrafo no empieza con una fórmula. Un ítem de lista que es solo una fórmula (como en el enunciado de un
    // teorema con varias partes) no es prosa; uno que sigue con texto, sí.
    const anterior = lineas[i - 1] ?? '';
    const empiezaParrafo = anterior.trim() === '' || /^:::/.test(anterior);
    const item = /^\s*(?:[-*]|\d+\.)\s+(.*)$/.exec(linea);
    const resto = item ? item[1]!.replace(/^(?:\$[^$]*\$\s*)+/, '') : '';
    const itemConProsa = item !== null && /^\$/.test(item[1]!) && /\p{L}/u.test(resto);
    if ((empiezaParrafo && !item && /^\s*\$/.test(linea)) || itemConProsa) {
      problemas.push({
        regla: 'parrafo-con-formula',
        linea: n,
        mensaje: 'Ningún párrafo empieza con una fórmula (guía de estilo, sección 8).',
      });
    }

    if (/^#{2,3} /.test(linea)) {
      const siguiente = lineas.slice(i + 1).find((l) => l.trim() !== '') ?? '';
      if (/^(?::{2,3}|```|~~~|\||[-*] |\d+\. |#|\$\$)/.test(siguiente)) {
        problemas.push({
          regla: 'seccion-sin-texto',
          linea: n,
          mensaje: `La sección «${linea.replace(/^#+ /, '')}» tiene que abrir con un párrafo de texto (guía de estilo, sección 2).`,
        });
      }
    }
  });
  return problemas;
}
