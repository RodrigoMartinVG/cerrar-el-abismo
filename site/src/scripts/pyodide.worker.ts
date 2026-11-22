/// <reference lib="webworker" />
/**
 * Python en el navegador (sección 11.2): Pyodide en un Web Worker, para que la página no se congele. Se carga la
 * primera vez que el lector ejecuta una celda; la versión es la del paquete `pyodide` del repositorio, la misma con
 * la que las pruebas ejecutan las celdas.
 */
declare const __PYODIDE_VERSION__: string;

interface Pyodide {
  loadPackagesFromImports(codigo: string, opciones?: { messageCallback?: (mensaje: string) => void }): Promise<void>;
  runPythonAsync(codigo: string): Promise<unknown>;
  setStdout(opciones: { batched: (texto: string) => void }): void;
  setStderr(opciones: { batched: (texto: string) => void }): void;
}

const BASE = `https://cdn.jsdelivr.net/pyodide/v${__PYODIDE_VERSION__}/full/`;
let pyodide: Promise<Pyodide> | undefined;

function cargar(): Promise<Pyodide> {
  pyodide ??= import(/* @vite-ignore */ `${BASE}pyodide.mjs`)
    .then((m: { loadPyodide: (o: { indexURL: string }) => Promise<Pyodide> }) => m.loadPyodide({ indexURL: BASE }))
    .catch((error: unknown) => {
      // Lo más común es una red que bloquea la CDN, como en muchas escuelas y empresas. El próximo intento vuelve a
      // probar, en vez de repetir el fracaso.
      pyodide = undefined;
      throw new Error(
        'No se pudo cargar Python desde cdn.jsdelivr.net. Puede que la red bloquee ese sitio o que no haya conexión; ' +
          'las celdas lo necesitan, pero el resto del capítulo funciona sin él. ' +
          `(${error instanceof Error ? error.message : String(error)})`,
        { cause: error },
      );
    });
  return pyodide;
}

self.onmessage = async (evento: MessageEvent<{ id: number; codigo: string }>) => {
  const { id, codigo } = evento.data;
  let salida = '';
  try {
    const py = await cargar();
    // Los paquetes que importa la celda (NumPy, SymPy…) se cargan sin ensuciar la salida con sus mensajes.
    await py.loadPackagesFromImports(codigo, { messageCallback: () => {} });
    py.setStdout({ batched: (s) => (salida += `${s}\n`) });
    py.setStderr({ batched: (s) => (salida += `${s}\n`) });
    const resultado = await py.runPythonAsync(codigo);
    if (resultado !== undefined && resultado !== null) salida += `${String(resultado)}\n`;
    self.postMessage({ id, salida });
  } catch (error) {
    self.postMessage({ id, salida, error: error instanceof Error ? error.message : String(error) });
  }
};
