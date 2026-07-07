import { useCallback, useEffect, useState } from 'react'
import { api } from '@/shared/services/http'

export interface Procuradoria {
  id: number
  name: string
  initials?: string
}

export const PROCURADORIAS_UPDATED_EVENT = 'procuradorias:updated'

export function notifyProcuradoriasUpdated() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PROCURADORIAS_UPDATED_EVENT))
}

interface PagePayload {
  content: Procuradoria[]
  totalPages?: number
  totalElements?: number
}

function extractPagePayload(data: unknown) {
  const contentRoot = (data as { content?: unknown })?.content
  if (Array.isArray(contentRoot)) {
    return {
      content: contentRoot as Procuradoria[],
      totalPages: 1,
      totalElements: contentRoot.length,
    }
  }
  const pagePayload = (contentRoot ?? data) as PagePayload
  const normalizedContent = Array.isArray(pagePayload?.content) ? pagePayload.content : []
  return {
    content: normalizedContent,
    totalPages: pagePayload?.totalPages ?? 1,
    totalElements: pagePayload?.totalElements ?? normalizedContent.length,
  }
}

export function useProcuradorias(enabled = true) {
  const [procuradorias, setProcuradorias] = useState<Procuradoria[]>([])
  const [isLoading, setIsLoading] = useState(enabled)

  const fetchProcuradorias = useCallback(async () => {
    if (!enabled) return
    try {
      setIsLoading(true)
      const response = await api.get('/procuradorias')
      const payload = extractPagePayload(response.data)
      setProcuradorias(payload.content)
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status !== 403) console.error('Erro ao buscar procuradorias:', error)
      setProcuradorias([])
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }
    fetchProcuradorias()
  }, [fetchProcuradorias, enabled])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleProcuradoriasUpdated = () => {
      if (enabled) fetchProcuradorias()
    }
    window.addEventListener(PROCURADORIAS_UPDATED_EVENT, handleProcuradoriasUpdated)
    return () => {
      window.removeEventListener(PROCURADORIAS_UPDATED_EVENT, handleProcuradoriasUpdated)
    }
  }, [fetchProcuradorias, enabled])

  return { procuradorias, isLoading, refetch: fetchProcuradorias }
}
