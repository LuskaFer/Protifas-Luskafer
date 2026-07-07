export function sanitizeXSS(text: string) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function sanitizeNotificationPayload<T extends Record<string, unknown>>(data: T) {
  if (!data || typeof data !== 'object') {
    return null
  }

  const safeMessage = typeof data.message === 'string' ? sanitizeXSS(data.message) : undefined
  const safeTitle = typeof data.title === 'string' ? sanitizeXSS(data.title) : undefined
  const safeDescription =
    typeof data.description === 'string' ? sanitizeXSS(data.description) : undefined
  const safeData =
    typeof data.data === 'object' && data.data !== null
      ? { ...(data.data as Record<string, unknown>) }
      : undefined

  if (safeData) {
    if (typeof safeData.title === 'string') {
      safeData.title = sanitizeXSS(safeData.title)
    }
    if (typeof safeData.body === 'string') {
      safeData.body = sanitizeXSS(safeData.body)
    }
    if (typeof safeData.description === 'string') {
      safeData.description = sanitizeXSS(safeData.description)
    }
  }

  return {
    ...data,
    message: safeMessage ?? data.message,
    title: safeTitle ?? data.title,
    description: safeDescription ?? data.description,
    data: safeData ?? data.data,
  } as T
}
