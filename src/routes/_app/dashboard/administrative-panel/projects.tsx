import { createFileRoute } from '@tanstack/react-router'
import { ProjectManagementPage } from '@/features/projects/projects'

export const Route = createFileRoute('/_app/dashboard/administrative-panel/projects')({
  component: ProjectManagementPage,
})
