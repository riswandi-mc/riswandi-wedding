import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <main className="admin-surface min-h-svh space-y-6 p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Memuat Kalender">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48 rounded bg-secondary" />
          <Skeleton className="h-8 w-64 rounded-md bg-secondary" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-secondary" />
        ))}
      </div>

      {/* Calendar layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-40 rounded bg-secondary" />
            <div className="flex gap-2">
              <Skeleton className="size-8 rounded bg-secondary" />
              <Skeleton className="size-8 rounded bg-secondary" />
            </div>
          </div>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-6 rounded bg-secondary" />
            ))}
          </div>
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded bg-secondary/80" />
            ))}
          </div>
        </div>

        {/* Selected Day Events list Section */}
        <div className="rounded-2xl border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-32 rounded bg-secondary" />
              <Skeleton className="h-4 w-24 rounded bg-secondary" />
            </div>
            <Skeleton className="size-8 rounded-full bg-secondary" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-xl bg-secondary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24 rounded bg-secondary" />
                  <Skeleton className="h-5 w-16 rounded bg-secondary" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded bg-secondary" />
                <Skeleton className="h-4 w-full rounded bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
