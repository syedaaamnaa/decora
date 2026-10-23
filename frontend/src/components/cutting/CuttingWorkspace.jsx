import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFilePlus,
  FiLoader,
  FiPlay,
  FiSave,
  FiScissors,
  FiSettings,
  FiTrash2,
} from 'react-icons/fi'
import Reveal from '@/components/ui/Reveal'
import { Badge, Button, Card, Input, Notice } from '@/components/cutting/ui'
import DemandTable from '@/components/cutting/DemandTable'
import StockTable from '@/components/cutting/StockTable'
import PasteModal from '@/components/cutting/PasteModal'
import OptimizerResult from '@/components/cutting/OptimizerResult'
import PrintDialog from '@/components/cutting/PrintDialog'
import { optimize } from '@/lib/cutting/engine'
import {
  DEFAULT_SETTINGS_DRAFT,
  demandDraftFromParsed,
  demandErrors,
  demandsToApi,
  downloadDxf,
  settingsToApi,
  stockDraftFromParsed,
  stockErrors,
  stockToApi,
} from '@/lib/cutting/optimizer'

function blankDraft() {
  return {
    customerName: '',
    title: '',
    settings: DEFAULT_SETTINGS_DRAFT,
    demand: [],
    stock: [],
  }
}

/* Fixed key order so a loaded plan is never flagged as stale by accident. */
const canonDemand = (d) => ({
  label: d.label ?? '',
  material: d.material ?? '',
  customer: d.customer ?? '',
  length: Number(d.length) || 0,
  width: Number(d.width) || 0,
  quantity: Number(d.quantity) || 0,
  unit: d.unit ?? 'MM',
  rotation: d.allowRotation ? 'HORIZONTAL' : d.rotation || 'VERTICAL',
  allowRotation: Boolean(d.allowRotation),
})

const canonStock = (s) => ({
  label: s.label ?? '',
  material: s.material ?? '',
  length: Number(s.length) || 0,
  width: Number(s.width) || 0,
  quantity: Number(s.quantity) || 0,
  unit: s.unit ?? 'MM',
  price: s.price === undefined || s.price === null || s.price === '' ? null : Number(s.price),
})

function inputsKeyOf(inputs) {
  return JSON.stringify({
    customerName: inputs.customerName ?? '',
    title: inputs.title ?? '',
    settings: {
      kerf: Number(inputs.settings?.kerf) || 0,
      edgeMargin: Number(inputs.settings?.edgeMargin) || 0,
      pieceAllowance: Number(inputs.settings?.pieceAllowance) || 0,
    },
    demand: (inputs.demand ?? []).map(canonDemand),
    stock: (inputs.stock ?? []).map(canonStock),
  })
}

