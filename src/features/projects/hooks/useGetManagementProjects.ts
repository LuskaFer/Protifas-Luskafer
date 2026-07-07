import { useQuery } from '@tanstack/react-query'
import { projectManagementApi } from '../api/projectManagementApi'

export function useGetManagementProjects() {
  return useQuery({
    queryKey: ['management-projects'],
    queryFn: () => projectManagementApi.getList(),
  })
}
