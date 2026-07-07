import { api } from '@/shared/services/http'
import type { PreferenceObject } from './types'

export const preferencesApi = {
  list: async (): Promise<PreferenceObject[]> => {
    const response = await api.get<PreferenceObject[]>('/me/preferences')
    return Array.isArray(response.data) ? response.data : []
  },

  save: async (key: string, value: string): Promise<void> => {
    await api.put('/me/preferences', { key, value })
  },
}
