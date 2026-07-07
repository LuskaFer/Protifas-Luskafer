import { Bell, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { useNotification } from '@/shared/services/notification'
import type { Notification } from '@/shared/services/notification/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer'
import { NotificationVisual } from './notification-visual'

const ITEMS_PER_PAGE = 5

export function NotificationsUnreadModal({
  isOpen,
  onClose,
  onOpenHistory,
}: {
  isOpen: boolean
  onClose: (open: boolean) => void
  onOpenHistory: () => void
}) {
  const isMobile = useIsMobile()
  const { unreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useNotification()
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        setCurrentPage(0)
      })
    }
  }, [isOpen])

  const totalPages = Math.ceil(unreadNotifications.length / ITEMS_PER_PAGE)
  const safeCurrentPage = totalPages === 0 ? 0 : Math.min(currentPage, totalPages - 1)

  const paginatedData = useMemo(() => {
    const startIndex = safeCurrentPage * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return unreadNotifications.slice(startIndex, endIndex)
  }, [unreadNotifications, safeCurrentPage])

  const hasNextPage = safeCurrentPage < totalPages - 1
  const hasPreviousPage = safeCurrentPage > 0

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentPage(0)
    }
    onClose(open)
  }

  const contentSlots = (
    <>
      {unreadNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground text-sm gap-2 py-12">
          <Bell className="size-10 opacity-30" />
          <span>Nenhuma notificação não lida</span>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedData.map((notification: Notification) => (
            <div
              className="bg-primary/5 border border-primary/20 rounded-lg p-4 hover:bg-primary/10 transition-colors"
              key={notification.id}
            >
              <div className="flex items-start gap-4">
                <NotificationVisual notification={notification} size="md" />
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="block text-foreground font-semibold">
                      {notification.title}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                      Não visualizada
                    </span>
                  </div>
                  <span className="text-foreground/70 text-sm leading-snug">
                    {notification.description}
                  </span>
                  {notification.action && (
                    <Button
                      className="h-auto w-fit text-xs text-primary p-0 mt-2"
                      onClick={notification.action}
                      size="sm"
                      variant="link"
                    >
                      {notification.actionLabel || 'Visualizar'}
                    </Button>
                  )}
                </div>
                <Button
                  aria-label={`Marcar ${notification.title} como visualizada`}
                  className="size-7 shrink-0 text-primary hover:text-primary"
                  onClick={() => markNotificationAsRead(notification.id)}
                  size="icon"
                  variant="ghost"
                >
                  <Check className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )

  const footer = unreadNotifications.length > 0 && (
    <div className="flex items-center justify-center gap-3 pt-4 border-t mt-4">
      <Button
        className="gap-2"
        disabled={!hasPreviousPage}
        onClick={handlePreviousPage}
        size="sm"
        variant="outline"
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>

      <span className="text-sm text-muted-foreground">
        Página {safeCurrentPage + 1} de {totalPages}
      </span>

      <Button
        className="gap-2"
        disabled={!hasNextPage}
        onClick={handleNextPage}
        size="sm"
        variant="outline"
      >
        Próxima
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={isOpen && !isMobile}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 flex flex-col">
          <DialogHeader className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 shrink-0">
            <div>
              <DialogTitle>Notificações não lidas</DialogTitle>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                className="h-auto text-xs"
                onClick={markAllNotificationsAsRead}
                size="sm"
                variant="ghost"
              >
                Marcar tudo como lida
              </Button>
              <Button className="h-auto text-xs" onClick={onOpenHistory} size="sm" variant="ghost">
                Ver histórico de notificações
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4 py-4">{contentSlots}</div>
          </div>
          <div className="px-6 py-4 shrink-0">{footer}</div>
        </DialogContent>
      </Dialog>

      <Drawer onOpenChange={handleOpenChange} open={isOpen && isMobile}>
        <DrawerContent className="p-0 flex flex-col max-h-[80vh]">
          <DrawerHeader className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 shrink-0">
            <div>
              <DrawerTitle>Notificações não lidas</DrawerTitle>
            </div>
            <div className="flex flex-nowrap items-center justify-end gap-2 overflow-x-auto">
              <Button
                className="h-auto whitespace-nowrap text-xs"
                onClick={markAllNotificationsAsRead}
                size="sm"
                variant="ghost"
              >
                Marcar tudo como lida
              </Button>
              <Button
                className="h-auto whitespace-nowrap text-xs"
                onClick={onOpenHistory}
                size="sm"
                variant="ghost"
              >
                Ver histórico de notificações
              </Button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-3 py-4">{contentSlots}</div>
          </div>
          <div className="px-6 py-4 shrink-0">{footer}</div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
