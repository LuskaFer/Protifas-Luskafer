import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUser, updateUserRoles } from '@/features/users/api/usersApi'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
      roleValue,
    }: {
      id: string
      payload: {
        firstName: string | null
        lastName: string | null
        emailAddress: string
        cpfNumber: string | null
        oabNumber: string | null
        avatarUrl: string
        procuradoriaId: number
      }
      roleValue: string
    }) => {
      await updateUser(id, payload)
      if (roleValue) {
        await updateUserRoles(id, [roleValue])
      }
    },
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erro ao atualizar usuário.')
    },
  })
}
