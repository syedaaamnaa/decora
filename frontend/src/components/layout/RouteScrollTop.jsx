import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Instantly scrolls to the top whenever the route changes. */
export default function RouteScrollTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
