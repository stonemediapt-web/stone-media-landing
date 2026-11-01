-- Apaga pedidos de contacto com mais de 24 meses (ver Política de Privacidade, ponto 4).
-- Correr uma vez no SQL Editor do Supabase. Requer a extensão pg_cron.
create extension if not exists pg_cron;

select cron.schedule(
  'apagar-contactos-antigos',
  '0 3 * * 0',
  $$delete from public.contacts where created_at < now() - interval '24 months'$$
);
