import { useState } from 'react'

/**
 * Lazy-loaded image with shimmer loading state, fade-in,
 * and an elegant branded gradient fallback if the URL ever fails.
 */
export default function LazyImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  eager = false,
  zoom = false,
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-[#141414] ${className}`}>
      {/* loading skeleton */}
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,#141414_30%,#1f1c17_50%,#141414_70%)] bg-[length:200%_100%]" />
      )}

      {errored ? (
        <div className="pattern-grid absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#141414,#0E0E0E_60%,#1a1611)]">
          <span className="font-display text-5xl font-semibold text-bronze/40 select-none">D</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-luxe ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${zoom ? 'group-hover:scale-[1.07]' : ''} ${imgClassName}`}
        />
      )}

      {/* subtle bronze grade over imagery */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(14,14,14,0.35),transparent_55%)] mix-blend-multiply" />
    </div>
  )
}
