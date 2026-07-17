import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Luskafer Portfolio'),
})

export const env = envSchema.parse(import.meta.env)
