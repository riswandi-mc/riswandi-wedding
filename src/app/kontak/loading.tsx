import { Skeleton } from "@/components/ui/skeleton"

export default function KontakLoading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat Kontak">
      {/* Hero Skeleton */}
      <div className="site-container py-14 lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
        <div className="space-y-5">
          <Skeleton className="h-7 w-32 rounded-full bg-secondary" />
          <Skeleton className="h-20 w-full sm:h-28 rounded-3xl bg-secondary" />
          <Skeleton className="h-20 w-5/6 rounded-2xl bg-secondary" />
          <div className="flex gap-3">
            <Skeleton className="h-13 w-44 rounded-full bg-secondary" />
            <Skeleton className="h-13 w-32 rounded-full bg-secondary" />
          </div>
        </div>
        <div className="hidden lg:block space-y-4 p-6 border rounded-2xl bg-secondary/20">
          <Skeleton className="size-12 rounded-2xl bg-secondary" />
          <Skeleton className="h-8 w-3/4 rounded-lg bg-secondary" />
          <Skeleton className="h-16 w-full rounded-xl bg-secondary" />
        </div>
      </div>

      {/* Contact Channels Grid */}
      <section className="site-container py-12">
        <div className="space-y-3 mb-8">
          <Skeleton className="h-6 w-28 rounded-full bg-secondary" />
          <Skeleton className="h-12 w-96 rounded-xl bg-secondary" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.75rem] border p-7 space-y-6 bg-secondary/30 lg:col-span-2">
            <Skeleton className="size-13 rounded-2xl bg-secondary" />
            <Skeleton className="h-10 w-1/3 rounded-lg bg-secondary" />
            <Skeleton className="h-14 w-full rounded-md bg-secondary" />
            <Skeleton className="h-11 w-44 rounded-xl bg-secondary" />
          </div>

          <div className="rounded-[1.75rem] border p-7 space-y-5 bg-card">
            <Skeleton className="size-7 rounded bg-secondary" />
            <Skeleton className="h-8 w-2/3 rounded-lg bg-secondary" />
            <Skeleton className="h-14 w-full rounded-md bg-secondary" />
            <Skeleton className="h-11 w-full rounded-xl bg-secondary" />
          </div>

          <div className="rounded-[1.75rem] border p-7 space-y-5 bg-secondary/40">
            <Skeleton className="size-7 rounded bg-secondary" />
            <Skeleton className="h-8 w-2/3 rounded-lg bg-secondary" />
            <Skeleton className="h-14 w-full rounded-md bg-secondary" />
          </div>

          <div className="rounded-[1.75rem] border p-7 bg-card md:col-span-2 lg:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex gap-4 items-start">
              <Skeleton className="size-12 rounded-2xl bg-secondary" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48 rounded-lg bg-secondary" />
                <Skeleton className="h-5 w-64 rounded-md bg-secondary" />
              </div>
            </div>
            <Skeleton className="h-11 w-48 rounded-xl bg-secondary" />
          </div>
        </div>
      </section>

      {/* Prepare info banner */}
      <section className="bg-secondary/50 py-12">
        <div className="site-container grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-start">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-5/6 rounded-xl bg-secondary" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-card p-4">
                <Skeleton className="size-8 rounded-full bg-secondary shrink-0" />
                <Skeleton className="h-5 w-3/4 rounded bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
