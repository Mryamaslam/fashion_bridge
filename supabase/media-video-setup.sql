-- Run once in Supabase SQL Editor (after schema.sql and storage-setup.sql)
-- Adds a product video field and widens the media bucket so it accepts
-- video files and larger uploads (the original bucket was image-only, 5MB max).

ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;

UPDATE storage.buckets
SET
  file_size_limit = 104857600, -- 100MB
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
WHERE id = 'media';
