export const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function getMediaUrl(path?: string | null): string {
  if (!path) return ''
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  )
    return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/api${normalized}`
}
