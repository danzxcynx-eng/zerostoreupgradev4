# Zero Store — Upgrade 1

Marketplace akun game dengan tampilan dark gaming merah/hitam.

## Yang baru
- UI responsive mobile-first dengan tema Zero Store.
- Marketplace khusus akun game.
- Kategori: Free Fire, Mobile Legends, PUBG Mobile, Valorant, Roblox, Genshin Impact, dan Game Lainnya.
- Search akun, filter game, dan sorting harga.
- Detail listing dengan rank, level, jumlah skin/item, deskripsi, dan kontak WhatsApp.
- Form jual akun yang lebih spesifik untuk akun game.
- Backend listing tetap memakai Cloudflare D1 dan autentikasi cookie HttpOnly.

## Struktur
- `public/index.html` — frontend.
- `worker.js` — backend API.
- `schema.sql` — schema database untuk instalasi baru.
- `migration-upgrade-1.sql` — migrasi untuk database lama.
- `wrangler.toml` — konfigurasi Cloudflare Workers.

## Jika database kamu SUDAH ada
Jalankan `migration-upgrade-1.sql` sekali di D1 agar kolom `rank`, `level`, dan `skins` tersedia.

## Jika database masih baru
Jalankan `schema.sql`.

## Deploy
1. Pastikan `wrangler.toml` memakai Database ID D1 milikmu.
2. Pastikan binding D1 bernama `DB`.
3. Jalankan `npx wrangler deploy`.

## Catatan
Versi ini menggunakan URL gambar seperti versi sebelumnya. Untuk produksi, upload gambar sebaiknya dipindahkan ke object storage seperti R2. Untuk transaksi, gunakan payment gateway/escrow resmi bila diperlukan dan jangan menyimpan password atau OTP akun game di Zero Store.
