import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi'
import { apiDelete, apiPatch, apiPost, apiPut, apiRequest } from '@/lib/api'
import Modal from '@/components/ui/Modal'
import Loader from '@/components/ui/Loader'
import {
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  ImageUploader,
  SuccessBanner,
  idOf,
} from './admin-ui'

const blankSlide = (order = 0) => ({
  name: '',
  heading: '',
  highlightText: '',
  description: '',
  image: '',
  buttonText: '',
  buttonLink: '',
  order,
  active: true,
  overlayOpacity: 58,
})

const ordered = (slides) => [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

function PreviewHeading({ heading, highlightText }) {
  if (!highlightText || !heading.includes(highlightText)) return heading || 'Your hero heading'
  const [before, after] = heading.split(highlightText)
  return (
    <>
      {before}
      <span className="text-gradient">{highlightText}</span>
      {after}
    </>
  )
}

function SlidePreview({ slide, compact = false }) {
  return (
    <div
      className={`relative isolate flex overflow-hidden border border-white/10 bg-[#111] ${
        compact ? 'aspect-[16/7] items-end p-5' : 'aspect-[16/8] items-center justify-center p-5 text-center sm:p-8'
      }`}
      style={slide.image ? { backgroundImage: `url("${slide.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(10,10,10,0.86),rgba(10,10,10,0.55))]"
        style={{
          backgroundColor: '#111',
          opacity: Math.min(0.9, Math.max(0.2, Number(slide.overlayOpacity ?? 58) / 100)),
        }}
      />
      <div className={compact ? 'max-w-2xl' : 'max-w-3xl'}>
        <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-bronze-light">
          {slide.name || 'Slide preview'}
        </p>
        <h3 className={`mt-3 font-display font-medium leading-tight text-[#F8F5EF] ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'}`}>
          <PreviewHeading heading={slide.heading} highlightText={slide.highlightText} />
        </h3>
        <p className={`mx-auto mt-3 max-w-2xl font-light leading-relaxed text-white/75 ${compact ? 'line-clamp-2 text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
          {slide.description || 'Your hero description will appear here.'}
        </p>
        {slide.buttonText ? (
          <span className="mt-4 inline-flex border border-bronze/50 bg-bronze/90 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink">
            {slide.buttonText}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [flash, setFlash] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankSlide())
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deletingBusy, setDeletingBusy] = useState(false)
  const [ordering, setOrdering] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await apiRequest('/hero-slides/admin')
      setSlides(ordered(Array.isArray(data) ? data : []))
    } catch (err) {
      setLoadError(err?.message || 'Could not load hero slides.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [key]: value }))
  }

  const openNew = () => {
    setEditing(null)
    setForm(blankSlide(slides.length))
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (slide) => {
    setEditing(slide)
    setForm({ ...blankSlide(), ...slide, highlightText: slide.highlightText || '' })
    setFormError('')
    setFormOpen(true)
  }

  const validationError = useMemo(() => {
    if (form.highlightText && !form.heading.includes(form.highlightText)) {
      return 'The gold-highlighted phrase must be included in the heading.'
    }
    if (Boolean(form.buttonText.trim()) !== Boolean(form.buttonLink.trim())) {
      return 'Enter both the CTA button label and its destination, or leave both empty.'
    }
    if (form.buttonLink && !/^(\/|https?:\/\/)/i.test(form.buttonLink.trim())) {
      return 'CTA destination must be a site path starting with / or an HTTP(S) URL.'
    }
    return ''
  }, [form.buttonLink, form.buttonText, form.heading, form.highlightText])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.heading.trim() || !form.description.trim() || !form.image.trim()) {
      setFormError('Slide name, heading, description, and background image are required.')
      return
    }
    if (validationError) {
      setFormError(validationError)
      return
    }

    setSaving(true)
    setFormError('')
    try {
      const body = {
        ...form,
        name: form.name.trim(),
        heading: form.heading.trim(),
        highlightText: form.highlightText.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        buttonText: form.buttonText.trim(),
        buttonLink: form.buttonLink.trim(),
        order: Number(form.order),
        overlayOpacity: Number(form.overlayOpacity),
      }
      if (editing) await apiPut(`/hero-slides/${idOf(editing)}`, body)
      else await apiPost('/hero-slides', body)
      setFormOpen(false)
      setFlash(editing ? 'Hero slide updated' : 'Hero slide created')
      await load()
    } catch (err) {
      setFormError(err?.message || 'Could not save this hero slide.')
    } finally {
      setSaving(false)
    }
  }

  const moveSlide = async (index, direction) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= slides.length || ordering) return
    const next = [...slides]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    setOrdering(true)
    setLoadError('')
    try {
      await apiPatch('/hero-slides/reorder', { ids: next.map(idOf) })
      setSlides(next.map((slide, order) => ({ ...slide, order })))
    } catch (err) {
      setLoadError(err?.message || 'Could not reorder hero slides.')
    } finally {
      setOrdering(false)
    }
  }

  const toggleActive = async (slide) => {
    setLoadError('')
    try {
      const updated = await apiPut(`/hero-slides/${idOf(slide)}`, { active: !slide.active })
      setSlides((current) => ordered(current.map((item) => (idOf(item) === idOf(slide) ? updated : item))))
    } catch (err) {
      setLoadError(err?.message || 'Could not update slide status.')
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeletingBusy(true)
    setDeleteError('')
    try {
      await apiDelete(`/hero-slides/${idOf(deleting)}`)
      setDeleting(null)
      setFlash('Hero slide deleted')
      await load()
    } catch (err) {
      setDeleteError(err?.message || 'Could not delete this hero slide.')
    } finally {
      setDeletingBusy(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Homepage</span>
          <h1 className="heading-lg mt-4">Hero Slides</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Manage the homepage carousel. Only active slides appear on the public site.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn btn-primary btn-sm self-start lg:self-auto">
          <FiPlus /> New Slide
        </button>
      </div>

      {flash ? <SuccessBanner message={flash} className="mt-6" /> : null}
      {loadError ? <ErrorBanner message={loadError} onDismiss={() => setLoadError('')} className="mt-6" /> : null}

      <div className="mt-7">
        {loading ? (
          <div className="glass rounded-sm">
            <Loader full={false} label="Loading hero slides" />
          </div>
        ) : slides.length === 0 ? (
          <div className="glass rounded-sm p-6">
            <EmptyState
              icon={FiImage}
              title="No managed hero slides"
              message="The public homepage uses its built-in default hero until you publish a slide here."
              action={
                <button type="button" onClick={openNew} className="btn btn-primary btn-sm">
                  <FiPlus /> New Slide
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {slides.map((slide, index) => (
              <article key={idOf(slide)} className="glass flex flex-col overflow-hidden rounded-sm">
                <SlidePreview slide={slide} compact />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bronze-light">
                        {slide.name} · Order {index + 1}
                      </p>
                      <h2 className="mt-2 font-display text-xl font-semibold text-white">{slide.heading}</h2>
                    </div>
                    <span
                      className={`border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${
                        slide.active
                          ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-white/45'
                      }`}
                    >
                      {slide.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">{slide.description}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 mt-5">
                    <label className="flex cursor-pointer items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
                      <input
                        type="checkbox"
                        checked={!!slide.active}
                        onChange={() => toggleActive(slide)}
                        aria-label={`${slide.active ? 'Disable' : 'Enable'} ${slide.name}`}
                        className="accent-[#c8a66b]"
                      />
                      Published
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSlide(index, -1)}
                        disabled={index === 0 || ordering}
                        aria-label={`Move ${slide.name} up`}
                        className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(index, 1)}
                        disabled={index === slides.length - 1 || ordering}
                        aria-label={`Move ${slide.name} down`}
                        className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(slide)}
                        aria-label={`Edit ${slide.name}`}
                        className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleting(slide)
                          setDeleteError('')
                        }}
                        aria-label={`Delete ${slide.name}`}
                        className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/60 transition hover:border-red-500/50 hover:text-red-400"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} size="lg" label="Hero slide form">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <div className="mb-7 pr-12">
            <span className="eyebrow">{editing ? 'Edit slide' : 'New slide'}</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">
              {editing ? 'Edit Hero Slide' : 'Create Hero Slide'}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="hero-name">Slide name *</label>
              <input id="hero-name" className="field" value={form.name} onChange={setField('name')} maxLength={80} required />
            </div>
            <div>
              <label className="field-label" htmlFor="hero-order">Display order</label>
              <input id="hero-order" className="field" type="number" min="0" value={form.order} onChange={setField('order')} />
            </div>
            <div className="md:col-span-2">
              <label className="field-label" htmlFor="hero-heading">Main heading *</label>
              <input id="hero-heading" className="field" value={form.heading} onChange={setField('heading')} maxLength={140} required />
            </div>
            <div className="md:col-span-2">
              <label className="field-label" htmlFor="hero-highlight">Gold-highlighted phrase</label>
              <input
                id="hero-highlight"
                className="field"
                value={form.highlightText}
                onChange={setField('highlightText')}
                maxLength={80}
                placeholder="A phrase copied exactly from the heading"
              />
            </div>
            <div className="md:col-span-2">
              <label className="field-label" htmlFor="hero-description">Paragraph *</label>
              <textarea
                id="hero-description"
                className="field min-h-24 resize-y"
                value={form.description}
                onChange={setField('description')}
                maxLength={320}
                required
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploader
                label="Background image *"
                value={form.image}
                onChange={(image) => setForm((current) => ({ ...current, image }))}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="hero-button-text">CTA button text</label>
              <input id="hero-button-text" className="field" value={form.buttonText} onChange={setField('buttonText')} maxLength={40} placeholder="Explore Projects" />
            </div>
            <div>
              <label className="field-label" htmlFor="hero-button-link">CTA destination</label>
              <input id="hero-button-link" className="field" value={form.buttonLink} onChange={setField('buttonLink')} placeholder="/projects or https://…" />
            </div>
            <div>
              <label className="field-label" htmlFor="hero-overlay">
                Dark overlay: {form.overlayOpacity}%
              </label>
              <input
                id="hero-overlay"
                type="range"
                min="20"
                max="90"
                value={form.overlayOpacity}
                onChange={setField('overlayOpacity')}
                className="mt-3 w-full accent-[#c8a66b]"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3 self-center text-sm text-white/70">
              <input type="checkbox" checked={!!form.active} onChange={setField('active')} className="accent-[#c8a66b]" />
              Publish this slide
            </label>
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="field-label mb-0">Live preview</span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">Updates as you edit</span>
              </div>
              <SlidePreview slide={form} />
            </div>
          </div>

          {formError || validationError ? (
            <ErrorBanner message={formError || validationError} className="mt-5" />
          ) : null}

          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary btn-sm disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Slide'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete hero slide?"
        message={`“${deleting?.name || ''}” will be permanently removed from the homepage carousel.`}
        onClose={() => !deletingBusy && setDeleting(null)}
        onConfirm={confirmDelete}
        busy={deletingBusy}
        error={deleteError}
      />
    </div>
  )
}
