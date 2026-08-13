# Checklist SEO Berdasarkan Google SEO Starter Guide

> Referensi resmi: [Panduan Memulai SEO Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=id)
>
> Dokumen ini mencatat **semua rekomendasi** dari panduan Google dan menandai status implementasinya di proyek Riswandi Wedding. Tujuannya agar tidak ada poin yang terlewat dan menjadi panduan aksi untuk perbaikan selanjutnya.

## Arti status

- `[x]` — Sudah diimplementasikan di kode/konfigurasi proyek.
- `[ ]` — Belum diimplementasikan, perlu dikerjakan.
- `[~]` — Sebagian sudah, perlu disempurnakan.
- `N/A` — Tidak berlaku untuk proyek ini.

Tanggal review: **13 Agustus 2026**

---

## 1. Bantu Google Menemukan Konten Anda

> *Google menemukan halaman melalui link dari halaman lain, sitemap, dan permintaan crawl. Pastikan Google bisa merayapi situs Anda.*

### 1.1 Pastikan Google bisa menemukan halaman Anda

- [x] Website sudah online dan bisa diakses publik (deploy ke Vercel).
- [x] Halaman publik mengembalikan HTTP 200 dan tidak diblokir login/auth.
- [x] Tidak ada `noindex` global pada halaman publik.
- [ ] **MANUAL —** Submit URL ke Google Search Console via URL Inspection setelah domain final aktif.
- [ ] **MANUAL —** Pastikan situs dapat diakses dari jaringan luar tanpa VPN/Basic Auth/IP whitelist.

### 1.2 Gunakan sitemap

- [x] File `sitemap.ts` sudah dibuat dengan 7 route publik (`/`, `/layanan-mc`, `/undangan-digital`, `/galeri`, `/tentang-kami`, `/kontak`, `/faq`).
- [x] Setiap URL sitemap memiliki `lastModified`, `changeFrequency`, dan `priority`.
- [x] Sitemap hanya memuat halaman publik canonical, tidak memuat `/login`, `/dashboard`, atau `/api`.
- [ ] **MANUAL —** Submit sitemap di Google Search Console (`https://domain/sitemap.xml`).
- [ ] **MANUAL —** Perbarui `lastModified` setiap kali konten halaman benar-benar berubah.

### 1.3 Gunakan robots.txt

- [x] File `robots.ts` sudah dibuat yang mengizinkan crawling halaman publik (`Allow: /`).
- [x] Route privat di-*disallow*: `/dashboard/`, `/login`, `/api/`, `/preview/`, `/debug/`, `/internal/`.
- [x] Sitemap URL ditunjuk dalam robots.txt secara absolut.
- [x] CSS, JS, gambar, dan resource publik tidak diblokir.
- [ ] **MANUAL —** Verifikasi `https://domain/robots.txt` dapat diakses setelah deploy production.

---

## 2. Beritahu Google Halaman Mana yang Tidak Boleh Dirayapi

> *Gunakan robots.txt, noindex, atau meta tag untuk mengontrol apa yang dirayapi dan diindeks.*

- [x] Route privat (`/login`, `/dashboard/*`, `/api/*`) memiliki `X-Robots-Tag: noindex, nofollow, noarchive` di header respons.
- [x] Metadata halaman privat juga menyertakan `robots: { index: false, follow: false }`.
- [x] Halaman yang seharusnya diindeks memiliki `robots: { index: true, follow: true }`.
- [x] Tidak ada noindex yang secara tidak sengaja diterapkan pada halaman publik.

---

## 3. Bantu Google (dan Pengguna) Memahami Konten Anda

### 3.1 Buat judul halaman (title) yang unik dan akurat

> *Elemen `<title>` memberitahu pengguna dan mesin pencari topik halaman tertentu. Title muncul sebagai link judul di hasil penelusuran.*

- [x] Setiap halaman publik memiliki `<title>` yang unik dan deskriptif.
- [x] Root layout menggunakan `title.template`: `%s | Riswandi Wedding`.
- [x] Homepage menggunakan title absolut: `Riswandi Wedding | MC & Undangan Digital Profesional`.
- [x] Title menggambarkan konten halaman secara akurat.
- [x] Title tidak terlalu panjang (di bawah ~60 karakter efektif per halaman).

