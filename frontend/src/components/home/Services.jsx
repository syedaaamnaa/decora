import { Link } from 'react-router-dom'
import { FiAperture, FiBriefcase, FiHome, FiLayers, FiLayout, FiTool, FiArrowRight } from 'react-icons/fi'
import SectionHeading from '@/components/ui/SectionHeading'
import { SERVICES } from '@/data/seed'

const ICONS = {
  civil: FiLayers,
  interior: FiLayout,
  glass: FiAperture,
  renovation: FiTool,
  commercial: FiBriefcase,
  residential: FiHome,
}

/** Premium services grid. */
export default function Services() {
  return (
    <section className="section relative overflow-hidden bg-night">
      <div className="pattern-grid absolute inset-0 opacity-50" />
      <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-bronze/[0.06] blur-[130px]" />

      <div className="container-luxe relative">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title={
              <>
                End-to-end solutions,{' '}
                <em className="font-normal not-italic text-gradient">executed flawlessly.</em>
              </>
            }
            description="Six specialised divisions, one standard of quality — coordinated under a single team."
            className="mb-0 max-w-2xl"
          />
          <Link to="/products" className="btn btn-ghost btn-sm hidden md:inline-flex group">
            All Services
            <FiArrowRight className="transition-transform duration-500 group-hover:translate-x-1.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = ICONS[service.icon] || FiLayers
            return (
              <Link
                key={service.slug}
                to="/products"
                className="glass glass-sheen glass-hover group relative overflow-hidden p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-semibold text-white/[0.05] transition-colors duration-500 group-hover:text-bronze/15"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-sm border border-bronze/30 bg-bronze/10 text-bronze-light transition-all duration-500 group-hover:scale-110 group-hover:border-bronze/60 group-hover:bg-bronze/20 group-hover:shadow-glow">
                  <Icon size={24} />
                </span>

                <h3 className="mt-6 font-display text-2xl font-semibold text-white transition-colors duration-500 group-hover:text-bronze-light">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.features?.map((feature) => (
                    <li
                      key={feature}
                      className="border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white/55"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <span className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze/80 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Learn more <FiArrowRight />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 md:hidden">
          <Link to="/products" className="btn btn-ghost w-full group">
            All Services <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
