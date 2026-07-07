import isEqual from 'fast-deep-equal'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/shared/services/auth'
import { preferencesApi } from './api'
import type { PreferenceObject } from './types'

interface PreferencesContextData {
  preferences: PreferenceObject[]
  isLoading: boolean
  getPreference: (key: string) => string | undefined
  updatePreferenceLocal: (key: string, value: string) => void
}

const PreferencesContext = createContext<PreferencesContextData>({} as PreferencesContextData)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [preferences, setPreferences] = useState<PreferenceObject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const localStored = localStorage.getItem('user_preferences')
    let storedPreferences: PreferenceObject[] = []

    if (localStored && localStored !== 'undefined') {
      try {
        const parsed = JSON.parse(localStored)
        if (Array.isArray(parsed)) {
          storedPreferences = parsed
        }
      } catch {
        localStorage.removeItem('user_preferences')
      }
    }

    if (storedPreferences.length > 0) {
      setPreferences(storedPreferences)
    }

    if (authLoading) return

    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    const fetchPreferences = async () => {
      try {
        const fetchedPreferences = await preferencesApi.list()

        const isDifferent = !isEqual(storedPreferences, fetchedPreferences)

        if (storedPreferences.length === 0 || isDifferent) {
          setPreferences(fetchedPreferences)
          localStorage.setItem('user_preferences', JSON.stringify(fetchedPreferences))
        }
      } catch {
        if (storedPreferences.length === 0) {
          setPreferences([])
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchPreferences()
  }, [isAuthenticated, authLoading])

  const getPreference = useCallback(
    (key: string) => {
      if (!Array.isArray(preferences)) return undefined
      return preferences.find(pref => pref.key === key)?.value
    },
    [preferences],
  )

  const updatePreferenceLocal = useCallback((key: string, value: string) => {
    setPreferences(prev => {
      const safePrev = Array.isArray(prev) ? prev : []
      const exists = safePrev.find(p => p.key === key)

      let newPrefs: PreferenceObject[]
      if (exists) {
        newPrefs = safePrev.map(p => (p.key === key ? { ...p, value } : p))
      } else {
        newPrefs = [...safePrev, { key, value }]
      }

      localStorage.setItem('user_preferences', JSON.stringify(newPrefs))
      return newPrefs
    })
  }, [])

  return (
    <PreferencesContext.Provider
      value={{ preferences, getPreference, isLoading, updatePreferenceLocal }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext)
  if (!context?.getPreference) {
    throw new Error('usePreferencesContext must be used within a PreferencesProvider')
  }
  return context
}
