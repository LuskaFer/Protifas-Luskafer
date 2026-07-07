import { api } from '@/shared/services/http'
import type {
  AgendaEvent,
  CreateAgendaEventDTO,
  DatesWithEventsResponse,
  UpdateAgendaEventDTO,
} from '../interfaces'

export const agendaApi = {
  getDatesWithEvents(year: number, month: number) {
    return api.get<DatesWithEventsResponse>('/agenda/dates-with-events', {
      params: { year, month: String(month).padStart(2, '0') },
    })
  },

  getEvents(params: Record<string, string>, signal?: AbortSignal) {
    return api.get<AgendaEvent[]>('/agenda', { params, signal })
  },

  getEventById(id: string) {
    return api.get<AgendaEvent>(`/agenda/${id}`)
  },

  getTodayEvents() {
    return api.get<AgendaEvent[]>('/agenda/today')
  },

  getTodayNotifications() {
    return api.get<AgendaEvent[]>('/agenda/notifications/today')
  },

  createEvent(data: CreateAgendaEventDTO) {
    const payload: Record<string, unknown> = {
      title: data.title,
      description: data.description || '',
      startDate: data.startDate,
      endDate: data.endDate || '',
      category: data.category || 'OTHER',
      priority: data.priority,
    }
    if (data.thirdPartySystem) {
      payload.thirdPartySystem = data.thirdPartySystem
      payload.thirdPartyId = data.thirdPartyId
      payload.thirdPartyUrl = data.thirdPartyUrl || ''
    }
    return api.post('/agenda', payload)
  },

  updateEvent(id: string, data: UpdateAgendaEventDTO) {
    const payload: Record<string, unknown> = {
      title: data.title,
      description: data.description || '',
      startDate: data.startDate,
      endDate: data.endDate || '',
      category: data.category || 'OTHER',
      priority: data.priority,
    }
    if (data.thirdPartySystem) {
      payload.thirdPartySystem = data.thirdPartySystem
      payload.thirdPartyId = data.thirdPartyId
      payload.thirdPartyUrl = data.thirdPartyUrl || ''
    }
    return api.put(`/agenda/${id}`, payload)
  },

  completeEvent(id: string) {
    return api.patch(`/agenda/${id}/complete`)
  },

  cancelEvent(id: string) {
    return api.patch(`/agenda/${id}/cancel`)
  },

  deleteEvent(id: string) {
    return api.delete(`/agenda/${id}`)
  },
}
