import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoCheckmarkDone, IoArrowForward } from 'react-icons/io5'
import Reveal from '@/components/ui/Reveal'
import LazyImage from '@/components/ui/LazyImage'
import { COMPANY_ABOUT, img } from '@/data/seed'

gsap.registerPlugin(ScrollTrigger)

const HIGHLIGHTS = [
  'In-house engineering, design & execution teams',
  '150+ projects delivered across 20+ cities',
  'Single-point accountability from drawing to handover',
]

/** Home "Who We Are" split preview with GSAP parallax imagery. */
export default function AboutPreview() {
  const sectionRef = useRef(null)
  const parallaxRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parallaxRef.current,
        { y: -50 },
        {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about-preview" ref={sectionRef} className="section relative overflow-hidden bg-ink">
      <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-bronze/[0.07] blur-[120px]" />

      <div className="container-luxe relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Visual */}
        <div className="relative">
          <div className="glass relative overflow-hidden p-2">
            <div ref={parallaxRef} className="will-change-transform">
              <LazyImage
                src={img('1590725140246-20acdee442be', 1400)}
                alt="DECORA construction site"
                className="aspect-[4/5] w-full"
              />
            </div>
          </div>

          <div className="absolute -bottom-8 -right-2 hidden w-48 border-4 border-ink shadow-glass-lg sm:block lg:-right-8 lg:w-56">
            <LazyImage
              src={img('1486406146926-c627a92ad1ab', 800)}
              alt="Modern glass building"
              className="aspect-square w-full"
            />
          </div>

          <Reveal delay={0.35} className="absolute -left-3 top-8 hidden md:block">
            <div className="glass animate-float px-6 py-5">
              <p className="font-display text-4xl font-semibold text-gradient">10+</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/60">
                Years of Excellence
              </p>
            </div>
          </Reveal>

          <div
            aria-hidden="true"
            className="absolute -left-6 -top-6 hidden h-28 w-28 border border-bronze/40 lg:block"
          />
        </div>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="eyebrow">Who We Are</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-lg mt-5 text-balance">
              Craftsmanship is our language.{' '}
              <em className="font-normal not-italic text-gradient">Precision is our habit.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="lead mt-6">{COMPANY_ABOUT}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              From structural civil work to the last coat of finish, everything is planned,
              engineered and supervised by our own teams — so quality never depends on guesswork.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item, i) => (
              <li key={item}>
                <Reveal
                  delay={0.3 + i * 0.08}
                  className="flex items-start gap-3.5 text-sm text-white/75 md:text-[15px]"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-bronze/40 bg-bronze/10 text-bronze-light">
                    <IoCheckmarkDone size={13} />
                  </span>
                  {item}
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.5}>
            <Link to="/about" className="btn btn-outline group mt-10">
              Read more about DECORA
              <IoArrowForward className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
