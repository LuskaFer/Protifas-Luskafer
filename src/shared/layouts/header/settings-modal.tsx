import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { usePreferences } from '@/shared/services/preferences'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Spinner } from '@/shared/ui/spinner'

export const SettingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: (open: boolean) => void
}) => {
  const { getPreference, savePreference } = usePreferences()
  const userTheme = getPreference('theme') ?? 'light'

  const isMobile = useIsMobile()

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [theme, setTheme] = useState<string>(userTheme)

  useEffect(() => {
    if (isOpen) {
      setTheme(userTheme)
    }
  }, [isOpen, userTheme])

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await savePreference('theme', theme)
      toast.success('Preferências salvas com sucesso!')

      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose(false)
      }, 1300)
    } catch {
      setTheme(userTheme)
      toast.error('Erro ao salvar preferências.')
    } finally {
      setIsSaving(false)
    }
  }

  const submitButton = (
    <Button form="settings-form-desktop" type="submit" variant="primary">
      {isSaving ? (
        <>
          <Spinner size="sm" />
          <span className="truncate">Salvando...</span>
        </>
      ) : saved ? (
        'Salvo'
      ) : (
        'Salvar'
      )}
    </Button>
  )

  return (
    <>
      <Dialog onOpenChange={onClose} open={isOpen && !isMobile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
          </DialogHeader>
          <form className="space-y-6" id="settings-form-desktop" onSubmit={handleSubmit}>
            <section>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Tema</Label>

                <div className="flex justify-end">
                  <Select onValueChange={handleThemeChange} value={theme}>
                    <SelectTrigger className="w-64 cursor-pointer">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem className="cursor-pointer" value="light">
                          Claro
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="dark">
                          Escuro
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </form>
          <DialogFooter className="flex flex-row gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            {submitButton}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer onOpenChange={onClose} open={isOpen && isMobile}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configurações</DrawerTitle>
          </DrawerHeader>
          <form className="space-y-6 px-6" id="settings-form-mobile" onSubmit={handleSubmit}>
            <section>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Tema</Label>

                <div className="flex justify-end">
                  <Select onValueChange={handleThemeChange} value={theme}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </form>
          <DrawerFooter className="flex-col gap-3 p-4">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancelar
              </Button>
            </DrawerClose>
            <Button className="w-full" form="settings-form-mobile" type="submit" variant="primary">
              {isSaving ? (
                <>
                  <Spinner size="sm" />
                  <span className="truncate">Salvando...</span>
                </>
              ) : saved ? (
                'Salvo'
              ) : (
                'Salvar'
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
