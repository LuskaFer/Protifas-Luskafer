import { createFileRoute } from '@tanstack/react-router'
import { KanbanPage } from '@/features/kanban/kanban'

export const Route = createFileRoute('/_app/dashboard/administrative-panel/kanban')({
  component: KanbanPage,
})
