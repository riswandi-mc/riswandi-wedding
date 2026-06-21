"use client";

import { useState, useEffect } from "react";
import { insforge } from "@/lib/insforge/client";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageCircle, Trash2, Plus, Search, ExternalLink, Sparkles, Hourglass, CheckCircle2, Eye } from "lucide-react";

type Order = {
  id: string;
  couple_name: string;
  template: string;
  date: string;
  target_date: string;
  location: string;
  phone: string;
  status: "New" | "In Progress" | "Review" | "Selesai";
};

export default function PesananUndanganPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await insforge.database
      .from("pesanan_undangan")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setOrders(data as Order[]);
    }
  };

  // Add Order Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ couple_name: "", template: "Undangan 1 (Soft & Romantis)", date: "", target_date: "", location: "", phone: "", status: "New" as Order["status"] });

  const handleAddSubmit = async () => {
    const { data, error } = await insforge.database
      .from("pesanan_undangan")
      .insert([newOrder])
      .select();
    if (data && data.length > 0) {
      setOrders([data[0] as Order, ...orders]);
      setIsAddOpen(false);
      setNewOrder({ couple_name: "", template: "Undangan 1 (Soft & Romantis)", date: "", target_date: "", location: "", phone: "", status: "New" });
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    const { error } = await insforge.database
      .from("pesanan_undangan")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pesanan ini?")) {
      const { error } = await insforge.database
        .from("pesanan_undangan")
        .delete()
        .eq("id", id);
      if (!error) {
        setOrders(orders.filter(o => o.id !== id));
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.couple_name?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || o.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate = templateFilter === "all" || o.template?.includes(templateFilter);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesTemplate && matchesStatus;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "New":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none flex items-center gap-1 w-fit"><Sparkles className="w-3 h-3" /> Baru</Badge>;
      case "In Progress":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none flex items-center gap-1 w-fit"><Hourglass className="w-3 h-3" /> Pengerjaan</Badge>;
      case "Review":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none flex items-center gap-1 w-fit"><Eye className="w-3 h-3" /> Review</Badge>;
      case "Selesai":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Selesai</Badge>;
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
                <BreadcrumbPage>Pesanan Undangan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Pesanan Undangan Digital</h1>
            <p className="text-muted-foreground text-sm font-sans">Pantau proses perakitan, revisi, dan status render web undangan klien.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Tambah Pesanan
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama mempelai atau ID..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[220px]">
              <Select value={templateFilter} onValueChange={setTemplateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Template</SelectItem>
                  <SelectItem value="Undangan 1">Undangan 1 (Soft & Romantis)</SelectItem>
                  <SelectItem value="Undangan 3">Undangan 3 (Fresh & Premium)</SelectItem>
                  <SelectItem value="Undangan 4">Undangan 4 (Minimalis & Elegan)</SelectItem>
                  <SelectItem value="Undangan 5">Undangan 5 (Floral / Botanical)</SelectItem>
                  <SelectItem value="Undangan 7">Undangan 7 (Stylish & Luxury)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="New">Baru</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">ID</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Nama Mempelai</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Template Pilihan</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Tanggal Acara</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Lokasi</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Status Pembuatan</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-6 font-medium font-mono text-xs">{item.id?.split("-")[0]}</td>
                      <td className="py-4 px-6 font-semibold">{item.couple_name}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="font-normal text-xs">{item.template}</Badge>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{item.date}</td>
                      <td className="py-4 px-6 text-muted-foreground text-xs max-w-[200px] truncate" title={item.location}>
                        {item.location}
                      </td>
                      <td className="py-4 px-6">
                        <Select
                          value={item.status}
                          onValueChange={(val) => handleStatusChange(item.id, val as Order["status"])}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs p-2">
                            <SelectValue>{getStatusBadge(item.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">Baru</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Selesai">Selesai</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button size="icon-sm" variant="ghost" asChild>
                            <a
                              href={`https://wa.me/${item.phone}?text=${encodeURIComponent(`Halo Kak ${item.couple_name}! Ini Riswandi. Berikut link draft/revisi undangan digital Kakak. Silakan di-review ya Kak: https://mriswandiwedding_.com/demo/template-1`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4 text-emerald-500" />
                            </a>
                          </Button>
                          <Button size="icon-sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)} title="Hapus">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {/* --- ADD ORDER DIALOG --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Pesanan Undangan</DialogTitle>
            <DialogDescription>
              Isi data detail pesanan undangan digital baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="couple_name">Nama Mempelai</Label>
              <Input
                id="couple_name"
                placeholder="Cth: Romeo & Juliet"
                value={newOrder.couple_name}
                onChange={(e) => setNewOrder({ ...newOrder, couple_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template">Template Pilihan</Label>
              <Select
                value={newOrder.template}
                onValueChange={(val) => setNewOrder({ ...newOrder, template: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undangan 1 (Soft & Romantis)">Undangan 1 (Soft & Romantis)</SelectItem>
                  <SelectItem value="Undangan 3 (Fresh & Premium)">Undangan 3 (Fresh & Premium)</SelectItem>
                  <SelectItem value="Undangan 4 (Minimalis & Elegan)">Undangan 4 (Minimalis & Elegan)</SelectItem>
                  <SelectItem value="Undangan 5 (Floral / Botanical)">Undangan 5 (Floral / Botanical)</SelectItem>
                  <SelectItem value="Undangan 7 (Stylish & Luxury)">Undangan 7 (Stylish & Luxury)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal Acara</Label>
              <Input
                id="date"
                placeholder="Cth: 20 Oktober 2026"
                value={newOrder.date}
                onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi Acara</Label>
              <Input
                id="location"
                placeholder="Cth: Gedung Aura Hall, Depok"
                value={newOrder.location}
                onChange={(e) => setNewOrder({ ...newOrder, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telepon WhatsApp</Label>
              <Input
                id="phone"
                placeholder="Cth: 6281234567890"
                value={newOrder.phone}
                onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddSubmit}>Simpan Pesanan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
