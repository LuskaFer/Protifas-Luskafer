import { AgendaDailyNotification } from '@/features/agenda'
import { useMiddleClickDismissToasts } from '@/shared/hooks/use-middle-click-dismiss-toasts'
import { usePermissionsChangedSse } from '@/shared/services/auth'
import { useNotificationEvents } from '@/shared/services/notification'

export function AppEvents() {
  useNotificationEvents()
  usePermissionsChangedSse()
  useMiddleClickDismissToasts()
  return <AgendaDailyNotification />
}
