import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectManagementApi } from '../api/projectManagementApi'

export function usePublishProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectManagementApi.publish(id),
    onSuccess: () => {
      toast.success('Projeto publicado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-projects'] })
    },
    onError: () => {
      toast.error('Erro ao publicar projeto.')
    },
  })
}
