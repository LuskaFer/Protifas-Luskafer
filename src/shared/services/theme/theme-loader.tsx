import { useEffect } from 'react'
import { usePreferences } from '@/shared/services/preferences'
import { Spinner } from '@/shared/ui/spinner'

export function ThemeLoader() {
  const { getPreference, isLoading } = usePreferences()
  const userTheme = getPreference('theme') ?? 'light'

  useEffect(() => {
    if (isLoading) return

    if (userTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [userTheme, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return null
}
