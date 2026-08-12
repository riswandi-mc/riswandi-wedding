# Checklist SEO Website Next.js - Riswandi Wedding

> Checklist ini membantu website mudah dirayapi, dipahami, dan berpeluang tampil di Google. Tidak ada konfigurasi yang menjamin halaman langsung terindeks atau mendapat posisi tertentu.

## Arti status

- `[x]` selesai di kode dan sudah lulus pemeriksaan lokal yang disebutkan.
- `[ ] **MANUAL —**` harus dilakukan atau dikonfirmasi pemilik setelah domain/deployment/data bisnis tersedia.
- `N/A` tidak berlaku pada implementasi saat ini.

Status audit terakhir: **11 Agustus 2026**.

## Bukti verifikasi lokal

- [x] `npm run lint` lulus tanpa error.
- [x] `npm run build` lulus menggunakan Next.js 16.2.7 dan environment Supabase proyek saat ini.
- [x] Build menghasilkan halaman publik `/`, `/layanan-mc`, `/undangan-digital`, `/galeri`, `/tentang-kami`, `/kontak`, dan `/faq`.
- [x] Ketujuh URL sitemap mengembalikan HTTP 200 tanpa redirect pada server production-mode lokal.
- [x] Setiap halaman publik memiliki title, description, canonical, tepat satu H1, Open Graph, Twitter card, dan satu payload JSON-LD yang dapat di-parse.
- [x] `/dashboard` tanpa sesi mengembalikan redirect 307 ke `/login`.
- [x] `/login` mengirim `X-Robots-Tag: noindex, nofollow, noarchive`.
- [x] `/api/keep-alive` tanpa secret mengembalikan 401; route seed yang sudah tidak dipakai mengembalikan 404.
- [x] `/googled53f30d7f90d2c7e.html`, `/opengraph-image`, dan `/apple-icon` mengembalikan HTTP 200.
- [x] Pemeriksaan browser pada desktop 1440×900, tablet 768×1024, dan mobile 390×844 tidak menemukan overflow horizontal, gambar gagal, atau error console.
- [x] Enam URL demo undangan yang ditampilkan mengembalikan HTTP 200 setelah mengikuti redirect; dua template yang belum siap tidak memiliki link demo aktif.
- [ ] **MANUAL —** Simpan URL/bukti deployment production di issue atau PR setelah domain final aktif.

## Target keyword dan search intent

- [x] `/`: jasa MC wedding profesional di Jabodetabek dengan undangan digital sebagai layanan pendamping.
- [x] `/layanan-mc`: paket, cakupan, proses booking, area layanan, dan FAQ jasa MC.
- [x] `/undangan-digital`: template, demo, harga, manfaat, dan proses pemesanan undangan digital.
- [x] `/galeri`: dokumentasi berdasarkan kategori acara dan undangan digital.
- [x] `/tentang-kami`: identitas, nilai, cara kerja, dan area layanan.
- [x] `/kontak`: kanal konsultasi dan informasi yang perlu disiapkan calon pelanggan.
- [x] `/faq`: jawaban tentang script MC, jangkauan, pembayaran, revisi, dan waktu pengerjaan.
- [x] Daftar kebutuhan calon pelanggan yang ditargetkan: memilih paket MC, mengecek MC luar kota, request script/rundown, membandingkan template dan harga undangan, melihat demo, mengetahui waktu pengerjaan/revisi, serta menghubungi admin.
- [x] Tidak memakai meta keywords atau membuat halaman kota massal dengan konten duplikat.

## P0 - Domain, HTTPS, deployment, dan environment

- [x] `NEXT_PUBLIC_SITE_URL` divalidasi sebagai origin tanpa path/query/hash/trailing slash dan domain non-lokal wajib HTTPS.
- [x] `proxy.ts` menyiapkan redirect permanen 308 ke protocol dan host canonical pada deployment production.
- [x] Tidak ada noindex global pada halaman publik.
- [x] Halaman publik memiliki fallback informatif ketika RPC/data Supabase gagal atau payload tidak valid.
- [x] Server Action booking menangkap kegagalan Supabase dan mengembalikan pesan umum, bukan error 5xx mentah.
- [ ] **MANUAL —** Tentukan dan beli/aktifkan domain final.
- [ ] **MANUAL —** Pilih host utama, `www` atau non-`www`, lalu arahkan DNS dan host lama ke host tersebut.
- [ ] **MANUAL —** Aktifkan sertifikat HTTPS dan uji redirect HTTP → HTTPS dari jaringan luar.
- [ ] **MANUAL —** Isi `NEXT_PUBLIC_SITE_URL` production dengan origin final HTTPS; jangan memakai localhost atau preview URL.
- [ ] **MANUAL —** Pastikan deployment production tidak dilindungi login, Basic Auth, IP allowlist, atau maintenance page.
- [ ] **MANUAL —** Uji halaman publik dari jaringan luar dan saat Supabase sengaja dibuat tidak tersedia di staging.

