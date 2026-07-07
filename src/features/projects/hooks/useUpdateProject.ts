import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectManagementApi } from '../api/projectManagementApi'

export function useUpdateProject() {
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
    }) => projectManagementApi.update(id, payload, file, gallery),
    onSuccess: (_data, { id }) => {
      toast.success('Projeto atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-projects'] })
      queryClient.invalidateQueries({ queryKey: ['management-projects', id] })
    },
    onError: () => {
      toast.error('Erro ao atualizar projeto.')
    },
  })
}
