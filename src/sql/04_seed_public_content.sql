-- 04_seed_public_content.sql
-- Initial content migrated from the current JSON/frontend copy.

insert into public.website_settings (
  id,
  brand_name,
  phone_whatsapp,
  email,
  instagram_url,
  mc_whatsapp_template,
  invitation_whatsapp_template
)
values (
  true,
  'Riswandi Wedding',
  '6287737860657',
  'admin@gmail.com',
  'https://www.instagram.com/mriswandiwedding__/',
  'Halo Kak Riswandi! Saya tertarik dengan layanan [layanan]. Nama saya: [nama]. Tanggal acara: [tanggal]. Mohon info lebih lanjut ya, terima kasih.',
  'Halo Kak Riswandi! Saya ingin memesan Undangan Pernikahan Digital. Nama Mempelai: [namaMempelai]. Tanggal Acara: [tanggal]. Target Jadi: [tanggalTarget]. Lokasi: [lokasi]. Template: [template]. Saya sudah memahami ketentuan pemesanan minimal 7 hari sebelum acara. Mohon konfirmasi ketersediaan dan harga ya, terima kasih.'
)
on conflict (id) do update set
  brand_name = excluded.brand_name,
  phone_whatsapp = excluded.phone_whatsapp,
  email = excluded.email,
  instagram_url = excluded.instagram_url,
  mc_whatsapp_template = excluded.mc_whatsapp_template,
  invitation_whatsapp_template = excluded.invitation_whatsapp_template;

insert into public.mc_services (slug, title, badge_label, badge_variant, short_description, features, sort_order, is_featured, is_active)
values
  ('mc-all-event', 'MC All Event', 'Populer', 'popular', 'Ulang tahun, wisuda, corporate, gathering, dan lainnya.', array['Penguasaan audiens berbagai kalangan', 'Ice breaking interaktif dan seru', 'Fleksibilitas tema acara dan durasi'], 1, true, true),
  ('mc-wedding-partner', 'MC Wedding Partner', 'Duo', 'best_value', 'Paket berdua / duo MC untuk interaksi yang lebih hidup.', array['2 MC Profesional (Pria dan Wanita)', 'Chemistry dan tektokan asik di panggung', 'Sangat cocok untuk resepsi berskala besar'], 2, true, true),
  ('mc-wedding-private', 'MC Wedding Private', 'Eksklusif', 'exclusive', 'MC tunggal eksklusif dengan sentuhan personal dan elegan.', array['Konsep intimate dan hangat', 'Bantuan penyusunan rundown detail', 'Standby dari mulai akad hingga selesai'], 3, false, true)
on conflict (slug) do update set
  title = excluded.title,
  badge_label = excluded.badge_label,
  badge_variant = excluded.badge_variant,
  short_description = excluded.short_description,
  features = excluded.features,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active;

insert into public.invitation_templates (slug, name, theme, original_price, promo_price, demo_url, img_sig, min_order_days, sort_order, is_active, is_demo_ready)
values
  ('undangan-1-soft-romantis', 'Undangan 1 (Soft & Romantis)', 'Soft & Romantis', 59000, 39000, 'https://azzam-azhari.github.io/wedding-invitation/', 101, 7, 1, true, true),
  ('undangan-2-modern-aesthetic-dark', 'Undangan 2 (Modern / Aesthetic Dark)', 'Modern / Aesthetic Dark', 59000, 39000, '#', 102, 7, 2, true, false),
  ('undangan-3-fresh-premium', 'Undangan 3 (Fresh & Premium)', 'Fresh & Premium', 59000, 39000, 'https://ngodingsolusi.github.io/the-wedding-of-rehan-maulidan/', 103, 7, 3, true, true),
  ('undangan-4-minimalis-elegan', 'Undangan 4 (Minimalis & Elegan)', 'Minimalis & Elegan', 59000, 39000, 'https://invitation.sakeenah.site/', 104, 7, 4, true, true),
  ('undangan-5-floral-botanical', 'Undangan 5 (Floral / Botanical)', 'Floral / Botanical', 59000, 39000, 'https://undangan-digital-pied.vercel.app/', 105, 7, 5, true, true),
  ('undangan-6-klasik-clean', 'Undangan 6 (Klasik & Clean)', 'Klasik & Clean', 59000, 39000, 'https://undangan-pernikahan-online.netlify.app/', 106, 7, 6, true, true),
  ('undangan-7-stylish-luxury', 'Undangan 7 (Stylish & Luxury)', 'Stylish & Luxury', 59000, 39000, 'https://t-faces.github.io/The-wedding-of-Ari-dan-Nisa/', 107, 7, 7, true, true),
  ('undangan-8-exclusive-smooth-animation', 'Undangan 8 (Exclusive & Smooth Animation)', 'Exclusive & Smooth Animation', 59000, 39000, 'https://alystrastudio.github.io/Love-in-Motion/', 108, 7, 8, true, true)
