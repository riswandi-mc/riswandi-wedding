import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function GaleriLoading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat Galeri">
      {/* Hero Skeleton */}
      <div className="site-container py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="space-y-5">
          <Skeleton className="h-7 w-28 rounded-full bg-secondary" />
          <Skeleton className="h-20 w-full sm:h-28 rounded-3xl bg-secondary" />
          <Skeleton className="h-20 w-5/6 rounded-2xl bg-secondary" />
          <div className="flex gap-3">
            <Skeleton className="h-13 w-40 rounded-full bg-secondary" />
            <Skeleton className="h-13 w-48 rounded-full bg-secondary" />
          </div>
        </div>
      </div>

      {/* Gallery Grid Skeleton */}
      <section className="py-12 bg-primary/5">
        <div className="site-container space-y-10">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-96 rounded-xl bg-secondary" />
            <Skeleton className="h-5 w-80 rounded-lg bg-secondary" />
          </div>

          <div className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[17rem] lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className={cn(
                  "rounded-[1.5rem] bg-secondary/70",
                  index === 0 && "col-span-2 row-span-2",
                  index === 3 && "col-span-2"
                )}
              />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Skeleton className="h-12 w-48 rounded-xl bg-secondary" />
            <Skeleton className="h-12 w-48 rounded-xl bg-secondary" />
          </div>
        </div>
      </section>
    </main>
  )
}
