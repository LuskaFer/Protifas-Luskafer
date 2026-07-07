import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'
import { createRole } from '../api/rolesApi'
import { type CreateRoleFormData, createRoleSchema } from '../zod/schemas'

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateRoleModal({ isOpen, onClose, onSuccess }: CreateRoleModalProps) {
  const isMobile = useIsMobile()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
  })

  function resetForm() {
    reset()
    setSaved(false)
    setIsSaving(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) resetForm()
    onClose(open)
  }

  async function onSubmit(data: CreateRoleFormData) {
    setIsSaving(true)

    try {
      await createRole({
        name: data.name.trim(),
        permissionIds: [],
      })

      toast.success('Cargo criado com sucesso!')
      setSaved(true)
      onSuccess?.()

      setTimeout(() => {
        resetForm()
        onClose(false)
      }, 800)
    } catch (err: unknown) {
      const responseStatus = (err as { response?: { status?: number } })?.response?.status
      const responseMessage = (err as { response?: { data?: { message?: string } } })?.response
        ?.data?.message
      const isDuplicate = responseStatus === 400 && responseMessage === 'Recurso já existe.'
      const errorMessage = isDuplicate
        ? 'Já existe um cargo com este nome.'
        : 'Ocorreu um erro ao criar o cargo.'

      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const submitLabel = isSaving ? (
    <>
      <Spinner className="mr-2" size="sm" />
      <span>Salvando...</span>
    </>
  ) : saved ? (
    'Salvo'
  ) : (
    'Criar Cargo'
  )

  const formContent = (id: string) => (
    <form className="space-y-4" id={id} onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-name`}>Nome do cargo *</Label>
        <Input id={`${id}-name`} placeholder="Ex: Supervisor, Gerente..." {...register('name')} />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>
    </form>
  )

  return (
    <>
      <Dialog onOpenChange={handleOpenChange} open={isOpen && !isMobile}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Criar Novo Cargo</DialogTitle>
          </DialogHeader>
          {formContent('create-role-desktop')}
          <div className="flex flex-row gap-3 justify-end pt-4">
            <Button onClick={() => handleOpenChange(false)} variant="outline">
              Cancelar
            </Button>
            <Button
              disabled={isSaving || saved}
              form="create-role-desktop"
              type="submit"
              variant="primary"
            >
              {submitLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet onOpenChange={handleOpenChange} open={isOpen && isMobile}>
        <SheetContent side="bottom" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Criar Novo Cargo</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto px-1 max-h-[60vh]">
            {formContent('create-role-mobile')}
          </div>
          <SheetFooter className="flex-col gap-3">
            <SheetClose asChild>
              <Button className="w-full" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button
              className="w-full"
              disabled={isSaving || saved}
              form="create-role-mobile"
              type="submit"
              variant="primary"
            >
              {submitLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
