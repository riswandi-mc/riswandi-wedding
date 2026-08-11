import { requireAdmin } from "@/lib/auth"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>
}

async function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireAdmin()

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: profile.full_name || "Admin",
          email: profile.email,
          avatar: "/avatars/shadcn.jpg",
        }}
      />
      <SidebarInset className="admin-surface">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
