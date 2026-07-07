import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { type WebSocketMessageType, WsClient } from './client'

interface WebSocketContextValue {
  isConnected: boolean
  sendMessage: (type: WebSocketMessageType, message?: string, payload?: unknown) => boolean
}

const WebSocketContext = createContext<WebSocketContextValue>({
  isConnected: false,
  sendMessage: () => false,
})

let singletonClient: WsClient | null = null

function getClient(): WsClient {
  if (!singletonClient) {
    singletonClient = new WsClient()
  }
  return singletonClient
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<WsClient>(getClient())
  const connectRef = useRef<() => void>(() => {})

  const connect = useCallback(() => {
    const client = clientRef.current

    const unsub = client.on(() => {
      setIsConnected(client.isConnected)
    })

    const interval = setInterval(() => {
      setIsConnected(client.isConnected)
    }, 1000)

    client.connect()
    setIsConnected(client.isConnected)

    return () => {
      clearInterval(interval)
      unsub()
    }
  }, [])

  useEffect(() => {
    connectRef.current = connect
  })

  useEffect(() => {
    const cleanup = connect()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const client = clientRef.current
        if (!client.isConnected) {
          client.connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cleanup()
      document.removeEventListener('visibilitychange', handleVisibility)
      clientRef.current.disconnect()
    }
  }, [connect])

  const sendMessage = useCallback(
    (type: WebSocketMessageType, message = '', payload: unknown = null) => {
      return clientRef.current.send(type, message, payload)
    },
    [],
  )

  return <WebSocketContext value={{ isConnected, sendMessage }}>{children}</WebSocketContext>
}

export function useWebSocketContext(): WebSocketContextValue {
  return useContext(WebSocketContext)
}
