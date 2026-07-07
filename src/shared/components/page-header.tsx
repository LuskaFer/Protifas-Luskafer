import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/input'

interface PageHeaderSearchProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  search?: PageHeaderSearchProps
  backButton?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  actions,
  search,
  backButton,
  className,
}: PageHeaderProps) {
  const isMobile = useIsMobile()

  const actionArray = Array.isArray(actions) ? actions : actions ? [actions as ReactNode] : []

  return (
    <div className={cn('border-b border-border/50 p-2 md:p-4 shrink-0', className)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        {/* Título + Subtítulo + Botão Voltar */}
        <div className={cn('flex flex-col', isMobile && 'text-center')}>
          <div className={cn('flex items-center gap-3', isMobile && 'justify-center')}>
            {backButton && (
              <div className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                {backButton}
              </div>
            )}
            <div>
              <h1
                className={cn(
                  'font-bold tracking-tight text-foreground',
                  isMobile ? 'text-xl' : 'text-3xl',
                )}
              >
                {title}
              </h1>
            </div>
          </div>
          {!isMobile && subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>

        {/* Barra de ações + Busca */}
        {(actions || search) && (
          <div
            className={cn(
              'flex flex-col sm:flex-row items-stretch sm:items-center gap-3',
              isMobile && 'justify-center w-full',
            )}
          >
            {search && (
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  className="pl-8 w-full sm:w-64"
                  onChange={e => search.onChange(e.target.value)}
                  placeholder={search.placeholder || 'Buscar...'}
                  type="search"
                  value={search.value}
                />
              </div>
            )}

            {actionArray.length > 0 && (
              <div
                className={cn('gap-2', isMobile ? 'grid grid-cols-2 w-full' : 'flex items-center')}
              >
                {actionArray.map((action, index) => {
                  const isOddTotal = actionArray.length % 2 !== 0
                  const isLastItem = index === actionArray.length - 1

                  const spanFullWidth = isMobile && isOddTotal && isLastItem

                  return (
                    <div
                      className={cn(
                        spanFullWidth ? 'col-span-2' : 'col-span-1',
                        isMobile && '[&>*]:w-full',
                      )}
                      key={index}
                    >
                      {action}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
