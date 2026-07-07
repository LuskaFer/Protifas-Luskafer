import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título não pode exceder 200 caracteres'),

  dateMade: z.string().trim().min(1, 'Data de criação é obrigatória'),

  repositoryUrl: z.string().url('URL inválida').optional().or(z.literal('')),

  liveUrl: z.string().url('URL inválida').optional().or(z.literal('')),

  description: z
    .string()
    .trim()
    .min(50, 'Descrição deve ter no mínimo 50 caracteres')
    .max(10000, 'Descrição não pode exceder 10000 caracteres'),

  company: z
    .string()
    .trim()
    .max(150, 'Empresa não pode exceder 150 caracteres')
    .optional()
    .or(z.literal('')),

  projectType: z.enum(['DEV', 'GENERAL'], { error: 'Tipo é obrigatório' }),
})

export type CreateProjectFormSchema = z.infer<typeof createProjectSchema>

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024

export const thumbnailFileSchema = z
  .instanceof(File)
  .refine(file => file.size <= MAX_THUMBNAIL_SIZE, { message: 'A imagem não pode exceder 5MB' })
