import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiBarChart2,
  FiBox,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiGlobe,
  FiHome,
  FiInfo,
  FiLayers,
  FiMail,
  FiMenu,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiStar,
  FiTrash2,
} from 'react-icons/fi'

import { useContent } from '@/context/ContentProvider'
import { CONTENT_SECTIONS } from '@/data/contentSchema'
import { DEFAULT_CONTENT } from '@/data/defaultContent'
import {
  ErrorBanner,
  ImageUploader,
  Panel,
  SuccessBanner,
} from './admin-ui'

const ICONS = {
  globe: FiGlobe,
  menu: FiMenu,
  chart: FiBarChart2,
  layers: FiLayers,
  star: FiStar,
  home: FiHome,
  info: FiInfo,
  mail: FiMail,
  briefcase: FiBriefcase,
  box: FiBox,
  sparkle: FiStar,
}

const clone = (v) => JSON.parse(JSON.stringify(v ?? null))

const ICON_BTN =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/12 bg-white/[0.05] text-white/60 transition-colors hover:border-bronze/50 hover:text-bronze-light'
const ICON_BTN_DANGER =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/12 bg-white/[0.05] text-white/60 transition-colors hover:border-red-500/60 hover:text-red-300'

const emptyValueFor = (field) => {
  switch (field.type) {
    case 'number':
      return 0
    case 'image':
      return ''
    case 'images':
    case 'strings':
    case 'list':
      return []
    case 'object':
      return Object.fromEntries((field.fields || []).map((f) => [f.name, emptyValueFor(f)]))
    default:
      return ''
  }
}

const emptyItemFor = (itemFields = []) =>
  Object.fromEntries(itemFields.map((f) => [f.name, emptyValueFor(f)]))

/* ------------------------------- Field controls ------------------------------ */

function StringsEditor({ value, onChange, placeholder = 'Item' }) {
  const items = Array.isArray(value) ? value : []
  const update = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="field"
            value={item ?? ''}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
          />
          <button type="button" className={ICON_BTN} aria-label="Move up" onClick={() => move(i, -1)}>
            <FiChevronUp size={15} />
          </button>
          <button type="button" className={ICON_BTN} aria-label="Move down" onClick={() => move(i, 1)}>
            <FiChevronDown size={15} />
          </button>
          <button type="button" className={ICON_BTN_DANGER} aria-label="Remove" onClick={() => remove(i)}>
            <FiTrash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange([...items, ''])}>
        <FiPlus /> Add item
      </button>
    </div>
  )
}

