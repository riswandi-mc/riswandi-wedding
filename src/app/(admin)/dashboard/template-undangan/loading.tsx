import { Skeleton } from "@/components/ui/skeleton"

export default function TemplateUndanganLoading() {
  return (
    <main className="admin-surface min-h-svh space-y-6 p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Memuat Template Undangan">
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

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:max-w-xs rounded-md bg-secondary" />
      </div>

      {/* Grid of Template Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card overflow-hidden p-2 space-y-3 flex flex-col justify-between">
            <div>
              <Skeleton className="aspect-[3/4] w-full rounded-xl bg-secondary" />
              <div className="p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-12 rounded bg-secondary" />
                  <Skeleton className="h-5 w-16 rounded bg-secondary" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-lg bg-secondary" />
                <Skeleton className="h-5 w-24 rounded bg-secondary" />
              </div>
            </div>
            <div className="flex gap-2 p-3 pt-0 border-t">
              <Skeleton className="h-9 w-1/2 rounded bg-secondary" />
              <Skeleton className="h-9 w-1/2 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
