# Verificación de la interfaz · Spec 02

Esta guía verifica, criterio por criterio, [docs/specs/02-interfaz-flota.md](specs/02-interfaz-flota.md) (HU-1.2 y los criterios D-01 a D-10 de [DESIGN.md](../DESIGN.md)) en la app real, contra Supabase. Complementa a [docs/VERIFICACION.md](VERIFICACION.md), que verifica la spec 01.

## Antes de empezar
1. Las variables de `.env.example` están escritas, con la URL y la clave pública de Supabase, en tu `.env.local`.
2. La migración `supabase/migraciones/001_hangar.sql` está aplicada: el Table Editor muestra `naves` y `misiones`.
3. Las tablas `naves` y `misiones` están vacías. U-05 necesita la flota vacía. Si ya recorriste `docs/VERIFICACION.md`, borra en el Table Editor primero las filas de `misiones` y luego las de `naves`.
4. La app está arrancada con `npm run dev` y abierta en la URL que indique la terminal.
5. Para ver la app a 390 px, usa el modo responsive de las herramientas de desarrollo del navegador.
6. Las fuentes vienen de Google Fonts. Sin conexión se ven las de respaldo, y eso no cuenta como fallo.

Las filas van en orden: cada una parte del estado que dejó la anterior. "Mañana" se cuenta desde la fecha del día de la prueba. En "Resultado obtenido", anota **Cumple** o **Falla** y, si falla, lo que viste.

## Comandos y revisión de código

| # | Criterio | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| U-01 | D-01 | En la raíz del proyecto: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.css --include=*.tsx` | Solo aparece `src/styles/tokens.css`. | **Cumple** (Claude, 2026-11-09). El comando devuelve 15 líneas y todas son de `src/styles/tokens.css`. Ningún otro archivo contiene un hexadecimal. |
| U-02 | D-02 | En la raíz del proyecto: `grep -rn "style={" src` | Una sola coincidencia: el ancho del relleno de la barra de combustible. | **Cumple** (Claude, 2026-11-09). Una sola coincidencia: `src/components/BarraCombustible.tsx:25`, ``style={{ width: `${combustible}%` }}``. |
| U-03 | I-01 | `grep -n "aria-describedby" src/components/Formulario*.tsx` | Tres coincidencias en `FormularioNave.tsx` y cuatro en `FormularioMision.tsx`, una por campo. Cada una apunta al id del mensaje de su campo, y solo cuando ese campo tiene error. | |
| U-04 | I-02 | Ejecutar `npm test`, `npm run build` y `git diff --stat -- src/services src/lib supabase`. Después, `git diff --stat -- src/dominio`. | Los tests pasan (44) y el build compila. El primer `git diff` no muestra nada. El segundo, si muestra algo, es solo de la corrección del límite de misiones (`aptitud.ts` y `aptitud.test.ts`), no de la interfaz. | |

## Con la flota vacía (HU-1.2)

| # | Criterio | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| U-05 | HU-1.2-CA9 | Abrir la app con las tablas vacías. | En la sección «Flota» aparece «Todavía no hay naves registradas.», sin ninguna nave. Se ve como el estado vacío de `DESIGN.md` §6.9: un recuadro de borde punteado con el texto centrado. | |

## Preparar la flota de prueba
Estas naves no pueden existir ya en la base. Regístralas con el formulario, **en este orden**, para comprobar después que la flota las ordena por nombre:

| Orden | Nave | Clase | Combustible | Cómo dejarla |
|---|---|---|---|---|
| 1 | Cometa | transporte | 25 % | Solo registrarla. |
| 2 | Altair | carguera | 80 % | Solo registrarla. |
| 3 | Eris | exploradora | 60 % | Registrarla y, en el Table Editor de Supabase, poner `en_reparacion = true`. Recargar la app. |
| 4 | Bruma | exploradora | 10 % | Solo registrarla. |
| 5 | Deneb | carguera | 60 % | Registrarla y asignarle tres misiones válidas (destino Luna, despegue mañana, 1 día). |

Estado esperado de cada una, que es lo que comprueban las filas siguientes:

| Nave | Aptitud | Misiones | Estado | Motivos |
|---|---|---|---|---|
| Altair | Apta | 0 de 3 | Operativa | — |
| Bruma | No apta | 0 de 3 | Operativa | Combustible insuficiente |
| Cometa | Apta | 0 de 3 | Operativa | — |
| Deneb | No apta | 3 de 3 | Operativa | Necesita revisión |
| Eris | No apta | 0 de 3 | En reparación | La nave está en reparación |

## Con la flota de prueba (HU-1.2)