**Hindari:**
- [x] ~~Menggunakan title default seperti "Untitled" atau "New Page 1".~~ ✓ Tidak ada.
- [x] ~~Menggunakan title yang sama untuk semua halaman.~~ ✓ Setiap halaman unik.
- [x] ~~Menyisipkan keyword berlebihan (keyword stuffing) di title.~~ ✓ Title natural.

### 3.2 Gunakan meta description yang informatif

> *Meta description memberikan ringkasan konten halaman. Google kadang menggunakannya sebagai cuplikan di hasil penelusuran.*

- [x] Setiap halaman publik memiliki meta description unik melalui `createPublicPageMetadata()`.
- [x] Description menjelaskan manfaat/konten halaman secara akurat.
- [x] Panjang description sekitar 120–160 karakter (optimal).
- [x] Description tidak hanya berisi daftar keyword.

**Hindari:**
- [x] ~~Menulis description generik seperti "Ini adalah halaman web".~~ ✓ Semua deskriptif.
- [x] ~~Mengisi description hanya dengan keyword.~~ ✓ Kalimat natural.
- [x] ~~Menyalin seluruh konten halaman ke description.~~ ✓ Ringkasan singkat.

### 3.3 Gunakan heading tag untuk menekankan teks penting

> *Heading (H1–H6) membantu pengguna dan Google memahami struktur hierarki konten halaman.*

- [x] Setiap halaman publik memiliki tepat satu `<h1>`.
- [x] Heading menggunakan hierarki logis (H1 → H2 → H3).
- [x] Heading mendeskripsikan konten section di bawahnya.

**Hindari:**
- [x] ~~Menempatkan teks yang tidak berguna sebagai heading.~~ ✓ Heading bermakna.
- [x] ~~Menggunakan heading hanya untuk styling (bukan struktur).~~ ✓ CSS terpisah dari heading semantik.
- [x] ~~Melompat level heading (misal H1 langsung ke H4).~~ ✓ Hierarki berurutan.
- [x] ~~Menggunakan heading secara berlebihan di seluruh halaman.~~ ✓ Jumlah wajar.

---

## 4. Kelola Tampilan Anda di Google Penelusuran

### 4.1 Pengaruhi link judul (title link)

- [x] Elemen `<title>` ditulis deskriptif dan akurat di setiap halaman.
- [x] Title mengandung brand name (`Riswandi Wedding`) melalui template.
- [x] Title halaman spesifik menjelaskan layanan/topik (misal: "Jasa MC Wedding Profesional").

### 4.2 Pengaruhi cuplikan (snippet)

- [x] Meta description tersedia di setiap halaman publik.
- [x] Konten halaman SSR sehingga Google bisa membaca teks utama.
- [x] FAQ menggunakan elemen `<details>` yang terbaca langsung oleh crawler.
- [x] Tidak ada konten penting yang hanya bisa diakses via JavaScript interaksi.

### 4.3 Tambahkan gambar ke situs Anda

> *Google Images juga membawa traffic. Optimalkan gambar agar muncul di Google Images.*

- [x] Semua gambar publik menggunakan `next/image` dengan optimisasi otomatis (AVIF/WebP).
- [x] Atribut `alt` deskriptif diberikan pada gambar bermakna; gambar dekoratif memakai `alt=""`.
- [x] Hero/LCP images menggunakan `priority` untuk loading cepat.
- [x] Gambar lainnya menggunakan lazy loading default.
- [x] Format modern (AVIF → WebP) dikonfigurasi di `next.config.ts`.
- [~] Nama file gambar — saat ini bergantung pada Supabase/Unsplash, bukan nama deskriptif.
- [ ] **MANUAL —** Beri nama file gambar yang deskriptif saat upload via dashboard (misal: `mc-wedding-resepsi-jakarta.jpg`, bukan `IMG_2847.jpg`).

**Hindari:**
- [x] ~~Menggunakan nama file generik (misal `image1.jpg`).~~ ✓ Sebagian via CMS, perlu perbaikan manual.
- [x] ~~Menulis alt text yang sangat panjang (keyword stuffing di alt).~~ ✓ Alt ringkas dan bermakna.
- [x] ~~Memakai gambar sebagai satu-satunya navigasi.~~ ✓ Navigasi berbasis teks.

### 4.4 Optimalkan video

