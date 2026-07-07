import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/features/users/users'

export const Route = createFileRoute('/_app/dashboard/system-management/users-content')({
  component: UsersPage,
})
