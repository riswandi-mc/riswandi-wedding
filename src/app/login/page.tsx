import { redirect } from "next/navigation"

import { getAuthContext } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export default async function Page() {
  const { profile } = await getAuthContext()

  if (profile) {
    redirect("/dashboard")
  }

  return (
    <main className="grid min-h-svh place-items-center p-4 sm:p-6 lg:p-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_28px_80px_rgba(23,62,49,.18)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border-[3.5rem] border-white/8" />
          <div className="relative"><span className="section-eyebrow text-[#c8dc9d]">Admin workspace</span><h1 className="display-title mt-5 text-6xl">Kelola layanan dengan lebih tenang.</h1><p className="mt-6 max-w-sm leading-7 text-white/65">Booking, pesanan undangan, galeri, testimoni, dan konten website berada dalam satu ruang kerja.</p></div>
          <p className="relative text-xs tracking-[.12em] text-white/45 uppercase">Riswandi Wedding · Secure access</p>
        </section>
        <div className="flex items-center justify-center p-5 sm:p-10 lg:p-14">
          <div className="w-full max-w-md"><div className="mb-7 lg:hidden"><span className="section-eyebrow">Admin workspace</span><h1 className="display-title mt-4 text-4xl text-primary">Selamat datang kembali.</h1></div><LoginForm /></div>
        </div>
      </div>
    </main>
  )
}
