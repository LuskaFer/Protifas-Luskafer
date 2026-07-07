import { z } from 'zod'

export const createExperienceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título não pode exceder 200 caracteres'),

  company: z
    .string()
    .trim()
    .min(2, 'Empresa deve ter no mínimo 2 caracteres')
    .max(150, 'Empresa não pode exceder 150 caracteres'),

  period: z
    .string()
    .trim()
    .min(2, 'Período deve ter no mínimo 2 caracteres')
    .max(100, 'Período não pode exceder 100 caracteres'),

  description: z
    .string()
    .trim()
    .min(50, 'Descrição deve ter no mínimo 50 caracteres')
    .max(16000, 'Descrição não pode exceder 16000 caracteres'),
})

export type CreateExperienceFormSchema = z.infer<typeof createExperienceSchema>

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024

export const thumbnailFileSchema = z
  .instanceof(File)
  .refine(file => file.size <= MAX_THUMBNAIL_SIZE, { message: 'A imagem não pode exceder 5MB' })
