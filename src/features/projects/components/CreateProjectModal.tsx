import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useIsMobile } from '@/shared/hooks/use-mobile'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Spinner } from '@/shared/ui/spinner'
import { useCreateProject } from '../hooks/useCreateProject'
import {
  type CreateProjectFormSchema,
  createProjectSchema,
  thumbnailFileSchema,
} from '../zod/schemas'

interface CreateProjectModalProps {
  open: boolean
  onClose: (open: boolean) => void
}

function ThumbnailField({
  idSuffix,
  inputRef,
  thumbnailPreview,
  onThumbnailChange,
  onRemoveThumbnail,
}: {
  idSuffix: string
  inputRef: React.RefObject<HTMLInputElement | null>
  thumbnailPreview: string | null
  onThumbnailChange: (file: File | undefined) => void
  onRemoveThumbnail: () => void
}) {
  return (
    <div className="space-y-1.5">
      <Label>Thumbnail</Label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-3.5" />
          {thumbnailPreview ? 'Trocar imagem' : 'Selecionar imagem'}
        </button>
        {thumbnailPreview && (
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-white"
            onClick={onRemoveThumbnail}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      {thumbnailPreview && (
        <img
          alt="Preview do thumbnail"
          className="mt-2 h-28 w-full rounded-md border object-cover"
          src={thumbnailPreview}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id={`proj-thumbnail-${idSuffix}`}
        onChange={e => onThumbnailChange(e.target.files?.[0])}
      />
    </div>
  )
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const isMobile = useIsMobile()
  const fileInputDesktopRef = useRef<HTMLInputElement>(null)
  const fileInputMobileRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: createProject } = useCreateProject()

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      dateMade: '',
      repositoryUrl: '',
      liveUrl: '',
      description: '',
      company: '',
      projectType: 'DEV',
    },
  })

  const watchedTitle = watch('title')

  const handleThumbnailChange = (file: File | undefined) => {
    if (!file) return
    const result = thumbnailFileSchema.safeParse(file)
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Arquivo inválido')
      return
    }
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleRemoveThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(null)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      reset()
      setThumbnail(null)
      setThumbnailPreview(null)
      setSaved(false)
    }
    onClose(open)
  }

  const onSubmit = async (data: CreateProjectFormSchema) => {
    setIsSaving(true)
    try {
      await createProject({
        payload: { ...data },
        file: thumbnail,
      })
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        handleClose(false)
      }, 800)
    } catch {
      // error toast handled in mutation
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
    'Criar Projeto'
  )

  const desktopForm = (
    <form className="space-y-4" id="create-project-form-desktop" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="proj-title-d">Título *</Label>
        <Input
          id="proj-title-d"
          placeholder="Título do projeto"
          value={watchedTitle}
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="proj-datemade-d">Data de Criação *</Label>
          <Input id="proj-datemade-d" placeholder="Ex: 2024-03" {...register('dateMade')} />
          {errors.dateMade && <p className="text-sm text-destructive">{errors.dateMade.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="proj-company-d">Empresa</Label>
          <Input
            id="proj-company-d"
            placeholder="Empresa/Cliente (opcional)"
            {...register('company')}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="proj-repo-d">URL do Repositório</Label>
          <Input
            id="proj-repo-d"
            placeholder="https://github.com/..."
            {...register('repositoryUrl')}
          />
          {errors.repositoryUrl && (
            <p className="text-sm text-destructive">{errors.repositoryUrl.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="proj-live-d">URL do Live</Label>
          <Input id="proj-live-d" placeholder="https://meuprojeto.com" {...register('liveUrl')} />
          {errors.liveUrl && <p className="text-sm text-destructive">{errors.liveUrl.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="proj-type-d">Tipo *</Label>
          <Select
            defaultValue="DEV"
            onValueChange={value => setValue('projectType', value as 'DEV' | 'GENERAL')}
          >
            <SelectTrigger id="proj-type-d">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEV">DEV (Software)</SelectItem>
              <SelectItem value="GENERAL">General (Elétrica/Restauração)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-description-d">Descrição *</Label>
        <textarea
          id="proj-description-d"
          placeholder="Descrição do projeto (markdown suportado)..."
          {...register('description')}
          className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          rows={5}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>
      <ThumbnailField
        idSuffix="desktop"
        inputRef={fileInputDesktopRef}
        thumbnailPreview={thumbnailPreview}
        onThumbnailChange={handleThumbnailChange}
        onRemoveThumbnail={handleRemoveThumbnail}
      />
    </form>
  )

  const mobileForm = (
    <form className="space-y-4" id="create-project-form-mobile" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="proj-title-m">Título *</Label>
        <Input
          id="proj-title-m"
          placeholder="Título do projeto"
          value={watchedTitle}
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-datemade-m">Data de Criação *</Label>
        <Input id="proj-datemade-m" placeholder="Ex: 2024-03" {...register('dateMade')} />
        {errors.dateMade && <p className="text-sm text-destructive">{errors.dateMade.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-company-m">Empresa</Label>
        <Input
          id="proj-company-m"
          placeholder="Empresa/Cliente (opcional)"
          {...register('company')}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-repo-m">URL do Repositório</Label>
        <Input
          id="proj-repo-m"
          placeholder="https://github.com/..."
          {...register('repositoryUrl')}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-live-m">URL do Live</Label>
        <Input id="proj-live-m" placeholder="https://meuprojeto.com" {...register('liveUrl')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-type-m">Tipo *</Label>
        <Select
          defaultValue="DEV"
          onValueChange={value => setValue('projectType', value as 'DEV' | 'GENERAL')}
        >
          <SelectTrigger id="proj-type-m">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEV">DEV (Software)</SelectItem>
            <SelectItem value="GENERAL">General (Elétrica/Restauração)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="proj-description-m">Descrição *</Label>
        <textarea
          id="proj-description-m"
          placeholder="Descrição do projeto (markdown suportado)..."
          {...register('description')}
          className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          rows={5}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>
      <ThumbnailField
        idSuffix="mobile"
        inputRef={fileInputMobileRef}
        thumbnailPreview={thumbnailPreview}
        onThumbnailChange={handleThumbnailChange}
        onRemoveThumbnail={handleRemoveThumbnail}
      />
    </form>
  )

  return (
    <>
      <Dialog open={open && !isMobile} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          {desktopForm}
          <DialogFooter className="flex flex-row gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button form="create-project-form-desktop" type="submit" variant="primary">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={open && isMobile} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Criar Novo Projeto</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto px-6">{mobileForm}</div>
          <DrawerFooter className="flex-col gap-3 p-4">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              className="w-full"
              form="create-project-form-mobile"
              type="submit"
              variant="primary"
            >
              {submitButtonText}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
