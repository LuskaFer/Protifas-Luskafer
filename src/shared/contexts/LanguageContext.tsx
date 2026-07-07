import { createContext, type ReactNode, useContext, useState } from 'react'
import { dictionaries, type Lang } from '@/shared/locales/dictionaries'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')

  const toggleLang = () => {
    setLang(prev => (prev === 'pt' ? 'en' : 'pt'))
  }

  const t = (key: string, fallback?: string): string => {
    return dictionaries[lang]?.[key] ?? fallback ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
