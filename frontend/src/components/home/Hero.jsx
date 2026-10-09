import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Autoplay, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'
import 'swiper/css'
import 'swiper/css/effect-fade'

import { apiList } from '@/lib/api'
import { HERO_SLIDES, SITE } from '@/data/seed'

function HeroBackground({ slide, eager }) {
  const [failed, setFailed] = useState(false)

  if (!slide.image || failed) return null

  return (
    <img
      src={slide.image}
      alt=""
      aria-hidden="true"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

function Heading({ heading, highlightText }) {
  if (!highlightText || !heading.includes(highlightText)) return heading

  const [before, after] = heading.split(highlightText)
  return (
    <>
      {before}
      <span className="text-gradient">{highlightText}</span>
      {after}
    </>
  )
}

function slideKey(slide) {
  return slide._id || slide.id || `${slide.order}-${slide.name}`
}

export default function Hero() {
  const [slides, setSlides] = useState(HERO_SLIDES)
  const [active, setActive] = useState(0)
  const swiperRef = useRef(null)
  const reducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    let alive = true
    apiList('/hero-slides', HERO_SLIDES).then((data) => {
      if (!alive) return
      const visibleSlides = data
        .filter((slide) => slide.active !== false && slide.heading && slide.description)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setSlides(visibleSlides.length ? visibleSlides : HERO_SLIDES)
      setActive(0)
    })
    return () => {
      alive = false
    }
  }, [])

  const hasMultipleSlides = slides.length > 1
  const currentSlide = slides[active] || HERO_SLIDES[0]
  const overlayOpacity = Math.min(0.9, Math.max(0.2, Number(currentSlide.overlayOpacity ?? 58) / 100))

  const pauseAutoplay = () => {
    swiperRef.current?.autoplay?.stop()
  }
  const resumeAutoplay = () => {
    if (!reducedMotion) swiperRef.current?.autoplay?.start()
  }

  return (
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink sm:min-h-[640px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="DECORA featured services"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocusCapture={pauseAutoplay}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) resumeAutoplay()
      }}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={reducedMotion ? 0 : 1100}
        autoplay={
          hasMultipleSlides && !reducedMotion
            ? { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        loop={hasMultipleSlides}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="h-full w-full"
        style={{ position: 'absolute', inset: 0 }}
        a11y={{ enabled: true }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slideKey(slide)} className="relative overflow-hidden bg-[#111]">
            <HeroBackground slide={slide} eager={index === 0} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(90deg, rgba(10,10,10,${overlayOpacity}) 0%, rgba(10,10,10,${overlayOpacity * 0.72}) 52%, rgba(10,10,10,${overlayOpacity * 0.6}) 100%), linear-gradient(0deg, rgba(10,10,10,${Math.min(0.92, overlayOpacity + 0.18)}), transparent 65%)`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_48%,rgba(176,141,87,0.13),transparent_58%)]" />
      <div className="pattern-grid pointer-events-none absolute inset-0 z-[1] opacity-30" />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center sm:px-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideKey(currentSlide)}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl border border-white/10 bg-black/20 px-5 py-9 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-[2px] sm:px-10 sm:py-12 lg:px-16 lg:py-14"
          >
            <p className="eyebrow eyebrow-center text-[10px] sm:text-xs">{currentSlide.name}</p>
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.7rem,7.2vw,6.7rem)] font-medium leading-[0.98] tracking-[-0.025em] text-[#F8F5EF]">
              <Heading heading={currentSlide.heading} highlightText={currentSlide.highlightText} />
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-sm font-light leading-relaxed text-white/75 sm:mt-7 sm:text-base md:text-lg">
              {currentSlide.description}
            </p>
            {currentSlide.buttonText && currentSlide.buttonLink ? (
              <a
                href={currentSlide.buttonLink}
                target={currentSlide.buttonLink.startsWith('http') ? '_blank' : undefined}
                rel={currentSlide.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn btn-primary group pointer-events-auto mt-8 min-w-48"
              >
                {currentSlide.buttonText}
                <IoArrowForward className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </a>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasMultipleSlides ? (
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-5 sm:bottom-8">
          <div className="flex items-center gap-2 border border-white/10 bg-black/35 p-1.5 backdrop-blur-xl sm:gap-3 sm:p-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous hero slide"
              className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-bronze-light focus-visible:text-bronze-light"
            >
              <IoArrowBack size={17} />
            </button>
            <div className="flex items-center gap-1.5" aria-label="Choose hero slide">
              {slides.map((slide, index) => (
                <button
                  key={slideKey(slide)}
                  type="button"
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.name}`}
                  aria-pressed={active === index}
                  className="flex h-9 min-w-8 items-center justify-center px-1"
                >
                  <span
                    className={`h-1 transition-all duration-500 ${
                      active === index
                        ? 'w-7 bg-gradient-to-r from-bronze to-gold'
                        : 'w-2 bg-white/35 hover:bg-white/70'
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
              <IoArrowForward size={17} />
            </button>
          </div>
          <span className="sr-only" aria-live="polite">
            {currentSlide.name}, slide {active + 1} of {slides.length}
          </span>
        </div>
      ) : (
        <span className="sr-only">{SITE.fullName}</span>
      )}
    </section>
  )
}
