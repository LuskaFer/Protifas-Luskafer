import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { agendaApi } from '@/features/agenda/api'
import type { UpdateAgendaEventDTO } from '@/features/agenda/interfaces'
import { useAgenda } from '@/features/agenda/provider'

export function useUpdateAgendaEvent() {
  const { refetch } = useAgenda()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateEvent = useCallback(
    async (id: string, data: UpdateAgendaEventDTO) => {
      setIsUpdating(true)
      try {
        await agendaApi.updateEvent(id, data)
        toast.success('Evento atualizado com sucesso!')
        await refetch()
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao atualizar evento.'
        toast.error(errorMessage)
        throw err
      } finally {
        setIsUpdating(false)
      }
    },
    [refetch],
  )

  return { updateEvent, isUpdating }
}
