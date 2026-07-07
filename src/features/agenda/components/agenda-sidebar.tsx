import { startOfMonth } from 'date-fns'
import { AgendaCalendar } from '@/features/agenda/components/agenda-calendar'
import { useAgenda } from '@/features/agenda/provider'

export function AgendaSidebar() {
  const { selectedDate, setSelectedDate, currentMonth, setCurrentMonth, eventDays } = useAgenda()

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      setSelectedDate(date)
      setCurrentMonth(startOfMonth(date))
    }
  }

  function goToToday() {
    const today = new Date()
    setCurrentMonth(startOfMonth(today))
    setSelectedDate(today)
  }

  return (
    <AgendaCalendar
      currentMonth={currentMonth}
      eventDays={eventDays}
      onDateSelect={handleDateSelect}
      onMonthChange={setCurrentMonth}
      onTodayClick={goToToday}
      selectedDate={selectedDate}
    />
  )
}
