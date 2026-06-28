import { CalendarManager } from "@/components/admin/calendar-manager"
import { listAdminCalendarItems } from "@/lib/data/admin"

export default async function CalendarPage() {
  const items = await listAdminCalendarItems()

  return <CalendarManager initialItems={items} />
}
