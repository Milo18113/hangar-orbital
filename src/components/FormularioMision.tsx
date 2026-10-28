import { useEffect, useState } from 'react';
import { MENSAJES_MOTIVO } from '../dominio/aptitud';
import { fechaLocalHoy } from '../lib/fecha';
import { misionesService } from '../services/misionesService';
import { navesService } from '../services/navesService';
import type { ErroresMision, MotivoRechazo } from '../types/mision';
import type { Nave } from '../types/nave';

interface Props {
  // Cambia cada vez que se registra una nave, para recargar el selector
  version: number;
  onAsignada: () => void;
}

interface Aviso {
  tipo: 'exito' | 'error';
  texto: string;
}

interface Rechazo {
  nombreNave: string;
  motivos: MotivoRechazo[];
}

export default function FormularioMision({ version, onAsignada }: Props) {
  const [naves, setNaves] = useState<Nave[]>([]);
  const [naveId, setNaveId] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaDespegue, setFechaDespegue] = useState('');
  const [duracion, setDuracion] = useState('');
  const [errores, setErrores] = useState<ErroresMision>({});
  const [rechazo, setRechazo] = useState<Rechazo | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);

  const hoy = fechaLocalHoy();

  useEffect(() => {
    let cancelado = false;
    navesService
      .listar()
      .then((lista) => {
        if (!cancelado) setNaves(lista);
      })
      .catch(() => {
        if (!cancelado) setAviso({ tipo: 'error', texto: 'No se pudo cargar la flota.' });
      });
    return () => {
      cancelado = true;
    };
  }, [version]);

  const nombreDe = (id: string) => naves.find((n) => n.id === id)?.nombre ?? 'la nave';

  async function asignar() {
    setAviso(null);
    setRechazo(null);
    setEnviando(true);
    try {
      const resultado = await misionesService.crear(
        {
          naveId,
          destino,
          fechaDespegue,
          duracionDias: duracion === '' ? null : Number(duracion),
        },
        hoy,
      );

      switch (resultado.estado) {
        case 'datos_invalidos':
          setErrores(resultado.errores);
          break;
        case 'nave_no_apta':
          setErrores({});
          setRechazo({ nombreNave: nombreDe(naveId), motivos: resultado.motivos });
          break;
        case 'creada': {
          const { mision } = resultado;
          const dias = mision.duracionDias === 1 ? 'día' : 'días';
          setErrores({});
          setNaveId('');
          setDestino('');
          setFechaDespegue('');
          setDuracion('');
          setAviso({
            tipo: 'exito',
            texto: `Misión a ${mision.destino} asignada a «${nombreDe(mision.naveId)}»: despega el ${mision.fechaDespegue}, ${mision.duracionDias} ${dias}.`,
          });
          onAsignada();
          break;
        }
      }
    } catch {
      setAviso({ tipo: 'error', texto: 'No se pudo asignar la misión. Inténtalo de nuevo.' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    // noValidate: los mensajes los da validarMision, no el navegador
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void asignar();
      }}
    >
      <p>
        <label htmlFor="mision-nave">Nave</label>
        <select id="mision-nave" value={naveId} onChange={(e) => setNaveId(e.target.value)}>
          <option value="">Elige una nave</option>
          {naves.map((nave) => (
            <option key={nave.id} value={nave.id}>
              {nave.nombre}
            </option>
          ))}
        </select>
        {errores.naveId && <span role="alert">{errores.naveId}</span>}
      </p>

      <p>
        <label htmlFor="mision-destino">Destino</label>
        <input id="mision-destino" value={destino} onChange={(e) => setDestino(e.target.value)} />
        {errores.destino && <span role="alert">{errores.destino}</span>}
      </p>

      <p>
        <label htmlFor="mision-fecha">Fecha de despegue</label>
        <input
          id="mision-fecha"
          type="date"
          min={hoy}
          value={fechaDespegue}
          onChange={(e) => setFechaDespegue(e.target.value)}
        />
        {errores.fechaDespegue && <span role="alert">{errores.fechaDespegue}</span>}
      </p>

      <p>
        <label htmlFor="mision-duracion">Duración (días)</label>
        <input
          id="mision-duracion"
          type="number"
          min={1}
          step={1}
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
        />
        {errores.duracionDias && <span role="alert">{errores.duracionDias}</span>}
      </p>

      <button type="submit" disabled={enviando}>
        Asignar misión
      </button>

      {rechazo && (
        <div role="alert">
          <p>No se puede asignar la misión a «{rechazo.nombreNave}»:</p>
          <ul>
            {rechazo.motivos.map((motivo) => (
              <li key={motivo}>{MENSAJES_MOTIVO[motivo]}</li>
            ))}
          </ul>
        </div>
      )}
      {aviso && <p role={aviso.tipo === 'error' ? 'alert' : 'status'}>{aviso.texto}</p>}
    </form>
  );
}
