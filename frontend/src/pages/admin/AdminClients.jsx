import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiExternalLink, FiLoader, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi'
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

const blank = () => ({ name: '', industry: '', website: '', order: '', logo: '' })

const toForm = (c) => ({
  ...blank(),
  name: c.name || '',
  industry: c.industry || '',
  website: c.website || '',
  order: c.order ?? '',
  logo: c.logo || '',
})

/**
 * /admin/clients — manage the client logo wall.
 */
export default function AdminClients() {
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
    const data = await apiList('/clients', [])
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
    return items.filter((c) =>
      [c.name, c.industry].filter(Boolean).join(' ').toLowerCase().includes(term),
    )
  }, [items, query])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const openNew = () => {
    setEditing(null)
    setForm(blank())
    setFormError('')
    setError('')
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm(toForm(c))
    setFormError('')
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setFormError('A client name is required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const body = {
        name: form.name.trim(),
        industry: form.industry.trim(),
        website: form.website.trim(),
        order: form.order === '' ? undefined : Number(form.order),
        logo: form.logo,
      }
      if (editing) await apiPut(`/clients/${idOf(editing)}`, body)
      else await apiPost('/clients', body)
      setModalOpen(false)
      flashMsg('Saved')
      await load()
    } catch (err) {
      setFormError(err?.message || 'Could not save this client. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingBusy(true)
    setError('')
    try {
      await apiDelete(`/clients/${idOf(deleting)}`)
      setDeleting(null)
      flashMsg('Client removed')
      await load()
    } catch (err) {
      setError(err?.message || 'Could not delete this client. Please try again.')
    } finally {
      setDeletingBusy(false)
    }
  }

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Trust Wall</span>
          <h1 className="heading-lg mt-4">Clients</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            The brands and organisations featured in the DECORA client showcase.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn btn-primary btn-sm self-start lg:self-auto">
          <FiPlus /> Add Client
        </button>
      </div>

      {flash ? <SuccessBanner message={flash} className="mt-6" /> : null}
      {error ? <ErrorBanner message={error} onDismiss={() => setError('')} className="mt-6" /> : null}

      {/* ---------- toolbar ---------- */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          id="clients-search"
          value={query}
          onChange={setQuery}
          placeholder="Search clients…"
          className="lg:w-80"
        />
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
          {filtered.length} of {items.length} clients
        </span>
      </div>

      {/* ---------- list ---------- */}
      <div className="mt-6">
        {loading ? (
          <div className="glass rounded-sm">
            <Loader full={false} label="Loading clients" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState
              icon={FiUsers}
              title="No clients yet"
              message="Add your first client to start building the trust wall."
              action={
                <button type="button" onClick={openNew} className="btn btn-primary btn-sm">
                  <FiPlus /> Add Client
                </button>
              }
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState icon={FiUsers} title="No matches" message="No clients match your search." />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c, i) => (
              <motion.article
                key={idOf(c) || c.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-hover flex flex-col rounded-sm p-5"
              >
                <div className="flex items-center gap-4">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.name}
                      className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-bronze/30 bg-bronze/10 font-display text-xl font-semibold text-bronze-light">
                      {initials(c.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl font-semibold text-white">{c.name}</h3>
                    <p className="mt-0.5 truncate text-xs text-white/45">{c.industry || 'Industry TBA'}</p>
                  </div>
                </div>

                <div className="mt-auto pt-5">
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    {c.website ? (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-w-0 items-center gap-1.5 truncate text-xs text-white/50 transition hover:text-bronze-light"
                      >
                        <FiExternalLink size={12} className="shrink-0" aria-hidden="true" />
                        <span className="truncate">{c.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {c.order !== undefined && c.order !== null && c.order !== '' ? `Order ${c.order}` : 'Client'}
                      </span>
                    )}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        aria-label={`Edit ${c.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setError('')
                          setDeleting(c)
                        }}
                        aria-label={`Delete ${c.name}`}
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
      <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)} size="md" label="Client form">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
          <div className="mb-7 pr-12">
            <span className="eyebrow">{editing ? 'Edit' : 'New'}</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">
              {editing ? 'Edit Client' : 'Add Client'}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="cli-name">
                Name *
              </label>
              <input
                id="cli-name"
                className="field"
                value={form.name}
                onChange={set('name')}
                placeholder="Sterling InfraTech"
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="cli-industry">
                Industry
              </label>
              <input
                id="cli-industry"
                className="field"
                value={form.industry}
                onChange={set('industry')}
                placeholder="Real Estate"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="cli-website">
                Website
              </label>
              <input
                id="cli-website"
                className="field"
                value={form.website}
                onChange={set('website')}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="cli-order">
                Order
              </label>
              <input
                id="cli-order"
                type="number"
                className="field"
                value={form.order}
                onChange={set('order')}
                placeholder="1"
              />
              <p className="mt-1.5 text-xs text-white/35">Lower numbers appear first.</p>
            </div>

            <div className="sm:col-span-2">
              <ImageUploader label="Logo" value={form.logo} onChange={(url) => setForm((f) => ({ ...f, logo: url }))} />
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
                'Save Client'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------- delete confirm ---------- */}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.name || 'client'}?`}
        message="This removes the client from the site permanently. This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
        busy={deletingBusy}
        error={error}
      />
    </div>
  )
}
