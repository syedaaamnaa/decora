import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '@/components/ui/Page'
import Seo from '@/components/ui/Seo'
import PageHeader from '@/components/ui/PageHeader'
import Loader from '@/components/ui/Loader'
import Reveal from '@/components/ui/Reveal'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import CTA from '@/components/sections/CTA'
import { apiList } from '@/lib/api'
import { PROJECTS, PROJECT_CATEGORIES, img } from '@/data/seed'

const HERO_IMAGE = img('1486718448742-163732cd1544', 2000)

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let alive = true
    apiList('/projects', PROJECTS).then((list) => {
      if (!alive) return
      setProjects(Array.isArray(list) && list.length ? list : PROJECTS)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const counts = useMemo(() => {
    const map = { All: projects.length }
    projects.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1
    })
    return map
  }, [projects])

  const filtered = useMemo(
    () => (category === 'All' ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  )

  return (
    <Page>
      <Seo
        title="Our Projects"
        description="Explore DECORA's portfolio of residential, commercial, interior, civil and renovation projects delivered across 20+ cities."
      />
      <PageHeader
        eyebrow="Our Portfolio"
        title="Our Projects"
        description="Every project is a proof of process — planned precisely, built fearlessly, finished obsessively."
        image={HERO_IMAGE}
        breadcrumb="Projects"
      />

      <section className="section bg-ink">
        <div className="container-luxe">
          {/* Filters */}
          <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center">
            <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
              {PROJECT_CATEGORIES.map((cat) => {
                const active = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`relative shrink-0 border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                      active ? 'border-transparent text-[#141414]' : 'border-white/12 text-white/60 hover:border-bronze/40 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="project-filter-pill"
                        className="absolute inset-0 bg-[linear-gradient(135deg,#B08D57,#C8A66B)] shadow-glow"
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative">
                      {cat}
                      <span className={`ml-2 ${active ? 'text-[#141414]/60' : 'text-white/35'}`}>
                        {counts[cat] ?? 0}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="shrink-0 text-[11px] uppercase tracking-[0.28em] text-white/45">
              Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader full={false} label="Loading projects" />
            </div>
          ) : (
            <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <ProjectCard
                    key={project.slug || project._id || project.title}
                    project={project}
                    index={index}
                    onOpen={setSelected}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="glass mt-10 p-14 text-center">
              <p className="font-display text-2xl text-white/85">No projects in this category yet.</p>
              <p className="mt-2 text-sm text-muted">Try another filter — or tell us what you need built.</p>
              <button type="button" onClick={() => setCategory('All')} className="btn btn-outline btn-sm mt-6">
                Show All
              </button>
            </div>
          )}

          <Reveal delay={0.15}>
            <p className="mt-12 text-center text-sm text-muted">
              Want a deeper look at any project?{' '}
              <button
                type="button"
                className="text-bronze-light underline decoration-bronze/40 underline-offset-4 transition-colors hover:text-gold"
                onClick={() => setSelected(filtered[0] || projects[0])}
              >
                Open a case study
              </button>
            </p>
          </Reveal>
        </div>
      </section>

      <CTA
        eyebrow="Your Project, Next"
        title="Have a site in mind? Let’s make it remarkable."
        text="Share your drawings, plot details or just an idea — we will come back with a clear scope, timeline and budget."
      />

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Page>
  )
}
