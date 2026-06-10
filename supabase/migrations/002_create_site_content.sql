create table if not exists public.site_content (
  id int primary key default 1,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read content" on public.site_content
  for select to anon using (true);

create policy "Authenticated can update content" on public.site_content
  for update to authenticated using (true);

create policy "Authenticated can insert content" on public.site_content
  for insert to authenticated with check (true);
