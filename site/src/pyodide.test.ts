import { loadPyodide } from 'pyodide';
import { expect, it } from 'vitest';

/**
 * EL CAMINO DE NUMPY (hoja de ruta, G2). Las celdas del Tomo I usan solo la biblioteca estándar; el Tomo II va a usar
 * NumPy, y `loadPackagesFromImports` lo descarga de la CDN de Pyodide la primera vez. Esta prueba lo recorre en Node, con
 * la misma versión que el navegador; la del navegador está en e2e/sitio.spec.ts.
 */
it('NumPy se carga en Pyodide y calcula', { timeout: 300_000 }, async () => {
  const py = await loadPyodide();
  const codigo = 'import numpy as np\nprint(round(float(np.linalg.det(np.eye(3) * 2)), 6))';
  await py.loadPackagesFromImports(codigo, { messageCallback: () => {} });
  let salida = '';
  py.setStdout({ batched: (s: string) => (salida += s) });
  await py.runPythonAsync(codigo);
  expect(salida.trim()).toBe('8.0');
});
