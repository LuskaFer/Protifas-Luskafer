import { useLocation, useNavigate } from '@tanstack/react-router'
import type * as React from 'react'
import { useAuth } from '@/shared/services/auth'
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

import { AdminSidebarContent } from './admin-sidebar-content'
import { UserSidebarContent } from './user-sidebar-content'

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission } = useAuth()

  const isAdmin = hasPermission('MANAGE', 'ALL')

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => navigate({ to: '/dashboard' as never })}>
              <div className="flex items-center gap-4">
                <div className="relative size-8 aspect-square rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">P</span>
                </div>
                <h3 className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  Portfolio
                </h3>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div
        className="flex flex-1 flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300 ease-in-out"
        key="sidebar"
      >
        {isAdmin ? (
          <AdminSidebarContent pathname={location.pathname || ''} />
        ) : (
          <UserSidebarContent pathname={location.pathname || ''} />
        )}
      </div>
    </Sidebar>
  )
}
