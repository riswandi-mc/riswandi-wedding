# Dokumentasi Website Riswandi Wedding

## Ringkasan

Riswandi Wedding adalah website jasa MC wedding, MC all event, dan undangan digital dengan dashboard admin terpisah. Aplikasi ini dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, dan Supabase untuk autentikasi, database, storage, serta pengamanan akses data.

Fokus utama sistem:

- menangkap booking MC dari landing page;
- menangkap order undangan digital dari landing page;
- menampilkan dan mengelola data lewat dashboard admin;
- menjaga keamanan data dengan auth, RLS, dan pemisahan client/server;
- mengarahkan user ke WhatsApp setelah submit sukses.

## Fitur Utama

### 1. Landing Page Public

- Hero section dengan CTA booking dan kontak WhatsApp.
- Section layanan MC.
- Section undangan digital dengan template dan harga promo.
- Section testimoni.
- Section galeri dokumentasi.
- Section FAQ.
- Sticky tombol WhatsApp.

### 2. Form Booking MC

- Dibuka dari card layanan MC atau CTA utama.
- Field utama: nama klien, nomor WhatsApp, tanggal acara, layanan, lokasi opsional, catatan opsional.
- Data dikirim ke Supabase melalui RPC public yang aman.
- Setelah berhasil, user melihat konfirmasi dan diarahkan ke WhatsApp.

### 3. Form Order Undangan Digital

- Dibuka dari section undangan digital.
- Field utama: nama mempelai, nomor WhatsApp, tanggal acara, target selesai, lokasi, template, catatan.
- Ada validasi minimal hari sebelum acara sesuai template.
- Setelah berhasil, user melihat konfirmasi dan diarahkan ke WhatsApp.

### 4. Dashboard Admin

- Login memakai Supabase Auth.
- Admin bisa melihat ringkasan dashboard.
- Admin mengelola booking MC, pesanan undangan, kalender, galeri, template undangan, FAQ, setting website, dan layanan MC.
- Aksi CRUD dilakukan lewat server-side action dan DAL.

### 5. Keamanan

- RLS aktif di layer database.
- Service role key hanya dipakai di server-only module.
- Admin route dilindungi oleh proxy dan verifikasi ulang di data layer.
- Data yang dikirim ke client dibatasi hanya DTO yang dibutuhkan.

## Halaman User

### `/`

Halaman utama public. Berisi:

- hero dan CTA utama;
- section layanan MC;
- section undangan digital;
- section testimoni;
- section galeri;
- section FAQ;
- footer dengan kontak;
- tombol WhatsApp mengambang.

### `/layanan-mc`

Halaman detail layanan MC. Dipakai untuk menampilkan informasi paket layanan secara lebih lengkap dibanding card di landing page.

### Interaksi User di Public

Semua form public berada di landing page dan dibuka lewat modal/dialog, bukan melalui halaman terpisah:

- booking MC;
- order undangan digital;
- lanjut ke WhatsApp setelah submit sukses.

## Halaman Admin

### `/login`

- Form login admin.
- Menggunakan email dan password Supabase Auth.
- User tanpa role admin tidak boleh masuk dashboard.

### `/dashboard`

- Halaman ringkasan admin.
- Menampilkan statistik singkat, grafik ringkas, dan pintasan ke modul utama.

### `/dashboard/booking-mc`

- Daftar booking MC.
- Search dan filter data.
- Update status.
- Hapus data.
- Aksi lanjut WhatsApp.

### `/dashboard/pesanan-undangan`

- Daftar order undangan digital.
- Search dan filter data.
- Update status.
- Hapus data.
- Aksi lanjut WhatsApp.

### `/dashboard/calendar`

- Kalender event gabungan dari booking, order, dan event manual.

### `/dashboard/galeri`

- CRUD dokumentasi media.
- Upload ke Supabase Storage bucket `gallery`.
- Toggle aktif/nonaktif.

### `/dashboard/template-undangan`

- CRUD template undangan.
- Edit nama template, harga promo, demo URL, preview, status, dan pengaturan minimum hari pemesanan.

### `/dashboard/faq`

- CRUD FAQ public.
- Atur urutan tampil dan status aktif.

