# El registro de revisión

Un archivo por capítulo (`i-7.yaml` para I.7) con cada revisión hecha a sus resultados y a sus aspectos: quién revisó,
cuándo, contra qué y, en los resultados, la huella del texto que revisó. Lo explica la
[decisión 0005](../docs/decisiones/0005-la-revision-como-datos.md); lo comprueban las pruebas de los capítulos, y el
sitio lo muestra en cada capítulo y en la página «Estado de la revisión».

Los archivos se escriben con el comando, que calcula la fecha y la huella:

```bash
npm run revision
npm run revision -- I.7
npm run revision -- I.7 teo-lagrange --por "Nombre Apellido" --contra "Dummit y Foote, sección 3.2, teorema 8"
```

El primero muestra cómo va cada capítulo escrito; el segundo, un capítulo resultado por resultado; el tercero registra
una revisión. Las opciones `--pasada segunda`, `--notas` y `--fecha` completan la entrada. Los aspectos se registran
igual, con su nombre en lugar del ancla: `estilo`, `practica`, `calculos`, `ejercicios` e `historia`.

Una revisión la firma una persona. Si el texto de un resultado cambia después de revisarlo, su revisión queda
desactualizada y hay que registrarla de nuevo; las entradas viejas quedan como historia.
