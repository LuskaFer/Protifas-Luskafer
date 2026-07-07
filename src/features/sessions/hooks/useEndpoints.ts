import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  fetchEndpointsData,
  type SystemConfiguration,
  saveEndpointChanges,
} from '@/features/sessions/api/sessionsApi'

const ENDPOINTS_QUERY_KEY = ['sessions', 'endpoints'] as const

export function useEndpoints() {
  const queryClient = useQueryClient()

  const { data: fetchedConfigurations = [], isLoading } = useQuery({
    queryKey: ENDPOINTS_QUERY_KEY,
    queryFn: fetchEndpointsData,
    meta: { errorMessage: 'Ocorreu um erro ao carregar as funcionalidades do sistema.' },
  })

  const [configurations, setConfigurations] = useState<SystemConfiguration[]>([])
  const hasInitializedRef = useRef(false)

  // Only sync fetched data on initial load, never overwrite user edits
  if (!hasInitializedRef.current && !isLoading && fetchedConfigurations.length > 0) {
    hasInitializedRef.current = true
    setConfigurations(fetchedConfigurations)
  }

  const { mutateAsync: saveChanges, isPending: isSaving } = useMutation({
    mutationFn: async (configsToUpdate: SystemConfiguration[]) => {
      await saveEndpointChanges(configsToUpdate)
    },
    onSuccess: () => {
      toast.success('Alterações salvas com sucesso!')
      queryClient.invalidateQueries({ queryKey: ENDPOINTS_QUERY_KEY })
    },
    onError: () => {
      toast.error('Ocorreu um erro ao salvar as alterações.')
    },
  })

  return {
    configurations,
    setConfigurations,
    isLoading,
    isSaving,
    saveEndpointChanges: saveChanges,
  }
}
