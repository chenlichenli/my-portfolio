import { Analytics } from '@vercel/analytics/react'
import { useLocation } from 'react-router-dom'

/**
 * Tracks client-side route changes for Vite + React Router on Vercel.
 * Pass `route` + `path` so the package disables auto-track and emits pageviews per navigation.
 */
export function VercelAnalytics() {
  const { pathname, search } = useLocation()
  const path = `${pathname}${search}`

  return <Analytics path={path} route={pathname} />
}
