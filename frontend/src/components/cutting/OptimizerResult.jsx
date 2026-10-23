import { useState } from 'react'
import {
  FiCheckCircle,
  FiClipboard,
  FiDownload,
  FiPrinter,
  FiRefreshCw,
  FiSave,
  FiTag,
} from 'react-icons/fi'
import { IoSwapHorizontal, IoSwapVertical } from 'react-icons/io5'
import { Badge, Button, Card } from './ui'
import CuttingSheetView from './CuttingSheetView'
import { sheetTitle } from '@/lib/cutting/engine'

export default function OptimizerResult({
  plan,
  saved,
  saving,
  accepting,
  error,
  onSave,
  onAccept,
  onPrint,
  onLabels,
  onDxf,
}) {
  const [mirror, setMirror] = useState('none')
  const accepted = plan.status === 'ACCEPTED'
  const stats = plan.statistics || {}

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {plan.planNumber ? (
            <span className="font-semibold text-white">Plan #{plan.planNumber}</span>
          ) : (
            <span className="font-semibold text-white/45">Unsaved plan</span>
          )}
          {plan.customerName ? <span className="text-white/70">{plan.customerName}</span> : null}
          {plan.title ? <span className="text-white/40">{plan.title}</span> : null}
          <Badge tone={accepted ? 'green' : 'bronze'}>{accepted ? 'Accepted' : 'Draft'}</Badge>
          {accepted && plan.acceptedAt ? (
            <span className="text-xs text-white/35">
              accepted {new Date(plan.acceptedAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onPrint} icon={<FiPrinter />}>
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={onLabels} icon={<FiTag />}>
            Labels
          </Button>
          <Button variant="ghost" size="sm" onClick={onDxf} icon={<FiDownload />}>
            DXF
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMirror('h')}
            icon={<IoSwapHorizontal />}
            title="Mirror horizontally"
          >
            Mirror H
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMirror('v')}
            icon={<IoSwapVertical />}
            title="Mirror vertically"
          >
            Mirror V
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMirror('none')}
            icon={<FiRefreshCw />}
            title="Reset mirror"
          >
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={onSave} loading={saving} icon={<FiSave />}>
            {saved ? 'Save copy' : 'Save'}
          </Button>
          {!accepted ? (
            <Button size="sm" onClick={onAccept} loading={accepting} icon={<FiCheckCircle />}>
              Accept
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sheets used" value={stats.totalSheets ?? plan.sheets.length} />
        <Stat label="Utilization" value={`${(stats.utilizationPercent ?? 0).toFixed(1)}%`} accent />
        <Stat label="Offcut" value={`${(stats.wastePercent ?? 0).toFixed(1)}%`} />
        <Stat
          label="Sheet area"
          value={`${((stats.totalSheetArea ?? 0) / 1_000_000).toFixed(2)} m²`}
        />
      </div>

      {plan.sheets.map((sheet) => (
        <Card key={sheet.sheetIndex} className="mb-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">
              {sheetTitle(sheet)}
              <span className="ml-2 font-normal text-white/45">
                Sheet {sheet.indexLabel} · {sheet.length} × {sheet.width} mm
              </span>
            </h3>
            <span className="text-xs text-white/40">
              {sheet.placements.length} piece{sheet.placements.length === 1 ? '' : 's'} · offcut{' '}
              {(sheet.wasteArea / 1_000_000).toFixed(2)} m²
            </span>
          </div>

          <div className="flex justify-center">
            <CuttingSheetView sheet={sheet} mirror={mirror} />
          </div>
        </Card>
      ))}

      {saved ? (
        <p className="flex items-center gap-2 text-xs text-white/35">
          <FiClipboard /> Saved. This plan is reopenable from the saved plans list.
        </p>
      ) : (
        <p className="text-xs text-white/35">
          Not saved yet — click <strong className="text-white/60">Save</strong> to keep it, or{' '}
          <strong className="text-white/60">Accept</strong> to accept and save it for the workshop.
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, accent = false }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className={`mt-1 font-display text-xl ${accent ? 'text-bronze-light' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}
