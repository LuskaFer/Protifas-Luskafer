import { useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import type { UseFormSetError } from 'react-hook-form'
import type { ResetPasswordFormSchema } from '@/shared/services/auth'
import { authApi } from '@/shared/services/auth'

export const useResetPassword = (setError: UseFormSetError<ResetPasswordFormSchema>) => {
  const search = useSearch({ from: '/_auth/reset-password' })
  const token = (search as { token?: string }).token
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (data: ResetPasswordFormSchema) => {
    try {
      if (!token) {
        setError('root', {
          message: 'Não foi possível reconhecer a conta que fez essa solicitação.',
        })
        return
      }
      await authApi.resetPassword(token, data)
      setSubmitted(true)
    } catch {
      setError('root', { message: 'Ocorreu um erro. Por favor, tente novamente mais tarde.' })
    }
  }

  return { onSubmit, submitted }
}
