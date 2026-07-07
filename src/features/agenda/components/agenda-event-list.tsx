import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCancelAgendaEvent } from '@/features/agenda/hooks/useCancelAgendaEvent'
import { useCompleteAgendaEvent } from '@/features/agenda/hooks/useCompleteAgendaEvent'
import { useDeleteAgendaEvent } from '@/features/agenda/hooks/useDeleteAgendaEvent'
import { useUpdateAgendaEvent } from '@/features/agenda/hooks/useUpdateAgendaEvent'
import type { AgendaEvent } from '@/features/agenda/interfaces'
import { useAgenda } from '@/features/agenda/provider'
import type { AgendaEventFormSchema } from '@/features/agenda/zod/schemas'
import { Spinner } from '@/shared/ui/spinner'
import { AgendaEmptyState } from './agenda-empty-state'
import { AgendaEventCard } from './agenda-event-card'
import { AgendaDeleteModal } from './modals/agenda-delete-modal'
import { AgendaFormModal } from './sheets/agenda-form-modal'

export function AgendaEventList() {
  const { events, isLoading, hasError, selectedDate, refetch } = useAgenda()
  const { updateEvent } = useUpdateAgendaEvent()
  const { completeEvent } = useCompleteAgendaEvent()
  const { cancelEvent } = useCancelAgendaEvent()
  const { deleteEvent } = useDeleteAgendaEvent()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<AgendaEvent | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  function openEditSheet(event: AgendaEvent) {
    setSelectedEvent(event)
    setIsEditOpen(true)
  }

  function openDeleteModal(event: AgendaEvent) {
    setEventToDelete(event)
    setIsDeleteOpen(true)
  }

  async function handleEdit(data: AgendaEventFormSchema) {
    if (!selectedEvent) return
    const startDate = data.startDate.includes('T') ? data.startDate : `${data.startDate}T09:00:00`
    const endDate = data.endDate
      ? data.endDate.includes('T')
        ? data.endDate
        : `${data.endDate}T10:00:00`
      : ''
    await updateEvent(selectedEvent.id, {
      title: data.title,
      description: data.description || '',
      startDate,
      endDate,
      category: 'OTHER',
      priority: data.priority,
      thirdPartySystem: data.origin === 'THIRD_PARTY' ? data.thirdPartySystem : undefined,
      thirdPartyId: data.origin === 'THIRD_PARTY' ? data.thirdPartyId : undefined,
      thirdPartyUrl: data.origin === 'THIRD_PARTY' ? data.thirdPartyUrl : undefined,
    })
  }

  async function handleComplete(event: AgendaEvent) {
    setIsUpdatingStatus(true)
    await completeEvent(event.id)
    setIsUpdatingStatus(false)
  }

  async function handleCancel(event: AgendaEvent) {
    setIsUpdatingStatus(true)
    await cancelEvent(event.id)
    setIsUpdatingStatus(false)
  }

  async function handleDelete() {
    if (!eventToDelete) return
    await deleteEvent(eventToDelete.id)
    setEventToDelete(null)
  }

  const editDefaultValues = useMemo(() => {
    if (!selectedEvent) return undefined
    return {
      title: selectedEvent.title,
      description: selectedEvent.description || '',
      startDate: selectedEvent.startDate
        ? format(new Date(selectedEvent.startDate), "yyyy-MM-dd'T'HH:mm:ss")
        : '',
      endDate: selectedEvent.endDate
        ? format(new Date(selectedEvent.endDate), "yyyy-MM-dd'T'HH:mm:ss")
        : '',
      origin: (selectedEvent.origin === 'THIRD_PARTY' ? 'THIRD_PARTY' : 'PERSONAL') as
        | 'PERSONAL'
        | 'THIRD_PARTY',
      thirdPartySystem: selectedEvent.thirdPartySystem || '',
      thirdPartyId: selectedEvent.thirdPartyId || '',
      thirdPartyUrl: selectedEvent.thirdPartyUrl || '',
      priority: selectedEvent.priority as 'LOW' | 'MEDIUM' | 'HIGH',
    }
  }, [selectedEvent])

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full">
        {hasError && (
          <div className="bg-destructive/10 text-destructive p-3 md:p-4 rounded-lg border border-destructive/20 text-xs md:text-sm font-medium mb-6 flex items-center gap-2 shrink-0 flex-wrap">
            <AlertTriangle className="size-4 md:size-5 shrink-0" />
            <span className="flex-1 min-w-0">
              Erro ao carregar eventos. Verifique a conexão com o servidor.
            </span>
            <button
              className="underline text-xs md:text-sm font-semibold hover:text-destructive/80 transition-colors shrink-0"
              onClick={refetch}
              type="button"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <div className="mb-6 md:mb-8 pb-3 md:pb-4 border-b border-border shrink-0 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground capitalize break-words">
            {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium truncate">
            {format(selectedDate, 'yyyy')} &bull;{' '}
            {events.length === 0
              ? 'Nenhum compromisso registrado.'
              : `${events.length} registro${events.length !== 1 ? 's' : ''} encontrado${events.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" />
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <AgendaEmptyState onCreateEvent={() => {}} selectedDate={selectedDate} />
        )}

        {!isLoading && events.length > 0 && (
          <div className="space-y-4 flex-1 min-w-0 w-full">
            {events.map(event => (
              <AgendaEventCard
                event={event}
                isUpdatingStatus={isUpdatingStatus}
                key={event.id}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onDelete={openDeleteModal}
                onEdit={openEditSheet}
              />
            ))}
          </div>
        )}
      </div>

      <AgendaFormModal
        defaultValues={editDefaultValues}
        isOpen={isEditOpen}
        mode="edit"
        onOpenChange={setIsEditOpen}
        onSubmit={handleEdit}
      />

      <AgendaDeleteModal
        event={eventToDelete}
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  )
}
