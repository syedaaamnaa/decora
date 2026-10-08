import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Scroll-reveal wrapper used across the site.
 * <Reveal delay={0.1}>…</Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  y = 36,
  duration = 0.9,
  once = true,
  className = '',
  amount = 0.25,
  ...rest
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
