import { motion } from 'framer-motion'

/**
 * Page shell — provides the route transition animation.
 * Wrapped by <AnimatePresence mode="wait"> in the layout.
 */
export default function Page({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  )
}
