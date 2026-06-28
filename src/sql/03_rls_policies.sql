-- 03_rls_policies.sql
-- Row Level Security policies for public content, admin CRUD, and public media storage.

create or replace function public.has_admin_role(user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id
      and p.is_active = true
      and p.role in ('admin', 'super_admin')
  );
$$;

revoke all on function public.has_admin_role(uuid) from public;
grant execute on function public.has_admin_role(uuid) to authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.website_settings enable row level security;
alter table public.mc_services enable row level security;
alter table public.invitation_templates enable row level security;
alter table public.mc_bookings enable row level security;
alter table public.invitation_orders enable row level security;
alter table public.gallery_items enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.calendar_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.has_admin_role(auth.uid()));

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write"
on public.profiles for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "settings_public_read" on public.website_settings;
create policy "settings_public_read"
on public.website_settings for select
to anon, authenticated
using (true);

drop policy if exists "settings_admin_write" on public.website_settings;
create policy "settings_admin_write"
on public.website_settings for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "mc_services_public_read_active" on public.mc_services;
create policy "mc_services_public_read_active"
on public.mc_services for select
to anon, authenticated
using (is_active = true);

drop policy if exists "mc_services_admin_write" on public.mc_services;
create policy "mc_services_admin_write"
on public.mc_services for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "invitation_templates_public_read_active" on public.invitation_templates;
create policy "invitation_templates_public_read_active"
on public.invitation_templates for select
to anon, authenticated
using (is_active = true);

drop policy if exists "invitation_templates_admin_write" on public.invitation_templates;
create policy "invitation_templates_admin_write"
on public.invitation_templates for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "mc_bookings_admin_all" on public.mc_bookings;
create policy "mc_bookings_admin_all"
on public.mc_bookings for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "invitation_orders_admin_all" on public.invitation_orders;
create policy "invitation_orders_admin_all"
on public.invitation_orders for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "gallery_public_read_active" on public.gallery_items;
create policy "gallery_public_read_active"
on public.gallery_items for select
to anon, authenticated
using (is_active = true);

drop policy if exists "gallery_admin_write" on public.gallery_items;
create policy "gallery_admin_write"
on public.gallery_items for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "faqs_public_read_active" on public.faqs;
create policy "faqs_public_read_active"
on public.faqs for select
to anon, authenticated
using (is_active = true);

drop policy if exists "faqs_admin_write" on public.faqs;
create policy "faqs_admin_write"
on public.faqs for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "testimonials_public_read_active" on public.testimonials;
create policy "testimonials_public_read_active"
on public.testimonials for select
to anon, authenticated
using (is_active = true);

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write"
on public.testimonials for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "calendar_events_admin_all" on public.calendar_events;
create policy "calendar_events_admin_all"
on public.calendar_events for all
to authenticated
using (public.has_admin_role(auth.uid()))
with check (public.has_admin_role(auth.uid()));

drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read"
on public.audit_logs for select
to authenticated
using (public.has_admin_role(auth.uid()));

drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert"
on public.audit_logs for insert
to authenticated
with check (public.has_admin_role(auth.uid()));

grant select on public.website_settings to anon, authenticated;
grant select on public.mc_services to anon, authenticated;
grant select on public.invitation_templates to anon, authenticated;
grant select on public.gallery_items to anon, authenticated;
grant select on public.faqs to anon, authenticated;
grant select on public.testimonials to anon, authenticated;

revoke all on public.profiles from anon, public;
revoke all on public.mc_bookings from anon, public;
revoke all on public.invitation_orders from anon, public;
revoke all on public.calendar_events from anon, public;
revoke all on public.audit_logs from anon, public;

grant all on public.profiles to authenticated;
grant all on public.website_settings to authenticated;
grant all on public.mc_services to authenticated;
grant all on public.invitation_templates to authenticated;
grant all on public.mc_bookings to authenticated;
grant all on public.invitation_orders to authenticated;
grant all on public.gallery_items to authenticated;
grant all on public.faqs to authenticated;
grant all on public.testimonials to authenticated;
grant all on public.calendar_events to authenticated;
grant all on public.audit_logs to authenticated;

drop policy if exists "gallery_storage_public_read" on storage.objects;
create policy "gallery_storage_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'gallery');

drop policy if exists "invitation_template_storage_public_read" on storage.objects;
create policy "invitation_template_storage_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'invitation-template');

drop policy if exists "gallery_storage_admin_insert" on storage.objects;
create policy "gallery_storage_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'gallery' and public.has_admin_role(auth.uid()));

drop policy if exists "invitation_template_storage_admin_insert" on storage.objects;
create policy "invitation_template_storage_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'invitation-template' and public.has_admin_role(auth.uid()));

drop policy if exists "gallery_storage_admin_update" on storage.objects;
create policy "gallery_storage_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'gallery' and public.has_admin_role(auth.uid()))
with check (bucket_id = 'gallery' and public.has_admin_role(auth.uid()));

drop policy if exists "invitation_template_storage_admin_update" on storage.objects;
create policy "invitation_template_storage_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'invitation-template' and public.has_admin_role(auth.uid()))
with check (bucket_id = 'invitation-template' and public.has_admin_role(auth.uid()));

drop policy if exists "gallery_storage_admin_delete" on storage.objects;
create policy "gallery_storage_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'gallery' and public.has_admin_role(auth.uid()));

drop policy if exists "invitation_template_storage_admin_delete" on storage.objects;
create policy "invitation_template_storage_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'invitation-template' and public.has_admin_role(auth.uid()));
