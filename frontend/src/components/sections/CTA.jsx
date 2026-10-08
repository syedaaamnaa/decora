import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { IoArrowForward, IoSparklesOutline } from 'react-icons/io5'
import Reveal from '@/components/ui/Reveal'
import LazyImage from '@/components/ui/LazyImage'
import { useInquiry } from '@/context/InquiryProvider'
import { img } from '@/data/seed'

const DEFAULT_BG = img('1504307651254-35680f356dfd', 2000)

/**
 * Full-width luxury call-to-action band with parallax background.
 */
export default function CTA({
  eyebrow = 'Ready When You Are',
  title = 'Let’s Build Something Extraordinary Together.',
  text = 'Tell us about your site, your vision and your timeline — we will bring the engineering, design and craftsmanship.',
  image,
  children,
}) {
  const { openInquiry } = useInquiry()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <motion.div style={{ y }} className="absolute inset-0 -top-16">
        <LazyImage src={image || DEFAULT_BG} alt="" className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,14,0.85)_75%,#0E0E0E_100%)]" />
      <div className="pattern-grid absolute inset-0 opacity-50" />

      <div className="container-tight relative text-center">
        <Reveal>
          <span className="eyebrow eyebrow-center">
            <IoSparklesOutline className="mr-1" /> {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="heading-lg mx-auto mt-6 max-w-4xl text-balance">{title}</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="lead mx-auto mt-6 max-w-2xl">{text}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button type="button" onClick={() => openInquiry()} className="btn btn-primary btn-lg group">
              Get Free Consultation
              <IoArrowForward className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </button>
            <Link to="/projects" className="btn btn-dark btn-lg">
              Explore Projects
            </Link>
          </div>
        </Reveal>

        {children}
      </div>
    </section>
  )
}
