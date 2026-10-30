import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PublicHeader } from '@/shared/components/PublicHeader'
import { LanguageProvider } from '@/shared/contexts/LanguageContext'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <LanguageProvider>
      <PublicHeader />
      <Outlet />
    </LanguageProvider>
  )
}
