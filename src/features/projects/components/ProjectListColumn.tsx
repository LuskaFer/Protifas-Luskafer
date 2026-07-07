import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/skeleton'
import type { ProjectItem } from '../interfaces'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_VARIANT_MAP } from '../interfaces'

const SKELETON_ITEMS = ['s1', 's2', 's3', 's4', 's5']

interface ProjectListColumnProps {
  items: ProjectItem[]
  selectedId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
}

export function ProjectListColumn({
  items,
  selectedId,
  isLoading,
  onSelect,
}: ProjectListColumnProps) {
  return (
    <div className="flex flex-col divide-y">
      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="space-y-4 w-full">
            {SKELETON_ITEMS.map(i => (
              <div key={i} className="flex gap-3 px-4 py-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          Nenhum projeto encontrado.
        </p>
      )}

      {!isLoading &&
        items.map(item => {
          const isSelected = selectedId === item.id
          const status = (item as any).publicationStatus || 'DRAFT'

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                isSelected ? 'bg-muted text-foreground' : 'text-muted-foreground',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium leading-tight">{item.title}</span>
                <span className="truncate text-xs opacity-70">{item.dateMade}</span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'w-fit rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                      PROJECT_STATUS_VARIANT_MAP[status] || '',
                    )}
                  >
                    {PROJECT_STATUS_LABELS[status] || 'Desconhecido'}
                  </span>
                  {item.createdAt && (
                    <span className="shrink-0 text-[10px] opacity-50">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
              {isSelected && <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />}
            </button>
          )
        })}
    </div>
  )
}
