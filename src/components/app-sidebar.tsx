import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  LayoutDashboard,
  Calendar,
  FileSpreadsheet,
  Image as ImageIcon,
  Settings,
  FileText,
  HelpCircle,
  Globe,
  MoreHorizontal,
  Star,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Layanan MC",
      url: "#",
      icon: <Calendar />,
      isActive: true,
      items: [
        {
          title: "Konten Layanan",
          url: "/dashboard/layanan-mc",
        },
        {
          title: "Booking MC",
          url: "/dashboard/booking-mc",
        },
        {
          title: "Jadwal & Kalender",
          url: "/dashboard/calendar",
        },
      ],
    },
    {
      title: "Undangan Digital",
      url: "#",
      icon: <FileSpreadsheet />,
      items: [
        {
          title: "Pesanan Masuk",
          url: "/dashboard/pesanan-undangan",
        },
        {
          title: "Katalog Template",
          url: "/dashboard/template-undangan",
        },
      ],
    },
    {
      title: "Media & Konten",
      url: "#",
      icon: <ImageIcon />,
      items: [
        {
          title: "Galeri Dokumentasi",
          url: "/dashboard/galeri",
        },
        {
          title: "Testimoni",
          url: "/dashboard/testimoni",
          icon: <Star />,
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "/dashboard/setting",
      icon: <Settings />,
    },
  ],
  projects: [
    {
      name: "Lihat Website",
      url: "/",
      icon: <Globe />,
    },
    {
      name: "Panduan Sistem",
      url: "#",
      icon: <FileText />,
    },
    {
      name: "Bantuan & Support",
      url: "#",
      icon: <HelpCircle />,
    },
    {
      name: "Lainnya",
      url: "#",
      icon: <MoreHorizontal />,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/80 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-sidebar-primary-foreground shadow-[0_3px_0_#0e2d22]">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading text-base font-semibold">
                  Riswandi Wedding
                </span>
                <span className="truncate text-[10px] font-bold tracking-[.08em] text-muted-foreground uppercase">Admin Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="Menu Utama" />
        <NavProjects projects={data.projects} title="Pintasan" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 p-3">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
