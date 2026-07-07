import { createFileRoute } from '@tanstack/react-router'
import { AgendaPage } from '@/features/agenda/pages/AgendaPage'
import { AgendaProvider } from '@/features/agenda/provider'

export const Route = createFileRoute('/_app/dashboard/agenda')({
  component: () => (
    <AgendaProvider>
      <AgendaPage />
    </AgendaProvider>
  ),
})
