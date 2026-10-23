import { FiLoader } from 'react-icons/fi'

/**
 * Small dark-luxe UI kit for the cutting optimizer page.
 * Keeps every control on-brand with the rest of the Decora website.
 */

export function Card({ children, className = '', ...rest }) {
  return (
    <section className={`glass bg-white/[0.04] p-5 md:p-6 ${className}`} {...rest}>
      {children}
    </section>
  )
}

const VARIANTS = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
  danger:
    'btn border border-red-400/40 bg-red-500/10 text-red-200 hover:border-red-400/70 hover:bg-red-500/20',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${VARIANTS[variant] || VARIANTS.primary} ${
        size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
      } disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...rest}
    >
      {loading ? <FiLoader className="animate-spin" /> : icon}
      {children}
    </button>
  )
}

export function Input({ label, className = '', id, ...rest }) {
  const input = (
    <input
      id={id}
      className={`cut-field ${className}`}
      {...rest}
    />
  )
  if (!label) return input
  return (
    <label className="block">
      <span className="cut-label">{label}</span>
      {input}
    </label>
  )
}

export function Select({ label, className = '', children, ...rest }) {
  const select = (
    <select className={`cut-field ${className}`} {...rest}>
      {children}
    </select>
  )
  if (!label) return select
  return (
    <label className="block">
      <span className="cut-label">{label}</span>
      {select}
    </label>
  )
}

export function Textarea({ label, className = '', ...rest }) {
  const area = <textarea className={`cut-field ${className}`} {...rest} />
  if (!label) return area
  return (
    <label className="block">
      <span className="cut-label">{label}</span>
      {area}
    </label>
  )
}

const TONES = {
  slate: 'border-white/15 bg-white/[0.08] text-white/70',
  bronze: 'border-bronze/40 bg-bronze/15 text-bronze-light',
  green: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  red: 'border-red-400/40 bg-red-400/10 text-red-300',
}

export function Badge({ tone = 'slate', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${TONES[tone] || TONES.slate} ${className}`}
    >
      {children}
    </span>
  )
}

export function Notice({ tone = 'success', children, onDismiss }) {
  const styles =
    tone === 'error'
      ? 'border-red-400/30 bg-red-500/10 text-red-200'
      : tone === 'warn'
        ? 'border-amber-400/30 bg-amber-500/10 text-amber-200'
        : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
  return (
    <div className={`mb-4 flex items-start justify-between gap-4 border px-4 py-3 text-sm ${styles}`}>
      <span>{children}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70 transition-opacity hover:opacity-100"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  )
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-sm text-white/60">
      <FiLoader className="animate-spin text-bronze" />
      {label}
    </div>
  )
}
