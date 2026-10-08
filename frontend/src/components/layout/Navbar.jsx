import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCallOutline, IoClose, IoMenu } from 'react-icons/io5'
import Logo from '@/components/ui/Logo'
import { useInquiry } from '@/context/InquiryProvider'
import { NAV_LINKS, SITE } from '@/data/seed'

/**
 * Fixed premium navbar — transparent over hero, glass on scroll,
 * full-screen mobile overlay menu.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { openInquiry } = useInquiry()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock scroll while menu open
  useEffect(() => {
    if (!menuOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[500] transition-all duration-500 ease-luxe ${
          scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="container-luxe flex h-20 items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 ${
                    isActive ? 'text-bronze-light' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-gradient-to-r from-bronze to-gold"
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, '')}`}
              className="hidden items-center gap-2 text-xs tracking-[0.14em] text-white/60 transition-colors hover:text-bronze-light xl:flex"
            >
              <IoCallOutline className="text-bronze" />
              {SITE.phone}
            </a>
            <button type="button" onClick={() => openInquiry()} className="btn btn-primary btn-sm">
              Get a Quote
            </button>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.06] text-white backdrop-blur-md transition-colors hover:border-bronze/50 hover:text-bronze-light lg:hidden"
          >
            <IoMenu size={22} />
          </button>
        </div>
        <div className={`h-px w-full bg-gradient-to-r from-transparent via-bronze/40 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[600] flex flex-col bg-ink/97 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pattern-grid absolute inset-0 opacity-50" />
            <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-bronze/15 blur-[90px]" />

            <div className="container-luxe relative flex h-20 items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-bronze/50 hover:text-bronze-light"
              >
                <IoClose size={22} />
              </button>
            </div>

            <nav className="container-luxe relative mt-6 flex-1 overflow-y-auto" aria-label="Mobile">
              {NAV_LINKS.map((link, index) => {
                const active = location.pathname === link.to
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-baseline gap-4 border-b border-white/[0.07] py-5 font-display text-4xl font-medium transition-colors ${
                        active ? 'text-bronze-light' : 'text-white/90 hover:text-bronze-light'
                      }`}
                    >
                      <span className="text-xs font-sans font-medium tracking-[0.3em] text-bronze/70">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-4 pb-10"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    openInquiry()
                  }}
                  className="btn btn-primary w-full"
                >
                  Start Your Project
                </button>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 text-sm text-white/60"
                >
                  <IoCallOutline className="text-bronze" /> {SITE.phone}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
