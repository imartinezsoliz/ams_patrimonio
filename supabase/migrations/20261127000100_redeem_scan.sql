-- redeem_scan: the only way a player gets a card / points (see docs/SRS.md §4.3).
--
-- Called by the client as  supabase.rpc('redeem_scan', {...}). It runs with the
-- owner's rights (security definer) so it can write scans / user_cards /
-- profiles.points, which clients cannot write directly. The user is always
-- auth.uid(); it is never passed in.
--
-- Failures do NOT raise: they are logged in `scans` and returned as
-- {"result": "<scan_result>", ...} so the log survives the transaction.

create or replace function public.redeem_scan(
  p_token    text,
  p_lat      double precision default null,
  p_lng      double precision default null,
  p_accuracy double precision default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  c_rate_limit    constant integer := 10;    -- max attempts per user per minute
  c_accuracy_cap  constant double precision := 50;  -- metres of GPS error we forgive

  v_uid        uuid := auth.uid();
  v_qr         public.qr_codes;
  v_site       public.sites;
  v_card       public.cards;
  v_distance   double precision;
  v_scan_id    uuid;
  v_points_old integer;
  v_points_new integer;
  v_rank_old   text;
  v_rank_new   text;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Safety net: the signup trigger normally creates this already.
  insert into public.profiles (user_id) values (v_uid) on conflict do nothing;

  -- Serialise attempts per user so rate limiting and double-redeem checks are race-free.
  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 0));

  if (select count(*) from public.scans
       where user_id = v_uid and created_at > now() - interval '1 minute') >= c_rate_limit then
    insert into public.scans (user_id, result) values (v_uid, 'rate_limited');
    return jsonb_build_object('result', 'rate_limited');
  end if;

  select * into v_qr
    from public.qr_codes
   where token_hash = digest(coalesce(p_token, ''), 'sha256');

  if not found then
    insert into public.scans (user_id, lat, lng, accuracy_m, result)
    values (v_uid, p_lat, p_lng, p_accuracy, 'invalid_token');
    return jsonb_build_object('result', 'invalid_token');
  end if;

  select * into v_site from public.sites where id = v_qr.site_id;

  if not v_qr.active then
    insert into public.scans (user_id, qr_code_id, site_id, lat, lng, accuracy_m, result)
    values (v_uid, v_qr.id, v_qr.site_id, p_lat, p_lng, p_accuracy, 'revoked_token');
    return jsonb_build_object('result', 'revoked_token');
  end if;

  if (v_qr.valid_from is not null and v_qr.valid_from > now())
     or (v_qr.expires_at is not null and v_qr.expires_at < now()) then
    insert into public.scans (user_id, qr_code_id, site_id, lat, lng, accuracy_m, result)
    values (v_uid, v_qr.id, v_qr.site_id, p_lat, p_lng, p_accuracy, 'expired_token');
    return jsonb_build_object('result', 'expired_token');
  end if;

  if p_lat is null or p_lng is null then
    insert into public.scans (user_id, qr_code_id, site_id, result)
    values (v_uid, v_qr.id, v_qr.site_id, 'no_location');
    return jsonb_build_object('result', 'no_location');
  end if;

  -- Haversine distance in metres.
  v_distance := 2 * 6371000 * asin(sqrt(
      power(sin(radians(p_lat - v_site.lat) / 2), 2)
    + cos(radians(v_site.lat)) * cos(radians(p_lat))
      * power(sin(radians(p_lng - v_site.lng) / 2), 2)
  ));

  if v_distance > v_site.radius_m + least(coalesce(p_accuracy, 0), c_accuracy_cap) then
    insert into public.scans (user_id, qr_code_id, site_id, lat, lng, accuracy_m, distance_m, result)
    values (v_uid, v_qr.id, v_qr.site_id, p_lat, p_lng, p_accuracy, v_distance, 'too_far');
    return jsonb_build_object(
      'result', 'too_far',
      'distance_m', round(v_distance),
      'radius_m', v_site.radius_m
    );
  end if;

  select * into v_card from public.cards where site_id = v_site.id;

  -- Already redeemed this site? (covers sites that have no card too)
  if exists (select 1 from public.scans
              where user_id = v_uid and site_id = v_site.id and result = 'success') then
    insert into public.scans (user_id, qr_code_id, site_id, lat, lng, accuracy_m, distance_m, result)
    values (v_uid, v_qr.id, v_site.id, p_lat, p_lng, p_accuracy, v_distance, 'already_owned');
    return jsonb_build_object(
      'result', 'already_owned',
      'site', jsonb_build_object('id', v_site.id, 'name', v_site.name),
      'card_id', v_card.id
    );
  end if;

  -- Success: log, unlock card, award points: all in this transaction.
  insert into public.scans (user_id, qr_code_id, site_id, lat, lng, accuracy_m, distance_m, result)
  values (v_uid, v_qr.id, v_site.id, p_lat, p_lng, p_accuracy, v_distance, 'success')
  returning id into v_scan_id;

  if v_card.id is not null then
    insert into public.user_cards (user_id, card_id, scan_id)
    values (v_uid, v_card.id, v_scan_id)
    on conflict do nothing;
  end if;

  select points into v_points_old from public.profiles where user_id = v_uid;
  update public.profiles
     set points = points + v_site.points
   where user_id = v_uid
  returning points into v_points_new;

  select name into v_rank_old from public.ranks
   where min_points <= v_points_old order by min_points desc limit 1;
  select name into v_rank_new from public.ranks
   where min_points <= v_points_new order by min_points desc limit 1;

  return jsonb_build_object(
    'result', 'success',
    'site', jsonb_build_object('id', v_site.id, 'name', v_site.name),
    'points_earned', v_site.points,
    'total_points', v_points_new,
    'rank_name', v_rank_new,
    'rank_changed', v_rank_old is distinct from v_rank_new,
    'distance_m', round(v_distance),
    'card', case when v_card.id is null then null else to_jsonb(v_card) end
  );
end;
$$;

-- Only signed-in users (anonymous sessions count as authenticated).
revoke all on function public.redeem_scan(text, double precision, double precision, double precision)
  from public, anon;
grant execute on function public.redeem_scan(text, double precision, double precision, double precision)
  to authenticated;
