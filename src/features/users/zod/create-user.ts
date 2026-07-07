import { z } from 'zod'

const OAB_PATTERN = /^\d{6}\/[A-Z]{2}$/
const VALID_UFS = new Set([
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
])

const optionalTextField = z.union([z.string(), z.undefined()]).transform(value => {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized === '' ? undefined : normalized
})

const hasAllDigitsEqual = (digits: string) => /^(\d)\1+$/.test(digits)

const calculateCpfVerifierDigit = (digits: string, length: number) => {
  let sum = 0
  let weight = length + 1
  for (let index = 0; index < length; index += 1) {
    const digit = Number(digits[index])
    sum += digit * weight
    weight -= 1
  }
  const remainder = sum % 11
  const result = 11 - remainder
  return result >= 10 ? 0 : result
}

const isValidCpf = (value: string) => {
  const sanitized = value.replace(/\D/g, '')
  if (sanitized.length !== 11) return false
  if (hasAllDigitsEqual(sanitized)) return false
  const firstCheckDigit = calculateCpfVerifierDigit(sanitized, 9)
  const secondCheckDigit = calculateCpfVerifierDigit(sanitized, 10)
  return firstCheckDigit === Number(sanitized[9]) && secondCheckDigit === Number(sanitized[10])
}

const emailSchema = z
  .string()
  .trim()
  .min(1, 'E-mail é obrigatório')
  .regex(/^[A-Za-z0-9._+-]+$/, 'Use apenas letras, números e . _ + -')
  .transform(value => value.toLowerCase())

const cpfSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .refine(value => isValidCpf(value), 'CPF inválido')

const oabSchema = optionalTextField
  .transform(value => value?.toUpperCase())
  .refine(value => {
    if (!value) return true
    if (!OAB_PATTERN.test(value)) return false
    const uf = value.split('/')[1]
    return VALID_UFS.has(uf)
  }, 'OAB deve estar no formato 000000/UF')

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  cpfNumber: cpfSchema,
  oabNumber: oabSchema,
  emailAddress: emailSchema,
  rawPassword: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  procuradoriaId: z.number('Procuradoria é obrigatória').min(1, 'Procuradoria é obrigatória'),
})

export type CreateUserFormSchema = z.infer<typeof createUserSchema>

export const editUserSchema = z.object({
  fullName: z.string().min(1, 'Nome é obrigatório'),
  emailAddress: emailSchema,
  cpfNumber: cpfSchema,
  oabNumber: oabSchema,
  procuradoriaId: z.number('Procuradoria é obrigatória').min(1, 'Procuradoria é obrigatória'),
})

export type EditUserFormSchema = z.infer<typeof editUserSchema>
