import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoLocationOutline, IoCalendarOutline, IoResizeOutline, IoArrowForward } from 'react-icons/io5'
import Modal from '@/components/ui/Modal'
import LazyImage from '@/components/ui/LazyImage'
import { useInquiry } from '@/context/InquiryProvider'

/**
 * Project details popup — opened from project cards.
 */
export default function ProjectModal({ project, onClose }) {
  const { openInquiry } = useInquiry()

  return (
    <Modal open={!!project} onClose={onClose} size="xl" label="Project details">
      {project && (
        <div>
          <div className="group relative h-56 w-full overflow-hidden sm:h-72">
            <LazyImage src={project.cover} alt={project.title} className="h-full w-full" eager />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6">
              <span className="inline-block border border-bronze/50 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-bronze-light backdrop-blur-md">
                {project.category}
              </span>
              <h3 className="heading-md mt-3 text-3xl sm:text-4xl">{project.title}</h3>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-9 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="lead text-[15px]">{project.description}</p>

              <div className="mt-7">
                <h4 className="field-label">Scope of Work</h4>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {(project.scope || []).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {project.testimonial?.quote && (
                <blockquote className="mt-7 border-l-2 border-bronze/60 bg-white/[0.04] p-5">
                  <p className="font-display text-lg italic leading-relaxed text-white/90">
                    “{project.testimonial.quote}”
                  </p>
                  <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-bronze-light">
                    — {project.testimonial.author}, {project.testimonial.role}
                  </footer>
                </blockquote>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/projects/${project.slug}`}
                  onClick={onClose}
                  className="btn btn-primary btn-sm"
                >
                  Full Case Study <IoArrowForward />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    openInquiry(project.title)
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Build Something Like This
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                <Meta icon={<IoLocationOutline />} label="Location" value={project.location} />
                <Meta icon={<IoCalendarOutline />} label="Completed" value={project.completedAt || String(project.year)} />
                <Meta icon={<IoResizeOutline />} label="Area" value={project.area} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(project.images || []).slice(0, 3).map((image, i) => (
                  <motion.div
                    key={image + i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="aspect-square overflow-hidden"
                  >
                    <LazyImage src={image} alt={`${project.title} — ${i + 1}`} className="h-full w-full" zoom />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Meta({ icon, label, value }) {
  return (
    <div className="glass flex items-center gap-3 p-3.5">
      <span className="text-bronze">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">{label}</p>
        <p className="text-sm font-medium text-white/90">{value}</p>
      </div>
    </div>
  )
}
