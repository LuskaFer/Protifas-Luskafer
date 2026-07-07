import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '@/shared/layouts/AuthLayout'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})
