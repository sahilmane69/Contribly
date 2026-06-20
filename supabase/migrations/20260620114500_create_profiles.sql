create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  github_id text not null unique,
  username text,
  avatar text,
  name text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create index if not exists profiles_github_id_idx on public.profiles (github_id);

revoke all on table public.profiles from anon, authenticated;
