import * as React from "react"
import { Dialog, DialogFormContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface PopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  bodyClassName?: string
  showCloseButton?: boolean
}

export function Popup({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  bodyClassName,
  showCloseButton = true,
}: PopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogFormContent
        className={cn("sm:max-w-[460px]", className)}
        bodyClassName={cn("grid gap-4", bodyClassName)}
        title={title}
        description={description}
        footer={footer}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogFormContent>
    </Dialog>
  )
}
