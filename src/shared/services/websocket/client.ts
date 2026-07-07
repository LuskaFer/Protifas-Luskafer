export type WebSocketMessageType = 'SYSTEM' | 'ERROR' | 'PING' | 'PONG' | string

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType
  message: string
  payload?: T
  timestamp: number
}

type Handler = (data: WebSocketMessage) => void

export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8080/api'

export class WsClient {
  private socket: WebSocket | null = null
  private handlers = new Set<Handler>()
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null
  private shouldReconnect = false
  private readonly heartbeatMs = 30_000
  private readonly reconnectMs = 5_000

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) return

    this.shouldReconnect = true

    const wsUrl = `${WS_BASE_URL}/ws/v2`

    try {
      const socket = new WebSocket(wsUrl)
      this.socket = socket

      socket.onopen = () => {
        this.startHeartbeat()
      }

      socket.onmessage = event => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data)
          if (data.type === 'PONG') return
          for (const handler of this.handlers) handler(data)
        } catch {
          // malformed message
        }
      }

      socket.onclose = event => {
        this.socket = null
        this.stopHeartbeat()

        if (this.shouldReconnect && event.code !== 1000) {
          this.scheduleReconnect()
        }
      }

      socket.onerror = () => {
        // onclose will follow
      }
    } catch {
      if (this.shouldReconnect) {
        this.scheduleReconnect()
      }
    }
  }

  disconnect(): void {
    this.shouldReconnect = false
    this.stopHeartbeat()

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    this.socket?.close(1000, 'Fechamento manual')
    this.socket = null
  }

  send(type: WebSocketMessageType, message = '', payload: unknown = null): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, message, payload, timestamp: Date.now() }))
      return true
    }
    return false
  }

  on(handler: Handler): () => void {
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  off(handler: Handler): void {
    this.handlers.delete(handler)
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) return

    this.heartbeatInterval = setInterval(() => {
      this.send('PING')
    }, this.heartbeatMs)
  }

  private stopHeartbeat(): void {
    if (!this.heartbeatInterval) return
    clearInterval(this.heartbeatInterval)
    this.heartbeatInterval = null
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null
      this.connect()
    }, this.reconnectMs)
  }
}