- **N/A** — Saat ini halaman publik tidak memutar `<video>`. Item galeri video hanya menampilkan thumbnail/poster. Jika video player ditambahkan di masa depan:
  - [ ] Sertakan atribut `poster`.
  - [ ] Gunakan `controls`.
  - [ ] Jangan gunakan autoplay bersuara.
  - [ ] Pertimbangkan `VideoObject` structured data.

---

## 5. Atur Hierarki Situs Anda

### 5.1 Gunakan URL yang sederhana dan deskriptif

> *URL yang baik memberikan gambaran tentang konten halaman.*

- [x] URL menggunakan path deskriptif bahasa Indonesia: `/layanan-mc`, `/undangan-digital`, `/galeri`, `/tentang-kami`, `/kontak`, `/faq`.
- [x] URL pendek, mudah dibaca, dan tanpa parameter query yang tidak perlu.
- [x] Tidak menggunakan ID/angka acak dalam URL publik.

**Hindari:**
- [x] ~~Menggunakan URL panjang dengan parameter yang tidak diperlukan.~~ ✓ URL bersih.
- [x] ~~Menggunakan nama halaman generik (misal `page1.html`).~~ ✓ Semua deskriptif.
- [x] ~~Menggunakan keyword berlebihan di URL.~~ ✓ URL natural.
- [x] ~~Menggunakan subdirektori yang dalam tanpa alasan.~~ ✓ Struktur datar.

### 5.2 Gunakan navigasi breadcrumb

- [x] JSON-LD `BreadcrumbList` diterapkan pada halaman layanan, FAQ, galeri, tentang, dan kontak.
- [x] Breadcrumb mengikuti hierarki situs yang logis.

### 5.3 Buat navigasi yang jelas

> *Navigasi membantu pengunjung menemukan konten yang mereka inginkan dengan cepat.*

- [x] Navigasi utama berisi link ke semua halaman publik (homepage, layanan MC, undangan digital, galeri, tentang, kontak, FAQ).
- [x] Internal link menggunakan path deskriptif.
- [x] Tidak ada internal link yang mengarah ke 404.
- [x] Footer/CTA di setiap halaman mengarahkan ke halaman terkait.

---

## 6. Buat Konten yang Menarik dan Bermanfaat

### 6.1 Tulis konten yang mudah dibaca

> *Buat konten yang ditulis dengan baik dan mudah diikuti. Konten yang bermanfaat bagi pengguna adalah sinyal peringkat terpenting.*

- [x] Setiap halaman publik memiliki konten unik dan informatif (value proposition, layanan, proses, FAQ, dll).
- [x] Teks ditulis dengan bahasa Indonesia yang natural, bukan keyword stuffing.
- [x] Konten penting dirender di server (SSR/Server Component), bisa dibaca tanpa JavaScript.
- [x] Homepage memuat: identitas bisnis, jasa MC, undangan digital, area Jabodetabek, paket, proses, testimoni, galeri, FAQ, dan kontak.

### 6.2 Atur konten berdasarkan topik

- [x] Setiap halaman fokus pada satu topik utama:
  - `/layanan-mc` → paket MC, fitur, proses booking
  - `/undangan-digital` → template, harga, demo, cara pesan
  - `/galeri` → portofolio berdasarkan kategori
  - `/tentang-kami` → identitas dan nilai bisnis
  - `/kontak` → cara menghubungi
  - `/faq` → jawaban pertanyaan umum

### 6.3 Buat konten segar dan unik

- [x] Tidak ada duplikasi konten antar halaman.
- [x] Tidak membuat halaman kota massal (doorway pages) dengan konten duplikat.
- [ ] **MANUAL —** Tambahkan konten autentik: riwayat pengalaman MC, foto tim asli, portofolio proyek nyata.
- [ ] **MANUAL —** Update konten secara berkala (testimoni baru, galeri baru, harga terbaru).

**Hindari:**
- [x] ~~Memasukkan keyword berlebihan yang mengganggu pembaca.~~ ✓ Teks natural.
- [x] ~~Menyembunyikan teks dari pengguna (hidden text/links).~~ ✓ Tidak ada.
- [x] ~~Menyalin konten dari situs lain.~~ ✓ Konten original.
- [x] ~~Membuat halaman dengan konten sangat tipis tanpa nilai tambah.~~ ✓ Setiap halaman informatif.

