# Verificación en el navegador · Spec 01

Esta guía verifica, criterio por criterio, [docs/specs/01-flota-y-misiones.md](specs/01-flota-y-misiones.md) (HU-1.1 y HU-1.3) en la app real, contra Supabase.

## Antes de empezar
1. `.env.local` existe con la URL y la clave pública de Supabase.
2. La migración `supabase/migraciones/001_hangar.sql` está aplicada.
3. Las tablas `naves` y `misiones` están vacías, o al menos no contienen naves llamadas Aurora, Boreal, Ceniza ni Duna.
4. La app está arrancada con `npm run dev` y abierta en la URL que indique la terminal.

Las filas van en orden: cada una parte del estado que dejó la anterior. "Mañana" y "ayer" se cuentan desde la fecha del día de la prueba. Si el selector de fecha no deja elegir un día pasado, escribe la fecha a mano.

## Registrar una nave (HU-1.1)

| # | Criterio | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| V-01 | HU-1.1-CA2 | Abrir el selector "Clase" del formulario de registro. | Solo aparecen "Elige una clase", exploradora, carguera y transporte. | |
| V-02 | HU-1.1-CA5, CA6, CA7 | Pulsar "Registrar nave" con el formulario vacío. | No se registra nada. Aparecen tres avisos: «Escribe el nombre de la nave.», «Elige la clase de la nave: exploradora, carguera o transporte.» e «Indica el combustible de la nave.». | |
| V-03 | HU-1.1-CA1 | Registrar Aurora, clase carguera, 80 % de combustible. | Aparece «Nave «Aurora» registrada.» y el formulario se vacía. En la flota, Aurora sale con carguera, 80 %, 0 misiones, "Operativa" y "Apta". | |
| V-04 | HU-1.1-CA8 | Registrar Boreal, clase exploradora, 120 % de combustible. | No se registra. Aparece «El combustible debe ser un número entero entre 0 y 100.» y Boreal no sale en la flota. | |
| V-05 | HU-1.1-CA8 | Registrar Boreal, clase exploradora, 24,5 % de combustible. | No se registra y aparece el mismo aviso de rango. | |
| V-06 | HU-1.1-CA9 | Registrar Aurora otra vez, clase transporte, 50 % de combustible. | No se registra. Aparece «Ya existe una nave con ese nombre.» y en la flota sigue habiendo una sola Aurora. | |
| V-07 | HU-1.1-CA4 | Registrar Ceniza, clase exploradora, 10 % de combustible. | Se registra. En la flota sale como "No apta", con el motivo «Combustible insuficiente: necesita al menos un 25 %.». | |
| V-08 | HU-1.1-CA3 | Registrar Duna, clase transporte, 25 % de combustible. | Se registra. En la flota sale como "Apta". | |

## Asignar una misión (HU-1.3)

| # | Criterio | Pasos | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| V-09 | HU-1.3-CA9 | Pulsar "Asignar misión" con el formulario vacío. | No se asigna nada. Aparecen «Elige la nave.», «Escribe el destino.», «Indica la fecha de despegue.» e «Indica la duración en días.». | |
| V-10 | HU-1.3-CA1 | Asignar a Aurora una misión a Estación Kepler, despegue mañana, 5 días. | Aparece «Misión a Estación Kepler asignada a «Aurora»: despega el {fecha de mañana}, 5 días.». En la flota, Aurora pasa a 1 misión y sigue "Apta". | |
| V-11 | HU-1.3-CA5 | Asignar a Ceniza (10 %) una misión válida: destino Luna, mañana, 3 días. | Se rechaza con «No se puede asignar la misión a «Ceniza»:» y el motivo de combustible insuficiente. Ceniza sigue con 0 misiones. | |
| V-12 | HU-1.3-CA6 | Asignar a Duna (25 %) una misión válida: destino Marte, mañana, 3 días. | Se acepta y aparece la confirmación. Duna pasa a 1 misión y sigue "Apta". | |
| V-13 | HU-1.3-CA10 | Asignar a Duna una misión con despegue hoy, destino Fobos, 2 días. | Se acepta. | |
| V-14 | HU-1.3-CA11 | Asignar a Duna una misión con despegue ayer, destino Deimos, 2 días. | No se asigna. Aparece «La fecha de despegue no puede ser anterior a hoy.». Duna no suma misiones. | |
| V-15 | HU-1.3-CA13 | Asignar a Duna una misión con duración 0, despegue mañana, destino Ceres. | No se asigna. Aparece «La duración debe ser un número entero de días, como mínimo 1.». | |
| V-16 | HU-1.3-CA12 | Asignar a Duna una misión con duración 1, despegue mañana, destino Ceres. | Se acepta. La confirmación dice «1 día». Duna queda con 3 misiones. | |
| V-17 | HU-1.3-CA2 | Asignar a Aurora una segunda misión válida y, cuando la flota muestre 2, una tercera. | Tras la tercera, Aurora muestra 3 misiones y sigue "Apta". | |
| V-18 | HU-1.3-CA3 | Asignar a Aurora una cuarta misión válida. Ahora mismo tiene 3. | **Se acepta**: con 3 misiones la nave sigue apta. Después, la flota muestra a Aurora con 4 misiones y "No apta", con el motivo «Necesita revisión: lleva más de 3 misiones desde la última.». | |
| V-19 | HU-1.3-CA4 | Asignar a Aurora una quinta misión válida. Ahora mismo tiene 4. | Se rechaza con el motivo de revisión. Aurora sigue con 4 misiones. | |
| V-20 | HU-1.3-CA8 | En el panel de Supabase, poner el combustible de Aurora a 10. Recargar la app e intentar asignarle una misión válida. | Se rechaza con los dos motivos a la vez: combustible insuficiente y revisión. | |
| V-21 | HU-1.3-CA7 | En el panel de Supabase, poner `en_reparacion = true` en Duna. Recargar e intentar asignarle una misión válida. | Se rechaza con «La nave está en reparación.». En la flota, Duna sale como "En reparación" y "No apta". | |

## Cierre
- [ ] Todas las filas tienen anotado su resultado obtenido.
- [ ] Las filas que no coincidan con el resultado esperado están anotadas como fallo, con lo que se vio.
- [ ] Copiar el resultado a la sección "Resultados" de la spec 01.
