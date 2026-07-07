import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function useCreateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      payload,
      file,
      gallery,
    }: {
      payload: Record<string, unknown>
      file?: File | null
      gallery?: File[]
    }) => experienceManagementApi.create(payload, file, gallery),
    onSuccess: () => {
      toast.success('Experiência criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-experiences'] })
    },
    onError: () => {
      toast.error('Erro ao criar experiência.')
    },
  })
}
