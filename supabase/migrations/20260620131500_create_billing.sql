alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'team')),
  add column if not exists subscription_status text not null default 'inactive',
  add column if not exists current_period_end timestamptz,
  add column if not exists stripe_customer_id text;

create table if not exists public.plans (
  id text primary key,
  name text not null,
  description text,
  monthly_price integer not null default 0,
  stripe_price_id text,
  ai_recommendation_limit integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  github_id text not null references public.profiles(github_id) on delete cascade,
  plan text not null check (plan in ('free', 'pro', 'team')),
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  github_id text references public.profiles(github_id) on delete set null,
  stripe_event_id text unique,
  event_type text not null,
  plan text check (plan in ('free', 'pro', 'team')),
  status text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_events enable row level security;

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

create index if not exists subscriptions_github_id_idx
  on public.subscriptions (github_id);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

create index if not exists billing_events_github_id_idx
  on public.billing_events (github_id);

revoke all on table public.plans from anon, authenticated;
revoke all on table public.subscriptions from anon, authenticated;
revoke all on table public.billing_events from anon, authenticated;

insert into public.plans (
  id,
  name,
  description,
  monthly_price,
  stripe_price_id,
  ai_recommendation_limit
)
values
  (
    'free',
    'Free',
    'Starter plan for individual contributors.',
    0,
    null,
    20
  ),
  (
    'pro',
    'Pro',
    'AI contribution copilot for serious open-source builders.',
    9,
    nullif(current_setting('app.stripe_pro_price_id', true), ''),
    null
  ),
  (
    'team',
    'Team',
    'Collaboration analytics and maintainer workflows.',
    39,
    nullif(current_setting('app.stripe_team_price_id', true), ''),
    null
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  monthly_price = excluded.monthly_price,
  ai_recommendation_limit = excluded.ai_recommendation_limit,
  updated_at = now();
