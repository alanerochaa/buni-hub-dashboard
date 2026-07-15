import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default('http://localhost:3333'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Variáveis de ambiente inválidas:\n${z.prettifyError(parsed.error)}`)
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
}
