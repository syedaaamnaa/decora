import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoArrowForward } from 'react-icons/io5'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import { apiList } from '@/lib/api'
import { PROJECTS } from '@/data/seed'
import { useContent } from '@/context/ContentProvider'

/** Luxury featured project mosaic with details popup. */
export default function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const { content } = useContent()
  const heading = content.home?.projectsHeading || {}

  useEffect(() => {
    let alive = true
    apiList('/projects', PROJECTS).then((list) => {
      if (!alive || !Array.isArray(list)) return
      const featured = list.filter((p) => p.featured)
      setProjects((featured.length >= 3 ? featured : list).slice(0, 5))
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="section relative overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(176,141,87,0.08),transparent_55%)]" />

      <div className="container-luxe relative">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={
              <>
                {heading.title}{' '}
                {heading.titleHighlight ? (
                  <em className="font-normal not-italic text-gradient">{heading.titleHighlight}</em>
                ) : null}
              </>
            }
            description={heading.description}
            className="mb-0"
          />
          <Link to={heading.ctaLink || '/projects'} className="btn btn-outline btn-sm group mb-14 md:mb-0">
            {heading.ctaLabel || 'View All Projects'}
            <IoArrowForward className="transition-transform duration-500 group-hover:translate-x-1.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug || project._id || project.title}
              project={project}
              index={index}
              featured={index === 0}
              onOpen={setSelected}
            />
          ))}

          {projects.length === 0 && (
            <div className="col-span-full glass p-12 text-center text-muted">
              Loading projects…
            </div>
          )}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center md:hidden">
            <Link to={heading.ctaLink || '/projects'} className="btn btn-outline">
              {heading.ctaLabel || 'View All Projects'} <IoArrowForward />
            </Link>
          </div>
        </Reveal>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
