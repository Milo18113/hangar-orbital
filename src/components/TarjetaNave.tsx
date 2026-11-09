import { MENSAJES_MOTIVO } from '../dominio/aptitud';
import type { Aptitud } from '../types/mision';
import type { Nave } from '../types/nave';
import BarraCombustible from './BarraCombustible';
import ContadorMisiones from './ContadorMisiones';

interface Props {
  nave: Nave;
  misiones: number;
  aptitud: Aptitud;
}

export default function TarjetaNave({ nave, misiones, aptitud }: Props) {
  return (
    <li className="tarjeta-nave">
      <div className="tarjeta-cabecera">
        <h3>{nave.nombre}</h3>
        {aptitud.puede ? (
          <span className="insignia insignia--apta">Apta</span>
        ) : (
          <span className="insignia insignia--no-apta">No apta</span>
        )}
      </div>
      <span className="clase">{nave.clase}</span>
      <BarraCombustible combustible={nave.combustible} />
      <ContadorMisiones misiones={misiones} />
      <hr className="divisor" />
      {nave.enReparacion ? (
        <span>
          <span className="insignia insignia--reparacion">En reparación</span>
        </span>
      ) : (
        <span className="estado-operativa">Operativa</span>
      )}
      {!aptitud.puede && (
        <ul className="motivos">
          {aptitud.motivos.map((motivo) => (
            <li key={motivo}>{MENSAJES_MOTIVO[motivo]}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
