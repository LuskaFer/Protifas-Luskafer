type Handler = (data: unknown) => void

export class SseClient {
  private eventSource: EventSource | null = null
  private handlers = new Map<string, Set<Handler>>()
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private disconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null
  private reconnectAttempts = 0
  private shouldReconnect = false
  private lastConnectAttemptAt = 0
  private readonly baseDelay = 500
  private readonly maxDelay = 30_000
  private readonly connectStaleAfterMs = 8_000
  private readonly healthCheckIntervalMs = 10_000

  connect(): void {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout)
      this.disconnectTimeout = null
    }

    if (this.eventSource) {
      if (this.eventSource.readyState === EventSource.OPEN) {
        return
      }

      const isStaleConnecting =
        this.eventSource.readyState === EventSource.CONNECTING &&
        Date.now() - this.lastConnectAttemptAt < this.connectStaleAfterMs

      if (isStaleConnecting) {
        return
      }

      this.eventSource.close()
      this.eventSource = null
    }

    this.shouldReconnect = true
    this.reconnectAttempts = 0
    this.createEventSource()
    this.startHealthCheck()
  }

  disconnect(): void {
    this.shouldReconnect = false

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    this.stopHealthCheck()

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout)
    }

    this.disconnectTimeout = setTimeout(() => {
      this.eventSource?.close()
      this.eventSource = null
    }, 300)
  }

  on(eventName: string, handler: Handler): () => void {
    const isNew = !this.handlers.has(eventName)

    if (isNew) {
      this.handlers.set(eventName, new Set())
    }

    this.handlers.get(eventName)?.add(handler)

    if (isNew && this.eventSource) {
      this.registerEventListener(eventName)
    }

    return () => {
      this.off(eventName, handler)
    }
  }

  off(eventName: string, handler: Handler): void {
    this.handlers.get(eventName)?.delete(handler)
  }

  private createEventSource(): void {
    let es: EventSource
    this.lastConnectAttemptAt = Date.now()

    const streamUrl = '/api/sse/stream'

    try {
      es = new EventSource(streamUrl, { withCredentials: true })
    } catch (error) {
      console.warn('[SseClient] failed to create EventSource:', error)

      if (this.shouldReconnect) {
        this.scheduleReconnect()
      }

      return
    }

    es.onopen = () => {
      this.reconnectAttempts = 0
    }

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        this.eventSource = null

        if (this.shouldReconnect) {
          this.scheduleReconnect()
        }
      }
    }

    this.handlers.forEach((_, eventName) => {
      es.addEventListener(eventName, (event: MessageEvent) => {
        this.dispatch(eventName, event.data)
      })
    })

    this.eventSource = es
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) return

    this.healthCheckInterval = setInterval(() => {
      if (!this.shouldReconnect) return

      if (!this.eventSource) {
        this.createEventSource()
        return
      }

      if (this.eventSource.readyState === EventSource.CLOSED) {
        this.eventSource = null
        this.createEventSource()
        return
      }

      const isStaleConnecting =
        this.eventSource.readyState === EventSource.CONNECTING &&
        Date.now() - this.lastConnectAttemptAt >= this.connectStaleAfterMs

      if (isStaleConnecting) {
        this.eventSource.close()
        this.eventSource = null
        this.createEventSource()
      }
    }, this.healthCheckIntervalMs)
  }

  private stopHealthCheck(): void {
    if (!this.healthCheckInterval) return

    clearInterval(this.healthCheckInterval)
    this.healthCheckInterval = null
  }

  private registerEventListener(eventName: string): void {
    if (!this.eventSource) return

    this.eventSource.addEventListener(eventName, (event: MessageEvent) => {
      this.dispatch(eventName, event.data)
    })
  }

  private scheduleReconnect(): void {
    const delay = Math.min(this.baseDelay * 2 ** this.reconnectAttempts, this.maxDelay)

    this.reconnectAttempts++

    this.reconnectTimeout = setTimeout(() => {
      this.createEventSource()
    }, delay)
  }

  private dispatch(eventName: string, rawData: string): void {
    let data: unknown = rawData

    try {
      data = JSON.parse(rawData)
    } catch {
      // passthrough — deliver raw string
    }

    const handlers = this.handlers.get(eventName)

    if (!handlers) return

    handlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.warn('[SseClient] handler error:', error)
      }
    })
  }
}
