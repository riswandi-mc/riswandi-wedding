# PRD — Riswandi Wedding Website

---

## 1. Overview

| Field | Detail |
|---|---|
| **Nama Produk** | Riswandi Wedding — MC & Digital Invitation |
| **Platform** | Web (Landing Page, Mobile-first) |
| **Tujuan** | Sarana promosi jasa MC & undangan digital, konversi via WhatsApp |
| **Target User** | Calon pengantin, EO, panitia event di sekitar area layanan |

---

## 2. Layanan yang Ditawarkan

| # | Layanan | Keterangan |
|---|---|---|
| 1 | MC All Event | Ulang tahun, wisuda, corporate, dll |
| 2 | MC Wedding Partner | Paket berdua / duo MC |
| 3 | MC Wedding Private | MC tunggal eksklusif |
| 4 | Undangan Digital | 10 template, min. pesan 7 hari sebelum acara |

---

## 3. Sitemap & Section Landing Page

```
Hero → Layanan MC → Undangan Digital → Cara Pesan 
→ Testimoni → Galeri/Dokumentasi → FAQ → Footer CTA
```

---

## 4. Fitur — Detail per Section

### 4.1 Hero Section
- Headline kuat: *"MC Profesional untuk Momen Tak Terlupakan"*
- Subtext + CTA button **"Booking Sekarang"** → WA
- Background: foto/video dokumentasi event (autoplay, mute)

---

### 4.2 Section Layanan MC

Tampil 3 card layanan:

| Layanan | Badge |
|---|---|
| MC All Event | ⭐ Populer |
| MC Wedding Partner | 💍 Duo |
| MC Wedding Private | 👑 Eksklusif |

4.2 Section Layanan MC (Updated)

Alur CTA ("Booking Sekarang"): 1. User klik tombol pada card layanan.
2. Muncul popup Form singkat: Nama, Tanggal Acara, Pilihan Layanan (dengan dropdown).
3. User klik "Lanjut ke WhatsApp".
4. Sistem mengirim data ke API Insforge (menyimpan ke tabel Booking MC di Dashboard).
5. Sistem melakukan auto-redirect ke WhatsApp dengan membawa template pesan yang sudah terisi data dari form.



### 4.3 Section Undangan Digital 

ui:
dengan card (image dengan link unsplash) dibawahnya ada tombol pesan dan ada lihat demo dengan link open di tab baru, dan ada harga yang tercantum di card
dengan daftar card:
Undangan 1 (Soft & Romantis)
Demo: https://azzam-azhari.github.io/wedding-invitation/
Harga: Rp 39.000

Undangan 2 (Modern / Aesthetic Dark)
Demo: (proses)
Harga: Rp 39.000

Undangan 3 (Fresh & Premium)
Demo: https://ngodingsolusi.github.io/the-wedding-of-rehan-maulidan/
Harga: Rp 39.000

Undangan 4 (Minimalis & Elegan)
Demo: https://invitation.sakeenah.site/
Harga: Rp 39.000

Undangan 5 (Floral / Botanical)
Demo: https://undangan-digital-pied.vercel.app/
Harga: Rp 39.000

Undangan 6 (Klasik & Clean)
Demo: https://undangan-pernikahan-online.netlify.app/
Harga: Rp 39.000

Undangan 7 (Stylish & Luxury)
Demo: https://t-faces.github.io/The-wedding-of-Ari-dan-Nisa/
Harga: Rp 39.000

Undangan 8 (Exclusive & Smooth Animation)
Demo: https://alystrastudio.github.io/Love-in-Motion/
Harga: Rp 39.000

Alur CTA ("Pesan Undangan"):

User klik tombol pesan pada template yang dipilih.

Muncul popup Form: Nama Mempelai, Tanggal, Lokasi, Pilihan Template.

User klik "Lanjut ke WhatsApp".

Sistem mengirim data ke API Insforge (menyimpan ke tabel Pesanan Undangan di Dashboard).

Sistem melakukan auto-redirect ke WhatsApp dengan membawa template pesan lengkap.

### 4.4 Cara Pesan (How It Works)

Step visual 3 langkah:
1. 📲 Pilih layanan & klik tombol pesan
2. 💬 Chat langsung via WhatsApp
3. ✅ Konfirmasi & jadwal dikunci

---

### 4.5 Testimoni

- Card slider/grid (min. 6 testimoni)
- Field: nama, jenis acara, bintang, kutipan singkat, foto (opsional)
- Tandai badge: *"Verified Client"*

---

### 4.6 Galeri / Dokumentasi

- Grid masonry foto & video event
- Filter: `Semua | Wedding | Corporate | Undangan Digital`
- Lightbox saat diklik

---

### 4.7 FAQ

Q&A accordion untuk pertanyaan umum:
- Apakah bisa request lagu/script?
- Berapa jauh area jangkauan?
- Apakah undangan bisa direvisi?
- Bagaimana sistem pembayaran?

---

### 4.8 Footer + Sticky CTA

- Footer: kontak, sosmed, logo
- **Sticky button WA** di pojok kanan bawah (selalu tampil)
- Text: *"Chat Kami"*

---

## 5. Spesifikasi Teknis

| Aspek | Keputusan |
|---|---|
| Stack Frontend | Next.js atau React (direkomendasikan untuk handling API & state modal form) |
| Backend & Admin Panel | (Menunggu Keputusan Pengganti) |
| Integrasi Data | REST API POST request ke endpoint backend saat form submit |
| Alur WhatsApp | Frontend membuat URL-encoded string dan mengeksekusi window.location.href = wa.me/628... |

## 6. KPI Sukses

| Metrik | Target |
|---|---|
| Bounce Rate | < 50% |
| CTA Click Rate | > 15% |
| Waktu di halaman | > 1.5 menit |
| Pesan WA masuk | Meningkat dari baseline |

---

## 7. Timeline Estimasi

| Fase | Durasi |
|---|---|
| Design (Figma/wireframe) | 3 hari |
| Development | 5–7 hari |
| Konten & foto | 2 hari (paralel) |
| Testing & launch | 1 hari |
| **Total** | **~2 minggu** |

---



menu pada dashboard admin
1. Dashboard
2. Booking MC (TABEL)
3. Pesanan Undangan (TABEL)
4. Galeri (UPLOAD VIDEO/FOTO)
5. Setting
6. Template Undangan (EDIT)
7. FAQ (EDIT)
