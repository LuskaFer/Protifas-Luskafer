import { useMemo } from 'react'
import { useNotificationContext } from '../provider'

export function useNotification() {
  const {
    notifications,
    unreadCount,
    sendNotification,
    ingestNotificationPayload,
    removeNotification,
    markNotificationAsRead,
    markAllAsRead,
    markAllNotificationsAsRead,
    fetchUnreadNotifications,
    fetchReadNotifications,
    clearNotifications,
  } = useNotificationContext()

  const unreadNotifications = useMemo(() => {
    return notifications.filter(notification => !notification.isRead)
  }, [notifications])

  const readNotifications = useMemo(() => {
    return notifications.filter(notification => notification.isRead)
  }, [notifications])

  const readCount = readNotifications.length

  const hasUnread = unreadCount > 0
  const hasRead = readCount > 0

  return {
    notifications,
    unreadNotifications,
    readNotifications,
    unreadCount,
    readCount,
    hasUnread,
    hasRead,
    sendNotification,
    ingestNotificationPayload,
    markNotificationAsRead,
    markAllAsRead,
    markAllNotificationsAsRead,
    fetchUnreadNotifications,
    fetchReadNotifications,
    removeNotification,
    clearNotifications,
  }
}
