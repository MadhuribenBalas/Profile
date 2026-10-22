const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2024-08" -> "Aug 2024" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

/** Date range for display; falls back to a duration when dates are unknown */
export function formatRange(start: string | null, end: string | null, duration?: string): string {
  if (!start) return duration ?? ''
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'present'}`
}
