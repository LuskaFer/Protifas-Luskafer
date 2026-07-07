import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function useToggleFeaturedExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => experienceManagementApi.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['management-experiences'] })
    },
    onError: () => {
      toast.error('Erro ao alterar destaque da experiência.')
    },
  })
}
