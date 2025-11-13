'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname })
        })
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Failed to track page view:', error)
      }
    }

    trackPageView()
  }, [pathname])

  return null
}
