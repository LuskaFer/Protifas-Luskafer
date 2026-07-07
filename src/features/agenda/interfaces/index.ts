export type AgendaCategory = 'MEETING' | 'DEADLINE' | 'HEARING' | 'PERSONAL' | 'OTHER'
export type AgendaPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type AgendaStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
export type AgendaOrigin = 'PERSONAL' | 'THIRD_PARTY'

export interface AgendaEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  category: AgendaCategory
  priority: AgendaPriority
  status: AgendaStatus
  origin: AgendaOrigin
  ownerUserId: string
  thirdPartySystem: string
  thirdPartyId: string
  thirdPartyUrl: string
  createdByUserId: string
  createdAt: string
  updatedAt: string
  completedAt: string
  cancelledAt: string
}

export interface AgendaFilters {
  dateFrom: string
  dateTo: string
  category: string
  status: string
  origin: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

export interface DatesWithEventsResponse {
  dates: string[]
}

export interface CreateAgendaEventDTO {
  title: string
  description?: string
  startDate: string
  endDate?: string
  category: string
  priority: string
  thirdPartySystem?: string
  thirdPartyId?: string
  thirdPartyUrl?: string
}

export interface UpdateAgendaEventDTO {
  title: string
  description?: string
  startDate: string
  endDate?: string
  category: string
  priority: string
  thirdPartySystem?: string
  thirdPartyId?: string
  thirdPartyUrl?: string
}

export const PRIORITY_CONFIG = {
  HIGH: {
    color: 'bg-red-500',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50/50 dark:bg-red-950/20',
    icon: 'AlertTriangle' as const,
    iconColor: 'text-red-600 dark:text-red-400',
    badgeColor:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
  },
  MEDIUM: {
    color: 'bg-amber-500',
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'Minus' as const,
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeColor:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  },
  LOW: {
    color: 'bg-blue-500',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
    icon: 'ArrowDown' as const,
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeColor:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  },
} as const

export const AGENDA_PRIORITY_LABELS: Record<string, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
}

export const AGENDA_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

export const AGENDA_PRIORITY_VARIANT_MAP: Record<
  string,
  'primary' | 'secondary' | 'destructive' | 'outline'
> = {
  HIGH: 'destructive',
  MEDIUM: 'secondary',
  LOW: 'outline',
}

export const AGENDA_STATUS_VARIANT_MAP: Record<
  string,
  'primary' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'outline',
  CONFIRMED: 'secondary',
  COMPLETED: 'primary',
  CANCELLED: 'destructive',
}
