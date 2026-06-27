-- 05_public_rpc_and_views.sql
-- Controlled public submission RPCs and read helpers for Next.js.

create or replace function public.format_public_date(input_date date)
returns text
language sql
stable
as $$
  select to_char(input_date, 'DD Mon YYYY');
$$;

create or replace function public.submit_mc_booking(
  p_client_name text,
  p_event_date date,
  p_service_name text,
  p_phone text default null,
  p_event_location text default null,
  p_notes text default null
)
returns table (
  id uuid,
  public_id text,
  whatsapp_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service_id uuid;
  v_template text;
  v_message text;
  v_inserted public.mc_bookings%rowtype;
begin
  p_client_name := nullif(trim(p_client_name), '');
  p_service_name := nullif(trim(p_service_name), '');
  p_phone := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), '');
  p_event_location := nullif(trim(coalesce(p_event_location, '')), '');
  p_notes := nullif(trim(coalesce(p_notes, '')), '');

  if p_client_name is null or length(p_client_name) < 2 then
    raise exception 'Nama wajib diisi minimal 2 karakter.';
  end if;

  if p_service_name is null then
    raise exception 'Pilihan layanan wajib diisi.';
  end if;

  if p_event_date is null or p_event_date < current_date then
    raise exception 'Tanggal acara tidak valid.';
  end if;

  select s.id
  into v_service_id
  from public.mc_services s
  where s.title = p_service_name
    and s.is_active = true
  limit 1;

  if v_service_id is null then
    raise exception 'Layanan tidak tersedia.';
  end if;

  select ws.mc_whatsapp_template
  into v_template
  from public.website_settings ws
  where ws.id = true;

  v_message := coalesce(
    v_template,
    'Halo Kak Riswandi! Saya tertarik dengan layanan [layanan]. Nama saya: [nama]. Tanggal acara: [tanggal].'
  );

  v_message := replace(v_message, '[layanan]', p_service_name);
  v_message := replace(v_message, '[nama]', p_client_name);
  v_message := replace(v_message, '[tanggal]', public.format_public_date(p_event_date));

  insert into public.mc_bookings (
    client_name,
    phone,
    event_date,
    event_location,
    service_id,
    service_name,
    notes,
    whatsapp_message,
    status
  )
  values (
    p_client_name,
    p_phone,
    p_event_date,
    p_event_location,
    v_service_id,
    p_service_name,
    p_notes,
    v_message,
    'pending'
  )
  returning * into v_inserted;

  id := v_inserted.id;
  public_id := v_inserted.public_id;
  whatsapp_message := v_inserted.whatsapp_message;
  return next;
end;
$$;

create or replace function public.submit_invitation_order(
  p_couple_name text,
  p_event_date date,
  p_event_location text,
  p_template_name text,
  p_phone text default null,
  p_target_completion_date date default null,
  p_notes text default null
)
returns table (
  id uuid,
  public_id text,
  whatsapp_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_template_id uuid;
  v_min_order_days integer := 7;
  v_template text;
  v_message text;
  v_inserted public.invitation_orders%rowtype;
begin
  p_couple_name := nullif(trim(p_couple_name), '');
  p_event_location := nullif(trim(p_event_location), '');
  p_template_name := nullif(trim(p_template_name), '');
  p_phone := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), '');
  p_notes := nullif(trim(coalesce(p_notes, '')), '');

  if p_couple_name is null or length(p_couple_name) < 2 then
    raise exception 'Nama mempelai wajib diisi minimal 2 karakter.';
  end if;

  if p_event_location is null then
    raise exception 'Lokasi acara wajib diisi.';
  end if;

  if p_template_name is null then
    raise exception 'Pilihan template wajib diisi.';
  end if;

  select t.id, t.min_order_days
  into v_template_id, v_min_order_days
  from public.invitation_templates t
  where t.name = p_template_name
    and t.is_active = true
  limit 1;

  if v_template_id is null then
    raise exception 'Template undangan tidak tersedia.';
  end if;

  if p_event_date is null or p_event_date < current_date + make_interval(days => coalesce(v_min_order_days, 7)) then
    raise exception 'Pemesanan undangan minimal % hari sebelum tanggal acara.', coalesce(v_min_order_days, 7);
  end if;

  select ws.invitation_whatsapp_template
  into v_template
  from public.website_settings ws
  where ws.id = true;

  v_message := coalesce(
    v_template,
    'Halo Kak Riswandi! Saya ingin memesan Undangan Pernikahan Digital. Nama Mempelai: [namaMempelai]. Tanggal Acara: [tanggal]. Lokasi: [lokasi]. Template: [template].'
  );

  v_message := replace(v_message, '[namaMempelai]', p_couple_name);
  v_message := replace(v_message, '[tanggal]', public.format_public_date(p_event_date));
  v_message := replace(v_message, '[tanggalTarget]', coalesce(public.format_public_date(p_target_completion_date), '-'));
  v_message := replace(v_message, '[lokasi]', p_event_location);
  v_message := replace(v_message, '[template]', p_template_name);

  insert into public.invitation_orders (
    couple_name,
    phone,
    event_date,
    target_completion_date,
    event_location,
    template_id,
    template_name,
    notes,
    whatsapp_message,
    status
  )
  values (
    p_couple_name,
    p_phone,
    p_event_date,
    p_target_completion_date,
    p_event_location,
    v_template_id,
    p_template_name,
    p_notes,
    v_message,
    'new'
  )
  returning * into v_inserted;

  id := v_inserted.id;
  public_id := v_inserted.public_id;
  whatsapp_message := v_inserted.whatsapp_message;
  return next;
