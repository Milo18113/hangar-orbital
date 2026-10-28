-- Hangar Orbital · Migración 001 · Spec 01 (flota y misiones)

-- Naves del hangar
create table naves (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null unique check (char_length(btrim(nombre)) > 0),
  clase           text not null check (clase in ('exploradora', 'carguera', 'transporte')),
  combustible     integer not null check (combustible between 0 and 100),
  en_reparacion   boolean not null default false,
  ultima_revision timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Misiones asignadas a una nave
create table misiones (
  id             uuid primary key default gen_random_uuid(),
  nave_id        uuid not null references naves (id),
  destino        text not null check (char_length(btrim(destino)) > 0),
  fecha_despegue date not null,
  duracion_dias  integer not null check (duracion_dias >= 1),
  created_at     timestamptz not null default now()
);

create index misiones_nave_id_created_at_idx on misiones (nave_id, created_at);

-- RLS
-- Temporal: sin inicio de sesión, anon solo puede leer e insertar. Pasará a authenticated cuando haya usuarios.
alter table naves enable row level security;
alter table misiones enable row level security;

create policy "anon puede leer naves"
  on naves for select to anon using (true);
create policy "anon puede insertar naves"
  on naves for insert to anon with check (true);

create policy "anon puede leer misiones"
  on misiones for select to anon using (true);
create policy "anon puede insertar misiones"
  on misiones for insert to anon with check (true);
