-- Run once in Supabase SQL Editor (after schema.sql)
-- Adds a contact_messages table so public contact-form submissions persist
-- and are visible in the admin panel (previously they were held in memory only).

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit the contact form
DROP POLICY IF EXISTS "Public insert contact messages" ON contact_messages;
CREATE POLICY "Public insert contact messages"
ON contact_messages FOR INSERT WITH CHECK (true);

-- Only admins can read/manage submitted messages
DROP POLICY IF EXISTS "Admin full access contact_messages" ON contact_messages;
CREATE POLICY "Admin full access contact_messages"
ON contact_messages FOR ALL USING (is_admin());
