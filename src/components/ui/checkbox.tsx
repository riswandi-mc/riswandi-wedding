import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-5 shrink-0 cursor-pointer rounded-md border border-border bg-card accent-[#173e31] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
      {...props}
    />
  )
}

export { Checkbox }
