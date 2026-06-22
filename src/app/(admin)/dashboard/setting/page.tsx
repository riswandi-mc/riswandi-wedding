"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Terminal, CheckCircle2, Key, Save, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "whatsapp">("profile");

  // Profile Form States
  const [profile, setProfile] = useState({ name: "Riswandi", email: "riswandi.wedding@gmail.com", role: "Super Administrator" });
  const [password, setPassword] = useState({ current: "", newPassword: "", confirm: "" });

  // WhatsApp Config States
  const [waConfig, setWaConfig] = useState({
    phone: "6287737860657",
    mcTemplate: "Halo Kak Riswandi! 👋\nSaya tertarik dengan layanan [layanan].\nNama saya: [nama]\nTanggal acara: [tanggal]\nMohon info lebih lanjut ya, terima kasih 🙏",
    invitationTemplate: "Halo Kak Riswandi! 👋\nSaya ingin memesan Undangan Pernikahan Digital.\n\n📋 Detail Pesanan:\n- Nama Mempelai : [namaMempelai]\n- Tanggal Acara : [tanggal]\n- Lokasi Acara  : [lokasi]\n- Template      : [template]\n\nMohon konfirmasi ketersediaan ya, terima kasih! 🙏"
  });
  const [isWaLoading, setIsWaLoading] = useState(false);
  const [isWaSaving, setIsWaSaving] = useState(false);

  useEffect(() => {
    const fetchWaConfig = async () => {
      setIsWaLoading(true);
      try {
        const docRef = doc(db, "noWa", "nomer");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWaConfig(prev => ({ ...prev, phone: data.nomer || "6287737860657" }));
        } else {
          // Buat default document jika belum ada
          await setDoc(docRef, { nomer: "6287737860657" }, { merge: true });
        }
      } catch (error) {
        console.error("Gagal mengambil data WA:", error);
      } finally {
        setIsWaLoading(false);
      }
    };
    fetchWaConfig();
  }, []);

  // API settings removed

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profil admin berhasil diperbarui!");
  };

  const handleWaSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWaSaving(true);
    try {
      const docRef = doc(db, "noWa", "nomer");
      await setDoc(docRef, { nomer: waConfig.phone }, { merge: true });
      alert("Pengaturan integrasi WhatsApp berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan data WA:", error);
      alert("Gagal menyimpan pengaturan WhatsApp!");
    } finally {
      setIsWaSaving(false);
    }
  };



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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Setting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Pengaturan Sistem</h1>
          <p className="text-muted-foreground text-sm font-sans">Konfigurasi profil admin dan integrasi WhatsApp.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border gap-2 font-sans text-sm font-medium">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <User className="w-4 h-4" /> Profil Admin
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${activeTab === "whatsapp" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Phone className="w-4 h-4" /> Integrasi WhatsApp
          </button>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Informasi Profil</CardTitle>
                    <CardDescription>Perbarui nama admin dan alamat email login Anda.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans">
                    <div className="grid gap-2">
                      <Label htmlFor="admin-name">Nama Lengkap</Label>
                      <Input
                        id="admin-name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-email">Email Login</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="admin-role">Hak Akses</Label>
                      <Input id="admin-role" value={profile.role} disabled className="bg-muted" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button type="submit" className="gap-2"><Save className="w-4 h-4" /> Simpan Profil</Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Ubah Password</CardTitle>
                    <CardDescription>Pastikan Anda menggunakan kata sandi yang aman dan kompleks.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans">
                    <div className="grid gap-2">
                      <Label htmlFor="pass-curr">Password Saat Ini</Label>
                      <Input
                        id="pass-curr"
                        type="password"
                        value={password.current}
                        onChange={(e) => setPassword({ ...password, current: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pass-new">Password Baru</Label>
                      <Input
                        id="pass-new"
                        type="password"
                        value={password.newPassword}
                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pass-conf">Konfirmasi Password Baru</Label>
                      <Input
                        id="pass-conf"
                        type="password"
                        value={password.confirm}
                        onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button type="button" variant="outline" className="gap-2"><Key className="w-4 h-4" /> Reset Password</Button>
                  </CardFooter>
                </Card>
              </form>
            )}

            {activeTab === "whatsapp" && (
              <form onSubmit={handleWaSave} className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Konfigurasi Pengalihan WhatsApp</CardTitle>
                    <CardDescription>Atur nomor tujuan dan template chat default saat tombol modal WA dieksekusi.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans">
                    <div className="grid gap-2">
                      <Label htmlFor="wa-phone">Nomor WhatsApp Admin (Kode Negara, tanpa spasi)</Label>
                      <Input
                        id="wa-phone"
                        value={waConfig.phone}
                        disabled={isWaLoading}
                        onChange={(e) => setWaConfig({ ...waConfig, phone: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Contoh format: 6287737860657 (Menggunakan prefix kode negara 62 untuk Indonesia)</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="wa-mc">Template Pesan Booking MC</Label>
                      <textarea
                        id="wa-mc"
                        rows={4}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={waConfig.mcTemplate}
                        onChange={(e) => setWaConfig({ ...waConfig, mcTemplate: e.target.value })}
                      />
                      <p className="text-[11px] text-muted-foreground">Gunakan placeholder: `[nama]`, `[tanggal]`, `[layanan]` untuk auto-fill data form.</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="wa-inv">Template Pesan Order Undangan</Label>
                      <textarea
                        id="wa-inv"
                        rows={5}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={waConfig.invitationTemplate}
                        onChange={(e) => setWaConfig({ ...waConfig, invitationTemplate: e.target.value })}
                      />
                      <p className="text-[11px] text-muted-foreground">Gunakan placeholder: `[namaMempelai]`, `[tanggal]`, `[lokasi]`, `[template]`.</p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 flex justify-end">
                    <Button type="submit" className="gap-2" disabled={isWaSaving || isWaLoading}>
                      <Save className="w-4 h-4" /> {isWaSaving ? "Menyimpan..." : "Simpan Pengaturan"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            )}


          </div>

          {/* Quick Info Box */}
          <div className="space-y-6">
            <Card className="shadow-sm bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Status Server</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs font-sans text-muted-foreground">
                <div className="flex justify-between py-1 border-b">
                  <span>Host Domain</span>
                  <span className="font-semibold text-foreground">mriswandiwedding_.com</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>SSl Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-none text-[9px] hover:bg-emerald-100 py-0 px-2 font-normal h-4">Active</Badge>
                </div>

                <div className="flex justify-between py-1">
                  <span>System Engine</span>
                  <span className="font-semibold text-foreground">Next.js 16 (Turbo)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-red-50/50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold font-heading text-red-800 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-red-600" /> Area Bahaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-sans">
                <p className="text-xs text-red-700/80 leading-relaxed">Pembersihan total database local cookie/cache dashboard akan melogout sesi administrator Anda secara paksa.</p>
                <Button variant="destructive" size="sm" className="w-full text-xs font-medium">Clear Session Cache</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
