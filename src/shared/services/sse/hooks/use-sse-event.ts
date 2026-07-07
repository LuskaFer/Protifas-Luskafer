import { useEffect, useRef } from 'react'
import { useSseConnection } from './use-sse-connection'

export function useSseEvent<T = unknown>(eventName: string, handler: (data: T) => void): void {
  const client = useSseConnection()
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    const wrappedHandler = (data: unknown) => {
      handlerRef.current(data as T)
    }

    return client.on(eventName, wrappedHandler)
  }, [client, eventName])
}
