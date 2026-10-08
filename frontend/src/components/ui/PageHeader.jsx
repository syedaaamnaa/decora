import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IoHomeOutline, IoChevronForward } from 'react-icons/io5'
import LazyImage from './LazyImage'
import Reveal from './Reveal'
import { img } from '@/data/seed'

const DEFAULT_IMAGE = img('1486718448742-163732cd1544', 2000)

/**
 * Inner-page hero banner with parallax image, breadcrumb and reveal text.
 */
export default function PageHeader({ eyebrow, title, description, image, breadcrumb }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[360px] items-end overflow-hidden pb-10 pt-32 md:min-h-[52vh] md:pb-14"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0 -bottom-24">
        <LazyImage src={image || DEFAULT_IMAGE} alt={title} className="h-full w-full" eager />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_top,#0E0E0E_2%,rgba(14,14,14,0.72)_45%,rgba(14,14,14,0.55)_100%)]" />
      <div className="pattern-grid absolute inset-0 opacity-60" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-luxe relative">
        {eyebrow && (
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          <h1 className="heading-lg mt-4 max-w-4xl text-balance">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={0.2}>
            <p className="lead mt-5 max-w-2xl">{description}</p>
          </Reveal>
        )}
        <Reveal delay={0.3}>
          <nav aria-label="Breadcrumb" className="mt-7 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/50">
            <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-bronze-light">
              <IoHomeOutline /> Home
            </Link>
            <IoChevronForward className="text-bronze/70" />
            <span className="text-bronze-light">{breadcrumb || title}</span>
          </nav>
        </Reveal>
      </div>
    </section>
  )
}
