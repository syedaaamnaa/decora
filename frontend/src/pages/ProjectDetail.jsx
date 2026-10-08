import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IoArrowForward,
  IoCalendarOutline,
  IoLocationOutline,
  IoResizeOutline,
} from 'react-icons/io5'
import Page from '@/components/ui/Page'
import Seo from '@/components/ui/Seo'
import PageHeader from '@/components/ui/PageHeader'
import Loader from '@/components/ui/Loader'
import Reveal from '@/components/ui/Reveal'
import LazyImage from '@/components/ui/LazyImage'
import Modal from '@/components/ui/Modal'
import CTA from '@/components/sections/CTA'
import { apiGet, apiList } from '@/lib/api'
import { PROJECTS } from '@/data/seed'
import { useInquiry } from '@/context/InquiryProvider'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [siblings, setSiblings] = useState(PROJECTS)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(-1)
  const { openInquiry } = useInquiry()

  useEffect(() => {
    let alive = true
    setLoading(true)
    setProject(null)

    Promise.all([apiGet(`/projects/${slug}`, null), apiList('/projects', PROJECTS)]).then(
      ([detail, list]) => {
        if (!alive) return
        const pool = Array.isArray(list) && list.length ? list : PROJECTS
        const found =
          detail ||
          pool.find((p) => p.slug === slug || p._id === slug) ||
          PROJECTS.find((p) => p.slug === slug)
        setProject(found || null)
        setSiblings(pool)
        setLoading(false)
      },
    )

    return () => {
      alive = false
    }
  }, [slug])

  const nav = useMemo(() => {
    const index = siblings.findIndex((p) => p.slug === (project?.slug || slug))
    if (index === -1) return { prev: null, next: null }
    return {
      prev: siblings[(index - 1 + siblings.length) % siblings.length],
      next: siblings[(index + 1) % siblings.length],
    }
  }, [siblings, project, slug])

  const schema = useMemo(
    () =>
      project
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: project.title,
            description: project.description,
            image: project.cover,
            author: { '@type': 'Organization', name: 'DECORA Civil & Interiors' },
          }
        : null,
    [project],
  )

  if (loading) {
    return (
      <Page>
        <div className="flex min-h-screen items-center justify-center">
          <Loader full={false} label="Loading project" />
        </div>
      </Page>
    )
  }

  if (!project) {
    return (
      <Page>
        <Seo title="Project Not Found" />
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-display-lg text-gradient">404</p>
          <h1 className="heading-md mt-4">This project could not be found.</h1>
          <p className="lead mt-3 max-w-md">
            It may have been moved or renamed. Browse all our work instead.
          </p>
          <Link to="/projects" className="btn btn-primary mt-8">
            View All Projects
          </Link>
        </section>
      </Page>
    )
  }

  const facts = [
    { icon: <IoLocationOutline />, label: 'Location', value: project.location },
    { icon: <IoCalendarOutline />, label: 'Year', value: project.completedAt || String(project.year || '—') },
    { icon: <IoResizeOutline />, label: 'Area', value: project.area || '—' },
  ]

  return (
    <Page>
      <Seo
        title={project.title}
        description={project.description?.slice(0, 180)}
        image={project.cover}
        schema={schema}
      />

      <PageHeader
        eyebrow={project.category}
        title={project.title}
        description={project.description}
        image={project.cover}
        breadcrumb={project.title}
      />

      {/* Meta bar */}
      <section className="relative z-10 -mt-8">
        <div className="container-luxe">
          <Reveal>
            <div className="glass grid divide-y divide-white/10 shadow-glass-lg sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-center gap-3.5 border-white/10 p-5 sm:border-r last:sm:border-r-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-bronze/30 bg-bronze/10 text-bronze-light">
                    {fact.icon}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">{fact.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-white/90">{fact.value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3.5 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-bronze/30 bg-bronze/10 text-bronze-light">
                  <IoArrowForward />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Status</p>
                  <p className="mt-0.5 text-sm font-medium">
                    <span
                      className={
                        project.status === 'In Progress'
                          ? 'text-gold'
                          : 'text-emerald-400'
                      }
                    >
                      {project.status || 'Completed'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story + scope */}
      <section className="section bg-ink">
        <div className="container-luxe grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="eyebrow">The Project</span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead mt-6 text-[17px] first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-bronze-light">
                {project.description}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10">
                <h3 className="field-label text-bronze-light">Scope of Work</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(project.scope || []).map((item, i) => (
                    <li key={item} className="glass flex items-center gap-3 p-4 text-sm text-white/75">
                      <span className="font-display text-lg text-bronze">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Gallery */}
            <Reveal delay={0.2}>
              <div className="mt-12">
                <h3 className="field-label text-bronze-light">Gallery</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {(project.images || []).map((image, i) => (
                    <motion.button
                      key={`${image}-${i}`}
                      type="button"
                      onClick={() => setLightbox(i)}
                      aria-label={`View image ${i + 1} of ${project.title}`}
                      whileHover={{ y: -6 }}
                      className={`group relative overflow-hidden ${
                        i === 0 ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-[4/3]'
                      }`}
                    >
                      <LazyImage src={image} alt={`${project.title} — ${i + 1}`} className="h-full w-full" zoom />
                      <span className="absolute inset-0 border border-white/0 transition-colors duration-500 group-hover:border-bronze/50" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Testimonial */}
            {project.testimonial?.quote && (
              <Reveal delay={0.15}>
                <blockquote className="relative mt-12 overflow-hidden border border-bronze/25 bg-bronze/[0.06] p-8 md:p-10">
                  <span className="pointer-events-none absolute -top-4 right-4 font-display text-[7rem] leading-none text-bronze/15">
                    ”
                  </span>
                  <p className="relative font-display text-xl italic leading-relaxed text-white/90 md:text-2xl">
                    “{project.testimonial.quote}”
                  </p>
                  <footer className="relative mt-5 text-[11px] uppercase tracking-[0.24em] text-bronze-light">
                    — {project.testimonial.author}, {project.testimonial.role}
                  </footer>
                </blockquote>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <div className="glass overflow-hidden">
                <div className="border-b border-white/10 bg-white/[0.04] p-6">
                  <h3 className="font-display text-2xl font-semibold">Project Facts</h3>
                </div>
                <dl className="divide-y divide-white/[0.07] text-sm">
                  {[
                    ['Client', project.client || 'Private Client'],
                    ['Category', project.category],
                    ['Location', project.location],
                    ['Area', project.area || '—'],
                    ['Year', project.year || '—'],
                    ['Completed', project.completedAt || '—'],
                    ['Status', project.status || 'Completed'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 px-6 py-3.5">
                      <dt className="text-[10.5px] uppercase tracking-[0.2em] text-white/45">{label}</dt>
                      <dd className="text-right font-medium text-white/85">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="space-y-3 p-6">
                  <button
                    type="button"
                    onClick={() => openInquiry(project.title)}
                    className="btn btn-primary w-full"
                  >
                    Build Something Like This
                  </button>
                  <Link to="/projects" className="btn btn-ghost w-full">
                    Back to Projects
                  </Link>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Prev / next */}
      <section className="border-t border-white/10 bg-night py-10">
        <div className="container-luxe flex flex-col gap-4 sm:flex-row sm:justify-between">
          {nav.prev ? (
            <Link
              to={`/projects/${nav.prev.slug}`}
              className="glass glass-hover group flex-1 p-5 transition-transform duration-500 hover:-translate-y-1"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">← Previous Project</span>
              <p className="mt-2 font-display text-xl text-white transition-colors group-hover:text-bronze-light">
                {nav.prev.title}
              </p>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {nav.next && (
            <Link
              to={`/projects/${nav.next.slug}`}
              className="glass glass-hover group flex-1 p-5 text-right transition-transform duration-500 hover:-translate-y-1"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">Next Project →</span>
              <p className="mt-2 font-display text-xl text-white transition-colors group-hover:text-bronze-light">
                {nav.next.title}
              </p>
            </Link>
          )}
        </div>
      </section>

      <CTA
        eyebrow="Start Your Project"
        title="Impressed? Let’s build yours next."
        text="Tell us about your site and vision — we will bring the engineering, design and craftsmanship."
      />

      {/* Lightbox */}
      <Modal open={lightbox >= 0} onClose={() => setLightbox(-1)} size="full" label="Project image">
        {project.images?.[lightbox] && (
          <div className="bg-black">
            <img
              src={project.images[lightbox]}
              alt={`${project.title} — ${lightbox + 1}`}
              className="max-h-[82vh] w-full object-contain"
            />
            <div className="flex items-center justify-between gap-4 p-5">
              <p className="text-sm text-white/70">
                {project.title} — {lightbox + 1} / {project.images.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLightbox((i) => (i - 1 + project.images.length) % project.images.length)}
                  className="btn btn-dark btn-sm"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox((i) => (i + 1) % project.images.length)}
                  className="btn btn-dark btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Page>
  )
}