## P0 - Metadata Next.js App Router

- [x] Root metadata berisi nama bisnis, title, description, authors, creator, dan publisher.
- [x] `<html lang="id">` diterapkan.
- [x] `metadataBase` menggunakan `NEXT_PUBLIC_SITE_URL` dengan fallback development yang tervalidasi.
- [x] `title.template` memakai format `%s | Riswandi Wedding`.
- [x] Setiap halaman publik memiliki title, description, canonical, dan robots index/follow yang spesifik.
- [x] Open Graph berisi type `website`, locale `id_ID`, site name, title, description, URL, alt, dan gambar 1200×630.
- [x] Twitter/X memakai `summary_large_image` dengan title, description, dan gambar.
- [x] Favicon bisnis tersedia dan apple icon 180×180 dibuat melalui metadata image route.
- [x] Dukungan meta verifikasi Google melalui env `GOOGLE_SITE_VERIFICATION` sudah tersedia tanpa menaruh token di source.
- [x] File verifikasi Google yang tersedia dipublikasikan dari `public/` dan dapat diakses pada URL root.
- [x] Web App Manifest (`manifest.ts`) dikonfigurasi untuk memenuhi best-practice Progressive Web App (PWA) Google.
- [ ] **MANUAL —** Pilih metode verifikasi Search Console yang akan dipakai dan isi token env bila memilih meta tag.
- [ ] **MANUAL —** Uji tampilan favicon, apple icon, dan social preview pada perangkat/platform nyata setelah deploy.

## P0 - robots.txt dan sitemap

- [x] `src/app/robots.ts` mengizinkan halaman publik dan menunjuk ke sitemap absolut.
- [x] Robots melarang `/dashboard/`, `/login`, `/api/`, `/preview/`, `/debug/`, dan `/internal/`.
- [x] CSS, JavaScript, gambar, OG image, favicon, robots, dan sitemap tidak diblokir proxy.
- [x] `src/app/sitemap.ts` hanya memuat tujuh route publik canonical dan tidak memuat login/dashboard/API/query tracking.
- [x] Setiap URL sitemap memiliki `lastModified` berdasarkan perubahan konten 11 Agustus 2026, change frequency, dan priority.
- [x] XML sitemap valid secara parser lokal dan seluruh URL-nya HTTP 200 tanpa redirect lokal.
- [ ] **MANUAL —** Perbarui tanggal `lastModified` ketika isi halaman benar-benar berubah lagi.
- [ ] **MANUAL —** Uji `https://domain-final/robots.txt` dan `https://domain-final/sitemap.xml` setelah deploy.
- [ ] **MANUAL —** Pastikan seluruh URL sitemap production 200 tanpa redirect chain, lalu submit sitemap di Search Console.

## P0 - Indexability, canonical, link, dan status HTTP

- [x] Route publik mengembalikan 200 dan tidak memiliki noindex.
- [x] Route privat memiliki noindex/nofollow pada metadata dan header respons.
- [x] Canonical setiap halaman menunjuk ke path final dan dibentuk absolut oleh `metadataBase`.
- [x] Query parameter tidak mengubah canonical; trailing slash dan kapitalisasi mengikuti redirect Next.js.
- [x] Host/protocol non-canonical diarahkan 308 oleh proxy production.
- [x] Halaman 404 custom mengembalikan status 404 dan tidak masuk sitemap.
- [x] Internal link utama memakai path deskriptif ke halaman layanan, undangan, galeri, tentang, FAQ, dan kontak.
- [x] URL demo hanya ditampilkan bila HTTPS, valid, dan ditandai siap; demo yang diketahui rusak sudah dinonaktifkan.
- [x] Placeholder demo `#` dibersihkan menjadi `null` pada seed dan data Supabase aktif.
- [x] Tidak ada link internal 404 atau route seed aktif pada build terbaru.
- [ ] **MANUAL —** Uji domain/host lama, variasi HTTP/HTTPS, kapitalisasi, trailing slash, dan parameter di production/CDN.

