"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageCircle, Camera, Mail, MapPin, CheckCircle, Music, Info, Calendar as CalendarIcon, Phone, ExternalLink, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const WA_NUMBER = "6287737860657"; // Updated with real number

const undanganTemplates = [
  { id: 1, name: "Undangan 1 (Soft & Romantis)", demo: "https://azzam-azhari.github.io/wedding-invitation/", price: "Rp 39.000", imgSig: 101 },
  { id: 2, name: "Undangan 2 (Modern / Aesthetic Dark)", demo: "#", price: "Rp 39.000", imgSig: 102, onProcess: true },
  { id: 3, name: "Undangan 3 (Fresh & Premium)", demo: "https://ngodingsolusi.github.io/the-wedding-of-rehan-maulidan/", price: "Rp 39.000", imgSig: 103 },
  { id: 4, name: "Undangan 4 (Minimalis & Elegan)", demo: "https://invitation.sakeenah.site/", price: "Rp 39.000", imgSig: 104 },
  { id: 5, name: "Undangan 5 (Floral / Botanical)", demo: "https://undangan-digital-pied.vercel.app/", price: "Rp 39.000", imgSig: 105 },
  { id: 6, name: "Undangan 6 (Klasik & Clean)", demo: "https://undangan-pernikahan-online.netlify.app/", price: "Rp 39.000", imgSig: 106 },
  { id: 7, name: "Undangan 7 (Stylish & Luxury)", demo: "https://t-faces.github.io/The-wedding-of-Ari-dan-Nisa/", price: "Rp 39.000", imgSig: 107 },
  { id: 8, name: "Undangan 8 (Exclusive & Smooth Animation)", demo: "https://alystrastudio.github.io/Love-in-Motion/", price: "Rp 39.000", imgSig: 108 },
];

