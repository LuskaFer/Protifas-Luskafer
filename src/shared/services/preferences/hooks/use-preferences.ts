import { useMemo } from 'react'
import { preferencesApi } from '../api'
import { usePreferencesContext } from '../provider'

export function usePreferences() {
  const { preferences, isLoading, getPreference, updatePreferenceLocal } = usePreferencesContext()

  return useMemo(
    () => ({
      preferences,
      isLoading,
      getPreference,
      updatePreferenceLocal,
      savePreference: async (key: string, value: string) => {
        await preferencesApi.save(key, value)
        updatePreferenceLocal(key, value)
      },
    }),
    [preferences, isLoading, getPreference, updatePreferenceLocal],
  )
}
