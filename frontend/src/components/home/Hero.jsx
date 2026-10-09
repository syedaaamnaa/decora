import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { IoArrowBack, IoArrowForward, IoChevronDown } from 'react-icons/io5'
import 'swiper/css'
import 'swiper/css/effect-fade'

import { HERO_SLIDES, SITE } from '@/data/seed'

const EASE = [0.22, 1, 0.36, 1]
const LINE_1 = 'Building Excellence.'.split(' ')
const LINE_2 = 'Designing Experiences.'.split(' ')
const TEXT_DELAY = 1.45

function Word({ children, delay, className = '' }) {
  return (
    <span className="mr-[0.26em] inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: '118%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ delay, duration: 1, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/**
 * Full-screen hero — fading image slider, Ken Burns zoom, glass content card
 * with GSAP mouse parallax and staggered word reveal.
 */
export default function Hero() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const swiperRef = useRef(null)

  /* GSAP: content card follows the pointer with a soft luxury drift */
  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const xTo = gsap.quickTo(card, 'x', { duration: 0.9, ease: 'power3' })
    const yTo = gsap.quickTo(card, 'y', { duration: 0.9, ease: 'power3' })

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      xTo(((e.clientX - rect.left) / rect.width - 0.5) * 26)
      yTo(((e.clientY - rect.top) / rect.height - 0.5) * 20)
    }

    section.addEventListener('mousemove', onMove)
    return () => {
      section.removeEventListener('mousemove', onMove)
      gsap.set(card, { x: 0, y: 0 })
    }
  }, [])

  const total = HERO_SLIDES.length

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1400}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="absolute inset-0"
        a11y={{ enabled: true }}
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.image} className="bg-ink">
            <div className={`absolute inset-0 ${index === active ? 'animate-kenburns' : ''}`}>
              <img
                src={slide.image}
                alt={`${SITE.fullName} — ${slide.label}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Grade & overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.55)_45%,rgba(10,10,10,0.35)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#0E0E0E_0%,transparent_35%)]" />
      <div className="pattern-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_45%,rgba(176,141,87,0.16),transparent_55%)]" />

      {/* Floating decor */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{ delay: 2.1, duration: 1.2, ease: EASE }}
        className="absolute right-[8%] top-[22%] hidden h-40 w-40 border border-bronze/40 xl:block"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 8 }}
        transition={{ delay: 2.4, duration: 1.2, ease: EASE }}
        className="absolute right-[14%] top-[30%] hidden h-40 w-40 border border-white/15 xl:block"
      />

      {/* Content */}
      <div className="container-luxe relative z-10 flex h-full items-center pt-20">
        <div ref={cardRef} className="relative max-w-3xl will-change-transform">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: TEXT_DELAY - 0.35, duration: 1, ease: EASE }}
            className="glass-strong relative overflow-hidden p-7 md:p-11"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze to-transparent" />
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-bronze/20 blur-[70px]" />

            <motion.span
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: TEXT_DELAY, duration: 0.8, ease: EASE }}
              className="eyebrow relative"
            >
              {SITE.fullName}
            </motion.span>

            <h1
              className="heading-xl relative mt-5 font-display"
              aria-label="Building Excellence. Designing Experiences."
            >
              <span className="block">
                {LINE_1.map((word, i) => (
                  <Word key={word} delay={TEXT_DELAY + 0.25 + i * 0.09}>
                    {word}
                  </Word>
                ))}
              </span>
              <span className="block italic text-gradient">
                {LINE_2.map((word, i) => (
                  <Word key={word} delay={TEXT_DELAY + 0.55 + i * 0.09}>
                    {word}
                  </Word>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: TEXT_DELAY + 1.1, duration: 0.9, ease: EASE }}
              className="relative mt-6 max-w-xl text-base font-light leading-relaxed text-white/75 md:text-lg"
            >
              {SITE.subTagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: TEXT_DELAY + 1.3, duration: 0.9, ease: EASE }}
              className="relative mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link to="/projects" className="btn btn-primary group">
                Explore Projects
                <IoArrowForward className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>

          {/* floating chip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: TEXT_DELAY + 1.6, duration: 0.9, ease: EASE }}
            className="glass absolute -bottom-12 right-4 hidden animate-float px-6 py-4 md:block"
          >
            <p className="font-display text-3xl font-semibold text-gradient">10+</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Years of Craft</p>
          </motion.div>
        </div>
      </div>

      {/* Bottom control bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TEXT_DELAY + 1.7, duration: 0.9, ease: EASE }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/25 backdrop-blur-md"
      >
        <div className="container-luxe flex min-h-20 items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden sm:gap-5">
            <span className="font-display text-sm text-bronze-light">
              {String(active + 1).padStart(2, '0')}
              <span className="text-white/35"> / {String(total).padStart(2, '0')}</span>
            </span>
            <div className="h-px w-12 shrink-0 overflow-hidden bg-white/15 sm:w-20 md:w-32">
              <motion.div
                key={active}
                className="h-full bg-gradient-to-r from-bronze to-gold"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </div>
            <AnimatePresence mode="wait">
              <span
                key={HERO_SLIDES[active]?.label}
                className="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-white/65 sm:text-[10.5px] sm:tracking-[0.3em]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                {HERO_SLIDES[active]?.label}
              </span>
            </AnimatePresence>
          </div>

          <div className="glass flex shrink-0 items-center gap-1 p-1" aria-label="Hero slides">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous hero slide"
              className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-bronze-light focus-visible:text-bronze-light"
            >
              <IoArrowBack size={15} />
            </button>
            <div className="flex items-center gap-1 px-1">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.label}`}
                  aria-pressed={active === index}
                  className="group flex h-9 items-center justify-center px-1"
                >
                  <span
                    className={`h-1 transition-all duration-500 ${
                      active === index
                        ? 'w-6 bg-gradient-to-r from-bronze to-gold'
                        : 'w-2 bg-white/35 group-hover:bg-white/70'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next hero slide"
              className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-bronze-light focus-visible:text-bronze-light"
            >
              <IoArrowForward size={15} />
            </button>
          </div>

          <a
            href="#about-preview"
            className="hidden flex-1 items-center justify-end gap-3 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-white/55 transition-colors hover:text-bronze-light md:flex"
          >
            Scroll to Explore
            <IoChevronDown className="animate-bounce text-bronze" size={16} />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
