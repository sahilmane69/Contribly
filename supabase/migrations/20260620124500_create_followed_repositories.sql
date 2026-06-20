create table if not exists public.followed_repositories (
  id uuid primary key default gen_random_uuid(),
  github_id text not null references public.profiles(github_id) on delete cascade,
  repository_id text not null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (github_id, repository_id)
);

alter table public.followed_repositories enable row level security;

create index if not exists followed_repositories_github_id_idx
  on public.followed_repositories (github_id);

create index if not exists followed_repositories_repository_id_idx
  on public.followed_repositories (repository_id);

revoke all on table public.followed_repositories from anon, authenticated;
