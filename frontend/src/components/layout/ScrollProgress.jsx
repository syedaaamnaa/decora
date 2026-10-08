import { motion, useScroll, useSpring } from 'framer-motion'

/** Slim bronze scroll progress indicator pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[800] h-[2.5px] origin-left bg-gradient-to-r from-bronze-dark via-gold to-bronze"
      aria-hidden="true"
    />
  )
}
