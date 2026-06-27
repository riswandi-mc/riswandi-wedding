# PRD - Riswandi Wedding: MC Event & Undangan Digital

## 1. Ringkasan Produk

| Field | Detail |
| --- | --- |
| Nama Produk | Riswandi Wedding |
| Jenis Produk | Website jasa wedding dan event dengan dashboard admin |
| Platform | Web, mobile-first |
| Stack Saat Ini | Next.js 16.2.7, React 19.2.4, TypeScript, Tailwind CSS 4, shadcn/radix-ui, Firebase placeholder/localStorage |
| Target Stack Baru | Next.js App Router + Supabase Auth, Database, Storage, RLS |
| Target User Publik | Calon pengantin, keluarga, EO, panitia event, corporate/private event |
| Target User Admin | Owner/admin Riswandi Wedding |

Riswandi Wedding bukan sekadar web profil. Produk ini adalah website penjualan jasa MC wedding, MC all event, dan undangan digital yang terhubung dengan dashboard admin. Setiap booking dari landing page harus tersimpan di Supabase dan langsung muncul di dashboard admin.

## 2. Latar Belakang

Frontend sudah tersedia dengan landing page, halaman login, dan dashboard admin. Namun data masih berasal dari JSON dummy, localStorage, dan sisa integrasi Firebase. Kondisi ini membuat data publik dan dashboard admin tidak benar-benar sinkron.

Migrasi ke Supabase diperlukan agar:

- form booking MC dan order undangan tersimpan permanen;
- admin bisa mengelola data secara realtime/terpusat;
- konten publik seperti FAQ, galeri, template undangan, dan setting bisa diedit dari dashboard;
- akses admin aman menggunakan Supabase Auth dan RLS;
- service role key tidak pernah terekspos ke browser.

## 3. Tujuan

1. Menghubungkan landing page customer ke Supabase secara aman.
2. Mengganti Firebase/localStorage/JSON dummy menjadi data dari Supabase.
3. Membuat dashboard admin sebagai pusat pengelolaan:
   - booking MC;
   - kalender;
   - FAQ;
   - galeri;
   - pesanan undangan;
   - setting website/WhatsApp;
   - template undangan.
4. Membuat flow setelah submit form: data tersimpan ke Supabase, lalu user melihat popup/CTA lanjut ke WhatsApp.
5. Menyiapkan SQL schema Supabase dalam file berurutan `src/sql/01-05`.

## 4. Non-Goals Fase Awal

- Payment gateway.
- Invoice otomatis.
- Multi-tenant untuk banyak brand.
- Builder undangan digital penuh.
- Notifikasi email/WhatsApp API otomatis.
- Role kompleks selain `admin` dan `super_admin`.

## 5. User Persona

| Persona | Kebutuhan |
| --- | --- |
| Calon pengantin | Booking MC wedding dan pesan undangan digital dengan cepat dari HP |
| Panitia event/EO | Melihat paket MC event dan menghubungi admin via WhatsApp |
| Admin/Owner | Melihat lead masuk, follow-up, update status, edit konten landing page |

## 6. Sitemap

### Public Customer

- `/` Landing Page
  - Hero
  - Layanan MC
  - Undangan Digital
  - Cara Pesan
  - Testimoni
  - Galeri
  - FAQ
  - Footer + sticky WhatsApp CTA

### Admin

- `/login`
- `/dashboard`
- `/dashboard/booking-mc`
- `/dashboard/pesanan-undangan`
- `/dashboard/calendar`
- `/dashboard/galeri`
- `/dashboard/template-undangan`
- `/dashboard/faq`
- `/dashboard/setting`

## 7. Konten Landing Page yang Dipertahankan

### 7.1 Layanan MC

| Paket | Badge | Deskripsi | Benefit |
| --- | --- | --- | --- |
| MC All Event | Populer | Ulang tahun, wisuda, corporate, gathering, dan lainnya | Penguasaan audiens berbagai kalangan; ice breaking interaktif; fleksibilitas tema acara dan durasi |
| MC Wedding Partner | Duo / Best Value | Paket berdua / duo MC untuk interaksi yang lebih hidup | 2 MC profesional; chemistry dan tektokan panggung; cocok untuk resepsi besar |
| MC Wedding Private | Eksklusif | MC tunggal eksklusif dengan sentuhan personal dan elegan | Konsep intimate; bantuan rundown detail; standby dari akad hingga selesai |

### 7.2 Undangan Digital

Harga promo awal: `Rp 39.000`, harga coret: `Rp 59.000`.

