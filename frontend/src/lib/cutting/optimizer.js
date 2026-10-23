import { optimize, DEFAULT_CUTTING_SETTINGS } from './engine'

/* ---------------------------------------------------------------------------
 * Editable drafts (one row per table line)
 * ------------------------------------------------------------------------- */

let draftId = 0
function nextId() {
  draftId += 1
  return `row-${draftId}-${Date.now()}`
}

export function emptyDemandDraft() {
  return {
    id: nextId(),
    label: '',
    material: 'Glass',
    customer: '',
    length: '',
    width: '',
    quantity: '1',
    rotation: 'VERTICAL',
    unit: 'MM',
  }
}

export function emptyStockDraft() {
  return {
    id: nextId(),
    label: '',
    material: 'Glass',
    length: '',
    width: '',
    quantity: '1',
    unit: 'MM',
    price: '',
  }
}

function isBlankDemand(d) {
  return (
    !d.label.trim() &&
    !d.length.trim() &&
    !d.width.trim() &&
    !d.quantity.trim() &&
    !d.material.trim() &&
    !d.customer.trim()
  )
}

function isBlankStock(s) {
  return (
    !s.label.trim() &&
    !s.length.trim() &&
    !s.width.trim() &&
    !s.quantity.trim() &&
    !s.material.trim() &&
    !s.price.trim()
  )
}

export function demandErrors(drafts) {
  const errors = []
  drafts.forEach((d, i) => {
    if (isBlankDemand(d)) return
    const row = `Demand row ${i + 1}`
    if (!d.label.trim()) {
      errors.push(`${row}: a label is required`)
      return
    }
    const len = Number(d.length)
    const wid = Number(d.width)
    const qty = Number(d.quantity)
    if (!len || len <= 0) errors.push(`${row} (${d.label}): length must be greater than zero`)
    if (!wid || wid <= 0) errors.push(`${row} (${d.label}): width must be greater than zero`)
    if (!qty || qty < 1 || !Number.isInteger(qty))
      errors.push(`${row} (${d.label}): quantity must be a whole number of at least 1`)
  })
  return errors
}

export function stockErrors(drafts) {
  const errors = []
  drafts.forEach((d, i) => {
    if (isBlankStock(d)) return
    const row = `Stock row ${i + 1}`
    const name = d.label.trim() || `sheet ${i + 1}`
    const len = Number(d.length)
    const wid = Number(d.width)
    const qty = Number(d.quantity)
    if (!len || len <= 0) errors.push(`${row} (${name}): sheet length must be greater than zero`)
    if (!wid || wid <= 0) errors.push(`${row} (${name}): sheet width must be greater than zero`)
    if (!qty || qty < 1 || !Number.isInteger(qty))
      errors.push(`${row} (${name}): quantity must be a whole number of at least 1`)
    const price = d.price.trim()
    if (price && !(Number(price) >= 0)) errors.push(`${row} (${name}): price must be zero or more`)
  })
  return errors
}

export function demandsToApi(drafts) {
  return drafts
    .filter((d) => !isBlankDemand(d))
    .map((d) => ({
      label: d.label.trim(),
      material: d.material.trim() || 'Glass',
      ...(d.customer.trim() ? { customer: d.customer.trim() } : {}),
      length: Number(d.length),
      width: Number(d.width),
      quantity: Number(d.quantity),
      unit: d.unit,
      rotation: d.rotation,
      allowRotation: d.rotation === 'HORIZONTAL',
    }))
}

export function stockToApi(drafts) {
  return drafts
    .filter((s) => !isBlankStock(s))
    .map((d) => ({
      label: d.label.trim(),
      material: d.material.trim() || 'Glass',
      length: Number(d.length),
      width: Number(d.width),
      quantity: Number(d.quantity),
      unit: d.unit,
      ...(d.price.trim() ? { price: Number(d.price) } : {}),
    }))
}

export function demandDraftFromParsed(p) {
  return {
    id: nextId(),
    label: p.label,
    material: p.material || 'Glass',
    customer: p.customer ?? '',
    length: String(p.length),
    width: String(p.width),
    quantity: String(p.quantity),
    rotation: p.allowRotation ? 'HORIZONTAL' : p.rotation,
    unit: p.unit,
  }
}

export function stockDraftFromParsed(p) {
  return {
    id: nextId(),
    label: p.label,
    material: p.material || 'Glass',
    length: String(p.length),
    width: String(p.width),
    quantity: String(p.quantity),
    unit: p.unit,
    price: p.price !== undefined && p.price !== null ? String(p.price) : '',
  }
}

export function settingsToApi(draft) {
  return {
    kerf: Math.max(0, Number(draft.kerf) || 0),
    edgeMargin: Math.max(0, Number(draft.edgeMargin) || 0),
    pieceAllowance: Math.max(0, Number(draft.pieceAllowance) || 0),
    unit: 'MM',
  }
}

export const DEFAULT_SETTINGS_DRAFT = {
  kerf: String(DEFAULT_CUTTING_SETTINGS.kerf),
  edgeMargin: String(DEFAULT_CUTTING_SETTINGS.edgeMargin),
  pieceAllowance: String(DEFAULT_CUTTING_SETTINGS.pieceAllowance),
}

/* ---------------------------------------------------------------------------
 * Draft persistence — survives reloads before a plan is saved
 * ------------------------------------------------------------------------- */

const DRAFT_KEY = 'decora.cutting.draft'

