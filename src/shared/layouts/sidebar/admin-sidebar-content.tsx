import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Briefcase, KanbanSquare, Settings, ShieldCheck, Users } from 'lucide-react'
import type * as React from 'react'
import { useAuth } from '@/shared/services/auth'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  requiredPermission?: { action: string; resource: string }
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export const adminNavGroups: NavGroup[] = [
  {
    label: 'Portfólio',
    items: [
      {
        label: 'My Experiences',
        href: '/dashboard/administrative-panel/experiences',
        icon: BookOpen,
        requiredPermission: { action: 'MANAGE', resource: 'ALL' },
      },
      {
        label: 'My Projects',
        href: '/dashboard/administrative-panel/projects',
        icon: Briefcase,
        requiredPermission: { action: 'MANAGE', resource: 'ALL' },
      },
      {
        label: 'Kanban Workspace',
        href: '/dashboard/administrative-panel/kanban',
        icon: KanbanSquare,
        requiredPermission: { action: 'MANAGE', resource: 'ALL' },
      },
    ],
  },
  {
    label: 'Gerenciamento do Sistema',
    items: [
      { label: 'Sessões', href: '/dashboard/system-management/sessions-content', icon: Settings },
      { label: 'Equipe', href: '/dashboard/system-management/users-content', icon: Users },
      { label: 'Cargos', href: '/dashboard/system-management/roles-content', icon: ShieldCheck },
    ],
  },
]

export const AdminSidebarContent = ({ pathname }: { pathname: string }) => {
  const navigate = useNavigate()
  const { hasPermission, isLoading: authLoading } = useAuth()

  return (
    <SidebarContent>
      {!authLoading &&
        adminNavGroups.map(group => {
          const visibleItems = group.items.filter(
            item =>
              !item.requiredPermission ||
              hasPermission(item.requiredPermission.action, item.requiredPermission.resource),
          )

          if (visibleItems.length === 0) return null

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {visibleItems.map(item => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                        onClick={() => navigate({ to: item.href as never })}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          )
        })}
    </SidebarContent>
  )
}
