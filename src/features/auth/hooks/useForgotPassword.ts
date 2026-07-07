import { useState } from 'react'
import type { UseFormSetError } from 'react-hook-form'
import type { ForgotPasswordFormSchema } from '@/shared/services/auth'
import { authApi } from '@/shared/services/auth'

export const useForgotPassword = (setError: UseFormSetError<ForgotPasswordFormSchema>) => {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (data: ForgotPasswordFormSchema) => {
    try {
      await authApi.forgotPassword(data)
      setSubmitted(true)
    } catch {
      setError('root', { message: 'Ocorreu um erro. Por favor, tente novamente mais tarde.' })
    }
  }

  return { onSubmit, submitted }
}
