-- Orçamentos da área de gestão (/gest)
create table if not exists public.quotes (
  id        text primary key,
  label     text not null default '',
  saved_at  bigint not null,
  data      jsonb not null default '{}'::jsonb
);

-- RLS ativo e sem políticas: só a service role key (usada pela API no Vercel) tem acesso.
-- A anon key pública do site não consegue ler nem escrever orçamentos.
alter table public.quotes enable row level security;
