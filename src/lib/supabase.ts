import { createClient } from '@supabase/supabase-js';

// La URL y la clave pública (anon) llegan desde .env.local; ver .env.example
const url = import.meta.env.VITE_SUPABASE_URL;
const clavePublica = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !clavePublica) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Cópialas de .env.example a .env.local.',
  );
}

export const supabase = createClient(url, clavePublica);