### `/dashboard/setting`

- Pengaturan brand.
- Nomor WhatsApp.
- Email.
- Instagram.
- Alamat.
- Template pesan WhatsApp untuk booking MC dan order undangan.

### `/dashboard/layanan-mc`

- CRUD layanan MC.
- Mengatur judul, badge, deskripsi, fitur, urutan, dan status aktif.

## Arsitektur Sistem

### Frontend

- Next.js 16 dengan App Router.
- React 19.
- Tailwind CSS 4 untuk styling.
- shadcn/ui dan Radix UI untuk komponen interaktif.
- `next/font` untuk font lokal dan font Google.

### Struktur Data Access

Data dipusatkan di server-only layer:

- `src/lib/data/public.ts`
- `src/lib/data/admin.ts`

Prinsipnya:

- query public hanya mengambil field publik;
- query admin selalu memverifikasi sesi dan role;
- hasil yang dikirim ke client dibatasi ke DTO;
- tidak ada service role key yang diimpor ke client.

### Supabase Layer

Client Supabase dipisah menurut konteks:

- `src/lib/supabase/browser.ts` untuk browser, memakai anon key;
- `src/lib/supabase/server.ts` untuk SSR dan session cookie;
- `src/lib/supabase/admin.ts` untuk operasi server-only yang butuh service role.

### Mutasi Data

Mutasi dilakukan lewat Server Actions:

- `src/app/actions/public-booking.ts`
- `src/app/actions/admin.ts`
- `src/app/actions/auth.ts`

Alur mutasi:

1. input divalidasi dengan Zod;
2. server memverifikasi auth/authorization;
3. data ditulis ke Supabase;
4. cache path direvalidate bila perlu;
5. UI menampilkan hasil dan user diarahkan ke WhatsApp jika relevan.

### Proteksi Route

- `proxy.ts` memeriksa akses ke `/dashboard`.
- User tanpa sesi valid diarahkan ke `/login`.
- User dengan role non-admin ditolak.
- Proteksi tetap diulang di data layer dan server action.

### Storage

- Bucket `gallery` dipakai untuk media galeri.
- Bucket `invitation-template` dipakai untuk preview template undangan.
- Upload dilakukan di server-side admin flow.

## Environment Variables

Variable yang dipakai aplikasi:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Aturan keamanan:

- variabel `NEXT_PUBLIC_` boleh dibaca browser;
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh dibaca server-only module;
- file `.env.local` tidak boleh dikomit.

## SQL dan Database

Schema database dikelola lewat file:

1. `src/sql/01_extensions_and_types.sql`
2. `src/sql/02_core_schema.sql`
3. `src/sql/03_rls_policies.sql`
4. `src/sql/04_seed_public_content.sql`
5. `src/sql/05_public_rpc_and_views.sql`

Tabel inti yang dipakai:

- `profiles`
- `website_settings`
- `mc_services`
- `invitation_templates`
- `mc_bookings`
- `invitation_orders`
- `gallery_items`
- `faqs`
- `testimonials`
- `calendar_events`
- `audit_logs`

## Catatan Cleanup Phase 6

Cleanup yang sudah dilakukan pada repository ini:

- stub Firebase dihapus;
- file JSON dummy di `src/data` dihapus;
- import fixture `settings.json` dari dashboard overview dihapus;
- komentar legacy yang menyebut Firebase pada route nonaktif sudah dibersihkan;
- dashboard overview sekarang memakai data statis lokal yang tidak bergantung ke fixture lama.

## Alur Singkat Operasional

### Booking MC

1. user isi form booking;
2. server validasi input;
3. data masuk ke `mc_bookings`;
4. popup sukses tampil;
5. user lanjut ke WhatsApp;
6. admin melihat lead di dashboard.

### Order Undangan

1. user isi form order;
2. server validasi dan cek syarat minimal hari;
3. data masuk ke `invitation_orders`;
4. popup sukses tampil;
5. user lanjut ke WhatsApp;
6. admin melihat order di dashboard.

### Login Admin

1. admin login di `/login`;
2. Supabase mengeluarkan session;
3. proxy dan DAL memverifikasi role;
4. admin bisa membuka halaman dashboard.
