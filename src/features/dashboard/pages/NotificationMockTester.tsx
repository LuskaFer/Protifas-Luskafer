import { useState } from 'react'
import { useAuth } from '@/shared/services/auth'
import { api } from '@/shared/services/http'
import { useNotification } from '@/shared/services/notification'
import type { Notification } from '@/shared/services/notification/types'
import { Button } from '@/shared/ui/button'

const NOTIFICATION_API_PREFIX = '/notifications'

const NOTIFICATION_MOCKS: Notification[] = [
  {
    id: 'mock-interaction-1',
    type: 'interaction',
    title: 'Nova interação no processo',
    description: 'Maria comentou no processo #22031.',
    avatar: 'https://github.com/shadcn.png',
    avatarFallback: 'MG',
    actionLabel: 'Abrir processo',
    action: () => console.log('Abrir processo #22031'),
    isRead: false,
  },
  {
    id: 'mock-system-1',
    type: 'system',
    title: 'Atualização de sistema',
    description: 'A atualização foi concluída com sucesso.',
    icon: 'bell',
    isRead: false,
  },
  {
    id: 'mock-calendar-1',
    type: 'calendar',
    title: 'Reunião agendada',
    description: 'Reunião de alinhamento às 14h.',
    icon: 'calendar',
    actionLabel: 'Ver agenda',
    action: () => console.log('Abrir agenda'),
    isRead: false,
  },
  {
    id: 'mock-deadline-1',
    type: 'deadline',
    title: 'Prazo próximo',
    description: 'O prazo do processo #9921 vence hoje.',
    icon: 'alert-triangle',
    isRead: false,
  },
]

export function NotificationMockTester() {
  const { notifications, unreadCount, sendNotification } = useNotification()
  const { profile, isLoading: isProfileLoading } = useAuth()
  const [isSending, setIsSending] = useState(false)

  const resolvedUserId = profile?.id

  const resolveDescription = (notification: Notification) => {
    const trimmedDescription = notification.description.trim()
    return trimmedDescription || notification.title
  }

  const createIndividualNotification = async (notification: Notification) => {
    if (!resolvedUserId) {
      sendNotification(notification)
      return
    }

    setIsSending(true)

    try {
      await api.post(NOTIFICATION_API_PREFIX, {
        type: notification.type.toUpperCase(),
        title: notification.title,
        description: resolveDescription(notification),
        userId: resolvedUserId,
        actionLabel: notification.actionLabel,
        avatar: notification.type === 'interaction' ? notification.avatar : undefined,
        avatarFallback:
          notification.type === 'interaction' ? notification.avatarFallback : undefined,
        icon: notification.type === 'interaction' ? undefined : notification.icon,
      })
    } catch (error) {
      console.error('Erro ao criar notificacao real:', error)
      sendNotification(notification)
    } finally {
      setIsSending(false)
    }
  }

  const createBroadcastNotification = async (notification: Notification) => {
    if (!resolvedUserId) {
      sendNotification(notification)
      return
    }

    setIsSending(true)

    try {
      await api.post(`${NOTIFICATION_API_PREFIX}/broadcast`, {
        type: notification.type.toUpperCase(),
        title: notification.title,
        description: resolveDescription(notification),
        actionLabel: notification.actionLabel,
        avatar: notification.type === 'interaction' ? notification.avatar : undefined,
        avatarFallback:
          notification.type === 'interaction' ? notification.avatarFallback : undefined,
        icon: notification.type === 'interaction' ? undefined : notification.icon,
      })
    } catch (error) {
      console.error('Erro ao criar notificacao broadcast:', error)
      sendNotification(notification)
    } finally {
      setIsSending(false)
    }
  }

  const dispatchMockNotification = (notification: Notification) => {
    void createIndividualNotification(notification)
  }

  const dispatchBroadcastNotification = () => {
    void createBroadcastNotification({
      id: `broadcast-${Date.now()}`,
      type: 'system',
      title: 'Lançamento de nova feature',
      description: 'A equipe publicou uma notificação broadcast real via backend.',
      icon: 'bell',
      isRead: false,
    })
  }

  return (
    <section className="bg-card border rounded-xl p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Mock de Notificações (teste)</h2>
        <p className="text-xs text-muted-foreground">
          Use os botões para criar notificações reais no backend e validar o toast + contador.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isProfileLoading
            ? 'Carregando usuário autenticado...'
            : resolvedUserId
              ? `Enviando para o usuário ${resolvedUserId}`
              : 'Sem usuário autenticado: fallback local ativo.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={isSending}
          onClick={() => dispatchMockNotification(NOTIFICATION_MOCKS[0])}
          size="sm"
          variant="outline"
        >
          Enviar interaction
        </Button>
        <Button
          disabled={isSending}
          onClick={() => dispatchMockNotification(NOTIFICATION_MOCKS[1])}
          size="sm"
          variant="outline"
        >
          Enviar system
        </Button>
        <Button
          disabled={isSending}
          onClick={() => dispatchMockNotification(NOTIFICATION_MOCKS[2])}
          size="sm"
          variant="outline"
        >
          Enviar calendar
        </Button>
        <Button
          disabled={isSending}
          onClick={() => dispatchMockNotification(NOTIFICATION_MOCKS[3])}
          size="sm"
          variant="outline"
        >
          Enviar deadline
        </Button>
        <Button
          disabled={isSending}
          onClick={dispatchBroadcastNotification}
          size="sm"
          variant="outline"
        >
          Enviar broadcast
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <span>Total no estado: {notifications.length}</span>
        <span className="ml-4">Não lidas: {unreadCount}</span>
      </div>
    </section>
  )
}
