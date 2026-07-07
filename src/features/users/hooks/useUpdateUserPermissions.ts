import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUserPermissions } from '@/features/users/api/usersApi'

export function useUpdateUserPermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      overrides,
    }: {
      id: string
      overrides: Array<{ permissionId: number; isGranted: boolean }>
    }) => updateUserPermissions(id, overrides),
    onSuccess: () => {
      toast.success('Permissões atualizadas com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erro ao atualizar permissões.')
    },
  })
}
