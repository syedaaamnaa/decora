/**
 * End-to-end API smoke test.
 * Start the API first (npm run demo or npm start), then run:
 *   node scripts/smoke.mjs
 */
const BASE = process.env.API_URL || 'http://localhost:5000/api'

let passed = 0
let failed = 0

const check = (name, condition, extra = '') => {
  if (condition) {
    passed += 1
    console.log(`  ✓ ${name}`)
  } else {
    failed += 1
    console.log(`  ✗ ${name} ${extra}`)
  }
}

async function call(path, { method = 'GET', body, token, expect = 200 } = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await res.json().catch(() => null)
    return { status: res.status, json, ok: res.status === expect }
  } catch (err) {
    return { status: 0, json: null, ok: false, error: err.message }
  }
}

console.log(`\nDECORA API smoke test → ${BASE}\n`)

/* 1. Health */
const health = await call('/health', { expect: 200 })
check('GET /health responds', health.ok, health.error || `got ${health.status}`)
check('health reports success shape', health.json?.success === true)

/* 2. Auth */
const login = await call('/auth/login', {
  method: 'POST',
  body: { email: 'admin@decora.com', password: 'Decora@2026' },
})
check('POST /auth/login (valid credentials)', login.ok, login.json?.message)
const token = login.json?.data?.token
check('login returns a JWT', Boolean(token))

const badLogin = await call('/auth/login', {
  method: 'POST',
  body: { email: 'admin@decora.com', password: 'wrong' },
  expect: 401,
})
check('POST /auth/login (bad credentials → 401)', badLogin.ok)

const me = await call('/auth/me', { token })
check('GET /auth/me', me.ok)

const noAuth = await call('/stats', { expect: 401 })
check('GET /stats without token → 401', noAuth.ok)

/* 3. Public reads */
const projects = await call('/projects')
check('GET /projects', projects.ok && Array.isArray(projects.json?.data))
check('projects seeded', (projects.json?.data?.length || 0) > 0)

const single = await call(`/projects/${projects.json?.data?.[0]?.slug || 'the-aurelia-residence'}`)
check('GET /projects/:slug', single.ok)

const products = await call('/products')
check('GET /products', products.ok && Array.isArray(products.json?.data))

const testimonials = await call('/testimonials')
check('GET /testimonials', testimonials.ok)

const settings = await call('/settings')
check('GET /settings', settings.ok)

/* 4. Public lead */
const lead = await call('/messages', {
  method: 'POST',
  body: {
    name: 'Smoke Test',
    email: 'smoke@test.dev',
    phone: '+91 00000 00000',
    service: 'Interior Design',
    message: 'Automated smoke test lead.',
  },
  expect: 201,
})
check('POST /messages (public lead)', lead.ok, lead.json?.message)

/* 5. Admin CRUD lifecycle */
const created = await call('/projects', {
  method: 'POST',
  token,
  body: {
    title: 'ZZ Smoke Test Project',
    category: 'Civil',
    location: 'Test City',
    client: 'CI Bot',
    year: 2026,
    description: 'Temporary project created by the smoke test.',
    scope: ['Testing'],
    images: [],
    featured: false,
  },
  expect: 201,
})
check('POST /projects (create)', created.ok, created.json?.message)
const createdId = created.json?.data?._id
check('created project has slug', Boolean(created.json?.data?.slug))

if (createdId) {
  const updated = await call(`/projects/${createdId}`, {
    method: 'PUT',
    token,
    body: { title: 'ZZ Smoke Test Project (edited)', location: 'Updated City' },
  })
  check('PUT /projects/:id (update)', updated.ok, updated.json?.message)
  check('update persisted', updated.json?.data?.location === 'Updated City')

  const removed = await call(`/projects/${createdId}`, { method: 'DELETE', token })
  check('DELETE /projects/:id', removed.ok, removed.json?.message)

  const gone = await call(`/projects/${createdId}`, { expect: 404 })
  check('deleted project → 404', gone.ok)
}

/* 6. Messages admin + stats */
const leads = await call('/messages', { token })
check('GET /messages (auth)', leads.ok && Array.isArray(leads.json?.data))

const stats = await call('/stats', { token })
check('GET /stats (auth)', stats.ok && typeof stats.json?.data?.projects === 'number')

const leadId = lead.json?.data?._id
if (leadId) {
  const patched = await call(`/messages/${leadId}`, {
    method: 'PATCH',
    token,
    body: { status: 'read' },
  })
  check('PATCH /messages/:id', patched.ok)
  const deletedLead = await call(`/messages/${leadId}`, { method: 'DELETE', token })
  check('DELETE /messages/:id', deletedLead.ok)
}

/* 7. Uploads */
const fd = new FormData()
const png = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='), (c) => c.charCodeAt(0))
fd.append('file', new Blob([png], { type: 'image/png' }), 'smoke.png')
try {
  const res = await fetch(`${BASE}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  })
  const json = await res.json().catch(() => null)
  check('POST /uploads (multipart)', res.status < 300 && Boolean(json?.data?.url), json?.message)
} catch (err) {
  check('POST /uploads (multipart)', false, err.message)
}

console.log(`\nResult: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
