-- 01_extensions_and_types.sql
-- Run first. Defines extensions, enums, and shared trigger helpers.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'admin_role') then
    create type public.admin_role as enum ('admin', 'super_admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('pending', 'followed_up', 'deal', 'canceled');
  end if;

  if not exists (select 1 from pg_type where typname = 'invitation_order_status') then
    create type public.invitation_order_status as enum ('new', 'in_progress', 'review', 'done', 'canceled');
  end if;

  if not exists (select 1 from pg_type where typname = 'media_type') then
    create type public.media_type as enum ('image', 'video');
  end if;

  if not exists (select 1 from pg_type where typname = 'calendar_event_kind') then
    create type public.calendar_event_kind as enum ('mc_booking', 'invitation_order', 'manual');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_role public.admin_role;
begin
  v_full_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');

  begin
    v_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', '')::public.admin_role, 'admin'::public.admin_role);
  exception
    when others then
      v_role := 'admin'::public.admin_role;
  end;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    is_active
  )
  values (
    new.id,
    new.email,
    coalesce(v_full_name, new.email),
    v_role,
    true
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    is_active = true;

  return new;
end;
$$;
