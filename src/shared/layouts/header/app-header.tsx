import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getInitials } from '@/shared/lib/get-initials'
import { useAuth } from '@/shared/services/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Separator } from '@/shared/ui/separator'
import { SidebarTrigger } from '@/shared/ui/sidebar'
import { NotificationsDropdown } from './notifications-dropdown'
import { ProfileModal } from './profile-modal'
import { SettingsModal } from './settings-modal'

export const AppHeader = () => {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const { profile, logout } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 bg-background flex h-16 w-full items-center">
        <div className="ml-auto flex items-center gap-2 px-4">
          <SidebarTrigger />

          <NotificationsDropdown />
          <Separator className="h-4! m-2" orientation="vertical" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="ghost">
                <Avatar>
                  <AvatarImage
                    src={
                      profile?.avatarUrl
                        ? `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'}${profile.avatarUrl}`
                        : undefined
                    }
                  />
                  <AvatarFallback>{getInitials(profile?.fullName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile?.fullName ?? 'Minha conta'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={() => setProfileOpen(true)}>
                Editar perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onSelect={() => setSettingsOpen(true)}>
                Alterar tema
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={async () => {
                  await logout()
                  navigate({ to: '/' })
                }}
                variant="destructive"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SettingsModal isOpen={settingsOpen} onClose={setSettingsOpen} />
      <ProfileModal
        isOpen={profileOpen}
        onClose={setProfileOpen}
        onSuccess={() => {}}
        profileInfo={{
          nome: profile?.fullName,
          email: profile?.email,
          cpf: profile?.cpf,
          oab: profile?.oab ?? undefined,
          avatarUrl: profile?.avatarUrl,
        }}
      />
    </>
  )
}
