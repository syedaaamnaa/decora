import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiBox,
  FiBriefcase,
  FiInbox,
  FiMail,
  FiMessageSquare,
  FiPlus,
  FiUsers,
} from 'react-icons/fi'
import Loader from '@/components/ui/Loader'
import LazyImage from '@/components/ui/LazyImage'
import { apiGet, apiList } from '@/lib/api'
import { Panel, StatCard, StatusPill, idOf, timeAgo } from './admin-ui'

const ZEROS = { projects: 0, products: 0, clients: 0, testimonials: 0, leads: 0, newLeads: 0 }

const STAT_CARDS = [
  { key: 'projects', label: 'Projects', icon: FiBriefcase },
  { key: 'products', label: 'Products', icon: FiBox },
  { key: 'clients', label: 'Clients', icon: FiUsers },
  { key: 'testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { key: 'leads', label: 'Leads', icon: FiInbox },
  { key: 'newLeads', label: 'New Leads', icon: FiMail },
]

const QUICK_ACTIONS = [
  { to: '/admin/projects', label: 'New Project', icon: FiPlus },
  { to: '/admin/products', label: 'New Product', icon: FiBox },
  { to: '/admin/clients', label: 'Add Client', icon: FiUsers },
  { to: '/admin/testimonials', label: 'New Testimonial', icon: FiMessageSquare },
]

/**
 * /admin — overview of content counts, latest leads and latest projects.
 */
export default function Dashboard() {
  const [stats, setStats] = useState(ZEROS)
  const [leads, setLeads] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [s, messages, projs] = await Promise.all([
        apiGet('/stats', ZEROS),
        apiList('/messages', []),
        apiList('/projects', []),
      ])
      if (!alive) return
      setStats({ ...ZEROS, ...(s || {}) })
      setLeads(messages.slice(0, 5))
      setProjects(projs.slice(0, 5))
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* ---------- header ---------- */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Overview</span>
          <h1 className="heading-lg mt-4">Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Everything happening across the DECORA website — content, clients and incoming leads.
          </p>
        </div>
        <Link to="/admin/projects" className="btn btn-primary btn-sm self-start lg:self-auto">
          <FiPlus /> New Project
        </Link>
      </div>

      {loading ? (
        <div className="glass rounded-sm">
          <Loader full={false} label="Loading dashboard" />
        </div>
      ) : (
        <>
          {/* ---------- stats ---------- */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {STAT_CARDS.map(({ key, label, icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <StatCard icon={icon} label={label} value={stats[key]} />
              </motion.div>
            ))}
          </div>

          {/* ---------- two-column panels ---------- */}
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel
              title="Recent Leads"
              subtitle="Last 5 inquiries from the contact form"
              action={
                <Link
                  to="/admin/leads"
                  className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze-light transition hover:text-white"
                >
                  View all <FiArrowRight size={13} aria-hidden="true" />
                </Link>
              }
            >
              {leads.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/40">No leads yet.</p>
              ) : (
                <ul className="divide-y divide-white/[0.07]">
                  {leads.map((lead) => (
                    <li key={idOf(lead) || lead.createdAt} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{lead.name || 'Unnamed'}</p>
                        <p className="mt-0.5 truncate text-xs text-white/45">
                          {lead.service || 'General inquiry'} · {timeAgo(lead.createdAt)}
                        </p>
                      </div>
                      <StatusPill status={lead.status || 'new'} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Recent Projects"
              subtitle="Most recently added portfolio entries"
              action={
                <Link
                  to="/admin/projects"
                  className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-bronze-light transition hover:text-white"
                >
                  View all <FiArrowRight size={13} aria-hidden="true" />
                </Link>
              }
            >
              {projects.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/40">No projects yet.</p>
              ) : (
                <ul className="divide-y divide-white/[0.07]">
                  {projects.map((project) => (
                    <li key={idOf(project) || project.title} className="flex items-center gap-4 py-3">
                      <LazyImage
                        src={project.cover}
                        alt={project.title}
                        className="h-11 w-11 shrink-0 rounded-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{project.title}</p>
                        <p className="mt-0.5 text-xs text-white/45">{project.location || '—'}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-bronze/30 bg-bronze/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze-light">
                        {project.category || 'General'}
                      </span>
                      <span className="hidden shrink-0 text-xs text-white/40 sm:inline">
                        {project.year || ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          {/* ---------- quick actions ---------- */}
          <Panel title="Quick Actions" subtitle="Jump straight into content management">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center justify-between gap-3 border border-white/10 bg-white/[0.04] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 transition duration-500 ease-luxe hover:border-bronze/50 hover:bg-bronze/10 hover:text-bronze-light"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} className="text-bronze" aria-hidden="true" />
                    {label}
                  </span>
                  <FiArrowRight
                    size={14}
                    className="text-white/30 transition group-hover:translate-x-1 group-hover:text-bronze-light"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  )
}
