import axios from 'axios'

const baseURL = '/api'

const AUTH_PAGES = ['/login', '/forgot-password', '/reset-password']
const PUBLIC_PAGES = ['/', ...AUTH_PAGES]

function isPublicPage(): boolean {
  const path = window.location.pathname
  return PUBLIC_PAGES.some(page => path === page || path.startsWith(`${page}?`))
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

if (typeof window !== 'undefined') {
  let isRefreshing = false
  let pendingRequests: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config

      if (error.response?.status !== 401) {
        return Promise.reject(error)
      }

      if (originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error)
      }

      if (isPublicPage()) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          })
        })
      }

      isRefreshing = true

      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (refreshResponse.ok) {
          pendingRequests.forEach(({ resolve }) => {
            resolve()
          })
          pendingRequests = []
          return api(originalRequest)
        }

        pendingRequests.forEach(({ reject }) => {
          reject(new Error('Session expired'))
        })
        pendingRequests = []
        window.location.href = '/login'
      } catch {
        pendingRequests.forEach(({ reject }) => {
          reject(new Error('Session expired'))
        })
        pendingRequests = []
        window.location.href = '/login'
      } finally {
        isRefreshing = false
      }
      return Promise.reject(error)
    },
  )
}
