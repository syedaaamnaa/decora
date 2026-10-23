import { sheetTitle } from '@/lib/cutting/engine'

export default function CuttingSheetView({ sheet, maxWidth = 880, mirror = 'none' }) {
  const scale = Math.min(maxWidth / sheet.length, 620 / sheet.width)
  const viewW = sheet.length * scale
  const viewH = sheet.width * scale
  const flipX = mirror === 'h' || mirror === 'hv'
  const flipY = mirror === 'v' || mirror === 'hv'

  const marginStartX = flipX ? sheet.length - sheet.usableStartX - sheet.usableLength : sheet.usableStartX
  const marginStartY = flipY ? sheet.width - sheet.usableStartY - sheet.usableWidth : sheet.usableStartY

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="cut-sheet relative mx-auto overflow-hidden border-2 border-white/70 bg-white"
        style={{ width: viewW, height: viewH }}
        aria-label={`${sheetTitle(sheet)} sheet ${sheet.indexLabel}`}
      >
        {/* usable / margin zone */}
        <div
          className="absolute border border-dashed border-slate-400"
          style={{
            left: marginStartX * scale,
            top: marginStartY * scale,
            width: sheet.usableLength * scale,
            height: sheet.usableWidth * scale,
          }}
        />
        {sheet.placements.map((p, index) => (
          <PieceRect
            key={`${p.itemRef}-${index}`}
            placement={p}
            scale={scale}
            flipX={flipX}
            flipY={flipY}
            sheetLength={sheet.length}
            sheetWidth={sheet.width}
          />
        ))}
        {/* edge margin labels */}
        <span className="absolute left-1 top-0.5 text-[10px] font-semibold text-slate-500">
          {sheet.usableStartY}mm margin
        </span>
        <span className="absolute left-0.5 top-1.5 text-[10px] font-semibold text-slate-500">
          {sheet.usableStartX}mm margin
        </span>
      </div>
    </div>
  )
}

function PieceRect({ placement, scale, flipX, flipY, sheetLength, sheetWidth }) {
  const x = flipX ? sheetLength - placement.x - placement.actualLength : placement.x
  const y = flipY ? sheetWidth - placement.y - placement.actualWidth : placement.y
  const text = `${placement.label} · ${placement.actualLength}×${placement.actualWidth}`
  const boxW = placement.actualLength * scale
  const boxH = placement.actualWidth * scale
  const base = Math.max(9, Math.min(12, scale * 40))
  const fitWidth = (boxW - 6) / (text.length * 0.56)
  const fitHeight = (boxH - 4) / 1.3
  const fontSize = Math.max(6, Math.min(base, fitWidth, fitHeight))
  const showVerticalText = placement.actualLength < placement.actualWidth

  return (
    <div
      style={{
        position: 'absolute',
        left: x * scale,
        top: y * scale,
        width: boxW,
        height: boxH,
        backgroundColor: '#ffffff',
        color: '#0f172a',
        border: '2px solid #0f172a',
        fontSize,
      }}
      className="flex items-center justify-center overflow-hidden rounded-[3px] leading-tight"
      title={`${placement.label} — ${placement.actualLength}×${placement.actualWidth} mm${
        placement.rotated ? ' (rotated)' : ''
      } at (${placement.x}, ${placement.y})`}
    >
      <span
        className="px-0.5 text-center font-bold"
        style={{
          writingMode: showVerticalText ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: 'mixed',
          transform: showVerticalText ? 'rotate(180deg)' : undefined,
        }}
      >
        {text}
        {placement.rotated ? ' ⤾' : ''}
      </span>
    </div>
  )
}
