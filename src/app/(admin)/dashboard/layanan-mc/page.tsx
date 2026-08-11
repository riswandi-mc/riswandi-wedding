export const dynamic = "force-dynamic"

import { McServicesManager } from "@/components/admin/mc-services-manager"
import { listAdminMcServices } from "@/lib/data/admin"

export default async function DashboardMcServicesPage() {
  const services = await listAdminMcServices()

  return <McServicesManager initialServices={services} />
}
