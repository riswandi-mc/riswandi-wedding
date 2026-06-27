"use client";

import { useState, useEffect } from "react";
import templatesData from "@/data/templates.json";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit2, Eye, Star, Plus, Globe, Sparkles } from "lucide-react";

type Template = {
  id: number;
  name: string;
  demo: string;
  price: string;
  imgSig: number;
  onProcess?: boolean;
};

export default function TemplateUndanganPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const localData = localStorage.getItem("dummyTemplates");
    if (localData) {
      setTemplates(JSON.parse(localData));
    } else {
      setTemplates(templatesData as Template[]);
      localStorage.setItem("dummyTemplates", JSON.stringify(templatesData));
    }
  }, []);

  // Edit fields
  const [editForm, setEditForm] = useState({ name: "", price: "", demo: "", onProcess: false });

  const handleEditClick = (tpl: Template) => {
    setSelectedTemplate(tpl);
    setEditForm({ name: tpl.name, price: tpl.price, demo: tpl.demo, onProcess: !!tpl.onProcess });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedTemplate) return;
    const newTemplatesList = templates.map(t =>
      t.id === selectedTemplate.id
        ? { ...t, name: editForm.name, price: editForm.price, demo: editForm.demo, onProcess: editForm.onProcess }
        : t
    );
    setTemplates(newTemplatesList);
    localStorage.setItem("dummyTemplates", JSON.stringify(newTemplatesList));
    setIsEditOpen(false);
    setSelectedTemplate(null);
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
                <BreadcrumbPage>Template Undangan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Katalog Template Undangan</h1>
            <p className="text-muted-foreground text-sm font-sans">Sunting demo tautan, label harga, dan status rilis setiap template undangan digital.</p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="group overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col bg-background">
              <div className="aspect-[3/4] relative bg-muted overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=400&sig=${tpl.imgSig}`}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {tpl.onProcess ? (
                  <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-500 border-none text-white font-normal text-xs px-2 py-0.5">
                    Dalam Pengerjaan
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-500 border-none text-white font-normal text-xs px-2 py-0.5">
                    Aktif / Siap Pakai
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between gap-2">
                <div className="space-y-1">
                  <span className="font-semibold text-sm font-heading line-clamp-2">{tpl.name}</span>
                  <span className="text-primary font-bold text-sm block">{tpl.price}</span>
                </div>
                {tpl.demo !== "#" && (
                  <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1 mt-1 truncate" title={tpl.demo}>
                    <Globe className="w-3 h-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{tpl.demo}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 w-full grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => handleEditClick(tpl)}>
                  <Edit2 className="mr-1.5 w-3.5 h-3.5" /> Edit
                </Button>
                {tpl.onProcess ? (
                  <Button variant="secondary" size="sm" className="w-full text-xs opacity-60 cursor-not-allowed" disabled>
                    Dalam Proses
                  </Button>
                ) : (
                  <Button size="sm" className="w-full text-xs" asChild>
                    <a href={tpl.demo} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-1.5 w-3.5 h-3.5" /> Lihat Demo
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* --- EDIT TEMPLATE DIALOG --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Template Undangan</DialogTitle>
            <DialogDescription>
              Ubah konfigurasi tautan demo dan rincian harga untuk template ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tpl-name">Nama Template</Label>
              <Input
                id="tpl-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tpl-price">Harga Tampil (Format Rp)</Label>
              <Input
                id="tpl-price"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tpl-demo">Tautan URL Demo</Label>
              <Input
                id="tpl-demo"
                value={editForm.demo}
                onChange={(e) => setEditForm({ ...editForm, demo: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                id="tpl-process"
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                checked={editForm.onProcess}
                onChange={(e) => setEditForm({ ...editForm, onProcess: e.target.checked })}
              />
              <Label htmlFor="tpl-process" className="cursor-pointer">Kunci Template (Tandai sebagai 'Proses Pengerjaan')</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleEditSubmit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
