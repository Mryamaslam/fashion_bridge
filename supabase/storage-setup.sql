-- Run once in Supabase SQL Editor (after schema.sql)
-- Creates public media bucket for product/category images

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read for catalog images
DROP POLICY IF EXISTS "Public read media files" ON storage.objects;
CREATE POLICY "Public read media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Admin upload/update/delete
DROP POLICY IF EXISTS "Admin manage media files" ON storage.objects;
CREATE POLICY "Admin manage media files"
ON storage.objects FOR ALL
USING (bucket_id = 'media' AND is_admin())
WITH CHECK (bucket_id = 'media' AND is_admin());

-- Service role (seed script) bypasses RLS

