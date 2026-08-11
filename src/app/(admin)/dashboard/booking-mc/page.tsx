export const dynamic = "force-dynamic"

import { BookingMcManager } from "@/components/admin/booking-mc-manager"
import { listMcBookings, listMcServiceOptions } from "@/lib/data/admin"

export default async function BookingMCPage() {
  const [bookings, services] = await Promise.all([
    listMcBookings(),
    listMcServiceOptions(),
  ])

  return <BookingMcManager initialBookings={bookings} serviceOptions={services} />
}
