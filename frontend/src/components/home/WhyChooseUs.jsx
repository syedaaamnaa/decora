import { FiAward, FiClock, FiCompass, FiDollarSign, FiSmile, FiUsers } from 'react-icons/fi'
import { IoArrowForward as IoArrow } from 'react-icons/io5'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import { useInquiry } from '@/context/InquiryProvider'
import { WHY_CHOOSE_US } from '@/data/seed'

const ICONS = {
  quality: FiAward,
  team: FiUsers,
  time: FiClock,
  value: FiDollarSign,
  design: FiCompass,
  satisfaction: FiSmile,
}

/** Why choose us — sticky intro + icon cards. */
export default function WhyChooseUs() {
  const { openInquiry } = useInquiry()

  return (
    <section className="section relative overflow-hidden bg-night">
      <div className="pattern-grid absolute inset-0 opacity-40" />
      <div className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-bronze/[0.06] blur-[130px]" />

      <div className="container-luxe relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Why Choose Us"
            title={
              <>
                The DECORA <em className="font-normal not-italic text-gradient">difference.</em>
              </>
            }
            description="We are not the cheapest quote you will get — we are the last one you will need."
          />
          <Reveal delay={0.3}>
            <button type="button" onClick={() => openInquiry()} className="btn btn-primary group">
              Start a Conversation
              <IoArrow className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </button>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {WHY_CHOOSE_US.map((item, index) => {
            const Icon = ICONS[item.icon] || FiAward
            return (
              <Reveal key={item.title} delay={index * 0.09}>
                <div className="glass glass-hover group relative h-full overflow-hidden p-7">
                  <div className="absolute inset-x-6 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-bronze to-transparent transition-transform duration-700 group-hover:scale-x-100" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-sm border border-bronze/30 bg-bronze/10 text-bronze-light transition-all duration-500 group-hover:shadow-glow">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
