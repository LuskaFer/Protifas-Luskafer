import { useState } from 'react'
import { toast } from 'sonner'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'
import { Badge, type badgeVariants } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'

export interface ConfirmChangeItem {
  id: string | number
  title: string
  description?: string
  statusLabel?: string
  statusVariant?: NonNullable<Parameters<typeof badgeVariants>[0]>['variant']
}

interface ConfirmChangesModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  items: ConfirmChangeItem[]
  onConfirm: () => Promise<void>
  title?: string
  description?: string
  confirmLabel?: string
  totalLabel?: string
}

export function ConfirmChangesModal({
  isOpen,
  onClose,
  items,
  onConfirm,
  title = 'Confirmar Alterações',
  description = 'As seguintes alterações serão aplicadas:',
  confirmLabel = 'Confirmar Alterações',
  totalLabel = 'Total de itens',
}: ConfirmChangesModalProps) {
  const isMobile = useIsMobile()
  const [isSaving, setIsSaving] = useState(false)

  const handleClose = (open: boolean) => {
    if (!isSaving) {
      onClose(open)
    }
  }

  const handleConfirm = async () => {
    setIsSaving(true)
    try {
      await onConfirm()
      setTimeout(() => {
        handleClose(false)
      }, 800)
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Ocorreu um erro ao salvar.'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const submitButtonText = isSaving ? (
    <>
      <Spinner className="mr-2" size="sm" />
      <span className="truncate">Salvando...</span>
    </>
  ) : (
    confirmLabel
  )

  const content = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {items.map(item => (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3',
              'bg-muted/50 transition-colors hover:bg-muted/70',
            )}
            key={String(item.id)}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
              {item.description && (
                <p className="truncate text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
            {item.statusLabel && (
              <Badge className="shrink-0 text-xs" variant={item.statusVariant ?? 'secondary'}>
                {item.statusLabel}
              </Badge>
            )}
          </div>
        ))}
      </div>
      <p className="border-t pt-3 text-xs text-muted-foreground">
        {totalLabel}: <span className="font-semibold">{items.length}</span>
      </p>
    </div>
  )

  return (
    <>
      <Dialog onOpenChange={handleClose} open={isOpen && !isMobile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {content}
          <div className="flex flex-row gap-3 justify-end pt-4">
            <Button disabled={isSaving} onClick={() => handleClose(false)} variant="outline">
              Cancelar
            </Button>
            <Button disabled={isSaving} onClick={handleConfirm} variant="primary">
              {submitButtonText}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet onOpenChange={handleClose} open={isOpen && isMobile}>
        <SheetContent side="bottom" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">{content}</div>
          <SheetFooter className="flex-col gap-3">
            <SheetClose asChild>
              <Button className="w-full" disabled={isSaving} variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button
              className="w-full"
              disabled={isSaving}
              onClick={handleConfirm}
              variant="primary"
            >
              {submitButtonText}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
