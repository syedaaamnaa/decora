import { FiClipboard, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Button, Input, Select } from './ui'
import { emptyStockDraft } from '@/lib/cutting/optimizer'

const UNIT_OPTIONS = [
  { value: 'MM', label: 'mm' },
  { value: 'CM', label: 'cm' },
  { value: 'M', label: 'm' },
  { value: 'INCH', label: 'inch' },
]

export default function StockTable({ value, onChange, onPaste }) {
  function update(id, patch) {
    onChange(value.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  function remove(id) {
    onChange(value.filter((d) => d.id !== id))
  }

  function addRow() {
    const draft = emptyStockDraft()
    draft.label = `Sheet ${value.length + 1}`
    onChange([...value, draft])
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Stock — raw sheets you have
          </h2>
          <p className="mt-1 text-xs text-white/45">
            The optimizer opens new sheets only when the current ones are full.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40">
            {value.length} sheet line{value.length === 1 ? '' : 's'}
          </span>
          <Button variant="ghost" size="sm" onClick={onPaste} icon={<FiClipboard />}>
            Paste
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-center text-sm text-white/45">
          No raw stock yet. Add sheets (e.g. 3210 × 2250 mm — 15 sheets) or paste from Excel.
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="cut-table-head">Label</th>
                <th className="cut-table-head">Material</th>
                <th className="cut-table-head">Length</th>
                <th className="cut-table-head">Width</th>
                <th className="cut-table-head">Qty</th>
                <th className="cut-table-head">Unit</th>
                <th className="cut-table-head">Price</th>
                <th className="cut-table-head" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {value.map((d) => (
                <tr key={d.id} className="align-middle">
                  <td className="cut-table-cell">
                    <Input
                      value={d.label}
                      onChange={(e) => update(d.id, { label: e.target.value })}
                      placeholder="e.g. 6mm Glass"
                      className="min-w-28 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      value={d.material}
                      onChange={(e) => update(d.id, { material: e.target.value })}
                      placeholder="Glass"
                      className="min-w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      type="number"
                      min={1}
                      value={d.length}
                      onChange={(e) => update(d.id, { length: e.target.value })}
                      placeholder="3210"
                      className="w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      type="number"
                      min={1}
                      value={d.width}
                      onChange={(e) => update(d.id, { width: e.target.value })}
                      placeholder="2250"
                      className="w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      type="number"
                      min={1}
                      value={d.quantity}
                      onChange={(e) => update(d.id, { quantity: e.target.value })}
                      className="w-16 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Select
                      value={d.unit}
                      onChange={(e) => update(d.id, { unit: e.target.value })}
                      className="w-20 py-1 text-xs"
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={d.price}
                      onChange={(e) => update(d.id, { price: e.target.value })}
                      placeholder="Optional"
                      className="w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <button
                      type="button"
                      onClick={() => remove(d.id)}
                      className="p-1.5 text-white/35 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      title="Remove sheet"
                      aria-label="Remove sheet"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <Button variant="ghost" size="sm" onClick={addRow} icon={<FiPlus />}>
          Add sheet
        </Button>
      </div>
    </div>
  )
}
