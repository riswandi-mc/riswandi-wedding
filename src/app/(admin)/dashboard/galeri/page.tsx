"use client";

import { useState, useEffect } from "react";
import galeriData from "@/data/galeri.json";
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
import { Image as ImageIcon, Video, UploadCloud, Pencil, Trash2, Plus, Search, Loader2 } from "lucide-react";

type MediaItem = {
  id: number;
  title: string;
  category: "Wedding" | "Corporate" | "Private" | "Undangan Digital";
  type: "image" | "video";
  url: string;
  key?: string;
};

export default function GaleriUploadPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Add Media Dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newMedia, setNewMedia] = useState({ title: "", category: "Wedding" as MediaItem["category"], type: "image" as MediaItem["type"] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setIsLoading(true);
    const localData = localStorage.getItem("dummyGaleri");
    if (localData) {
      setMediaList(JSON.parse(localData));
    } else {
      setMediaList(galeriData as MediaItem[]);
      localStorage.setItem("dummyGaleri", JSON.stringify(galeriData));
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddSubmit = async () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    setIsUploading(true);

    try {
      // Mock upload
      const mockMedia: MediaItem = {
        id: Math.floor(Math.random() * 10000),
        title: newMedia.title || "Untitled",
        category: newMedia.category,
        type: newMedia.type,
        url: URL.createObjectURL(selectedFile),
        key: selectedFile.name
      };

      const newMediaList = [mockMedia, ...mediaList];
      setMediaList(newMediaList);
      localStorage.setItem("dummyGaleri", JSON.stringify(newMediaList));
      
      setIsAddOpen(false);
      setNewMedia({ title: "", category: "Wedding", type: "image" });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error uploading media:", error);
      alert(`Gagal mengupload media. Detail error: ${error?.message || JSON.stringify(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number, key?: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus media ini dari galeri?")) {
      try {
        const newMediaList = mediaList.filter(item => item.id !== id);
        setMediaList(newMediaList);
        localStorage.setItem("dummyGaleri", JSON.stringify(newMediaList));
      } catch (error) {
        console.error("Error deleting media:", error);
        alert("Gagal menghapus media.");
      }
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
                        {item.type === "video" ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        {item.type}
                      </span>
                      <Button size="icon-xs" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id, item.key)} title="Hapus">
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
        )}
      </main>

      {/* --- ADD MEDIA DIALOG --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Dokumentasi Galeri</DialogTitle>
            <DialogDescription>
              Isi data di bawah ini untuk mengupload media ke galeri landing page.
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
              <Label htmlFor="file">File Media (Max 5MB)</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isUploading}>Batal</Button>
            <Button onClick={handleAddSubmit} disabled={isUploading || !selectedFile}>
              {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengupload...</> : "Simpan Media"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
