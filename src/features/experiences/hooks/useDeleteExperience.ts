import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => experienceManagementApi.delete(id),
    onSuccess: () => {
      toast.success('Experiência removida com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-experiences'] })
    },
    onError: () => {
      toast.error('Erro ao remover experiência.')
    },
  })
}
