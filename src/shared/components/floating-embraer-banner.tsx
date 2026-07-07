import { Link } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'

export function FloatingEmbraerBanner() {
  const { t } = useLanguage()

  return (
    <Link to="/embraer-journey" className="group fixed left-0 top-1/2 z-50 -translate-y-1/2">
      <div className="flex items-center gap-2 rounded-r-lg border border-l-0 border-border/50 bg-card px-3 py-3 shadow-sm transition-all duration-300 hover:bg-accent hover:pl-4 hover:pr-5 md:py-4">
        <Plane className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:-rotate-12 md:size-5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium text-foreground opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100 md:text-sm">
          {t('embraer.banner')}
        </span>
      </div>
    </Link>
  )
}