end;
$$;

create or replace function public.get_public_homepage()
returns jsonb
language sql
security invoker
stable
as $$
  select jsonb_build_object(
    'settings', (
      select to_jsonb(s) - 'created_at' - 'updated_at'
      from public.website_settings s
      where s.id = true
    ),
    'services', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.sort_order)
      from (
        select slug, title, badge_label, badge_variant, short_description, features, sort_order, is_featured
        from public.mc_services
        where is_active = true
        order by sort_order
      ) x
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.sort_order)
      from (
        select slug, name, theme, original_price, promo_price, demo_url, preview_image_url, img_sig, min_order_days, sort_order, is_demo_ready
        from public.invitation_templates
        where is_active = true
        order by sort_order
      ) x
    ), '[]'::jsonb),
    'gallery', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.sort_order)
      from (
        select id, title, category, media_type, media_url, thumbnail_url, sort_order, is_featured
        from public.gallery_items
        where is_active = true
        order by sort_order
      ) x
    ), '[]'::jsonb),
    'faqs', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.sort_order)
      from (
        select id, question, answer, sort_order
        from public.faqs
        where is_active = true
        order by sort_order
      ) x
    ), '[]'::jsonb),
    'testimonials', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.sort_order)
      from (
        select id, client_name, event_type, quote, rating, photo_url, is_verified, sort_order
        from public.testimonials
        where is_active = true
        order by sort_order
      ) x
    ), '[]'::jsonb)
  );
$$;

create or replace view public.admin_calendar_items
with (security_invoker = true)
as
select
  b.id,
  b.public_id,
  b.client_name as title,
  b.event_date,
  null::time as event_time,
  'mc_booking'::public.calendar_event_kind as event_kind,
  b.status::text as status,
  b.service_name as description
from public.mc_bookings b
union all
select
  o.id,
  o.public_id,
  o.couple_name as title,
  o.event_date,
  null::time as event_time,
  'invitation_order'::public.calendar_event_kind as event_kind,
  o.status::text as status,
  o.template_name as description
from public.invitation_orders o
union all
select
  e.id,
  null::text as public_id,
  e.title,
  e.event_date,
  e.event_time,
  e.event_kind,
  e.status,
  e.notes as description
from public.calendar_events e
where e.is_active = true;

create or replace function public.get_admin_dashboard_metrics()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not public.has_admin_role(auth.uid()) then
    raise exception 'Unauthorized';
  end if;

  return jsonb_build_object(
    'pending_mc_bookings', (select count(*) from public.mc_bookings where status = 'pending'),
    'new_invitation_orders', (select count(*) from public.invitation_orders where status = 'new'),
    'upcoming_events', (
      select count(*)
      from public.admin_calendar_items
      where event_date >= current_date
        and event_date < current_date + interval '30 days'
    ),
    'active_templates', (select count(*) from public.invitation_templates where is_active = true),
    'active_gallery_items', (select count(*) from public.gallery_items where is_active = true)
  );
end;
$$;

revoke all on function public.format_public_date(date) from public;
revoke all on function public.submit_mc_booking(text, date, text, text, text, text) from public;
revoke all on function public.submit_invitation_order(text, date, text, text, text, date, text) from public;
revoke all on function public.get_public_homepage() from public;
revoke all on function public.get_admin_dashboard_metrics() from public;

grant execute on function public.format_public_date(date) to anon, authenticated;
grant execute on function public.submit_mc_booking(text, date, text, text, text, text) to anon, authenticated;
grant execute on function public.submit_invitation_order(text, date, text, text, text, date, text) to anon, authenticated;
grant execute on function public.get_public_homepage() to anon, authenticated;
grant execute on function public.get_admin_dashboard_metrics() to authenticated;
revoke all on public.admin_calendar_items from anon, public;
grant select on public.admin_calendar_items to authenticated;
