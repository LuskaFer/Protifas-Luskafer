import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { agendaApi } from '@/features/agenda/api'
import type { CreateAgendaEventDTO } from '@/features/agenda/interfaces'
import { useAgenda } from '@/features/agenda/provider'

export function useCreateAgendaEvent() {
  const { refetch } = useAgenda()
  const [isCreating, setIsCreating] = useState(false)

  const createEvent = useCallback(
    async (data: CreateAgendaEventDTO) => {
      setIsCreating(true)
      try {
        await agendaApi.createEvent(data)
        toast.success('Evento criado com sucesso!')
        await refetch()
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao criar evento.'
        toast.error(errorMessage)
        throw err
      } finally {
        setIsCreating(false)
      }
    },
    [refetch],
  )

  return { createEvent, isCreating }
}
