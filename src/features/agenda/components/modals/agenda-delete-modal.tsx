import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { AgendaEvent } from '@/features/agenda/interfaces'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer'
import { Spinner } from '@/shared/ui/spinner'

interface AgendaDeleteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  event: AgendaEvent | null
  onConfirm: () => Promise<void>
}

export function AgendaDeleteModal({
  isOpen,
  onOpenChange,
  event,
  onConfirm,
}: AgendaDeleteModalProps) {
  const isMobile = useIsMobile()
  const [isDeleting, setIsDeleting] = useState(false)

  function handleClose(open: boolean) {
    if (!open && !isDeleting) {
      onOpenChange(open)
    }
  }

  async function handleConfirm() {
    setIsDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const content = event && (
    <div className="space-y-3">
      <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
        <Trash2 className="size-6 text-destructive" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Tem certeza que deseja remover o evento <br />
        <span className="font-bold text-foreground">{event.title}</span>? <br />
        <span className="text-xs">Esta ação não pode ser desfeita.</span>
      </p>
    </div>
  )

  const footerButtons = (
    <>
      <Button disabled={isDeleting} onClick={() => onOpenChange(false)} variant="outline">
        Cancelar
      </Button>
      <Button disabled={isDeleting} onClick={handleConfirm} variant="destructive">
        {isDeleting ? (
          <>
            <Spinner className="mr-2" size="sm" /> <span>Processando...</span>
          </>
        ) : (
          'Confirmar Exclusão'
        )}
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <Drawer onOpenChange={handleClose} open={isOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">Excluir Registro</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-2">{content}</div>
          <DrawerFooter className="flex-col gap-3 p-4 border-t border-border">
            {footerButtons}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center sr-only">Excluir Registro</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter className="flex flex-row gap-3 pt-4 sm:justify-center">
          {footerButtons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
