export const dynamic = "force-dynamic"

import { InvitationOrdersManager } from "@/components/admin/invitation-orders-manager"
import { listInvitationOrders, listInvitationTemplateOptions } from "@/lib/data/admin"

export default async function PesananUndanganPage() {
  const [orders, templates] = await Promise.all([
    listInvitationOrders(),
    listInvitationTemplateOptions(),
  ])

  return <InvitationOrdersManager initialOrders={orders} templateOptions={templates} />
}
