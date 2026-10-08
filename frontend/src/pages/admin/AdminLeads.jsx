import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiEdit2,
  FiEye,
  FiInbox,
  FiLoader,
  FiMail,
  FiPhone,
  FiTrash2,
} from 'react-icons/fi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import Modal from '@/components/ui/Modal'
import Loader from '@/components/ui/Loader'
import { apiDelete, apiList, apiPatch, apiRequest } from '@/lib/api'
import {
  AdminTable,
  AdminTbody,
  AdminThead,
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  SearchInput,
  StatusPill,
  formatDate,
  idOf,
  timeAgo,
} from './admin-ui'

const COLUMNS = ['Name', 'Email', 'Phone', 'Service', 'Message', 'Status', 'Received', 'Actions']

const hay = (m) => [m.name, m.email, m.phone, m.service, m.message].filter(Boolean).join(' ').toLowerCase()

/**
 * /admin/leads — inbound contact-form messages (search, filter, read, delete).
 */
export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selected, setSelected] = useState(null)
  const [detailBusy, setDetailBusy] = useState(false)
  const [detailError, setDetailError] = useState('')

  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  /** Server-side search with graceful client-side fallback when offline. */
  const load = useCallback(async (term = '') => {
    setLoading(true)
    try {
      const t = (term || '').trim()
      if (t) {
        try {
          const data = await apiRequest(`/messages?search=${encodeURIComponent(t)}`)
          setLeads(Array.isArray(data) ? data : [])
          return
        } catch {
          /* API offline or errored → fall back to filtering the full list */
        }
      }
      const data = await apiList('/messages', [])
      setLeads(t ? data.filter((m) => hay(m).includes(t.toLowerCase())) : data)
    } finally {
      setLoading(false)
    }
  }, [])

  /* debounced search */
  useEffect(() => {
    const timer = window.setTimeout(() => load(query), 350)
    return () => window.clearTimeout(timer)
  }, [query, load])

  const visible = useMemo(() => {
    if (statusFilter === 'all') return leads
    return leads.filter((l) => (l.status || 'new') === statusFilter)
  }, [leads, statusFilter])

  const newCount = useMemo(() => leads.filter((l) => (l.status || 'new') === 'new').length, [leads])

  const openDetail = (lead) => {
    setDetailError('')
    setSelected(lead)
  }

  const markRead = async () => {
    if (!selected) return
    setDetailBusy(true)
    setDetailError('')
    try {
      await apiPatch(`/messages/${idOf(selected)}`, { status: 'read' })
      setSelected({ ...selected, status: 'read' })
      await load(query)
    } catch (err) {
      setDetailError(err?.message || 'Could not update this lead. Please try again.')
    } finally {
      setDetailBusy(false)
    }
  }

  const deleteFromDetail = async () => {
    if (!selected) return
    setDetailBusy(true)
    setDetailError('')
    try {
      await apiDelete(`/messages/${idOf(selected)}`)
      setSelected(null)
      await load(query)
    } catch (err) {
      setDetailError(err?.message || 'Could not delete this lead. Please try again.')
    } finally {
      setDetailBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeletingBusy(true)
    setError('')
    try {
      await apiDelete(`/messages/${idOf(deleting)}`)
      if (selected && idOf(selected) === idOf(deleting)) setSelected(null)
      setDeleting(null)
      await load(query)
    } catch (err) {
      setError(err?.message || 'Could not delete this lead. Please try again.')
    } finally {
      setDeletingBusy(false)
    }
  }

  const phoneDigits = selected?.phone ? String(selected.phone).replace(/\D/g, '') : ''

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Inbox</span>
          <h1 className="heading-lg mt-4">Contact Leads</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Every inquiry submitted through the website&apos;s contact and inquiry forms.
          </p>
        </div>
        <SearchInput
          id="leads-search"
          value={query}
          onChange={setQuery}
          placeholder="Search name, email, phone…"
          className="lg:w-80"
        />
      </div>

      {error ? <ErrorBanner message={error} onDismiss={() => setError('')} className="mt-6" /> : null}

      {/* ---------- toolbar ---------- */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
          {[
            { key: 'all', label: 'All' },
            { key: 'new', label: 'New' },
            { key: 'read', label: 'Read' },
          ].map(({ key, label }) => {
            const active = statusFilter === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] transition ${
                  active
                    ? 'border-bronze bg-bronze/15 text-bronze-light'
                    : 'border-white/10 bg-white/[0.04] text-white/55 hover:border-bronze/40 hover:text-white'
                }`}
              >
                {label}
                {key === 'new' && newCount > 0 ? ` (${newCount})` : ''}
              </button>
            )
          })}
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
          {visible.length} of {leads.length} messages
        </span>
      </div>

      {/* ---------- list ---------- */}
      <div className="mt-6">
        {loading ? (
          <div className="glass rounded-sm">
            <Loader full={false} label="Loading leads" />
          </div>
        ) : visible.length === 0 ? (
          <div className="glass rounded-sm">
            <EmptyState
              icon={FiInbox}
              title={leads.length === 0 ? 'No leads yet' : 'Nothing to show'}
              message={
                leads.length === 0
                  ? 'Inquiries from the contact form will land here.'
                  : 'No leads match the current filter.'
              }
            />
          </div>
        ) : (
          <>
            {/* desktop table */}
            <div className="hidden md:block">
              <AdminTable minWidth={1040}>
                <AdminThead columns={COLUMNS} />
                <AdminTbody>
                  {visible.map((lead) => (
                    <tr
                      key={idOf(lead) || lead.createdAt}
                      onClick={() => openDetail(lead)}
                      className="cursor-pointer transition hover:bg-white/[0.04]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium text-white">{lead.name || '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-white/55">{lead.email || '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-white/55">{lead.phone || '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-white/55">{lead.service || 'General'}</td>
                      <td className="max-w-[260px] px-4 py-3.5">
                        <span className="block truncate text-white/45" title={lead.message}>
                          {lead.message || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusPill status={lead.status || 'new'} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-white/45">
                        <span title={formatDate(lead.createdAt)}>{timeAgo(lead.createdAt) || formatDate(lead.createdAt)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDetail(lead)
                            }}
                            aria-label={`View message from ${lead.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-bronze/50 hover:text-bronze-light"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setError('')
                              setDeleting(lead)
                            }}
                            aria-label={`Delete message from ${lead.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-red-500/50 hover:text-red-400"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AdminTbody>
              </AdminTable>
            </div>

            {/* mobile stacked cards */}
            <div className="space-y-4 md:hidden">
              {visible.map((lead, i) => (
                <motion.button
                  key={idOf(lead) || lead.createdAt}
                  type="button"
                  onClick={() => openDetail(lead)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
                  className="glass w-full rounded-sm p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{lead.name || 'Unnamed'}</p>
                      <p className="mt-0.5 truncate text-xs text-white/45">{lead.email || '—'}</p>
                    </div>
                    <StatusPill status={lead.status || 'new'} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-white/50">{lead.message}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
                    <span>{lead.service || 'General'}</span>
                    <span>{timeAgo(lead.createdAt) || formatDate(lead.createdAt)}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ---------- detail modal ---------- */}
      <Modal open={!!selected} onClose={() => setSelected(null)} size="md" label="Lead detail">
        {selected ? (
          <div className="p-6 sm:p-8">
            <div className="mb-6 pr-12">
              <span className="eyebrow">Lead</span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white">{selected.name || 'Unnamed'}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusPill status={selected.status || 'new'} />
                <span className="text-xs text-white/45">
                  Received {formatDate(selected.createdAt)} · {timeAgo(selected.createdAt) || 'recently'}
                </span>
              </div>
            </div>

            <dl className="space-y-3 border-y border-white/10 py-5 text-sm">
              <div className="flex items-center gap-3">
                <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.2em] text-white/40">Service</dt>
                <dd className="text-white/75">{selected.service || 'General inquiry'}</dd>
              </div>
              {selected.email ? (
                <div className="flex items-center gap-3">
                  <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.2em] text-white/40">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${selected.email}`}
                      className="inline-flex items-center gap-2 text-bronze-light transition hover:text-white"
                    >
                      <FiMail size={13} aria-hidden="true" /> {selected.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {selected.phone ? (
                <div className="flex flex-wrap items-center gap-3">
                  <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.2em] text-white/40">Phone</dt>
                  <dd className="flex flex-wrap items-center gap-4">
                    <a
                      href={`tel:${selected.phone}`}
                      className="inline-flex items-center gap-2 text-bronze-light transition hover:text-white"
                    >
                      <FiPhone size={13} aria-hidden="true" /> {selected.phone}
                    </a>
                    {phoneDigits ? (
                      <a
                        href={`https://wa.me/${phoneDigits}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-300 transition hover:text-white"
                      >
                        <IoLogoWhatsapp size={15} aria-hidden="true" /> WhatsApp
                      </a>
                    ) : null}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-5">
              <span className="field-label">Message</span>
              <p className="whitespace-pre-wrap rounded-sm border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white/75">
                {selected.message || '—'}
              </p>
            </div>

            {detailError ? <ErrorBanner message={detailError} className="mt-5" /> : null}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={deleteFromDetail}
                disabled={detailBusy}
                className="btn btn-ghost btn-sm text-red-300 hover:text-red-400 disabled:opacity-50"
              >
                <FiTrash2 /> Delete
              </button>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  disabled={detailBusy}
                  className="btn btn-ghost btn-sm disabled:opacity-50"
                >
                  Close
                </button>
                {(selected.status || 'new') === 'new' ? (
                  <button
                    type="button"
                    onClick={markRead}
                    disabled={detailBusy}
                    className="btn btn-primary btn-sm disabled:opacity-60"
                  >
                    {detailBusy ? <FiLoader className="animate-spin" /> : <FiEdit2 />} Mark as Read
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* ---------- delete confirm ---------- */}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete message from ${deleting?.name || 'this contact'}?`}
        message="This permanently removes the inquiry. This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
        busy={deletingBusy}
        error={error}
      />
    </div>
  )
}
