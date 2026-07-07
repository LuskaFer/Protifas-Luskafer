export type UserRole = 'ADMIN' | 'USER'

export interface Permission {
  id: number
  action: string
  resource: string
  name?: string
  description?: string
}

export interface Profile {
  id?: string
  fullName: string
  email: string
  cpf: string
  oab: string | null
  avatarUrl: string | null
  roles?: UserRole[]
  permissions?: Permission[]
}
