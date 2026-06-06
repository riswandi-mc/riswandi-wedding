"use client";

import { useState } from "react";
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
import { MessageCircle, Trash2, Edit3, Plus, Search, Calendar, Phone, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

type Booking = {
  id: string;
  clientName: string;
  date: string;
  service: string;
  phone: string;
  status: "Pending" | "Followed Up" | "Deal" | "Canceled";
};

const initialBookings: Booking[] = [
  { id: "MC-001", clientName: "Rian & Mita", date: "12 Des 2026", service: "MC Wedding Partner", phone: "6281234567891", status: "Deal" },
  { id: "MC-002", clientName: "Fajar Santoso", date: "24 Nov 2026", service: "MC All Event", phone: "6281234567892", status: "Followed Up" },
  { id: "MC-003", clientName: "Amanda & Kevin", date: "18 Okt 2026", service: "MC Wedding Private", phone: "6281234567893", status: "Pending" },
  { id: "MC-004", clientName: "PT. Krakatau Steel", date: "05 Des 2026", service: "MC All Event", phone: "6281234567894", status: "Deal" },
  { id: "MC-005", clientName: "Hendra & Susi", date: "08 Sep 2026", service: "MC Wedding Partner", phone: "6281234567895", status: "Canceled" },
  { id: "MC-006", clientName: "Dewi Lestari", date: "15 Jan 2027", service: "MC Wedding Private", phone: "6281234567896", status: "Pending" },
];

export default function BookingMCPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add Booking Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ clientName: "", date: "", service: "MC All Event", phone: "", status: "Pending" as Booking["status"] });

  const handleAddSubmit = () => {
    const id = `MC-00${bookings.length + 1}`;
    setBookings([...bookings, { id, ...newBooking }]);
    setIsAddOpen(false);
    setNewBooking({ clientName: "", date: "", service: "MC All Event", phone: "", status: "Pending" });
  };

  const handleStatusChange = (id: string, newStatus: Booking["status"]) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data booking ini?")) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === "all" || b.service === serviceFilter;
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesService && matchesStatus;
  });

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Deal":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Deal</Badge>;
      case "Followed Up":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Follow Up</Badge>;
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Pending</Badge>;
      case "Canceled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Canceled</Badge>;
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
                <BreadcrumbPage>Booking MC</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Data Booking MC</h1>
            <p className="text-muted-foreground text-sm font-sans">Kelola daftar calon klien dan status follow-up layanan Master of Ceremony.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Tambah Booking
          </Button>
        </div>

        {/* Filter Card */}
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama klien atau ID..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Layanan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Layanan</SelectItem>
                  <SelectItem value="MC All Event">MC All Event</SelectItem>
                  <SelectItem value="MC Wedding Partner">MC Wedding Partner (Duo)</SelectItem>
                  <SelectItem value="MC Wedding Private">MC Wedding Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Followed Up">Followed Up</SelectItem>
                  <SelectItem value="Deal">Deal</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm font-sans">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">ID</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Nama Klien</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Tanggal Acara</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Layanan</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Telepon</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-muted-foreground text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-6 font-medium font-mono text-xs">{item.id}</td>
                      <td className="py-4 px-6 font-semibold">{item.clientName}</td>
                      <td className="py-4 px-6 text-muted-foreground">{item.date}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="font-normal text-xs">{item.service}</Badge>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground font-mono text-xs">+{item.phone}</td>
                      <td className="py-4 px-6">
                        <Select
                          value={item.status}
                          onValueChange={(val) => handleStatusChange(item.id, val as Booking["status"])}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs p-2">
                            <SelectValue>{getStatusBadge(item.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Followed Up">Followed Up</SelectItem>
                            <SelectItem value="Deal">Deal</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button size="icon-sm" variant="ghost" asChild>
                            <a
                              href={`https://wa.me/${item.phone}?text=${encodeURIComponent(`Halo Kak ${item.clientName}! Saya Riswandi. Terkait data booking MC untuk acara tanggal ${item.date}, mohon konfirmasi kelanjutannya ya Kak 🙏`)}`}
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
                      Tidak ada data booking ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {/* --- ADD BOOKING DIALOG --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Data Booking MC</DialogTitle>
            <DialogDescription>
              Isi data formulir booking di bawah ini untuk disimpan di database dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <Input
                id="clientName"
                placeholder="Cth: Budi & Rina"
                value={newBooking.clientName}
                onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal Acara</Label>
              <Input
                id="date"
                placeholder="Cth: 12 Desember 2026"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service">Pilihan Layanan</Label>
              <Select 
                value={newBooking.service} 
                onValueChange={(val) => setNewBooking({ ...newBooking, service: val })}
              >
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
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor WhatsApp (Contoh: 628123...)</Label>
              <Input
                id="phone"
                placeholder="Cth: 6281234567890"
                value={newBooking.phone}
                onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddSubmit}>Simpan Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
