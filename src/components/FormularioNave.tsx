import { useState } from 'react';
import { navesService } from '../services/navesService';
import { CLASES_NAVE, type ErroresNave } from '../types/nave';

interface Props {
  onRegistrada: () => void;
}

interface Aviso {
  tipo: 'exito' | 'error';
  texto: string;
}

export default function FormularioNave({ onRegistrada }: Props) {
  const [nombre, setNombre] = useState('');
  const [clase, setClase] = useState('');
  const [combustible, setCombustible] = useState('');
  const [errores, setErrores] = useState<ErroresNave>({});
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function registrar() {
    setAviso(null);
    setEnviando(true);
    try {
      const resultado = await navesService.crear({
        nombre,
        clase,
        combustible: combustible === '' ? null : Number(combustible),
      });
      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
      setErrores({});
      setNombre('');
      setClase('');
      setCombustible('');
      setAviso({ tipo: 'exito', texto: `Nave «${resultado.nave.nombre}» registrada.` });
      onRegistrada();
    } catch {
      setAviso({ tipo: 'error', texto: 'No se pudo registrar la nave. Inténtalo de nuevo.' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    // noValidate: los mensajes los da validarNave, no el navegador
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void registrar();
      }}
    >
      <p>
        <label htmlFor="nave-nombre">Nombre</label>
        <input id="nave-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <span role="alert">{errores.nombre}</span>}
      </p>

      <p>
        <label htmlFor="nave-clase">Clase</label>
        <select id="nave-clase" value={clase} onChange={(e) => setClase(e.target.value)}>
          <option value="">Elige una clase</option>
          {CLASES_NAVE.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errores.clase && <span role="alert">{errores.clase}</span>}
      </p>

      <p>
        <label htmlFor="nave-combustible">Combustible (%)</label>
        <input
          id="nave-combustible"
          type="number"
          min={0}
          max={100}
          step={1}
          value={combustible}
          onChange={(e) => setCombustible(e.target.value)}
        />
        {errores.combustible && <span role="alert">{errores.combustible}</span>}
      </p>

      <button type="submit" disabled={enviando}>
        Registrar nave
      </button>
      {aviso && <p role={aviso.tipo === 'error' ? 'alert' : 'status'}>{aviso.texto}</p>}
    </form>
  );
}
