import Link from "next/link"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center overflow-hidden px-4 py-16">
      <div className="relative max-w-2xl text-center">
        <div className="absolute left-1/2 top-1/2 -z-10 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/65 blur-2xl" />
        <span className="section-eyebrow mx-auto">404 · Tersesat sebentar</span>
        <h1 className="display-title mt-5 text-5xl text-primary sm:text-7xl">
          Halaman ini tidak ada, tetapi cerita Anda masih bisa dimulai.
        </h1>
        <p className="mt-6 leading-7 text-muted-foreground">
          Alamat yang Anda buka tidak tersedia atau telah dipindahkan. Kembali
          ke beranda untuk melihat jasa MC wedding, undangan digital, galeri,
          dan informasi pemesanan Riswandi Wedding.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/">Kembali ke Beranda <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </main>
  )
}
