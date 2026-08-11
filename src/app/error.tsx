"use client"

import Link from "next/link"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-16">
      <div className="surface-card max-w-xl p-7 text-center sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f9e6df] text-destructive"><AlertTriangle className="size-6" /></span>
        <span className="section-eyebrow mx-auto mt-6">Terjadi kendala</span>
        <h1 className="display-title mt-4 text-4xl text-primary sm:text-5xl">Halaman belum berhasil dimuat.</h1>
        <p className="mt-5 leading-7 text-muted-foreground">Data Anda tidak berubah. Coba muat ulang halaman, atau kembali ke beranda bila kendala masih berlanjut.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={reset}><RefreshCw className="size-4" /> Coba Lagi</Button><Button asChild variant="outline"><Link href="/">Kembali ke Beranda</Link></Button></div>
      </div>
    </main>
  )
}
