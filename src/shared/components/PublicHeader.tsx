import { Link } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { Button } from '@/shared/ui/button'

export function PublicHeader() {
  const { theme, setTheme } = useTheme()
  const { lang, toggleLang, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-md sm:px-6">
      <a href="/" className="text-sm font-bold tracking-tight text-foreground">
        LF
      </a>

      <nav className="hidden items-center gap-6 sm:flex">
        <Link
          to="/"
          hash="projects"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('projects.title', 'Projects')}
        </Link>
        <Link
          to="/"
          hash="education"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('education.title', 'Education')}
        </Link>
        <Link
          to="/"
          hash="experience"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('experience.title', 'Experience')}
        </Link>
        <Link
          to="/"
          hash="contact"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('contact.title', 'Contact')}
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="min-w-[48px] text-xs font-semibold tracking-wide"
          aria-label="Toggle language"
        >
          {lang === 'pt' ? 'PT' : 'EN'}
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        )}
      </div>
    </header>
  )
}
