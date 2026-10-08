import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiEye, FiLoader } from 'react-icons/fi'
import Logo from '@/components/ui/Logo'
import { getToken, login } from '@/lib/api'
import { img } from '@/data/seed'
import { ErrorBanner } from './admin/admin-ui'

const DEMO = { email: 'admin@decora.com', password: 'Decora@2026' }

/**
 * /admin/login — full-screen split login for the DECORA admin dashboard.
 */
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err?.status
          ? err.message || 'Invalid email or password.'
          : 'Cannot reach the API server. Start the backend (npm run dev in /backend) and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO.email)
    setPassword(DEMO.password)
    setError('')
  }

  if (getToken()) return <Navigate to="/admin" replace />

  return (
    <div className="grid min-h-screen bg-ink md:grid-cols-2">
      {/* ---------- Left: luxury image panel ---------- */}
      <div className="relative hidden overflow-hidden md:block">
        <img
          src={img('1486406146926-c627a92ad1ab', 1400)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,14,14,0.94),rgba(14,14,14,0.55))]" />
        <div className="pattern-grid absolute inset-0 opacity-70" />
        <div className="animate-float absolute -left-24 -top-24 h-72 w-72 rounded-full bg-bronze/25 blur-[90px]" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-bronze/10 blur-[110px]" />

        <div className="relative flex h-full flex-col justify-between p-10 lg:p-14">
          <Logo showSub markClass="h-12 w-12" />

          <div>
            <span className="eyebrow">Admin Console</span>
            <p className="heading-md mt-6 max-w-md">Building Excellence. Designing Experiences.</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Manage projects, products, clients, testimonials and inbound leads for the DECORA
              website — all from one place.
            </p>
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">
            © {new Date().getFullYear()} DECORA Civil &amp; Interiors
          </p>
        </div>
      </div>

      {/* ---------- Right: glass form card ---------- */}
      <div className="flex items-center justify-center p-5 sm:p-8">
        <div className="glass w-full max-w-md rounded-sm p-7 sm:p-9">
          <div className="mb-8">
            <span className="eyebrow">Secure Area</span>
            <h1 className="mt-4 font-display text-4xl font-semibold text-white">Admin Login</h1>
            <p className="mt-2 text-sm text-muted">Sign in to manage DECORA content.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className="field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@decora.com"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="field pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/50 transition hover:text-bronze-light"
                >
                  <FiEye size={17} />
                </button>
              </div>
            </div>

            {error ? <ErrorBanner message={error} onDismiss={() => setError('')} /> : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>

            <button type="button" onClick={fillDemo} className="btn btn-ghost btn-sm w-full">
              Use demo credentials
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-5 text-center">
            <Link
              to="/"
              className="text-[11px] uppercase tracking-[0.25em] text-white/50 transition hover:text-bronze-light"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
