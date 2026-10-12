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
import { useContent } from '@/context/ContentProvider'

const SOCIAL_ICONS = [
  { key: 'instagram', icon: IoLogoInstagram, label: 'Instagram' },
  { key: 'linkedin', icon: IoLogoLinkedin, label: 'LinkedIn' },
  { key: 'facebook', icon: IoLogoFacebook, label: 'Facebook' },
  { key: 'youtube', icon: IoLogoYoutube, label: 'YouTube' },
]

export default function Footer() {
  const { content } = useContent()
  const site = content.site || {}
  const nav = content.navigation || {}
  const year = new Date().getFullYear()

  const columns = nav.footerColumns || []
  const socials = SOCIAL_ICONS.filter((s) => site.social?.[s.key]).map((s) => ({
    ...s,
    href: site.social[s.key],
  }))
  const copyright = (site.copyright || `© {year} ${site.fullName}. All rights reserved.`).replace(
    '{year}',
    String(year),
  )

  return (
    <footer className="relative border-t border-white/10 bg-night">
      {/* Location map strip */}
      {site.mapEmbed ? (
        <div className="relative h-52 w-full overflow-hidden md:h-72">
          <iframe
            title="DECORA location map"
            src={site.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.85)_brightness(0.95)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-night" />
          <div className="pointer-events-none absolute bottom-5 left-5 right-5 sm:right-auto">
            <div className="glass max-w-md p-5">
              <p className="eyebrow">Visit Our Studio</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{site.address}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <Reveal className="lg:col-span-1">
          <Link to="/">
            <Logo />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{site.footerDescription}</p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
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

        {/* Editable footer columns */}
        {columns.map((column, index) => (
          <Reveal key={`${column.title}-${index}`} delay={0.08 * (index + 1)}>
            <h3 className="field-label mb-6 text-bronze-light">{column.title}</h3>
            <ul className="space-y-3.5">
              {(column.links || []).map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    to={link.to || '/'}
                    className="group inline-flex items-center gap-2.5 text-sm text-white/65 transition-colors hover:text-bronze-light"
                  >
                    <span className="h-px w-0 bg-bronze transition-all duration-500 group-hover:w-5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        {/* Contact */}
        <Reveal delay={0.24}>
          <h3 className="field-label mb-6 text-bronze-light">Contact</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <IoLocationOutline className="mt-0.5 shrink-0 text-bronze" size={16} />
              <span className="leading-relaxed">{site.address}</span>
            </li>
            <li>
              <a
                href={`tel:${(site.phone || '').replace(/\s/g, '')}`}
                className="flex items-center gap-3 transition-colors hover:text-bronze-light"
              >
                <IoCallOutline className="text-bronze" size={16} />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 break-all transition-colors hover:text-bronze-light"
              >
                <IoMailOutline className="text-bronze" size={16} />
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <IoTimeOutline className="mt-0.5 shrink-0 text-bronze" size={16} />
              <span>{site.hours}</span>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="hairline mx-auto max-w-[1440px]" />

      <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
        <p>{copyright}</p>
        <p className="flex items-center gap-4">
          <span className="hidden sm:inline">{nav.footerTagline || site.tagline}</span>
          <a href={nav.privacyLink || '#top'} className="transition-colors hover:text-bronze-light">
            {nav.privacyLabel || 'Privacy Policy'}
          </a>
        </p>
      </div>
    </footer>
  )
}
