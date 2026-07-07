import { api } from '@/shared/services/http'
import type {
  ChangePasswordFormSchema,
  ForgotPasswordFormSchema,
  LoginFormSchema,
  ResetPasswordFormSchema,
} from './schemas'
import { changePasswordRequestSchema } from './schemas'
import type { Profile } from './types'

export const updatePassword = async (credentials: ChangePasswordFormSchema) => {
  const parsedCredentials = changePasswordRequestSchema.parse(credentials)
  await api.put('/me/password', parsedCredentials)
}

export const authApi = {
  login: async (credentials: LoginFormSchema) => {
    const response = await api.post('/auth/login', credentials)
    return response
  },
  forgotPassword: async (data: ForgotPasswordFormSchema) => {
    await api.post('/auth/forgot-password', data)
  },
  resetPassword: async (token: string, data: ResetPasswordFormSchema) => {
    const { password } = data
    await api.post('/auth/reset-password', {
      token: token.trim(),
      newPassword: password,
    })
  },
  logout: async () => {
    try {
      await api.post('/me/logout')
    } catch {
      // ignore
    }
  },
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get<Profile>('/me')
    return data
  },
  getPermissions: async (): Promise<
    { id: number; action: string; resource: string; name?: string; description?: string }[]
  > => {
    const { data } = await api.get('/me/permissions')
    return data
  },
}
