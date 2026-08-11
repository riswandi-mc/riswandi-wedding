export const dynamic = "force-dynamic"

import { GalleryManager } from "@/components/admin/gallery-manager"
import { listAdminGalleryItems } from "@/lib/data/admin"

export default async function GaleriUploadPage() {
  const items = await listAdminGalleryItems()

  return <GalleryManager initialItems={items} />
}
