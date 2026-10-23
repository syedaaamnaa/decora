import { FiClipboard, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Button, Input, Select } from './ui'
import { emptyDemandDraft } from '@/lib/cutting/optimizer'

const ROTATION_OPTIONS = [
  { value: 'VERTICAL', label: 'Fixed' },
  { value: 'HORIZONTAL', label: 'Rotatable' },
]

const UNIT_OPTIONS = [
  { value: 'MM', label: 'mm' },
  { value: 'CM', label: 'cm' },
  { value: 'M', label: 'm' },
  { value: 'INCH', label: 'inch' },
]

export default function DemandTable({ value, onChange, onPaste }) {
  function update(id, patch) {
    onChange(value.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  function remove(id) {
    onChange(value.filter((d) => d.id !== id))
  }

  function addRow() {
    const draft = emptyDemandDraft()
    draft.label = `Piece ${value.length + 1}`
    onChange([...value, draft])
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
            Demand — what the customer needs
          </h2>
          <p className="mt-1 text-xs text-white/45">
            Every piece to cut, with its size, quantity and glass type.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40">
            {value.length} piece type{value.length === 1 ? '' : 's'}
          </span>
          <Button variant="ghost" size="sm" onClick={onPaste} icon={<FiClipboard />}>
            Paste
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-center text-sm text-white/45">
          No pieces yet. Add rows manually or paste from Excel.
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="cut-table-head">Label</th>
                <th className="cut-table-head">Length</th>
                <th className="cut-table-head">Width</th>
                <th className="cut-table-head">Qty</th>
                <th className="cut-table-head">Material</th>
                <th className="cut-table-head">Rotation</th>
                <th className="cut-table-head">Unit</th>
                <th className="cut-table-head">Customer</th>
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
                      placeholder="e.g. Bedroom 1"
                      className="min-w-28 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      type="number"
                      min={1}
                      value={d.length}
                      onChange={(e) => update(d.id, { length: e.target.value })}
                      placeholder="1200"
                      title="Length in the selected unit"
                      className="w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Input
                      type="number"
                      min={1}
                      value={d.width}
                      onChange={(e) => update(d.id, { width: e.target.value })}
                      placeholder="600"
                      title="Width in the selected unit"
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
                    <Input
                      value={d.material}
                      onChange={(e) => update(d.id, { material: e.target.value })}
                      placeholder="Glass"
                      className="min-w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <Select
                      value={d.rotation}
                      onChange={(e) => update(d.id, { rotation: e.target.value })}
                      className="w-28 py-1 text-xs"
                    >
                      {ROTATION_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </Select>
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
                      value={d.customer}
                      onChange={(e) => update(d.id, { customer: e.target.value })}
                      placeholder="Optional"
                      className="min-w-24 py-1 text-xs"
                    />
                  </td>
                  <td className="cut-table-cell">
                    <button
                      type="button"
                      onClick={() => remove(d.id)}
                      className="p-1.5 text-white/35 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      title="Remove piece"
                      aria-label="Remove piece"
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
          Add piece
        </Button>
      </div>
    </div>
  )
}
