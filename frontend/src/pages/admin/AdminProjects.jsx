import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiImage, FiLoader, FiMapPin, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi'
import Modal from '@/components/ui/Modal'
import Loader from '@/components/ui/Loader'
import LazyImage from '@/components/ui/LazyImage'
import { apiDelete, apiList, apiPost, apiPut } from '@/lib/api'
import { PROJECT_CATEGORIES } from '@/data/seed'
import {
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  ImageUploader,
  SearchInput,
  SuccessBanner,
  idOf,
} from './admin-ui'

const CATEGORIES = PROJECT_CATEGORIES.filter((c) => c !== 'All')

const blank = () => ({
  title: '',
  category: CATEGORIES[0] || '',
  location: '',
  client: '',
  year: '',
  area: '',
  status: 'Completed',
  completedAt: '',
  description: '',
  scope: '',
  featured: false,
  cover: '',
  images: [],
})

const toForm = (p) => ({
  ...blank(),
  title: p.title || '',
  category: p.category || CATEGORIES[0] || '',
  location: p.location || '',
  client: p.client || '',
  year: p.year ?? '',
  area: p.area || '',
  status: p.status || 'Completed',
  completedAt: p.completedAt || '',
  description: p.description || '',
  scope: Array.isArray(p.scope) ? p.scope.join(', ') : p.scope || '',
  featured: !!p.featured,
  cover: p.cover || '',
  images: Array.isArray(p.images) ? [...p.images] : [],
})

/**
 * /admin/projects — create, edit, search and delete portfolio projects.
 */
