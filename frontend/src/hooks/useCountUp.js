import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 → target when it scrolls into view.
 * Returns a ref to attach and the current animated value.
 */
export default function useCountUp(target, { duration = 2200, startOnView = true } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame

    const run = () => {
      const startTime = performance.now()
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1)
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setValue(Math.round(eased * target))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    if (!startOnView) {
      run()
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            run()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration, startOnView])

  return { ref, value }
}
