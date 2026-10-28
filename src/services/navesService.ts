import { supabase } from '../lib/supabase';
import { esClaseNave, validarNave } from '../dominio/nave';
import type { BorradorNave, ErroresNave, Nave } from '../types/nave';

export interface FilaNave {
  id: string;
  nombre: string;
  clase: string;
  combustible: number;
  en_reparacion: boolean;
  ultima_revision: string;
  created_at: string;
}

export type ResultadoCrearNave = { ok: true; nave: Nave } | { ok: false; errores: ErroresNave };

export const COLUMNAS_NAVE =
  'id, nombre, clase, combustible, en_reparacion, ultima_revision, created_at';

// Código de Postgres para la violación de una restricción unique
const VIOLACION_UNICIDAD = '23505';

export function aNave(fila: FilaNave): Nave {
  if (!esClaseNave(fila.clase)) {
    throw new Error(`Clase de nave desconocida: ${fila.clase}`);
  }
  return {
    id: fila.id,
    nombre: fila.nombre,
    clase: fila.clase,
    combustible: fila.combustible,
    enReparacion: fila.en_reparacion,
    ultimaRevision: fila.ultima_revision,
    createdAt: fila.created_at,
  };
}

async function listar(): Promise<Nave[]> {
  const { data, error } = await supabase
    .from('naves')
    .select(COLUMNAS_NAVE)
    .order('nombre')
    .overrideTypes<FilaNave[], { merge: false }>();
  if (error) throw new Error(error.message);
  return data.map(aNave);
}

async function crear(borrador: BorradorNave): Promise<ResultadoCrearNave> {
  const limpio: BorradorNave = { ...borrador, nombre: borrador.nombre.trim() };
  const errores = validarNave(limpio);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const { data, error } = await supabase
    .from('naves')
    .insert({ nombre: limpio.nombre, clase: limpio.clase, combustible: limpio.combustible })
    .select(COLUMNAS_NAVE)
    .single()
    .overrideTypes<FilaNave, { merge: false }>();

  if (error) {
    if (error.code === VIOLACION_UNICIDAD) {
      return { ok: false, errores: { nombre: 'Ya existe una nave con ese nombre.' } };
    }
    throw new Error(error.message);
  }
  return { ok: true, nave: aNave(data) };
}

export const navesService = { listar, crear };
