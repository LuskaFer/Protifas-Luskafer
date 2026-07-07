import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { agendaApi } from '@/features/agenda/api'
import { useAgenda } from '@/features/agenda/provider'

export function useCompleteAgendaEvent() {
  const { refetch } = useAgenda()
  const [isCompleting, setIsCompleting] = useState(false)

  const completeEvent = useCallback(
    async (id: string) => {
      setIsCompleting(true)
      try {
        await agendaApi.completeEvent(id)
        toast.success('Evento concluído com sucesso!')
        await refetch()
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao concluir evento.'
        toast.error(errorMessage)
      } finally {
        setIsCompleting(false)
      }
    },
    [refetch],
  )

  return { completeEvent, isCompleting }
}
