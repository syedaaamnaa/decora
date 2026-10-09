/**
 * DECORA brand marks — reused in navbar, footer, preloader and admin.
 */

export function LogoMark({ className = 'h-11 w-11' }) {
  return (
    <img src="/Decora.jfif" alt="" aria-hidden="true" className={`${className} rounded-xl object-cover`} />
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
