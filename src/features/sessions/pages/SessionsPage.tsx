import { useEffect, useMemo, useRef, useState } from 'react'
import { useEndpoints } from '@/features/sessions/hooks/useEndpoints'
import type { ConfirmChangeItem } from '@/shared/components/confirm-changes-modal'
import { GroupedToggleSection, type ToggleGroup } from '@/shared/components/grouped-toggle-section'
import { PageHeader } from '@/shared/components/page-header'

const getConfigKey = (config: { method: string; path: string }) => `${config.method}-${config.path}`

export function SessionsPage() {
  const { configurations, setConfigurations, isLoading, isSaving, saveEndpointChanges } =
    useEndpoints()

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const wasLoadingRef = useRef(true)

  const [baselineEnabledByKey, setBaselineEnabledByKey] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const wasLoading = wasLoadingRef.current
    wasLoadingRef.current = isLoading

    if (isLoading) return
    if (!wasLoading) return

    const nextBaseline = configurations.reduce<Record<string, boolean>>((acc, config) => {
      acc[getConfigKey(config)] = config.enabled
      return acc
    }, {})

    queueMicrotask(() => {
      setBaselineEnabledByKey(nextBaseline)
    })
  }, [isLoading, configurations])

  const changedConfigurations = useMemo(() => {
    return configurations.filter(config => {
      const key = getConfigKey(config)
      const baselineValue = baselineEnabledByKey[key]
      if (typeof baselineValue === 'undefined') return false
      return baselineValue !== config.enabled
    })
  }, [configurations, baselineEnabledByKey])

  const changedConfigurationIds = useMemo(
    () => new Set(changedConfigurations.map(c => c.id)),
    [changedConfigurations],
  )

  const hasChanges = changedConfigurations.length > 0

  const groupedGroups: ToggleGroup[] = useMemo(() => {
    const filtered = configurations.filter(config => {
      const baselineEnabled = baselineEnabledByKey[getConfigKey(config)]
      const savedEnabled = typeof baselineEnabled === 'boolean' ? baselineEnabled : config.enabled
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && savedEnabled) ||
        (statusFilter === 'inactive' && !savedEnabled)
      return matchesStatus
    })

    const groupsRecord = filtered.reduce(
      (acc, config) => {
        const { controller } = config
        if (!acc[controller]) {
          acc[controller] = []
        }
        acc[controller].push({
          id: config.id,
          name: config.title,
          description: `${config.method} ${config.path}`,
          isChanged: changedConfigurationIds.has(config.id),
        })
        return acc
      },
      {} as Record<string, ToggleGroup['items']>,
    )

    return Object.entries(groupsRecord).map(([groupName, items]) => ({
      groupName,
      items,
    }))
  }, [configurations, statusFilter, changedConfigurationIds, baselineEnabledByKey])

  const activeIds = useMemo(
    () => configurations.filter(c => c.enabled).map(c => c.id),
    [configurations],
  )

  const handleToggleItem = (id: string | number) => {
    setConfigurations(prev =>
      prev.map(config => (config.id === id ? { ...config, enabled: !config.enabled } : config)),
    )
  }

  const handleToggleGroup = (ids: (string | number)[], enable: boolean) => {
    setConfigurations(prev =>
      prev.map(config => (ids.includes(config.id) ? { ...config, enabled: enable } : config)),
    )
  }

  const revertChanges = () => {
    setConfigurations(prev =>
      prev.map(config => ({
        ...config,
        enabled: baselineEnabledByKey[getConfigKey(config)] ?? config.enabled,
      })),
    )
  }

  const handleSaveChanges = async () => {
    if (!hasChanges) return
    await saveEndpointChanges(changedConfigurations)
  }

  const confirmItems = useMemo<ConfirmChangeItem[]>(() => {
    return changedConfigurations.map(config => ({
      id: config.id,
      title: config.title,
      description: `${config.method} ${config.path}`,
      statusLabel: config.enabled ? 'Ativo' : 'Inativo',
      statusVariant: config.enabled ? 'primary' : 'destructive',
    }))
  }, [changedConfigurations])

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
  ]

  return (
    <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
      <PageHeader
        subtitle="Gerencie as funcionalidades disponíveis no sistema."
        title="Sessões (Funcionalidades)"
      />
      <div className="flex-1 overflow-hidden">
        <GroupedToggleSection
          confirmDescription="As seguintes funcionalidades serão alteradas:"
          confirmItems={confirmItems}
          emptyMessage="Nenhuma funcionalidade encontrada."
          filterOptions={filterOptions}
          filterValue={statusFilter}
          groups={groupedGroups}
          hasChanges={hasChanges}
          isDisabled={isSaving}
          isLoading={isLoading}
          isSavingChanges={isSaving}
          onDiscardChanges={revertChanges}
          onFilterChange={value => setStatusFilter(value as 'all' | 'active' | 'inactive')}
          onSaveChanges={handleSaveChanges}
          onToggleGroup={handleToggleGroup}
          onToggleItem={handleToggleItem}
          selectedIds={activeIds}
        />
      </div>
    </div>
  )
}
