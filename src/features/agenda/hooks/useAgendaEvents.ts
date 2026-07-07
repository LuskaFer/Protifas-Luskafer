import { format } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { agendaApi } from '@/features/agenda/api'
import type { AgendaEvent, AgendaFilters } from '@/features/agenda/interfaces'

export function useAgendaEvents(selectedDate: Date, filters: AgendaFilters) {
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const fetchEvents = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setHasError(false)

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const params: Record<string, string> = {}

      if (filters.dateFrom) {
        params.dateFrom = `${filters.dateFrom}T00:00:00`
      } else {
        params.dateFrom = `${dateStr}T00:00:00`
      }
      if (filters.dateTo) {
        params.dateTo = `${filters.dateTo}T23:59:59`
      } else {
        params.dateTo = `${dateStr}T23:59:59`
      }
      if (filters.category) params.categories = filters.category
      if (filters.status) params.status = filters.status
      if (filters.origin) params.origin = filters.origin

      const response = await agendaApi.getEvents(params)
      if (!controller.signal.aborted) {
        setEvents(response.data || [])
      }
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return
      setHasError(true)
      setEvents([])
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [selectedDate, filters])

  useEffect(() => {
    fetchEvents()
    return () => abortRef.current?.abort()
  }, [fetchEvents])

  const refetch = useCallback(async () => {
    await fetchEvents()
  }, [fetchEvents])

  return { events, isLoading, hasError, refetch }
}
