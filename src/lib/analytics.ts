"use client"

type AnalyticsParameter = string | number | boolean | undefined

export function trackEvent(
  eventName: string,
  parameters: Record<string, AnalyticsParameter> = {},
) {
  const analyticsWindow = window as typeof window & {
    gtag?: (
      command: "event",
      name: string,
      values: Record<string, AnalyticsParameter>,
    ) => void
  }

  analyticsWindow.gtag?.("event", eventName, parameters)
}