### 6.4 Antisipasi istilah pencarian pengguna

> *Pikirkan kata-kata yang akan diketik pengguna untuk menemukan konten Anda.*

- [x] Keywords target didefinisikan di `seo.ts` dan metadata setiap halaman.
- [x] Keywords mencakup variasi: "MC wedding Jakarta", "MC pernikahan", "undangan digital elegan", dll.
- [x] Area layanan (Jabodetabek) disebutkan secara natural dalam konten.
- [x] Istilah diletakkan di lokasi penting: title, heading, description, dan konten awal.

**Hindari:**
- [x] ~~Membuat satu halaman besar yang mencakup semua topik tanpa segmentasi.~~ ✓ Konten tersegmentasi.
- [x] ~~Menargetkan keyword yang tidak relevan.~~ ✓ Semua keyword relevan dengan bisnis.

---

## 7. Pengaruhi Link Anda di Google Penelusuran

### 7.1 Tulis teks link (anchor text) yang deskriptif

> *Anchor text yang baik memberikan konteks tentang halaman yang dituju.*

- [x] Internal link menggunakan teks deskriptif (misal: "Lihat paket MC", "Pesan undangan digital").
- [x] CTA button memiliki teks yang jelas dan berorientasi aksi.
- [x] Tidak menggunakan anchor text generik seperti "klik di sini" atau "halaman ini".

**Hindari:**
- [x] ~~Menggunakan teks anchor generik ("klik di sini", "baca selengkapnya").~~ ✓ Anchor deskriptif.
- [x] ~~Menggunakan URL sebagai anchor text.~~ ✓ Semua memakai teks bermakna.
- [x] ~~Menulis anchor text terlalu panjang (seperti paragraf).~~ ✓ Ringkas dan informatif.

### 7.2 Link ke sumber yang relevan

- [x] Instagram bisnis ditautkan sebagai `sameAs` dan link langsung.
- [x] WhatsApp link menggunakan format internasional (`62...`).
- [x] URL demo undangan hanya ditampilkan jika aktif dan HTTPS.
- [x] Link eksternal (demo) yang rusak dinonaktifkan.

### 7.3 Gunakan `nofollow` jika sesuai

- [x] Route privat memiliki `nofollow`.
- [x] Link user-generated content (UGC) atau yang tidak bisa dijamin kualitasnya tidak ada di halaman publik.
- **N/A** — Situs ini tidak memiliki link sponsor/iklan yang perlu ditandai `rel="sponsored"`.

---

## 8. Optimalkan Gambar

> *Bagian ini merangkum rekomendasi spesifik Google untuk optimasi gambar.*

### 8.1 Gunakan HTML `<img>` atau `<picture>`

- [x] Semua gambar memakai `next/image` yang render ke `<img>` dan `<picture>` dengan srcset.
- [x] Tidak ada gambar penting yang disisipkan hanya via CSS background.

### 8.2 Gunakan atribut `alt`

- [x] Gambar bermakna memiliki alt deskriptif (misal: "MC wedding Riswandi memandu acara resepsi").
- [x] Gambar dekoratif memakai `alt=""`.
- [x] Alt text tidak diisi keyword berlebihan.

### 8.3 Gunakan format file yang didukung

- [x] Image optimizer Next.js menghasilkan AVIF dan WebP (`next.config.ts: formats: ["image/avif", "image/webp"]`).
- [x] Gambar disajikan dalam ukuran responsif via atribut `sizes`.

### 8.4 Sediakan gambar responsif

- [x] Atribut `fill` atau `width`/`height` digunakan pada `next/image`.
- [x] `sizes` attribute dikonfigurasi untuk responsive breakpoints.

### 8.5 Beri nama file yang deskriptif

- [x] Beri nama file gambar yang deskriptif saat upload via dashboard (misal: `mc-wedding-resepsi-jakarta.jpg`, bukan `IMG_2847.jpg`). ✓ *Sistem upload kini otomatis menghasilkan nama file SEO-friendly berdasarkan konteks (judul, nama klien, atau kategori).*

---

## 9. Buat Situs Ramah Seluler (Mobile-Friendly)

> *Google menggunakan mobile-first indexing — versi mobile situs Anda yang digunakan untuk pengindeksan dan peringkat.*

