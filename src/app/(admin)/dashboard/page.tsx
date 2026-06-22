"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileSpreadsheet, Images, Star, ArrowUpRight, MessageCircle } from "lucide-react";

export default function DashboardPage() {
  const [waNumber, setWaNumber] = useState("6287737860657");

  useEffect(() => {
    const fetchWaNumber = async () => {
      try {
        const docRef = doc(db, "noWa", "WAUtama");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().nomer) {
          setWaNumber(docSnap.data().nomer);
        }
      } catch (error) {
        console.error("Gagal memuat nomor WA:", error);
      }
    };
    fetchWaNumber();
  }, []);

  // Mock recent activity data
  const [recentBookings] = useState([
    { id: "MC-1024", client: "Budi & Rina", date: "12 Des 2026", type: "MC Wedding Partner", status: "Deal" },
    { id: "INV-5091", client: "Sarah & Dimas", date: "24 Okt 2026", type: "Undangan 1 (Soft)", status: "In Progress" },
    { id: "MC-1023", client: "PT. Maju Mundur", date: "18 Nov 2026", type: "MC All Event", status: "Followed Up" },
    { id: "INV-5090", client: "Rian & Mita", date: "05 Nov 2026", type: "Undangan 3 (Fresh)", status: "Selesai" },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-primary">Selamat Datang, Riswandi! 👋</h1>
            <p className="text-muted-foreground text-sm font-sans mt-0.5">Kelola data pemesanan MC, order undangan digital, dan galeri dokumentasi Anda secara terpusat.</p>
          </div>
          <Button asChild size="sm" className="shadow-sm">
            <a href="/" target="_blank" rel="noopener noreferrer">
              Lihat Live Website <ArrowUpRight className="ml-1 w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Booking MC</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24 Acara</div>
              <p className="text-xs text-muted-foreground mt-1">+3 booking baru minggu ini</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Order Undangan</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142 Pesanan</div>
              <p className="text-xs text-muted-foreground mt-1">+12 order selesai di-render</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Galeri Foto/Video</CardTitle>
              <Images className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58 Media</div>
              <p className="text-xs text-muted-foreground mt-1">Wedding, corporate, private MC</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Rating</CardTitle>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9 / 5.0</div>
              <p className="text-xs text-muted-foreground mt-1">Berdasarkan 46 review verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking trends chart (Mock) */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Grafik Aktivitas Booking</CardTitle>
              <CardDescription>Visualisasi tren pendaftaran klien MC dan Undangan Digital 5 bulan terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] flex items-end justify-between gap-2 pt-6">
              {[
                { label: "Feb", mc: 40, inv: 60 },
                { label: "Mar", mc: 55, inv: 80 },
                { label: "Apr", mc: 75, inv: 95 },
                { label: "Mei", mc: 90, inv: 120 },
                { label: "Jun", mc: 110, inv: 142 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex gap-1 justify-center items-end h-[80%]">
                    {/* MC bar */}
                    <div 
                      className="w-4 sm:w-6 bg-primary rounded-t-sm transition-all hover:brightness-95" 
                      style={{ height: `${(bar.mc / 150) * 100}%` }}
                      title={`MC Booking: ${bar.mc}`}
                    />
                    {/* Invitation bar */}
                    <div 
                      className="w-4 sm:w-6 bg-emerald-500 rounded-t-sm transition-all hover:brightness-95" 
                      style={{ height: `${(bar.inv / 150) * 100}%` }}
                      title={`Undangan Order: ${bar.inv}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-sans font-medium">{bar.label}</span>
                </div>
              ))}
            </CardContent>
            <div className="px-6 pb-6 flex gap-4 text-xs font-sans text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-primary rounded-full" />
                <span>Jasa MC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span>Undangan Pernikahan Digital</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Menu Pintasan Cepat</CardTitle>
              <CardDescription>Akses cepat ke pengaturan dan pembaruan konten.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-center">
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/booking-mc">📋 Kelola Booking MC ({recentBookings.filter(b => b.id.startsWith("MC")).length})</a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/pesanan-undangan">✉️ Review Pesanan Undangan</a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/galeri">📸 Upload Foto Dokumentasi Baru</a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-left font-sans">
                <a href="/dashboard/faq">✏️ Perbarui Daftar FAQ</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions Table */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-heading">Aktivitas & Leads Terbaru</CardTitle>
              <CardDescription>Daftar kiriman formulir terakhir dari landing page website.</CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="text-xs font-sans" asChild>
              <a href="/dashboard/booking-mc">Lihat Semua Leads</a>
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-muted-foreground">ID</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">Nama Klien</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">Tanggal Acara</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">Pilihan Layanan</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="py-3 px-4 font-semibold text-muted-foreground text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="py-3.5 px-4 font-medium font-mono text-xs">{item.id}</td>
                    <td className="py-3.5 px-4">{item.client}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{item.date}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="font-normal text-xs">
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge 
                        variant="secondary"
                        className={
                          item.status === "Deal" || item.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"
                            : item.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="icon-sm" variant="ghost" asChild>
                        <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Kak Riswandi! Saya ingin menanyakan terkait aktivitas terbaru di dashboard.")}`} target="_blank" rel="noopener noreferrer" title="Hubungi via WA">
                          <MessageCircle className="h-4 w-4 text-emerald-500" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
