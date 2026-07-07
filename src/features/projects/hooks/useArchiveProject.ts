import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectManagementApi } from '../api/projectManagementApi'

export function useArchiveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectManagementApi.archive(id),
    onSuccess: () => {
      toast.success('Projeto arquivado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-projects'] })
    },
    onError: () => {
      toast.error('Erro ao arquivar projeto.')
    },
  })
}
