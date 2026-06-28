import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicHomepageData } from "@/lib/data/public"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Layanan MC | Riswandi Wedding",
  description: "Daftar lengkap layanan MC Riswandi Wedding untuk berbagai kebutuhan acara.",
}

function getServiceBadgeClass(variant: string | null) {
  switch (variant) {
    case "popular":
      return "bg-primary/10 text-primary border-primary/20"
    case "best_value":
      return "bg-amber-500/10 text-amber-700 border-amber-300"
    case "exclusive":
      return "bg-slate-900/10 text-slate-700 border-slate-300"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

export default async function LayananMcPage() {
  const data = await getPublicHomepageData()
  const services = data.services

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Button variant="ghost" asChild className="mb-8 -ml-3 gap-2">
            <Link href="/#layanan">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline">Layanan MC</Badge>
            <h1 className="font-heading text-3xl font-bold text-primary md:text-5xl">
              Semua Layanan MC
            </h1>
            <p className="text-base leading-7 text-muted-foreground md:text-lg">
              Pilih layanan Master of Ceremony yang paling sesuai untuk kebutuhan acara Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.slug}
                className={cn(
                  "flex flex-col shadow-sm transition-colors hover:border-primary hover:shadow-md",
                  service.is_featured ? "relative overflow-hidden border-primary/40 shadow-md" : "border-primary/20"
                )}
              >
                {service.badge_variant === "best_value" ? (
                  <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-primary px-4 py-1 text-xs font-bold uppercase text-primary-foreground shadow-sm">
                    Best Value
                  </div>
                ) : null}
                <CardHeader>
                  {service.badge_label ? (
                    <div className="mb-2 flex justify-between">
                      <Badge variant="outline" className={getServiceBadgeClass(service.badge_variant)}>
                        {service.badge_label}
                      </Badge>
                    </div>
                  ) : null}
                  <CardTitle className="font-heading text-2xl">{service.title}</CardTitle>
                  <CardDescription>{service.short_description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/#layanan">Booking Sekarang</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            Data layanan belum tersedia saat ini.
          </div>
        )}
      </section>
    </main>
  )
}
