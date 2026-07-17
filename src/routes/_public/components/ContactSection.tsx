import { type FormEvent, useState } from 'react'
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'

function ContactForm() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('https://formsubmit.co/ajax/luskahs@gmail.com', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      const result = await response.json()
      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          {t('contact.nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t('contact.namePlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          {t('contact.emailLabel')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('contact.emailPlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          {t('contact.messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={t('contact.messagePlaceholder')}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('contact.sending')}
          </>
        ) : (
          <>
            <Send className="size-4" />
            {t('contact.send')}
          </>
        )}
      </button>
      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-4 shrink-0" />
          {t('contact.success')}
        </div>
      )}
      {status === 'error' && <p className="text-sm text-destructive">{t('contact.error')}</p>}
    </form>
  )
}

export function ContactSection() {
  const { t } = useLanguage()

  return (
    <>
      <section id="contact" className="border-t border-border/50 bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-lg">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="size-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('contact.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('contact.subtitle')}</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-border/50 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Luskafer. {t('footer.builtWith')}
        </p>
      </footer>
    </>
  )
}
