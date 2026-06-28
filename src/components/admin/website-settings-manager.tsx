"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  Loader2,
  Phone,
  Save,
  ShieldAlert,
  User,
} from "lucide-react";

import { updateAdminWebsiteSettings } from "@/app/actions/admin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { AdminProfile, AdminWebsiteSettings } from "@/lib/data/admin";

function buildSettingsForm(settings: AdminWebsiteSettings | null) {
  return {
    brandName: settings?.brand_name ?? "",
    phoneWhatsapp: settings?.phone_whatsapp ?? "",
    email: settings?.email ?? "",
    instagramUrl: settings?.instagram_url ?? "",
    address: settings?.address ?? "",
    mcWhatsappTemplate: settings?.mc_whatsapp_template ?? "",
    invitationWhatsappTemplate: settings?.invitation_whatsapp_template ?? "",
  };
}

function getContactCount(settings: AdminWebsiteSettings | null) {
  if (!settings) {
    return 0;
  }

  return [
    settings.phone_whatsapp,
    settings.email,
    settings.instagram_url,
    settings.address,
  ].filter((value) => Boolean(value && String(value).trim().length > 0)).length;
}

export function WebsiteSettingsManager({
  initialSettings,
  profile,
}: {
  initialSettings: AdminWebsiteSettings | null;
  profile: AdminProfile;
}) {
  const [settings, setSettings] = useState<AdminWebsiteSettings | null>(
    initialSettings,
  );
  const [activeTab, setActiveTab] = useState<
    "profile" | "website" | "whatsapp"
  >("website");
  const [form, setForm] = useState(() => buildSettingsForm(initialSettings));
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const summary = useMemo(() => {
    const configuredContacts = getContactCount(settings);

    return {
      brandName: settings?.brand_name ?? "Belum tersimpan",
      phoneWhatsapp: settings?.phone_whatsapp ?? "Belum tersimpan",
      configuredContacts,
      updatedAt: settings?.updated_at ?? null,
    };
  }, [settings]);

  const handleSave = () => {
    setMessage(null);

    startTransition(async () => {
      const result = await updateAdminWebsiteSettings(form);

      if (!result.ok) {
        setMessage(result.error);
        return;
      }

      setSettings(result.settings);
      setForm(buildSettingsForm(result.settings));
      setMessage("Pengaturan berhasil disimpan.");
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
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
                <BreadcrumbPage>Pengaturan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-6 bg-muted/20 p-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Pengaturan Sistem
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Kelola brand, kontak publik, dan template WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Brand Aktif
              </div>
              <div className="mt-1 text-2xl font-bold">{summary.brandName}</div>
              <p className="text-xs text-muted-foreground">
                Dipakai di landing page publik
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Nomor WhatsApp
              </div>
              <div className="mt-1 text-2xl font-bold">
                {summary.phoneWhatsapp}
              </div>
              <p className="text-xs text-muted-foreground">
                Dipakai untuk CTA publik dan follow-up admin
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Kontak Terisi
              </div>
              <div className="mt-1 text-2xl font-bold">
                {summary.configuredContacts} / 4
              </div>
              <p className="text-xs text-muted-foreground">
                Email, IG, alamat, WA
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="py-5">
              <div className="text-sm font-medium text-muted-foreground">
                Terakhir Update
              </div>
              <div className="mt-1 text-2xl font-bold">
                {summary.updatedAt
                  ? new Date(summary.updatedAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Belum tersimpan"}
              </div>
              <p className="text-xs text-muted-foreground">
                Berdasarkan Supabase
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 border-b border-border font-sans text-sm font-medium">
          <button
            onClick={() => setActiveTab("website")}
            className={`flex items-center gap-2 border-b-2 px-4 pb-3 transition-all ${
              activeTab === "website"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Save className="h-4 w-4" /> Website
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center gap-2 border-b-2 px-4 pb-3 transition-all ${
              activeTab === "whatsapp"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="h-4 w-4" /> WhatsApp
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 border-b-2 px-4 pb-3 transition-all ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" /> Profil Admin
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {message ? (
              <div
                className={`rounded-md p-3 text-sm ${message.includes("berhasil") ? "bg-emerald-50 text-emerald-700" : "bg-destructive/15 text-destructive"}`}
              >
                {message}
              </div>
            ) : null}

            {activeTab === "website" ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Identitas Website
                  </CardTitle>
                  <CardDescription>
                    Informasi ini dipakai pada landing page, footer, dan blok
                    kontak publik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 font-sans">
                  <div className="grid gap-2">
                    <Label htmlFor="brand-name">Nama Brand</Label>
                    <Input
                      id="brand-name"
                      value={form.brandName}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          brandName: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="site-email">Email</Label>
                    <Input
                      id="site-email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instagram">URL Instagram</Label>
                    <Input
                      id="instagram"
                      value={form.instagramUrl}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          instagramUrl: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Alamat</Label>
                    <textarea
                      id="address"
                      rows={4}
                      className="flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={form.address}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          address: event.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t px-6 py-4">
                  <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="gap-2"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Simpan
                  </Button>
                </CardFooter>
              </Card>
            ) : null}

            {activeTab === "whatsapp" ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Konfigurasi WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Nomor tujuan dan template pesan untuk alur follow-up setelah
                    form publik dikirim.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 font-sans">
                  <div className="grid gap-2">
                    <Label htmlFor="wa-phone">Nomor WhatsApp Admin</Label>
                    <Input
                      id="wa-phone"
                      value={form.phoneWhatsapp}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          phoneWhatsapp: event.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Gunakan format internasional tanpa spasi, mis.
                      6287737860657
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wa-mc">Template Pesan Booking MC</Label>
                    <textarea
                      id="wa-mc"
                      rows={5}
                      className="flex min-h-[112px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={form.mcWhatsappTemplate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          mcWhatsappTemplate: event.target.value,
                        }))
                      }
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Variabel tersedia: [nama], [tanggal], [layanan]
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wa-invitation">
                      Template Pesan Order Undangan
                    </Label>
                    <textarea
                      id="wa-invitation"
                      rows={6}
                      className="flex min-h-[128px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={form.invitationWhatsappTemplate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          invitationWhatsappTemplate: event.target.value,
                        }))
                      }
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Variabel tersedia: [namaMempelai], [tanggal],
                      [tanggalTarget], [lokasi], [template]
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t px-6 py-4">
                  <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="gap-2"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Simpan Pengaturan
                  </Button>
                </CardFooter>
              </Card>
            ) : null}

            {activeTab === "profile" ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Profil Admin
                  </CardTitle>
                  <CardDescription>
                    Data admin aktif yang dibaca langsung dari Supabase Auth dan
                    tabel profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 font-sans">
                  <div className="grid gap-2">
                    <Label>Nama Lengkap</Label>
                    <Input
                      value={profile.full_name ?? "Belum diatur"}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email Login</Label>
                    <Input
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Hak Akses</Label>
                    <Input value={profile.role} disabled className="bg-muted" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status Akun</Label>
                    <Input
                      value={profile.is_active ? "Aktif" : "Nonaktif"}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Status Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-sans text-xs text-muted-foreground">
                <div className="flex justify-between border-b py-1">
                  <span>Brand</span>
                  <span className="font-semibold text-foreground">
                    {form.brandName}
                  </span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>WhatsApp</span>
                  <span className="font-semibold text-foreground">
                    {form.phoneWhatsapp}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Landing Page</span>
                  <Badge className="h-4 border-none bg-emerald-100 px-2 py-0 text-[9px] font-normal text-emerald-800 hover:bg-emerald-100">
                    Tersambung
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 font-heading text-sm font-semibold text-red-800">
                  <ShieldAlert className="h-4 w-4 text-red-600" /> Area Bahaya
                </CardTitle>
              </CardHeader>
              <CardContent className="font-sans">
                <p className="text-xs leading-relaxed text-red-700/80">
                  Perubahan nomor WhatsApp langsung mempengaruhi tombol CTA di
                  landing page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
