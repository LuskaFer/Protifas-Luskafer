import { Search } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { ChangesActions } from '@/shared/components/changes-actions'
import {
  type ConfirmChangeItem,
  ConfirmChangesModal,
} from '@/shared/components/confirm-changes-modal'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'
import { Switch } from '@/shared/ui/switch'

export interface ToggleItem {
  id: string | number
  name: string
  description?: string
  isChanged?: boolean
}

export interface ToggleGroup {
  groupName: string
  items: ToggleItem[]
}

interface GroupedToggleSectionProps {
  groups: ToggleGroup[]
  selectedIds: (string | number)[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  onToggleItem: (id: string | number) => void
  onToggleGroup: (ids: (string | number)[], enable: boolean) => void
  renderItemControl?: (params: {
    item: ToggleItem
    isChecked: boolean
    isDisabled: boolean
    onToggleItem: () => void
  }) => ReactNode
  renderGroupControl?: (params: {
    group: ToggleGroup
    allSelected: boolean
    isDisabled: boolean
    onToggleGroup: (enable: boolean) => void
  }) => ReactNode
  enableItemToggle?: boolean
  onDiscardChanges?: () => void
  onSaveChanges?: () => Promise<void>
  isDisabled?: boolean
  isLoading?: boolean
  isSavingChanges?: boolean
  hasChanges?: boolean
  title?: string
  emptyMessage?: string
  filterOptions?: Array<{ value: string; label: string }>
  filterValue?: string
  filterLabel?: string
  onFilterChange?: (value: string) => void
  confirmItems?: ConfirmChangeItem[]
  confirmTitle?: string
  confirmDescription?: string
  confirmConfirmLabel?: string
  confirmTotalLabel?: string
  className?: string
}

export function GroupedToggleSection({
  groups,
  selectedIds,
  searchValue,
  onSearchChange,
  onToggleItem,
  onToggleGroup,
  renderItemControl,
  renderGroupControl,
  enableItemToggle = true,
  onDiscardChanges,
  onSaveChanges,
  isDisabled = false,
  isLoading = false,
  isSavingChanges = false,
  hasChanges = false,
  title,
  emptyMessage = 'Nenhum item disponível.',
  filterOptions,
  filterValue,
  filterLabel = 'Filtro:',
  onFilterChange,
  confirmItems = [],
  confirmTitle,
  confirmDescription,
  confirmConfirmLabel,
  confirmTotalLabel,
  className,
}: GroupedToggleSectionProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [internalSearch, setInternalSearch] = useState('')
  const resolvedSearchValue = searchValue ?? internalSearch
  const handleSearchChange = onSearchChange ?? setInternalSearch
  const normalizedSearch = resolvedSearchValue.trim().toLowerCase()
  const filteredGroups = normalizedSearch
    ? groups
        .map(group => ({
          ...group,
          items: group.items.filter(
            item =>
              item.name.toLowerCase().includes(normalizedSearch) ||
              item.description?.toLowerCase().includes(normalizedSearch),
          ),
        }))
        .filter(
          group =>
            group.groupName.toLowerCase().includes(normalizedSearch) || group.items.length > 0,
        )
    : groups

  const showFilter = Boolean(filterOptions && filterOptions.length > 0 && onFilterChange)

  const handleSaveClick = () => {
    if (!onSaveChanges || !hasChanges || isSavingChanges) return
    if (confirmItems.length > 0) {
      setIsConfirmOpen(true)
      return
    }
    void onSaveChanges()
  }

  return (
    <div className={cn('flex h-full flex-col overflow-hidden', className)}>
      <div className="shrink-0 border-b p-4 space-y-3">
        {title && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            onChange={event => handleSearchChange(event.target.value)}
            placeholder="Buscar..."
            value={resolvedSearchValue}
          />
        </div>
        {showFilter && (
          <div className="flex items-center gap-2 border-t pt-3">
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {filterLabel}
            </span>
            <div className="flex gap-1">
              {filterOptions?.map(option => (
                <Button
                  className="h-6 px-2 text-xs"
                  key={option.value}
                  onClick={() => onFilterChange?.(option.value)}
                  size="sm"
                  variant={filterValue === option.value ? 'primary' : 'outline'}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="flex flex-col divide-y">
            {filteredGroups.map(group => {
              const allSelected =
                group.items.length > 0 && group.items.every(item => selectedIds.includes(item.id))
              const groupItemIds = group.items.map(item => item.id)
              const groupControl = renderGroupControl ? (
                renderGroupControl({
                  group,
                  allSelected,
                  isDisabled,
                  onToggleGroup: enable => onToggleGroup(groupItemIds, enable),
                })
              ) : (
                <Switch
                  checked={allSelected}
                  disabled={isDisabled}
                  onCheckedChange={checked => onToggleGroup(groupItemIds, checked)}
                />
              )

              return (
                <div className="flex flex-col" key={group.groupName}>
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {group.groupName}
                    </span>
                    {groupControl}
                  </div>

                  <div className="flex flex-col">
                    {group.items.map(item => {
                      const isChecked = selectedIds.includes(item.id)
                      const itemControl = renderItemControl ? (
                        renderItemControl({
                          item,
                          isChecked,
                          isDisabled,
                          onToggleItem: () => onToggleItem(item.id),
                        })
                      ) : (
                        <Switch checked={isChecked} disabled={isDisabled} />
                      )

                      return (
                        // biome-ignore lint/a11y/noStaticElementInteractions: interactive div with button role
                        <div
                          className={cn(
                            'flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors ml-4',
                            item.isChanged && 'bg-yellow-500/10 hover:bg-yellow-500/20',
                          )}
                          key={item.id}
                          onClick={
                            enableItemToggle
                              ? () => !isDisabled && onToggleItem(item.id)
                              : undefined
                          }
                          onKeyDown={
                            enableItemToggle
                              ? event => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    if (!isDisabled) onToggleItem(item.id)
                                  }
                                }
                              : undefined
                          }
                          role={enableItemToggle ? 'button' : undefined}
                          tabIndex={enableItemToggle ? 0 : undefined}
                        >
                          <div className="flex-1 min-w-0 flex flex-col pr-4">
                            <span className="text-sm font-medium text-foreground truncate">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate mt-0.5">
                                {item.description}
                              </span>
                            )}
                          </div>
                          {itemControl}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">{emptyMessage}</p>
        )}
      </div>

      {onDiscardChanges && onSaveChanges && (
        <div className="shrink-0 border-t p-4">
          <ChangesActions
            discardLabel="Descartar Alterações"
            discardLabelMobile="Descartar"
            hasChanges={hasChanges}
            isDisabled={isDisabled}
            isSaving={isSavingChanges}
            onDiscard={onDiscardChanges}
            onSave={handleSaveClick}
            saveLabel="Salvar Alterações"
            saveLabelMobile="Salvar"
            size="sm"
          />
        </div>
      )}

      {onSaveChanges && (
        <ConfirmChangesModal
          confirmLabel={confirmConfirmLabel}
          description={confirmDescription}
          isOpen={isConfirmOpen}
          items={confirmItems}
          onClose={setIsConfirmOpen}
          onConfirm={onSaveChanges}
          title={confirmTitle}
          totalLabel={confirmTotalLabel}
        />
      )}
    </div>
  )
}
