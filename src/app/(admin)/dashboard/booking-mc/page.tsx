"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, Trash2, Plus, Search, Calendar as CalendarIcon, CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from "lucide-react";

type BookingStatus = "Pending" | "Followed Up" | "Deal" | "Canceled";

type Booking = {
  id: string;
  clientName: string;
  date: string;
  service: string;
  phone?: string;
  status: BookingStatus;
  createdAt?: any;
};

export default function BookingMCPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add Booking Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);
  const [newBooking, setNewBooking] = useState<{
    clientName: string;
    date: Date | undefined;
    service: string;
    phone: string;
    status: BookingStatus;
  }>({
    clientName: "",
    date: undefined,
    service: "MC All Event",
    phone: "",
    status: "Pending",
  });

  // Fetch bookings from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "bookingMC"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Booking[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            clientName: d.clientName || "",
            date: d.date || "",
            service: d.service || "",
            phone: d.phone || "",
            status: d.status || "Pending",
            createdAt: d.createdAt,
          };
        });
        setBookings(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Gagal mengambil data booking:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddSubmit = async () => {
    if (!newBooking.clientName || !newBooking.date || !newBooking.service) {
      alert("Mohon lengkapi semua data wajib.");
      return;
    }
    setIsAddSubmitting(true);
    try {
      const formattedDate = format(newBooking.date, "dd MMMM yyyy", { locale: localeId });
      await addDoc(collection(db, "bookingMC"), {
        clientName: newBooking.clientName,
        date: formattedDate,
        service: newBooking.service,
        phone: newBooking.phone || "",
        status: newBooking.status,
        createdAt: Timestamp.now(),
      });
      setIsAddOpen(false);
      setNewBooking({ clientName: "", date: undefined, service: "MC All Event", phone: "", status: "Pending" });
    } catch (error) {
      console.error("Gagal menambah booking:", error);
      alert("Gagal menyimpan data booking. Silakan coba lagi.");
    } finally {
      setIsAddSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateDoc(doc(db, "bookingMC", id), { status: newStatus });
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Gagal mengubah status booking.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data booking ini?")) {
      try {
        await deleteDoc(doc(db, "bookingMC", id));
      } catch (error) {
        console.error("Gagal menghapus booking:", error);
        alert("Gagal menghapus data booking.");
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === "all" || b.service === serviceFilter;
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesService && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Deal":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> Deal
          </Badge>
        );
      case "Followed Up":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Follow Up
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none flex items-center gap-1 w-fit">
            <AlertCircle className="w-3 h-3" /> Pending
          </Badge>
        );
      case "Canceled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Canceled
          </Badge>
        );
    }
  };

  // Shorten Firestore doc ID for display
  const formatId = (id: string) => {
    return `MC-${id.substring(0, 5).toUpperCase()}`;
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
            <p className="text-muted-foreground text-sm font-sans">
              Kelola daftar calon klien dan status follow-up layanan Master of Ceremony.
            </p>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-sans text-sm">Memuat data booking...</span>
              </div>
            ) : (
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
                        <td className="py-4 px-6 font-medium font-mono text-xs">{formatId(item.id)}</td>
                        <td className="py-4 px-6 font-semibold">{item.clientName}</td>
                        <td className="py-4 px-6 text-muted-foreground">{item.date}</td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="font-normal text-xs">
                            {item.service}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground font-mono text-xs">
                          {item.phone ? `+${item.phone}` : "-"}
                        </td>
                        <td className="py-4 px-6">
                          <Select
                            value={item.status}
                            onValueChange={(val) => handleStatusChange(item.id, val as BookingStatus)}
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
                            {item.phone && (
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
                            )}
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        {bookings.length === 0
                          ? "Belum ada data booking. Data dari form landing page akan muncul di sini."
                          : "Tidak ada data booking ditemukan dengan filter ini."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* --- ADD BOOKING DIALOG --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Data Booking MC</DialogTitle>
            <DialogDescription>
              Isi data formulir booking di bawah ini untuk disimpan ke Firestore.
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
              <Label>Tanggal Acara</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 bg-background",
                      !newBooking.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    {newBooking.date ? (
                      format(newBooking.date, "dd MMMM yyyy", { locale: localeId })
                    ) : (
                      <span>Pilih tanggal acara</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                  <Calendar
                    mode="single"
                    selected={newBooking.date}
                    onSelect={(date) => setNewBooking({ ...newBooking, date })}
                  />
                </PopoverContent>
              </Popover>
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
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddSubmit} disabled={isAddSubmitting}>
              {isAddSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Simpan Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
