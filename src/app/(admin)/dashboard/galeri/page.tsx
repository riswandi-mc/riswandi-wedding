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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Image, Video, UploadCloud, Trash2, Plus, Search, Eye, Filter } from "lucide-react";

type MediaItem = {
  id: number;
  title: string;
  category: "Wedding" | "Corporate" | "Private" | "Undangan Digital";
  type: "image" | "video";
  url: string;
};

const initialMedia: MediaItem[] = [
  { id: 1, title: "Wedding Reception A & B", category: "Wedding", type: "image", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600" },
  { id: 2, title: "Interactive MC Ice Breaking", category: "Corporate", type: "image", url: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=600" },
  { id: 3, title: "Private Intimate Toasting", category: "Private", type: "image", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600" },
  { id: 4, title: "Corporate Gathering PT Maju", category: "Corporate", type: "image", url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600" },
  { id: 5, title: "MC Duo Stage Presentation", category: "Wedding", type: "image", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600" },
];

export default function GaleriUploadPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Add Media Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMedia, setNewMedia] = useState({ title: "", category: "Wedding" as MediaItem["category"], type: "image" as MediaItem["type"], url: "" });

  const handleAddSubmit = () => {
    // Fallback unsplash image if url not provided
    const url = newMedia.url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600";
    setMediaList([...mediaList, { id: Date.now(), ...newMedia, url }]);
    setIsAddOpen(false);
    setNewMedia({ title: "", category: "Wedding", type: "image", url: "" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus media ini dari galeri?")) {
      setMediaList(mediaList.filter(item => item.id !== id));
    }
  };

  const filteredMedia = mediaList.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
                <BreadcrumbPage>Galeri Dokumentasi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Galeri & Dokumentasi</h1>
            <p className="text-muted-foreground text-sm font-sans">Upload foto/video dokumentasi acara untuk ditampilkan pada section galeri landing page.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Tambah Media
          </Button>
        </div>

        {/* Drag and Drop Zone Mockup */}
        <Card className="border-dashed border-2 border-primary/20 hover:border-primary/50 transition-colors shadow-sm bg-background">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center cursor-pointer space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold font-heading text-base">Tarik & Lepas file ke sini, atau klik untuk memilih</p>
              <p className="text-xs text-muted-foreground font-sans">Mendukung format PNG, JPG, JPEG, MP4 (Maks. 5MB per file)</p>
            </div>
            <Button variant="outline" size="sm" className="font-sans">Pilih File</Button>
          </CardContent>
        </Card>

        {/* Filter Toolbar */}
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul dokumentasi..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[220px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Undangan Digital">Undangan Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.length > 0 ? (
            filteredMedia.map((item) => (
              <Card key={item.id} className="group overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col bg-background">
                <div className="aspect-video relative bg-muted overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 left-3 bg-black/60 text-white hover:bg-black/60 backdrop-blur-sm border-none font-normal text-xs px-2 py-0.5">
                    {item.category}
                  </Badge>
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Video className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <span className="font-semibold text-sm font-heading line-clamp-2">{item.title}</span>
                  <div className="flex justify-between items-center mt-auto border-t pt-3">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider flex items-center gap-1">
                      {item.type === "video" ? <Video className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
                      {item.type}
                    </span>
                    <Button size="icon-xs" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)} title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground font-sans">
              Tidak ada dokumentasi media ditemukan.
            </div>
          )}
        </div>
      </main>

      {/* --- ADD MEDIA DIALOG --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Dokumentasi Galeri</DialogTitle>
            <DialogDescription>
              Isi data di bawah ini untuk menambahkan media ke galeri landing page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Dokumentasi</Label>
              <Input
                id="title"
                placeholder="Cth: Wedding Kevin & Amanda"
                value={newMedia.title}
                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori Acara</Label>
              <Select
                value={newMedia.category}
                onValueChange={(val) => setNewMedia({ ...newMedia, category: val as MediaItem["category"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Undangan Digital">Undangan Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe Media</Label>
              <Select
                value={newMedia.type}
                onValueChange={(val) => setNewMedia({ ...newMedia, type: val as MediaItem["type"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Foto (Image)</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL Gambar / Video Cover (Opsional)</Label>
              <Input
                id="url"
                placeholder="Cth: https://images.unsplash.com/..."
                value={newMedia.url}
                onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddSubmit}>Simpan Media</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
