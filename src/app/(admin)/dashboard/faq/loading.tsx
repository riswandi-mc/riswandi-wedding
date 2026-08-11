import { Skeleton } from "@/components/ui/skeleton"

export default function FaqLoading() {
  return (
    <main className="admin-surface min-h-svh space-y-6 p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Memuat FAQ">
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

      {/* Table Mockup */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32 rounded bg-secondary" />
        </div>
        <div className="p-4 space-y-4">
          {/* Header Row */}
          <div className="flex items-center gap-4 py-2 border-b">
            <Skeleton className="h-5 w-8 rounded bg-secondary" />
            <Skeleton className="h-5 w-48 rounded bg-secondary" />
            <Skeleton className="h-5 w-72 rounded bg-secondary" />
            <Skeleton className="h-5 w-16 rounded bg-secondary" />
            <Skeleton className="h-5 w-16 rounded bg-secondary" />
            <Skeleton className="h-5 w-16 ml-auto rounded bg-secondary" />
          </div>
          {/* Table Data Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
              <Skeleton className="h-5 w-8 rounded bg-secondary/80" />
              <Skeleton className="h-5 w-48 rounded bg-secondary/80" />
              <Skeleton className="h-5 w-72 rounded bg-secondary/80" />
              <Skeleton className="h-5 w-16 rounded bg-secondary/80" />
              <Skeleton className="h-6 w-16 rounded-full bg-secondary/80" />
              <div className="flex items-center gap-2 ml-auto">
                <Skeleton className="size-8 rounded-md bg-secondary/80" />
                <Skeleton className="size-8 rounded-md bg-secondary/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
