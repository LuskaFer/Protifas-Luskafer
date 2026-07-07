import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Flag,
  MoreHorizontal,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import type { AgendaEvent } from '@/features/agenda/interfaces'
import { AGENDA_PRIORITY_LABELS, PRIORITY_CONFIG } from '@/features/agenda/interfaces'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/shared/services/auth'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

const priorityIconMap = {
  HIGH: AlertTriangle,
  MEDIUM: Flag,
  LOW: ArrowRight,
} as const

const statusConfig = {
  PENDING: {
    label: 'Pendente',
    dot: 'bg-amber-400 dark:bg-amber-500',
    text: 'text-amber-800 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  CONFIRMED: {
    label: 'Confirmado',
    dot: 'bg-blue-500 dark:bg-blue-400',
    text: 'text-blue-800 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
  COMPLETED: {
    label: 'Concluído',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    text: 'text-emerald-800 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
  CANCELLED: {
    label: 'Cancelado',
    dot: 'bg-slate-400 dark:bg-slate-500',
    text: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-500/10',
    border: 'border-slate-200 dark:border-slate-500/20',
  },
} as const

function getTimeDisplay(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDateParts(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
    monthShort: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
    weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
  }
}

function formatTimeRange(start: string, end?: string | null) {
  if (!end) return getTimeDisplay(start)
  return `${getTimeDisplay(start)} — ${getTimeDisplay(end)}`
}

interface AgendaEventCardProps {
  event: AgendaEvent
  isUpdatingStatus: boolean
  onEdit: (event: AgendaEvent) => void
  onComplete: (event: AgendaEvent) => void
  onCancel: (event: AgendaEvent) => void
  onDelete: (event: AgendaEvent) => void
}

export function AgendaEventCard({
  event,
  isUpdatingStatus,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
}: AgendaEventCardProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const { hasPermission } = useAuth()

  const priorityKey = event.priority as keyof typeof PRIORITY_CONFIG
  const priorityConfig = PRIORITY_CONFIG[priorityKey]
  const PriorityIcon = priorityIconMap[priorityKey]

  const statusKey = event.status as keyof typeof statusConfig
  const status = statusConfig[statusKey]

  const isCancelled = event.status === 'CANCELLED'
  const isCompleted = event.status === 'COMPLETED'
  const isThirdParty = event.origin === 'THIRD_PARTY'
  const hasExternalUrl = isThirdParty && Boolean(event.thirdPartyUrl)

  const hasDescription = Boolean(event.description)
  const hasLongDescription = hasDescription && (event.description?.length ?? 0) > 120

  const { day, monthShort, weekday } = getDateParts(event.startDate)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card',
        'transition-all duration-200 ease-out',
        'hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)]',
        isCancelled && 'opacity-50',
        isCompleted && 'opacity-75',
      )}
    >
      <div
        className={cn('absolute inset-y-0 left-0 w-[3px] transition-colors', priorityConfig.color)}
      />

      <div className="flex flex-col sm:flex-row">
        <div className="flex shrink-0 items-center gap-3 border-b bg-muted/20 px-5 py-4 sm:w-[120px] sm:flex-col sm:items-center sm:justify-center sm:gap-1 sm:border-b-0 sm:border-r">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground">
              {weekday}
            </span>
            <span className="text-[28px] font-light leading-none tracking-tight text-foreground">
              {day}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground">
              {monthShort}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground sm:mt-3">
            <Clock className="size-3 opacity-60" />
            <span>{formatTimeRange(event.startDate, event.endDate)}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {status && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5',
                  'text-[10px] font-semibold uppercase tracking-widest',
                  status.bg,
                  status.text,
                  status.border,
                )}
              >
                <span className={cn('size-1.5 rounded-full', status.dot)} />
                {status.label}
              </span>
            )}

            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5',
                'text-[10px] font-medium uppercase tracking-wider',
                priorityConfig.badgeColor,
              )}
            >
              <PriorityIcon className="size-3" />
              {AGENDA_PRIORITY_LABELS[event.priority]}
            </span>

            {isThirdParty && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <Calendar className="size-3" />
                {event.thirdPartySystem || 'Externo'}
              </span>
            )}
          </div>

          <h3
            className={cn(
              'text-[15px] font-semibold leading-snug tracking-tight text-foreground',
              isCancelled && 'line-through decoration-muted-foreground/40 text-muted-foreground',
            )}
            title={event.title}
          >
            {event.title}
          </h3>

          {hasDescription && (
            <div>
              <p
                className={cn(
                  'text-sm leading-relaxed text-muted-foreground/80',
                  !isDescExpanded && 'line-clamp-2',
                )}
              >
                {event.description}
              </p>

              {hasLongDescription && (
                <button
                  className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-foreground/60 underline underline-offset-2 decoration-foreground/20 transition-colors hover:text-foreground/80 hover:decoration-foreground/40"
                  onClick={() => setIsDescExpanded(p => !p)}
                  type="button"
                >
                  {isDescExpanded ? (
                    <>
                      Recolher
                      <ChevronUp className="size-3" />
                    </>
                  ) : (
                    <>
                      Ver mais
                      <ChevronDown className="size-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 border-t bg-muted/10 px-4 py-3 sm:flex-col sm:justify-center sm:border-t-0 sm:border-l">
          {hasExternalUrl && (
            <Button
              asChild
              className="h-8 gap-1.5 rounded-md px-3 text-xs font-medium"
              size="sm"
              variant="outline"
            >
              <a href={event.thirdPartyUrl ?? ''} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">Abrir</span>
              </a>
            </Button>
          )}

          {hasPermission('WRITE', 'AGENDA') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Ações</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onEdit(event)}>Editar evento</DropdownMenuItem>

                {event.status === 'PENDING' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-emerald-700 focus:bg-emerald-50 focus:text-emerald-800 dark:text-emerald-400 dark:focus:bg-emerald-500/10"
                      disabled={isUpdatingStatus}
                      onClick={() => onComplete(event)}
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                      Marcar como concluído
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={isUpdatingStatus} onClick={() => onCancel(event)}>
                      <XCircle className="mr-2 size-4" />
                      Cancelar evento
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => onDelete(event)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
