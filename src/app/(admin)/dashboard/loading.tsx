import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <main className="admin-surface min-h-svh space-y-6 p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Memuat dashboard">
      <div className="space-y-3"><Skeleton className="h-9 w-72" /><Skeleton className="h-5 w-full max-w-xl" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-[1.75rem] bg-secondary/70" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><Skeleton className="h-80 rounded-[1.75rem] bg-secondary/60 lg:col-span-2" /><Skeleton className="h-80 rounded-[1.75rem] bg-secondary/60" /></div>
    </main>
  )
}
