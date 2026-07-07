import { UserKey, X } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/shared/services/auth'
import { useSseEvent } from '@/shared/services/sse'
import { Button } from '@/shared/ui/button'

export function usePermissionsChangedSse(): void {
  const { refetch } = useAuth()
  const lastRefetchRef = useRef(0)

  useSseEvent<Record<string, unknown>>('PERMISSIONS_CHANGED', () => {
    const now = Date.now()
    if (now - lastRefetchRef.current < 5_000) {
      return
    }
    lastRefetchRef.current = now

    toast.custom(
      tId => (
        <div className="bg-card flex items-center justify-between px-3 py-3 sm:px-4 gap-3 sm:gap-4 w-[calc(100vw-2rem)] sm:w-100 mb-2 text-card-foreground rounded-xl border shadow-sm">
          <div className="flex items-center flex-1 min-w-0 gap-3 sm:gap-4">
            <div className="bg-muted flex items-center justify-center shrink-0 border rounded-full size-8 sm:size-8">
              <UserKey className="text-primary size-4" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1 sm:gap-2">
              <div>
                <span className="block truncate font-semibold text-foreground text-sm sm:text-base">
                  Permissões atualizadas
                </span>
                <span className="text-xs sm:text-sm text-foreground/90 leading-snug line-clamp-2">
                  Suas permissões foram alteradas. As atualizações já estão em vigor.
                </span>
              </div>
            </div>
          </div>
          <Button
            className="text-foreground/60 hover:text-foreground shrink-0 transition-colors self-start sm:self-center"
            onClick={() => toast.dismiss(tId)}
            size="icon"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>
      ),
      { duration: 15000 },
    )

    refetch()
  })
}