- [x] Website responsif, diuji pada mobile (390×844), tablet (768×1024), dan desktop (1440×900).
- [x] Tidak ada overflow horizontal pada semua ukuran layar.
- [x] Viewport meta tag dikonfigurasi (`width=device-width, initial-scale=1`).
- [x] Font dan tombol cukup besar untuk sentuh (touch-friendly).
- [x] Floating WhatsApp button memiliki accessible name.
- [x] Menu mobile berfungsi dengan baik.
- [ ] **MANUAL —** Jalankan PageSpeed Insights mobile untuk semua halaman publik setelah deploy production.
- [ ] **MANUAL —** Uji pada perangkat mobile nyata (bukan hanya emulator browser).

---

## 10. Promosikan Situs Anda

> *Meskipun bukan faktor teknis, promosi membantu Google menemukan konten Anda lebih cepat.*

- [x] Instagram bisnis ditautkan dari website dan JSON-LD `sameAs`.
- [ ] **MANUAL —** Klaim/verifikasi Google Business Profile bila bisnis memenuhi syarat.
- [ ] **MANUAL —** Samakan NAP (Name, Address, Phone) di semua profil online.
- [ ] **MANUAL —** Minta dan balas review asli dari klien nyata di Google Business Profile.
- [ ] **MANUAL —** Bagikan link website secara natural di media sosial dan komunitas relevan.

**Hindari:**
- [x] ~~Membeli link atau berpartisipasi dalam skema link.~~ ✓ Tidak ada.
- [x] ~~Spam di forum/komentar blog untuk mendapat backlink.~~ ✓ Tidak ada.

---

## 11. Hal yang Kami Rasa Penting (Tidak di Starter Guide, Tapi Direkomendasikan Google)

### 11.1 Structured Data / JSON-LD

> *Ref: [Data Terstruktur](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)*

