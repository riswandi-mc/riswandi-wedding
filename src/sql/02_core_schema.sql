-- 02_core_schema.sql
-- Core tables for Supabase-backed public landing page and admin dashboard.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.admin_role not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.website_settings (
  id boolean primary key default true check (id),
  brand_name text not null default 'Riswandi Wedding',
  phone_whatsapp text not null default '6287737860657',
  email text,
  instagram_url text,
  address text,
  mc_whatsapp_template text not null default 'Halo Kak Riswandi! Saya tertarik dengan layanan [layanan]. Nama saya: [nama]. Tanggal acara: [tanggal]. Mohon info lebih lanjut ya, terima kasih.',
  invitation_whatsapp_template text not null default 'Halo Kak Riswandi! Saya ingin memesan Undangan Pernikahan Digital. Nama Mempelai: [namaMempelai]. Tanggal Acara: [tanggal]. Lokasi: [lokasi]. Template: [template]. Mohon konfirmasi ketersediaan ya, terima kasih.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mc_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  badge_label text,
  badge_variant text,
  short_description text not null,
  features text[] not null default '{}',
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitation_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  theme text,
  original_price integer not null default 59000,
  promo_price integer not null default 39000,
  demo_url text,
  preview_image_url text,
  img_sig integer,
  min_order_days integer not null default 7,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_demo_ready boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mc_bookings (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique default ('MC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  client_name text not null,
  phone text,
  event_date date not null,
  event_location text,
  service_id uuid references public.mc_services(id) on delete set null,
  service_name text not null,
  notes text,
  whatsapp_message text,
  status public.booking_status not null default 'pending',
  follow_up_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitation_orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique default ('INV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  couple_name text not null,
  phone text,
  event_date date not null,
  target_completion_date date,
  event_location text not null,
  template_id uuid references public.invitation_templates(id) on delete set null,
  template_name text not null,
  notes text,
  whatsapp_message text,
  status public.invitation_order_status not null default 'new',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Wedding',
  media_type public.media_type not null default 'image',
  media_url text not null,
  thumbnail_url text,
  storage_path text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  event_type text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  photo_url text,
  is_verified boolean not null default true,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_time time,
  event_kind public.calendar_event_kind not null default 'manual',
  source_table text,
  source_id uuid,
  status text,
  notes text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mc_bookings_event_date_idx on public.mc_bookings(event_date);
create index if not exists mc_bookings_status_idx on public.mc_bookings(status);
create index if not exists invitation_orders_event_date_idx on public.invitation_orders(event_date);
create index if not exists invitation_orders_status_idx on public.invitation_orders(status);
create index if not exists gallery_items_active_sort_idx on public.gallery_items(is_active, sort_order);
create index if not exists faqs_active_sort_idx on public.faqs(is_active, sort_order);
create index if not exists invitation_templates_active_sort_idx on public.invitation_templates(is_active, sort_order);
create index if not exists mc_services_active_sort_idx on public.mc_services(is_active, sort_order);
create unique index if not exists faqs_question_unique_idx on public.faqs(question);
create unique index if not exists gallery_items_media_url_unique_idx on public.gallery_items(media_url);
create unique index if not exists testimonials_client_quote_unique_idx on public.testimonials(client_name, quote);

insert into public.profiles (
  id,
  email,
  full_name,
  role,
  is_active
)
select
  u.id,
  u.email,
  coalesce(
    nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ''),
    u.email
  ) as full_name,
  case
    when nullif(u.raw_user_meta_data ->> 'role', '') in ('admin', 'super_admin')
      then (u.raw_user_meta_data ->> 'role')::public.admin_role
    else 'admin'::public.admin_role
  end as role,
  true as is_active
from auth.users u
where u.email is not null
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  is_active = excluded.is_active;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row
execute function public.handle_auth_user_profile();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists website_settings_set_updated_at on public.website_settings;
create trigger website_settings_set_updated_at before update on public.website_settings for each row execute function public.set_updated_at();

drop trigger if exists mc_services_set_updated_at on public.mc_services;
create trigger mc_services_set_updated_at before update on public.mc_services for each row execute function public.set_updated_at();

drop trigger if exists invitation_templates_set_updated_at on public.invitation_templates;
create trigger invitation_templates_set_updated_at before update on public.invitation_templates for each row execute function public.set_updated_at();

drop trigger if exists mc_bookings_set_updated_at on public.mc_bookings;
create trigger mc_bookings_set_updated_at before update on public.mc_bookings for each row execute function public.set_updated_at();

drop trigger if exists invitation_orders_set_updated_at on public.invitation_orders;
create trigger invitation_orders_set_updated_at before update on public.invitation_orders for each row execute function public.set_updated_at();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at before update on public.gallery_items for each row execute function public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at before update on public.faqs for each row execute function public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials for each row execute function public.set_updated_at();

drop trigger if exists calendar_events_set_updated_at on public.calendar_events;
create trigger calendar_events_set_updated_at before update on public.calendar_events for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values
  ('gallery', 'gallery', true),
  ('invitation-template', 'invitation-template', true)
on conflict (id) do update set public = excluded.public;
