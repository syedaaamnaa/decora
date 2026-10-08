import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Custom luxury cursor — bronze dot + trailing ring.
 * Only activates on fine-pointer devices; native cursor is restored otherwise.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.45 })
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.45 })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target
      setHovering(Boolean(target?.closest?.('a, button, [role="button"], input, textarea, select, label')))
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      {/* dot */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-cursor"
        aria-hidden="true"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: pressed ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
            className="h-1.5 w-1.5 rounded-full bg-gold"
          />
        </div>
      </motion.div>

      {/* ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-cursor"
        aria-hidden="true"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              width: hovering ? 52 : 34,
              height: hovering ? 52 : 34,
              opacity: pressed ? 0.55 : 1,
              borderColor: hovering ? '#C8A66B' : 'rgba(200,166,107,0.45)',
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center rounded-full border"
          >
            <motion.span
              animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.6 }}
              transition={{ duration: 0.25 }}
              className="text-[8px] font-semibold uppercase tracking-[0.2em] text-bronze-light"
            >
              {hovering ? 'view' : ''}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