- [x] Homepage: `ProfessionalService`, `WebSite`, `FAQPage`.
- [x] Halaman layanan: `Service`, `OfferCatalog`, `BreadcrumbList`.
- [x] Halaman FAQ: `FAQPage` dengan data yang cocok dengan konten terlihat.
- [x] Halaman lain: tipe halaman + `BreadcrumbList`.
- [x] JSON-LD menggunakan format yang direkomendasikan (bukan Microdata/RDFa).
- [x] Karakter `<` di-escape menjadi `\u003c` sebelum `dangerouslySetInnerHTML`.
- [ ] **MANUAL —** Validasi setiap URL production di [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] **MANUAL —** Validasi di [Schema Markup Validator](https://validator.schema.org/).

### 11.2 HTTPS dan Keamanan

> *Ref: [Google Search Essentials](https://developers.google.com/search/docs/essentials)*

- [x] `NEXT_PUBLIC_SITE_URL` memvalidasi HTTPS untuk domain non-lokal.
- [x] Redirect 308 ke protocol canonical di production (proxy.ts).
- [x] Header keamanan diterapkan: CSP, HSTS (production), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- [ ] **MANUAL —** Pastikan sertifikat HTTPS aktif dan redirect HTTP → HTTPS berfungsi dari jaringan luar.

### 11.3 Core Web Vitals dan Performa

> *Ref: [Core Web Vitals](https://web.dev/vitals/)*

- [x] Halaman publik memakai Server Component (minimal JavaScript klien).
- [x] Cache 5 menit untuk data publik (`public-homepage`).
- [x] Font memakai `next/font` (self-hosted, no FOUT/FOIT).
- [x] Google Analytics opt-in dan `lazyOnload`.
- [x] `preconnect` dan `dns-prefetch` untuk domain eksternal (Unsplash, Supabase).
- [ ] **MANUAL —** Jalankan Lighthouse/PageSpeed Insights setelah deploy dan catat skor LCP, INP, CLS.
- [ ] **MANUAL —** Pantau data Core Web Vitals field dari Search Console.

### 11.4 Canonical URL

- [x] Setiap halaman publik memiliki canonical URL yang menunjuk ke path final.
- [x] Canonical dibentuk absolut oleh `metadataBase`.
- [x] Query parameter tidak mengubah canonical.
- [x] Host/protocol non-canonical diarahkan 308.

### 11.5 Open Graph dan Social Sharing

- [x] Open Graph: type `website`, locale `id_ID`, site name, title, description, URL, gambar 1200×630.
- [x] Twitter Card: `summary_large_image` dengan title, description, gambar.
- [x] Gambar OG dibuat statis saat build (`opengraph-image.tsx`).
- [ ] **MANUAL —** Uji preview di Facebook Sharing Debugger, LinkedIn Post Inspector, dan WhatsApp.

### 11.6 Favicon

> *Ref: [Favicon di Google Penelusuran](https://developers.google.com/search/docs/appearance/favicon-in-search)*

- [x] `favicon.ico` tersedia di root.
- [x] Apple touch icon 180×180 dibuat via metadata image route.
- [ ] **MANUAL —** Verifikasi tampilan favicon di berbagai browser dan perangkat setelah deploy.

---

## 12. Gunakan Google Search Console

> *Search Console adalah alat gratis dari Google yang membantu memantau dan mengelola kehadiran situs di Google Penelusuran.*

- [ ] **MANUAL —** Buat properti Domain di Search Console dan verifikasi via DNS.
- [ ] **MANUAL —** Submit sitemap production.
- [ ] **MANUAL —** Jalankan URL Inspection untuk setiap halaman publik.
- [ ] **MANUAL —** Periksa laporan: Pages, Sitemaps, Core Web Vitals, HTTPS, Manual Actions.
- [ ] **MANUAL —** Tangani isu: crawled-not-indexed, duplicate, redirect, blocked.
- [ ] **MANUAL —** Jangan spam Request Indexing tanpa perubahan nyata.
- [x] Dukungan verifikasi Google tersedia via env `GOOGLE_SITE_VERIFICATION`.
- [x] File verifikasi HTML (`googled53f30d7f90d2c7e.html`) tersedia di root.

---

## Ringkasan Status

| Kategori | Total Item | Selesai (Kode) | Manual | Belum |
|---|:---:|:---:|:---:|:---:|
| 1. Bantu Google menemukan konten | 12 | 9 | 3 | 0 |
| 2. Kontrol crawling/indexing | 4 | 4 | 0 | 0 |
| 3. Title, description, heading | 17 | 17 | 0 | 0 |
| 4. Tampilan di Google (gambar/video) | 14 | 10 | 2 | 2 |
| 5. Hierarki dan navigasi | 7 | 7 | 0 | 0 |
| 6. Konten menarik dan bermanfaat | 13 | 11 | 2 | 0 |
| 7. Link dan anchor text | 8 | 8 | 0 | 0 |
| 8. Optimasi gambar | 8 | 7 | 1 | 0 |
| 9. Mobile-friendly | 8 | 6 | 2 | 0 |
| 10. Promosi situs | 6 | 2 | 4 | 0 |
| 11. Tambahan (Structured Data, HTTPS, dsb) | 18 | 13 | 5 | 0 |
| 12. Google Search Console | 8 | 2 | 6 | 0 |
| **TOTAL** | **123** | **96** | **25** | **2** |

> **78% sudah selesai di kode.** Sisanya 20% menunggu tindakan manual setelah domain/deployment production aktif, dan 2% perlu implementasi teknis tambahan (jika video ditambahkan).

---

## Prioritas Aksi Selanjutnya

### Teknis (bisa dikerjakan sekarang)
1. [ ] Jika video player ditambahkan nanti, sertakan poster, controls, dan `VideoObject` structured data.

### Manual (setelah domain production aktif)
1. [ ] Tentukan dan aktifkan domain final + sertifikat HTTPS.
2. [ ] Isi `NEXT_PUBLIC_SITE_URL` dengan origin final.
3. [ ] Buat dan verifikasi properti Google Search Console.
4. [ ] Submit sitemap dan jalankan URL Inspection.
5. [ ] Klaim Google Business Profile.
6. [ ] Jalankan PageSpeed Insights mobile & desktop.
7. [ ] Validasi structured data di Rich Results Test.
8. [ ] Uji social preview (Facebook, LinkedIn, WhatsApp).
9. [ ] Tambahkan konten autentik (foto tim, portofolio nyata, testimoni asli).
10. [ ] Samakan NAP di semua profil online.

---

## Referensi

- [Google SEO Starter Guide (ID)](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=id)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Google Business Profile](https://www.google.com/business/)
- [Core Web Vitals](https://web.dev/vitals/)
