import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Plus, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import {
  fetchUserDetail,
  fetchUserPermissionOverrides,
  updateUserRoles,
} from '@/features/users/api/usersApi'
import { CreateUserModal } from '@/features/users/components/CreateUserModal'
import {
  type PermissionGroup,
  useFetchPermissionModules,
} from '@/features/users/hooks/useFetchPermissionModules'
import { useProcuradorias } from '@/features/users/hooks/useProcuradorias'
import { useRolePermissions } from '@/features/users/hooks/useRolePermissions'
import { useRoles } from '@/features/users/hooks/useRoles'
import { useUpdateUser } from '@/features/users/hooks/useUpdateUser'
import { useUpdateUserPermissions } from '@/features/users/hooks/useUpdateUserPermissions'
import { useUsers } from '@/features/users/hooks/useUsers'
import type { PermissionOverride } from '@/features/users/interfaces'
import { type EditUserFormSchema, editUserSchema } from '@/features/users/zod/create-user'
import { ChangesActions } from '@/shared/components/changes-actions'
import type { ConfirmChangeItem } from '@/shared/components/confirm-changes-modal'
import { GroupedToggleSection, type ToggleGroup } from '@/shared/components/grouped-toggle-section'
import { PageHeader } from '@/shared/components/page-header'
import { SearchableSelect } from '@/shared/components/searchable-select'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { getInitials } from '@/shared/lib/get-initials'
import { cn } from '@/shared/lib/utils'
import { getMediaUrl } from '@/shared/services/http/media'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { TripleStateSwitch, type TripleSwitchState } from '@/shared/ui/triple-state-switch'

const STABLE_EMPTY_ARRAY: PermissionGroup[] = []

