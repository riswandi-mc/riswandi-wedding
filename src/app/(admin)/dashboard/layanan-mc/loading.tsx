import { Skeleton } from "@/components/ui/skeleton"

export default function LayananMcLoading() {
  return (
    <main className="admin-surface min-h-svh space-y-6 p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Memuat Layanan MC">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48 rounded bg-secondary" />
          <Skeleton className="h-8 w-64 rounded-md bg-secondary" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md bg-secondary" />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-secondary" />
        ))}
      </div>

      {/* Filter and Search */}
      <Skeleton className="h-10 w-full sm:max-w-xs rounded-md bg-secondary" />

      {/* Grid of Service Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 space-y-6 flex flex-col justify-between h-[420px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="size-13 rounded-2xl bg-secondary" />
                <Skeleton className="h-6 w-20 rounded-full bg-secondary" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-7 w-3/4 rounded-lg bg-secondary" />
                <Skeleton className="h-12 w-full rounded-md bg-secondary" />
              </div>
              <div className="space-y-2 pt-4 border-t">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <Skeleton className="size-4 rounded-full bg-secondary shrink-0" />
                    <Skeleton className="h-4 w-5/6 rounded bg-secondary" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Skeleton className="h-10 w-1/2 rounded-xl bg-secondary" />
              <Skeleton className="h-10 w-1/2 rounded-xl bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