export function loadOptimizerDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.demand) || !Array.isArray(parsed.stock)) return null
    return {
      customerName: parsed.customerName ?? '',
      title: parsed.title ?? '',
      settings: { ...DEFAULT_SETTINGS_DRAFT, ...(parsed.settings || {}) },
      demand: parsed.demand.map((d) => ({ ...emptyDemandDraft(), ...d, id: nextId() })),
      stock: parsed.stock.map((s) => ({ ...emptyStockDraft(), ...s, id: nextId() })),
    }
  } catch {
    return null
  }
}

export function saveOptimizerDraft(state) {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        customerName: state.customerName,
        title: state.title,
        settings: state.settings,
        demand: state.demand.map(({ id, ...rest }) => rest),
        stock: state.stock.map(({ id, ...rest }) => rest),
      }),
    )
  } catch {
    // storage can be unavailable (private mode); drafts simply won't persist
  }
}

export function clearOptimizerDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}

/* ---------------------------------------------------------------------------
 * Saved plans — browser-persisted, mirroring the workshop plan list
 * ------------------------------------------------------------------------- */

const PLANS_KEY = 'decora.cutting.plans'
const MAX_SAVED_PLANS = 50

function readPlans() {
  try {
    const raw = localStorage.getItem(PLANS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writePlans(plans) {
  try {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans.slice(0, MAX_SAVED_PLANS)))
  } catch {
    // ignore quota / unavailable storage
  }
}

export function listSavedPlans() {
  return readPlans().sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
  )
}

function newPlanNumber(plans) {
  return plans.reduce((max, p) => Math.max(max, Number(p.planNumber) || 0), 0) + 1
}

/** Optimize a request and store the result as a new saved plan. */
export function savePlan(request) {
  const computed = optimize(request)
  const plans = readPlans()
  const plan = {
    ...computed,
    _id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    planNumber: newPlanNumber(plans),
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  writePlans([plan, ...plans])
  return plan
}

export function getSavedPlan(id) {
  return readPlans().find((p) => p._id === id) ?? null
}

export function acceptPlan(id) {
  const plans = readPlans()
  const index = plans.findIndex((p) => p._id === id)
  if (index < 0) throw new Error('Cutting plan not found')
  if (plans[index].status === 'ACCEPTED') {
    throw new Error('This cutting plan has already been accepted')
  }
  const plan = {
    ...plans[index],
    status: 'ACCEPTED',
    acceptedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  plans[index] = plan
  writePlans(plans)
  return plan
}

export function deletePlan(id) {
  writePlans(readPlans().filter((p) => p._id !== id))
}

export function clearPlans() {
  const count = readPlans().length
  writePlans([])
  return count
}

/* ---------------------------------------------------------------------------
 * DXF export
 * ------------------------------------------------------------------------- */

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(3))

/**
 * Minimal but importable DXF (R2010-style) containing every sheet as a layer
 * with rectangle outlines and labeled pieces. Pieces are drawn once per
 * occurrence so the file mirrors the visual cutting plan.
 */
export function buildDxf(plan) {
  const parts = []
  let handle = 0x10
  const nextHandle = () => {
    const h = handle.toString(16).toUpperCase()
    handle += 1
    return h
  }

  parts.push('0', 'SECTION', '2', 'HEADER')
  parts.push('9', '$ACADVER', '1', 'AC1021')
  parts.push('9', '$INSUNITS', '70', '4')
  parts.push('9', '$INSBASE', '10', '0', '20', '0', '30', '0')
  parts.push('0', 'ENDSEC')

  parts.push('0', 'SECTION', '2', 'ENTITIES')

  for (const sheet of plan.sheets) {
    const layer = `SHEET-${sheet.indexLabel}`

    parts.push(
      '0', 'LWPOLYLINE', '5', nextHandle(), '100', 'AcDbEntity', '8', layer,
      '100', 'AcDbPolyline', '90', '4', '70', '1',
    )
    // sheet outer boundary
    parts.push('10', '0', '20', '0')
    parts.push('10', fmt(sheet.length), '20', '0')
    parts.push('10', fmt(sheet.length), '20', fmt(sheet.width))
    parts.push('10', '0', '20', fmt(sheet.width))

    for (const p of sheet.placements) {
      const x2 = p.x + p.actualLength
      const y2 = p.y + p.actualWidth
      parts.push(
        '0', 'LWPOLYLINE', '5', nextHandle(), '100', 'AcDbEntity', '8', layer,
        '100', 'AcDbPolyline', '90', '4', '70', '1',
      )
      parts.push('10', fmt(p.x), '20', fmt(p.y))
      parts.push('10', fmt(x2), '20', fmt(p.y))
      parts.push('10', fmt(x2), '20', fmt(y2))
      parts.push('10', fmt(p.x), '20', fmt(y2))

      const cx = (p.x + x2) / 2
      const cy = (p.y + y2) / 2
      const height = Math.max(40, Math.min(0.03 * sheet.length, 200))
      const text = `${p.label} ${p.actualLength}x${p.actualWidth}`
      parts.push(
        '0', 'TEXT', '5', nextHandle(), '100', 'AcDbEntity', '8', layer,
        '100', 'AcDbText',
        '10', fmt(cx), '20', fmt(cy), '30', '0',
        '40', fmt(height),
        '1', text,
        '50', '0',
      )
    }
  }

  parts.push('0', 'ENDSEC')
  parts.push('0', 'EOF')

  return parts.join('\r\n')
}

export function downloadFile(filename, content, mime = 'application/octet-stream') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function downloadDxf(plan) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const name = `cutting-plan-${plan.planNumber ?? 'draft'}-${stamp}.dxf`
  downloadFile(name, buildDxf(plan), 'application/dxf')
}
