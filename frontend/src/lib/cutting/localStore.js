/**
 * Local (public website) persistence adapter for the cutting workspace.
 *
 * The public optimizer is intentionally client-side: drafts and plans live in
 * this browser. The admin dashboard uses the API adapter below instead.
 */
import {
  acceptPlan,
  clearOptimizerDraft,
  clearPlans,
  deletePlan,
  getSavedPlan,
  listSavedPlans,
  loadOptimizerDraft,
  saveOptimizerDraft,
  savePlan,
} from './optimizer'

function summary(plan) {
  const { sheets, demand, stock, ...rest } = plan
  return rest
}

async function listPlans() {
  return listSavedPlans().map(summary)
}

export const localStore = {
  mode: 'local',
  loadDraft: async () => loadOptimizerDraft(),
  saveDraft: async (state) => saveOptimizerDraft(state),
  clearDraft: async () => clearOptimizerDraft(),
  listPlans,
  getPlan: async (id) => getSavedPlan(id),
  savePlan: async (request) => savePlan(request),
  acceptPlan: async (id) => acceptPlan(id),
  deletePlan: async (id) => deletePlan(id),
  clearPlans: async () => clearPlans(),
}
