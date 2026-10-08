import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoArrowUp, IoLogoWhatsapp } from 'react-icons/io5'
import { SITE } from '@/data/seed'

const WA_TEXT = encodeURIComponent(
  'Hi DECORA! I would like to discuss a project (site, scope & timeline).',
)

/**
 * Floating actions — WhatsApp chat button + back-to-top.
 */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-[700] flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.85 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-hover flex h-12 w-12 items-center justify-center rounded-full text-white/85 hover:text-bronze-light"
          >
            <IoArrowUp size={19} />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={`https://wa.me/${SITE.whatsapp}?text=${WA_TEXT}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with DECORA on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#B08D57,#C8A66B)] text-[#141414] shadow-glow transition-transform duration-300 hover:scale-105"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-bronze/70" aria-hidden="true" />
        <IoLogoWhatsapp size={27} />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap border border-white/10 bg-black/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  )
}
