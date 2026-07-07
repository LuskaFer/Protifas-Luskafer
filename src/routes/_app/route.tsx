// src/routes/_app/route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/shared/layouts/AppLayout'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})
