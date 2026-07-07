import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import type { UseFormSetError } from 'react-hook-form'
import type { LoginFormSchema } from '@/shared/services/auth'
import { authApi, useAuth } from '@/shared/services/auth'

export const useLogin = (setError: UseFormSetError<LoginFormSchema>) => {
  const navigate = useNavigate()
  const { refetch } = useAuth()

  const onSubmit = useCallback(
    async (data: LoginFormSchema) => {
      try {
        await authApi.login(data)
        await refetch()
        navigate({ to: '/dashboard' })
      } catch (err: unknown) {
        const isAuthError =
          err &&
          typeof err === 'object' &&
          'response' in err &&
          (err as { response: { status: number } }).response?.status === 401

        if (isAuthError) {
          setError('root', { message: 'E-mail ou senha incorretos. Por favor, tente novamente.' })
        } else {
          setError('root', {
            message: 'Erro de conexão com o servidor. Tente novamente mais tarde.',
          })
        }
      }
    },
    [refetch, navigate, setError],
  )

  return { onSubmit }
}
