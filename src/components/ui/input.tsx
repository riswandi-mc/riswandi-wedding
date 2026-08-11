import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-border bg-card/85 px-3.5 py-2 text-base shadow-[inset_0_1px_2px_rgba(23,62,49,.045)] transition-[border-color,box-shadow,background-color] duration-200 outline-none file:mr-3 file:inline-flex file:h-7 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:text-sm file:font-semibold file:text-foreground placeholder:text-muted-foreground/75 hover:border-[#aebdaa] focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
