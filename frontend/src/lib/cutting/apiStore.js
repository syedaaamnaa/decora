/**
 * API persistence adapter for the cutting workspace (admin dashboard).
 *
 * The optimizer still runs in the browser; the computed plan is stored in
 * MongoDB so every admin device sees the same plans and drafts.
 */
import { apiDelete, apiList, apiPatch, apiPost, apiPut, apiRequest } from '@/lib/api'
import { optimize } from './engine'

export const apiStore = {
  mode: 'api',

  loadDraft: async () => apiRequest('/cutting/draft').catch(() => null),

  saveDraft: async (state) =>
    apiPut('/cutting/draft', {
      customerName: state.customerName,
      title: state.title,
      settings: state.settings,
      demand: state.demand.map(({ id, ...rest }) => rest),
      stock: state.stock.map(({ id, ...rest }) => rest),
    }),

  clearDraft: async () => apiDelete('/cutting/draft'),

  listPlans: async () => apiList('/cutting/plans', []),

  getPlan: async (id) => {
    try {
      return await apiRequest(`/cutting/plans/${id}`)
    } catch {
      return null
    }
  },

  savePlan: async (request) => {
    const computed = optimize(request)
    return apiPost('/cutting/plans', {
      title: computed.title,
      customerName: computed.customerName,
      settings: computed.settings,
      demand: computed.demand,
      stock: computed.stock,
      sheets: computed.sheets,
      statistics: computed.statistics,
    })
  },

  acceptPlan: async (id) => apiPatch(`/cutting/plans/${id}/accept`, {}),

  deletePlan: async (id) => apiDelete(`/cutting/plans/${id}`),

  clearPlans: async () => apiDelete('/cutting/plans'),
}
