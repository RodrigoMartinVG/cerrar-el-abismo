export { DIRECTIVAS_DE_STARLIGHT, ENTORNOS, type Entorno } from './entornos.ts';
export { remarkLibro, type CapituloEnlazable, type OpcionesLibro } from './remark-libro.ts';
export { revisarEstilo, type ProblemaDeEstilo } from './estilo.ts';
export { revisarSupone, type Supuesto } from './supone.ts';
export { claveDeTermino, revisarDiccionario, type EntradaDelDiccionario } from './diccionario.ts';
export { etiquetasDelCapitulo } from './etiquetas.ts';
export { revisarCumple, type Cumplimiento, type Promesa } from './cumple.ts';
export {
  ASPECTOS,
  ENTORNOS_REVISABLES,
  ESTADOS,
  PASADAS,
  avanceDeRevision,
  huella,
  resultadosDelCapitulo,
  revisarRegistro,
  type AvanceDeRevision,
  type EntradaDeRevision,
  type Estado,
  type EstadoDePasada,
  type Pasada,
  type Registro,
  type ResultadoRevisable,
} from './revision.ts';
export { revisarRegistroDeTerminologia, usosRechazados, type Termino, type UsoRechazado, type Variante } from './terminologia.ts';
export { METAS, evaluarDensidad, medirDensidad, type Densidad, type Meta } from './densidad.ts';
