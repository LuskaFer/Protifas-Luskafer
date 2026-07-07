import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { experienceManagementApi } from '../api/experienceManagementApi'

export function useUpdateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
      file,
      gallery,
    }: {
      id: string
      payload: Record<string, unknown>
      file?: File | null
      gallery?: File[]
    }) => experienceManagementApi.update(id, payload, file, gallery),
    onSuccess: (_data, { id }) => {
      toast.success('Experiência atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-experiences'] })
      queryClient.invalidateQueries({ queryKey: ['management-experiences', id] })
    },
    onError: () => {
      toast.error('Erro ao atualizar experiência.')
    },
  })
}
