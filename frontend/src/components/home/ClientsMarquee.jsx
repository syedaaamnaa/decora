import { useEffect, useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import { apiList } from '@/lib/api'
import { CLIENTS } from '@/data/seed'

function Chip({ client }) {
  const initials = client.name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')

  return (
    <div className="glass mr-6 flex shrink-0 items-center gap-4 px-7 py-4 transition-all duration-500 hover:border-bronze/50 hover:shadow-glow">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-bronze/40 bg-bronze/10 font-display text-sm font-semibold tracking-wider text-bronze-light">
        {initials}
      </span>
      <span className="leading-none">
        <span className="block whitespace-nowrap font-display text-lg font-semibold text-white/85">
          {client.name}
        </span>
        <span className="mt-1 block whitespace-nowrap text-[9.5px] uppercase tracking-[0.26em] text-white/60">
          {client.industry}
        </span>
      </span>
    </div>
  )
}

/** Infinite client logo/name marquee. */
export default function ClientsMarquee() {
  const [clients, setClients] = useState(CLIENTS)

  useEffect(() => {
    let alive = true
    apiList('/clients', CLIENTS).then((list) => {
      if (alive && Array.isArray(list) && list.length) setClients(list)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-night py-14">
      <div className="container-luxe mb-9 flex flex-col items-center gap-3 text-center">
        <Reveal>
          <span className="eyebrow eyebrow-center">Trusted Clients</span>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-sm text-muted">Brands, builders and families who chose to build with us.</p>
        </Reveal>
      </div>

      <div className="mask-fade-x">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {clients.map((client, i) => (
            <Chip key={`${client.name}-${i}`} client={client} />
          ))}
          {clients.map((client, i) => (
            <Chip key={`${client.name}-dup-${i}`} client={client} />
          ))}
        </div>
      </div>

      <div className="mask-fade-x mt-6">
        <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused] [animation-direction:reverse]">
          {[...clients].reverse().map((client, i) => (
            <Chip key={`${client.name}-rev-${i}`} client={client} />
          ))}
          {[...clients].reverse().map((client, i) => (
            <Chip key={`${client.name}-rev-dup-${i}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  )
}
