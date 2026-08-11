"use client"

import type { AnchorHTMLAttributes } from "react"

import { trackEvent } from "@/lib/analytics"

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string
  eventLocation: string
}

export function TrackedExternalLink({
  eventName,
  eventLocation,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, { location: eventLocation })
        onClick?.(event)
      }}
    />
  )
}
