import { useQuery } from '@tanstack/react-query'
import { projectManagementApi } from '../api/projectManagementApi'

export function useGetProjectDetail(id: string | null) {
  return useQuery({
    queryKey: ['management-projects', id],
    queryFn: () => projectManagementApi.getById(id!),
    enabled: !!id,
  })
}
