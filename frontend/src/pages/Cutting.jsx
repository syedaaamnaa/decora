import { useMemo } from 'react'

import Seo from '@/components/ui/Seo'
import Page from '@/components/ui/Page'
import PageHeader from '@/components/ui/PageHeader'
import CuttingWorkspace from '@/components/cutting/CuttingWorkspace'
import { localStore } from '@/lib/cutting/localStore'
import { listSavedPlans, loadOptimizerDraft } from '@/lib/cutting/optimizer'

/**
 * /cutting — public workshop tool.
 * Runs entirely in the browser so customers can plan cuts without an account;
 * the admin dashboard is the shared, database-backed version.
 */
export default function Cutting() {
  const draft = useMemo(() => loadOptimizerDraft(), [])
  const savedPlans = useMemo(() => listSavedPlans(), [])

  return (
    <>
      <Seo
        title="Cutting Optimizer"
        description="Decora glass cutting optimizer — paste your cut list and stock sheets, then generate optimized cutting layouts, labels and DXF files."
      />
      <Page>
        <PageHeader
          eyebrow="Workshop Tools"
          title="Cutting Optimizer"
          description="Paste your cut list and stock from Excel, or enter them manually. The optimizer nests every piece onto your sheets and shows sheet-by-sheet cutting instructions."
          image="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
          breadcrumb="Cutting"
        />
        <CuttingWorkspace
          store={localStore}
          initialDraft={draft}
          initialPlans={savedPlans}
        />
      </Page>
    </>
  )
}
