import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoLocationOutline, IoArrowForward, IoExpandOutline } from 'react-icons/io5'
import LazyImage from '@/components/ui/LazyImage'

/**
 * Luxury project card — used on Home and Projects pages.
 * Click opens details modal; arrow links to the full case study.
 */
export default function ProjectCard({ project, onOpen, index = 0, featured = false }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className={`group relative cursor-pointer overflow-hidden bg-[#141414] ${
        featured
          ? 'aspect-[4/3] md:col-span-2 md:aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[520px]'
          : 'aspect-[4/3] lg:aspect-[16/11]'
      }`}
      onClick={() => onOpen?.(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.(project)
        }
      }}
    >
      <div className="absolute inset-0">
        <LazyImage src={project.cover || project.images?.[0]} alt={project.title} className="h-full w-full" zoom />
      </div>

      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 border border-white/0 transition-colors duration-500 group-hover:border-bronze/40" />

      {/* category badge */}
      <span className="absolute left-5 top-5 border border-bronze/50 bg-black/40 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.25em] text-bronze-light backdrop-blur-md">
        {project.category}
      </span>

      {/* hover view icon */}
      <span className="absolute right-5 top-5 flex h-10 w-10 translate-y-2 items-center justify-center border border-white/20 bg-black/40 text-white/80 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-bronze/60 group-hover:text-bronze-light">
        <IoExpandOutline size={17} />
      </span>

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="h-px w-10 origin-left scale-x-0 bg-gradient-to-r from-bronze to-gold transition-transform duration-500 group-hover:scale-x-100" />
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.22em] text-white/55">
              <IoLocationOutline className="text-bronze" /> {project.location}
              {project.year ? ` · ${project.year}` : ''}
            </p>
            <h3
              className={`mt-1.5 font-display font-semibold text-white transition-colors duration-500 group-hover:text-bronze-light ${
                featured ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
              }`}
            >
              {project.title}
            </h3>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${project.title} case study`}
            className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full bg-bronze text-[#141414] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:shadow-glow"
          >
            <IoArrowForward size={18} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
