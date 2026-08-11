import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-xl border border-border bg-card/85 px-3.5 py-3 text-base shadow-[inset_0_1px_2px_rgba(23,62,49,.045)] transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-muted-foreground/75 hover:border-[#aebdaa] focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
