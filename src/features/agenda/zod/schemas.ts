import { z } from 'zod'

export const agendaEventSchema = z.object({
  title: z.string().trim().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().trim().optional().or(z.literal('')),
  startDate: z.string().min(1, 'Data é obrigatória'),
  endDate: z.string().optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  origin: z.enum(['PERSONAL', 'THIRD_PARTY']),
  thirdPartySystem: z.string().optional().or(z.literal('')),
  thirdPartyId: z.string().optional().or(z.literal('')),
  thirdPartyUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type AgendaEventFormSchema = z.infer<typeof agendaEventSchema>
