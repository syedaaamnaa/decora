import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoFacebook,
  IoLogoYoutube,
  IoTimeOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5'
import { FiSend } from 'react-icons/fi'
import Seo from '@/components/ui/Seo'
import Page from '@/components/ui/Page'
import PageHeader from '@/components/ui/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'
import { submitLead } from '@/lib/api'
import { SITE, CONTACT_FORM_SERVICES, img } from '@/data/seed'

const EMPTY = { name: '', phone: '', email: '', service: '', message: '' }

const DETAILS = [
  {
    icon: IoLocationOutline,
    label: 'Address',
    value: SITE.address,
  },
  {
    icon: IoCallOutline,
    label: 'Phone',
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/\s+/g, '')}`,
  },
  {
    icon: IoMailOutline,
    label: 'Email',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: IoLogoWhatsapp,
    label: 'WhatsApp',
    value: 'Chat on WhatsApp',
    href: `https://wa.me/${SITE.whatsapp}`,
    external: true,
  },
  {
    icon: IoTimeOutline,
    label: 'Working Hours',
    value: SITE.hours,
  },
]

const SOCIALS = [
  { icon: IoLogoInstagram, href: SITE.social.instagram, label: 'Instagram' },
  { icon: IoLogoLinkedin, href: SITE.social.linkedin, label: 'LinkedIn' },
  { icon: IoLogoFacebook, href: SITE.social.facebook, label: 'Facebook' },
  { icon: IoLogoYoutube, href: SITE.social.youtube, label: 'YouTube' },
]

function DetailCard({ icon: Icon, label, value, href, external }) {
  const inner = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-bronze/25 bg-bronze/10 text-xl text-bronze-light transition-all duration-500 group-hover:border-bronze/50 group-hover:shadow-glow">
        <Icon aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
          {label}
        </span>
        <span className="mt-1.5 block break-words text-lg text-white">{value}</span>
      </span>
    </>
  )

  const classes =
    'group glass flex items-start gap-4 p-6 transition-all duration-500 hover:border-bronze/40 hover:shadow-glow'

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }
  return (
    <div className={classes}>
      {inner}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await submitLead('/messages', form)
      setStatus('done')
      setForm(EMPTY)
    } catch (err) {
      setStatus('idle')
      setError(err?.message || 'Something went wrong. Please try again.')
    }
  }

  const reset = () => {
    setForm(EMPTY)
    setError('')
    setStatus('idle')
  }

  return (
    <>
      <Seo
        title="Contact Us"
        description="Discuss your site, scope or idea with a DECORA consultant — call, email, WhatsApp or send a message. We respond within one working day."
      />
      <Page>
        <PageHeader
          eyebrow="Get In Touch"
          title="Contact Us"
          description="Discuss your site, scope or idea with a DECORA consultant — we respond within one working day."
          image={img('1504307651254-35680f356dfd', 2000)}
          breadcrumb="Contact"
        />

        {/* ------------------------------- MAIN GRID -------------------------------- */}
        <section className="section">
          <div className="container-luxe">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Left — contact details */}
              <div>
                <SectionHeading
                  eyebrow="Reach Us"
                  title="Let’s start the conversation."
                  description="Walk in, call, or send a note — the same team that builds your project answers your message."
                />

                <div className="space-y-4">
                  {DETAILS.map((detail) => (
                    <Reveal key={detail.label}>
                      <DetailCard {...detail} />
                    </Reveal>
                  ))}
                </div>

                {/* Socials */}
                <div className="mt-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
                    Follow our work
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {SOCIALS.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`DECORA on ${label}`}
                        className="glass flex h-11 w-11 items-center justify-center rounded-full text-lg text-white/75 transition-all duration-500 hover:border-bronze/50 hover:text-bronze-light hover:shadow-glow"
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Response time */}
                <div className="glass mt-6 flex items-center gap-3 p-5">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-bronze shadow-glow"
                  />
                  <p className="text-sm text-white/75">
                    <span className="font-semibold uppercase tracking-[0.18em] text-white/50">
                      Response time —{' '}
                    </span>
                    Within 1 working day
                  </p>
                </div>
              </div>

              {/* Right — form */}
              <div className="glass-strong p-7 md:p-10">
                <AnimatePresence mode="wait">
                  {status === 'done' ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="flex min-h-[420px] flex-col items-center justify-center text-center"
                    >
                      <IoCheckmarkCircle className="text-bronze" size={60} aria-hidden="true" />
                      <h2 className="heading-md mt-6 text-3xl">Message received!</h2>
                      <p className="lead mt-4 max-w-md">
                        A DECORA consultant will call you back within one working day.
                      </p>
                      <button
                        type="button"
                        onClick={reset}
                        className="btn btn-ghost btn-sm mt-8"
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      onSubmit={handleSubmit}
                    >
                      <h2 className="heading-md">Send a Message</h2>
                      <p className="lead mt-4">
                        Share a few lines about your site, scope and timeline — we will come back
                        with next steps and an honest budget range.
                      </p>

                      <div className="mt-8 space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="field-label" htmlFor="contact-name">
                              Name *
                            </label>
                            <input
                              id="contact-name"
                              className="field"
                              value={form.name}
                              onChange={update('name')}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="field-label" htmlFor="contact-phone">
                              Phone
                            </label>
                            <input
                              id="contact-phone"
                              className="field"
                              value={form.phone}
                              onChange={update('phone')}
                              placeholder="+91 00000 00000"
                            />
                          </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="field-label" htmlFor="contact-email">
                              Email *
                            </label>
                            <input
                              id="contact-email"
                              type="email"
                              className="field"
                              value={form.email}
                              onChange={update('email')}
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="field-label" htmlFor="contact-service">
                              Service
                            </label>
                            <select
                              id="contact-service"
                              className="field"
                              value={form.service}
                              onChange={update('service')}
                            >
                              <option value="">Select a service</option>
                              {CONTACT_FORM_SERVICES.map((service) => (
                                <option key={service} value={service} className="bg-night">
                                  {service}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="field-label" htmlFor="contact-message">
                            Message *
                          </label>
                          <textarea
                            id="contact-message"
                            rows={5}
                            className="field resize-none"
                            value={form.message}
                            onChange={update('message')}
                            placeholder="Tell us about your site, size, scope and timeline…"
                            required
                          />
                        </div>

                        {error && (
                          <p role="alert" className="text-sm text-red-400">
                            {error}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={status === 'sending'}
                          className="btn btn-primary w-full disabled:opacity-60"
                        >
                          {status === 'sending' ? (
                            'Sending…'
                          ) : (
                            <>
                              <FiSend aria-hidden="true" /> Send Message
                            </>
                          )}
                        </button>

                        <p className="text-center text-[11px] text-white/45">
                          Or WhatsApp us at{' '}
                          <a
                            href={`https://wa.me/${SITE.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-bronze-light underline-offset-4 transition-colors hover:text-bronze hover:underline"
                          >
                            {SITE.phone}
                          </a>
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------- MAP ----------------------------------- */}
        <section className="pb-20 md:pb-28 lg:pb-32">
          <div className="container-luxe">
            <Reveal>
              <div className="glass relative overflow-hidden p-2">
                <iframe
                  title="DECORA location"
                  src={SITE.mapEmbed}
                  className="h-[380px] w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.85)]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="pointer-events-none absolute bottom-5 left-5 max-w-[calc(100%_-_2.5rem)]">
                  <div className="glass px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-bronze-light">
                      Visit DECORA
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/85">{SITE.address}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </Page>
    </>
  )
}
