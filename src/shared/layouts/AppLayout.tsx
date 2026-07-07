import { Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AppEvents } from '@/shared/layouts/header/app-events'
import { AppHeader } from '@/shared/layouts/header/app-header'
import { NotificationWrapper } from '@/shared/layouts/header/notification-toast'
import { AppSidebar } from '@/shared/layouts/sidebar/app-sidebar'
import { useAuth } from '@/shared/services/auth/provider'
import { WebSocketProvider } from '@/shared/services/websocket/provider'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { Spinner } from '@/shared/ui/spinner'

export const AppLayout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, refetch } = useAuth()

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppEvents />
      <NotificationWrapper />
      <AppSidebar />
      <SidebarInset>
        <WebSocketProvider>
          <AppHeader />
          <Outlet />
        </WebSocketProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
