import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { apiDelete, apiGet, apiPut } from '@/lib/api'
import { DEFAULT_CONTENT } from '@/data/defaultContent'

const ContentContext = createContext(null)

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/**
 * Deep-merge saved admin content over the bundled defaults.
 * Objects merge key-by-key; arrays and primitives are replaced wholesale
 * (so deleting a list item in the dashboard actually removes it).
 */
export function mergeContent(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override
  }
  const out = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      out[key] = mergeContent(base[key], value)
    } else {
      out[key] = value
    }
  }
  return out
}

export function ContentProvider({ children }) {
  const [saved, setSaved] = useState({})
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const data = await apiGet('/content', {})
    setSaved(isPlainObject(data) ? data : {})
    setReady(true)
    return data
  }, [])

  useEffect(() => {
    let alive = true
    apiGet('/content', {}).then((data) => {
      if (!alive) return
      setSaved(isPlainObject(data) ? data : {})
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  /** Persist one section and update the local override map immediately. */
  const save = useCallback(async (key, data) => {
    await apiPut(`/content/${key}`, data)
    setSaved((prev) => ({ ...prev, [key]: data }))
    return data
  }, [])

  /** Drop an override — the section reverts to bundled defaults. */
  const reset = useCallback(async (key) => {
    await apiDelete(`/content/${key}`)
    setSaved((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const content = useMemo(() => mergeContent(DEFAULT_CONTENT, saved), [saved])

  const value = useMemo(
    () => ({ content, saved, ready, refresh, save, reset }),
    [content, saved, ready, refresh, save, reset],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

/** Full merged site content (defaults + admin overrides). */
export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}

/** Convenience: read a single top-level content section. */
export function useContentSection(key) {
  return useContent().content[key]
}

export default ContentProvider
