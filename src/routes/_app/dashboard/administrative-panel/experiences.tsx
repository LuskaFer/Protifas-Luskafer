import { createFileRoute } from '@tanstack/react-router'
import { ExperienceManagementPage } from '@/features/experiences/experiences'

export const Route = createFileRoute('/_app/dashboard/administrative-panel/experiences')({
  component: ExperienceManagementPage,
})
