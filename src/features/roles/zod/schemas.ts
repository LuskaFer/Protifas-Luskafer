import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome do cargo é obrigatório.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),
})

export type CreateRoleFormData = z.infer<typeof createRoleSchema>
