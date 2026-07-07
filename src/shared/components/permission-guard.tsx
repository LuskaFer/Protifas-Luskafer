import { useNavigate } from '@tanstack/react-router'
import { type ReactNode, useEffect, useRef } from 'react'
import { useAuth } from '@/shared/services/auth'

interface PermissionGuardProps {
  action: string
  resource: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({
  action,
  resource,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useAuth()

  if (isLoading) return null
  if (!hasPermission(action, resource)) return fallback

  return <>{children}</>
}

interface ProtectedRouteProps {
  action: string
  resource: string
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  action,
  resource,
  children,
  redirectTo = '/dashboard',
}: ProtectedRouteProps) {
  const { hasPermission, isLoading } = useAuth()
  const navigate = useNavigate()
  const wasLoadingRef = useRef(true)

  useEffect(() => {
    if (isLoading) {
      wasLoadingRef.current = true
      return
    }

    if (!wasLoadingRef.current) return

    wasLoadingRef.current = false

    if (!hasPermission(action, resource)) {
      navigate({ to: redirectTo as never })
    }
  }, [isLoading, hasPermission, action, resource, navigate, redirectTo])

  if (isLoading) return null
  if (!hasPermission(action, resource)) return null

  return <>{children}</>
}
