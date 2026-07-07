import { createFileRoute } from '@tanstack/react-router'
import { SessionsPage } from '@/features/sessions/sessions'

export const Route = createFileRoute('/_app/dashboard/system-management/sessions-content')({
  component: SessionsPage,
})
