import { Archive, Trash2, Zap } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { Spinner } from '@/shared/ui/spinner'
import type { ProjectDetail } from '../interfaces'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT_MAP } from '../interfaces'

interface ProjectActionsColumnProps {
  detail: ProjectDetail | undefined
  isLoading: boolean
  selectedId: string | null
  currentStatus: string
  publishedDate: string | null
  isSaving: boolean
  isUpdatingStatus: boolean
  onSave: () => void
  onPublish: () => void
  onArchive: () => void
  onDelete: () => void
}

export function ProjectActionsColumn({
  detail,
  isLoading,
  selectedId,
  currentStatus,
  publishedDate,
  isSaving,
  isUpdatingStatus,
  onSave,
  onPublish,
  onArchive,
  onDelete,
}: ProjectActionsColumnProps) {
  const isDisabled = selectedId === null || isLoading
  const statusLabel = PROJECT_STATUS_LABELS[currentStatus] ?? currentStatus
  const statusClass = PROJECT_STATUS_VARIANT_MAP[currentStatus] ?? ''

  if (isLoading && selectedId) {
    return (
      <div className="flex flex-col gap-5 border-l p-6">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 overflow-y-auto border-l p-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">Ações</span>
        <span className="text-xs text-muted-foreground">
          Gerencie o status e a visibilidade do projeto selecionado.
        </span>
      </div>

      {selectedId && !isLoading && detail && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Status atual</span>
          <span
            className={cn(
              'w-fit rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide',
              statusClass,
            )}
          >
            {statusLabel || 'Desconhecido'}
          </span>
        </div>
      )}

      {selectedId && !isLoading && publishedDate && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Data de publicação</span>
          <span className="text-sm font-medium">
            {new Date(publishedDate).toLocaleDateString('pt-BR')}
          </span>
        </div>
      )}

      {isDisabled && (
        <p className="text-xs text-muted-foreground">
          Selecione um projeto para habilitar as ações.
        </p>
      )}

      {!isDisabled && detail && (
        <div className="flex flex-col gap-2">
          <Button
            className="w-full justify-start gap-2"
            disabled={isUpdatingStatus || currentStatus === 'PUBLISHED'}
            onClick={onPublish}
            size="sm"
            variant="primary"
          >
            <Zap className="size-4" />
            Publicar
          </Button>

          <Button
            className="w-full justify-start gap-2"
            disabled={isUpdatingStatus || currentStatus === 'ARCHIVED'}
            onClick={onArchive}
            size="sm"
            variant="outline"
          >
            <Archive className="size-4" />
            Arquivar
          </Button>

          <Button
            className="w-full justify-start gap-2"
            disabled={isUpdatingStatus}
            onClick={onDelete}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="size-4" />
            Remover Projeto
          </Button>
        </div>
      )}

      <div className="mt-auto flex justify-end border-t pt-4">
        <Button disabled={isDisabled || isSaving} onClick={onSave} size="sm" variant="primary">
          {isSaving ? (
            <>
              <Spinner className="mr-2" size="sm" /> Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </div>
  )
}
