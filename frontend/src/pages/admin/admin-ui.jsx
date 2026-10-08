/**
 * DECORA — Admin UI kit
 * Shared building blocks used across every admin dashboard page.
 * Plain JSX — imported by the admin pages (and Login) only.
 */
import { useId, useState } from 'react'
import { FiAlertTriangle, FiCheck, FiInbox, FiLoader, FiSearch, FiUpload, FiX } from 'react-icons/fi'
import Modal from '@/components/ui/Modal'
import { apiUpload } from '@/lib/api'

/* -------------------------------- helpers -------------------------------- */

/** Mongo `_id` or plain `id` — both shapes are supported. */
export const idOf = (item) => item?._id ?? item?.id ?? ''

/** Two-letter monogram used when a client/testimonial has no image. */
export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => (w[0] ? w[0].toUpperCase() : ''))
    .join('') || 'D'

/** Human relative time ("3h ago") with graceful fallbacks. */
export function timeAgo(value) {
  if (!value) return ''
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return ''
  const mins = Math.round((Date.now() - time) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(value).toLocaleDateString()
}

/** Safe display date for table cells. */
export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

/* -------------------------------- StatCard -------------------------------- */

export function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="glass glass-hover rounded-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-bronze/30 bg-bronze/10 text-bronze-light">
          {Icon ? <Icon size={20} /> : null}
        </div>
        <span className="font-display text-4xl font-semibold leading-none text-white">{value ?? 0}</span>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      {hint ? <p className="mt-1 text-xs text-white/35">{hint}</p> : null}
    </div>
  )
}

/* ---------------------------------- Panel --------------------------------- */

export function Panel({ title, subtitle, action, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`glass rounded-sm ${className}`}>
      {title || action ? (
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">{title}</h2>
            ) : null}
            {subtitle ? <p className="mt-1 text-xs text-white/40">{subtitle}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  )
}

/* ------------------------------ SearchInput ------------------------------- */

export function SearchInput({ value, onChange, placeholder = 'Search…', id = 'admin-search', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-white/40"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field !pl-10"
      />
    </div>
  )
}

/* ----------------------------- ConfirmDialog ------------------------------ */

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
  busy = false,
  error = '',
}) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} size="sm" label={title}>
      <div className="p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
          <FiAlertTriangle size={20} />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{message}</p>
        {error ? <ErrorBanner message={error} className="mt-4" /> : null}
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} disabled={busy} className="btn btn-ghost btn-sm disabled:opacity-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="btn btn-sm bg-red-500 text-white transition hover:bg-red-400 disabled:opacity-60"
          >
            {busy ? (
              <>
                <FiLoader className="animate-spin" /> Working…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ----------------------------- ImageUploader ------------------------------ */

/**
 * Single:  props → { label, value, onChange }
 * Multiple: props → { label, values, onValuesChange }
 * Uploads immediately via POST /uploads (FormData field: `file`) and hands
 * the returned absolute url back to the form.
 */
export function ImageUploader({ label = 'Image', value, onChange, multiple = false, values, onValuesChange }) {
  const inputId = `upload-${useId()}`
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file) => {
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await apiUpload('/uploads', fd)
      const url = data?.url
      if (!url) throw new Error('Upload finished but no URL was returned.')
      return url
    } catch (err) {
      setError(err?.message || 'Upload failed — check that the API server is running, then try again.')
      return null
    } finally {
      setBusy(false)
    }
  }

  const handlePick = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    const url = await upload(file)
    if (!url) return
    if (multiple) onValuesChange?.([...(values || []), url])
    else onChange?.(url)
  }

  const removeAt = (index) => onValuesChange?.((values || []).filter((_, i) => i !== index))

  return (
    <div>
      <span className="field-label">{label}</span>

      {multiple ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {(values || []).map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 bg-[#141414]"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white/85 opacity-80 transition hover:text-red-400 hover:opacity-100"
              >
                <FiX size={13} />
              </button>
            </div>
          ))}
          <label
            htmlFor={inputId}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed border-bronze/40 text-[10px] uppercase tracking-[0.18em] text-white/45 transition hover:bg-bronze/5 hover:text-bronze-light"
          >
            <FiUpload size={16} className="text-bronze" aria-hidden="true" />
            Add
          </label>
        </div>
      ) : value ? (
        <div className="relative overflow-hidden rounded-sm border border-white/10 bg-[#141414]">
          <img src={value} alt={label} className="h-36 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-sm border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur transition hover:border-bronze/60 hover:text-bronze-light"
            >
              Replace
            </label>
            <button
              type="button"
              onClick={() => onChange?.('')}
              className="rounded-sm border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur transition hover:border-red-500/60 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          {busy ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <FiLoader size={22} className="animate-spin text-bronze" />
            </div>
          ) : null}
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-bronze/40 text-[11px] uppercase tracking-[0.2em] text-white/45 transition hover:bg-bronze/5 hover:text-bronze-light"
        >
          <FiUpload size={20} className="text-bronze" aria-hidden="true" />
          {busy ? 'Uploading…' : 'Click to upload'}
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={handlePick}
        aria-label={`Upload ${label}`}
      />

      {busy ? (
        <p className="mt-2 flex items-center gap-2 text-xs text-bronze-light">
          <FiLoader className="animate-spin" /> Uploading image…
        </p>
      ) : null}
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  )
}

/* -------------------------------- EmptyState ------------------------------ */

export function EmptyState({ icon: Icon = FiInbox, title = 'Nothing here yet', message, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-bronze/30 bg-bronze/10 text-bronze">
        <Icon size={26} />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-white">{title}</h3>
      {message ? <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{message}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

/* ----------------------------- Banners / flash ---------------------------- */

export function ErrorBanner({ message, onDismiss, className = '' }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300 ${className}`}
    >
      <FiAlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-red-300/70 transition hover:text-white"
        >
          <FiX size={14} />
        </button>
      ) : null}
    </div>
  )
}

export function SuccessBanner({ message, className = '' }) {
  if (!message) return null
  return (
    <div
      role="status"
      className={`flex items-center gap-3 border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ${className}`}
    >
      <FiCheck size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

/* ------------------------------- StatusPill ------------------------------- */

export function StatusPill({ status = 'new' }) {
  const isNew = status === 'new'
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
        isNew ? 'bg-bronze/15 text-bronze-light' : 'bg-white/[0.07] text-white/45'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isNew ? 'bg-bronze-light' : 'bg-white/40'}`} />
      {isNew ? 'New' : 'Read'}
    </span>
  )
}

/* ------------------------------- AdminTable ------------------------------- */

export function AdminTable({ children, minWidth = 980 }) {
  return (
    <div className="glass overflow-x-auto rounded-sm">
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  )
}

export function AdminThead({ columns = [] }) {
  return (
    <thead className="border-b border-white/10 bg-white/[0.04]">
      <tr>
        {columns.map((col) => (
          <th
            key={col}
            scope="col"
            className="whitespace-nowrap px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function AdminTbody({ children }) {
  return <tbody className="divide-y divide-white/[0.07]">{children}</tbody>
}
