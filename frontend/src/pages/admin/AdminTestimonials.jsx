import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiLoader, FiMessageSquare, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi'
import Modal from '@/components/ui/Modal'
import Loader from '@/components/ui/Loader'
import { apiDelete, apiList, apiPost, apiPut } from '@/lib/api'
import {
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  ImageUploader,
  SearchInput,
  SuccessBanner,
  idOf,
  initials,
} from './admin-ui'

const blank = () => ({
  name: '',
  role: '',
  company: '',
  rating: 5,
  text: '',
  featured: false,
  avatar: '',
})

const toForm = (t) => ({
  ...blank(),
  name: t.name || '',
  role: t.role || '',
  company: t.company || '',
  rating: t.rating || 5,
  text: t.text || '',
  featured: !!t.featured,
  avatar: t.avatar || '',
})

/**
 * /admin/testimonials — manage client testimonials & ratings.
 */
export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank())
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await apiList('/testimonials', [])
    setItems(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const flashMsg = (msg) => {
    setFlash(msg)
    window.setTimeout(() => setFlash(''), 2500)
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items
    return items.filter((t) =>
      [t.name, t.company, t.role, t.text].filter(Boolean).join(' ').toLowerCase().includes(term),
    )
  }, [items, query])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const toggle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }))

  const openNew = () => {
    setEditing(null)
    setForm(blank())
    setFormError('')
    setError('')
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm(toForm(t))
    setFormError('')
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setFormError('A name is required.')
      return
    }
    if (!form.text.trim()) {
      setFormError('The testimonial text is required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const body = {
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        rating: Number(form.rating) || 5,
        text: form.text.trim(),
        featured: form.featured,
        avatar: form.avatar,
      }
      if (editing) await apiPut(`/testimonials/${idOf(editing)}`, body)
      else await apiPost('/testimonials', body)
      setModalOpen(false)
      flashMsg('Saved')
      await load()
    } catch (err) {
      setFormError(err?.message || 'Could not save this testimonial. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingBusy(true)
    setError('')
    try {
      await apiDelete(`/testimonials/${idOf(deleting)}`)
      setDeleting(null)
      flashMsg('Testimonial deleted')
      await load()
    } catch (err) {
      setError(err?.message || 'Could not delete this testimonial. Please try again.')
    } finally {
      setDeletingBusy(false)
    }
  }

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Social Proof</span>
          <h1 className="heading-lg mt-4">Testimonials</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Client quotes and ratings displayed across the website.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn btn-primary btn-sm self-start lg:self-auto">
          <FiPlus /> New Testimonial
        </button>
      </div>

      {flash ? <SuccessBanner message={flash} className="mt-6" /> : null}
      {error ? <ErrorBanner message={error} onDismiss={() => setError('')} className="mt-6" /> : null}

      {/* ---------- toolbar ---------- */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          id="testimonials-search"
          value={query}
          onChange={setQuery}
          placeholder="Search testimonials…"
          className="lg:w-80"
        />
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
          {filtered.length} of {items.length} testimonials
        </span>
      </div>

      {/* ---------- list ---------- */}
      <div className="mt-6">
        {loading ? (
          <div className="glass rounded-sm">
            <Loader full={false} label="Loading testimonials" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState
              icon={FiMessageSquare}
              title="No testimonials yet"
              message="Add your first testimonial to build social proof on the site."
              action={
                <button type="button" onClick={openNew} className="btn btn-primary btn-sm">
                  <FiPlus /> New Testimonial
                </button>
              }
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState icon={FiMessageSquare} title="No matches" message="No testimonials match your search." />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t, i) => (
              <motion.article
                key={idOf(t) || t.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-hover flex flex-col rounded-sm p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-4">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-bronze/30 bg-bronze/10 font-display text-lg font-semibold text-bronze-light">
                        {initials(t.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold text-white">{t.name}</h3>
                      <p className="mt-0.5 truncate text-xs text-white/45">
                        {[t.role, t.company].filter(Boolean).join(' · ') || 'Client'}
                      </p>
                    </div>
                  </div>
                  {t.featured ? (
                    <span className="inline-flex shrink-0 items-center gap-1 border border-bronze/40 bg-bronze/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze-light">
                      <FiStar size={10} className="fill-current" aria-hidden="true" /> Top
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex gap-1" role="img" aria-label={`${t.rating || 5} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FiStar
                      key={n}
                      size={13}
                      aria-hidden="true"
                      className={n <= (Number(t.rating) || 5) ? 'fill-current text-bronze' : 'text-white/15'}
                    />
                  ))}
                </div>

                {t.text ? (
                  <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/55">{t.text}</p>
                ) : null}

                <div className="mt-auto pt-5">
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {t.featured ? 'Featured' : 'Standard'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        aria-label={`Edit testimonial from ${t.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setError('')
                          setDeleting(t)
                        }}
                        aria-label={`Delete testimonial from ${t.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-red-500/50 hover:text-red-400"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* ---------- add / edit modal ---------- */}
      <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)} size="md" label="Testimonial form">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <div className="mb-7 pr-12">
            <span className="eyebrow">{editing ? 'Edit' : 'New'}</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">
              {editing ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="tst-name">
                Name *
              </label>
              <input
                id="tst-name"
                className="field"
                value={form.name}
                onChange={set('name')}
                placeholder="Ritika Mehra"
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="tst-role">
                Role
              </label>
              <input id="tst-role" className="field" value={form.role} onChange={set('role')} placeholder="Homeowner" />
            </div>

            <div>
              <label className="field-label" htmlFor="tst-company">
                Company / Project
              </label>
              <input
                id="tst-company"
                className="field"
                value={form.company}
                onChange={set('company')}
                placeholder="The Aurelia Residence"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="tst-rating">
                Rating
              </label>
              <select
                id="tst-rating"
                className="field"
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n} className="bg-night">
                    {n} star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="tst-text">
                Testimonial *
              </label>
              <textarea
                id="tst-text"
                rows={4}
                className="field resize-none"
                value={form.text}
                onChange={set('text')}
                placeholder="What the client said about working with DECORA…"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <span className="field-label">Visibility</span>
              <label
                htmlFor="tst-featured"
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <span className="text-sm text-white/70">Feature on the homepage</span>
                <span className="relative inline-flex shrink-0">
                  <input
                    id="tst-featured"
                    type="checkbox"
                    className="peer sr-only"
                    checked={form.featured}
                    onChange={toggle('featured')}
                  />
                  <span className="relative block h-6 w-11 rounded-full border border-white/15 bg-white/10 transition-colors duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-300 after:content-[''] peer-checked:border-bronze peer-checked:bg-bronze/60 peer-checked:after:translate-x-5" />
                </span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <ImageUploader label="Avatar" value={form.avatar} onChange={(url) => setForm((f) => ({ ...f, avatar: url }))} />
            </div>
          </div>

          {formError ? <ErrorBanner message={formError} className="mt-5" /> : null}

          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="btn btn-ghost btn-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm disabled:opacity-60">
              {saving ? (
                <>
                  <FiLoader className="animate-spin" /> Saving…
                </>
              ) : (
                'Save Testimonial'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------- delete confirm ---------- */}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete testimonial from ${deleting?.name || 'this client'}?`}
        message="This removes the testimonial from the site permanently. This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
        busy={deletingBusy}
        error={error}
      />
    </div>
  )
}
