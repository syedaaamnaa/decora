// Clipboard / Excel paste parsing for the cutting optimizer.
//
// Excel copies a selection as tab-separated rows. We also accept semicolon and
// comma separated (CSV) text, skip a header row when it is recognized, and
// tolerate thousands separators, unit suffixes ("1200 mm", "1.2 m") and common
// rotation spellings ("90", "yes", "rotatable", "fixed", ...).

export function splitDelimited(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  // detect the delimiter used on the first non-empty line with more than one cell
  const sample = lines.find((l) => l.trim().length > 0) ?? ''
  const useTab = sample.includes('\t')
  const useSemicolon = !useTab && sample.includes(';')
  const rows = []
  for (const line of lines) {
    if (line.trim().length === 0) continue
    if (useTab) {
      rows.push(line.split('\t'))
    } else if (useSemicolon) {
      rows.push(line.split(';'))
    } else {
      rows.push(splitCsv(line))
    }
  }
  return rows.map((cells) => cells.map((c) => c.trim()))
}

function splitCsv(line) {
  const out = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      out.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  out.push(current)
  return out
}

export const COLUMN_KEYS = new Set([
  'length',
  'width',
  'quantity',
  'material',
  'rotation',
  'label',
  'customer',
  'price',
  'unit',
  'sheet',
])

export function normalizeColumnName(cell) {
  const t = cell.toLowerCase().replace(/[^a-z0-9]/g, '')
  const map = {
    length: 'length',
    len: 'length',
    l: 'length',
    long: 'length',
    size: 'length',
    width: 'width',
    wid: 'width',
    w: 'width',
    breadth: 'width',
    quantity: 'quantity',
    qty: 'quantity',
    q: 'quantity',
    count: 'quantity',
    pcs: 'quantity',
    pieces: 'quantity',
    nos: 'quantity',
    no: 'quantity',
    number: 'quantity',
    material: 'material',
    mat: 'material',
    type: 'material',
    rotation: 'rotation',
    rot: 'rotation',
    rotate: 'rotation',
    rotatable: 'rotation',
    turn: 'rotation',
    rt: 'rotation',
    label: 'label',
    name: 'label',
    piece: 'label',
    mark: 'label',
    ref: 'label',
    refno: 'label',
    code: 'label',
    part: 'label',
    item: 'label',
    customer: 'customer',
    cust: 'customer',
    client: 'customer',
    party: 'customer',
    price: 'price',
    cost: 'price',
    rate: 'price',
    amount: 'price',
    unit: 'unit',
    units: 'unit',
    sheet: 'sheet',
    stock: 'sheet',
    sheetno: 'sheet',
    stockname: 'sheet',
    stockname2: 'sheet',
  }
  return map[t] ?? ''
}

export function looksLikeHeader(cells) {
  if (cells.length === 0) return false
  const known = cells.map(normalizeColumnName).filter((c) => c !== '')
  if (known.length === 0) return false
  // a header row must have the majority of its cells recognizable
  return known.length >= Math.min(3, cells.length)
}

function cellAt(cells, index) {
  if (index === undefined) return ''
  const v = cells[index]
  return v ? v.trim() : ''
}

