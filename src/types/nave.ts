export const CLASES_NAVE = ['exploradora', 'carguera', 'transporte'] as const;
export type ClaseNave = (typeof CLASES_NAVE)[number];

export interface Nave {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number; // entero de 0 a 100
  enReparacion: boolean;
  ultimaRevision: string; // ISO 8601
  createdAt: string; // ISO 8601
}

// Lo que escribe el jefe en el formulario, antes de validar
export interface BorradorNave {
  nombre: string;
  clase: string;
  combustible: number | null;
}

export type ErroresNave = Partial<Record<keyof BorradorNave, string>>;
