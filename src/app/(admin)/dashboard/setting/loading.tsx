import { Skeleton } from "@/components/ui/skeleton"

export default function SettingLoading() {
  return (
    <main className="admin-surface min-h-svh space-y-6 p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Memuat Pengaturan">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48 rounded bg-secondary" />
          <Skeleton className="h-8 w-64 rounded-md bg-secondary" />
        </div>
      </div>

      {/* Settings Form Mockup */}
      <div className="grid gap-6">
        {/* Card Section 1: Profil Bisnis */}
        <div className="rounded-2xl border bg-card p-6 space-y-6">
          <div className="space-y-1.5 border-b pb-3">
            <Skeleton className="h-6 w-32 rounded bg-secondary" />
            <Skeleton className="h-4 w-64 rounded bg-secondary" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded bg-secondary" />
              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded bg-secondary" />
              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded bg-secondary" />
            <Skeleton className="h-20 w-full rounded-md bg-secondary" />
          </div>
        </div>

        {/* Card Section 2: Templates & Integrations */}
        <div className="rounded-2xl border bg-card p-6 space-y-6">
          <div className="space-y-1.5 border-b pb-3">
            <Skeleton className="h-6 w-32 rounded bg-secondary" />
            <Skeleton className="h-4 w-64 rounded bg-secondary" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded bg-secondary" />
            <Skeleton className="h-24 w-full rounded-md bg-secondary" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded bg-secondary" />
            <Skeleton className="h-24 w-full rounded-md bg-secondary" />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Skeleton className="h-11 w-32 rounded-xl bg-secondary" />
        </div>
      </div>
    </main>
  )
}
