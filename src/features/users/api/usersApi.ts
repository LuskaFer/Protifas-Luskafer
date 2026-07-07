import type { PermissionOverride, UserData } from '@/features/users/interfaces'
import { api } from '@/shared/services/http'

function normalizeUser(user: {
  id?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email?: string
  emailAddress?: string
  cpf?: string
  cpfNumber?: string
  oab?: string
  oabNumber?: string
  avatarUrl?: string | null
  avatar?: string | null
  roles?: string[]
  procuradoriaId?: number
}): UserData {
  return {
    id: user.id ?? '',
    fullName: user.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(' '),
    email: user.email ?? user.emailAddress ?? '',
    cpf: user.cpf ?? user.cpfNumber,
    oab: user.oab ?? user.oabNumber,
    avatarUrl: user.avatarUrl ?? user.avatar ?? null,
    roles: user.roles ?? [],
    procuradoriaId: user.procuradoriaId ?? null,
  }
}

export function fetchUsers(): Promise<UserData[]> {
  return api.get('/users').then(response => {
    const data = Array.isArray(response.data) ? response.data : response.data?.content || []
    return data.map(normalizeUser)
  })
}

export interface UserDetail {
  id?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email?: string
  emailAddress?: string
  cpf?: string
  cpfNumber?: string
  oab?: string
  oabNumber?: string
  avatarUrl?: string | null
  avatar?: string | null
  procuradoriaId?: number | null
  roles?: Array<string | { id?: string; name?: string }>
}

export function fetchUserDetail(id: string): Promise<UserDetail> {
  return api.get<UserDetail>(`/users/${id}`).then(response => response.data)
}

export function fetchUserPermissionOverrides(id: string): Promise<PermissionOverride[]> {
  return api
    .get<PermissionOverride[]>(`/users/${id}/permissions/overrides`)
    .then(response => (Array.isArray(response.data) ? response.data : []))
}

export function updateUser(
  id: string,
  data: {
    firstName: string | null
    lastName: string | null
    emailAddress: string
    cpfNumber: string | null
    oabNumber: string | null
    avatarUrl: string
    procuradoriaId: number
  },
): Promise<void> {
  return api.put(`/users/${id}`, data)
}

export function updateUserRoles(id: string, roleIds: string[]): Promise<void> {
  return api.put(`/users/${id}/roles`, { roleIds })
}

export function updateUserPermissions(
  id: string,
  overrides: Array<{ permissionId: number; isGranted: boolean }>,
): Promise<void> {
  return api.put(`/users/${id}/permissions`, overrides)
}

export function createUser(data: {
  firstName: string
  lastName: string
  emailAddress: string
  rawPassword: string
  cpfNumber: string
  oabNumber: string | null
  procuradoriaId: number
}): Promise<void> {
  return api.post('/users', data)
}
