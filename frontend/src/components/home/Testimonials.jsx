import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { FiStar } from 'react-icons/fi'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import SectionHeading from '@/components/ui/SectionHeading'
import { apiList } from '@/lib/api'
import { TESTIMONIALS } from '@/data/seed'
import 'swiper/css'
import 'swiper/css/pagination'

/** Auto-sliding testimonial carousel in glass cards. */
export default function Testimonials() {
  const [items, setItems] = useState([])
  const [swiper, setSwiper] = useState(null)

  useEffect(() => {
    let alive = true
    apiList('/testimonials', TESTIMONIALS).then((list) => {
      if (alive && Array.isArray(list) && list.length) setItems(list)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="section relative overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(176,141,87,0.1),transparent_60%)]" />
      <div className="pattern-dots absolute inset-0 opacity-25" />

      <div className="container-luxe relative">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Trusted by those we <em className="font-normal not-italic text-gradient">build for.</em>
            </>
          }
          align="center"
        />

        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            onSwiper={setSwiper}
            spaceBetween={24}
            slidesPerView={1}
            loop={items.length > 2}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            speed={800}
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
            className="pb-14"
          >
            {items.map((item) => (
              <SwiperSlide key={item._id || item.name} className="h-auto">
                <figure className="glass group relative flex h-full flex-col justify-between overflow-hidden p-8">
                  <div className="absolute -right-10 -top-10 font-display text-[8rem] leading-none text-bronze/[0.07] transition-colors duration-500 group-hover:text-bronze/[0.12]">
                    ”
                  </div>

                  <div className="relative">
                    <div className="flex gap-1" role="img" aria-label={`${item.rating || 5} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < (item.rating || 5) ? 'fill-gold text-gold' : 'text-white/25'}
                          size={15}
                        />
                      ))}
                    </div>

                    <blockquote className="relative mt-5 text-[15px] leading-relaxed text-white/80">
                      {item.text}
                    </blockquote>
                  </div>

                  <figcaption className="relative mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        loading="lazy"
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-bronze/40"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-bronze/40 bg-bronze/10 font-display text-lg text-bronze-light">
                        {item.name?.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                        {[item.role, item.company].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

          {items.length > 2 && (
            <div className="absolute -top-16 right-0 hidden gap-3 md:flex">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => swiper?.slidePrev()}
                className="glass glass-hover flex h-11 w-11 items-center justify-center text-white/70 hover:text-bronze-light"
              >
                <IoChevronBack size={18} />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => swiper?.slideNext()}
                className="glass glass-hover flex h-11 w-11 items-center justify-center text-white/70 hover:text-bronze-light"
              >
                <IoChevronForward size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet { background: rgba(255,255,255,0.25); opacity: 1; width: 7px; height: 7px; transition: all .4s; }
        .swiper-pagination-bullet-active { background: #C8A66B; width: 26px; border-radius: 4px; }
      `}</style>
    </section>
  )
}
