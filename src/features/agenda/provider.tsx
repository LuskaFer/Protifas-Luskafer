import { startOfMonth } from 'date-fns'
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { useAgendaEventDays } from '@/features/agenda/hooks/useAgendaEventDays'
import { useAgendaEvents } from '@/features/agenda/hooks/useAgendaEvents'
import type { AgendaEvent, AgendaFilters } from '@/features/agenda/interfaces'

interface AgendaContextValue {
  events: AgendaEvent[]
  isLoading: boolean
  hasError: boolean
  eventDays: Date[]
  refetch: () => Promise<void>
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  filters: AgendaFilters
  updateFilter: (key: keyof AgendaFilters, value: string) => void
  clearFilters: () => void
}

const AgendaContext = createContext<AgendaContextValue | null>(null)

const EMPTY_FILTERS: AgendaFilters = {
  dateFrom: '',
  dateTo: '',
  category: '',
  status: '',
  origin: '',
}

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()))
  const [filters, setFilters] = useState<AgendaFilters>(EMPTY_FILTERS)

  const { events, isLoading, hasError, refetch } = useAgendaEvents(selectedDate, filters)
  const { eventDays } = useAgendaEventDays(currentMonth)

  const goToMonth = useCallback((month: Date) => {
    const newMonth = startOfMonth(month)
    setCurrentMonth(prev => (prev.getTime() === newMonth.getTime() ? prev : newMonth))
  }, [])

  const updateFilter = useCallback((key: keyof AgendaFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
  }, [])

  const value = useMemo(
    () => ({
      events,
      isLoading,
      hasError,
      eventDays,
      refetch,
      selectedDate,
      setSelectedDate,
      currentMonth,
      setCurrentMonth: goToMonth,
      filters,
      updateFilter,
      clearFilters,
    }),
    [
      events,
      isLoading,
      hasError,
      eventDays,
      refetch,
      selectedDate,
      currentMonth,
      goToMonth,
      filters,
      updateFilter,
      clearFilters,
    ],
  )

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>
}

export function useAgenda(): AgendaContextValue {
  const ctx = useContext(AgendaContext)
  if (!ctx) {
    throw new Error('useAgenda must be used within AgendaProvider')
  }
  return ctx
}