export function parseNumeric(raw) {
  let t = raw.trim()
  if (!t) return null
  t = t.replace(/\s*(mm|cm|m|meter|meters|inch|inches|in|ft|feet)\s*$/i, '')
  t = t.replace(/[^\d.,-]/g, '')
  if (!t) return null
  let normalized = t
  if (t.includes(',')) {
    const parts = t.split(',')
    const trailing3 = parts[parts.length - 1].length === 3
    const noDot = !t.includes('.')
    if (trailing3 && noDot && parts.length > 1) {
      normalized = t.replace(/,/g, '')
    } else {
      normalized = t.replace(/\./g, '').replace(',', '.')
    }
  }
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

export function parseDimension(raw) {
  const t = raw.trim().toLowerCase()
  const m = t.match(/^\s*([\d.,]+)\s*(mm|cm|m|meter|meters|inch|inches|in)?\s*$/)
  if (!m) return null
  const value = parseNumeric(m[1])
  if (value === null || value <= 0) return null
  const suffix = m[2]
  let unit = 'MM'
  if (suffix) {
    if (suffix === 'mm') unit = 'MM'
    else if (suffix.startsWith('cm')) unit = 'CM'
    else if (suffix.startsWith('m')) unit = 'M'
    else if (suffix.startsWith('in')) unit = 'INCH'
  }
  return { value, unit }
}

export function parseUnit(raw) {
  const t = raw.trim().toLowerCase()
  if (t.includes('cm')) return 'CM'
  if (t.includes('inch') || t === 'in') return 'INCH'
  if (t === 'm' || t === 'meter' || t === 'meters') return 'M'
  if (t === 'mm') return 'MM'
  return null
}

export function parseQuantity(raw) {
  const n = parseNumeric(raw)
  if (n === null) return null
  return Math.max(0, Math.floor(n))
}

export function parseRotation(raw) {
  const t = raw.trim().toLowerCase()
  if (!t) return { rotation: 'VERTICAL', allowRotation: false }
  const allow = /^(horizontal|h|yes|y|true|1|on|r|rot|rotat|rotat(e|ed|able|ion)|90|90deg|allow|allowed|any|can|could)$/i
  const block = /^(vertical|v|no|n|false|0|off|fix(ed)?|lock(ed)?|none|-)$/i
  if (block.test(t)) return { rotation: 'VERTICAL', allowRotation: false }
  if (allow.test(t)) return { rotation: 'HORIZONTAL', allowRotation: true }
  return { rotation: 'VERTICAL', allowRotation: false }
}

export function mapDemandRows(rows, headerIndex) {
  const keys = rows[headerIndex].map(normalizeColumnName)
  const col = (k) => {
    const idx = keys.indexOf(k)
    return idx >= 0 ? idx : undefined
  }
  const items = []
  const errors = []

  rows.slice(headerIndex + 1).forEach((cells, i) => {
    const rowNumber = headerIndex + i + 2
    const label = cellAt(cells, col('label')) || `Piece ${i + 1}`

    const lenDim = parseDimension(cellAt(cells, col('length')))
    const widDim = parseDimension(cellAt(cells, col('width')))

    if (!lenDim || !widDim) {
      errors.push({
        rowNumber,
        message: `Row ${rowNumber}: length and width must be numbers (e.g. 1200 or 1200 mm)`,
      })
      return
    }

    const qtyRaw = cellAt(cells, col('quantity'))
    const parsedQty = qtyRaw ? parseQuantity(qtyRaw) : 1
    if (qtyRaw && parsedQty === null) {
      errors.push({ rowNumber, message: `Row ${rowNumber}: quantity "${qtyRaw}" is not a valid number` })
      return
    }
    const quantity = parsedQty ?? 1
    if (quantity < 1) {
      errors.push({ rowNumber, message: `Row ${rowNumber}: quantity must be at least 1` })
      return
    }

    const unitOverride = col('unit') !== undefined ? parseUnit(cellAt(cells, col('unit'))) : null
    const unit = unitOverride ?? lenDim.unit

    const rot = parseRotation(cellAt(cells, col('rotation')))

    items.push({
      label,
      material: cellAt(cells, col('material')) || 'Glass',
      customer: cellAt(cells, col('customer')),
      length: lenDim.value,
      width: widDim.value,
      quantity,
      unit,
      rotation: rot.rotation,
      allowRotation: rot.allowRotation,
      rowNumber,
    })
  })

  return { items, skippedHeaders: headerIndex >= 0, errors }
}

export function mapStockRows(rows, headerIndex) {
  const keys = rows[headerIndex].map(normalizeColumnName)
  const col = (k) => {
    const idx = keys.indexOf(k)
    return idx >= 0 ? idx : undefined
  }
  const items = []
  const errors = []

  rows.slice(headerIndex + 1).forEach((cells, i) => {
    const rowNumber = headerIndex + i + 2
    const label = cellAt(cells, col('sheet')) || cellAt(cells, col('label')) || `Sheet ${i + 1}`

    const lenDim = parseDimension(cellAt(cells, col('length')))
    const widDim = parseDimension(cellAt(cells, col('width')))

    if (!lenDim || !widDim) {
      errors.push({
        rowNumber,
        message: `Row ${rowNumber}: length and width must be numbers (e.g. 3210 or 3210 mm)`,
      })
      return
    }

    const qtyRaw = cellAt(cells, col('quantity'))
    const parsedQty = qtyRaw ? parseQuantity(qtyRaw) : 1
    if (qtyRaw && parsedQty === null) {
      errors.push({ rowNumber, message: `Row ${rowNumber}: quantity "${qtyRaw}" is not a valid number` })
      return
    }
    const quantity = parsedQty ?? 1
    if (quantity < 1) {
      errors.push({ rowNumber, message: `Row ${rowNumber}: quantity must be at least 1` })
      return
    }

    const unitOverride = col('unit') !== undefined ? parseUnit(cellAt(cells, col('unit'))) : null
    const unit = unitOverride ?? lenDim.unit

    const priceRaw = cellAt(cells, col('price'))
    const price = priceRaw ? parseNumeric(priceRaw) : undefined
    if (priceRaw && price === null) {
      errors.push({ rowNumber, message: `Row ${rowNumber}: price "${priceRaw}" is not a valid number` })
      return
    }

    items.push({
      label,
      material: cellAt(cells, col('material')) || 'Glass',
      length: lenDim.value,
      width: widDim.value,
      quantity,
      unit,
      price: typeof price === 'number' && price >= 0 ? price : undefined,
      rowNumber,
    })
  })

  return { items, skippedHeaders: headerIndex >= 0, errors }
}

export function parseRows(text) {
  const rows = splitDelimited(text)
  let headerIndex = -1
  if (rows.length > 0 && looksLikeHeader(rows[0])) {
    headerIndex = 0
  }
  return { rows, headerIndex }
}

const DEMAND_COLUMNS = ['label', 'length', 'width', 'quantity', 'material', 'rotation', 'customer']
const STOCK_COLUMNS = ['sheet', 'material', 'length', 'width', 'quantity', 'unit', 'price']

export function parseDemandText(text) {
  const parsed = parseRows(text)
  if (parsed.rows.length === 0) return { items: [], skippedHeaders: false, errors: [] }
  if (parsed.headerIndex < 0) {
    parsed.rows.unshift(DEMAND_COLUMNS)
    parsed.headerIndex = 0
  }
  return mapDemandRows(parsed.rows, parsed.headerIndex)
}

export function parseStockText(text) {
  const parsed = parseRows(text)
  if (parsed.rows.length === 0) return { items: [], skippedHeaders: false, errors: [] }
  if (parsed.headerIndex < 0) {
    parsed.rows.unshift(STOCK_COLUMNS)
    parsed.headerIndex = 0
  }
  return mapStockRows(parsed.rows, parsed.headerIndex)
}

export const DEMAND_PASTE_HINT = [
  'Label\tLength\tWidth\tQty\tMaterial\tRotation\tCustomer',
  'Bedroom 1\t1200\t600\t2\t6mm Glass\t90\tAhmed',
  'Kitchen\t1000\t500\t3\t6mm Glass\t\tAhmed',
].join('\n')

export const STOCK_PASTE_HINT = [
  'Label\tMaterial\tLength\tWidth\tQty\tPrice',
  '6mm Glass\tGlass\t3210\t2250\t10\t1250',
  'Offcut A\tGlass\t2440\t1830\t4\t',
].join('\n')

export function countColumnKeys(rows, headerIndex) {
  const keys = rows[headerIndex].map(normalizeColumnName)
  return new Set(keys.filter((k) => k !== ''))
}
