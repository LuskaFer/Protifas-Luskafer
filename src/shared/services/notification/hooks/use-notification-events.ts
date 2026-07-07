import { showNotificationToast } from '@/shared/layouts/header/notification-toast'
import type {
  Notification,
  NotificationDto,
  NotificationType,
} from '@/shared/services/notification/types'
import { useSseEvent } from '@/shared/services/sse'
import { shouldShowNotificationToast } from '../toast-registry'
import { useNotification } from './use-notification'

function dtoToNotification(dto: NotificationDto): Notification {
  const base = {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    isRead: dto.isRead,
    actionLabel: dto.actionLabel ?? undefined,
  }

  if (dto.type === 'interaction' && dto.avatar && dto.avatarFallback) {
    return {
      ...base,
      type: 'interaction',
      avatar: dto.avatar,
      avatarFallback: dto.avatarFallback,
    }
  }

  const type: NotificationType =
    dto.type === 'calendar' || dto.type === 'deadline' ? dto.type : 'system'

  return {
    ...base,
    type,
    icon: dto.icon ?? 'bell',
  }
}

export function useNotificationEvents(): void {
  const { ingestNotificationPayload } = useNotification()

  useSseEvent<NotificationDto>('notification', data => {
    if (!data || typeof data !== 'object') return

    ingestNotificationPayload(data as unknown as Record<string, unknown>)

    const notification = dtoToNotification(data)

    if (shouldShowNotificationToast(notification.id)) {
      showNotificationToast(notification)
    }
  })
}