function ListEditor({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  const itemFields = field.itemFields || field.fields || []

  const update = (i, key, v) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const itemTitle = (item, i) => {
    const first = itemFields.find((f) => f.type === 'text')
    const label = first ? item?.[first.name] : ''
    return label || `${field.label || 'Item'} ${i + 1}`
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-sm border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze-light">
              {itemTitle(item, i)}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" className={ICON_BTN} aria-label="Move up" onClick={() => move(i, -1)}>
                <FiChevronUp size={15} />
              </button>
              <button type="button" className={ICON_BTN} aria-label="Move down" onClick={() => move(i, 1)}>
                <FiChevronDown size={15} />
              </button>
              <button type="button" className={ICON_BTN_DANGER} aria-label="Remove" onClick={() => remove(i)}>
                <FiTrash2 size={15} />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {itemFields.map((sub) => (
              <Field
                key={sub.name}
                field={sub}
                value={item?.[sub.name]}
                onChange={(v) => update(i, sub.name, v)}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onChange([...items, emptyItemFor(itemFields)])}
      >
        <FiPlus /> Add {field.label || 'item'}
      </button>
    </div>
  )
}

function Field({ field, value, onChange }) {
  const label = field.label || field.name

  if (field.type === 'object') {
    return (
      <fieldset className="rounded-sm border border-white/10 p-4">
        <legend className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
          {label}
        </legend>
        <div className="space-y-4">
          {(field.fields || []).map((sub) => (
            <Field
              key={sub.name}
              field={sub}
              value={value?.[sub.name]}
              onChange={(v) => onChange({ ...(value || {}), [sub.name]: v })}
            />
          ))}
        </div>
      </fieldset>
    )
  }

  if (field.type === 'list') {
    return (
      <div>
        <span className="field-label">{label}</span>
        <ListEditor field={field} value={value} onChange={onChange} />
      </div>
    )
  }

  if (field.type === 'strings') {
    return (
      <div>
        <span className="field-label">{label}</span>
        <StringsEditor value={value} onChange={onChange} placeholder={`${label}…`} />
      </div>
    )
  }

  if (field.type === 'image') {
    return <ImageUploader label={label} value={value || ''} onChange={onChange} />
  }

  if (field.type === 'images') {
    return (
      <ImageUploader label={label} multiple values={value || []} onValuesChange={onChange} />
    )
  }

  if (field.type === 'textarea') {
    return (
      <label className="block">
        <span className="field-label">{label}</span>
        <textarea
          rows={3}
          className="field resize-y"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    )
  }

  if (field.type === 'number') {
    return (
      <label className="block">
        <span className="field-label">{label}</span>
        <input
          type="number"
          className="field"
          value={value ?? 0}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </label>
    )
  }

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

/* --------------------------------- The screen -------------------------------- */

export default function AdminContent() {
  const { content, save, reset } = useContent()
  const [activeKey, setActiveKey] = useState(CONTENT_SECTIONS[0].key)

  const section = useMemo(
    () => CONTENT_SECTIONS.find((s) => s.key === activeKey) || CONTENT_SECTIONS[0],
    [activeKey],
  )

  const [draft, setDraft] = useState(() => clone(content[activeKey]))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  // Re-seed the draft whenever the section changes or saved content arrives.
  useEffect(() => {
    setDraft(clone(content[section.key]))
  }, [section.key, content])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content[section.key]),
    [draft, content, section.key],
  )

  const handleSave = async () => {
    setBusy(true)
    setError('')
    setDone('')
    try {
      await save(section.key, draft)
      setDone(`“${section.label}” saved — the website is updated.`)
    } catch (err) {
      setError(err?.message || 'Could not save. Is the API server running?')
    } finally {
      setBusy(false)
    }
  }

  const handleReset = async () => {
    setBusy(true)
    setError('')
    setDone('')
    try {
      await reset(section.key)
      setDraft(clone(DEFAULT_CONTENT[section.key]))
      setDone(`“${section.label}” reset to default.`)
    } catch (err) {
      setError(err?.message || 'Could not reset this section.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Website</p>
          <h1 className="heading-md mt-2 text-3xl">Site Content</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Edit every section of the public website — text, statistics, footer links, services and
            images. Changes go live immediately.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Section list */}
        <nav aria-label="Content sections" className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass overflow-hidden rounded-sm">
            <ul className="divide-y divide-white/[0.06]">
              {CONTENT_SECTIONS.map((s) => {
                const Icon = ICONS[s.icon] || FiGlobe
                const active = s.key === activeKey
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveKey(s.key)
                        setError('')
                        setDone('')
                      }}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm transition-colors ${
                        active
                          ? 'bg-bronze/12 text-bronze-light'
                          : 'text-white/65 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <Icon size={16} className={active ? 'text-bronze-light' : 'text-white/45'} />
                      <span className="truncate">{s.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Editor */}
        <motion.div key={section.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Panel
            title={section.label}
            subtitle={section.description}
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={busy}
                  className="btn btn-ghost btn-sm disabled:opacity-50"
                  title="Revert this section to its original default"
                >
                  <FiRefreshCw /> Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={busy || !dirty}
                  className="btn btn-primary btn-sm disabled:opacity-50"
                >
                  <FiSave /> {busy ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
                </button>
              </div>
            }
          >
            {error ? <ErrorBanner message={error} className="mb-5" onDismiss={() => setError('')} /> : null}
            {done ? <SuccessBanner message={done} className="mb-5" /> : null}

            <div className="space-y-7">
              {section.rootList ? (
                <ListEditor
                  field={{ label: section.label, itemFields: section.itemFields }}
                  value={draft}
                  onChange={setDraft}
                />
              ) : (
                (section.fields || []).map((field) => (
                  <Field
                    key={field.name}
                    field={field}
                    value={draft?.[field.name]}
                    onChange={(v) => setDraft((d) => ({ ...(d || {}), [field.name]: v }))}
                  />
                ))
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
              <p className="text-xs text-white/40">
                {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
              </p>
              <button
                type="button"
                onClick={handleSave}
                disabled={busy || !dirty}
                className="btn btn-primary btn-sm disabled:opacity-50"
              >
                <FiSave /> Save changes
              </button>
            </div>
          </Panel>
        </motion.div>
      </div>
    </div>
  )
}