export default function AdminProjects() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

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
    const data = await apiList('/projects', [])
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
    return items.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const hay = [p.title, p.location, p.client].filter(Boolean).join(' ').toLowerCase()
      return matchCat && (!term || hay.includes(term))
    })
  }, [items, query, category])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const toggle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }))

  const openNew = () => {
    setEditing(null)
    setForm(blank())
    setFormError('')
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm(toForm(p))
    setFormError('')
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setFormError('A project title is required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const body = {
        title: form.title.trim(),
        category: form.category,
        location: form.location.trim(),
        client: form.client.trim(),
        year: form.year === '' ? undefined : Number(form.year),
        area: form.area.trim(),
        status: form.status,
        completedAt: form.completedAt.trim(),
        description: form.description.trim(),
        scope: form.scope
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        featured: form.featured,
        cover: form.cover,
        images: form.images,
      }
      if (editing) await apiPut(`/projects/${idOf(editing)}`, body)
      else await apiPost('/projects', body)
      setModalOpen(false)
      flashMsg('Saved')
      await load()
    } catch (err) {
      setFormError(err?.message || 'Could not save this project. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingBusy(true)
    setError('')
    try {
      await apiDelete(`/projects/${idOf(deleting)}`)
      setDeleting(null)
      flashMsg('Project deleted')
      await load()
    } catch (err) {
      setError(err?.message || 'Could not delete this project. Please try again.')
    } finally {
      setDeletingBusy(false)
    }
  }

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Portfolio</span>
          <h1 className="heading-lg mt-4">Projects</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Manage the projects showcased across the website — images, details and featured
            placement.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn btn-primary btn-sm self-start lg:self-auto">
          <FiPlus /> New Project
        </button>
      </div>

      {flash ? <SuccessBanner message={flash} className="mt-6" /> : null}
      {error ? <ErrorBanner message={error} onDismiss={() => setError('')} className="mt-6" /> : null}

      {/* ---------- toolbar ---------- */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            id="projects-search"
            value={query}
            onChange={setQuery}
            placeholder="Search projects…"
            className="sm:w-72"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="field sm:w-56"
          >
            {['All', ...CATEGORIES].map((c) => (
              <option key={c} value={c} className="bg-night">
                {c}
              </option>
            ))}
          </select>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
          {filtered.length} of {items.length} projects
        </span>
      </div>

      {/* ---------- list ---------- */}
      <div className="mt-6">
        {loading ? (
          <div className="glass rounded-sm">
            <Loader full={false} label="Loading projects" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState
              icon={FiImage}
              title="No projects yet"
              message="Create your first project to start building the portfolio."
              action={
                <button type="button" onClick={openNew} className="btn btn-primary btn-sm">
                  <FiPlus /> New Project
                </button>
              }
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState icon={FiImage} title="No matches" message="No projects match your search or filter." />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.article
                key={idOf(p) || p.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-hover group flex flex-col overflow-hidden rounded-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#141414]">
                  {p.cover ? (
                    <LazyImage src={p.cover} alt={p.title} className="h-full w-full" zoom />
                  ) : (
                    <div className="pattern-grid flex h-full w-full items-center justify-center">
                      <FiImage size={30} className="text-bronze/40" aria-hidden="true" />
                    </div>
                  )}
                  {p.featured ? (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-bronze/40 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze-light backdrop-blur">
                      <FiStar size={11} className="fill-current" aria-hidden="true" /> Featured
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-xl font-semibold text-white">{p.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
                        <FiMapPin size={12} aria-hidden="true" />
                        <span className="truncate">
                          {p.location || 'Location TBA'}
                          {p.year ? ` · ${p.year}` : ''}
                        </span>
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-bronze/30 bg-bronze/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze-light">
                      {p.category || 'General'}
                    </span>
                  </div>

                  {p.description ? (
                    <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-white/50">{p.description}</p>
                  ) : null}

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {p.status || 'Completed'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          aria-label={`Edit ${p.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setError('')
                            setDeleting(p)
                          }}
                          aria-label={`Delete ${p.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-red-500/50 hover:text-red-400"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* ---------- add / edit modal ---------- */}
      <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)} size="md" label="Project form">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <div className="mb-7 pr-12">
            <span className="eyebrow">{editing ? 'Edit' : 'New'}</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">
              {editing ? 'Edit Project' : 'New Project'}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="prj-title">
                Title *
              </label>
              <input
                id="prj-title"
                className="field"
                value={form.title}
                onChange={set('title')}
                placeholder="The Aurelia Residence"
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="prj-category">
                Category
              </label>
              <select id="prj-category" className="field" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-night">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="prj-location">
                Location
              </label>
              <input
                id="prj-location"
                className="field"
                value={form.location}
                onChange={set('location')}
                placeholder="Bhopal, MP"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="prj-client">
                Client
              </label>
              <input
                id="prj-client"
                className="field"
                value={form.client}
                onChange={set('client')}
                placeholder="Private Client"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="prj-year">
                Year
              </label>
              <input
                id="prj-year"
                type="number"
                className="field"
                value={form.year}
                onChange={set('year')}
                placeholder="2025"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="prj-area">
                Area
              </label>
              <input
                id="prj-area"
                className="field"
                value={form.area}
                onChange={set('area')}
                placeholder="4,800 sq.ft"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="prj-status">
                Status
              </label>
              <select id="prj-status" className="field" value={form.status} onChange={set('status')}>
                <option value="Completed" className="bg-night">
                  Completed
                </option>
                <option value="In Progress" className="bg-night">
                  In Progress
                </option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="prj-completed">
                Completed At
              </label>
              <input
                id="prj-completed"
                className="field"
                value={form.completedAt}
                onChange={set('completedAt')}
                placeholder="March 2025"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="prj-description">
                Description
              </label>
              <textarea
                id="prj-description"
                rows={4}
                className="field resize-none"
                value={form.description}
                onChange={set('description')}
                placeholder="Short narrative shown on the project card and detail page."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="prj-scope">
                Scope
              </label>
              <input
                id="prj-scope"
                className="field"
                value={form.scope}
                onChange={set('scope')}
                placeholder="Foundation & Structure, Facade & Glazing, Turnkey Interiors"
              />
              <p className="mt-1.5 text-xs text-white/35">Comma-separated list of scope items.</p>
            </div>

            <div className="sm:col-span-2">
              <span className="field-label">Visibility</span>
              <label
                htmlFor="prj-featured"
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <span className="text-sm text-white/70">Feature on the homepage</span>
                <span className="relative inline-flex shrink-0">
                  <input
                    id="prj-featured"
                    type="checkbox"
                    className="peer sr-only"
                    checked={form.featured}
                    onChange={toggle('featured')}
                  />
                  <span className="relative block h-6 w-11 rounded-full border border-white/15 bg-white/10 transition-colors duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-300 after:content-[''] peer-checked:border-bronze peer-checked:bg-bronze/60 peer-checked:after:translate-x-5" />
                </span>
              </label>
            </div>

            <ImageUploader label="Cover image" value={form.cover} onChange={(url) => setForm((f) => ({ ...f, cover: url }))} />

            <ImageUploader
              label="Gallery images"
              multiple
              values={form.images}
              onValuesChange={(arr) => setForm((f) => ({ ...f, images: arr }))}
            />
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
                'Save Project'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------- delete confirm ---------- */}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.title || 'project'}?`}
        message="This removes the project from the site permanently. This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
        busy={deletingBusy}
        error={error}
      />
    </div>
  )
}