## P0 - Konten dan struktur halaman

- [x] Ketujuh halaman publik mempunyai H1 tunggal, urutan heading logis, value proposition, CTA, dan konten inti SSR.
- [x] Homepage menjelaskan identitas, jasa MC, undangan digital, area Jabodetabek, paket, proses, testimoni, galeri, FAQ, dan kontak.
- [x] `/layanan-mc` memuat paket, fitur, cakupan, proses booking, area layanan, FAQ terlihat, dan CTA.
- [x] `/undangan-digital` memuat fitur, katalog, harga, demo aman, minimal hari pemesanan, proses, dan CTA form.
- [x] `/galeri` memuat judul, kategori, jenis media, deskripsi konteks, dan CTA Instagram/kontak.
- [x] `/tentang-kami` memuat identitas, nilai layanan, cara kerja, area layanan, dan CTA.
- [x] `/kontak` memuat WhatsApp, email bila tersedia, Instagram, alamat bila tersedia, atau area layanan sebagai fallback.
- [x] `/faq` menampilkan pertanyaan/jawaban aktif di HTML menggunakan elemen `details`.
- [x] Konten penting tidak bergantung pada interaksi carousel/dialog agar dapat dibaca crawler.
- [ ] **MANUAL —** Tambahkan riwayat/pengalaman yang dapat dibuktikan dan foto tim autentik pada halaman tentang.
- [ ] **MANUAL —** Isi alamat, jam operasional, dan peta hanya jika data bisnis final serta lokasi boleh dipublikasikan.
- [ ] **MANUAL —** Pastikan judul/nama proyek pada galeri benar-benar proyek nyata, bukan seed contoh.

## P0 - Gambar, media, dan aksesibilitas

- [x] Gambar penting memiliki alt deskriptif; hero dekoratif memakai alt kosong.
- [x] Semua gambar memakai `next/image` dengan `fill`/ukuran, `sizes`, lazy loading default, dan priority pada hero/LCP.
- [x] Next Image dikonfigurasi menghasilkan AVIF dan WebP.
- [x] Gambar Open Graph 1200×630 dan apple icon dibuat secara statis saat build.
- [x] Form memiliki label untuk semua input, pesan error `role=alert`, status sukses `role=status`, serta atribut tel/autocomplete/aria-invalid.
- [x] Tombol menu dan floating WhatsApp mempunyai accessible name.
- [x] Layout diuji pada mobile, tablet, dan desktop tanpa overflow atau gambar gagal.
- [ ] **MANUAL —** Ganti nama file media generik menjadi nama deskriptif saat aset asli diunggah melalui dashboard.
- [ ] **MANUAL —** Audit kontras, zoom 200%, screen reader, dan alur keyboard lengkap dengan pengguna/perangkat aksesibilitas.
- **N/A:** Halaman publik saat ini tidak memutar elemen `<video>`; item video hanya menampilkan poster/thumbnail. Jika player ditambahkan, wajib poster, controls, ukuran tetap, dan tanpa autoplay bersuara.

## P1 - Structured data / JSON-LD

- [x] JSON-LD hanya mengambil informasi yang terlihat atau dikonfigurasi pada website.
- [x] Homepage memakai `ProfessionalService`, `WebSite`, dan `FAQPage`.
- [x] Halaman layanan memakai `Service`, `OfferCatalog` bila data tersedia, dan `BreadcrumbList`.
- [x] Halaman FAQ memakai pertanyaan/jawaban yang sama dengan konten terlihat.
- [x] Halaman tentang, kontak, dan galeri memakai tipe halaman serta breadcrumb yang sesuai.
- [x] Telephone, email, Instagram `sameAs`, areaServed, logo, image, URL, dan description hanya ditambahkan dari data yang tersedia.
- [x] Address hanya ditambahkan jika nilai alamat tersedia; jam operasional dan geo tidak direka.
- [x] Tidak membuat `Review` atau `AggregateRating` dari testimoni.
- [x] Hasil `JSON.stringify` mengganti karakter `<` menjadi `\u003c` sebelum `dangerouslySetInnerHTML`.
- [x] Seluruh JSON-LD berhasil di-parse dari HTML production-mode lokal tanpa error.
- [ ] **MANUAL —** Validasi setiap URL production di Rich Results Test dan Schema Markup Validator; simpan bukti/error yang ditemukan.

