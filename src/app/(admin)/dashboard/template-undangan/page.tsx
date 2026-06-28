import { InvitationTemplatesManager } from "@/components/admin/invitation-templates-manager"
import { listAdminInvitationTemplates } from "@/lib/data/admin"

export default async function TemplateUndanganPage() {
  const templates = await listAdminInvitationTemplates()

  return <InvitationTemplatesManager initialTemplates={templates} />
}
