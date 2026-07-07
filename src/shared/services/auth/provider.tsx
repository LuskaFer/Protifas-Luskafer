import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { authApi } from './api'
import type { Permission, Profile, UserRole } from './types'

interface AuthContextType {
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  role: UserRole | null
  permissions: Permission[]
  isAdmin: boolean
  hasPermission: (action: string, resource: string) => boolean
  hasRole: (role: UserRole) => boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const role = useMemo<UserRole | null>(() => {
    if (!profile) return null
    return profile.roles?.[0] ?? 'USER'
  }, [profile])

  const permissions = useMemo(() => profile?.permissions ?? [], [profile?.permissions])
  const isAdmin = role === 'ADMIN'

  const hasPermission = useCallback(
    (action: string, resource: string): boolean => {
      if (isAdmin) return true
      if (permissions.some(p => p.action === 'MANAGE' && p.resource === 'ALL')) return true
      return permissions.some(p => p.action === action && p.resource === resource)
    },
    [isAdmin, permissions],
  )

  const hasRole = useCallback((r: UserRole) => role === r, [role])

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const [profileData, permissionsData] = await Promise.all([
        authApi.getProfile(),
        authApi.getPermissions(),
      ])
      setProfile({ ...profileData, permissions: permissionsData } as Profile)
    } catch {
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const publicPaths = ['/', '/login', '/forgot-password', '/reset-password']
    if (publicPaths.some(p => window.location.pathname === p)) {
      setIsLoading(false)
      return
    }
    fetchProfile()
  }, [fetchProfile])

  const logout = async () => {
    await authApi.logout()
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        isAuthenticated: !!profile,
        role,
        permissions,
        isAdmin,
        hasPermission,
        hasRole,
        logout,
        refetch: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
