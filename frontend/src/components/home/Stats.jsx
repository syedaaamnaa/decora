import Reveal from '@/components/ui/Reveal'
import Counter from '@/components/ui/Counter'
import { STATS } from '@/data/seed'

/** Animated counters in glass cards. */
export default function Stats() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink py-16 md:py-20">
      <div className="pattern-grid absolute inset-0 opacity-70" />
      <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-bronze/10 blur-[110px]" />

      <div className="container-luxe relative">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <div className="glass glass-hover group relative h-full overflow-hidden p-8 text-center md:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 -top-5 select-none font-display text-[6rem] font-semibold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-bronze/10"
                >
                  {index + 1}
                </span>
                <div className="absolute inset-x-8 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-bronze to-transparent transition-transform duration-700 group-hover:scale-x-100" />

                <p className="font-display text-5xl font-semibold text-gradient md:text-6xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
