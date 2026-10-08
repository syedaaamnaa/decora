import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCheckmarkCircle, IoPaperPlaneOutline } from 'react-icons/io5'
import Modal from './Modal'
import { useInquiry } from '@/context/InquiryProvider'
import { submitLead } from '@/lib/api'
import { CONTACT_FORM_SERVICES } from '@/data/seed'

const EMPTY = { name: '', phone: '', email: '', service: '', message: '' }

/**
 * Global "Project Inquiry" popup — triggered from any CTA on the site.
 */
export default function InquiryModal() {
  const { isOpen, presetService, closeInquiry } = useInquiry()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setForm({ ...EMPTY, service: presetService || '' })
      setStatus('idle')
      setError('')
    }
  }, [isOpen, presetService])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email and message.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      await submitLead('/messages', form)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <Modal open={isOpen} onClose={closeInquiry} size="lg" label="Project inquiry">
      <div className="grid md:grid-cols-[0.85fr_1fr]">
        {/* Side panel */}
        <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#1a1611,#0E0E0E)] p-9 md:block">
          <div className="pattern-dots absolute inset-0 opacity-40" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-bronze/20 blur-[70px]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="eyebrow">Project Inquiry</span>
              <h3 className="heading-md mt-5 text-[2.1rem] leading-tight">
                Let’s build something <em className="font-normal text-bronze-light">extraordinary</em>.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Share a few details and our team will call you back within one working day with an
                initial scope and budget range.
              </p>
            </div>
            <ul className="mt-10 space-y-3 text-sm text-white/70">
              {['Free consultation & site assessment', 'Transparent, itemised quotation', 'Dedicated project manager'].map(
                (item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="p-7 sm:p-9">
          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[380px] flex-col items-center justify-center text-center"
              >
                <IoCheckmarkCircle className="text-bronze" size={64} />
                <h3 className="heading-md mt-6 text-3xl">Thank you!</h3>
                <p className="lead mt-3 max-w-sm">
                  Your inquiry has been received. A DECORA consultant will reach out within one
                  working day.
                </p>
                <button type="button" onClick={closeInquiry} className="btn btn-outline btn-sm mt-8">
                  Close
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="mb-7 pr-12">
                  <h3 className="font-display text-3xl font-semibold">Start Your Project</h3>
                  <p className="mt-1.5 text-sm text-muted">Tell us what you are planning to build.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="iq-name">Name *</label>
                    <input id="iq-name" className="field" value={form.name} onChange={update('name')} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="iq-phone">Phone</label>
                    <input id="iq-phone" className="field" value={form.phone} onChange={update('phone')} placeholder="+92 300 0000000" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="iq-email">Email *</label>
                    <input id="iq-email" type="email" className="field" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="iq-service">Service</label>
                    <select id="iq-service" className="field" value={form.service} onChange={update('service')}>
                      <option value="">Select a service</option>
                      {CONTACT_FORM_SERVICES.map((s) => (
                        <option key={s} value={s} className="bg-night">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="iq-message">Message *</label>
                  <textarea id="iq-message" rows={4} className="field resize-none" value={form.message} onChange={update('message')} placeholder="Tell us about your site, size, timeline…" required />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full disabled:opacity-60">
                  {status === 'sending' ? (
                    'Sending…'
                  ) : (
                    <>
                      <IoPaperPlaneOutline /> Send Inquiry
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-white/40">
                  Or WhatsApp us directly at +92 300 1234567
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  )
}
