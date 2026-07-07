import {
  createContext,
  type ReactNode,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { sanitizeNotificationPayload } from '@/shared/lib/security'
import { useAuth } from '@/shared/services/auth'
import { api } from '@/shared/services/http'
import type { Notification } from '@/shared/services/notification/types'
import {
  extractNotificationPayloadList,
  normalizeNotificationFromPayload,
} from './helpers/normalizer'

const NOTIFICATION_API_PREFIX = '/notifications'

type NotificationContextData = {
  notifications: Notification[]
  unreadCount: number
  sendNotification: (newNotification: Notification) => void
  ingestNotificationPayload: (payload: Record<string, unknown>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  fetchUnreadNotifications: () => Promise<void>
  fetchReadNotifications: () => Promise<void>
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextData | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length
  }, [notifications])

  const isUuid = useCallback((value: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  }, [])

  const isNumericId = useCallback((value: string) => {
    return /^\d+$/.test(value)
  }, [])

  const pushNotification = useCallback((newNotification: Notification) => {
    setNotifications(current => {
      const normalizedNotification = {
        ...newNotification,
        isRead: newNotification.isRead ?? false,
      }

      const existingIndex = current.findIndex(
        notification => notification.id === normalizedNotification.id,
      )

      if (existingIndex === -1) {
        return [normalizedNotification, ...current]
      }

      const nextNotifications = [...current]
      nextNotifications[existingIndex] = {
        ...nextNotifications[existingIndex],
        ...normalizedNotification,
        isRead: normalizedNotification.isRead ?? nextNotifications[existingIndex].isRead,
      }

      return nextNotifications
    })
  }, [])

  const sendNotification = useCallback(
    (newNotification: Notification) => {
      pushNotification(newNotification)
    },
    [pushNotification],
  )

  const ingestNotificationPayload = useCallback(
    (payload: Record<string, unknown>) => {
      const safePayload = sanitizeNotificationPayload(payload)
      if (!safePayload) return

      const normalized = normalizeNotificationFromPayload(safePayload)
      if (normalized) {
        pushNotification(normalized)
      }
    },
    [pushNotification],
  )

  function removeNotification(id: string) {
    void markNotificationAsRead(id)
  }

  function clearNotifications() {
    void markAllAsRead()
  }

  async function markNotificationAsRead(id: string) {
    try {
      if (isUuid(id) || isNumericId(id)) {
        await api.patch(`${NOTIFICATION_API_PREFIX}/${id}/read`)
      }
      setNotifications(current =>
        current.map(notification =>
          notification.id === id && !notification.isRead
            ? { ...notification, isRead: true }
            : notification,
        ),
      )
    } catch (error) {
      console.error('Erro ao marcar notificacao como lida:', error)
    }
  }

  async function markAllAsRead() {
    try {
      await api.put(`${NOTIFICATION_API_PREFIX}/read-all`)
      setNotifications(current => current.map(notification => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error('Erro ao marcar todas notificacoes como lidas:', error)
    }
  }

  const mergeNotifications = useCallback((items: Notification[]) => {
    setNotifications(current => {
      const nextNotifications = [...current]

      for (const notification of items) {
        const existingIndex = nextNotifications.findIndex(item => item.id === notification.id)

        if (existingIndex === -1) {
          nextNotifications.unshift(notification)
          continue
        }

        nextNotifications[existingIndex] = {
          ...nextNotifications[existingIndex],
          ...notification,
        }
      }

      return nextNotifications
    })
  }, [])

  const fetchNotificationsByState = useCallback(
    async (path: 'unread' | 'read') => {
      try {
        const response = await api.get(`${NOTIFICATION_API_PREFIX}/${path}`, {
          params: { page: 0, size: 25 },
        })

        const normalized = extractNotificationPayloadList(response.data)
          .map(item => normalizeNotificationFromPayload(item))
          .filter((item): item is Notification => Boolean(item))

        mergeNotifications(normalized)
      } catch (error) {
        const humanReadableState = path === 'unread' ? 'nao lidas' : 'lidas'
        console.error(`Erro ao buscar notificacoes ${humanReadableState}:`, error)
      }
    },
    [mergeNotifications],
  )

  const fetchUnreadNotifications = useCallback(async () => {
    await fetchNotificationsByState('unread')
  }, [fetchNotificationsByState])

  const fetchReadNotifications = useCallback(async () => {
    await fetchNotificationsByState('read')
  }, [fetchNotificationsByState])

  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading || !isAuthenticated) return

    startTransition(async () => {
      try {
        const response = await api.get(`${NOTIFICATION_API_PREFIX}/unread`, {
          params: { page: 0, size: 500 },
        })
        const data = response.data as { content?: Notification[]; totalElements?: number }

        const items = extractNotificationPayloadList(data.content ?? data)
          .map(item => normalizeNotificationFromPayload(item))
          .filter((item): item is Notification => Boolean(item))

        mergeNotifications(items)
      } catch {
        // silent
      }
    })
  }, [mergeNotifications, isAuthenticated, authLoading])

  const notificationContextValue: NotificationContextData = {
    notifications,
    unreadCount,
    sendNotification,
    ingestNotificationPayload,
    removeNotification,
    markNotificationAsRead,
    markAllAsRead,
    markAllNotificationsAsRead: markAllAsRead,
    fetchUnreadNotifications,
    fetchReadNotifications,
    clearNotifications,
  }

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
