export const dynamic = "force-dynamic"

import { TestimonialManager } from "@/components/admin/testimonial-manager"
import { listAdminTestimonials } from "@/lib/data/admin"

export default async function TestimoniPage() {
  const testimonials = await listAdminTestimonials()

  return <TestimonialManager initialTestimonials={testimonials} />
}
