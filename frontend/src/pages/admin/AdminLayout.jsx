import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IoClose, IoMenu } from 'react-icons/io5'
import {
  FiAlertTriangle,
  FiBox,
  FiBriefcase,
  FiExternalLink,
  FiGrid,
  FiImage,
  FiInbox,
  FiLogOut,
  FiMessageSquare,
  FiUsers,
} from 'react-icons/fi'
import Logo from '@/components/ui/Logo'
import { apiGet, apiHealth, clearToken, fetchMe, getToken } from '@/lib/api'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/hero', label: 'Hero Slides', icon: FiImage },
  { to: '/admin/projects', label: 'Projects', icon: FiBriefcase },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/clients', label: 'Clients', icon: FiUsers },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { to: '/admin/leads', label: 'Leads', icon: FiInbox, badge: true },
]

const TITLES = [
  { match: '/admin/hero', title: 'Hero Slides' },
  { match: '/admin/projects', title: 'Projects' },
  { match: '/admin/products', title: 'Products' },
  { match: '/admin/clients', title: 'Clients' },
  { match: '/admin/testimonials', title: 'Testimonials' },
  { match: '/admin/leads', title: 'Contact Leads' },
]

/* --------------------------- sidebar inner content ------------------------ */

function SidebarContent({ newLeads, onClose, onNavigate }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    onNavigate?.()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
        <Link to="/admin" onClick={onNavigate} className="transition-opacity hover:opacity-80">
          <Logo showSub={false} markClass="h-9 w-9" />
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/70 transition hover:border-bronze/50 hover:text-bronze-light lg:hidden"
          >
            <IoClose size={18} />
          </button>
        ) : null}
      </div>

      <nav aria-label="Admin navigation" className="flex flex-col py-4">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 border-l-2 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'border-bronze bg-white/[0.06] text-bronze-light'
                  : 'border-transparent text-white/60 hover:bg-white/[0.03] hover:text-white'
              }`
            }
          >
            <Icon size={16} className="shrink-0" aria-hidden="true" />
            <span>{label}</span>
            {badge && newLeads > 0 ? (
              <span className="ml-auto rounded-full bg-bronze px-2 py-0.5 text-[10px] font-bold tracking-normal text-ink">
                {newLeads}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/10 p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-bronze-light"
        >
          <FiExternalLink size={15} aria-hidden="true" /> View Site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 transition hover:text-red-400"
        >
          <FiLogOut size={15} aria-hidden="true" /> Logout
        </button>
        <p className="px-2 pt-3 text-[10px] uppercase tracking-[0.25em] text-white/25">
          v1.0 — Admin
        </p>
      </div>
    </div>
  )
}

/* -------------------------------- layout --------------------------------- */

/**
 * /admin — auth guard + fixed sidebar + topbar + <Outlet />.
 */
export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [online, setOnline] = useState(null) // null = checking
  const [newLeads, setNewLeads] = useState(0)

  /* auth check — 401 clears the token and bounces to login */
  useEffect(() => {
    let alive = true
    fetchMe().catch((err) => {
      if (!alive) return
      if (err?.status === 401) {
        clearToken()
        navigate('/admin/login', { replace: true })
      }
      // otherwise: offline / network error → ignore, stay in offline mode
    })
    return () => {
      alive = false
    }
  }, [navigate])

  /* API liveness probe */
  useEffect(() => {
    let alive = true
    apiHealth().then((health) => {
      if (alive) setOnline(!!health)
    })
    return () => {
      alive = false
    }
  }, [])

  /* refresh unread-lead badge + scroll to top on every route change */
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0 })
    let alive = true
    apiGet('/stats', null).then((stats) => {
      if (alive) setNewLeads(Number(stats?.newLeads) || 0)
    })
    return () => {
      alive = false
    }
  }, [location.pathname])

  /* escape closes the mobile slide-over */
  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  if (!getToken()) return <Navigate to="/admin/login" replace />

  const pageTitle =
    TITLES.find((t) => location.pathname.startsWith(t.match))?.title || 'Dashboard'

  return (
    <div className="min-h-screen bg-ink">
      {/* ---------- desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/10 bg-[#0b0b0b]/95 backdrop-blur-xl lg:flex">
        <SidebarContent newLeads={newLeads} />
      </aside>

      {/* ---------- mobile slide-over ---------- */}
      <AnimatePresence>
        {mobileOpen ? (
          <div key="mobile-sidebar" className="lg:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[60] flex w-[280px] flex-col border-r border-white/10 bg-night"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarContent
                newLeads={newLeads}
                onClose={() => setMobileOpen(false)}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      {/* ---------- main ---------- */}
      <main className="min-h-screen pt-16 lg:pl-[260px] lg:pt-0">
        <header className="glass fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-5 lg:left-[260px] lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-white/70 transition hover:border-bronze/50 hover:text-bronze-light lg:hidden"
            >
              <IoMenu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Admin</p>
              <h1 className="truncate font-display text-xl font-semibold leading-tight text-white">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* API status pill */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  online === null ? 'bg-white/40' : online ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {online === null ? 'Checking…' : online ? 'API Online' : 'Offline mode'}
              </span>
            </span>

            {/* avatar */}
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/40 bg-bronze/10 font-display text-sm font-semibold text-bronze-light">
                DA
              </span>
              <span className="hidden text-xs font-medium text-white/70 sm:inline">DECORA Admin</span>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8">
          <Outlet />

          {online === false ? (
            <div className="sticky bottom-5 z-30 mt-6 flex items-start gap-3 border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-[13px] leading-relaxed text-amber-200 backdrop-blur-md">
              <FiAlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
              <span>Backend offline — changes cannot be saved until the API is running.</span>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