| Template | Demo | Status |
| --- | --- | --- |
| Undangan 1 (Soft & Romantis) | `https://azzam-azhari.github.io/wedding-invitation/` | Aktif |
| Undangan 2 (Modern / Aesthetic Dark) | `#` | Proses |
| Undangan 3 (Fresh & Premium) | `https://ngodingsolusi.github.io/the-wedding-of-rehan-maulidan/` | Aktif |
| Undangan 4 (Minimalis & Elegan) | `https://invitation.sakeenah.site/` | Aktif |
| Undangan 5 (Floral / Botanical) | `https://undangan-digital-pied.vercel.app/` | Aktif |
| Undangan 6 (Klasik & Clean) | `https://undangan-pernikahan-online.netlify.app/` | Aktif |
| Undangan 7 (Stylish & Luxury) | `https://t-faces.github.io/The-wedding-of-Ari-dan-Nisa/` | Aktif |
| Undangan 8 (Exclusive & Smooth Animation) | `https://alystrastudio.github.io/Love-in-Motion/` | Aktif |

Ketentuan: pemesanan undangan minimal 7 hari sebelum tanggal acara.

## 8. Flow Utama

### 8.1 Flow Booking MC

1. User membuka landing page.
2. User klik tombol booking pada card layanan MC.
3. Popup form booking tampil dengan field:
   - nama klien;
   - nomor WhatsApp;
   - tanggal acara;
   - lokasi acara opsional;
   - pilihan layanan;
   - catatan opsional.
4. Frontend validasi field wajib.
5. Data dikirim ke endpoint Next.js atau Supabase RPC yang aman.
6. Supabase menyimpan data ke tabel `mc_bookings` dengan status default `pending`.
7. Popup sukses tampil.
8. User klik lanjut ke WhatsApp.
9. WhatsApp terbuka dengan template pesan yang sudah terisi.
10. Admin melihat booking baru di dashboard `Booking MC`.

### 8.2 Flow Order Undangan Digital

1. User membuka section undangan digital.
2. User memilih template dan klik `Pesan`.
3. Popup form order tampil dengan field:
   - nama mempelai;
   - nomor WhatsApp;
   - tanggal acara;
   - target undangan selesai;
   - lokasi acara;
   - template pilihan;
   - catatan opsional.
4. Frontend memvalidasi pemesanan minimal 7 hari sebelum tanggal acara.
5. Data dikirim ke Supabase melalui endpoint/RPC aman.
6. Supabase menyimpan data ke tabel `invitation_orders` dengan status default `new`.
7. Popup sukses tampil.
8. User lanjut ke WhatsApp dengan template pesan order.
9. Admin melihat order baru di dashboard `Pesanan Undangan`.

### 8.3 Flow Admin Login

1. Admin membuka `/login`.
2. Admin login menggunakan Supabase Auth email/password.
3. Middleware/proxy hanya mengizinkan user dengan role `admin` atau `super_admin` masuk dashboard.
4. Setiap query admin tetap diverifikasi ulang di Data Access Layer/server action.
5. Admin logout menghapus session Supabase.

## 9. Modul Admin

| Modul | Fitur Wajib |
| --- | --- |
| Dashboard | KPI booking pending, order baru, event mendatang, shortcut aksi |
| Booking MC | Tabel, search, filter layanan/status, tambah manual, update status, hapus, CTA WhatsApp |
| Pesanan Undangan | Tabel, search, filter template/status, tambah manual, update status, hapus, CTA WhatsApp |
| Kalender | Event dari booking MC, order undangan, dan event manual |
| Galeri | Tambah/edit/hapus media, upload ke Supabase Storage, toggle aktif |
| Template Undangan | Edit nama, harga, demo URL, preview, status aktif/proses |
| FAQ | CRUD FAQ, sort order, toggle aktif |
| Setting | Nomor WhatsApp, template pesan, brand, email, Instagram, alamat |

## 10. Arsitektur Teknis

### 10.1 Prinsip Next.js 16

Berdasarkan panduan lokal di `node_modules/next/dist/docs/`, implementasi harus mengikuti prinsip ini:

- gunakan App Router;
- mutation melalui Server Actions atau Route Handlers dengan validasi server-side;
- Server Actions dan Route Handlers diperlakukan seperti endpoint publik;
- akses database dipusatkan di Data Access Layer server-only;
- data yang dikirim ke Client Component harus berupa DTO minimal;
- jangan impor service role key atau modul admin Supabase ke Client Component;
- admin authorization dicek di middleware/proxy dan dicek ulang di DAL/action.

### 10.2 Supabase Client

Target file yang perlu dibuat pada fase implementasi:

