import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().default('http://localhost:8080'),
  VITE_APP_NAME: z.string().default('Portal Prefeitura'),
})

export const env = envSchema.parse(import.meta.env)