export function UsersManagementView() {
  const { users, isLoading: usersLoading, refetch: refetchUsers } = useUsers()
  const { roles, isLoading: rolesLoading } = useRoles()
  const isMobile = useIsMobile()
  const emailDomain = 'sjc.sp.gov.br'

  const { procuradorias, isLoading: procuradoriasLoading } = useProcuradorias(true)

  const { data: _rawPermissionModules, isLoading: isPermissionsLoading } =
    useFetchPermissionModules()
  const permissionModules = _rawPermissionModules ?? STABLE_EMPTY_ARRAY

  const procuradoriaOptions = useMemo(
    () => procuradorias.map(p => ({ value: p.id.toString(), label: p.name })),
    [procuradorias],
  )

  const {
    control,
    register,
    reset,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EditUserFormSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: '',
      emailAddress: '',
      cpfNumber: '',
      oabNumber: '',
      procuradoriaId: 0,
    },
  })

  const watchedName = useWatch({ control, name: 'fullName' })

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [roleValue, setRoleValue] = useState('')

  const { permissionIds: rolePermissionIds } = useRolePermissions(roleValue)

  const [baselineRoleValue, setBaselineRoleValue] = useState('')
  const [baselinePermissionStates, setBaselinePermissionStates] = useState<
    Record<number, TripleSwitchState>
  >({})
  const [isSavingPermissions, setIsSavingPermissions] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarBackendUrl, setAvatarBackendUrl] = useState<string | null>(null)
  const [isAvatarMarkedForRemoval, setIsAvatarMarkedForRemoval] = useState(false)
  const [activeTab, setActiveTab] = useState('user-data')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [permissionOverrides, setPermissionOverrides] = useState<PermissionOverride[]>([])
  const [permissionSwitchStates, setPermissionSwitchStates] = useState<
    Record<number, TripleSwitchState>
  >({})

  const [procuradoriaValue, setProcuradoriaValue] = useState('')
  const [baselineProcuradoriaValue, setBaselineProcuradoriaValue] = useState('')

  const { mutateAsync: updateUserMutation } = useUpdateUser()
  const { mutateAsync: updateUserPermissionsMutation } = useUpdateUserPermissions()

  const buildPermissionStates = useCallback(
    (overrides: PermissionOverride[]) => {
      const overridesById = new Map(
        overrides.map(override => [override.permissionId, override.isGranted]),
      )
      return permissionModules.reduce(
        (acc, group) => {
          group.permissions.forEach(permission => {
            const override = overridesById.get(permission.id)
            acc[permission.id] = override === undefined ? 'inherit' : override ? 'on' : 'off'
          })
          return acc
        },
        {} as Record<number, TripleSwitchState>,
      )
    },
    [permissionModules],
  )

  const buildGroupStates = useCallback(
    (states: Record<number, TripleSwitchState>) => {
      return permissionModules.reduce(
        (acc, group) => {
          const groupStates = group.permissions.map(
            permission => states[permission.id] ?? 'inherit',
          )
          acc[group.module] =
            groupStates.length > 0 && groupStates.every(state => state === 'on')
              ? 'on'
              : groupStates.length > 0 && groupStates.every(state => state === 'off')
                ? 'off'
                : 'inherit'
          return acc
        },
        {} as Record<string, TripleSwitchState>,
      )
    },
    [permissionModules],
  )

  const filtered = users.filter(
    user =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  )

  const currentUser = users.find(user => user.id === selectedId) ?? null
  const isDisabled = selectedId === null

  const resetEditorState = () => {
    setAvatarPreview(null)
    setAvatarBackendUrl(null)
    setIsAvatarMarkedForRemoval(false)
    setRoleValue('')
    setBaselineRoleValue('')
    setProcuradoriaValue('')
    setBaselineProcuradoriaValue('')
    setPermissionOverrides([])
    setBaselinePermissionStates({})
    setPermissionSwitchStates({})
    reset()
  }

  const hydrateUserFromDetail = async (id: string) => {
    const res = await fetchUserDetail(id)
    const d = res as { [key: string]: unknown }
    const getStr = (val: unknown, fallback = ''): string => {
      if (val === null || val === undefined) return fallback
      return String(val)
    }
    const getNum = (val: unknown, fallback: number): number => {
      if (val === null || val === undefined) return fallback
      return Number(val)
    }
    const normalizedFullName = getStr(
      d.fullName ?? [d.firstName, d.lastName].filter(Boolean).join(' '),
    )
    const normalizedEmailValue = getStr(d.email ?? d.emailAddress ?? '')
    const normalizedEmail = normalizedEmailValue
      ? `${normalizedEmailValue}`.split('@')[0].toLowerCase()
      : ''
    const normalizedCpf = getStr(d.cpf ?? d.cpfNumber ?? '')
    const normalizedOab = getStr(d.oab ?? d.oabNumber ?? '')
    const normalizedAvatar = (d.avatarUrl ?? d.avatar ?? null) as string | null
    const normalizedProcuradoriaId = getNum(d.procuradoriaId, 0)

    reset({
      fullName: normalizedFullName,
      emailAddress: normalizedEmail,
      cpfNumber: normalizedCpf,
      oabNumber: normalizedOab,
      procuradoriaId: normalizedProcuradoriaId,
    })

    setAvatarBackendUrl(normalizedAvatar)
    setAvatarPreview(normalizedAvatar ? getMediaUrl(normalizedAvatar) : null)
    setIsAvatarMarkedForRemoval(false)

    const procuradoriaIdStr = normalizedProcuradoriaId ? normalizedProcuradoriaId.toString() : ''
    setProcuradoriaValue(procuradoriaIdStr)
    setBaselineProcuradoriaValue(procuradoriaIdStr)

    const detailRoles = (d.roles as Array<string | { id?: string; name?: string }>) ?? []
    let nextRoleValue = ''
    if (detailRoles.length > 0) {
      const firstRole = detailRoles[0]
      const raw = typeof firstRole === 'string' ? firstRole : (firstRole.id ?? firstRole.name ?? '')
      const match = roles.find(role => role.id === raw || role.name === raw)
      nextRoleValue = match ? match.id : raw
    }

    setRoleValue(nextRoleValue)
    setBaselineRoleValue(nextRoleValue)
  }

  async function selectUser(id: string) {
    const user = users.find(item => item.id === id)
    if (!user) {
      toast.error('Usuário não encontrado.')
      return
    }

    setSelectedId(id)

    try {
      await hydrateUserFromDetail(id)
      const permissions = await fetchUserPermissionOverrides(id)
      setPermissionOverrides(permissions)
    } catch {
      setPermissionOverrides([])
    }
  }

  async function toggleUser(id: string) {
    if (!isMobile && selectedId === id) {
      setSelectedId(null)
      resetEditorState()
      return
    }

    await selectUser(id)

    if (isMobile) {
      setIsDrawerOpen(true)
    }
  }

  function handleDrawerOpenChange(open: boolean) {
    setIsDrawerOpen(open)
    if (!open) {
      setSelectedId(null)
      resetEditorState()
    }
  }

  const permissionDetailsById = useMemo(() => {
    return permissionModules.reduce((acc, group) => {
      group.permissions.forEach(permission => {
        acc.set(permission.id, {
          name: permission.name,
          module: group.module,
        })
      })
      return acc
    }, new Map<number, { name: string; module: string }>())
  }, [permissionModules])

  const permissionValues = useMemo(() => {
    return Object.entries(permissionSwitchStates)
      .filter(([, state]) => state === 'on')
      .map(([id]) => Number(id))
  }, [permissionSwitchStates])

  const groupSwitchStates = useMemo(
    () => buildGroupStates(permissionSwitchStates),
    [buildGroupStates, permissionSwitchStates],
  )

  const changedPermissionIds = useMemo(() => {
    const changed = new Set<number>()
    permissionModules.forEach(group => {
      group.permissions.forEach(permission => {
        const baselineState = baselinePermissionStates[permission.id] ?? 'inherit'
        const currentState = permissionSwitchStates[permission.id] ?? 'inherit'
        if (baselineState !== currentState) {
          changed.add(permission.id)
        }
      })
    })
    return changed
  }, [baselinePermissionStates, permissionModules, permissionSwitchStates])

  const mappedPermissionGroups = useMemo<ToggleGroup[]>(() => {
    return permissionModules.map(group => ({
      groupName: group.module,
      items: group.permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        isChanged: changedPermissionIds.has(permission.id),
      })),
    }))
  }, [permissionModules, changedPermissionIds])

  const confirmPermissionItems = useMemo<ConfirmChangeItem[]>(() => {
    const items: ConfirmChangeItem[] = []

    permissionModules.forEach(group => {
      group.permissions.forEach(permission => {
        const baselineState = baselinePermissionStates[permission.id] ?? 'inherit'
        const currentState = permissionSwitchStates[permission.id] ?? 'inherit'

        if (baselineState === currentState) return

        const statusLabel =
          currentState === 'on' ? 'Permitir' : currentState === 'off' ? 'Negar' : 'Herdar'

        const statusVariant =
          currentState === 'on' ? 'primary' : currentState === 'off' ? 'destructive' : 'secondary'

        const detail = permissionDetailsById.get(permission.id)
        items.push({
          id: `${statusLabel}-${permission.id}`,
          title: detail?.name ?? `Permissão ${permission.id}`,
          description: detail?.module,
          statusLabel,
          statusVariant,
        })
      })
    })

    return items
  }, [baselinePermissionStates, permissionDetailsById, permissionModules, permissionSwitchStates])

  const hasPermissionChanges = confirmPermissionItems.length > 0

  const applyPermissionStateChange = (permissionId: number, nextState: TripleSwitchState) => {
    setPermissionSwitchStates(prev => ({
      ...prev,
      [permissionId]: nextState,
    }))
  }

  const applyGroupStateChange = (group: ToggleGroup, nextState: TripleSwitchState) => {
    const nextValues = group.items.reduce(
      (acc, item) => {
        acc[Number(item.id)] = nextState
        return acc
      },
      {} as Record<number, TripleSwitchState>,
    )

    setPermissionSwitchStates(prev => ({
      ...prev,
      ...nextValues,
    }))
  }

  const handleDiscardPermissions = () => {
    setPermissionSwitchStates(baselinePermissionStates)
  }

  const handleSavePermissions = async () => {
    if (!selectedId || !hasPermissionChanges) return

    setIsSavingPermissions(true)

    try {
      const payload = permissionModules.flatMap(group => {
        return group.permissions.flatMap(permission => {
          const state = permissionSwitchStates[permission.id] ?? 'inherit'
          if (state === 'inherit') return []
          return [{ permissionId: permission.id, isGranted: state === 'on' }]
        })
      })

      await updateUserPermissionsMutation({ id: selectedId, overrides: payload })
      setBaselinePermissionStates(permissionSwitchStates)

      try {
        const refreshedPermissions = await fetchUserPermissionOverrides(selectedId)
        setPermissionOverrides(refreshedPermissions)
      } catch {
        // Keep the saved state even if the refresh fails.
      }
    } catch {
      toast.error('Erro ao atualizar permissões.')
    } finally {
      setIsSavingPermissions(false)
    }
  }

  const hasRoleChange = roleValue !== baselineRoleValue

  const handleSave = handleSubmit(async data => {
    if (!selectedId) return

    clearErrors()
    setIsSaving(true)

    try {
      const [firstName, ...rest] = data.fullName.trim().split(' ')
      const lastName = rest.join(' ')
      const nextAvatarUrl = isAvatarMarkedForRemoval ? '' : (avatarBackendUrl ?? '')

      await updateUserMutation({
        id: selectedId,
        payload: {
          firstName: firstName || null,
          lastName: lastName || null,
          emailAddress: `${data.emailAddress}@${emailDomain}`.toLowerCase(),
          cpfNumber: data.cpfNumber || null,
          oabNumber: data.oabNumber || null,
          avatarUrl: nextAvatarUrl,
          procuradoriaId: data.procuradoriaId,
        },
        roleValue: hasRoleChange ? roleValue : '',
      })
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
        setIsSaving(false)
        return
      }

      toast.error('Erro ao salvar dados do usuário.')
      setIsSaving(false)
      return
    }

    if (hasRoleChange && !roleValue) {
      try {
        await updateUserRoles(selectedId, [])
      } catch {
        toast.error('Erro ao atualizar cargo do usuário.')
        setIsSaving(false)
        return
      }
    }

    setIsAvatarMarkedForRemoval(false)
    refetchUsers()
    if (isMobile) setIsDrawerOpen(false)

    try {
      await hydrateUserFromDetail(selectedId)
    } catch {
      // keep form values from submit payload
    }

    setIsSaving(false)
  })

  const handleDiscardUserData = async () => {
    if (!selectedId) return
    try {
      await hydrateUserFromDetail(selectedId)
    } catch {
      // keep current form values
    }
  }

  const hasProcuradoriaChange = procuradoriaValue !== baselineProcuradoriaValue
  const hasUserDataChanges =
    isDirty || isAvatarMarkedForRemoval || hasRoleChange || hasProcuradoriaChange

  const headerContent = (
    <PageHeader
      actions={
        <Button onClick={() => setIsCreateOpen(true)} size="sm" variant="primary">
          <Plus className="mr-1.5 size-4" />
          Novo Usuário
        </Button>
      }
      subtitle="Gerencie os usuários do sistema."
      title="Equipe (Usuários)"
    />
  )

  const userListContent = (
    <>
      <div className="shrink-0 border-b p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            onChange={event => setSearch(event.target.value)}
            placeholder="Buscar usuário..."
            value={search}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col divide-y">
          {usersLoading ? (
            <div className="flex justify-center p-8">
              <Spinner size="md" />
            </div>
          ) : filtered.length > 0 ? (
            filtered.map(user => {
              const isSelected = selectedId === user.id
              const avatarSrc = user.avatarUrl ? getMediaUrl(user.avatarUrl) : undefined

              return (
                <button
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                    isSelected ? 'bg-muted text-foreground' : 'text-muted-foreground',
                  )}
                  key={user.id}
                  onClick={() => {
                    toggleUser(user.id)
                  }}
                  type="button"
                >
                  <Avatar size="sm">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium leading-tight">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs opacity-70">{user.email}</span>
                  </div>
                  {isSelected && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              )
            })
          ) : (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">
              Nenhum usuário encontrado.
            </p>
          )}
        </div>
      </div>
    </>
  )

  const renderUserDataActions = (className?: string) => (
    <div className="shrink-0 border-t p-4">
      <ChangesActions
        className={className}
        discardLabel="Descartar Alterações"
        discardLabelMobile="Descartar"
        hasChanges={hasUserDataChanges}
        isDisabled={isDisabled}
        isSaving={isSaving}
        onDiscard={handleDiscardUserData}
        onSave={handleSave}
        saveLabel="Salvar Alterações"
        saveLabelMobile="Salvar"
        savingLabel="Salvando..."
        size="sm"
      />
    </div>
  )

  const userDetailContent = (
    <>
      {activeTab === 'user-data' && (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="size-20 border">
                      <AvatarImage src={avatarPreview ?? undefined} />
                      <AvatarFallback className="text-lg">
                        {getInitials(watchedName || currentUser?.fullName || '')}
                      </AvatarFallback>
                    </Avatar>
                    {(avatarPreview || avatarBackendUrl || currentUser?.avatarUrl) && (
                      <Button
                        className="h-7 text-xs"
                        onClick={() => {
                          setIsAvatarMarkedForRemoval(true)
                          setAvatarBackendUrl(null)
                          setAvatarPreview(null)
                        }}
                        size="sm"
                        type="button"
                        variant="destructive"
                      >
                        Remover foto
                      </Button>
                    )}
                  </div>
                </div>

                <section className="space-y-3">
                  <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[100px_1fr] sm:gap-4">
                    <Label className="mt-2" htmlFor="edit-name">
                      Nome
                    </Label>
                    <div className="min-w-0 space-y-1.5">
                      <Input id="edit-name" {...register('fullName')} placeholder="Nome completo" />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[100px_1fr] sm:gap-4">
                    <Label className="mt-2" htmlFor="edit-email">
                      E-mail
                    </Label>
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 dark:bg-input/30">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground md:text-sm"
                          id="edit-email"
                          placeholder="nome.sobrenome"
                          type="text"
                          {...register('emailAddress')}
                        />
                        <span className="pointer-events-none ml-2 whitespace-nowrap text-base text-muted-foreground md:text-sm">
                          @{emailDomain}
                        </span>
                      </div>
                      {errors.emailAddress && (
                        <p className="text-sm text-destructive">{errors.emailAddress.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[100px_1fr] sm:gap-4">
                    <Label className="mt-2" htmlFor="edit-cpf">
                      CPF
                    </Label>
                    <div className="min-w-0 space-y-1.5">
                      <Input
                        id="edit-cpf"
                        {...register('cpfNumber')}
                        placeholder="000.000.000-00"
                      />
                      {errors.cpfNumber && (
                        <p className="text-sm text-destructive">{errors.cpfNumber.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[100px_1fr] sm:gap-4">
                    <Label className="mt-2" htmlFor="edit-oab">
                      OAB
                    </Label>
                    <div className="min-w-0 space-y-1.5">
                      <Input id="edit-oab" {...register('oabNumber')} placeholder="00000/UF" />
                      {errors.oabNumber && (
                        <p className="text-sm text-destructive">{errors.oabNumber.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[100px_1fr] sm:gap-4">
                    <Label className="mt-2" htmlFor="edit-procuradoria">
                      Procuradoria
                    </Label>
                    <div className="min-w-0 space-y-1.5">
                      <SearchableSelect
                        disabled={isDisabled}
                        id="edit-procuradoria"
                        isLoading={procuradoriasLoading}
                        onChange={value => {
                          setProcuradoriaValue(value)
                          setValue('procuradoriaId', Number(value), { shouldValidate: true })
                        }}
                        options={procuradoriaOptions}
                        placeholder="Selecione uma procuradoria..."
                        value={procuradoriaValue}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <GroupedToggleSection
          confirmDescription="As seguintes permissões serão alteradas:"
          confirmItems={confirmPermissionItems}
          enableItemToggle={false}
          groups={mappedPermissionGroups}
          hasChanges={hasPermissionChanges}
          isDisabled={isDisabled}
          isLoading={isPermissionsLoading}
          isSavingChanges={isSavingPermissions}
          onDiscardChanges={handleDiscardPermissions}
          onSaveChanges={handleSavePermissions}
          onToggleGroup={() => {}}
          onToggleItem={() => {}}
          renderGroupControl={({ group }) => (
            <TripleStateSwitch
              className="shrink-0"
              disabled={isDisabled}
              onValueChange={nextValue => {
                applyGroupStateChange(group, nextValue)
              }}
              showInheritedIndicator={false}
              value={groupSwitchStates[group.groupName] ?? 'inherit'}
            />
          )}
          renderItemControl={({ item }) => (
            <TripleStateSwitch
              className="shrink-0"
              disabled={isDisabled}
              inheritedActive={rolePermissionIds.has(Number(item.id))}
              onValueChange={nextValue => {
                applyPermissionStateChange(Number(item.id), nextValue)
              }}
              value={permissionSwitchStates[Number(item.id)] ?? 'inherit'}
            />
          )}
          selectedIds={permissionValues}
        />
      )}
    </>
  )

  // Sync permission states when selected user or permissions change
  useEffect(() => {
    if (!selectedId) {
      setPermissionSwitchStates({})
      setBaselinePermissionStates({})
      return
    }
    const nextPermissionStates = buildPermissionStates(permissionOverrides)
    setBaselinePermissionStates(nextPermissionStates)
    setPermissionSwitchStates(nextPermissionStates)
  }, [selectedId, permissionOverrides, buildPermissionStates])

  return (
    <>
      {isMobile ? (
        <>
          <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
            {headerContent}
            <div className="flex-1 overflow-hidden">
              <aside className="flex h-full flex-col overflow-hidden">{userListContent}</aside>
            </div>
          </div>

          <Sheet onOpenChange={handleDrawerOpenChange} open={isDrawerOpen}>
            <SheetContent side="bottom" className="flex h-[90vh] flex-col">
              <SheetTitle className="sr-only">
                {currentUser ? `Editando ${currentUser.fullName}` : 'Editar Usuário'}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Edite os dados e permissões do usuário selecionado.
              </SheetDescription>
              <div className="shrink-0 border-b px-4 py-3">
                <div className="flex flex-col gap-3">
                  <Tabs onValueChange={setActiveTab} value={activeTab}>
                    <TabsList className="w-full">
                      <TabsTrigger className="flex-1" value="user-data">
                        Dados do Usuário
                      </TabsTrigger>
                      <TabsTrigger className="flex-1" value="permissions">
                        Permissões
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {activeTab === 'user-data' ? (
                    <Select
                      disabled={isDisabled || rolesLoading}
                      onValueChange={setRoleValue}
                      value={roleValue}
                    >
                      <SelectTrigger className="w-full" id="select-role-mobile">
                        <SelectValue
                          placeholder={rolesLoading ? 'Carregando...' : 'Selecione um cargo'}
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                      {rolesLoading
                        ? 'Carregando...'
                        : roles.find(r => r.id === roleValue)?.name || 'Nenhum cargo selecionado'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-hidden">{userDetailContent}</div>
              {activeTab === 'user-data' && renderUserDataActions()}
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
          {headerContent}

          <div className="flex-1 grid grid-cols-1 divide-y xl:grid-cols-[330px_1fr] xl:divide-x xl:divide-y-0 overflow-hidden">
            <aside className="flex h-full flex-col overflow-hidden">{userListContent}</aside>

            <div className="flex h-full flex-col overflow-hidden">
              {currentUser ? (
                <>
                  <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <Tabs onValueChange={setActiveTab} value={activeTab}>
                      <TabsList>
                        <TabsTrigger value="user-data">Dados do Usuário</TabsTrigger>
                        <TabsTrigger value="permissions">Permissões</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {activeTab === 'user-data' ? (
                      <Select
                        disabled={isDisabled || rolesLoading}
                        onValueChange={setRoleValue}
                        value={roleValue}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]" id="select-role">
                          <SelectValue
                            placeholder={rolesLoading ? 'Carregando...' : 'Selecione um cargo'}
                          />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {roles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex h-9 w-full sm:w-[200px] items-center rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                        {rolesLoading
                          ? 'Carregando...'
                          : roles.find(r => r.id === roleValue)?.name || 'Nenhum cargo selecionado'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">{userDetailContent}</div>

                  {activeTab === 'user-data' && renderUserDataActions()}
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                  <Badge className="text-xs text-white bg-blue-600" variant="secondary">
                    nenhum item selecionado
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Selecione um item na lista para editar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CreateUserModal isOpen={isCreateOpen} onClose={setIsCreateOpen} onSuccess={refetchUsers} />
    </>
  )
}