| # | Criterio | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| U-06 | HU-1.2-CA1, CA2 | Mirar la flota completa, a 1280 px. | Aparecen las cinco naves, en el orden Altair, Bruma, Cometa, Deneb, Eris, aunque se registraron en otro orden. Cada una muestra su nombre, su clase, su combustible en %, «n de 3» y «Operativa» o «En reparación». | |
| U-07 | HU-1.2-CA3, D-03 | Mirar la aptitud de cada nave sin pulsar nada. Después, en las herramientas de desarrollo, abrir Rendering → Emulate vision deficiencies → Achromatopsia y mirar otra vez. | Altair y Cometa dicen «Apta»; Bruma, Deneb y Eris dicen «No apta». La palabra está en la esquina superior derecha de cada tarjeta, en el mismo sitio en todas, y se sigue distinguiendo con los colores desactivados. | |
| U-08 | HU-1.2-CA4, D-04 | Leer el final de cada tarjeta. | Altair y Cometa no muestran motivos. Bruma: «Combustible insuficiente: necesita al menos un 25 %.». Deneb: «Necesita revisión: ya tiene 3 misiones desde la última.». Eris: «La nave está en reparación.». | |
| U-09 | HU-1.2-CA5, D-05 | Comparar la barra de combustible de Bruma (10 %) con la de Cometa (25 %). En el código, abrir `BarraCombustible.tsx`. | Las dos barras tienen una marca en el mismo punto, el del mínimo. El relleno de Bruma se pinta como bajo (rojo) y el de Cometa no, aunque está justo en el mínimo. A la derecha se leen «10 %» y «25 %». En el inspector, cada barra tiene `role="meter"`, su `aria-valuenow` y `aria-label="Combustible"`. El archivo importa `COMBUSTIBLE_MINIMO` de `aptitud.ts` y no escribe un 25. | |
| U-10 | HU-1.2-CA6, D-06 | Comparar el contador de Altair con el de Deneb. En el código, abrir `ContadorMisiones.tsx`. | Altair muestra «0 de 3» con tres marcas vacías. Deneb muestra «3 de 3» con tres marcas llenas. El archivo importa `MAX_MISIONES_SIN_REVISION` de `aptitud.ts` y no escribe un 3. | |
| U-11 | HU-1.2-CA7 | Comparar el estado de Eris con el de Altair. | Eris muestra «En reparación», destacado. Altair muestra «Operativa» como texto simple, sin destacar. | |
| U-12 | HU-1.2-CA8 | Sin recargar la página, registrar Fobos (transporte, 70 %) y, después, asignarle una misión válida. | Fobos aparece al final de la flota apenas se registra, sin recargar. Tras asignarle la misión, su contador pasa a «1 de 3», también sin recargar. | |
| U-13 | HU-1.2-CA10 | En Network, elegir la velocidad «Slow 3G» y recargar la página. | Mientras llegan los datos se ve «Cargando la flota…», y desaparece cuando aparecen las naves. Volver la velocidad a «No throttling». | |
| U-14 | HU-1.2-CA11 | En el panel «Network request blocking» de las herramientas de desarrollo, bloquear el patrón `*/rest/v1/naves*` y recargar la página. | En «Flota» aparece «No se pudo cargar la flota.» como aviso de error, y no aparece ninguna nave. El panel «Asignar misión» puede mostrar el mismo aviso, porque también carga la flota. Quitar el bloqueo al terminar. | |

## Tamaños de pantalla y teclado

| # | Criterio | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| U-15 | HU-1.2-CA12, D-09 | Ver la app a 1280 px de ancho. En la consola del navegador, ejecutar `document.documentElement.scrollWidth <= window.innerWidth`. | Dos columnas: a la izquierda, «Registrar nave» y debajo «Asignar misión»; a la derecha, «Flota» con las tarjetas en una grilla. No hay barra de scroll horizontal y la consola responde `true`. | |
| U-16 | HU-1.2-CA12, D-09 | Ver la app a 390 px de ancho y repetir el comando de la consola. | Una sola columna, en este orden: «Registrar nave», «Asignar misión» y «Flota». Las tarjetas ocupan todo el ancho, nada se corta, no hay scroll horizontal y la consola responde `true`. | |
| U-17 | D-07 | Sin usar el ratón, recorrer la pantalla con Tab (y volver con Shift+Tab). Con el teclado, registrar una nave completa: elegir la clase con las flechas y enviar con Enter. | El foco pasa por Nombre, Clase, Combustible, «Registrar nave», Nave, Destino, Fecha de despegue, Duración y «Asignar misión», en ese orden. Todo control muestra el foco en cian, con un contorno separado del borde. La nave se registra sin tocar el ratón. | |
| U-18 | D-08 | Pulsar «Registrar nave» con el formulario vacío y, después, «Asignar misión» con el suyo vacío. Inspeccionar los campos con error. | Los tres campos de la nave y los cuatro de la misión se ven con borde rojo y, debajo, su mensaje en rojo. Cada campo tiene `aria-invalid="true"` y su `aria-describedby` apunta al id del mensaje. | |
| U-19 | D-10 | Repetir en esta flota las comprobaciones de texto de V-02, V-03, V-09, V-10 y V-11 de `docs/VERIFICACION.md` (con Altair en lugar de Aurora y Bruma en lugar de Ceniza). | Cada aviso, confirmación y motivo coincide, carácter por carácter, con el «Resultado esperado» de esa fila. | |

## Cierre
- [ ] Todas las filas tienen anotado su resultado obtenido.
- [ ] Las filas que no coincidan con el resultado esperado están anotadas como fallo, con lo que se vio.
- [ ] Copiar el resultado a la sección de la spec 02 de `docs/AUDITORIA.md` y repetir la auditoría.
