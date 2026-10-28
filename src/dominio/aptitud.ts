import type { Nave } from '../types/nave';
import type { Aptitud, MotivoRechazo } from '../types/mision';

export const COMBUSTIBLE_MINIMO = 25;
export const MAX_MISIONES_SIN_REVISION = 3;

export const MENSAJES_MOTIVO: Record<MotivoRechazo, string> = {
  combustible_insuficiente: 'Combustible insuficiente: necesita al menos un 25 %.',
  revision_pendiente: 'Necesita revisión: lleva más de 3 misiones desde la última.',
  en_reparacion: 'La nave está en reparación.',
};

// Regla R1 del PRD: acumula todos los motivos por los que la nave no es apta
export function puedeRecibirMision(
  nave: Pick<Nave, 'combustible' | 'enReparacion'>,
  misionesDesdeRevision: number,
): Aptitud {
  const motivos: MotivoRechazo[] = [];

  if (nave.combustible < COMBUSTIBLE_MINIMO) motivos.push('combustible_insuficiente');
  if (misionesDesdeRevision > MAX_MISIONES_SIN_REVISION) motivos.push('revision_pendiente');
  if (nave.enReparacion) motivos.push('en_reparacion');

  return motivos.length === 0 ? { puede: true } : { puede: false, motivos };
}
