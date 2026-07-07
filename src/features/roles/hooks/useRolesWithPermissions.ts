import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchRolePermissions, fetchRoles } from '../api/rolesApi'
import type { RoleWithPermissionIds } from '../interfaces'

const ROLES_KEY = ['roles'] as const

export function useRolesWithPermissions() {
  const queryClient = useQueryClient()

  const query = useQuery<RoleWithPermissionIds[]>({
    queryKey: ROLES_KEY,
    queryFn: async () => {
      const roles = await fetchRoles()

      if (roles.length === 0) return []

      const rolesWithPermissions = await Promise.all(
        roles.map(async role => {
          const baseRole: RoleWithPermissionIds = {
            id: role.id ?? '',
            name: role.name ?? '',
            permissionIds: [],
          }

          if (!baseRole.id) return baseRole

          try {
            const permissionIds = await fetchRolePermissions(baseRole.id)
            baseRole.permissionIds = permissionIds
          } catch {
            // permissões vazias em caso de erro
          }

          return baseRole
        }),
      )

      return rolesWithPermissions
    },
  })

  return {
    roles: query.data ?? [],
    isLoading: query.isLoading,
    refetch: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  }
}
