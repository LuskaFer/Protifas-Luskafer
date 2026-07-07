import { X } from 'lucide-react'
import { toast } from 'sonner'
import type { Notification } from '@/shared/services/notification/types'
import { Button } from '@/shared/ui/button'
import { NotificationVisual } from './notification-visual'

export function ToastDisplay({
  notification,
  toastId,
}: {
  notification: Notification
  toastId: string | number
}) {
  const handleClose = () => toast.dismiss(toastId.toString())
  const { title, description, actionLabel = 'Visualizar', action } = notification

  return (
    <div className="bg-card flex items-center justify-between px-3 py-3 sm:px-4 gap-3 sm:gap-4 w-[calc(100vw-2rem)] sm:w-100 mb-2 text-card-foreground rounded-xl border shadow-sm">
      <div className="flex items-center flex-1 min-w-0 gap-3 sm:gap-4">
        <NotificationVisual notification={notification} />
        <div className="flex flex-col flex-1 min-w-0 gap-1 sm:gap-2">
          <div>
            <span className="block truncate font-semibold text-foreground text-sm sm:text-base">
              {title}
            </span>
            <span className="text-xs sm:text-sm text-foreground/90 leading-snug line-clamp-2">
              {description}
            </span>
          </div>
          {action && (
            <Button
              className="h-auto w-fit text-xs text-primary p-0 mt-1"
              onClick={action}
              size="sm"
              variant="link"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
      <Button
        className="text-foreground/60 hover:text-foreground shrink-0 transition-colors self-start sm:self-center"
        onClick={handleClose}
        size="icon"
        variant="ghost"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}

export function showNotificationToast(notification: Notification) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const position = isMobile ? 'bottom-center' : 'top-center'

  toast.custom(toastId => <ToastDisplay notification={notification} toastId={toastId} />, {
    position,
    duration: 15000,
    id: notification.id,
  })
}

export function NotificationWrapper() {
  return null
}

export function showNotificationToastAtPosition(
  notification: Notification,
  position: 'top-center' | 'bottom-center',
) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  toast.custom(toastId => <ToastDisplay notification={notification} toastId={toastId} />, {
    position: isMobile ? 'bottom-center' : position,
    duration: 15000,
    id: notification.id,
  })
}
