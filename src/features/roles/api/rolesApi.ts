import { api } from '@/shared/services/http'
import type {
  CreateRolePayload,
  Permission,
  PermissionGroup,
  RoleSummary,
  UpdateRoleNamePayload,
  UpdateRolePermissionsPayload,
} from '../interfaces'

export function fetchRoles(): Promise<RoleSummary[]> {
  return api.get('/roles').then(response => {
    const data = response.data
    return Array.isArray(data) ? data : (data?.content ?? [])
  })
}

export function fetchRolePermissions(roleId: string): Promise<number[]> {
  return api.get<Permission[]>(`/roles/${roleId}/permissions`).then(response => {
    const permissions = Array.isArray(response.data) ? response.data : []
    return permissions.map(p => p.id).filter((id): id is number => typeof id === 'number')
  })
}

export function fetchPermissions(): Promise<PermissionGroup[]> {
  return api
    .get<PermissionGroup[] | { content?: PermissionGroup[] }>('/permissions')
    .then(response => {
      const payload = response.data
      return Array.isArray(payload) ? payload : (payload.content ?? [])
    })
}

export function createRole(data: CreateRolePayload): Promise<void> {
  return api.post('/roles', data)
}

export function updateRoleName(roleId: string, data: UpdateRoleNamePayload): Promise<void> {
  return api.patch(`/roles/${roleId}/name`, data)
}

export function updateRolePermissions(
  roleId: string,
  data: UpdateRolePermissionsPayload,
): Promise<void> {
  return api.put(`/roles/${roleId}/permissions`, data)
}

export function deleteRole(roleId: string): Promise<void> {
  return api.delete(`/roles/${roleId}`)
}