| File | Tujuan |
| --- | --- |
| `src/lib/supabase/browser.ts` | Supabase client untuk browser, hanya memakai anon key |
| `src/lib/supabase/server.ts` | Supabase SSR client berbasis cookies untuk auth user |
| `src/lib/supabase/admin.ts` | Service role client server-only untuk operasi server tertentu |
| `src/lib/data/public.ts` | Query public homepage, hanya field publik |
| `src/lib/data/admin.ts` | Query admin dengan verifikasi role |
| `src/app/actions/public-booking.ts` | Server Action / wrapper submit booking dan order |
| `src/app/actions/admin.ts` | Server Action CRUD admin |

Dependency yang perlu ditambahkan:

```json
{
  "@supabase/supabase-js": "latest",
  "@supabase/ssr": "latest",
  "zod": "latest",
  "server-only": "latest"
}
```

Dependency yang perlu dihapus setelah migrasi selesai:

```json
{
  "firebase": "hapus jika tidak lagi dipakai"
}
```

### 10.3 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Aturan keamanan:

- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` boleh dipakai di browser.
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh dipakai di server-only module.
- Jangan commit `.env.local`.

## 11. Data Model Supabase

SQL migration tersedia di:

- `src/sql/01_extensions_and_types.sql`
- `src/sql/02_core_schema.sql`
- `src/sql/03_rls_policies.sql`
- `src/sql/04_seed_public_content.sql`
- `src/sql/05_public_rpc_and_views.sql`

Ringkasan tabel:

| Tabel | Fungsi |
| --- | --- |
| `profiles` | Role admin berdasarkan `auth.users` |
| `website_settings` | Setting brand, kontak, template WhatsApp |
| `mc_services` | Paket layanan MC |
| `invitation_templates` | Template undangan digital |
| `mc_bookings` | Lead booking MC dari publik/admin |
| `invitation_orders` | Order undangan digital |
| `gallery_items` | Media galeri public |
| `faqs` | FAQ public |
| `testimonials` | Testimoni public |
| `calendar_events` | Event manual untuk kalender admin |
| `audit_logs` | Audit aktivitas admin penting |
| `semua no whatsapp` |  6287737860657 | 

## 12. Security Requirement

1. RLS wajib aktif untuk semua tabel publik.
2. Public user hanya boleh membaca konten aktif:
   - `website_settings`;
   - `mc_services`;
   - `invitation_templates`;
   - `gallery_items`;
   - `faqs`;
   - `testimonials`.
3. Public user tidak boleh membaca tabel booking/order.
4. Public submit booking/order dilakukan melalui RPC `submit_mc_booking` dan `submit_invitation_order` atau melalui Next.js Route Handler yang memanggil service role server-side.
5. Admin CRUD hanya untuk user dengan profile role `admin` atau `super_admin`.
6. Semua input harus divalidasi dengan Zod di server.
7. Semua status bisnis tidak boleh dipercaya dari client public.
8. Upload galeri hanya admin.
9. File storage bucket `gallery` boleh public-read, tetapi write/update/delete hanya admin.
10. Tambahkan rate limiting pada endpoint submit public bila trafik mulai tinggi.

## 13. Acceptance Criteria

### Public Landing Page

- Landing page mengambil layanan, template, FAQ, galeri, dan setting dari Supabase.
- Jika Supabase error, UI menampilkan fallback kosong/terkontrol, bukan crash.
- Submit booking MC menyimpan data ke `mc_bookings`.
- Submit order undangan menyimpan data ke `invitation_orders`.
- Popup lanjut WhatsApp tetap muncul setelah insert sukses.

### Admin Dashboard

- Admin login menggunakan Supabase Auth.
- Non-admin tidak bisa membuka `/dashboard`.
- Booking/order baru dari public langsung muncul setelah refresh.
- Admin bisa tambah, update status, dan hapus data sesuai modul.
- FAQ/template/setting/galeri yang diedit di admin mempengaruhi landing page.

### Database & Security

- SQL migration 01-05 bisa dijalankan berurutan tanpa error.
- RLS aktif dan public tidak bisa select booking/order.
- Public RPC tidak bisa mengatur status menjadi deal/selesai.
- Service role key tidak muncul dalam bundle client.

## 14. Phase Pengerjaan untuk Agen Codex

### Phase 0 - Audit & Persiapan

Tujuan: memahami kondisi existing tanpa merusak frontend.

Checklist:

- Baca `AGENTS.md`.
- Baca panduan Next.js lokal yang relevan sebelum coding:
  - route handlers;
  - server actions/mutating data;
  - authentication;
  - data security;
  - environment variables.
- Audit pemakaian `firebase`, `localStorage`, dan import JSON.
- Jalankan `npm run lint` dan `npm run build` sebagai baseline bila memungkinkan.

Output:

- daftar file yang harus dimigrasikan;
- catatan risiko build/lint existing.

### Phase 1 - Supabase Database Baseline

Tujuan: menyiapkan database Supabase.

Checklist:

- Jalankan SQL berurutan:
  1. `src/sql/01_extensions_and_types.sql`
  2. `src/sql/02_core_schema.sql`
  3. `src/sql/03_rls_policies.sql`
  4. `src/sql/04_seed_public_content.sql`
  5. `src/sql/05_public_rpc_and_views.sql`
- Buat user admin di Supabase Auth.
- Insert profile admin ke `profiles` dengan role `super_admin`.
- Verifikasi public RPC submit berhasil.
- Verifikasi public tidak bisa select `mc_bookings` dan `invitation_orders`.

Output:

- database siap digunakan;
- minimal satu admin aktif.

### Phase 2 - Supabase SDK, Auth, dan DAL

Tujuan: mengganti fondasi Firebase/localStorage dengan Supabase.

Checklist:

- Install dependency Supabase dan Zod.
- Buat client Supabase:
  - browser;
  - server;
  - admin server-only.
- Buat DAL public dan admin.
- Implement login/logout Supabase Auth.
- Proteksi route `/dashboard`.
- Hapus atau isolasi `src/lib/firebase.ts` agar tidak dipakai lagi.

Output:

- login admin bekerja;
- dashboard terlindungi;
- tidak ada service role import di client.

### Phase 3 - Sinkronisasi Landing Page Public

Tujuan: landing page mengambil data dari Supabase.

Checklist:

- Ganti `settings.json`, `templates.json`, `galeri.json`, `faqs.json`, dan service hardcoded menjadi data Supabase.
- Implement submit booking MC.
- Implement submit order undangan.
- Pastikan popup WhatsApp tetap mengikuti flow existing.
- Tambahkan validasi min 7 hari untuk undangan.

Output:

- public frontend sinkron dengan database;
- submit form masuk ke dashboard.

### Phase 4 - Admin Booking & Order

Tujuan: dashboard admin mengelola lead masuk.

Checklist:

- Migrasi `/dashboard/booking-mc` dari localStorage ke Supabase.
- Migrasi `/dashboard/pesanan-undangan` dari localStorage ke Supabase.
- Implement search/filter client-side atau server-side.
- Implement tambah manual.
- Implement update status.
- Implement delete dengan konfirmasi.
- Pastikan CTA WhatsApp memakai nomor klien.

Output:

- booking/order public dan admin memakai sumber data yang sama.

### Phase 5 - Admin Konten Public

Tujuan: admin bisa mengubah konten yang tampil di landing page.

Checklist:

- Migrasi FAQ CRUD ke Supabase.
- Migrasi template undangan CRUD/update ke Supabase.
- Migrasi setting website/WhatsApp ke Supabase.
- Migrasi galeri ke Supabase Database + Storage bucket `gallery`.
- Migrasi kalender agar membaca booking/order dan event manual.
- Tambahkan revalidation bila memakai cache.

Output:

- perubahan admin terlihat di public page.

### Phase 6 - Cleanup, QA, dan Hardening

Tujuan: membersihkan artefak lama dan memastikan keamanan.

Checklist:

- Hapus dependency Firebase bila tidak dipakai.
- Hapus komentar Firestore dan dummy/localStorage yang sudah tidak relevan.
- Audit `NEXT_PUBLIC_` agar tidak ada secret.
- Uji RLS dengan anon key.
- Uji login/logout, refresh, dan direct URL dashboard.
- Jalankan `npm run lint`.
- Jalankan `npm run build`.

Output:

- aplikasi siap deploy;
- dokumentasi env dan cara apply SQL jelas.

## 15. Test Plan

| Area | Skenario | Expected Result |
| --- | --- | --- |
| Public MC | Submit form valid | Row baru di `mc_bookings`, status `pending`, popup WA muncul |
| Public MC | Submit tanpa nama/tanggal | Validasi tampil, tidak insert |
| Public Undangan | Tanggal acara kurang dari 7 hari | Ditolak |
| Public Undangan | Submit valid | Row baru di `invitation_orders`, status `new`, popup WA muncul |
| Admin Auth | Non-login akses dashboard | Redirect ke `/login` |
| Admin Auth | User tanpa role admin | Ditolak |
| Admin CRUD | Update status booking | Status berubah di Supabase |
| Admin Content | Edit FAQ | Landing page menampilkan FAQ terbaru |
| Security | Anon select booking/order | Ditolak RLS |
| Build | `npm run build` | Sukses |

## 16. Open Questions

1. Apakah admin hanya satu orang atau akan ada beberapa admin?
2. Apakah area layanan MC perlu disimpan sebagai field khusus?
3. Apakah order undangan perlu upload file materi dari customer di fase berikutnya?
4. Apakah kalender perlu sinkron Google Calendar di masa depan?
5. Apakah WhatsApp cukup via `wa.me`, atau nanti memakai WhatsApp Business API?
