import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectManagementApi } from '../api/projectManagementApi'

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectManagementApi.delete(id),
    onSuccess: () => {
      toast.success('Projeto removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-projects'] })
    },
    onError: () => {
      toast.error('Erro ao remover projeto.')
    },
  })
}
