/**
 * Glass cutting optimizer engine.
 *
 * Deterministic 2D packing: MaxRects free-rectangle list + Best Short Side Fit.
 * This is a direct port of the workshop cutting engine so the website produces
 * exactly the same cutting sheets as the desktop software.
 *
 * All dimensions are integer millimetres. Each placed footprint is inflated by
 * `kerf` on both axes so adjacent pieces always keep a blade lane; the reported
 * placement keeps the physical cut size.
 */

const UNIT_MULTIPLIER = { MM: 1, CM: 10, M: 1000, INCH: 25.4 }

export const DEFAULT_CUTTING_SETTINGS = {
  kerf: 3,
  edgeMargin: 5,
  pieceAllowance: 0,
  unit: 'MM',
}

export class CuttingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CuttingError'
  }
}

function toMm(value, unit) {
  if (unit === 'INCH') {
    return Math.round((value * 127) / 5)
  }
  return Math.round(value * (UNIT_MULTIPLIER[unit] ?? 1))
}

function scoreFit(free, w, h) {
  const right = free.w - w
  const below = free.h - h
  return {
    short: Math.min(right, below),
    long: Math.max(right, below),
    area: free.w * free.h,
    y: free.y,
    x: free.x,
  }
}

function compareScores(a, b) {
  if (a.short !== b.short) return a.short - b.short
  if (a.long !== b.long) return a.long - b.long
  if (a.area !== b.area) return a.area - b.area
  if (a.y !== b.y) return a.y - b.y
  return a.x - b.x
}

function splitRect(rect, pw, ph) {
  const res = []
  const right = rect.w - pw
  const below = rect.h - ph
  if (right >= below) {
    if (right > 0) res.push({ x: rect.x + pw, y: rect.y, w: right, h: ph })
    if (below > 0) res.push({ x: rect.x, y: rect.y + ph, w: rect.w, h: below })
  } else {
    if (below > 0) res.push({ x: rect.x, y: rect.y + ph, w: pw, h: below })
    if (right > 0) res.push({ x: rect.x + pw, y: rect.y, w: right, h: rect.h })
  }
  return res
}

