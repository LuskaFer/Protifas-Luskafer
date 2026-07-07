import { useNavigate } from '@tanstack/react-router'
import { CalendarIcon, Home } from 'lucide-react'
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

const portfolioNavGroups: NavGroup[] = [
  {
    label: 'Conteúdo',
    items: [
      {
        label: 'Experiências',
        href: '/dashboard/administrative-panel/experiences',
        icon: CalendarIcon,
        requiredPermission: { action: 'READ', resource: 'EXPERIENCES' },
      },
    ],
  },
]

export const UserSidebarContent = ({ pathname }: { pathname: string }) => {
  const navigate = useNavigate()
  const { hasPermission, isLoading: authLoading } = useAuth()

  const handleNavigate = (href: string) => {
    navigate({ to: href as never })
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Início</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === '/dashboard'}
              tooltip="Página Inicial"
              onClick={() => handleNavigate('/dashboard')}
            >
              <Home />
              <span>Página Inicial</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {hasPermission('READ', 'AGENDA') && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/dashboard/agenda')}
                tooltip="Agenda"
                onClick={() => handleNavigate('/dashboard/agenda')}
              >
                <CalendarIcon />
                <span>Agenda</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      {!authLoading &&
        portfolioNavGroups.map(group => {
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
                        onClick={() => handleNavigate(item.href)}
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
