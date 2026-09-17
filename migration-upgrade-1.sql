-- Jalankan file ini SEKALI jika database Zero Store kamu sudah pernah dibuat dari schema lama.
ALTER TABLE listings ADD COLUMN rank TEXT;
ALTER TABLE listings ADD COLUMN level INTEGER DEFAULT 0;
ALTER TABLE listings ADD COLUMN skins INTEGER DEFAULT 0;
