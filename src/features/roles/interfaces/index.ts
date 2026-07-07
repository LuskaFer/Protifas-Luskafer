export interface Permission {
  id: number
  action: string
  resource: string
  name?: string
  description?: string
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

export interface RoleSummary {
  id: string
  name: string
}

export interface RoleWithPermissionIds extends RoleSummary {
  permissionIds: number[]
}

export interface PermissionItem {
  id: number
  name: string
}

export interface PermissionGroup {
  module: string
  permissions: PermissionItem[]
}

export interface CreateRolePayload {
  name: string
  permissionIds: number[]
}

export interface UpdateRoleNamePayload {
  name: string
}

export interface UpdateRolePermissionsPayload {
  permissionIds: number[]
}
