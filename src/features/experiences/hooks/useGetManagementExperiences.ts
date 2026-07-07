import { useQuery } from '@tanstack/react-query'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function useGetManagementExperiences() {
  return useQuery({
    queryKey: ['management-experiences'],
    queryFn: () => experienceManagementApi.getList(),
  })
}