export default function Home() {
  // Navigation State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal States
  const [isMCOpen, setIsMCOpen] = useState(false);
  const [mcForm, setMcForm] = useState({ nama: "", tanggal: "", layanan: "" });

  const [isUndanganOpen, setIsUndanganOpen] = useState(false);
  const [undanganForm, setUndanganForm] = useState<{
    namaMempelai: string;
    tanggal: Date | undefined;
    tanggalTarget: Date | undefined;
    lokasi: string;
    template: string;
  }>({
    namaMempelai: "",
    tanggal: undefined,
    tanggalTarget: undefined,
    lokasi: "",
    template: "",
  });

  const handleMCOpen = (layanan: string) => {
    setMcForm({ nama: "", tanggal: "", layanan });
    setIsMCOpen(true);
  };

  const handleMCSubmit = () => {
    const text = `Halo Kak Riswandi! 👋\nSaya tertarik dengan layanan ${mcForm.layanan}.\nNama saya: ${mcForm.nama}\nTanggal acara: ${mcForm.tanggal}\nMohon info lebih lanjut ya, terima kasih 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setIsMCOpen(false);
  };

  const handleUndanganOpen = (templateName: string = "") => {
    setUndanganForm({
      namaMempelai: "",
      tanggal: undefined,
      tanggalTarget: undefined,
      lokasi: "",
      template: templateName,
    });
    setIsUndanganOpen(true);
  };

  const handleUndanganSubmit = () => {
    const formattedTanggal = undanganForm.tanggal ? format(undanganForm.tanggal, "dd MMMM yyyy", { locale: id }) : "-";
    const formattedTanggalTarget = undanganForm.tanggalTarget ? format(undanganForm.tanggalTarget, "dd MMMM yyyy", { locale: id }) : "-";

    const text = `Halo Kak Riswandi! 👋\nSaya ingin memesan Undangan Pernikahan Digital.\n\n📋 Detail Pesanan:\n- Nama Mempelai : ${undanganForm.namaMempelai}\n- Tanggal Acara : ${formattedTanggal}\n- Target Jadi Undangan : ${formattedTanggalTarget}\n- Lokasi Acara  : ${undanganForm.lokasi}\n- Template      : ${undanganForm.template}\n\nSaya sudah memahami ketentuan pemesanan minimal 7 hari sebelum acara.\nMohon konfirmasi ketersediaan dan harga ya, terima kasih! 🙏`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setIsUndanganOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-xl tracking-tight">Riswandi Wedding</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#layanan" className="hover:text-primary transition-colors">Layanan</a>
            <a href="#undangan" className="hover:text-primary transition-colors">Undangan</a>
            <a href="#testimoni" className="hover:text-primary transition-colors">Testimoni</a>
            <a href="#galeri" className="hover:text-primary transition-colors">Galeri</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>
          
          <div className="flex items-center gap-2">
            {/* Desktop / Tablet CTA Button */}
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kak Riswandi! 👋\nSaya ingin konsultasi seputar layanan MC / Undangan Digital.")}`} target="_blank" rel="noopener noreferrer">
                Hubungi Kami
              </a>
            </Button>
            
            {/* Mobile Hamburger Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu Utama">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[380px] flex flex-col justify-between p-6 bg-background">
                <div className="space-y-6">
                  <SheetHeader className="text-left px-0 pb-4 border-b">
                    <SheetTitle className="font-heading font-bold text-xl">Riswandi Wedding</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 text-base font-medium">
                    <a href="#layanan" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border/40">Layanan</a>
                    <a href="#undangan" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border/40">Undangan</a>
                    <a href="#testimoni" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border/40">Testimoni</a>
                    <a href="#galeri" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border/40">Galeri</a>
                    <a href="#faq" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors py-2">FAQ</a>
                  </nav>
                </div>
                <div className="pt-6 border-t border-border mt-auto">
                  <Button asChild className="w-full" size="lg">
                    <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kak Riswandi! 👋\nSaya ingin konsultasi seputar layanan MC / Undangan Digital.")}`} target="_blank" rel="noopener noreferrer">
                      Hubungi Kami via WA
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[80vh] flex items-center justify-center bg-muted overflow-hidden">
          <div className="absolute inset-0 z-0">
             {/* Using Unsplash Image for Mockup */}
             <Image 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
                alt="Wedding Event" 
                fill 
                className="object-cover brightness-50"
                priority
             />
          </div>
          <div className="relative z-10 container px-4 flex flex-col items-center text-center text-white space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur border-none py-1.5 px-4">
              Spesialis Acara Pernikahan & Formal
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading max-w-4xl leading-[1.1] text-shadow-sm">
              MC Profesional untuk Momen Tak Terlupakan
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl font-sans text-shadow-sm">
              Menghidupkan suasana acara Anda dari awal hingga akhir dengan profesionalisme dan kehangatan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button asChild size="lg" className="text-base h-12 px-8">
                 <a href="#layanan">Lihat Layanan</a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => handleMCOpen("")} className="text-base h-12 px-8 bg-black/20 text-white border-white/50 hover:bg-white hover:text-black backdrop-blur">
                 Booking Sekarang
              </Button>
            </div>
          </div>
        </section>

        {/* Layanan MC Section */}
        <section id="layanan" className="py-16 md:py-24 container mx-auto px-4 scroll-mt-16">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Layanan MC</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
              Beragam pilihan paket Master of Ceremony yang dapat disesuaikan dengan kebutuhan acara Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="flex flex-col border-primary/20 hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">⭐ Populer</Badge>
                </div>
                <CardTitle className="text-2xl font-heading">MC All Event</CardTitle>
                <CardDescription>Ulang tahun, wisuda, corporate, gathering, dan lainnya.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground font-sans">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Penguasaan audiens berbagai kalangan</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Ice breaking interaktif & seru</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Fleksibilitas tema acara & durasi</span></li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleMCOpen("MC All Event")}>
                  Booking Sekarang
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2 */}
            <Card className="flex flex-col border-primary/40 hover:border-primary transition-colors relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg text-xs font-bold tracking-wider uppercase shadow-sm z-10">Best Value</div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">💍 Duo</Badge>
                </div>
                <CardTitle className="text-2xl font-heading">MC Wedding Partner</CardTitle>
                <CardDescription>Paket berdua / duo MC untuk interaksi yang lebih hidup.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground font-sans">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>2 MC Profesional (Pria & Wanita)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Chemistry & tektokan asik di panggung</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Sangat cocok untuk resepsi berskala besar</span></li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={() => handleMCOpen("MC Wedding Partner")}>
                  Booking Sekarang
                </Button>
              </CardFooter>
            </Card>

            {/* Card 3 */}
            <Card className="flex flex-col border-primary/20 hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">👑 Eksklusif</Badge>
                </div>
                <CardTitle className="text-2xl font-heading">MC Wedding Private</CardTitle>
                <CardDescription>MC tunggal eksklusif dengan sentuhan personal & elegan.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-muted-foreground font-sans">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Konsep intimate & hangat</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Bantuan penyusunan rundown detail</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>Standby dari mulai akad hingga selesai</span></li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleMCOpen("MC Wedding Private")}>
                  Booking Sekarang
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Undangan Digital Section */}
        <section id="undangan" className="py-16 md:py-24 bg-muted/40 w-full scroll-mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <Badge className="mb-2" variant="outline">Koleksi Template Premium</Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Undangan Digital</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
                Sebarkan momen kebahagiaan Anda dengan mudah, elegan, dan ramah lingkungan.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-100/50 inline-flex px-5 py-2.5 rounded-full border border-amber-200 mx-auto mt-4 font-medium">
                <Info className="h-4 w-4" />
                <span>Pemesanan minimal 7 hari sebelum tanggal acara</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
              {undanganTemplates.map((tpl) => (
                <Card key={tpl.id} className="group overflow-hidden border bg-background shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="aspect-[3/4] relative bg-muted overflow-hidden">
                    <Image 
                      src={`https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=800&auto=format&fit=crop&sig=${tpl.imgSig}`}
                      alt={tpl.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-3 md:p-4 flex flex-col items-start gap-1 flex-1">
                    <span className="font-semibold text-xs md:text-[15px] font-heading line-clamp-2">{tpl.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground line-through text-[10px] md:text-xs">Rp 59.000</span>
                      <span className="text-primary font-bold text-xs md:text-sm">{tpl.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 md:p-4 pt-0 md:pt-0 w-full grid grid-cols-2 gap-1.5 md:gap-2">
                    {tpl.onProcess ? (
                      <Button variant="outline" className="w-full text-[10px] md:text-xs opacity-70" disabled>
                        Proses
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full text-[10px] md:text-xs px-0" asChild>
                        <a href={tpl.demo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          Demo <ExternalLink className="ml-1 w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
                        </a>
                      </Button>
                    )}
                    <Button className="w-full text-[10px] md:text-xs" onClick={() => handleUndanganOpen(tpl.name)}>
                      Pesan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="h-14 px-10 text-lg shadow-lg hover:scale-105 transition-transform" onClick={() => handleUndanganOpen("")}>
                Pesan Undangan Sekarang
              </Button>
            </div>
          </div>
        </section>

        {/* Cara Pesan Section */}
        <section className="py-16 md:py-24 container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Cara Memesan</h2>
            <p className="text-muted-foreground font-sans">Proses booking mudah, cepat, dan transparan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[4.5rem] left-[16%] right-[16%] h-0.5 bg-border -z-10"></div>
            
            <div className="flex flex-col items-center text-center space-y-5 bg-background p-6">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 shadow-sm">
                <CalendarIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading">1. Pilih Layanan</h3>
                <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                  Pilih paket MC atau template undangan digital yang Anda inginkan dan klik tombol pesan.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-5 bg-background p-6">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 shadow-sm">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading">2. Isi Form & Chat WA</h3>
                <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                  Isi formulir singkat yang disediakan, lalu Anda akan diarahkan otomatis ke WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-5 bg-background p-6">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 shadow-sm">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading">3. Konfirmasi & Deal</h3>
                <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                  Kami akan mengonfirmasi pesanan. Lakukan DP dan jadwal Anda akan otomatis terkunci.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimoni Section */}
        <section id="testimoni" className="py-16 md:py-24 bg-primary text-primary-foreground scroll-mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Apa Kata Klien Kami</h2>
              <p className="text-primary-foreground/80 font-sans max-w-2xl mx-auto">Kepuasan Anda adalah prioritas utama kami dalam setiap acara.</p>
            </div>

            <Carousel className="w-full max-w-5xl mx-auto" opts={{ loop: true }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {[
                  { name: "Sarah & Dimas", event: "Wedding", text: "Kak Riswandi MC yang luar biasa! Acara jadi hidup, tidak kaku, dan tamu pada betah. Rekomen banget buat yang mau nikah!" },
                  { name: "PT. Maju Mundur", event: "Corporate Gathering", text: "Bisa mencairkan suasana dengan cepat. Ice breakingnya fresh dan bikin semua karyawan ketawa lepas. Top!" },
                  { name: "Anita", event: "Sweet Seventeen", text: "Acara ulang tahunku jadi super seru berkat MC Riswandi. Temen-temen bilang acaranya pecah banget." },
                  { name: "Budi & Rina", event: "Wedding", text: "Undangan digitalnya elegan dan proses pembuatannya cepat. MC-nya juga on time dan sangat profesional. Perfect!" }
                ].map((testi, i) => (
                  <CarouselItem key={i} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="h-full p-1">
                      <Card className="h-full border-none shadow-md bg-white/10 backdrop-blur-md text-white flex flex-col hover:bg-white/15 transition-colors">
                        <CardHeader className="pb-4">
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                          </div>
                          <CardTitle className="text-xl font-heading">{testi.name}</CardTitle>
                          <CardDescription className="text-white/70 font-sans flex items-center gap-2 mt-1">
                            {testi.event}
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-white/5 border-white/20 text-white font-normal px-2 py-0 h-5">Verified</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-white/90 italic font-sans leading-relaxed">"{testi.text}"</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex items-center justify-center gap-4 mt-8">
                <CarouselPrevious className="static transform-none text-black bg-white hover:bg-white/90 hover:text-black border-none" />
                <CarouselNext className="static transform-none text-black bg-white hover:bg-white/90 hover:text-black border-none" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Galeri Section */}
        <section id="galeri" className="py-16 md:py-24 container mx-auto px-4 scroll-mt-16">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Galeri & Dokumentasi</h2>
            <p className="text-muted-foreground font-sans">Beberapa momen indah yang telah kami abadikan bersama.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[250px]">
            <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group shadow-sm">
               <Image src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" alt="Event" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                 <span className="text-white font-heading font-medium text-lg">Wedding Reception</span>
               </div>
            </div>
            <div className="relative rounded-xl overflow-hidden group shadow-sm">
               <Image src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop" alt="Wedding" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-xl overflow-hidden group row-span-2 shadow-sm">
               <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" alt="Stage" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-xl overflow-hidden group shadow-sm">
               <Image src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1974&auto=format&fit=crop" alt="Corporate" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-2 relative rounded-xl overflow-hidden group shadow-sm">
               <Image src="https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=2070&auto=format&fit=crop" alt="Party" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <Button variant="outline" size="lg" className="rounded-full px-8 group">
               Lihat Lebih Banyak di Instagram
               <Camera className="ml-2 w-4 h-4 group-hover:text-pink-600 transition-colors" />
             </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-muted/30 w-full scroll-mt-16 border-t border-b">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Frequently Asked Questions</h2>
              <p className="text-muted-foreground font-sans">Jawaban dari pertanyaan yang paling sering diajukan kepada kami.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full bg-background rounded-2xl border px-6 py-2 shadow-sm">
              <AccordionItem value="item-1" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-semibold text-[15px] hover:text-primary hover:no-underline py-4">Apakah bisa request lagu atau script MC?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans pb-5 leading-relaxed">
                  Tentu saja! Kami sangat fleksibel dan akan menyesuaikan gaya, bahasa, serta script MC sesuai dengan tema dan preferensi acara Anda. Request lagu untuk backsound interaksi juga sangat diperbolehkan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-semibold text-[15px] hover:text-primary hover:no-underline py-4">Berapa jauh area jangkauan layanan MC?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans pb-5 leading-relaxed">
                  Kami melayani wilayah Jabodetabek dan sekitarnya secara reguler. Untuk luar kota atau luar pulau, kami juga bersedia dengan tambahan biaya akomodasi & transportasi yang disepakati bersama.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-semibold text-[15px] hover:text-primary hover:no-underline py-4">Apakah undangan digital bisa direvisi?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans pb-5 leading-relaxed">
                  Ya, kami memberikan kesempatan revisi minor (seperti ubah teks, perubahan jam/tanggal, dan perbaikan typo) sebanyak maksimal 2 kali sebelum hari H acara.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-none">
                <AccordionTrigger className="text-left font-semibold text-[15px] hover:text-primary hover:no-underline py-4">Bagaimana sistem pembayarannya?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans pb-5 leading-relaxed">
                  Sistem pembayaran dilakukan dengan cara Transfer Bank. Diperlukan Down Payment (DP) minimal 30% untuk mengunci jadwal (booking tanggal). Pelunasan dapat dilakukan maksimal H-1 sebelum acara.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-heading font-bold text-3xl tracking-tight">Riswandi Wedding</h3>
            <p className="text-white/60 text-[15px] font-sans leading-relaxed max-w-sm">
              Menyediakan layanan MC profesional dan undangan digital elegan untuk menyempurnakan dan mengabadikan momen bahagia di hari istimewa Anda.
            </p>
          </div>
          
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-semibold text-lg font-heading tracking-wide">Tautan Cepat</h4>
            <nav className="flex flex-col gap-3 text-white/60 text-[15px] font-sans">
              <a href="#layanan" className="hover:text-white transition-colors w-fit">Layanan MC</a>
              <a href="#undangan" className="hover:text-white transition-colors w-fit">Undangan Digital</a>
              <a href="#galeri" className="hover:text-white transition-colors w-fit">Galeri Dokumentasi</a>
              <a href="#faq" className="hover:text-white transition-colors w-fit">FAQ</a>
            </nav>
          </div>

          <div className="md:col-span-4 space-y-6">
            <h4 className="font-semibold text-lg font-heading tracking-wide">Hubungi Kami</h4>
            <div className="flex flex-col gap-4 text-white/60 text-[15px] font-sans">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 shrink-0" />
                <span>+62 877-3786-0657</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 shrink-0" />
                <span>hello@riswandiwedding.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Camera className="h-5 w-5 mt-0.5 shrink-0" />
                <a href="#" className="hover:text-white transition-colors">@riswandiwedding</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm font-sans">
          <p>&copy; {new Date().getFullYear()} Riswandi Wedding. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Sticky WA CTA */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kak Riswandi! 👋\nSaya ingin bertanya...")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="font-medium hidden sm:inline text-[15px]">Chat Kami via WhatsApp</span>
      </a>

      {/* --- MODALS --- */}
      
      {/* Modal Booking MC */}
      <Dialog open={isMCOpen} onOpenChange={setIsMCOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Booking Layanan MC</DialogTitle>
            <DialogDescription>
              Isi detail acara Anda. Kami akan mengarahkan Anda ke WhatsApp untuk konfirmasi ketersediaan jadwal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama-mc">Nama Anda</Label>
              <Input 
                id="nama-mc" 
                placeholder="Cth: Budi & Rina" 
                value={mcForm.nama}
                onChange={(e) => setMcForm({...mcForm, nama: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tanggal-mc">Tanggal Acara</Label>
              <Input 
                id="tanggal-mc" 
                placeholder="Cth: 12 Desember 2026" 
                value={mcForm.tanggal}
                onChange={(e) => setMcForm({...mcForm, tanggal: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="layanan-mc">Pilihan Layanan</Label>
              <Select value={mcForm.layanan} onValueChange={(val) => setMcForm({...mcForm, layanan: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MC All Event">MC All Event</SelectItem>
                  <SelectItem value="MC Wedding Partner">MC Wedding Partner (Duo)</SelectItem>
                  <SelectItem value="MC Wedding Private">MC Wedding Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleMCSubmit} className="w-full flex items-center justify-center gap-2">
              Lanjut ke WhatsApp <MessageCircle className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Pesan Undangan */}
      <Dialog open={isUndanganOpen} onOpenChange={setIsUndanganOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pesan Undangan Digital</DialogTitle>
            <DialogDescription>
              Lengkapi detail di bawah untuk format pemesanan via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama-undangan">Nama Mempelai Pria & Wanita</Label>
              <Input 
                id="nama-undangan" 
                placeholder="Cth: Romeo & Juliet" 
                value={undanganForm.namaMempelai}
                onChange={(e) => setUndanganForm({...undanganForm, namaMempelai: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Acara</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 bg-background",
                      !undanganForm.tanggal && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    {undanganForm.tanggal ? (
                      format(undanganForm.tanggal, "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>Pilih tanggal acara</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                  <Calendar
                    mode="single"
                    selected={undanganForm.tanggal}
                    onSelect={(date) => setUndanganForm({ ...undanganForm, tanggal: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Target Jadi Undangan</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 bg-background",
                      !undanganForm.tanggalTarget && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    {undanganForm.tanggalTarget ? (
                      format(undanganForm.tanggalTarget, "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>Pilih tanggal target jadi</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                  <Calendar
                    mode="single"
                    selected={undanganForm.tanggalTarget}
                    onSelect={(date) => setUndanganForm({ ...undanganForm, tanggalTarget: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lokasi-undangan">Lokasi Acara</Label>
              <Input 
                id="lokasi-undangan" 
                placeholder="Cth: Gedung Manggala Wanabakti, Jakarta" 
                value={undanganForm.lokasi}
                onChange={(e) => setUndanganForm({...undanganForm, lokasi: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-undangan">Pilihan Template</Label>
              <Select value={undanganForm.template} onValueChange={(val) => setUndanganForm({...undanganForm, template: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Template" />
                </SelectTrigger>
                <SelectContent>
                  {undanganTemplates.map(tpl => (
                    <SelectItem key={tpl.id} value={tpl.name}>{tpl.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUndanganSubmit} className="w-full flex items-center justify-center gap-2">
              Lanjut ke WhatsApp <MessageCircle className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
