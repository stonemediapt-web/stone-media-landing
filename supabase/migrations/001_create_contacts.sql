-- Tabela para guardar submissões do formulário de contacto
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  service     text not null,
  message     text
);

-- Habilitar Row Level Security
alter table public.contacts enable row level security;

-- Permitir que qualquer visitante (anon) insira um contacto
create policy "Anon can insert contacts"
  on public.contacts
  for insert
  to anon
  with check (true);

-- Apenas utilizadores autenticados podem ver os contactos
create policy "Authenticated can read contacts"
  on public.contacts
  for select
  to authenticated
  using (true);
