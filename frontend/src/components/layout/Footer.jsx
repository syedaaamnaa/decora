import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoYoutube,
  IoMailOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoCallOutline,
} from 'react-icons/io5'
import Logo from '@/components/ui/Logo'
import Reveal from '@/components/ui/Reveal'
import { FOOTER_SERVICES, NAV_LINKS, SITE } from '@/data/seed'

const SOCIALS = [
  { icon: IoLogoInstagram, href: SITE.social.instagram, label: 'Instagram' },
  { icon: IoLogoLinkedin, href: SITE.social.linkedin, label: 'LinkedIn' },
  { icon: IoLogoFacebook, href: SITE.social.facebook, label: 'Facebook' },
  { icon: IoLogoYoutube, href: SITE.social.youtube, label: 'YouTube' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 bg-night">
      {/* Location map strip */}
      <div className="relative h-52 w-full overflow-hidden md:h-72">
        <iframe
          title="DECORA location map"
          src={SITE.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.85)_brightness(0.95)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-night" />
        <div className="pointer-events-none absolute bottom-5 left-5 right-5 sm:right-auto">
          <div className="glass max-w-md p-5">
            <p className="eyebrow">Visit Our Studio</p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{SITE.address}</p>
          </div>
        </div>
      </div>

      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <Reveal className="lg:col-span-1">
          <Link to="/">
            <Logo />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {SITE.fullName} delivers premium civil construction, interiors and modern building
            solutions — crafted with precision, delivered with trust.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -4 }}
                className="flex h-10 w-10 items-center justify-center border border-white/12 bg-white/[0.05] text-white/70 transition-colors duration-300 hover:border-bronze/60 hover:text-bronze-light"
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>
        </Reveal>

        {/* Quick links */}
        <Reveal delay={0.08}>
          <h3 className="field-label mb-6 text-bronze-light">Quick Links</h3>
          <ul className="space-y-3.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-bronze-light"
                >
                  <span className="h-px w-0 bg-bronze transition-all duration-500 group-hover:w-5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Services */}
        <Reveal delay={0.16}>
          <h3 className="field-label mb-6 text-bronze-light">Our Services</h3>
          <ul className="space-y-3.5">
            {FOOTER_SERVICES.map((service) => (
              <li key={service}>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-bronze-light"
                >
                  <span className="h-px w-0 bg-bronze transition-all duration-500 group-hover:w-5" />
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Contact */}
        <Reveal delay={0.24}>
          <h3 className="field-label mb-6 text-bronze-light">Contact</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <IoLocationOutline className="mt-0.5 shrink-0 text-bronze" size={16} />
              <span className="leading-relaxed">{SITE.address}</span>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 transition-colors hover:text-bronze-light"
              >
                <IoCallOutline className="text-bronze" size={16} />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-bronze-light"
              >
                <IoMailOutline className="text-bronze" size={16} />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <IoTimeOutline className="mt-0.5 shrink-0 text-bronze" size={16} />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="hairline mx-auto max-w-[1440px]" />

      <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
        <p>
          © {year} {SITE.fullName}. All rights reserved.
        </p>
        <p className="flex items-center gap-4">
          <span className="hidden sm:inline">Building Excellence. Designing Experiences.</span>
          <a href="#top" className="transition-colors hover:text-bronze-light">
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  )
}
