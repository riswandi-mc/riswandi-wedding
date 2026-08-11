import { Skeleton } from "@/components/ui/skeleton"

export default function UndanganDigitalLoading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat Undangan Digital">
      {/* Hero Skeleton */}
      <div className="site-container py-14 lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
        <div className="space-y-5">
          <Skeleton className="h-7 w-32 rounded-full bg-secondary" />
          <Skeleton className="h-20 w-full sm:h-28 rounded-3xl bg-secondary" />
          <Skeleton className="h-20 w-5/6 rounded-2xl bg-secondary" />
          <div className="flex gap-3">
            <Skeleton className="h-13 w-40 rounded-full bg-secondary" />
            <Skeleton className="h-13 w-32 rounded-full bg-secondary" />
          </div>
        </div>
        <div className="hidden lg:block space-y-4 p-6 border rounded-2xl bg-secondary/20">
          <Skeleton className="size-12 rounded-2xl bg-secondary" />
          <Skeleton className="h-8 w-3/4 rounded-lg bg-secondary" />
          <Skeleton className="h-16 w-full rounded-xl bg-secondary" />
        </div>
      </div>

      {/* Templates Catalog Grid */}
      <section className="bg-card py-12">
        <div className="site-container space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-6 w-28 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-96 rounded-xl bg-secondary" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-[1.25rem] p-2 space-y-4 bg-background">
                <Skeleton className="aspect-[3/4] w-full rounded-[1rem] bg-secondary" />
                <div className="p-3 space-y-3">
                  <Skeleton className="h-4 w-20 rounded bg-secondary" />
                  <Skeleton className="h-7 w-3/4 rounded-lg bg-secondary" />
                  <Skeleton className="h-6 w-2/3 rounded bg-secondary" />
                  <Skeleton className="h-12 w-full rounded bg-secondary" />
                </div>
                <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                  <Skeleton className="h-9 rounded bg-secondary" />
                  <Skeleton className="h-9 rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature / Process Section */}
      <section className="site-container py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-secondary/40 p-7 sm:p-10 space-y-6">
            <Skeleton className="h-6 w-32 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-3/4 rounded-xl bg-secondary" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-6 rounded-full bg-secondary shrink-0" />
                  <Skeleton className="h-5 w-5/6 rounded bg-secondary" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-primary/5 p-7 sm:p-10 space-y-6">
            <Skeleton className="h-6 w-32 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-3/4 rounded-xl bg-secondary" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-secondary/25">
                  <Skeleton className="size-9 rounded-full bg-secondary shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3 rounded bg-secondary" />
                    <Skeleton className="h-4 w-5/6 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-48 rounded-xl bg-secondary" />
          </div>
        </div>
      </section>
    </main>
  )
}
