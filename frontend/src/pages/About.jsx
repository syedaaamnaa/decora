import { motion } from 'framer-motion'
import Seo from '@/components/ui/Seo'
import Page from '@/components/ui/Page'
import PageHeader from '@/components/ui/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import LazyImage from '@/components/ui/LazyImage'
import Counter from '@/components/ui/Counter'
import CTA from '@/components/sections/CTA'
import {
  img,
  COMPANY_ABOUT,
  COMPANY_STORY,
  MISSION,
  VISION,
  VALUES,
  TEAM,
  ACHIEVEMENTS,
} from '@/data/seed'

const PILAR_CARDS = [
  { label: 'Our Mission', text: MISSION },
  { label: 'Our Vision', text: VISION },
]

export default function About() {
  return (
    <>
      <Seo
        title="About DECORA"
        description="From a two-person crew in 2015 to 150+ projects across 20+ cities — the story, principles and people behind DECORA Civil & Interiors."
      />
      <Page>
        <PageHeader
          eyebrow="Who We Are"
          title="About DECORA"
          description={COMPANY_ABOUT}
          image={img('1504307651254-35680f356dfd', 2000)}
          breadcrumb="About"
        />

        {/* ------------------------------ COMPANY STORY ------------------------------ */}
        <section className="section">
          <div className="container-luxe">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
              {/* Image collage */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="glass p-2">
                    <LazyImage
                      src={img('1590725140246-20acdee442be')}
                      alt="Craftsmanship on a DECORA site"
                      className="aspect-[4/5] w-full"
                    />
                  </div>
                  <div className="glass relative z-10 -mt-16 ml-auto w-[64%] p-2 sm:-mt-20">
                    <LazyImage
                      src={img('1486406146926-c627a92ad1ab')}
                      alt="A DECORA commercial build"
                      className="aspect-[4/3] w-full"
                    />
                  </div>
                  <div className="glass animate-float absolute bottom-4 left-0 z-20 px-5 py-4">
                    <p className="font-display text-2xl text-bronze-light">10+ Years</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
                      of Excellence
                    </p>
                  </div>
                </div>
              </div>

              {/* Story + timeline */}
              <div>
                <SectionHeading
                  eyebrow="Our Story"
                  title="A decade of building with intent."
                />
                <div className="space-y-5">
                  <p className="lead">
                    DECORA began in 2015 with a two-person crew and a simple conviction — that a
                    building is only as good as the people who care about it. Ten years on, that
                    conviction still runs the company: engineers, designers, project managers and
                    craftsmen work under one roof, so nothing important is ever handed off to
                    chance.
                  </p>
                  <p className="lead">
                    We keep execution in-house wherever it matters most — surveying, shuttering,
                    joinery, glazing and finishing — because quality is hardest to control once it
                    is outsourced. Every site runs on documented QA/QC checklists, weekly
                    accountability and the same detailing standard we would accept in our own
                    homes.
                  </p>
                </div>

                <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
                  Milestones
                </p>

                {/* Vertical timeline */}
                <div className="relative mt-7">
                  <span
                    aria-hidden="true"
                    className="absolute left-[7px] top-2 bottom-0 w-px bg-gradient-to-b from-bronze to-transparent"
                  />
                  <div className="space-y-8">
                    {COMPANY_STORY.map((item, i) => (
                      <Reveal key={item.year} delay={i * 0.07}>
                        <div className="relative pl-9">
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-bronze bg-ink"
                          />
                          <span className="font-display text-2xl text-bronze-light">
                            {item.year}
                          </span>
                          <h3 className="mt-1 font-display text-xl font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------- MISSION / VISION / VALUES ---------------------- */}
        <section className="section relative overflow-hidden bg-night">
          <div className="pattern-grid absolute inset-0 opacity-60" />
          <div className="container-luxe relative">
            <SectionHeading
              eyebrow="What Guides Us"
              title="Mission, vision and the values behind both."
              description="Two promises we hold ourselves to, and the four principles that decide how we keep them."
            />

            <div className="grid gap-6 md:grid-cols-2">
              {PILAR_CARDS.map((card, i) => (
                <Reveal key={card.label} delay={i * 0.1}>
                  <article className="glass h-full p-8 md:p-10">
                    <span className="eyebrow">{card.label}</span>
                    <div className="hairline my-7" />
                    <p className="heading-md text-balance">{card.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value, i) => (
                <Reveal key={value.title} delay={i * 0.07}>
                  <article className="glass glass-hover h-full p-6">
                    <span
                      className="font-display text-5xl leading-none text-transparent"
                      style={{ WebkitTextStroke: '1px rgba(176, 141, 87, 0.8)' }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-white">
                      {value.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{value.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------- TEAM ---------------------------------- */}
        <section className="section">
          <div className="container-luxe">
            <SectionHeading
              align="center"
              eyebrow="The People"
              title="Minds behind the craft."
              description="Designers, engineers and project managers who obsess over the details no one else sees."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} delay={(i % 3) * 0.08}>
                  <motion.article
                    initial="idle"
                    whileHover="hover"
                    className="group glass h-full overflow-hidden"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <LazyImage
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full"
                        zoom
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(14,14,14,0.85),rgba(14,14,14,0.2)_55%,transparent)] transition-opacity duration-500 group-hover:opacity-60" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl font-semibold text-white">
                        {member.name}
                      </h3>
                      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-bronze-light">
                        {member.role}
                      </p>
                      <motion.span
                        variants={{ idle: { width: '44px' }, hover: { width: '112px' } }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-4 block h-px bg-gradient-to-r from-bronze to-transparent"
                      />
                      <p className="mt-4 text-sm leading-relaxed text-muted">{member.bio}</p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ ACHIEVEMENTS ------------------------------- */}
        <section className="relative overflow-hidden py-20 md:py-24">
          <div className="absolute inset-0 opacity-35">
            <LazyImage
              src={img('1486718448742-163732cd1544', 2000)}
              alt=""
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 bg-ink/85" />
          <div className="pattern-grid absolute inset-0 opacity-60" />

          <div className="container-luxe relative">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
              {ACHIEVEMENTS.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={i * 0.08}
                  className="glass relative px-5 py-9 text-center"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent ${
                      i === 0 ? 'hidden' : i % 2 === 1 ? 'block' : 'hidden md:block'
                    }`}
                  />
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-5xl text-gradient md:text-6xl"
                  />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                    {stat.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </Page>
    </>
  )
}
