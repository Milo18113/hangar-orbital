import { supabase } from '../lib/supabase';
import { puedeRecibirMision } from '../dominio/aptitud';
import { validarMision } from '../dominio/mision';
import { aNave, COLUMNAS_NAVE, type FilaNave } from './navesService';
import type { BorradorMision, ErroresMision, Mision, MotivoRechazo } from '../types/mision';
import type { Nave } from '../types/nave';

interface FilaMision {
  id: string;
  nave_id: string;
  destino: string;
  fecha_despegue: string;
  duracion_dias: number;
  created_at: string;
}

export type ResultadoCrearMision =
  | { estado: 'creada'; mision: Mision }
  | { estado: 'datos_invalidos'; errores: ErroresMision }
  | { estado: 'nave_no_apta'; motivos: MotivoRechazo[] };

const COLUMNAS_MISION = 'id, nave_id, destino, fecha_despegue, duracion_dias, created_at';

function aMision(fila: FilaMision): Mision {
  return {
    id: fila.id,
    naveId: fila.nave_id,
    destino: fila.destino,
    fechaDespegue: fila.fecha_despegue,
    duracionDias: fila.duracion_dias,
    createdAt: fila.created_at,
  };
}

// Misiones de la nave creadas después de su última revisión (R1 y R3)
async function contarDesdeRevision(nave: Pick<Nave, 'id' | 'ultimaRevision'>): Promise<number> {
  const { count, error } = await supabase
    .from('misiones')
    .select('id', { count: 'exact', head: true })
    .eq('nave_id', nave.id)
    .gt('created_at', nave.ultimaRevision);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function crear(borrador: BorradorMision, hoy: string): Promise<ResultadoCrearMision> {
  const errores = validarMision(borrador, hoy);
  if (Object.keys(errores).length > 0) return { estado: 'datos_invalidos', errores };

  // Se vuelve a leer la nave para no fiarse de una pantalla desactualizada
  const { data: filaNave, error: errorNave } = await supabase
    .from('naves')
    .select(COLUMNAS_NAVE)
    .eq('id', borrador.naveId)
    .single()
    .overrideTypes<FilaNave, { merge: false }>();
  if (errorNave) throw new Error(errorNave.message);

  const nave = aNave(filaNave);
  const aptitud = puedeRecibirMision(nave, await contarDesdeRevision(nave));
  if (!aptitud.puede) return { estado: 'nave_no_apta', motivos: aptitud.motivos };

  const { data, error } = await supabase
    .from('misiones')
    .insert({
      nave_id: borrador.naveId,
      destino: borrador.destino.trim(),
      fecha_despegue: borrador.fechaDespegue,
      duracion_dias: borrador.duracionDias,
    })
    .select(COLUMNAS_MISION)
    .single()
    .overrideTypes<FilaMision, { merge: false }>();
  if (error) throw new Error(error.message);

  return { estado: 'creada', mision: aMision(data) };
}

export const misionesService = { contarDesdeRevision, crear };
