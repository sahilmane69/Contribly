create table if not exists public.github_skill_profiles (
  id uuid primary key default gen_random_uuid(),
  github_id text not null unique references public.profiles(github_id) on delete cascade,
  repositories jsonb not null default '[]'::jsonb,
  languages jsonb not null default '{}'::jsonb,
  pull_requests jsonb not null default '[]'::jsonb,
  contributions jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  expertise_score integer not null default 0 check (expertise_score >= 0 and expertise_score <= 100),
  technologies text[] not null default '{}',
  interest_categories text[] not null default '{}',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.github_skill_profiles enable row level security;

create index if not exists github_skill_profiles_github_id_idx
  on public.github_skill_profiles (github_id);

revoke all on table public.github_skill_profiles from anon, authenticated;