export default function CuttingWorkspace({
  store,
  initialDraft,
  initialPlans = [],
  variant = 'public',
}) {
  const draft = useRef(initialDraft ?? blankDraft()).current

  const [customerName, setCustomerName] = useState(draft.customerName)
  const [title, setTitle] = useState(draft.title)
  const [settings, setSettings] = useState(draft.settings)
  const [demand, setDemand] = useState(draft.demand)
  const [stock, setStock] = useState(draft.stock)

  const [plan, setPlan] = useState(null)
  const [planInputsKey, setPlanInputsKey] = useState(null)
  const [planSaved, setPlanSaved] = useState(false)
  const [activePlanId, setActivePlanId] = useState(null)

  const [savedPlans, setSavedPlans] = useState(() =>
    Array.isArray(initialPlans) ? initialPlans : [],
  )
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const [deletingPlanId, setDeletingPlanId] = useState(null)
  const [loadingPlanId, setLoadingPlanId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [pasteKind, setPasteKind] = useState(null)
  const [printKind, setPrintKind] = useState(null)

  const currentKey = useMemo(
    () =>
      inputsKeyOf({
        customerName,
        title,
        settings,
        demand: demandsToApi(demand),
        stock: stockToApi(stock),
      }),
    [customerName, title, settings, demand, stock],
  )

  // Autosave the current inputs — localStorage in the public tool,
  // MongoDB in the admin dashboard so changes survive devices.
  useEffect(() => {
    const t = window.setTimeout(() => {
      Promise.resolve(store.saveDraft({ customerName, title, settings, demand, stock })).catch(
        () => {},
      )
    }, store.mode === 'api' ? 700 : 300)
    return () => window.clearTimeout(t)
  }, [customerName, title, settings, demand, stock, store])

  async function refreshSavedPlans() {
    try {
      const list = await store.listPlans()
      setSavedPlans(Array.isArray(list) ? list : [])
    } catch {
      // keep the current list if the background refresh fails
    }
  }

  function validateInputs() {
    setError(null)
    const errors = [...demandErrors(demand), ...stockErrors(stock)]
    if (errors.length > 0) {
      setError(errors.join(' · '))
      return false
    }
    if (demandsToApi(demand).length === 0 || stockToApi(stock).length === 0) {
      setError('Add at least one demand piece and one stock sheet first.')
      return false
    }
    return true
  }

  function buildRequest() {
    return {
      title: title.trim() || undefined,
      customerName: customerName.trim() || undefined,
      demand: demandsToApi(demand),
      stock: stockToApi(stock),
      settings: settingsToApi(settings),
    }
  }

  function showError(err) {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
  }

  async function handleOptimize() {
    if (!validateInputs()) return
    setBusy(true)
    setNotice(null)
    try {
      const result = optimize(buildRequest())
      setPlan(result)
      setPlanSaved(false)
      setActivePlanId(null)
      setPlanInputsKey(currentKey)
      setNotice(
        `Optimized: ${result.statistics.totalSheets} sheet(s) used, ${result.statistics.utilizationPercent.toFixed(1)}% utilization.`,
      )
    } catch (err) {
      showError(err)
    } finally {
      setBusy(false)
    }
  }

  async function handleSave() {
    if (!validateInputs()) return
    setSaving(true)
    setError(null)
    try {
      const saved = await store.savePlan(buildRequest())
      setPlan(saved)
      setPlanSaved(true)
      setActivePlanId(saved._id)
      setPlanInputsKey(currentKey)
      setNotice(`Plan #${saved.planNumber} saved.`)
      await refreshSavedPlans()
    } catch (err) {
      showError(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleAccept() {
    if (!validateInputs()) return
    setAccepting(true)
    setError(null)
    try {
      let current = plan
      if (!current?._id) {
        current = await store.savePlan(buildRequest())
      }
      const accepted = await store.acceptPlan(current._id)
      setPlan(accepted)
      setPlanSaved(true)
      setActivePlanId(accepted._id)
      setPlanInputsKey(currentKey)
      setNotice(`Plan #${accepted.planNumber} accepted for the workshop.`)
      await refreshSavedPlans()
    } catch (err) {
      showError(err)
    } finally {
      setAccepting(false)
    }
  }

  async function handleLoadPlan(id) {
    setError(null)
    setLoadingPlanId(id)
    try {
      const loaded = await store.getPlan(id)
      if (!loaded) throw new Error('Cutting plan not found')
      setCustomerName(loaded.customerName ?? '')
      setTitle(loaded.title ?? '')
      setSettings({
        kerf: String(loaded.settings.kerf),
        edgeMargin: String(loaded.settings.edgeMargin),
        pieceAllowance: String(loaded.settings.pieceAllowance),
      })
      setDemand((loaded.demand ?? []).map(demandDraftFromParsed))
      setStock((loaded.stock ?? []).map(stockDraftFromParsed))
      setPlan(loaded)
      setPlanSaved(true)
      setActivePlanId(id)
      setPlanInputsKey(inputsKeyOf(loaded))
      setNotice(`Loaded plan #${loaded.planNumber}.`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      showError(err)
    } finally {
      setLoadingPlanId(null)
    }
  }

  function clearActivePlanView() {
    setPlan(null)
    setPlanInputsKey(null)
    setPlanSaved(false)
    setActivePlanId(null)
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    setDeletingPlanId(confirmDelete === 'all' ? 'all' : confirmDelete._id)
    setError(null)
    try {
      if (confirmDelete === 'all') {
        const removed = savedPlans.length
        await store.clearPlans()
        clearActivePlanView()
        setNotice(`Deleted all ${removed} saved plan${removed === 1 ? '' : 's'}.`)
      } else {
        await store.deletePlan(confirmDelete._id)
        if (activePlanId === confirmDelete._id) clearActivePlanView()
        setNotice(`Plan #${confirmDelete.planNumber} deleted.`)
      }
      await refreshSavedPlans()
    } catch (err) {
      showError(err)
    } finally {
      setDeletingPlanId(null)
      setConfirmDelete(null)
    }
  }

  function handleNew() {
    setCustomerName('')
    setTitle('')
    setSettings(DEFAULT_SETTINGS_DRAFT)
    setDemand([])
    setStock([])
    clearActivePlanView()
    setNotice(null)
    setError(null)
    Promise.resolve(store.clearDraft()).catch(() => {})
  }

  function applyPaste(items, replace) {
    if (pasteKind === 'demand') {
      const drafts = items.map(demandDraftFromParsed)
      setDemand(replace ? drafts : [...demand, ...drafts])
    } else if (pasteKind === 'stock') {
      const drafts = items.map(stockDraftFromParsed)
      setStock(replace ? drafts : [...stock, ...drafts])
    }
  }

  const inputsStale = plan !== null && planInputsKey !== null && planInputsKey !== currentKey

  return (
    <>
      <section className={variant === 'admin' ? 'relative pb-8' : 'relative pb-24'}>
        {variant === 'admin' ? null : (
          <div className="pattern-grid pointer-events-none absolute inset-0 opacity-20" />
        )}
        <div className={variant === 'admin' ? 'relative' : 'container-luxe relative pt-12'}>
          <Reveal>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {variant === 'admin' ? (
                <p className="text-xs leading-relaxed text-white/40">
                  Plans and drafts are saved to the workshop database — available on every device.
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center border border-bronze/30 bg-bronze/10 text-bronze-light">
                    <FiScissors size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-bronze-light">
                      Workshop
                    </p>
                    <p className="text-sm text-white/60">
                      Cut list, stock, nesting and printable cutting sheets
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleNew} icon={<FiFilePlus />}>
                  New
                </Button>
                <Button size="sm" onClick={handleOptimize} loading={busy} icon={<FiPlay />}>
                  Start Optimization
                </Button>
              </div>
            </div>
          </Reveal>

            {notice ? (
              <Notice tone="success" onDismiss={() => setNotice(null)}>
                {notice}
              </Notice>
            ) : null}
            {error ? (
              <Notice tone="error" onDismiss={() => setError(null)}>
                {error}
              </Notice>
            ) : null}

            <Reveal delay={0.05}>
              <div className="grid gap-5 xl:grid-cols-2">
                <Card>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    Order
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Customer name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ahmed"
                    />
                    <Input
                      label="Order / file reference"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Optional, e.g. Flat 12"
                    />
                  </div>
                </Card>

                <Card>
                  <div className="mb-3 flex items-center gap-2">
                    <FiSettings className="text-bronze" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                      Cutting settings
                    </h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input
                      type="number"
                      min={0}
                      label="Kerf / blade (mm)"
                      value={settings.kerf}
                      onChange={(e) => setSettings({ ...settings, kerf: e.target.value })}
                    />
                    <Input
                      type="number"
                      min={0}
                      label="Edge margin (mm)"
                      value={settings.edgeMargin}
                      onChange={(e) => setSettings({ ...settings, edgeMargin: e.target.value })}
                    />
                    <Input
                      type="number"
                      min={0}
                      label="Piece allowance (mm)"
                      value={settings.pieceAllowance}
                      onChange={(e) => setSettings({ ...settings, pieceAllowance: e.target.value })}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/35">
                    Enter dimensions in the unit selected on each row; results and cutting sheets
                    are always in millimetres.
                  </p>
                </Card>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <Card>
                  <DemandTable value={demand} onChange={setDemand} onPaste={() => setPasteKind('demand')} />
                </Card>
                <Card>
                  <StockTable value={stock} onChange={setStock} onPaste={() => setPasteKind('stock')} />
                </Card>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleOptimize}
                  loading={busy}
                  className="flex-1"
                  icon={<FiPlay />}
                >
                  Optimize
                </Button>
                <Button variant="outline" onClick={handleSave} loading={saving} icon={<FiSave />}>
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAccept}
                  loading={accepting}
                  icon={<FiCheckCircle />}
                >
                  Accept
                </Button>
              </div>
            </Reveal>

            <div className="mt-12 border-t border-white/10 pt-10">
              <Reveal>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="eyebrow">Optimized result</span>
                    <h2 className="mt-3 font-display text-3xl font-medium text-white">
                      Sheet-by-sheet cutting plan
                    </h2>
                  </div>
                </div>
              </Reveal>

              {inputsStale ? (
                <Notice tone="warn">
                  The inputs changed since this plan was generated — run{' '}
                  <strong>Optimize</strong> again to refresh the layout.
                </Notice>
              ) : null}

              <Reveal delay={0.05}>
                {plan ? (
                  <OptimizerResult
                    plan={plan}
                    saved={planSaved}
                    saving={saving}
                    accepting={accepting}
                    error={null}
                    onSave={handleSave}
                    onAccept={handleAccept}
                    onPrint={() => setPrintKind('plan')}
                    onLabels={() => setPrintKind('labels')}
                    onDxf={() => {
                      try {
                        downloadDxf(plan)
                      } catch (err) {
                        showError(err)
                      }
                    }}
                  />
                ) : (
                  <Card>
                    <div className="py-12 text-center">
                      <FiScissors className="mx-auto mb-3 text-3xl text-bronze/60" />
                      <p className="text-sm font-medium text-white/75">No cutting plan yet</p>
                      <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
                        Enter the pieces the customer needs (demand) and the raw sheets you have in
                        stock, then press <strong className="text-white/65">Start Optimization</strong>.
                        The layout appears here with sheet by sheet cutting instructions.
                      </p>
                    </div>
                  </Card>
                )}
              </Reveal>
            </div>

            <div className="mt-12">
              <Reveal>
                <Card className="p-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                        Saved plans
                      </h2>
                      {planSaved && activePlanId ? (
                        <Badge tone="bronze">
                          Loaded #
                          {savedPlans.find((p) => p._id === activePlanId)?.planNumber ?? ''}
                        </Badge>
                      ) : null}
                    </div>
                    {savedPlans.length > 0 ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmDelete('all')}
                        loading={deletingPlanId === 'all'}
                        icon={<FiTrash2 />}
                      >
                        Delete all
                      </Button>
                    ) : null}
                  </div>

                  {savedPlans.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-white/45">
                      Nothing saved yet. Optimize, then click <strong className="text-white/70">Save</strong>{' '}
                      or <strong className="text-white/70">Accept</strong> to keep a plan here.
                    </p>
                  ) : (
                    <div className="divide-y divide-white/[0.06]">
                      {savedPlans.map((p) => (
                        <div
                          key={p._id}
                          className={`flex items-center pr-2 transition-colors hover:bg-white/[0.04] ${
                            p._id === activePlanId ? 'bg-bronze/[0.08]' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleLoadPlan(p._id)}
                            disabled={loadingPlanId !== null || deletingPlanId !== null}
                            className="flex min-w-0 flex-1 items-center justify-between gap-3 px-5 py-3 text-left text-sm disabled:cursor-wait disabled:opacity-60"
                          >
                            <span className="min-w-0">
                              <span className="block font-medium text-white">
                                #{p.planNumber}
                                {p.customerName ? (
                                  <span className="font-normal text-white/45">
                                    {' '}
                                    — {p.customerName}
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-0.5 block text-xs text-white/35">
                                {new Date(p.createdAt ?? Date.now()).toLocaleDateString()} ·{' '}
                                {p.statistics?.totalSheets ?? 0} sheet
                                {(p.statistics?.totalSheets ?? 0) === 1 ? '' : 's'} ·{' '}
                                {(p.statistics?.utilizationPercent ?? 0).toFixed(0)}% util
                              </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                              {loadingPlanId === p._id ? (
                                <FiLoader className="animate-spin text-bronze-light" />
                              ) : null}
                              <Badge tone={p.status === 'ACCEPTED' ? 'green' : 'slate'}>
                                {p.status === 'ACCEPTED' ? 'Accepted' : 'Draft'}
                              </Badge>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(p)}
                            disabled={deletingPlanId !== null}
                            title={`Delete plan #${p.planNumber}`}
                            aria-label={`Delete plan #${p.planNumber}`}
                            className="p-2 text-white/35 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingPlanId === p._id ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FiTrash2 />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </Reveal>
            </div>
          </div>
      </section>

      {pasteKind ? (
        <PasteModal
          kind={pasteKind}
          onClose={() => setPasteKind(null)}
          onApply={(items, replace) => {
            applyPaste(items, replace)
            setPasteKind(null)
          }}
        />
      ) : null}

      {printKind && plan ? (
        <PrintDialog plan={plan} kind={printKind} onClose={() => setPrintKind(null)} />
      ) : null}

      {confirmDelete ? (
        <ConfirmDialog
          title={
            confirmDelete === 'all'
              ? 'Delete all saved plans'
              : `Delete plan #${confirmDelete.planNumber}`
          }
          message={
            confirmDelete === 'all'
              ? `This permanently removes all ${savedPlans.length} saved plan${
                  savedPlans.length === 1 ? '' : 's'
                }. This cannot be undone.`
              : `This permanently removes plan #${confirmDelete.planNumber}${
                  confirmDelete.customerName ? ` for ${confirmDelete.customerName}` : ''
                }. This cannot be undone.`
          }
          confirmLabel={confirmDelete === 'all' ? 'Delete all' : 'Delete'}
          loading={deletingPlanId !== null}
          onCancel={() => (deletingPlanId === null ? setConfirmDelete(null) : undefined)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </>
  )
}

function ConfirmDialog({ title, message, confirmLabel, loading, onCancel, onConfirm }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[950] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md border border-white/10 bg-ink p-6 shadow-glass-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-400/30 bg-red-500/10 text-red-300">
            <FiAlertTriangle />
          </span>
          <div>
            <h3 className="font-display text-xl text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/50">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
