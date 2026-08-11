import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 aria-busy:cursor-wait aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-x-[#284f3f] border-t-[#6f9381] border-b-[#0c251c] bg-gradient-to-b from-[#315c46] via-[#214b3a] to-[#173e31] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-2px_0_rgba(7,30,21,.56),0_5px_0_#0e2d22,0_9px_20px_rgba(23,62,49,.22)] hover:-translate-y-0.5 hover:from-[#3d6c54] hover:via-[#285541] hover:to-[#1a4737] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.32),inset_0_-2px_0_rgba(7,30,21,.5),0_6px_0_#0e2d22,0_12px_24px_rgba(23,62,49,.24)] active:translate-y-1 active:shadow-[inset_0_2px_5px_rgba(7,30,21,.38),0_1px_0_#0e2d22,0_4px_9px_rgba(23,62,49,.18)] disabled:translate-y-0 disabled:shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_2px_0_#1e4234]",
        outline:
          "border-border bg-gradient-to-b from-white via-[#fffdf7] to-[#edf1e9] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.9),inset_0_-1px_0_rgba(23,62,49,.12),0_3px_0_#c6d0c1,0_7px_16px_rgba(37,68,47,.10)] hover:-translate-y-0.5 hover:border-[#9db09a] hover:to-[#e5ecdf] hover:text-primary active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(23,62,49,.13),0_1px_0_#c6d0c1] aria-expanded:bg-secondary",
        secondary:
          "border-[#b9c9b4] bg-gradient-to-b from-[#edf3e9] via-secondary to-[#cbd9c5] text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.75),inset_0_-1px_0_rgba(23,62,49,.12),0_3px_0_#adbea8] hover:-translate-y-0.5 hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(23,62,49,.15),0_1px_0_#adbea8] aria-expanded:bg-secondary",
        ghost:
          "border-transparent bg-transparent text-foreground shadow-none hover:bg-secondary/70 hover:text-primary aria-expanded:bg-secondary",
        destructive:
          "border-[#7e2925] bg-gradient-to-b from-[#c65b52] to-destructive text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),inset_0_-2px_0_rgba(72,18,15,.35),0_3px_0_#7e2925] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(72,18,15,.35),0_1px_0_#7e2925] focus-visible:ring-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-8 gap-1.5 px-3 text-xs has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 px-4 text-xs has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-13 gap-2.5 px-7 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-11",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
