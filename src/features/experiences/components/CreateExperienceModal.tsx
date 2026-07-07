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
import { Spinner } from '@/shared/ui/spinner'
import { useCreateExperience } from '../hooks/useCreateExperience'
import {
  type CreateExperienceFormSchema,
  createExperienceSchema,
  thumbnailFileSchema,
} from '../zod/schemas'

interface CreateExperienceModalProps {
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
        id={`exp-thumbnail-${idSuffix}`}
        onChange={e => onThumbnailChange(e.target.files?.[0])}
      />
    </div>
  )
}

export function CreateExperienceModal({ open, onClose }: CreateExperienceModalProps) {
  const isMobile = useIsMobile()
  const fileInputDesktopRef = useRef<HTMLInputElement>(null)
  const fileInputMobileRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: createExperience } = useCreateExperience()

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateExperienceFormSchema>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: { title: '', company: '', period: '', description: '' },
  })

  const watchedTitle = watch('title')
  const watchedCompany = watch('company')
  const watchedPeriod = watch('period')
  const watchedDescription = watch('description')

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

  const onSubmit = async (data: CreateExperienceFormSchema) => {
    setIsSaving(true)
    try {
      await createExperience({
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
    'Criar Experiência'
  )

  const desktopForm = (
    <form
      className="space-y-4"
      id="create-experience-form-desktop"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1.5">
        <Label htmlFor="exp-title-d">Título *</Label>
        <Input
          id="exp-title-d"
          placeholder="Título da experiência"
          value={watchedTitle}
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="exp-company-d">Empresa *</Label>
          <Input
            id="exp-company-d"
            placeholder="Nome da empresa"
            value={watchedCompany}
            {...register('company')}
          />
          {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="exp-period-d">Período *</Label>
          <Input
            id="exp-period-d"
            placeholder="Ex: Jan 2023 — Dez 2024"
            value={watchedPeriod}
            {...register('period')}
          />
          {errors.period && <p className="text-sm text-destructive">{errors.period.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="exp-description-d">Descrição *</Label>
        <textarea
          id="exp-description-d"
          placeholder="Descrição da experiência (markdown suportado)..."
          value={watchedDescription}
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
    <form
      className="space-y-4"
      id="create-experience-form-mobile"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1.5">
        <Label htmlFor="exp-title-m">Título *</Label>
        <Input
          id="exp-title-m"
          placeholder="Título da experiência"
          value={watchedTitle}
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="exp-company-m">Empresa *</Label>
        <Input
          id="exp-company-m"
          placeholder="Nome da empresa"
          value={watchedCompany}
          {...register('company')}
        />
        {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="exp-period-m">Período *</Label>
        <Input
          id="exp-period-m"
          placeholder="Ex: Jan 2023 — Dez 2024"
          value={watchedPeriod}
          {...register('period')}
        />
        {errors.period && <p className="text-sm text-destructive">{errors.period.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="exp-description-m">Descrição *</Label>
        <textarea
          id="exp-description-m"
          placeholder="Descrição da experiência (markdown suportado)..."
          value={watchedDescription}
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
            <DialogTitle>Criar Nova Experiência</DialogTitle>
          </DialogHeader>
          {desktopForm}
          <DialogFooter className="flex flex-row gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button form="create-experience-form-desktop" type="submit" variant="primary">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={open && isMobile} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Criar Nova Experiência</DrawerTitle>
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
              form="create-experience-form-mobile"
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
