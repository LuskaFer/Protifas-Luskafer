import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, Calendar } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { agendaApi } from '@/features/agenda/api'
import type { AgendaEvent } from '@/features/agenda/interfaces'

const STORAGE_KEY = 'agenda_notification_last_shown'

function getTodayDate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function hasShownToday(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(STORAGE_KEY) === getTodayDate()
}

function markShown(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, getTodayDate())
}

function getTimeDisplay(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatEventTime(event: AgendaEvent) {
  const start = getTimeDisplay(event.startDate)
  if (event.endDate) {
    return `${start} - ${getTimeDisplay(event.endDate)}`
  }
  return start
}

function showSingleEventToast(event: AgendaEvent) {
  const time = formatEventTime(event)
  toast(
    <div className="flex items-start gap-3">
      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Calendar className="size-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground text-sm leading-tight">{event.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
        {event.description && (
          <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">{event.description}</p>
        )}
      </div>
    </div>,
    { duration: 10000 },
  )
}

function showMultipleEventsToast(events: AgendaEvent[]) {
  const todayFormatted = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })
  toast(
    <div className="flex items-start gap-3">
      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Bell className="size-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground text-sm">
          {events.length} evento{events.length > 1 ? 's' : ''} hoje
        </p>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">{todayFormatted}</p>
        <ul className="mt-2 space-y-1">
          {events.slice(0, 5).map(event => (
            <li className="text-xs text-foreground/80 flex items-center gap-2" key={event.id}>
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              <span className="font-medium truncate">{event.title}</span>
              <span className="text-muted-foreground shrink-0">
                {getTimeDisplay(event.startDate)}
              </span>
            </li>
          ))}
          {events.length > 5 && (
            <li className="text-xs text-muted-foreground mt-1">
              +{events.length - 5} evento{events.length - 5 > 1 ? 's' : ''} mais
            </li>
          )}
        </ul>
      </div>
    </div>,
    { duration: 15000 },
  )
}

export function useAgendaNotifications() {
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    if (hasShownToday()) return

    fetchedRef.current = true

    agendaApi
      .getTodayNotifications()
      .then(response => {
        const events = (response.data || []).sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        )
        if (events.length === 0) return

        if (events.length === 1) {
          showSingleEventToast(events[0])
        } else {
          showMultipleEventsToast(events)
        }

        markShown()
      })
      .catch(() => {})
  }, [])
}
