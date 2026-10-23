import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiPrinter, FiX } from 'react-icons/fi'
import { Button } from './ui'
import CuttingSheetView from './CuttingSheetView'
import { sheetTitle } from '@/lib/cutting/engine'

export default function PrintDialog({ plan, kind, onClose }) {
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    if (!printing) return undefined
    document.body.classList.add('printing')
    const cleanup = () => {
      document.body.classList.remove('printing')
      setPrinting(false)
    }
    window.addEventListener('afterprint', cleanup)
    const timer = window.setTimeout(() => {
      window.print()
    }, 60)
    return () => {
      document.body.classList.remove('printing')
      window.removeEventListener('afterprint', cleanup)
      window.clearTimeout(timer)
    }
  }, [printing])

  return createPortal(
    <div className="print-root fixed inset-0 z-[900] overflow-y-auto bg-black/85 backdrop-blur-sm print:bg-white">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            {kind === 'plan' ? 'Cutting plan' : 'Piece labels'}{' '}
            {plan.planNumber ? `#${plan.planNumber}` : ''} — {plan.customerName || 'Cutting'}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} icon={<FiX />}>
              Close
            </Button>
            <Button size="sm" onClick={() => setPrinting(true)} icon={<FiPrinter />}>
              Print
            </Button>
          </div>
        </div>

        {kind === 'plan' ? <PlanPages plan={plan} /> : <LabelPages plan={plan} />}
      </div>
    </div>,
    document.body,
  )
}

function PlanPages({ plan }) {
  return (
    <div className="space-y-4">
      {plan.sheets.map((sheet) => (
        <div key={sheet.sheetIndex} className="print-page bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {sheetTitle(sheet)}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  Sheet {sheet.indexLabel} · {sheet.length} × {sheet.width} mm
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {plan.customerName}
                {plan.title ? ` · ${plan.title}` : ''}
                {plan.planNumber ? ` · Plan #${plan.planNumber}` : ''}
                <span className="ml-2 font-semibold uppercase tracking-[0.18em] text-bronze">
                  DECORA
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Kerf {plan.settings.kerf}mm · margin {plan.settings.edgeMargin}mm
              {plan.settings.pieceAllowance ? ` · allowance ${plan.settings.pieceAllowance}mm` : ''}{' '}
              · offcut {(sheet.wasteArea / 1_000_000).toFixed(2)} m²
            </p>
          </div>

          <div className="flex justify-center">
            <CuttingSheetView sheet={sheet} maxWidth={700} />
          </div>
        </div>
      ))}
    </div>
  )
}

function LabelPages({ plan }) {
  const counts = new Map()
  for (const sheet of plan.sheets) {
    for (const p of sheet.placements) {
      const key = `${p.label}::${p.actualLength}x${p.actualWidth}`
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  const rows = Array.from(counts.entries()).map(([key, count]) => {
    const [label, size] = key.split('::')
    const [l, w] = size.split('x').map(Number)
    return { label, length: l, width: w, count }
  })

  const CHUNK = 12
  const pages = []
  for (let i = 0; i < rows.length; i += CHUNK) {
    pages.push(rows.slice(i, i + CHUNK))
  }

  return (
    <div className="space-y-4">
      {pages.map((page, pi) => (
        <div key={pi} className="print-page bg-white p-5 shadow-sm">
          <div className="mb-3 border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              Piece labels — {plan.customerName || 'Cutting'}
            </h3>
            {plan.planNumber ? (
              <p className="text-xs text-slate-500">Plan #{plan.planNumber}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {page.map((row, i) => (
              <div key={i} className="border-2 border-slate-800 p-3 text-center">
                <p className="text-lg font-bold leading-tight">{row.label}</p>
                <p className="mt-1 font-mono text-sm text-slate-700">
                  {row.length} × {row.width} mm
                </p>
                {plan.settings.pieceAllowance ? (
                  <p className="text-[10px] text-slate-500">
                    allowance +{plan.settings.pieceAllowance}mm
                  </p>
                ) : null}
                <span className="mt-1 inline-flex items-center border border-slate-400 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  ×{row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
