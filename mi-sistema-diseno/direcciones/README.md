# Tres direcciones visuales para Hangar Orbital

Salen de [la crítica 01](../criticas/01-critica-actual.md) y su [clasificación](../criticas/02-clasificacion.md). Tu prioridad fue la jerarquía de la aptitud (H1, H5, H6), así que **las tres difieren en cómo la resuelven**; el resto de decisiones se comparte.

Cada archivo es una maqueta HTML autocontenida con la flota de 9 naves de ejemplo (Altair a Ícaro), los dos formularios y una sección «Estados de muestra». Ábrelos en el navegador; las fuentes vienen de Google Fonts.

| Dirección | Archivo | Idea en una frase |
| --- | --- | --- |
| 1 · Consola calma | [direccion-1-consola-calma.html](direccion-1-consola-calma.html) | El sistema actual, con el veredicto escrito en el campo de color de toda la tarjeta. |
| 2 · Señalización | [direccion-2-senalizacion.html](direccion-2-senalizacion.html) | Grafito sin color: lo único cromático son los estados, y la tarjeta abre con una banda de veredicto. |
| 3 · Registro de vuelo | [direccion-3-registro-de-vuelo.html](direccion-3-registro-de-vuelo.html) | La flota como registro de filas, con la aptitud como columna que se recorre con la vista. |

## Cómo resuelve cada una el eje

| | H1 · La aptitud domina | H5 · Motivos y estado triplicado | H6 · Dos ejes de estado |
| --- | --- | --- | --- |
| **1 · Consola calma** | La tarjeta No apta se tiñe con `--color-no-apta-fondo` y lleva borde `--color-no-apta`; la insignia sube a `--texto-sm` y 32 px de alto. | Motivos justo bajo la línea de clase, en `--color-texto`, antes de las barras. | Clase y estado operativo comparten una línea secundaria; el veredicto es lo único arriba a la derecha. |
| **2 · Señalización** | Banda superior a todo el ancho: verde tenue si es Apta, **sólida roja si es No apta**, con la palabra en `--texto-lg`. | Bloque tintado pegado a la banda; banda y motivos forman una sola zona de alarma. | Aptitud y estado operativo van apilados en la esquina de la banda; «En reparación» es un chip oscuro sobre el rojo. |
| **3 · Registro de vuelo** | Columna de bloques de color a la izquierda de cada fila (verde tenue o rojo sólido) y la fila No apta teñida entera. | Línea bajo el nombre, ocupando las columnas de datos, en `--color-texto`. | Clase y estado operativo bajo el nombre; las etiquetas «COMBUSTIBLE» y «MISIONES DESDE LA REVISIÓN» pasan a una cabecera de columna. |

## Lo que comparten las tres

- **H2:** Flota va antes que los formularios por debajo de 900 px (el DOM sigue el mismo orden que la pantalla).
- **H1:** el botón primario toma ancho de contenido en lugar de ancho completo.
- **H7:** hover definido para botón y campo, en 120 ms.
- **H8:** «enviando» no cambia el texto: opacidad 0.6, cursor de progreso y trazo punteado interior.
- **H9:** la tarjeta recién creada (Fobos) lleva borde `--color-acento`.
- **H10a:** el panel «Asignar misión» con la flota vacía se ve atenuado.
- **H11a:** la marca del umbral usa `--color-texto` y sobresale más de la pista.
- **H15:** los tres estados de la flota comparten altura mínima.
- **H3:** más naves por pantalla (3 por fila en las dos primeras, una fila por nave en la tercera).
- **Superficies del navegador:** selección, cursor de texto, `accent-color` y barra de scroll salen de la paleta.
- **Se conserva:** los nombres de tokens y componentes, los textos de la spec 01 (carácter por carácter), los estados escritos con palabras, la sección 7 y el tema oscuro.

## Qué cambia respecto a tu DESIGN.md

