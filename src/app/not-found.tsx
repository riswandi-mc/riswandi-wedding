import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-xl space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="font-heading text-4xl font-bold text-primary md:text-5xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="leading-7 text-muted-foreground">
          Alamat yang Anda buka tidak tersedia atau telah dipindahkan. Kembali
          ke beranda untuk melihat jasa MC wedding, undangan digital, galeri,
          dan informasi pemesanan Riswandi Wedding.
        </p>
        <Button asChild size="lg">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </main>
  )
}
