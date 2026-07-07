import { useQuery } from '@tanstack/react-query'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function useGetExperienceDetail(id: string | null) {
  return useQuery({
    queryKey: ['management-experiences', id],
    queryFn: () => experienceManagementApi.getById(id!),
    enabled: !!id,
  })
}
