import { Link } from 'react-router-dom'
import Seo from '@/components/ui/Seo'
import Page from '@/components/ui/Page'
import Reveal from '@/components/ui/Reveal'
import { LogoMark } from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" />
      <Page>
        <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-ink py-28 text-center">
          {/* Background layers */}
          <div className="pattern-grid absolute inset-0 opacity-60" />
          <div className="pattern-dots absolute inset-0 opacity-25" />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/15 blur-[130px]"
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

          {/* Floating brand mark */}
          <div
            aria-hidden="true"
            className="glass animate-float absolute left-[10%] top-[16%] hidden h-24 w-24 items-center justify-center md:flex"
          >
            <LogoMark className="h-12 w-12 rotate-[12deg]" />
          </div>

          <div className="container-tight relative">
            <Reveal>
              <p className="font-display text-display-xl font-semibold text-gradient select-none">
                404
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <span className="eyebrow eyebrow-center mt-4">Lost in the blueprints</span>
            </Reveal>

            <Reveal delay={0.18}>
              <h1 className="heading-lg mx-auto mt-6 max-w-3xl text-balance">
                This page is still under construction.
              </h1>
            </Reveal>

            <Reveal delay={0.26}>
              <p className="lead mx-auto mt-5 max-w-xl">
                The page you are looking for has moved, been renamed, or was never poured. Let’s
                get you back to solid ground.
              </p>
            </Reveal>

            <Reveal delay={0.34}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/" className="btn btn-primary btn-lg">
                  Back Home
                </Link>
                <Link to="/projects" className="btn btn-outline btn-lg">
                  View Projects
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </Page>
    </>
  )
}
