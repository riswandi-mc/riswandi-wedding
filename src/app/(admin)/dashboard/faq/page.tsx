import { FaqManager } from "@/components/admin/faq-manager"
import { listAdminFaqs } from "@/lib/data/admin"

export default async function FAQPage() {
  const faqs = await listAdminFaqs()

  return <FaqManager initialFaqs={faqs} />
}
