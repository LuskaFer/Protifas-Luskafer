import { ArrowUpRight, Code2, Globe } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { HeroHighlight, Highlight } from '@/shared/ui/hero-highlight'

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <HeroHighlight containerClassName="min-h-screen" className="px-4">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {t('hero.badge')}
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {t('hero.titleLine1')}
          <br />
          <Highlight className="text-foreground">{t('hero.titleHighlight')}</Highlight>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t('hero.subtitle')}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/luskafer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98]"
          >
            <Code2 className="size-4" />
            GitHub
            <ArrowUpRight className="size-3.5 opacity-70" />
          </a>
          <a
            href="https://linkedin.com/in/lucas-fernandes22"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
          >
            <Globe className="size-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </HeroHighlight>
  )
}
