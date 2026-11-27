-- Support for the frontend's new screens:
--  * sites.kind separates the 12 standalone museums (Explorar / Mapa lists) from
--    route-only stops.
--  * map_top_pct / map_left_pct place pins on the current static map image in
--    MapaView. TEMPORARY: drop them when the real Leaflet map (lat/lng) lands.
--  * fun_facts feeds the "Sabías que..." carousel in ExplorarView.

alter table public.sites
  add column kind text not null default 'parada' check (kind in ('museo', 'parada')),
  add column map_top_pct  numeric(5, 2) check (map_top_pct  between 0 and 100),
  add column map_left_pct numeric(5, 2) check (map_left_pct between 0 and 100);

create table public.fun_facts (
  id             text primary key,
  position       integer not null unique,
  badge          text not null,
  icon           text,
  text_prefix    text not null default '',
  text_highlight text not null,
  text_suffix    text not null default '',
  location       text,
  -- Tailwind gradient classes. They only render if the same classes already
  -- appear somewhere in src/ (Tailwind scans source, not the database).
  gradient       text,
  published      boolean not null default true
);

alter table public.fun_facts enable row level security;

create policy fun_facts_read on public.fun_facts
  for select using (published or public.is_admin());
create policy fun_facts_admin on public.fun_facts
  for all using (public.is_admin()) with check (public.is_admin());
