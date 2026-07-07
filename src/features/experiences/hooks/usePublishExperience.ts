import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function usePublishExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => experienceManagementApi.publish(id),
    onSuccess: () => {
      toast.success('Experiência publicada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-experiences'] })
    },
    onError: () => {
      toast.error('Erro ao publicar experiência.')
    },
  })
}
