import { Camera, Upload, X } from 'lucide-react'
import { useRef } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Skeleton } from '@/shared/ui/skeleton'
import type { CreateProjectFormSchema } from '../zod/schemas'

interface ProjectEditorColumnProps {
  isLoading: boolean
  thumbnailPreview: string | null
  register: UseFormRegister<CreateProjectFormSchema>
  errors: FieldErrors<CreateProjectFormSchema>
  onThumbnailSelect: (file: File) => void
  onRemoveThumbnail: () => void
}

export function ProjectEditorColumn({
  isLoading,
  thumbnailPreview,
  register,
  errors,
  onThumbnailSelect,
  onRemoveThumbnail,
}: ProjectEditorColumnProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Skeleton className="size-8 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 overflow-y-auto p-6">
      {/* thumbnail */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <button
            type="button"
            className="group relative cursor-pointer overflow-hidden rounded-lg border bg-muted"
            onClick={() => fileInputRef.current?.click()}
            style={{ width: 220, height: 124 }}
          >
            {thumbnailPreview ? (
              <img alt="Thumbnail" className="size-full object-cover" src={thumbnailPreview} />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
                <Upload className="size-5" />
                <span className="text-xs">Adicionar thumbnail</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-5 text-white" />
            </div>
          </button>
          {thumbnailPreview && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onRemoveThumbnail()
              }}
              className="absolute -right-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <span className="text-xs text-muted-foreground">Clique para alterar o thumbnail</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) onThumbnailSelect(file)
          }}
        />
      </div>

      {/* form fields */}
      <section className="space-y-3">
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label htmlFor="edit-title">Título</Label>
          <Input id="edit-title" {...register('title')} placeholder="Título do projeto" />
          {errors.title && (
            <p className="col-start-2 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label htmlFor="edit-datemade">Data</Label>
          <Input id="edit-datemade" {...register('dateMade')} placeholder="Ex: 2024-03" />
          {errors.dateMade && (
            <p className="col-start-2 text-sm text-destructive">{errors.dateMade.message}</p>
          )}
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label htmlFor="edit-company">Empresa</Label>
          <Input
            id="edit-company"
            {...register('company')}
            placeholder="Empresa/Cliente (opcional)"
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label htmlFor="edit-repo">Repositório</Label>
          <Input
            id="edit-repo"
            {...register('repositoryUrl')}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
          <Label htmlFor="edit-live">Live URL</Label>
          <Input id="edit-live" {...register('liveUrl')} placeholder="https://meuprojeto.com" />
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-4">
          <Label className="pt-2" htmlFor="edit-description">
            Descrição
          </Label>
          <textarea
            id="edit-description"
            {...register('description')}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Descrição do projeto (markdown suportado)..."
            rows={8}
          />
          {errors.description && (
            <p className="col-start-2 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
      </section>
    </div>
  )
}