on conflict (slug) do update set
  name = excluded.name,
  theme = excluded.theme,
  original_price = excluded.original_price,
  promo_price = excluded.promo_price,
  demo_url = excluded.demo_url,
  img_sig = excluded.img_sig,
  min_order_days = excluded.min_order_days,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  is_demo_ready = excluded.is_demo_ready;

insert into public.faqs (question, answer, sort_order, is_active)
values
  ('Apakah bisa request lagu atau script MC?', 'Tentu saja. Kami fleksibel dan akan menyesuaikan gaya, bahasa, serta script MC sesuai tema dan preferensi acara Anda. Request lagu untuk backsound interaksi juga diperbolehkan.', 1, true),
  ('Berapa jauh area jangkauan layanan MC?', 'Kami melayani wilayah Jabodetabek dan sekitarnya secara reguler. Untuk luar kota atau luar pulau, layanan tetap bisa dibahas dengan tambahan biaya akomodasi dan transportasi.', 2, true),
  ('Apakah undangan digital bisa direvisi?', 'Ya, tersedia revisi minor seperti ubah teks, perubahan jam/tanggal, dan perbaikan typo maksimal 2 kali sebelum hari H acara.', 3, true),
  ('Bagaimana sistem pembayarannya?', 'Pembayaran dilakukan melalui transfer bank. Down payment minimal 30% diperlukan untuk mengunci jadwal. Pelunasan dilakukan maksimal H-1 sebelum acara.', 4, true),
  ('Berapa lama proses pembuatan undangan digital?', 'Pembuatan undangan digital memakan waktu sekitar 3-5 hari kerja setelah data lengkap diterima. Pemesanan disarankan minimal 7 hari sebelum undangan disebar.', 5, true)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.gallery_items (title, category, media_type, media_url, sort_order, is_featured, is_active)
values
  ('Wedding Kevin & Amanda', 'Wedding', 'image', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop', 1, true, true),
  ('Corporate Gathering Tech Corp', 'Corporate', 'image', 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop', 2, false, true),
  ('Sweet Seventeen Anita', 'Private', 'video', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop', 3, false, true),
  ('Wedding Dimas & Sarah', 'Wedding', 'image', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', 4, false, true),
  ('Demo Undangan Floral', 'Undangan Digital', 'image', 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=800&auto=format&fit=crop', 5, false, true),
  ('Anniversary Dinner', 'Private', 'image', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop', 6, false, true)
on conflict (media_url) do update set
  title = excluded.title,
  category = excluded.category,
  media_type = excluded.media_type,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active;

insert into public.testimonials (client_name, event_type, quote, rating, is_verified, sort_order, is_active)
values
  ('Kevin & Amanda', 'Wedding', 'Acara berjalan rapi, hangat, dan suasananya hidup dari awal sampai selesai.', 5, true, 1, true),
  ('Dimas & Sarah', 'Wedding', 'Rundown dibantu dengan detail dan pembawaan MC sangat nyaman untuk keluarga.', 5, true, 2, true),
  ('Tech Corp', 'Corporate', 'MC mampu menjaga energi audiens dan membuat sesi gathering terasa interaktif.', 5, true, 3, true)
on conflict (client_name, quote) do update set
  event_type = excluded.event_type,
  rating = excluded.rating,
  is_verified = excluded.is_verified,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
