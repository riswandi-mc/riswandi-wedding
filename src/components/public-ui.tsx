import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type PublicPageHeroProps = {
  eyebrow: string
  title: React.ReactNode
  description: React.ReactNode
  actions?: React.ReactNode
  aside?: React.ReactNode
  className?: string
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
}: PublicPageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/80 py-14 sm:py-18 lg:py-24",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[4rem] border-secondary/55" />
      <div className="pointer-events-none absolute -bottom-24 left-[8%] size-56 rounded-[44%_56%_62%_38%/58%_42%_58%_42%] bg-[#f1c875]/20" />
      <div
        className={cn(
          "site-container relative grid gap-9",
          aside && "lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.62fr)] lg:items-center lg:gap-14",
        )}
      >
        <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-4xl">
          <span className="section-eyebrow">{eyebrow}</span>
          <h1 className="display-title mt-5 max-w-[12ch] text-[3rem] text-primary sm:max-w-none sm:text-[4.5rem] lg:text-[6.6rem]">
            {title}
          </h1>
          <div className="mt-6 w-full max-w-[calc(100vw-2rem)] text-base leading-8 text-muted-foreground sm:max-w-2xl sm:text-lg">
            {description}
          </div>
          {actions ? <div className="mt-8 flex w-full max-w-[calc(100vw-2rem)] flex-wrap gap-3 sm:max-w-2xl">{actions}</div> : null}
        </div>
        {aside ? (
          <aside className="surface-card relative overflow-hidden bg-card/90 p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-secondary/70" />
            <div className="relative">{aside}</div>
          </aside>
        ) : null}
      </div>
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  inverse?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 grid gap-5 md:mb-12 md:grid-cols-[minmax(0,1fr)_minmax(16rem,.55fr)] md:items-end md:gap-10",
        className,
      )}
    >
      <div>
        <span className={cn("section-eyebrow", inverse && "text-[#c8dc9d]")}>{eyebrow}</span>
        <h2
          className={cn(
            "display-title mt-4 text-[2.75rem] sm:text-[4rem] lg:text-[5.4rem]",
            inverse ? "text-white" : "text-primary",
          )}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <div className={cn("text-base leading-7", inverse ? "text-white/70" : "text-muted-foreground")}>
          {description}
        </div>
      ) : null}
    </div>
  )
}

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("empty-state", className)} role="status">
      {Icon ? (
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
      <div>
        <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
        <p className="mx-auto mt-1 max-w-xl text-sm leading-6">{description}</p>
      </div>
      {action}
    </div>
  )
}
