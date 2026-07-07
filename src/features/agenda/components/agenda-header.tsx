import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { AgendaFilters } from '@/features/agenda/components/agenda-filters'
import { AgendaFormModal } from '@/features/agenda/components/sheets/agenda-form-modal'
import { useCreateAgendaEvent } from '@/features/agenda/hooks/useCreateAgendaEvent'
import { useAgenda } from '@/features/agenda/provider'
import type { AgendaEventFormSchema } from '@/features/agenda/zod/schemas'
import { useAuth } from '@/shared/services/auth'
import { Button } from '@/shared/ui/button'

export function AgendaHeader() {
  const { hasPermission } = useAuth()
  const { selectedDate, filters, clearFilters, updateFilter } = useAgenda()
  const { createEvent } = useCreateAgendaEvent()
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>()
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  function applyDateFilter() {
    setFilterPopoverOpen(false)
  }

  async function handleCreate(data: AgendaEventFormSchema) {
    const startDate = data.startDate.includes('T') ? data.startDate : `${data.startDate}T09:00:00`
    const endDate = data.endDate
      ? data.endDate.includes('T')
        ? data.endDate
        : `${data.endDate}T10:00:00`
      : ''
    await createEvent({
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

  return (
    <>
      <div className="border-b border-border/50 px-4 md:px-6 py-3 shrink-0 bg-card min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              Agenda Institucional
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Gerenciamento de compromissos e eventos
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AgendaFilters
              clearFilters={clearFilters}
              filterDateRange={filterDateRange}
              filters={filters}
              onApply={applyDateFilter}
              onOpenChange={setFilterPopoverOpen}
              open={filterPopoverOpen}
              setFilterDateRange={setFilterDateRange}
              updateFilter={updateFilter}
            />
            {hasPermission('WRITE', 'AGENDA') && (
              <Button
                className="h-9 shrink-0"
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                variant="primary"
              >
                <Plus className="size-4 sm:mr-1" />
                <span className="hidden sm:inline">Novo Evento</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <AgendaFormModal
        defaultDate={selectedDate}
        isOpen={isCreateOpen}
        mode="create"
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
      />
    </>
  )
}
