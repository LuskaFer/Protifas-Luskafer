export interface UserData {
  id: string
  fullName: string
  email: string
  cpf?: string
  oab?: string
  avatarUrl?: string | null
  roles?: string[]
  procuradoriaId?: number | null
}

export interface CreateUserModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  onSuccess?: () => void
}

export interface PermissionOverride {
  permissionId: number
  isGranted: boolean
}
