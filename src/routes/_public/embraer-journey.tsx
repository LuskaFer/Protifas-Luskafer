import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Award, Cpu, Plane, Rocket, Users } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'

export const Route = createFileRoute('/_public/embraer-journey')({
  component: EmbraerJourneyPage,
})

const TECH_ICONS = [Plane, Cpu, Users, Rocket]

function EmbraerJourneyPage() {
  const { t } = useLanguage()
  const techKeys = [1, 2, 3, 4] as const

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          {t('embraer.back')}
        </Link>

        <header className="mt-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <Plane className="size-3.5" />
            {t('embraer.badge')}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('embraer.title')}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{t('embraer.subtitle')}</p>
        </header>

        <hr className="my-12 border-border/50" />

        <section className="space-y-8">
          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Award className="size-5 text-primary" />
              {t('embraer.storyTitle')}
            </h2>
            <p className="leading-relaxed text-muted-foreground">{t('embraer.storyP1')}</p>
            <p className="leading-relaxed text-muted-foreground">{t('embraer.storyP2')}</p>
            <p className="leading-relaxed text-muted-foreground">{t('embraer.storyP3')}</p>
            <img
              src="/images/camiseta.jpg"
              alt="Embraer Mini-Glider T-Shirt"
              className="w-full max-w-sm mx-auto rounded-xl shadow-lg border border-slate-800 rotate-1 hover:rotate-0 transition-transform duration-300"
            />
          </div>

          <div className="rounded-xl border border-border/50 bg-card p-6">
            <blockquote className="text-sm italic leading-relaxed text-muted-foreground">
              {t('embraer.quote')}
            </blockquote>
          </div>

          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Cpu className="size-5 text-primary" />
              {t('embraer.techTitle')}
            </h2>
            <p className="leading-relaxed text-muted-foreground">{t('embraer.techP1')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {techKeys.map(i => {
                const Icon = TECH_ICONS[i - 1]
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="mb-2 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      {t(`embraer.tech${i}Title`)}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t(`embraer.tech${i}Desc`)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Rocket className="size-5 text-primary" />
              {t('embraer.aheadTitle')}
            </h2>
            <p className="leading-relaxed text-muted-foreground">{t('embraer.aheadP1')}</p>
            <p className="leading-relaxed text-muted-foreground">{t('embraer.aheadP2')}</p>
          </div>
        </section>

        <hr className="my-16 border-border/50" />

        <footer className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            <ArrowLeft className="size-4" />
            {t('embraer.back')}
          </Link>
          <p className="mt-6 text-xs text-muted-foreground">
            Built with React, TanStack Router & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  )
}
