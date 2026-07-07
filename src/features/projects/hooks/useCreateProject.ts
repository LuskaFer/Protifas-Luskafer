import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectManagementApi } from '../api/projectManagementApi'

export function useCreateProject() {
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
    }) => projectManagementApi.create(payload, file, gallery),
    onSuccess: () => {
      toast.success('Projeto criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['management-projects'] })
    },
    onError: () => {
      toast.error('Erro ao criar projeto.')
    },
  })
}
