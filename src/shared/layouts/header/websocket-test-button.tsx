import { Send, Signal, SignalLow } from 'lucide-react'
import { toast } from 'sonner'
import { useWebSocketContext } from '@/shared/services/websocket'
import { Button } from '@/shared/ui/button'

export function WebSocketTestButton() {
  const { isConnected, sendMessage } = useWebSocketContext()

  const handlePing = () => {
    if (sendMessage('PING', 'Teste via Front')) {
      toast.info('PING enviado')
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-card flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Signal className="text-green-500 h-5 w-5" />
        ) : (
          <SignalLow className="text-red-500 h-5 w-5" />
        )}
        <span className="font-semibold text-sm">
          WebSocket: {isConnected ? 'CONECTADO' : 'ERRO'}
        </span>
      </div>

      <Button
        className="w-full flex items-center justify-center gap-2"
        disabled={!isConnected}
        onClick={handlePing}
        variant="outline"
      >
        <Send className="h-3.5 w-3.5" />
        Enviar PING de Teste
      </Button>

      <p className="text-[10px] text-muted-foreground text-center">
        URL: ws://localhost:8080/api/ws/v2
      </p>
    </div>
  )
}
