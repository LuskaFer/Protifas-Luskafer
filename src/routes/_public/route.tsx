import { createFileRoute, Outlet } from '@tanstack/react-router'
import { FloatingEmbraerBanner } from '@/shared/components/floating-embraer-banner'
import { PublicHeader } from '@/shared/components/PublicHeader'
import { LanguageProvider } from '@/shared/contexts/LanguageContext'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <LanguageProvider>
      <PublicHeader />
      <FloatingEmbraerBanner />
      <Outlet />
    </LanguageProvider>
  )
}
