import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { agendaApi } from '@/features/agenda/api'
import { useAgenda } from '@/features/agenda/provider'

export function useDeleteAgendaEvent() {
  const { refetch } = useAgenda()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteEvent = useCallback(
    async (id: string) => {
      setIsDeleting(true)
      try {
        await agendaApi.deleteEvent(id)
        toast.success('Evento removido com sucesso!')
        await refetch()
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao remover evento.'
        toast.error(errorMessage)
        throw err
      } finally {
        setIsDeleting(false)
      }
    },
    [refetch],
  )

  return { deleteEvent, isDeleting }
}
