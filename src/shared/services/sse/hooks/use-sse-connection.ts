import { useEffect, useRef } from 'react'
import { SseClient } from '../client'

let singletonClient: SseClient | null = null
let connectionCount = 0

function getSseClient(): SseClient {
  if (!singletonClient) {
    singletonClient = new SseClient()
  }

  return singletonClient
}

export function useSseConnection(): SseClient {
  const clientRef = useRef<SseClient | null>(null)

  if (!clientRef.current) {
    clientRef.current = getSseClient()
  }

  useEffect(() => {
    const client = clientRef.current
    if (!client) return

    connectionCount++

    const handlePageHide = () => {
      client.disconnect()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        client.connect()
      }
    }

    const handleOnline = () => {
      client.connect()
    }

    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handlePageHide)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)

    client.connect()

    return () => {
      connectionCount--

      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handlePageHide)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)

      if (connectionCount <= 0) {
        client.disconnect()
      }
    }
  }, [])

  return clientRef.current
}
