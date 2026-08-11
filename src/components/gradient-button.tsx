import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GradientButtonTheme = "auto" | "light" | "dark" | "system" | "inverse"

export interface GradientButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  theme?: GradientButtonTheme
}

/**
 * Backwards-compatible entry point for the original 3D gradient button.
 * The canonical primary treatment now lives in `Button`, so every primary
 * action—public site and admin—shares the same hover, pressed, focus,
 * disabled, and loading behavior.
 */
const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, theme = "auto", ...props }, ref) => (
    <Button
      ref={ref}
      data-button-theme={theme}
      className={cn(
        theme === "light" &&
          "border-border bg-gradient-to-b from-white via-[#fffdf7] to-[#edf1e9] text-foreground",
        (theme === "dark" || theme === "inverse") &&
          "border-x-[#284f3f] border-t-[#6f9381] border-b-[#0c251c] bg-gradient-to-b from-[#315c46] via-[#214b3a] to-[#173e31] text-white",
        className,
      )}
      {...props}
    />
  ),
)

GradientButton.displayName = "GradientButton"

export { GradientButton }
