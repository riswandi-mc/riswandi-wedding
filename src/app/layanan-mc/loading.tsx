import { Skeleton } from "@/components/ui/skeleton"

export default function LayananMcLoading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat Layanan MC">
      {/* Hero Skeleton */}
      <div className="site-container py-14 lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
        <div className="space-y-5">
          <Skeleton className="h-7 w-32 rounded-full bg-secondary" />
          <Skeleton className="h-20 w-full sm:h-28 rounded-3xl bg-secondary" />
          <Skeleton className="h-20 w-5/6 rounded-2xl bg-secondary" />
          <div className="flex gap-3">
            <Skeleton className="h-13 w-40 rounded-full bg-secondary" />
            <Skeleton className="h-13 w-40 rounded-full bg-secondary" />
          </div>
        </div>
        <div className="hidden lg:block space-y-4 p-6 border rounded-2xl bg-secondary/20">
          <Skeleton className="size-12 rounded-2xl bg-secondary" />
          <Skeleton className="h-8 w-3/4 rounded-lg bg-secondary" />
          <Skeleton className="h-16 w-full rounded-xl bg-secondary" />
        </div>
      </div>

      {/* Packages Section */}
      <section className="site-container py-12">
        <div className="space-y-3 mb-8">
          <Skeleton className="h-6 w-28 rounded-full bg-secondary" />
          <Skeleton className="h-12 w-96 rounded-xl bg-secondary" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-[1.75rem] p-6 space-y-6 bg-card/65">
              <div className="flex items-center justify-between">
                <Skeleton className="size-13 rounded-2xl bg-secondary" />
                <Skeleton className="h-6 w-24 rounded-full bg-secondary" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 rounded-lg bg-secondary" />
                <Skeleton className="h-12 w-full rounded-md bg-secondary" />
              </div>
              <div className="space-y-3 pt-4 border-t">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex gap-2.5">
                    <Skeleton className="size-4 shrink-0 rounded-full bg-secondary" />
                    <Skeleton className="h-4 w-5/6 rounded bg-secondary" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-11 w-full rounded-xl bg-secondary" />
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 bg-secondary/40">
        <div className="site-container space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-6 w-28 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-96 rounded-xl bg-secondary" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-[1.75rem] p-7 bg-card space-y-6">
                <Skeleton className="size-12 rounded-full bg-secondary" />
                <Skeleton className="h-8 w-2/3 rounded-lg bg-secondary" />
                <Skeleton className="h-14 w-full rounded-md bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
