/**
 * LA DISPOSICIÓN DEL DIBUJO DEL GRAFO, por niveles (el método de Sugiyama, en su versión más simple). Recibe los nodos
 * en un orden topológico, el de lectura, y las aristas de requisito a capítulo, y devuelve dónde va cada cosa:
 *
 * 1. el nivel de un nodo es la longitud del camino más largo que llega a él, así que toda arista baja;
 * 2. una arista que salta varios niveles pasa por nodos ficticios, uno por nivel intermedio, para que el orden la tenga
 *    en cuenta y no atraviese los nodos de en medio;
 * 3. el orden dentro de cada nivel se ajusta con barridos de baricentros, que reducen los cruces;
 * 4. cada nivel se centra, y las aristas son poligonales por los nodos ficticios, que el dibujo suaviza.
 *
 * Es determinista: los mismos datos dan siempre el mismo dibujo.
 */

export interface Arista {
  de: string;
  a: string;
}

export interface NodoDispuesto {
  id: string;
  /** El centro del nodo. */
  x: number;
  y: number;
  nivel: number;
}

export interface AristaDispuesta extends Arista {
  /** Del borde inferior del requisito al superior del capítulo, pasando por los nodos ficticios. */
  puntos: [number, number][];
}

export interface Disposicion {
  nodos: NodoDispuesto[];
  aristas: AristaDispuesta[];
  ancho: number;
  alto: number;
}

export interface OpcionesDeDisposicion {
  anchoNodo: number;
  altoNodo: number;
  /** El espacio horizontal entre dos nodos. */
  separacion: number;
  /** El ancho que ocupa en su nivel una arista que pasa de largo. */
  anchoDePaso: number;
  /** La distancia vertical entre los centros de dos niveles. */
  altoDeNivel: number;
  margen: number;
  /** Cuántas veces se barre el dibujo de arriba abajo y de abajo arriba. */
  barridos: number;
}

const PREDETERMINADAS: OpcionesDeDisposicion = {
  anchoNodo: 64,
  altoNodo: 26,
  separacion: 14,
  anchoDePaso: 14,
  altoDeNivel: 64,
  margen: 12,
  barridos: 8,
};

interface Hueco {
  clave: string;
  /** El nodo real, o `undefined` si es un nodo ficticio de una arista larga. */
  id: string | undefined;
  nivel: number;
  arriba: Hueco[];
  abajo: Hueco[];
  orden: number;
  x: number;
}

