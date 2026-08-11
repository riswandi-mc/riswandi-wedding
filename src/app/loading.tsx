import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-svh bg-background" aria-busy="true" aria-label="Memuat halaman">
      <div className="site-container py-5">
        <Skeleton className="h-16 w-full rounded-full bg-secondary" />
      </div>
      <div className="site-container grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5"><Skeleton className="h-7 w-48" /><Skeleton className="h-20 w-full sm:h-28" /><Skeleton className="h-20 w-5/6" /><div className="flex gap-3"><Skeleton className="h-13 w-44 rounded-full" /><Skeleton className="h-13 w-40 rounded-full" /></div></div>
        <Skeleton className="h-[28rem] rounded-[8rem_8rem_2rem_2rem] bg-secondary sm:h-[36rem]" />
      </div>
    </main>
  )
}
