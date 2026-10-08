/**
 * Brand loader — used as the route-level Suspense fallback.
 */
export default function Loader({ label = 'Loading', full = true }) {
  return (
    <div
      className={`${
        full ? 'flex min-h-[60vh] w-full items-center justify-center' : 'flex items-center justify-center p-8'
      }`}
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-bronze border-r-gold" />
          <div className="absolute inset-[6px] rounded-full border border-transparent border-b-bronze-light/70 animate-spin [animation-duration:1.4s]" />
          <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold text-bronze">
            D
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-white/45">
          {label}
        </span>
      </div>
    </div>
  )
}
