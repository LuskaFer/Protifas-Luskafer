import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Plus } from 'lucide-react'
import { useAuth } from '@/shared/services/auth'
import { Button } from '@/shared/ui/button'

interface AgendaEmptyStateProps {
  selectedDate: Date
  onCreateEvent: () => void
}

export function AgendaEmptyState({ selectedDate, onCreateEvent }: AgendaEmptyStateProps) {
  const { hasPermission } = useAuth()

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/30 min-h-[200px] md:min-h-[400px] px-4">
      <div className="size-16 md:size-20 rounded-full bg-muted/50 flex items-center justify-center mb-4 md:mb-5">
        <CalendarIcon className="size-8 md:size-10 opacity-50" />
      </div>
      <p className="text-base md:text-lg font-semibold text-foreground text-center">
        Não há registros para esta data
      </p>
      <p className="text-xs md:text-sm text-muted-foreground mt-2 mb-6 md:mb-8 max-w-sm text-center">
        Deseja adicionar um novo compromisso para{' '}
        {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}?
      </p>
      {hasPermission('WRITE', 'AGENDA') && (
        <Button onClick={onCreateEvent} size="lg">
          <Plus className="size-4 mr-2" /> Registrar Novo Evento
        </Button>
      )}
    </div>
  )
}
