import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '@/features/auth/auth'

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
})
