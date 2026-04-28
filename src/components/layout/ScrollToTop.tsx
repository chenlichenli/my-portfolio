import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position on navigation so new pages (e.g. case studies) open at the top. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
