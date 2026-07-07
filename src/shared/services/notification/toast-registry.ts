const notificationToastIds = new Set<string>()

export function shouldShowNotificationToast(notificationId: string): boolean {
  if (notificationToastIds.has(notificationId)) {
    return false
  }

  notificationToastIds.add(notificationId)
  return true
}
