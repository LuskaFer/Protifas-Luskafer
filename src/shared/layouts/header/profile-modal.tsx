import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { changePasswordSchema, updatePassword } from '@/shared/services/auth'
import { api } from '@/shared/services/http'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
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
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'

interface ProfileInfo {
  nome?: string
  email?: string
  cpf?: string
  oab?: string
  avatarUrl?: string | null
}

interface ProfileFormData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
  avatarFile: File | null
  avatarPreview: string | null
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  profileInfo?: ProfileInfo
  onSuccess?: () => void
}

export const ProfileModal = ({
  isOpen,
  onClose,
  profileInfo = {},
  onSuccess,
}: ProfileModalProps) => {
  const isMobile = useIsMobile()

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProfileFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    avatarFile: null,
    avatarPreview: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFieldChange = (
    field: keyof Omit<ProfileFormData, 'avatarFile' | 'avatarPreview'>,
    value: string,
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'currentPassword' || field === 'newPassword' || field === 'confirmNewPassword') {
      setPasswordError(null)
    }
  }

  const displayRow = (label: string, value?: string) => (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex justify-end">
        <span className="w-64 truncate text-sm text-right">{value ?? '—'}</span>
      </div>
    </div>
  )

  const displayRowMobile = (label: string, value?: string) => (
    <div className="space-y-1">
      <Label className="text-muted-foreground">{label}</Label>
      <p className="text-sm">{value ?? '—'}</p>
    </div>
  )

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const preview = URL.createObjectURL(file)
    setFormData(prev => ({ ...prev, avatarFile: file, avatarPreview: preview }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const passwordChange = changePasswordSchema.safeParse({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    })

    if (!passwordChange.success) {
      setPasswordError(passwordChange.error.issues[0]?.message ?? 'Verifique os campos de senha.')
      return
    }

    setIsSaving(true)

    try {
      if (formData.avatarFile) {
        const avatarData = new FormData()
        avatarData.append('file', formData.avatarFile)
        await api.put('/me/avatar', avatarData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      if (
        passwordChange.data.currentPassword ||
        passwordChange.data.newPassword ||
        passwordChange.data.confirmNewPassword
      ) {
        await updatePassword(passwordChange.data)
      }

      setSaved(true)
      onSuccess?.()
      setTimeout(() => {
        setSaved(false)
        onClose(false)
      }, 1300)
    } catch {
      // mantém o estado atual em caso de erro
    } finally {
      setIsSaving(false)
    }
  }

  const BACKEND_ORIGIN = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
  const avatarSrc =
    formData.avatarPreview ??
    (profileInfo.avatarUrl ? `${BACKEND_ORIGIN}${profileInfo.avatarUrl}` : undefined)

  const initials = profileInfo.nome
    ? profileInfo.nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join('')
    : '?'

  const avatarSection = (
    <div className="flex flex-col items-center gap-3">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: file upload trigger */}
      <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
        <Avatar className="size-20">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="size-5 text-white" />
        </div>
      </div>
      <span className="text-muted-foreground text-xs">Clique para alterar a foto de perfil</span>
      <input
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  )

  const desktopForm = (
    <form className="space-y-6" id="profile-form-desktop" onSubmit={handleSubmit}>
      {avatarSection}

      <section className="space-y-4">
        {displayRow('Nome', profileInfo.nome)}
        {displayRow('E-mail', profileInfo.email)}
        {displayRow('CPF', profileInfo.cpf)}
        {displayRow('OAB', profileInfo.oab)}
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <Label>Senha atual</Label>
          <div className="flex justify-end">
            <Input
              className="w-64"
              onChange={e => handleFieldChange('currentPassword', e.target.value)}
              placeholder="••••••••"
              type="password"
              value={formData.currentPassword}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          <Label>Nova senha</Label>
          <div className="flex justify-end">
            <Input
              className="w-64"
              onChange={e => handleFieldChange('newPassword', e.target.value)}
              placeholder="••••••••"
              type="password"
              value={formData.newPassword}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          <Label>Confirmar nova senha</Label>
          <div className="flex justify-end">
            <Input
              aria-invalid={!!passwordError}
              className="w-64"
              onChange={e => handleFieldChange('confirmNewPassword', e.target.value)}
              placeholder="••••••••"
              type="password"
              value={formData.confirmNewPassword}
            />
          </div>
        </div>

        {passwordError && <p className="text-destructive text-sm text-right">{passwordError}</p>}
      </section>
    </form>
  )

  const submitButton = (
    <Button form="profile-form-desktop" type="submit" variant="primary">
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
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          {desktopForm}
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
            <DrawerTitle>Editar perfil</DrawerTitle>
          </DrawerHeader>
          <div className="px-6">
            <form className="space-y-6" id="profile-form-mobile" onSubmit={handleSubmit}>
              {avatarSection}

              <section className="space-y-4">
                {displayRowMobile('Nome', profileInfo.nome)}
                {displayRowMobile('E-mail', profileInfo.email)}
                {displayRowMobile('CPF', profileInfo.cpf)}
                {displayRowMobile('OAB', profileInfo.oab)}
              </section>

              <section className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Senha atual</Label>
                  <Input
                    onChange={e => handleFieldChange('currentPassword', e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    value={formData.currentPassword}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Nova senha</Label>
                  <Input
                    onChange={e => handleFieldChange('newPassword', e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    value={formData.newPassword}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Confirmar nova senha</Label>
                  <Input
                    aria-invalid={!!passwordError}
                    onChange={e => handleFieldChange('confirmNewPassword', e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    value={formData.confirmNewPassword}
                  />
                </div>

                {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
              </section>
            </form>
          </div>
          <DrawerFooter className="flex-col gap-3 p-4">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancelar
              </Button>
            </DrawerClose>
            <Button className="w-full" form="profile-form-mobile" type="submit" variant="primary">
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
