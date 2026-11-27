-- La Ruta Blanca · initial schema (see docs/SRS.md §5)
--
-- Content tables (sites, routes, cards, ...) are public-read and admin-write.
-- Player progress (user_cards, scans) is written ONLY by server-side code that
-- uses the service role (redeem_scan), never by the client.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.rarity as enum ('Común', 'Rara', 'Épica', 'Legendaria');
create type public.user_role as enum ('explorer', 'admin', 'superadmin');
create type public.scan_result as enum (
  'success',
  'already_owned',
  'invalid_token',
  'revoked_token',
  'expired_token',
  'too_far',
  'no_location',
  'rate_limited'
);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------
create table public.sites (
  id          text primary key,                 -- canonical slug, e.g. 'casa-de-la-libertad'
  name        text not null,
  category    text not null default 'Patrimonio',
  address     text,
  description text,
  hours       text,
  lat         double precision not null,
  lng         double precision not null,
  radius_m    integer not null default 100 check (radius_m > 0),  -- max distance to redeem a scan
  points      integer not null default 100 check (points >= 0),
  rarity      public.rarity not null default 'Común',
  icon        text,                             -- Material Symbols name
  image_url   text,                             -- TODO: move to Supabase Storage
  published   boolean not null default true
);

create table public.routes (
  id               text primary key,
  title            text not null,
  description      text,
  category         text,
  distance_km      numeric(5, 1),
  est_minutes      integer,
  difficulty       text,
  icon             text,
  image_url        text,
  badge_text       text,
  badge_type       text,
  completion_bonus integer not null default 0,
  published        boolean not null default true
);

create table public.route_stops (
  route_id text not null references public.routes (id) on delete cascade,
  site_id  text not null references public.sites (id) on delete restrict,
  position integer not null,
  subtitle text,                                -- route-specific text for this stop
  detail   text,
  primary key (route_id, site_id),
  unique (route_id, position)
);

create table public.cards (
  id            text primary key,
  site_id       text not null unique references public.sites (id) on delete cascade,
  title         text not null,
  category      text not null,                  -- colonial | presidencial | mistica
  category_label text not null,
  rarity        public.rarity not null default 'Común',
  hint          text,                           -- shown while the card is locked
  hint_icon     text,
  short_history text,
  image_url     text
);

create table public.ranks (
  id         serial primary key,
  name       text not null unique,
  min_points integer not null unique check (min_points >= 0)
);

-- ---------------------------------------------------------------------------
-- Players
-- ---------------------------------------------------------------------------
create table public.profiles (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  display_name      text not null default 'Explorador Chuquisaqueño',
  points            integer not null default 0 check (points >= 0),
  role              public.user_role not null default 'explorer',
  leaderboard_opt_in boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- QR codes and scans
-- ---------------------------------------------------------------------------
create table public.qr_codes (
  id         uuid primary key default gen_random_uuid(),
  site_id    text not null references public.sites (id) on delete cascade,
  token_hash bytea not null unique,             -- sha256(token); plaintext is never stored
  active     boolean not null default true,
  valid_from timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- At most one active plaque per site.
create unique index qr_codes_one_active_per_site
  on public.qr_codes (site_id) where active;

create table public.scans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  qr_code_id  uuid references public.qr_codes (id) on delete set null,
  site_id     text references public.sites (id) on delete set null,
  lat         double precision,
  lng         double precision,
  accuracy_m  double precision,
  distance_m  double precision,
  result      public.scan_result not null,
  flagged     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index scans_user_created_idx on public.scans (user_id, created_at desc);

create table public.user_cards (
  user_id     uuid not null references auth.users (id) on delete cascade,
  card_id     text not null references public.cards (id) on delete cascade,
  obtained_at timestamptz not null default now(),
  scan_id     uuid references public.scans (id) on delete set null,
  primary key (user_id, card_id)
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

-- Current rank is derived from points, so it can never drift out of sync.
create or replace view public.profiles_with_rank
with (security_invoker = true) as
select p.*,
       (select r.name from public.ranks r
         where r.min_points <= p.points
         order by r.min_points desc limit 1) as rank_name
from public.profiles p;

-- Every new auth user (including anonymous sign-ins) gets a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.sites       enable row level security;
alter table public.routes      enable row level security;
alter table public.route_stops enable row level security;
alter table public.cards       enable row level security;
alter table public.ranks       enable row level security;
alter table public.profiles    enable row level security;
alter table public.qr_codes    enable row level security;
alter table public.scans       enable row level security;
alter table public.user_cards  enable row level security;

-- Public content: everyone reads published rows, admins manage everything.
create policy sites_read on public.sites
  for select using (published or public.is_admin());
create policy sites_admin on public.sites
  for all using (public.is_admin()) with check (public.is_admin());

create policy routes_read on public.routes
  for select using (published or public.is_admin());
create policy routes_admin on public.routes
  for all using (public.is_admin()) with check (public.is_admin());

create policy route_stops_read on public.route_stops
  for select using (true);
create policy route_stops_admin on public.route_stops
  for all using (public.is_admin()) with check (public.is_admin());

-- Note: locked cards are readable too (the UI shows silhouettes + hint), so
-- image_url / short_history of locked cards are not secret.
create policy cards_read on public.cards
  for select using (true);
create policy cards_admin on public.cards
  for all using (public.is_admin()) with check (public.is_admin());

create policy ranks_read on public.ranks
  for select using (true);
create policy ranks_admin on public.ranks
  for all using (public.is_admin()) with check (public.is_admin());

-- Profiles: read/update own row. Clients may only change display name and
-- leaderboard opt-in (column grants below); points and role are server-only.
create policy profiles_select_own on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke update on public.profiles from anon, authenticated;
grant update (display_name, leaderboard_opt_in) on public.profiles to authenticated;

-- Progress: read own. No insert/update/delete policies, so only the service
-- role (which bypasses RLS) can write.
create policy user_cards_select_own on public.user_cards
  for select using (user_id = auth.uid());
create policy scans_select_own on public.scans
  for select using (user_id = auth.uid() or public.is_admin());

-- QR codes: admins only (policies still hide them from explorers).
create policy qr_codes_admin on public.qr_codes
  for all using (public.is_admin()) with check (public.is_admin());
