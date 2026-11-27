-- Draft cards and image storage.
--
--  * cards.is_draft marks cards auto-generated from site data (title, address,
--    description). The seed inserts drafts once and never overwrites them, so
--    edits made later are safe. Set is_draft = false when a card is reviewed.
--  * Public Storage bucket for site / route / card images. Uploads are done by
--    scripts/upload-images.mjs (service role) or by admins.

alter table public.cards add column is_draft boolean not null default false;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  2097152,  -- 2 MB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy site_images_public_read on storage.objects
  for select using (bucket_id = 'site-images');

create policy site_images_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());