| | Valores de tokens que cambian | Decisiones o criterios de DESIGN.md que se reabren |
| --- | --- | --- |
| **1** | Solo `--texto-xl`: 1.75rem pasa a 2.25rem. | Ninguna. |
| **2** | Toda la paleta (grafito neutro, `--color-acento` en blanco hueso), `--fuente-titulo` (Barlow Condensed), `--fuente-texto` (Barlow), los cinco `--texto-*`, `--radio-sm` 2 px y `--radio-md` 4 px. | §3 «IBM Plex en tres variantes» (la mono se conserva). **D-07** dice «foco en cian»: pasaría a «foco en el color de acento». |
| **3** | Toda la paleta (índigo casi negro, `--color-acento` lila), `--fuente-titulo` y `--fuente-texto` (Public Sans), `--texto-lg` a 1.125rem. | §3 «Tarjetas en lugar de tabla» y la descripción de «Tarjeta de nave» (pasa a fila). **D-03** pide la aptitud «arriba a la derecha de su tarjeta»; aquí va a la izquierda de la fila. §3 «IBM Plex en tres variantes». |

Las medidas que usan las maquetas y que DESIGN.md no tiene como token (mínimo de grilla de 220 y 240 px, insignia de 32 y 40 px, filete de 2 px en la dirección 2, altura mínima de 7 rem en los estados, trazo punteado de «enviando») irían escritas en las descripciones de los componentes, no como tokens nuevos.

## Fuera de las maquetas, a propósito

- **Propuestas sin aprobar:** el conteo de aptas y no aptas (H4), la aptitud junto al selector «Nave» (H10b) y la leyenda del umbral (H11b). Añadirían texto o componentes; ninguna maqueta las incluye.
- **Spec o código, no diseño:** mover el foco tras un error (H12), `role="status"` en «Cargando la flota…» (H15), y limpiar el error viejo de la flota (H9).
- **H14:** no aplica a una maqueta; aplica al board que generes en `sistema/`.
- **H13:** el título crece y el subtítulo se queda debajo (sin etiqueta encima, que el piso de calidad de Impeccable prohíbe). En la 1 con filete fino; en la 2 con filete grueso y título condensado de 2.75rem; en la 3, título y subtítulo en una línea.
- **Secundario:** no hay botón secundario en ninguna maqueta; seguir o no con `.boton--secundario` sigue pendiente (H7).

## Medidas

Edge headless, fuentes cargadas, 9 naves de ejemplo (5 no aptas; Ícaro con tres motivos).

| | Alto de la sección Flota a 1280 px | Dónde empieza Flota a ancho angosto (518 px) | Scroll horizontal |
| --- | --- | --- | --- |
| Diseño actual | unos 1 370 px (5 filas de 261 px, estimado) | 965 px (medido en la crítica) | no |
| 1 · Consola calma | 953 px | 144 px | no |
| 2 · Señalización | 1 062 px | 156 px | no |
| 3 · Registro de vuelo | 1 020 px | 131 px | no |

## Límites

- Edge headless no baja de unos 518 px de ancho, así que no probé 390 px exactos; sí confirmé que el ancho de la página es igual al de la ventana.
- Foco y hover están simulados con clases en «Estados de muestra»; no recorrí las maquetas con teclado ni con lector de pantalla.
- Los contrastes de las tres paletas están calculados: texto sobre superficie 14,3 a 15,3:1; las parejas de estado y los bordes de control cumplen sus mínimos de DESIGN §4.1 en las tres.
- `impeccable detect`: sin hallazgos en las direcciones 1 y 2. En la 3 avisa «relleno justo» en el contenedor `.registro`, que es un falso positivo: cada fila y la cabecera tienen su propio relleno interior y el contenedor solo recorta las esquinas.
- No corrí `concept-seed` ni el flujo de identidad nueva de Impeccable: el sistema está fijado por tu `CLAUDE.md` y ese flujo escribe en `.impeccable/` dentro del proyecto. Las tres direcciones son variantes dentro de tu sistema, no identidades nuevas.
- Los archivos se generaron con un script del scratchpad; para cambiar algo, pídemelo y regenero las tres.
