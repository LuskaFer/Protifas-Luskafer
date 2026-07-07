export interface NotificationDto {
  id: string
  title: string
  description: string
  isRead: boolean
  actionLabel: string | null
  type: string
  avatar: string | null
  avatarFallback: string | null
  icon: string | null
}

export type NotificationType = 'interaction' | 'system' | 'calendar' | 'deadline'

export type Notification = {
  id: string
  title: string
  description: string
  isRead?: boolean
  action?: () => void
  actionLabel?: string
} & (
  | {
      type: 'interaction'
      avatar: string
      avatarFallback: string
    }
  | {
      type: 'system' | 'calendar' | 'deadline'
      icon: string
    }
)