function pruneRects(list) {
  const seen = new Set()
  const out = []
  for (const a of list) {
    if (a.w <= 0 || a.h <= 0) continue
    let contained = false
    for (const b of list) {
      if (a === b) continue
      if (
        b.x <= a.x &&
        b.y <= a.y &&
        b.x + b.w >= a.x + a.w &&
        b.y + b.h >= a.y + a.h &&
        (b.x < a.x || b.y < a.y || b.w > a.w || b.h > a.h)
      ) {
        contained = true
        break
      }
    }
    if (contained) continue
    const key = `${a.x},${a.y},${a.w},${a.h}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ ...a })
  }
  return out
}

function emptyResult() {
  return {
    sheets: [],
    statistics: {
      totalSheets: 0,
      totalSheetArea: 0,
      usedArea: 0,
      wasteArea: 0,
      wastePercent: 0,
      utilizationPercent: 0,
    },
  }
}

function buildInstances(piecesIn, kerf) {
  const instances = []
  for (const piece of piecesIn) {
    const footprintW = piece.cutLength + kerf
    const footprintH = piece.cutWidth + kerf
    for (let i = 0; i < piece.quantity; i++) {
      instances.push({ piece, footprintW, footprintH })
    }
  }
  return instances
}

function sortInstances(instances) {
  instances.sort((a, b) => {
    const areaA = a.footprintW * a.footprintH
    const areaB = b.footprintW * b.footprintH
    if (areaB !== areaA) return areaB - areaA
    const longA = Math.max(a.footprintW, a.footprintH)
    const longB = Math.max(b.footprintW, b.footprintH)
    if (longB !== longA) return longB - longA
    const shortA = Math.min(a.footprintW, a.footprintH)
    const shortB = Math.min(b.footprintW, b.footprintH)
    if (shortB !== shortA) return shortB - shortA
    return a.piece.itemRef.localeCompare(b.piece.itemRef)
  })
}

function computeStatistics(sheets) {
  let usedArea = 0
  let totalSheetArea = 0
  for (const sheet of sheets) {
    const sheetArea = sheet.length * sheet.width
    totalSheetArea += sheetArea
    const sheetUsed = sheet.items.reduce((sum, it) => sum + it.actualLength * it.actualWidth, 0)
    usedArea += sheetUsed
    sheet.wasteArea = sheetArea - sheetUsed
  }
  const wasteArea = Math.max(0, totalSheetArea - usedArea)
  const wastePercent = totalSheetArea > 0 ? (wasteArea / totalSheetArea) * 100 : 0
  const utilizationPercent = totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0
  return {
    totalSheets: sheets.length,
    totalSheetArea,
    usedArea,
    wasteArea,
    wastePercent,
    utilizationPercent,
  }
}

/** Pack pieces onto a heterogeneous stock list (each line has its own size). */
export function generateCuttingPlanFromStock(piecesIn, stockIn, settings) {
  const kerf = Math.max(0, Math.round(settings.kerf || 0))
  const margin = Math.max(0, Math.round(settings.edgeMargin || 0))

  const instances = buildInstances(piecesIn, kerf)
  if (instances.length === 0) return emptyResult()

  const stock = stockIn
    .filter((s) => s.quantity >= 1 && s.length > 0 && s.width > 0)
    .map((s) => ({ entry: s, left: s.quantity, used: 0 }))
    .sort((a, b) => b.entry.length * b.entry.width - a.entry.length * a.entry.width)

  if (stock.length === 0) {
    throw new CuttingError('No usable stock sheets were provided')
  }

  for (const inst of instances) {
    const fits = stock.some(({ entry }) => {
      const len = entry.length - 2 * margin
      const wid = entry.width - 2 * margin
      return (
        (inst.footprintW <= len && inst.footprintH <= wid) ||
        (inst.footprintH <= len && inst.footprintW <= wid)
      )
    })
    if (!fits) {
      throw new CuttingError(
        `Piece "${inst.piece.label}" (${inst.piece.cutLength}×${inst.piece.cutWidth} mm) does not fit on any stock sheet`,
      )
    }
  }

  sortInstances(instances)

  const sheets = []
  const open = []

  function openNewSheet(stockIndex) {
    const s = stock[stockIndex]
    const sheetLength = s.entry.length
    const sheetWidth = s.entry.width
    const usableLength = Math.max(1, sheetLength - 2 * margin)
    const usableWidth = Math.max(1, sheetWidth - 2 * margin)
    const idx = sheets.length
    const sheet = {
      sheetIndex: idx,
      stockRef: s.entry.stockRef,
      stockLabel: s.entry.label,
      materialName: s.entry.materialName,
      length: sheetLength,
      width: sheetWidth,
      usableStartX: margin,
      usableStartY: margin,
      usableLength,
      usableWidth,
      items: [],
      wasteArea: sheetLength * sheetWidth,
    }
    sheets.push(sheet)
    const os = {
      sheet,
      freeRects: [{ x: margin, y: margin, w: usableLength, h: usableWidth }],
      stockIndex,
    }
    open.push(os)
    return os
  }

  for (const inst of instances) {
    const { piece, footprintW, footprintH } = inst
    const orientations = [{ w: footprintW, h: footprintH, rotated: false }]
    if (piece.allowRotation) {
      orientations.push({ w: footprintH, h: footprintW, rotated: true })
    }

    let best = null

    for (const os of open) {
      for (const rect of os.freeRects) {
        for (const o of orientations) {
          if (o.w <= rect.w && o.h <= rect.h) {
            const score = scoreFit(rect, o.w, o.h)
            if (!best || compareScores(score, best.score) < 0) {
              best = { score, sheetIndex: os.sheet.sheetIndex, rect, rotated: o.rotated }
            }
          }
        }
      }
    }

    if (!best) {
      const candidates = stock
        .map((s, index) => ({ s, index }))
        .filter(({ s }) => s.left > 0)
        .filter(({ s }) => {
          const len = s.entry.length - 2 * margin
          const wid = s.entry.width - 2 * margin
          return (
            (footprintW <= len && footprintH <= wid) ||
            (footprintH <= len && footprintW <= wid)
          )
        })
        .sort((a, b) => a.s.entry.length * a.s.entry.width - b.s.entry.length * b.s.entry.width)

      if (candidates.length === 0) {
        throw new CuttingError(
          `Not enough stock of "${piece.materialName}". No stock sheet can fit a ${piece.cutLength}×${piece.cutWidth} mm piece.`,
        )
      }

      const chosen = candidates[0]
      stock[chosen.index].left -= 1
      stock[chosen.index].used += 1
      const os = openNewSheet(chosen.index)
      for (const rect of os.freeRects) {
        for (const o of orientations) {
          if (o.w <= rect.w && o.h <= rect.h) {
            const score = scoreFit(rect, o.w, o.h)
            if (!best || compareScores(score, best.score) < 0) {
              best = { score, sheetIndex: os.sheet.sheetIndex, rect, rotated: o.rotated }
            }
          }
        }
      }
      if (!best) {
        throw new CuttingError(
          `Piece "${piece.label}" could not be placed on a ${chosen.s.entry.label} sheet`,
        )
      }
    }

    const sheetIndex = best.sheetIndex
    const rect = best.rect
    const x = rect.x
    const y = rect.y
    const placedW = best.rotated ? footprintH : footprintW
    const placedH = best.rotated ? footprintW : footprintH

    const os = open.find((o) => o.sheet.sheetIndex === sheetIndex)
    os.freeRects = os.freeRects.filter((r) => r !== rect)
    os.freeRects.push(...splitRect(rect, placedW, placedH))
    os.freeRects = pruneRects(os.freeRects)

    os.sheet.items.push({
      itemRef: piece.itemRef,
      label: piece.label,
      materialName: piece.materialName,
      requestedLength: piece.requestedLength,
      requestedWidth: piece.requestedWidth,
      quantity: piece.quantity,
      rotation: piece.rotation,
      rotated: best.rotated,
      x,
      y,
      actualLength: best.rotated ? piece.cutWidth : piece.cutLength,
      actualWidth: best.rotated ? piece.cutLength : piece.cutWidth,
      sheetIndex,
    })
  }

  return { sheets, statistics: computeStatistics(sheets) }
}

/* ---------------------------------------------------------------------------
 * Request → engine conversion (same contract as the workshop API)
 * ------------------------------------------------------------------------- */

function demandToPiece(item, index, settings) {
  const lengthMm = Math.max(1, toMm(Number(item.length), item.unit))
  const widthMm = Math.max(1, toMm(Number(item.width), item.unit))
  const allowRotation = Boolean(item.allowRotation)
  return {
    itemRef: `d${index + 1}`,
    label: item.label,
    materialName: item.material || 'Glass',
    requestedLength: lengthMm,
    requestedWidth: widthMm,
    quantity: item.quantity,
    rotation: allowRotation ? 'HORIZONTAL' : 'VERTICAL',
    cutLength: lengthMm + settings.pieceAllowance,
    cutWidth: widthMm + settings.pieceAllowance,
    allowRotation,
  }
}

function stockToPack(item, index) {
  return {
    stockRef: `s${index + 1}`,
    label: item.label,
    materialName: item.material || 'Glass',
    length: Math.max(1, toMm(Number(item.length), item.unit)),
    width: Math.max(1, toMm(Number(item.width), item.unit)),
    quantity: item.quantity,
    price: item.price,
  }
}

function sheetToOut(sheet) {
  return {
    sheetIndex: sheet.sheetIndex,
    indexLabel: sheet.sheetIndex + 1,
    length: sheet.length,
    width: sheet.width,
    usableStartX: sheet.usableStartX,
    usableStartY: sheet.usableStartY,
    usableLength: sheet.usableLength,
    usableWidth: sheet.usableWidth,
    placements: sheet.items.map((item) => ({
      itemRef: item.itemRef,
      label: item.label,
      materialName: item.materialName,
      length: item.requestedLength,
      width: item.requestedWidth,
      quantity: item.quantity,
      rotation: item.rotation,
      rotated: item.rotated,
      x: item.x,
      y: item.y,
      actualLength: item.actualLength,
      actualWidth: item.actualWidth,
      sheetIndex: item.sheetIndex,
    })),
    wasteArea: sheet.wasteArea,
    materialName: sheet.materialName,
    stockRef: sheet.stockRef,
    stockLabel: sheet.stockLabel,
  }
}

function statisticsFromSheets(sheets) {
  const totalSheetArea = sheets.reduce((sum, s) => sum + s.length * s.width, 0)
  const usedArea = sheets.reduce(
    (sum, s) => sum + s.placements.reduce((a, p) => a + p.actualLength * p.actualWidth, 0),
    0,
  )
  const wasteArea = Math.max(0, totalSheetArea - usedArea)
  return {
    totalSheets: sheets.length,
    totalSheetArea,
    usedArea,
    wasteArea,
    wastePercent: totalSheetArea > 0 ? (wasteArea / totalSheetArea) * 100 : 0,
    utilizationPercent: totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0,
  }
}

/** Optimize a full request: { title, customerName, demand, stock, settings }. */
export function optimize(input) {
  const settings = {
    ...DEFAULT_CUTTING_SETTINGS,
    ...(input.settings || {}),
    unit: input.settings?.unit || 'MM',
  }
  const pieces = input.demand.map((d, i) => demandToPiece(d, i, settings))
  const stockList = input.stock.map((s, i) => stockToPack(s, i))

  const result = generateCuttingPlanFromStock(pieces, stockList, {
    kerf: settings.kerf,
    edgeMargin: settings.edgeMargin,
    pieceAllowance: settings.pieceAllowance,
  })

  const sheets = result.sheets.map(sheetToOut)

  return {
    title: input.title ?? '',
    customerName: input.customerName ?? '',
    status: 'DRAFT',
    demand: input.demand.map((d) => ({
      ...d,
      material: d.material || 'Glass',
      rotation: d.allowRotation ? 'HORIZONTAL' : 'VERTICAL',
    })),
    stock: input.stock.map((s) => ({ ...s, material: s.material || 'Glass' })),
    settings,
    sheets,
    statistics: statisticsFromSheets(sheets),
    acceptedAt: null,
  }
}

/** Display name for a sheet header. */
export function sheetTitle(sheet) {
  return sheet.materialName || sheet.placements?.[0]?.materialName || sheet.stockLabel || 'Stock'
}
