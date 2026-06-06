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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Trash2, Edit3, Plus, Search, ChevronRight, HelpCircle as QuestionIcon } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const initialFAQs: FAQ[] = [
  { id: "faq-1", question: "Apakah bisa request lagu atau script MC?", answer: "Tentu saja! Kami sangat fleksibel dan akan menyesuaikan gaya, bahasa, serta script MC sesuai dengan tema dan preferensi acara Anda. Request lagu untuk backsound interaksi juga sangat diperbolehkan." },
  { id: "faq-2", question: "Berapa jauh area jangkauan layanan MC?", answer: "Kami melayani wilayah Jabodetabek dan sekitarnya secara reguler. Untuk luar kota atau luar pulau, kami juga bersedia dengan tambahan biaya akomodasi & transportasi yang disepakati bersama." },
  { id: "faq-3", question: "Apakah undangan digital bisa direvisi?", answer: "Ya, kami memberikan kesempatan revisi minor (seperti ubah teks, perubahan jam/tanggal, dan perbaikan typo) sebanyak maksimal 2 kali sebelum hari H acara." },
  { id: "faq-4", question: "Bagaimana sistem pembayarannya?", answer: "Sistem pembayaran dilakukan dengan cara Transfer Bank. Diperlukan Down Payment (DP) minimal 30% untuk mengunci jadwal (booking tanggal). Pelunasan dapat dilakukan maksimal H-1 sebelum acara." },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });

  const handleAddSubmit = () => {
    const id = `faq-${Date.now()}`;
    setFaqs([...faqs, { id, ...newFAQ }]);
    setIsAddOpen(false);
    setNewFAQ({ question: "", answer: "" });
  };

  const handleEditClick = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setEditForm({ question: faq.question, answer: faq.answer });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedFAQ) return;
    setFaqs(faqs.map(f => f.id === selectedFAQ.id ? { ...f, question: editForm.question, answer: editForm.answer } : f));
    setIsEditOpen(false);
    setSelectedFAQ(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const filteredFAQs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <BreadcrumbPage>FAQ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Kelola FAQ</h1>
            <p className="text-muted-foreground text-sm font-sans">Sunting daftar tanya-jawab (Frequently Asked Questions) yang tampil di landing page website.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="shadow-sm gap-2">
            <Plus className="w-4 h-4" /> Tambah FAQ
          </Button>
        </div>

        {/* Filter Toolbar */}
        <Card className="shadow-sm">
          <CardContent className="p-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pertanyaan atau jawaban..."
                className="pl-9 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accordion Preview and Inline Edit list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ Live Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Pratinjau Landing Page (Preview)</CardTitle>
                <CardDescription>Tampilan accordion FAQ persis seperti yang akan dilihat pengunjung website.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {filteredFAQs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full bg-background border px-6 rounded-xl">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                        <AccordionTrigger className="text-left font-semibold hover:no-underline py-4 text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground font-sans pb-4 leading-relaxed text-xs">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-center py-6 text-muted-foreground font-sans text-sm">Tidak ada FAQ ditemukan.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Controls List */}
          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Daftar Sunting FAQ</CardTitle>
                <CardDescription>Daftar baris untuk menyunting atau menghapus item FAQ.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="flex justify-between items-start gap-4 p-3 rounded-lg border bg-background hover:bg-muted/10 transition-colors">
                    <div className="space-y-1">
                      <p className="font-semibold text-xs font-heading line-clamp-1">{faq.question}</p>
                      <p className="text-[10px] text-muted-foreground font-sans line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon-sm" variant="ghost" onClick={() => handleEditClick(faq)} title="Edit">
                        <Edit3 className="w-3.5 h-3.5 text-primary" />
                      </Button>
                      <Button size="icon-sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(faq.id)} title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* --- ADD FAQ DIALOG --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Item FAQ</DialogTitle>
            <DialogDescription>
              Tulis pertanyaan dan jawaban baru untuk ditampilkan pada landing page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="faq-question">Pertanyaan (Question)</Label>
              <Input
                id="faq-question"
                placeholder="Cth: Apakah ada batasan revisi?"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faq-answer">Jawaban (Answer)</Label>
              <textarea
                id="faq-answer"
                rows={4}
                placeholder="Tulis penjelasan jawaban secara rinci..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddSubmit}>Simpan FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- EDIT FAQ DIALOG --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sunting Item FAQ</DialogTitle>
            <DialogDescription>
              Ubah teks pertanyaan dan jawaban FAQ terpilih.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-faq-question">Pertanyaan</Label>
              <Input
                id="edit-faq-question"
                value={editForm.question}
                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-faq-answer">Jawaban</Label>
              <textarea
                id="edit-faq-answer"
                rows={5}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={editForm.answer}
                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
              />
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
