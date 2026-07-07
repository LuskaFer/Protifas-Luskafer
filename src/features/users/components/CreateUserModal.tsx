import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createUser } from '@/features/users/api/usersApi'
import { useProcuradorias } from '@/features/users/hooks/useProcuradorias'
import { type CreateUserFormSchema, createUserSchema } from '@/features/users/zod/create-user'
import { SearchableSelect } from '@/shared/components/searchable-select'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const isMobile = useIsMobile()
  const emailDomain = 'sjc.sp.gov.br'

  const { procuradorias, isLoading: procuradoriasLoading } = useProcuradorias(isOpen)

  const procuradoriaOptions = useMemo(
    () => procuradorias.map(p => ({ value: p.id.toString(), label: p.name })),
    [procuradorias],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    setValue,
  } = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      cpfNumber: '',
      oabNumber: '',
      emailAddress: '',
      rawPassword: '',
      procuradoriaId: 0,
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [procuradoriaValue, setProcuradoriaValue] = useState('')

  const handleClose = (open: boolean) => {
    if (!open) {
      reset()
      setSaved(false)
      setIsSaving(false)
      setShowPassword(false)
      setProcuradoriaValue('')
    }
    onClose(open)
  }

  const onSubmit = async (data: CreateUserFormSchema) => {
    clearErrors()
    setIsSaving(true)

    try {
      await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: `${data.emailAddress}@${emailDomain}`.toLowerCase(),
        rawPassword: data.rawPassword,
        cpfNumber: data.cpfNumber,
        oabNumber: data.oabNumber || null,
        procuradoriaId: data.procuradoriaId,
      })

      toast.success('Usuário criado com sucesso!')
      setSaved(true)
      onSuccess?.()

      setTimeout(() => {
        setSaved(false)
        handleClose(false)
      }, 1000)
    } catch (err: unknown) {
      const response = (err as { response?: { status?: number; data?: { message?: string } } })
        ?.response
      const message = response?.data?.message

      if (response?.status === 409 && message === 'Recurso já existe.') {
        const errorMessage = 'E-mail, CPF ou OAB já cadastrado.'
        setError('emailAddress', { message: errorMessage })
        setError('cpfNumber', { message: errorMessage })
        if (data.oabNumber?.trim()) {
          setError('oabNumber', { message: errorMessage })
        }
        return
      }

      toast.error('Ocorreu um erro ao criar o usuário.')
    } finally {
      setIsSaving(false)
    }
  }

  const submitButtonText = isSaving ? (
    <>
      <Spinner className="mr-2" size="sm" />
      <span className="truncate">Salvando...</span>
    </>
  ) : saved ? (
    'Salvo'
  ) : (
    'Criar Usuário'
  )

  const formContent = (
    <form className="space-y-4" id="create-user-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="user-first-name">Nome *</Label>
          <Input id="user-first-name" placeholder="Nome" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-destructive text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="user-last-name">Sobrenome *</Label>
          <Input id="user-last-name" placeholder="Sobrenome" {...register('lastName')} />
          {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="user-cpf">CPF *</Label>
          <Input id="user-cpf" placeholder="000.000.000-00" {...register('cpfNumber')} />
          {errors.cpfNumber && (
            <p className="text-destructive text-sm">{errors.cpfNumber.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="user-oab">OAB</Label>
          <Input id="user-oab" placeholder="1234/SP" {...register('oabNumber')} />
          {errors.oabNumber && (
            <p className="text-destructive text-sm">{errors.oabNumber.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-procuradoria">Procuradoria *</Label>
        <SearchableSelect
          disabled={isSaving}
          id="user-procuradoria"
          isLoading={procuradoriasLoading}
          onChange={value => {
            setProcuradoriaValue(value)
            setValue('procuradoriaId', Number(value), { shouldValidate: true })
          }}
          options={procuradoriaOptions}
          placeholder="Selecione uma procuradoria..."
          value={procuradoriaValue}
        />
        {errors.procuradoriaId && (
          <p className="text-destructive text-sm">{errors.procuradoriaId.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-email">E-mail *</Label>
        <div className="flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
          <input
            className="flex-1 min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground md:text-sm file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
            id="user-email"
            placeholder="nome.sobrenome"
            type="text"
            {...register('emailAddress')}
          />
          <span className="ml-2 whitespace-nowrap text-base text-muted-foreground pointer-events-none md:text-sm">
            @{emailDomain}
          </span>
        </div>
        {errors.emailAddress && (
          <p className="text-destructive text-sm">{errors.emailAddress.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="user-password">Senha *</Label>
        <div className="relative">
          <Input
            autoComplete="new-password"
            className="pr-10"
            id="user-password"
            placeholder="********"
            type={showPassword ? 'text' : 'password'}
            {...register('rawPassword')}
          />
          <button
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
            className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(prev => !prev)}
            type="button"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.rawPassword && (
          <p className="text-destructive text-sm">{errors.rawPassword.message}</p>
        )}
      </div>
    </form>
  )

  return (
    <>
      {/* Visualização Desktop */}
      <Dialog onOpenChange={handleClose} open={isOpen && !isMobile}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
          </DialogHeader>
          {formContent}
          <div className="flex flex-row gap-3 justify-end pt-4">
            <DialogClose asChild>
              <Button disabled={isSaving} variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button disabled={isSaving} form="create-user-form" type="submit" variant="primary">
              {submitButtonText}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visualização Mobile */}
      <Drawer onOpenChange={handleClose} open={isOpen && isMobile}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Criar Novo Usuário</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto px-6">{formContent}</div>
          <div className="flex flex-col gap-3 p-4">
            <DrawerClose asChild>
              <Button className="w-full" disabled={isSaving} variant="outline">
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              className="w-full"
              disabled={isSaving}
              form="create-user-form"
              type="submit"
              variant="primary"
            >
              {submitButtonText}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
