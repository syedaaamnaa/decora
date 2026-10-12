import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IoArrowForward, IoSparklesOutline } from 'react-icons/io5'
import Reveal from '@/components/ui/Reveal'
import LazyImage from '@/components/ui/LazyImage'
import { useInquiry } from '@/context/InquiryProvider'
import { useContent } from '@/context/ContentProvider'

/**
 * Full-width luxury call-to-action band with parallax background.
 * Any prop passed in overrides the dashboard-managed global CTA content.
 */
export default function CTA({ eyebrow, title, text, image, primaryLabel, secondaryLabel, secondaryLink, children }) {
  const { openInquiry } = useInquiry()
  const { content } = useContent()
  const c = content.cta || {}
  const resolved = {
    eyebrow: eyebrow ?? c.eyebrow,
    title: title ?? c.title,
    text: text ?? c.text,
    image: image ?? c.image,
    primaryLabel: primaryLabel ?? c.primaryLabel ?? 'Get Free Consultation',
    secondaryLabel: secondaryLabel ?? c.secondaryLabel ?? 'Explore Projects',
    secondaryLink: secondaryLink ?? c.secondaryLink ?? '/projects',
  }
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <motion.div style={{ y }} className="absolute inset-0 -top-16">
        <LazyImage src={resolved.image} alt="" className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,14,0.85)_75%,#0E0E0E_100%)]" />
      <div className="pattern-grid absolute inset-0 opacity-50" />

      <div className="container-tight relative text-center">
        <Reveal>
          <span className="eyebrow eyebrow-center">
            <IoSparklesOutline className="mr-1" /> {resolved.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="heading-lg mx-auto mt-6 max-w-4xl text-balance">{resolved.title}</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="lead mx-auto mt-6 max-w-2xl">{resolved.text}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button type="button" onClick={() => openInquiry()} className="btn btn-primary btn-lg group">
              {resolved.primaryLabel}
              <IoArrowForward className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </button>
            <Link to={resolved.secondaryLink} className="btn btn-dark btn-lg">
              {resolved.secondaryLabel}
            </Link>
          </div>
        </Reveal>

        {children}
      </div>
    </section>
  )
}
