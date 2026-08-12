import type { MetadataRoute } from "next"

import { SITE_DESCRIPTION } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Riswandi Wedding - MC & Undangan Digital",
    short_name: "Riswandi Wedding",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf7",
    theme_color: "#173e31",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
