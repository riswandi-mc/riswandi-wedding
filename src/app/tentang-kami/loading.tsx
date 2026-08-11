import { Skeleton } from "@/components/ui/skeleton"

export default function TentangKamiLoading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat Tentang Kami">
      {/* Hero Skeleton */}
      <div className="site-container py-14 lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
        <div className="space-y-5">
          <Skeleton className="h-7 w-28 rounded-full bg-secondary" />
          <Skeleton className="h-20 w-full sm:h-28 rounded-3xl bg-secondary" />
          <Skeleton className="h-20 w-5/6 rounded-2xl bg-secondary" />
          <div className="flex gap-3">
            <Skeleton className="h-13 w-40 rounded-full bg-secondary" />
            <Skeleton className="h-13 w-44 rounded-full bg-secondary" />
          </div>
        </div>
        <div className="hidden lg:block space-y-4 p-6 border rounded-2xl bg-secondary/20">
          <Skeleton className="size-12 rounded-2xl bg-secondary" />
          <Skeleton className="h-8 w-3/4 rounded-lg bg-secondary" />
          <Skeleton className="h-16 w-full rounded-xl bg-secondary" />
        </div>
      </div>

      {/* Values Section */}
      <section className="site-container py-12">
        <div className="space-y-3 mb-8">
          <Skeleton className="h-6 w-28 rounded-full bg-secondary" />
          <Skeleton className="h-12 w-96 rounded-xl bg-secondary" />
          <Skeleton className="h-5 w-80 rounded-lg bg-secondary" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-[1.75rem] p-7 space-y-6 bg-card">
              <div className="flex justify-between items-center">
                <Skeleton className="size-13 rounded-2xl bg-secondary" />
                <Skeleton className="h-7 w-10 rounded bg-secondary" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4 rounded-lg bg-secondary" />
                <Skeleton className="h-14 w-full rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-secondary/35 py-12">
        <div className="site-container flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-3">
            <Skeleton className="h-6 w-24 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-full rounded-xl bg-secondary" />
          </div>
          <Skeleton className="h-12 w-48 rounded-xl bg-secondary shrink-0" />
        </div>
      </section>
    </main>
  )
}