## P1 - SEO lokal dan reputasi bisnis

- [x] Nomor WhatsApp aktif di website memakai format internasional `62...`.
- [x] Area Jakarta, Bogor, Depok, Tangerang, Bekasi, dan luar kota disebutkan natural tanpa doorway pages.
- [x] `sameAs` hanya mengambil URL Instagram yang dikonfigurasi sebagai profil bisnis.
- [ ] **MANUAL —** Pastikan akun Instagram tersebut benar-benar akun resmi.
- [ ] **MANUAL —** Klaim/verifikasi Google Business Profile bila bisnis memenuhi syarat.
- [ ] **MANUAL —** Samakan nama, alamat, nomor telepon, kategori, area, jam, logo, foto, dan link website di semua profil.
- [ ] **MANUAL —** Minta dan balas review asli; jangan membeli atau membuat review palsu.
- [ ] **MANUAL —** Dapatkan izin tertulis sebelum menerbitkan foto, video, nama, testimoni, atau logo klien.

## P1 - Performa, Core Web Vitals, dan rendering

- [x] Public data memakai cache 5 menit dengan tag `public-homepage` dan invalidasi segera setelah admin mengubah konten.
- [x] Halaman publik baru menggunakan Server Component; JavaScript client hanya dipakai untuk interaksi/tracking yang memerlukannya.
- [x] Google Analytics tidak dimuat tanpa dua env opt-in dan memakai strategi `lazyOnload` bila diaktifkan.
- [x] Font memakai `next/font`; font mono yang tidak digunakan sudah dihapus.
- [x] Tidak ada error hydration, error console, gambar gagal, atau overflow pada browser lokal.
- [x] JavaScript client dibatasi pada homepage interaktif dan komponen tracking; seluruh halaman detail baru memakai Server Component.
- Rekomendasi opsional berikutnya: pecah section statis `home-page-client.tsx` menjadi Server Component bila hasil Lighthouse menunjukkan bundle homepage sebagai bottleneck.
- [ ] **MANUAL —** Jalankan Lighthouse/PageSpeed Insights mobile dan desktop untuk `/`, `/layanan-mc`, dan halaman conversion utama setelah deploy.
- [ ] **MANUAL —** Pantau LCP, INP, dan CLS dari data field Search Console/analytics, bukan hanya lab lokal.
- [ ] **MANUAL —** Uji jaringan lambat dan perangkat mobile kelas menengah; optimalkan aset yang terbukti menjadi bottleneck.

## P1 - Keamanan yang mendukung SEO

- [x] Dashboard memerlukan user aktif dengan role admin/super_admin; akses tanpa sesi diarahkan ke login.
- [x] Endpoint keep-alive memerlukan `CRON_SECRET`, memakai respons umum, dan tidak mengembalikan credential/data booking.
- [x] Route seed lama sudah dihapus dari deployment.
- [x] Header CSP, HSTS production, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, dan `Permissions-Policy` diterapkan.
- [x] CSP hanya mengizinkan origin aplikasi, Supabase terkonfigurasi, Unsplash, dan domain analytics yang dibutuhkan.
- [x] Secret/service-role tetap server-only; pemindaian tracked source tidak menemukan pola credential umum yang tertanam.
- [x] Error Supabase pada halaman publik dan Server Action ditangkap tanpa membocorkan pesan database mentah.
- [ ] **MANUAL —** Uji cookie/session login pada domain HTTPS production, termasuk logout, expiry, role non-admin, dan `Secure`/`SameSite` aktual.
- [ ] **MANUAL —** Audit persetujuan publikasi seluruh data klien yang sudah ada di Supabase.

## P1 - Analytics dan pengukuran

