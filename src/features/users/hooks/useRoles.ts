import { useQuery } from '@tanstack/react-query'
import { fetchRoles } from '@/features/roles/api/rolesApi'

const ROLES_QUERY_KEY = ['roles', 'summary'] as const
const STABLE_EMPTY_ROLES: import('@/features/roles/interfaces').Role[] = []

export function useRoles() {
  const {
    data: roles,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: fetchRoles,
    meta: { errorMessage: 'Erro ao carregar cargos.' },
  })

  return { roles: roles ?? STABLE_EMPTY_ROLES, isLoading, refetch }
}
