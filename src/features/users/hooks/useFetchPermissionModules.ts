import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/services/http'

export interface PermissionItem {
  id: number
  name: string
}

export interface PermissionGroup {
  module: string
  permissions: PermissionItem[]
}

export function useFetchPermissionModules() {
  return useQuery<PermissionGroup[]>({
    queryKey: ['permission-modules'],
    queryFn: async () => {
      const response = await api.get<PermissionGroup[]>('/permissions')
      const data = Array.isArray(response.data)
        ? response.data
        : ((response.data as { content?: PermissionGroup[] })?.content ?? [])
      return data
    },
    meta: { errorMessage: 'Erro ao carregar módulos de permissão.' },
  })
}
