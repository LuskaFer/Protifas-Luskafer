import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { api } from '@/shared/services/http'
import {
  extractNotificationPayloadList,
  normalizeNotificationFromPayload,
  useNotification,
} from '@/shared/services/notification'
import type { Notification } from '@/shared/services/notification/types'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer'
import { Spinner } from '@/shared/ui/spinner'
import { NotificationVisual } from './notification-visual'

const ITEMS_PER_PAGE = 5
const FETCH_BATCH_SIZE = 25
const NOTIFICATION_API_PREFIX = '/notifications'

interface PageState {
  items: Notification[]
  currentPage: number
  totalElements: number
  loadedUpTo: number
  isInitialLoading: boolean
  isPageLoading: boolean
}

export function NotificationsHistoryModal({
  isOpen,
  onClose,
  onOpenUnreadList,
}: {
  isOpen: boolean
  onClose: (open: boolean) => void
  onOpenUnreadList?: () => void
}) {
  const isMobile = useIsMobile()
  const { unreadCount } = useNotification()
  const nextBatchIndex = useRef(0)
  const hasLoadedRef = useRef(false)
  const pendingPageRef = useRef<number | null>(null)
  const [pageState, setPageState] = useState<PageState>({
    items: [],
    currentPage: 0,
    totalElements: 0,
    loadedUpTo: 0,
    isInitialLoading: false,
    isPageLoading: false,
  })

  const currentItems = useMemo(
    () =>
      pageState.items.slice(
        pageState.currentPage * ITEMS_PER_PAGE,
        (pageState.currentPage + 1) * ITEMS_PER_PAGE,
      ),
    [pageState.items, pageState.currentPage],
  )

  const fetchMore = useCallback(async () => {
    const batch = nextBatchIndex.current
    const isFirstLoad = !hasLoadedRef.current

    setPageState(prev => ({
      ...prev,
      isInitialLoading: isFirstLoad,
      isPageLoading: !isFirstLoad,
    }))

    const startTime = Date.now()

    try {
      const response = await api.get(`${NOTIFICATION_API_PREFIX}/read`, {
        params: { page: batch, size: FETCH_BATCH_SIZE },
      })

      const data = response.data as {
        content?: Notification[]
        totalElements?: number
      }

      const newItems = extractNotificationPayloadList(data.content ?? data)
        .map(item => normalizeNotificationFromPayload(item))
        .filter((item): item is Notification => Boolean(item))

      const elapsed = Date.now() - startTime
      if (elapsed < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - elapsed))
      }

      nextBatchIndex.current = batch + 1
      hasLoadedRef.current = true

      setPageState(prev => {
        const newLoadedUpTo = prev.items.length + newItems.length
        const targetPage = pendingPageRef.current
        pendingPageRef.current = null

        return {
          items: [...prev.items, ...newItems],
          currentPage: targetPage ?? prev.currentPage,
          totalElements: data.totalElements ?? prev.totalElements,
          loadedUpTo: newLoadedUpTo,
          isInitialLoading: false,
          isPageLoading: false,
        }
      })
    } catch {
      const elapsed = Date.now() - startTime
      if (elapsed < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - elapsed))
      }

      setPageState(prev => ({ ...prev, isInitialLoading: false, isPageLoading: false }))
    }
  }, [])

  const initLoad = useCallback(() => {
    nextBatchIndex.current = 0
    hasLoadedRef.current = false
    pendingPageRef.current = null
    setPageState({
      items: [],
      currentPage: 0,
      totalElements: 0,
      loadedUpTo: 0,
      isInitialLoading: true,
      isPageLoading: false,
    })
  }, [])

  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        initLoad()
        fetchMore()
      })
    }
  }, [isOpen, initLoad, fetchMore])

  const totalPages = Math.ceil(pageState.totalElements / ITEMS_PER_PAGE)
  const hasNextPage = pageState.currentPage < totalPages - 1
  const hasPreviousPage = pageState.currentPage > 0

  const handleNextPage = useCallback(() => {
    const nextPage = pageState.currentPage + 1

    if (nextPage * ITEMS_PER_PAGE >= pageState.loadedUpTo) {
      if (!pageState.isPageLoading) {
        pendingPageRef.current = nextPage
        fetchMore()
      }
      return
    }

    setPageState(prev => ({ ...prev, currentPage: nextPage }))
  }, [pageState.currentPage, pageState.loadedUpTo, pageState.isPageLoading, fetchMore])

  const handlePreviousPage = useCallback(() => {
    setPageState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        nextBatchIndex.current = 0
        hasLoadedRef.current = false
        pendingPageRef.current = null
      }

      onClose(open)
    },
    [onClose],
  )

  const contentSlots = (
    <>
      {pageState.isInitialLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : pageState.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground text-sm gap-2 py-12">
          <Bell className="size-10 opacity-30" />
          <span>Nenhuma notificação visualizada</span>
        </div>
      ) : (
        <div className="relative space-y-3">
          {pageState.isPageLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 rounded-lg">
              <Spinner size="lg" />
            </div>
          )}
          {currentItems.map((notification: Notification) => (
            <div
              className="bg-card border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              key={notification.id}
            >
              <div className="flex items-start gap-4">
                <NotificationVisual notification={notification} size="md" />
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="block text-foreground font-semibold">
                      {notification.title}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Visualizada
                    </span>
                  </div>
                  <span className="text-foreground/70 text-sm leading-snug">
                    {notification.description}
                  </span>
                  {notification.action && (
                    <Button
                      className="h-auto w-fit text-xs text-primary p-0 mt-2"
                      onClick={notification.action}
                      size="sm"
                      variant="link"
                    >
                      {notification.actionLabel || 'Visualizar'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )

  const footer = totalPages > 1 && (
    <div className="flex items-center justify-between pt-4 border-t mt-4">
      <Button
        className="gap-2"
        disabled={!hasPreviousPage || pageState.isPageLoading}
        onClick={handlePreviousPage}
        size="sm"
        variant="outline"
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>

      <span className="text-sm text-muted-foreground">
        Página {pageState.currentPage + 1} de {totalPages}
      </span>

      <Button
        className="gap-2"
        disabled={!hasNextPage || pageState.isPageLoading}
        onClick={handleNextPage}
        size="sm"
        variant="outline"
      >
        Próxima
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={isOpen && !isMobile}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 flex flex-col">
          <DialogHeader className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 shrink-0">
            <div>
              <DialogTitle>Histórico de notificações</DialogTitle>
            </div>
            <div className="flex flex-nowrap items-center justify-end gap-2 overflow-x-auto">
              {onOpenUnreadList && unreadCount > 0 && (
                <Button
                  className="h-auto whitespace-nowrap text-xs"
                  onClick={onOpenUnreadList}
                  size="sm"
                  variant="ghost"
                >
                  Ver não lidas
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4 py-4">{contentSlots}</div>
          </div>
          <div className="px-6 py-4 shrink-0">{footer}</div>
        </DialogContent>
      </Dialog>

      <Drawer onOpenChange={handleOpenChange} open={isOpen && isMobile}>
        <DrawerContent className="p-0 flex flex-col max-h-[80vh]">
          <DrawerHeader className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 shrink-0">
            <div>
              <DrawerTitle>Histórico de Notificações</DrawerTitle>
            </div>
            <div className="flex flex-nowrap items-center justify-end gap-2 overflow-x-auto">
              {onOpenUnreadList && unreadCount > 0 && (
                <Button
                  className="h-auto whitespace-nowrap text-xs"
                  onClick={onOpenUnreadList}
                  size="sm"
                  variant="ghost"
                >
                  Ver não lidas
                </Button>
              )}
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-3 py-4">{contentSlots}</div>
          </div>
          <div className="px-6 py-4 shrink-0">{footer}</div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
