import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiExternalLink, FiScissors } from 'react-icons/fi'

import Loader from '@/components/ui/Loader'
import CuttingWorkspace from '@/components/cutting/CuttingWorkspace'
import { apiStore } from '@/lib/cutting/apiStore'
import {
  DEFAULT_SETTINGS_DRAFT,
  demandDraftFromParsed,
  stockDraftFromParsed,
} from '@/lib/cutting/optimizer'

/** Turn a stored API draft into the string-based row shape the UI edits. */
function normalizeDraft(doc) {
  if (!doc) return undefined
  return {
    customerName: doc.customerName ?? '',
    title: doc.title ?? '',
    settings: {
      kerf: String(doc.settings?.kerf ?? DEFAULT_SETTINGS_DRAFT.kerf),
      edgeMargin: String(doc.settings?.edgeMargin ?? DEFAULT_SETTINGS_DRAFT.edgeMargin),
      pieceAllowance: String(
        doc.settings?.pieceAllowance ?? DEFAULT_SETTINGS_DRAFT.pieceAllowance,
      ),
    },
    demand: (doc.demand ?? []).map((row) =>
      demandDraftFromParsed({
        ...row,
        rotation: row.rotation || 'VERTICAL',
      }),
    ),
    stock: (doc.stock ?? []).map(stockDraftFromParsed),
  }
}

/**
 * /admin/cutting — shared Cutting Optimizer.
 * Drafts and plans are persisted to MongoDB through the authenticated API.
 */
export default function AdminCutting() {
  const [boot, setBoot] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all([apiStore.loadDraft(), apiStore.listPlans()]).then(([draft, plans]) => {
      if (!alive) return
      setBoot({ draft: normalizeDraft(draft), plans: Array.isArray(plans) ? plans : [] })
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Workshop</span>
          <h1 className="heading-lg mt-4">Cutting Optimizer</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Nest glass cuts onto stock sheets, print cutting labels, export DXF files and
            keep every plan in the shared workshop database.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 border border-bronze/25 bg-bronze/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-bronze-light">
            <FiScissors /> Live database
          </span>
          <Link
            to="/cutting"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            Public tool <FiExternalLink />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {boot ? (
          <CuttingWorkspace
            store={apiStore}
            initialDraft={boot.draft}
            initialPlans={boot.plans}
            variant="admin"
          />
        ) : (
          <Loader full={false} label="Loading cutting workshop" />
        )}
      </div>
    </div>
  )
}
