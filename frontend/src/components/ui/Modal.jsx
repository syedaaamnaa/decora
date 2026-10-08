import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'

const WIDTHS = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[96vw]',
}

/**
 * Glass modal shell used for project details, inquiry popup, admin forms.
 */
export default function Modal({ open, onClose, children, size = 'md', label = 'Dialog' }) {
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className={`glass-strong relative max-h-[88vh] w-full ${WIDTHS[size] || WIDTHS.md} overflow-y-auto rounded-sm`}
            initial={{ opacity: 0, y: 44, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-bronze/60 hover:text-bronze-light"
            >
              <IoClose size={20} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
