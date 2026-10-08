/**
 * DECORA — API layer
 * Talks to the Express backend when available, and degrades gracefully
 * to local seed data so the website always works (demo-safe).
 */

const BASE = `${import.meta.env.VITE_API_URL || ''}/api`

const TOKEN_KEY = 'decora_token'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token) => {
  try {
    token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

export const clearToken = () => setToken(null)

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, formData, timeout = 8000, auth = true } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const headers = {}
    const token = auth && getToken()
    if (token) headers.Authorization = `Bearer ${token}`

    let payload
    if (formData) {
      payload = formData
    } else if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
      payload = JSON.stringify(body)
    }

    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: payload,
      signal: controller.signal,
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      throw new ApiError(json?.message || `Request failed (${res.status})`, res.status)
    }

    return json && Object.prototype.hasOwnProperty.call(json, 'data') ? json.data : json
  } finally {
    clearTimeout(timer)
  }
}

/** GET with automatic fallback to local data (used by public pages). */
export async function apiGet(path, fallback) {
  try {
    return await request(path)
  } catch {
    console.info(`[DECORA] API offline — using bundled content for ${path}`)
    return fallback
  }
}

/** GET that always resolves to an array. */
export async function apiList(path, fallback = []) {
  const data = await apiGet(path, fallback)
  return Array.isArray(data) ? data : fallback
}

export const apiPost = (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts })
export const apiPut = (path, body, opts = {}) => request(path, { method: 'PUT', body, ...opts })
export const apiPatch = (path, body, opts = {}) => request(path, { method: 'PATCH', body, ...opts })
export const apiDelete = (path, opts = {}) => request(path, { method: 'DELETE', ...opts })
export const apiUpload = (path, formData, opts = {}) =>
  request(path, { method: 'POST', formData, timeout: 30000, ...opts })

/**
 * Public form submission (contact / inquiry).
 * Tries the API first; if the backend is offline the lead is queued
 * in localStorage so it can be re-synced later — the user still gets
 * a confirmation.
 */
export async function submitLead(path, payload) {
  try {
    await request(path, { method: 'POST', body: payload, auth: false, timeout: 6000 })
    return { success: true, offline: false }
  } catch (err) {
    if (err?.status) throw err // server responded with a real error → surface it
    try {
      const queue = JSON.parse(localStorage.getItem('decora_pending_leads') || '[]')
      queue.push({ ...payload, queuedAt: new Date().toISOString() })
      localStorage.setItem('decora_pending_leads', JSON.stringify(queue))
    } catch {
      /* ignore */
    }
    console.info('[DECORA] Backend offline — lead saved locally for sync')
    return { success: true, offline: true }
  }
}

/** Raw request — throws ApiError with .status (use when errors must surface). */
export { request as apiRequest }

/** Backend liveness probe → data or null when offline. */
export async function apiHealth() {
  try {
    return await request('/health', { auth: false, timeout: 4000 })
  } catch {
    return null
  }
}

/* ------------------------------- AUTH ------------------------------- */

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
    timeout: 8000,
  })
  setToken(data.token)
  return data.user
}

export async function fetchMe() {
  return request('/auth/me')
}
