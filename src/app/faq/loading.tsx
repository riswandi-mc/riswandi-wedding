import { Skeleton } from "@/components/ui/skeleton"

export default function FaqLoading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat FAQ">
      {/* Hero Skeleton */}
      <div className="site-container py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="space-y-5">
          <Skeleton className="h-7 w-32 rounded-full bg-secondary" />
          <Skeleton className="h-20 w-full sm:h-28 rounded-3xl bg-secondary" />
          <Skeleton className="h-20 w-5/6 rounded-2xl bg-secondary" />
          <Skeleton className="h-13 w-44 rounded-full bg-secondary" />
        </div>
      </div>

      {/* Accordion List Skeleton */}
      <section className="site-container py-12">
        <div className="grid gap-9 lg:grid-cols-[.55fr_1fr] lg:gap-16">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-full bg-secondary" />
            <Skeleton className="h-16 w-full rounded-2xl bg-secondary" />
            <Skeleton className="h-12 w-5/6 rounded-xl bg-secondary" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[1.35rem] bg-secondary/80" />
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 rounded-[2rem] bg-secondary/60 p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-3/4 rounded-xl bg-secondary" />
            <Skeleton className="h-6 w-5/6 rounded-lg bg-secondary" />
          </div>
          <div className="mt-6 sm:mt-0 flex gap-3 shrink-0">
            <Skeleton className="h-11 w-36 rounded-xl bg-secondary" />
            <Skeleton className="h-11 w-32 rounded-xl bg-secondary" />
          </div>
        </div>
      </section>
    </main>
  )
}