export function disponer(
  ids: readonly string[],
  aristas: readonly Arista[],
  opciones: Partial<OpcionesDeDisposicion> = {},
): Disposicion {
  const o = { ...PREDETERMINADAS, ...opciones };
  const lugar = new Map(ids.map((id, i) => [id, i]));
  for (const { de, a } of aristas) {
    if (!lugar.has(de) || !lugar.has(a)) throw new Error(`La arista ${de} → ${a} une nodos que no están en el dibujo.`);
    if (lugar.get(de)! >= lugar.get(a)!) throw new Error(`La arista ${de} → ${a} no respeta el orden de los nodos.`);
  }

  // 1. Los niveles, recorriendo los nodos en orden topológico.
  const nivel = new Map<string, number>();
  for (const id of ids) nivel.set(id, Math.max(0, ...aristas.filter((x) => x.a === id).map((x) => nivel.get(x.de)! + 1)));

  // 2. Los huecos: los nodos reales y los ficticios de las aristas largas.
  const huecos = new Map<string, Hueco>();
  const hueco = (clave: string, id: string | undefined, n: number): Hueco => {
    const h: Hueco = { clave, id, nivel: n, arriba: [], abajo: [], orden: 0, x: 0 };
    huecos.set(clave, h);
    return h;
  };
  for (const id of ids) hueco(id, id, nivel.get(id)!);
  const cadenas = aristas.map(({ de, a }) => {
    const cadena = [huecos.get(de)!];
    for (let n = nivel.get(de)! + 1; n < nivel.get(a)!; n++) cadena.push(hueco(`${de}→${a}@${n}`, undefined, n));
    cadena.push(huecos.get(a)!);
    for (let i = 0; i + 1 < cadena.length; i++) {
      cadena[i]!.abajo.push(cadena[i + 1]!);
      cadena[i + 1]!.arriba.push(cadena[i]!);
    }
    return cadena;
  });

  const altura = Math.max(0, ...[...huecos.values()].map((h) => h.nivel)) + 1;
  const niveles: Hueco[][] = Array.from({ length: altura }, () => []);
  // El orden inicial es el de creación: los nodos reales en orden de lectura y los ficticios detrás de su origen.
  for (const h of huecos.values()) niveles[h.nivel]!.push(h);
  const renumerar = (nv: Hueco[]) => nv.forEach((h, i) => (h.orden = i));
  niveles.forEach(renumerar);

  // 3. Barridos de baricentros: cada hueco se ordena por la posición media de sus vecinos del nivel anterior.
  const promedio = (vecinos: Hueco[], propio: number) =>
    vecinos.length === 0 ? propio : vecinos.reduce((s, v) => s + v.orden, 0) / vecinos.length;
  for (let b = 0; b < o.barridos; b++) {
    for (let n = 1; n < altura; n++) {
      niveles[n]!.sort((p, q) => promedio(p.arriba, p.orden) - promedio(q.arriba, q.orden) || p.orden - q.orden);
      renumerar(niveles[n]!);
    }
    for (let n = altura - 2; n >= 0; n--) {
      niveles[n]!.sort((p, q) => promedio(p.abajo, p.orden) - promedio(q.abajo, q.orden) || p.orden - q.orden);
      renumerar(niveles[n]!);
    }
  }

  // 4. Las coordenadas: cada nivel, centrado en el ancho del más ancho.
  const anchoDe = (h: Hueco) => (h.id ? o.anchoNodo + o.separacion : o.anchoDePaso);
  const anchos = niveles.map((nv) => nv.reduce((s, h) => s + anchoDe(h), 0));
  const ancho = Math.max(0, ...anchos) + 2 * o.margen;
  niveles.forEach((nv, n) => {
    let x = (ancho - anchos[n]!) / 2;
    for (const h of nv) {
      h.x = x + anchoDe(h) / 2;
      x += anchoDe(h);
    }
  });
  const y = (n: number) => o.margen + o.altoNodo / 2 + n * o.altoDeNivel;

  return {
    nodos: ids.map((id) => {
      const h = huecos.get(id)!;
      return { id, x: h.x, y: y(h.nivel), nivel: h.nivel };
    }),
    aristas: aristas.map(({ de, a }, i) => {
      const cadena = cadenas[i]!;
      const puntos = cadena.map((h): [number, number] => [h.x, y(h.nivel)]);
      puntos[0] = [puntos[0]![0], puntos[0]![1] + o.altoNodo / 2];
      puntos[puntos.length - 1] = [puntos.at(-1)![0], puntos.at(-1)![1] - o.altoNodo / 2];
      return { de, a, puntos };
    }),
    ancho,
    alto: y(altura - 1) + o.altoNodo / 2 + o.margen,
  };
}

/** Un camino de SVG suave por los puntos de una arista: curvas que salen y llegan en vertical. */
export function caminoSuave(puntos: readonly [number, number][]): string {
  const [x0, y0] = puntos[0]!;
  let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`;
  for (let i = 1; i < puntos.length; i++) {
    const [px, py] = puntos[i - 1]!;
    const [qx, qy] = puntos[i]!;
    const m = (py + qy) / 2;
    d += ` C${px.toFixed(1)},${m.toFixed(1)} ${qx.toFixed(1)},${m.toFixed(1)} ${qx.toFixed(1)},${qy.toFixed(1)}`;
  }
  return d;
}
