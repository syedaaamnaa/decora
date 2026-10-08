import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from '@/components/ui/Logo'

/**
 * Luxury loading screen shown on first paint: monogram + progress.
 * Exits with a curtain sweep.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(100, current + Math.random() * 22 + 8)
      setProgress(Math.round(current))
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => setDone(true), 420)
      }
    }, 120)

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      clearInterval(interval)
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (done) document.body.style.overflow = ''
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-loader flex flex-col items-center justify-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="pattern-grid absolute inset-0 opacity-50" />
          <div className="absolute h-72 w-72 rounded-full bg-bronze/10 blur-[100px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <LogoMark className="h-20 w-20" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mt-7 font-display text-3xl font-semibold text-white"
          >
            DECORA
          </motion.p>

          <div className="relative mt-8 h-px w-56 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-bronze to-gold"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <span className="relative mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40">
            Building Excellence
          </span>

          <span className="absolute bottom-8 right-8 font-display text-6xl font-light text-white/10">
            {progress}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
