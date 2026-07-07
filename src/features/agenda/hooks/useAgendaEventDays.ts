import { useCallback, useEffect, useState } from 'react'
import { agendaApi } from '@/features/agenda/api'

export function useAgendaEventDays(currentMonth: Date) {
  const [eventDays, setEventDays] = useState<Date[]>([])

  const fetchEventDays = useCallback(async () => {
    try {
      const response = await agendaApi.getDatesWithEvents(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
      )
      if (response.data?.dates) {
        setEventDays(response.data.dates.map((d: string) => new Date(`${d}T00:00:00`)))
      }
    } catch {
      setEventDays([])
    }
  }, [currentMonth])

  useEffect(() => {
    fetchEventDays()
  }, [fetchEventDays])

  return { eventDays }
}
