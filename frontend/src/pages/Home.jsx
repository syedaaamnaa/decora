import Page from '@/components/ui/Page'
import Seo from '@/components/ui/Seo'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import AboutPreview from '@/components/home/AboutPreview'
import Services from '@/components/home/Services'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import ClientsMarquee from '@/components/home/ClientsMarquee'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <Page>
      <Seo
        description="DECORA Civil & Interiors — premium civil construction, interior design, aluminum & glass solutions, renovations and modern building solutions for modern living."
      />
      <Hero />
      <Stats />
      <AboutPreview />
      <Services />
      <FeaturedProjects />
      <WhyChooseUs />
      <Testimonials />
      <ClientsMarquee />
      <CTA />
    </Page>
  )
}
