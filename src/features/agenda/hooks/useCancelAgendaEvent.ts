import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { agendaApi } from '@/features/agenda/api'
import { useAgenda } from '@/features/agenda/provider'

export function useCancelAgendaEvent() {
  const { refetch } = useAgenda()
  const [isCancelling, setIsCancelling] = useState(false)

  const cancelEvent = useCallback(
    async (id: string) => {
      setIsCancelling(true)
      try {
        await agendaApi.cancelEvent(id)
        toast.success('Evento cancelado com sucesso!')
        await refetch()
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao cancelar evento.'
        toast.error(errorMessage)
      } finally {
        setIsCancelling(false)
      }
    },
    [refetch],
  )

  return { cancelEvent, isCancelling }
}