- [x] Integrasi GA4 bersifat opt-in melalui `NEXT_PUBLIC_ENABLE_ANALYTICS=true` dan `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [x] Event code tersedia untuk klik WhatsApp, submit booking MC berhasil, submit undangan berhasil, klik demo, email, dan Instagram.
- [x] IP anonymization diaktifkan pada konfigurasi gtag.
- [ ] **MANUAL —** Tentukan kebijakan privasi/consent, buat properti GA4, isi Measurement ID, lalu aktifkan env hanya setelah sesuai kebijakan.
- [ ] **MANUAL —** Uji event di GA4 DebugView/Realtime tanpa mengirim data pribadi pada parameter event.
- [ ] **MANUAL —** Buat baseline source/medium, organic traffic, impressions, clicks, CTR, posisi, landing page, dan conversion.
- [ ] **MANUAL —** Tinjau mingguan pada bulan pertama dan bulanan setelah stabil; catat perubahan title/konten besar.

## P0 - Google Search Console dan peluncuran

- [ ] **MANUAL —** Buat properti Domain dan verifikasi melalui DNS atau metode resmi lain.
- [ ] **MANUAL —** Pastikan host property sama dengan canonical, `NEXT_PUBLIC_SITE_URL`, sitemap, dan URL Google Business Profile.
- [ ] **MANUAL —** Submit sitemap production.
- [ ] **MANUAL —** Jalankan URL Inspection dan Request Indexing untuk seluruh halaman publik setelah production stabil.
- [ ] **MANUAL —** Uji live URL dan asset penting, lalu periksa Pages, Sitemaps, Core Web Vitals, HTTPS, dan Manual actions.
- [ ] **MANUAL —** Tangani status crawled/discovered not indexed, duplicate, redirect, atau blocked berdasarkan laporan nyata.
- [ ] **MANUAL —** Jangan request indexing berulang tanpa perubahan/perbaikan.
- [ ] **MANUAL —** Daftarkan Bing Webmaster Tools bila kanal tambahan diperlukan.

## QA sebelum go-live

- [x] Lint dan build production-mode lokal lulus.
- [x] HTML server memuat metadata, canonical, H1, konten inti, OG/Twitter, dan JSON-LD.
- [x] Robots/sitemap lokal valid, private route tidak tercantum, dan semua URL sitemap 200.
- [x] Tidak ada `Create Next App`, `[ISI]`, canonical salah, link internal 404, mixed-content link, atau gambar bawaan Next/Vercel pada HTML publik.
- [x] Validasi form lokal tetap bekerja tanpa menyembunyikan konten informatif dari crawler.
- [x] Tampilan diuji pada mobile, tablet, dan desktop.
- [ ] **MANUAL —** Lakukan satu submit booking MC dan undangan menggunakan data uji yang disetujui, lalu hapus data uji dari dashboard.
- [ ] **MANUAL —** Uji OG preview di Facebook Sharing Debugger, LinkedIn Post Inspector, dan aplikasi chat yang dipakai klien.
- [ ] **MANUAL —** Dokumentasikan izin foto, testimoni, logo, nama, dan data klien.
- [ ] **MANUAL —** Ulangi seluruh QA pada URL production nyata; hasil lokal tidak membuktikan Google telah mengindeks halaman.

## Urutan peluncuran

1. [x] Fondasi kode P0: metadata root, `lang=id`, metadataBase, canonical, robots, sitemap, noindex privat, redirect canonical, dan fallback data.
2. [x] Konten P0: title/description/H1/konten unik, alt, internal link, halaman publik tambahan, dan status HTTP.
3. [x] P1 kode: OG/Twitter image, JSON-LD, cache, analytics opt-in, event tracking, optimasi image, dan header keamanan.
4. [ ] **MANUAL —** Domain/HTTPS/deployment production, Search Console, sitemap, URL Inspection, validator schema/social preview, dan QA production.
5. [ ] **MANUAL —** Google Business Profile, konten/portofolio autentik, izin klien, review asli, data Core Web Vitals, dan iterasi analytics.

## Referensi manual

- Google Search Console: https://search.google.com/search-console
- PageSpeed Insights: https://pagespeed.web.dev/
- Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- Google Business Profile: https://www.google.com/business/
- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Dokumentasi Next.js 16 lokal: `node_modules/next/dist/docs/`.

## Catatan rahasia dan environment

- [x] File `.env*`, `.vercel`, `.insforge`, private key, dan build output diabaikan Git.
- [x] Token verifikasi/analytics dapat diberikan melalui environment dan tidak perlu di-commit.
- [✅] **MANUAL —** Simpan nilai environment berbeda untuk local, preview, dan production di dashboard hosting.
- [ ] **MANUAL —** Rotasi secret segera bila pernah terpublikasi di commit, log, screenshot, atau chat.
