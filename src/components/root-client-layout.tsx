"use client"

import { usePathname } from "next/navigation"
import { PublicPageShell } from "@/components/public-page-shell"

export function RootClientLayout({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: any
}) {
  const pathname = usePathname()
  
  // Check if the current route is an admin page or login page
  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/manage-mc-booked")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <PublicPageShell settings={settings}>
      {children}
    </PublicPageShell>
  )
}
