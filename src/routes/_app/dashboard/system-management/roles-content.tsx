import { createFileRoute } from '@tanstack/react-router'
import { RolesPage } from '@/features/roles/roles'

export const Route = createFileRoute('/_app/dashboard/system-management/roles-content')({
  component: RolesPage,
})
