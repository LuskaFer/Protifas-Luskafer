import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'

interface AgendaCalendarProps {
  currentMonth: Date
  onMonthChange: (date: Date) => void
  selectedDate: Date
  onDateSelect: (date: Date | undefined) => void
  eventDays: Date[]
  onTodayClick: () => void
}

export function AgendaCalendar({
  currentMonth,
  onMonthChange,
  selectedDate,
  onDateSelect,
  eventDays,
  onTodayClick,
}: AgendaCalendarProps) {
  function goToPrevMonth() {
    onMonthChange(subMonths(currentMonth, 1))
  }

  function goToNextMonth() {
    onMonthChange(addMonths(currentMonth, 1))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-1">
          <Button
            aria-label="Mês anterior"
            className="size-8"
            onClick={goToPrevMonth}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label="Próximo mês"
            className="size-8"
            onClick={goToNextMonth}
            size="icon"
            variant="ghost"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <span className="text-sm font-semibold capitalize text-foreground">
          {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <Button className="h-8 text-xs" onClick={onTodayClick} size="sm" variant="outline">
          Hoje
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <Calendar
          className="agenda-calendar w-full min-w-0"
          classNames={{
            nav: 'hidden',
            month_caption: 'hidden',
          }}
          locale={ptBR}
          mode="single"
          modifiers={{
            hasEvent: eventDays,
          }}
          modifiersClassNames={{
            hasEvent: cn(
              'relative',
              'after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2',
              'after:size-1.5 after:rounded-full after:bg-primary after:pointer-events-none',
            ),
          }}
          month={currentMonth}
          onMonthChange={onMonthChange}
          onSelect={onDateSelect}
          selected={selectedDate}
        />
      </div>

      <div className="px-4 pb-4 border-t border-border/50 pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="size-2.5 rounded-full bg-primary" />
          <span>Dias com eventos</span>
        </div>
      </div>
    </div>
  )
}
