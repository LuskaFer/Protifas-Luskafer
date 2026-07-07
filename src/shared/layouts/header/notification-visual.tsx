import { AlertTriangle, Bell, Calendar } from 'lucide-react'
import type { Notification } from '@/shared/services/notification/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'

const DEFAULT_AVATAR_URL = 'https://github.com/shadcn.png'

type NotificationVisualSize = 'sm' | 'md'

type NotificationVisualProps = {
  notification: Notification
  size?: NotificationVisualSize
}

const visualSizeClasses: Record<NotificationVisualSize, { container: string; icon: string }> = {
  sm: {
    container: 'size-8',
    icon: 'size-4',
  },
  md: {
    container: 'size-12',
    icon: 'size-5',
  },
}

export function NotificationVisual({ notification, size = 'sm' }: NotificationVisualProps) {
  const visualClasses = visualSizeClasses[size]

  if (notification.type === 'interaction') {
    return (
      <Avatar className={`shrink-0 ${visualClasses.container}`}>
        <AvatarImage src={notification.avatar || DEFAULT_AVATAR_URL} />
        <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
      </Avatar>
    )
  }

  if (notification.type === 'system') {
    return (
      <div
        className={`bg-muted flex items-center justify-center shrink-0 border rounded-full ${visualClasses.container}`}
      >
        <Bell className={`text-primary ${visualClasses.icon}`} />
      </div>
    )
  }

  if (notification.type === 'calendar') {
    return (
      <div
        className={`bg-muted flex items-center justify-center shrink-0 border rounded-full ${visualClasses.container}`}
      >
        <Calendar className={`text-primary ${visualClasses.icon}`} />
      </div>
    )
  }

  return (
    <div
      className={`bg-destructive/10 flex items-center justify-center shrink-0 border border-destructive/30 rounded-full ${visualClasses.container}`}
    >
      <AlertTriangle className={`text-destructive ${visualClasses.icon}`} />
    </div>
  )
}
