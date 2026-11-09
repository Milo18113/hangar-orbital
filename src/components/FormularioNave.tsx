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
      className="formulario"
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        void registrar();
      }}
    >
      <div className="campo">
        <label htmlFor="nave-nombre">Nombre</label>
        <input
          id="nave-nombre"
          className="campo-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={errores.nombre ? 'nave-nombre-error' : undefined}
        />
        {errores.nombre && (
          <span id="nave-nombre-error" className="campo-error" role="alert">
            {errores.nombre}
          </span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="nave-clase">Clase</label>
        <select
          id="nave-clase"
          className="campo-control"
          value={clase}
          onChange={(e) => setClase(e.target.value)}
          aria-invalid={errores.clase ? true : undefined}
          aria-describedby={errores.clase ? 'nave-clase-error' : undefined}
        >
          <option value="">Elige una clase</option>
          {CLASES_NAVE.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errores.clase && (
          <span id="nave-clase-error" className="campo-error" role="alert">
            {errores.clase}
          </span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="nave-combustible">Combustible (%)</label>
        <input
          id="nave-combustible"
          className="campo-control campo-control--cifra"
          type="number"
          min={0}
          max={100}
          step={1}
          value={combustible}
          onChange={(e) => setCombustible(e.target.value)}
          aria-invalid={errores.combustible ? true : undefined}
          aria-describedby={errores.combustible ? 'nave-combustible-error' : undefined}
        />
        {errores.combustible && (
          <span id="nave-combustible-error" className="campo-error" role="alert">
            {errores.combustible}
          </span>
        )}
      </div>

      <button className="boton boton--primario" type="submit" disabled={enviando}>
        Registrar nave
      </button>
      {aviso && (
        <p
          className={`aviso aviso--${aviso.tipo}`}
          role={aviso.tipo === 'error' ? 'alert' : 'status'}
        >
          {aviso.texto}
        </p>
      )}
    </form>
  );
}
