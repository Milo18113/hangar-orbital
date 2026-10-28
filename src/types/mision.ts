export interface Mision {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string; // YYYY-MM-DD
  duracionDias: number; // entero >= 1
  createdAt: string; // ISO 8601
}

// Lo que escribe el jefe en el formulario, antes de validar
export interface BorradorMision {
  naveId: string;
  destino: string;
  fechaDespegue: string; // YYYY-MM-DD o ''
  duracionDias: number | null;
}

export type ErroresMision = Partial<Record<keyof BorradorMision, string>>;

export type MotivoRechazo = 'combustible_insuficiente' | 'revision_pendiente' | 'en_reparacion';

export type Aptitud = { puede: true } | { puede: false; motivos: MotivoRechazo[] };
