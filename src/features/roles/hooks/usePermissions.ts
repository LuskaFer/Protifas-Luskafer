import { useQuery } from '@tanstack/react-query'
import { fetchPermissions } from '../api/rolesApi'
import type { PermissionGroup } from '../interfaces'

const PERMISSIONS_KEY = ['permissions'] as const

export function usePermissions() {
  return useQuery<PermissionGroup[]>({
    queryKey: PERMISSIONS_KEY,
    queryFn: fetchPermissions,
  })
}
