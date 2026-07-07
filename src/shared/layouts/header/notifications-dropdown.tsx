import { AlertTriangle, Bell, Calendar as CalendarIcon, Check } from 'lucide-react'
import { useState } from 'react'
import { useNotification } from '@/shared/services/notification'
import type { Notification } from '@/shared/services/notification/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { NotificationsHistoryModal } from './notifications-history-modal'
import { NotificationsUnreadModal } from './notifications-unread-modal'

function renderNotificationVisual(notification: Notification) {
  if (notification.type === 'interaction') {
    return (
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={notification.avatar} />
        <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
      </Avatar>
    )
  }

  if (notification.type === 'system') {
    return (
      <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Bell className="text-primary size-4" />
      </div>
    )
  }

  if (notification.type === 'calendar') {
    return (
      <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full border">
        <CalendarIcon className="text-primary size-4" />
      </div>
    )
  }

  return (
    <div className="bg-destructive/10 flex size-8 shrink-0 items-center justify-center rounded-full border border-destructive/30">
      <AlertTriangle className="text-destructive size-4" />
    </div>
  )
}

export const NotificationsDropdown = () => {
  const { unreadNotifications, unreadCount, markNotificationAsRead } = useNotification()
  const [isUnreadOpen, setIsUnreadOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleOpenUnread = () => {
    setIsUnreadOpen(true)
    setIsHistoryOpen(false)
    setIsDropdownOpen(false)
  }

  const handleOpenHistory = () => {
    setIsHistoryOpen(true)
    setIsUnreadOpen(false)
    setIsDropdownOpen(false)
  }

  return (
    <>
      <NotificationsUnreadModal
        isOpen={isUnreadOpen}
        onClose={setIsUnreadOpen}
        onOpenHistory={handleOpenHistory}
      />
      <NotificationsHistoryModal
        isOpen={isHistoryOpen}
        onClose={setIsHistoryOpen}
        onOpenUnreadList={handleOpenUnread}
      />

      <DropdownMenu onOpenChange={setIsDropdownOpen} open={isDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Abrir notificações" className="relative" size="icon" variant="ghost">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute bg-primary flex size-4 items-center justify-center rounded-full text-[10px] font-semibold leading-none text-primary-foreground top-0 right-0">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[min(320px,calc(100vw-1.5rem))] p-0"
          collisionPadding={12}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <DropdownMenuLabel className="p-0 text-sm font-semibold">
              Notificações
            </DropdownMenuLabel>
          </div>

          <DropdownMenuSeparator className="mx-0 my-0" />

          {unreadNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Bell className="size-8 opacity-30" />
              <span>Nenhuma notificação não lida</span>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {unreadNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-start gap-3 px-4 py-3">
                    {renderNotificationVisual(notification)}
                    <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {notification.title}
                      </span>
                      <span className="text-foreground/80 text-xs leading-snug">
                        {notification.description}
                      </span>
                    </div>

                    <Button
                      aria-label={`Marcar ${notification.title} como visualizada`}
                      className="text-primary hover:text-primary size-6 shrink-0"
                      onClick={() => markNotificationAsRead(notification.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Check className="size-3" />
                    </Button>
                  </div>

                  {index < unreadNotifications.length - 1 && (
                    <DropdownMenuSeparator className="mx-4 my-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          <DropdownMenuSeparator className="mx-0 my-0" />
          <div className="p-2">
            <Button className="w-full" onClick={handleOpenUnread} size="sm" variant="ghost">
              Ver todas as notificações
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
