import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email é obrigatório')
    .email('Email inválido')
    .toLowerCase()
    .trim()
    .refine(email => email.endsWith('@sjc.sp.gov.br'), 'Email inválido para este domínio'),
  password: z
    .string()
    .nonempty('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty('O e-mail é obrigatório').email('Formato de e-mail inválido'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().nonempty('A senha é obrigatória'),
    confirmPassword: z.string().nonempty('Confirme a senha'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional().or(z.literal('')),
    newPassword: z.string().optional().or(z.literal('')),
    confirmNewPassword: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const hasPasswordChange = Boolean(
      data.currentPassword || data.newPassword || data.confirmNewPassword,
    )

    if (!hasPasswordChange) return

    if (!data.currentPassword?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A senha atual é obrigatória',
        path: ['currentPassword'],
      })
    } else if (data.currentPassword.length > 256) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A senha atual não pode exceder 256 caracteres',
        path: ['currentPassword'],
      })
    }

    if (!data.newPassword?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A nova senha é obrigatória',
        path: ['newPassword'],
      })
    } else if (data.newPassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A nova senha deve ter no mínimo 8 caracteres',
        path: ['newPassword'],
      })
    } else if (data.newPassword.length > 256) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A nova senha não pode exceder 256 caracteres',
        path: ['newPassword'],
      })
    }

    if (!data.confirmNewPassword?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Confirme a nova senha',
        path: ['confirmNewPassword'],
      })
    } else if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas não coincidem',
        path: ['confirmNewPassword'],
      })
    }
  })

export const changePasswordRequestSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .min(1, 'A senha atual é obrigatória')
    .max(256, 'A senha atual é muito longa'),
  newPassword: z
    .string()
    .trim()
    .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
    .max(256, 'A nova senha é muito longa'),
})

export type ChangePasswordFormSchema = z.infer<typeof changePasswordSchema>

export type LoginFormSchema = z.infer<typeof loginSchema>
export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>
