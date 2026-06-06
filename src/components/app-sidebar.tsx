"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  LayoutDashboard,
  Calendar,
  FileSpreadsheet,
  Image,
  Settings,
  FileText,
  HelpCircle,
  Globe,
  MoreHorizontal
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
      isActive: true,
    },
    {
      title: "Booking MC (Tabel)",
      url: "/dashboard/booking-mc",
      icon: <Calendar />,
    },
    {
      title: "Pesanan Undangan (Tabel)",
      url: "/dashboard/pesanan-undangan",
      icon: <FileSpreadsheet />,
    },
    {
      title: "Galeri (Upload)",
      url: "/dashboard/galeri",
      icon: <Image />,
    },
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: <Settings />,
    },
    {
      title: "Template Undangan (Edit)",
      url: "/dashboard/template-undangan",
      icon: <FileText />,
    },
    {
      title: "FAQ (Edit)",
      url: "/dashboard/faq",
      icon: <HelpCircle />,
    },
  ],
  projects: [
    {
      name: "Lihat Landingpage",
      url: "/",
      icon: <Globe />,
      target: "_blank",
    },
    {
      name: "Kalender",
      url: "/dashboard/calendar",
      icon: <Calendar />,
    },
    {
      name: "Lain-lain",
      url: "#",
      icon: <MoreHorizontal />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="Menu Utama" />
        <NavProjects projects={data.projects} title="Pintasan" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
