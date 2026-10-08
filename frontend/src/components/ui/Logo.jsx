/**
 * DECORA brand marks — reused in navbar, footer, preloader and admin.
 */

export function LogoMark({ className = 'h-11 w-11' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="decora-mark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C8A66B" />
          <stop offset="1" stopColor="#B08D57" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0E0E0E" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="#B08D57" strokeOpacity="0.55" />
      <path
        d="M19 14h14.5c11.4 0 19 7.9 19 18s-7.6 18-19 18H19V14zm8.4 6.9v22.2h5.7c6.9 0 10.9-4.4 10.9-11.1 0-6.7-4-11.1-10.9-11.1h-5.7z"
        fill="url(#decora-mark)"
      />
      <path d="M44.5 14.5 50 14v4.6l-5.5.4z" fill="#C8A66B" />
    </svg>
  )
}

export default function Logo({ className = '', markClass = 'h-11 w-11', showSub = true }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={markClass} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.65rem] font-semibold tracking-[0.16em] text-white">
          DECORA
        </span>
        {showSub && (
          <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.42em] text-bronze-light">
            Civil &amp; Interiors
          </span>
        )}
      </span>
    </span>
  )
}
