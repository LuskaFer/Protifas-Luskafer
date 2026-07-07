import { useQuery } from '@tanstack/react-query'
import { fetchRolePermissions } from '@/features/roles/api/rolesApi'

const STABLE_EMPTY_PERMISSION_SET = new Set<number>()

export function useRolePermissions(roleId: string | null) {
  const { data: permissionIds, isLoading } = useQuery({
    queryKey: ['roles', roleId, 'permissions'],
    queryFn: () => fetchRolePermissions(roleId as string).then(ids => new Set(ids)),
    enabled: !!roleId,
    meta: { errorMessage: 'Erro ao carregar permissões do cargo.' },
  })

  return { permissionIds: permissionIds ?? STABLE_EMPTY_PERMISSION_SET, isLoading }
}
