import { useEffect, useState } from 'react'
import Seo from '@/components/ui/Seo'
import Page from '@/components/ui/Page'
import PageHeader from '@/components/ui/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import LazyImage from '@/components/ui/LazyImage'
import CTA from '@/components/sections/CTA'
import { motion } from 'framer-motion'
import {
  FiLayers,
  FiLayout,
  FiAperture,
  FiTool,
  FiBriefcase,
  FiHome,
  FiShield,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { useInquiry } from '@/context/InquiryProvider'
import { apiList } from '@/lib/api'
import {
  img,
  SITE,
  SERVICES,
  PRODUCTS,
  PRODUCT_CATEGORIES,
} from '@/data/seed'

const SERVICE_ICONS = {
  civil: FiLayers,
  interior: FiLayout,
  glass: FiAperture,
  renovation: FiTool,
  commercial: FiBriefcase,
  residential: FiHome,
}

const FALLBACK_PRODUCT_IMAGE = img('1497215728101-856f4ea42174')

const TRUST_NOTES = [
  {
    icon: FiShield,
    title: 'Quality-certified sourcing',
    text: 'Materials pulled only from approved mills, brands and fabricators — with test certificates on file.',
  },
  {
    icon: FiTrendingUp,
    title: 'Bulk supply for builders',
    text: 'Trade pricing and consistent volumes for contractors, developers and fit-out teams.',
  },
  {
    icon: FiClock,
    title: 'Site delivery schedules',
    text: 'Dispatch planned against your programme, so the right stock lands on the right day.',
  },
]

export default function Products() {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [cat, setCat] = useState('All')
  const { openInquiry } = useInquiry()

  useEffect(() => {
    let alive = true
    apiList('/products', PRODUCTS).then((data) => {
      if (alive) {
        setItems(data)
        setLoaded(true)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const filtered = cat === 'All' ? items : items.filter((p) => p.category === cat)

  return (
    <>
      <Seo
        title="Products & Services"
        description="Civil works, interiors, aluminum & glass, renovations and a curated catalogue of building materials and finished systems — sourced, fabricated and installed by DECORA."
      />
      <Page>
        <PageHeader
          eyebrow="What We Offer"
          title="Products & Services"
          description="From civil works to finished interiors — a single source for materials, systems and turnkey solutions."
          image={img('1497215728101-856f4ea42174', 2000)}
          breadcrumb="Products & Services"
        />

        {/* -------------------------------- SERVICES -------------------------------- */}
        <section className="section">
          <div className="container-luxe">
            <SectionHeading
              eyebrow="Services"
              title="Ways we build."
              description="Six disciplines, one accountable team — take a single service or hand us the whole project."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service, i) => {
                const Icon = SERVICE_ICONS[service.icon] || FiLayers
                return (
                  <Reveal key={service.slug || service.title} delay={(i % 3) * 0.08}>
                    <article className="group glass glass-hover card-luxe flex h-full flex-col p-7">
                      <span className="flex h-14 w-14 items-center justify-center border border-bronze/25 bg-bronze/10 text-bronze-light transition-all duration-500 group-hover:border-bronze/50 group-hover:shadow-glow">
                        <Icon className="text-2xl" aria-hidden="true" />
                      </span>
                      <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {(service.features || []).map((feature) => (
                          <li
                            key={feature}
                            className="border border-bronze/20 bg-bronze/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze-light"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------ PRODUCT CATALOG ---------------------------- */}
        <section className="section relative overflow-hidden bg-night">
          <div className="pattern-grid absolute inset-0 opacity-60" />
          <div className="container-luxe relative">
            <SectionHeading
              eyebrow="Catalogue"
              title="Products & materials."
              description="Specify from our standard range, or ask us to source and fabricate to your drawing."
            />

            {/* Category filter pills */}
            <div className="-mx-5 mb-10 overflow-x-auto no-scrollbar px-5 sm:mx-0 sm:overflow-visible sm:px-0">
              <div
                role="group"
                aria-label="Filter products by category"
                className="flex w-max flex-wrap gap-2.5 sm:w-auto"
              >
                {PRODUCT_CATEGORIES.map((category) => {
                  const active = category === cat
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setCat(category)}
                      aria-pressed={active}
                      className={`relative overflow-hidden rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-500 ${
                        active
                          ? 'border-bronze/60 text-[#141414] shadow-glow'
                          : 'border-white/10 bg-white/[0.05] text-white/70 hover:border-bronze/40 hover:text-bronze-light'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="product-pill"
                          className="absolute inset-0 bg-[linear-gradient(135deg,#B08D57_0%,#C8A66B_50%,#B08D57_100%)]"
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <span className="relative">{category}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Product grid */}
            {!loaded ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-[420px] animate-shimmer border border-white/10 bg-[linear-gradient(100deg,#141414_30%,#1f1c17_50%,#141414_70%)] bg-[length:200%_100%]"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass px-6 py-14 text-center">
                <p className="lead mx-auto max-w-md">
                  This category is being updated — tell us what you need and we will source it.
                </p>
                <button
                  type="button"
                  onClick={() => openInquiry()}
                  className="btn btn-outline btn-sm mt-6"
                >
                  Request a Product
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product, i) => (
                  <Reveal key={product.slug || product.title} delay={(i % 3) * 0.08}>
                    <article className="group glass card-luxe flex h-full flex-col overflow-hidden">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <LazyImage
                          src={product.image || FALLBACK_PRODUCT_IMAGE}
                          alt={product.title}
                          className="h-full w-full"
                          zoom
                        />
                        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
                          {product.category || 'Products'}
                        </span>
                        <span className="absolute right-3 top-3 rounded-full border border-bronze/40 bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze-light backdrop-blur-md">
                          {product.price || 'On request'}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-2xl font-semibold text-white">
                          {product.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                          {product.description}
                        </p>

                        <ul className="mt-4 space-y-2">
                          {(product.features || []).slice(0, 2).map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60"
                            >
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto flex gap-3 pt-6">
                          <button
                            type="button"
                            onClick={() => openInquiry(product.title)}
                            className="btn btn-primary btn-sm flex-1"
                          >
                            Enquire
                            <FiArrowRight aria-hidden="true" />
                          </button>
                          <a
                            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                              'Hi DECORA! I am interested in "' +
                                product.title +
                                '". Please share details.',
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`WhatsApp us about ${product.title}`}
                            className="btn btn-dark btn-sm px-4"
                          >
                            <IoLogoWhatsapp aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------ TRUST BAND -------------------------------- */}
        <section className="pb-20 md:pb-28 lg:pb-32">
          <div className="container-luxe">
            <Reveal>
              <div className="glass grid divide-y divide-white/10 overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {TRUST_NOTES.map((note) => {
                  const Icon = note.icon
                  return (
                    <div key={note.title} className="p-7 md:p-8">
                      <span className="flex h-11 w-11 items-center justify-center border border-bronze/25 bg-bronze/10 text-bronze-light">
                        <Icon className="text-lg" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold text-white">
                        {note.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{note.text}</p>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <CTA
          eyebrow="Need a custom solution?"
          title="Tell us what you need — we source, fabricate and install."
          text="Non-standard sizes, bespoke finishes or bulk quantities: share the specification and we will build a custom quote around it."
        />
      </Page>
    </>
  )
}
