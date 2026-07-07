import type { Notification, NotificationType } from '@/shared/services/notification/types'

type NotificationPayload = Record<string, unknown>

function normalizeNotificationType(value: unknown): NotificationType {
  if (
    value === 'interaction' ||
    value === 'system' ||
    value === 'calendar' ||
    value === 'deadline'
  ) {
    return value
  }

  return 'system'
}

function readString(source: NotificationPayload | undefined, key: string): string | undefined {
  const value = source?.[key]
  return typeof value === 'string' ? value : undefined
}

export function normalizeNotificationFromPayload(
  payload: NotificationPayload,
): Notification | null {
  const data =
    typeof payload.data === 'object' && payload.data !== null
      ? (payload.data as NotificationPayload)
      : undefined

  const idValue = payload.id ?? data?.id ?? payload.entityId ?? data?.entityId
  const id =
    typeof idValue === 'string' || typeof idValue === 'number'
      ? String(idValue)
      : `notification-${Date.now()}`

  const title =
    readString(payload, 'title') ??
    readString(data, 'title') ??
    readString(payload, 'message') ??
    'Nova notificacao'

  const description =
    readString(payload, 'description') ??
    readString(data, 'description') ??
    readString(payload, 'message') ??
    readString(data, 'message') ??
    readString(data, 'body') ??
    ''

  const typeValue = readString(payload, 'type') ?? readString(data, 'type') ?? 'system'
  const normalizedType = normalizeNotificationType(typeValue)

  if (normalizedType === 'interaction') {
    const avatar = readString(payload, 'avatar') ?? readString(data, 'avatar') ?? ''
    const avatarFallback =
      readString(payload, 'avatarFallback') ?? readString(data, 'avatarFallback') ?? ''

    if (avatar && avatarFallback) {
      return {
        id,
        type: 'interaction',
        title,
        description,
        avatar,
        avatarFallback,
        isRead: Boolean(payload.isRead ?? data?.isRead),
      }
    }
  }

  return {
    id,
    type: normalizedType === 'interaction' ? 'system' : normalizedType,
    title,
    description,
    icon: readString(payload, 'icon') ?? readString(data, 'icon') ?? 'bell',
    isRead: Boolean(payload.isRead ?? data?.isRead),
  }
}

export function extractNotificationPayloadList(responseData: unknown): NotificationPayload[] {
  if (Array.isArray(responseData)) {
    return responseData.filter(
      (item): item is NotificationPayload => typeof item === 'object' && item !== null,
    )
  }

  if (typeof responseData === 'object' && responseData !== null) {
    const content = (responseData as { content?: unknown }).content
    if (Array.isArray(content)) {
      return content.filter(
        (item): item is NotificationPayload => typeof item === 'object' && item !== null,
      )
    }
  }

  return []
}
