import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiClipboard, FiX } from 'react-icons/fi'
import { Button, Textarea } from './ui'
import {
  DEMAND_PASTE_HINT,
  STOCK_PASTE_HINT,
  parseDemandText,
  parseStockText,
} from '@/lib/cutting/paste'

export default function PasteModal({ kind, onClose, onApply }) {
  const [text, setText] = useState('')
  const [replace, setReplace] = useState(false)

  const result = useMemo(() => {
    if (!text.trim()) return null
    return kind === 'demand' ? parseDemandText(text) : parseStockText(text)
  }, [kind, text])

  const validCount = result ? result.items.length : 0
  const anyError = result ? result.errors.length > 0 : false

  function apply() {
    if (!result) return
    onApply(result.items, replace)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col border border-white/10 bg-ink shadow-glass-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <FiClipboard className="text-bronze" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Paste {kind === 'demand' ? 'demand' : 'stock'} from Excel
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/45 transition-colors hover:text-white"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-xs text-white/45">
            Copy the rows from Excel and paste here with{' '}
            <kbd className="border border-white/15 bg-white/[0.06] px-1 text-white/70">Ctrl</kbd>+
            <kbd className="border border-white/15 bg-white/[0.06] px-1 text-white/70">V</kbd>. A
            header row is recognized automatically.
          </p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            rows={7}
            spellCheck={false}
            className="font-mono text-xs"
            placeholder={kind === 'demand' ? DEMAND_PASTE_HINT : STOCK_PASTE_HINT}
          />

          {result ? (
            <>
              {result.errors.length > 0 ? (
                <div className="mt-3 border border-red-400/30 bg-red-500/10 px-3 py-2">
                  <p className="text-xs font-semibold text-red-300">
                    {result.errors.length} row{result.errors.length === 1 ? '' : 's'} skipped
                  </p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-red-200/80">
                    {result.errors.slice(0, 8).map((e, i) => (
                      <li key={i}>{e.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {validCount > 0 ? (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium text-emerald-300">
                    {validCount} row{validCount === 1 ? '' : 's'} ready to{' '}
                    {replace ? 'replace' : 'add'}.
                  </p>
                  <PreviewRows kind={kind} items={result.items.slice(0, 6)} />
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-3 border border-white/10 bg-white/[0.03] px-3 py-3 text-xs text-white/50">
              {kind === 'demand' ? (
                <ol className="list-inside list-decimal space-y-0.5">
                  <li>
                    <strong className="text-white/70">Label</strong>,{' '}
                    <strong className="text-white/70">Length</strong>,{' '}
                    <strong className="text-white/70">Width</strong>,{' '}
                    <strong className="text-white/70">Qty</strong> — required. Numbers may include
                    units (&quot;1200 mm&quot;).
                  </li>
                  <li>
                    <strong className="text-white/70">Material</strong>,{' '}
                    <strong className="text-white/70">Rotation</strong> (90/yes = rotatable, blank =
                    fixed), <strong className="text-white/70">Customer</strong> — optional.
                  </li>
                </ol>
              ) : (
                <ol className="list-inside list-decimal space-y-0.5">
                  <li>
                    <strong className="text-white/70">Length</strong>,{' '}
                    <strong className="text-white/70">Width</strong>,{' '}
                    <strong className="text-white/70">Qty</strong> — required.
                  </li>
                  <li>
                    <strong className="text-white/70">Label</strong>,{' '}
                    <strong className="text-white/70">Material</strong>,{' '}
                    <strong className="text-white/70">Price</strong> — optional.
                  </li>
                </ol>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5">
          <label className="flex items-center gap-2 text-xs text-white/55">
            <input
              type="checkbox"
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
              className="h-3.5 w-3.5 accent-bronze"
            />
            Replace existing rows instead of appending
          </label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={apply}
              disabled={!result || validCount === 0 || anyError}
            >
              {replace ? 'Replace' : 'Add'} rows
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function PreviewRows({ kind, items }) {
  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04]">
            {kind === 'demand' ? (
              <>
                <th className="cut-table-head">Label</th>
                <th className="cut-table-head">Length</th>
                <th className="cut-table-head">Width</th>
                <th className="cut-table-head">Qty</th>
                <th className="cut-table-head">Rotation</th>
                <th className="cut-table-head">Customer</th>
              </>
            ) : (
              <>
                <th className="cut-table-head">Label</th>
                <th className="cut-table-head">Material</th>
                <th className="cut-table-head">Length</th>
                <th className="cut-table-head">Width</th>
                <th className="cut-table-head">Qty</th>
                <th className="cut-table-head">Price</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {items.map((it, idx) => (
            <tr key={idx} className="text-white/70">
              {kind === 'demand' ? (
                <>
                  <td className="cut-table-cell whitespace-nowrap">{it.label}</td>
                  <td className="cut-table-cell whitespace-nowrap">
                    {it.length}
                    {it.unit}
                  </td>
                  <td className="cut-table-cell">{it.width}</td>
                  <td className="cut-table-cell">{it.quantity}</td>
                  <td className="cut-table-cell whitespace-nowrap">
                    {it.allowRotation ? 'Rotatable' : 'Fixed'}
                  </td>
                  <td className="cut-table-cell">{it.customer || '—'}</td>
                </>
              ) : (
                <>
                  <td className="cut-table-cell whitespace-nowrap">{it.label}</td>
                  <td className="cut-table-cell">{it.material}</td>
                  <td className="cut-table-cell whitespace-nowrap">
                    {it.length}
                    {it.unit}
                  </td>
                  <td className="cut-table-cell">{it.width}</td>
                  <td className="cut-table-cell">{it.quantity}</td>
                  <td className="cut-table-cell">{it.price !== undefined ? it.price : '—'}</td>
                </>
              )}
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td className="cut-table-cell text-red-300">No valid rows.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
