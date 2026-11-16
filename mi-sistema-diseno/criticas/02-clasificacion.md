# Clasificación de la crítica 01

Ordena los 15 hallazgos de [01-critica-actual.md](01-critica-actual.md) según tus decisiones del 2026-11-09: prioridad en la jerarquía de la aptitud, y las ideas con texto o componente nuevo como propuesta.

**Cómo se lee**

- **Tipo de cambio**
  - `descripción`: cambia el texto descriptivo de un componente o del layout en DESIGN.md.
  - `valor`: cambia un valor o una medida que ya existe.
  - `propuesta`: añade un texto o un componente nuevo; sale de tu regla de solo valores y descripciones y se aprueba una por una.
  - `spec/código`: no es de DESIGN.md; se anota para la spec o la implementación.
- **Ningún cambio de la tabla renombra un token o un componente, cambia un texto visible ni toca la sección 7.**
- H10 y H11 se dividen: la parte **a** se resuelve con valores y descripciones; la parte **b** es la propuesta con texto nuevo.
- **Tu decisión:** casilla para marcar cuando decidas. Impeccable recomienda; tu DESIGN.md decide.

## Prioridad 1 · Eje: jerarquía de la aptitud

| Hallazgo | Severidad | Tipo de cambio | Qué se toca en DESIGN.md | Tu decisión |
| --- | --- | --- | --- | --- |
| H1. La aptitud no domina la pantalla | alta | descripción y valor | «Tarjeta de nave» (borde `--color-no-apta` en la No apta), «Insignia de estado» (`--texto-sm` y más alto), «Botón» (ancho de contenido) | [ ] |
| H5. Estado triplicado y motivos con el texto más flojo | media | descripción | «Tarjeta de nave» (motivos en `--color-texto`, bajo la cabecera; cambia el orden fijo de §6.7) | [ ] |
| H6. Dos ejes de estado con tratamientos distintos | media | descripción | «Tarjeta de nave» (filas etiquetadas de Clase y Estado); §4.2 ya menciona «CLASE» | [ ] |

## Prioridad 2 · Orden y densidad

| Hallazgo | Severidad | Tipo de cambio | Qué se toca en DESIGN.md | Tu decisión |
| --- | --- | --- | --- | --- |
| H2. En 390 px la flota queda más de una pantalla abajo | alta | descripción | Layout §5 (orden por debajo de 900 px); hay que reescribir D-09 y la fila U-16 de `VERIFICACION-UI.md` | [ ] |
| H3. Solo 2 tarjetas por fila a 1280 px | media | valor y descripción | Layout §5 (mínimo de la grilla de unos 260 a unos 220 px), «Tarjeta de nave» (relleno `--espacio-3` en lugar de `--espacio-4`) | [ ] |

## Prioridad 3 · Estados e interacción

| Hallazgo | Severidad | Tipo de cambio | Qué se toca en DESIGN.md | Tu decisión |
| --- | --- | --- | --- | --- |
| H7. Ningún control responde al puntero | media | descripción | «Botón», «Campo de formulario», §4.4; decidir si «secundario» sigue en el sistema | [ ] |
| H8. «Enviando» solo baja la opacidad | media | descripción | «Botón» (cursor de progreso y borde de control, sin cambiar el texto); quitar «Registrando…» del board o aprobarlo tú | [ ] |
| H9. El feedback queda lejos de la acción | media | descripción y spec/código | «Avisos» (borde `--color-acento` en la tarjeta recién creada); limpiar el error viejo de la flota es comportamiento | [ ] |
| H10a. Panel «Asignar misión» completo con flota vacía | media | descripción | «Panel» / §6.9 (panel atenuado, sin texto nuevo) | [ ] |
| H11a. Marca del umbral casi invisible sobre el verde | media | valor y descripción | «Barra de combustible» (marca en `--color-texto` y más alta) | [ ] |

## Prioridad 4 · Pulido de estados

| Hallazgo | Severidad | Tipo de cambio | Qué se toca en DESIGN.md | Tu decisión |
| --- | --- | --- | --- | --- |
| H12. Sin foco ni resumen tras un envío fallido | baja | spec/código | «Campo de formulario» (orden de lectura del error); el movimiento del foco va a la spec | [ ] |
| H15. Estados de la flota sin anuncio ni altura común | baja | descripción y spec/código | «Estados de la flota» (altura mínima común); el `role="status"` va a la spec | [ ] |

## Prioridad 5 · Propuestas con texto o componente nuevo

Cada una necesita tu aprobación expresa antes de entrar a una dirección.

| Hallazgo | Severidad | Tipo de cambio | Qué añadiría | Tu decisión |
| --- | --- | --- | --- | --- |
| H4. No hay lectura de conjunto | media | propuesta | Conteo «n aptas, m no aptas» en el encabezado: texto y probablemente un componente nuevo | [ ] aprobar  [ ] descartar |
| H10b. El selector «Nave» deja elegir naves no aptas | media | propuesta | Mostrar la aptitud de la nave elegida junto al selector: texto nuevo | [ ] aprobar  [ ] descartar |
| H11b. El umbral no tiene leyenda | media | propuesta | Leyenda «mín. 25 %» en la barra: texto nuevo | [ ] aprobar  [ ] descartar |

## Prioridad 6 · Identidad y documentación

| Hallazgo | Severidad | Tipo de cambio | Qué se toca | Tu decisión |
| --- | --- | --- | --- | --- |
| H13. Identidad intercambiable | baja | descripción | Layout «Encabezado» (título mayor y filete debajo; «Control de despegues» se queda bajo el título, sin etiqueta encima) | [ ] |
| H14. El brand board ya difiere de la app y de DESIGN.md | baja | descripción | Declarar que DESIGN.md manda; el board nuevo de `sistema/` usa solo tokens, sin estilos en línea | [ ] |

## Decisiones que se tocan entre sí

- **H1 contra H3.** Una insignia más grande y un borde de color piden espacio; una tarjeta más compacta lo quita. Se deciden juntas.
- **H1 y H7 tocan «Botón».** El ancho de contenido y el hover van en una sola descripción.
- **H2 refuerza a H9.** Con Flota primero en pantalla angosta, la tarjeta nueva queda a la vista sin más cambios.
- **H5 cambia el orden fijo de §6.7.** Es una descripción del componente, no su nombre; D-04 solo exige que los motivos se muestren, no dónde.

## Para las tres direcciones

- Cada dirección debe resolver **H1, H5 y H6 de forma distinta**; es donde pesa tu prioridad.
- **H2 a H14** se comparten entre las tres, salvo las propuestas de la prioridad 5 que apruebes.
- **Fuera de las direcciones:** H12 y las partes spec/código de H9 y H15, que van a la spec y no a un diseño.
