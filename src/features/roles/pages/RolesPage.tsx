import { Check, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { deleteRole, updateRoleName, updateRolePermissions } from '@/features/roles/api/rolesApi'
import { CreateRoleModal } from '@/features/roles/components/CreateRoleModal'
import { usePermissions } from '@/features/roles/hooks/usePermissions'
import { useRolesWithPermissions } from '@/features/roles/hooks/useRolesWithPermissions'
import type { ConfirmChangeItem } from '@/shared/components/confirm-changes-modal'
import { GroupedToggleSection, type ToggleGroup } from '@/shared/components/grouped-toggle-section'
import { PageHeader } from '@/shared/components/page-header'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'

export function RolesPage() {
  const { roles, isLoading: rolesLoading, refetch: refetchRoles } = useRolesWithPermissions()
  const { data: permissionGroups = [], isLoading: isPermissionsLoading } = usePermissions()
  const isMobile = useIsMobile()

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [roleSearch, setRoleSearch] = useState('')

  const [editingName, setEditingName] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [baselinePermissionIds, setBaselinePermissionIds] = useState<number[]>([])
  const [isSavingPermissions, setIsSavingPermissions] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const selectedRole = roles.find(r => r.id === selectedRoleId)
  const isDisabled = selectedRoleId === null

  // Sincroniza os estados de edição quando o cargo selecionado muda
  const [syncKey, setSyncKey] = useState(0)

  useMemo(() => {
    if (selectedRole) {
      setEditingName(selectedRole.name)
      setSelectedPermissionIds(selectedRole.permissionIds ?? [])
      setBaselinePermissionIds(selectedRole.permissionIds ?? [])
      setSyncKey(prev => prev + 1)
    } else {
      setEditingName('')
      setSelectedPermissionIds([])
      setBaselinePermissionIds([])
    }
  }, [selectedRole])

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(roleSearch.toLowerCase()))

  const handleSaveName = async () => {
    if (!selectedRoleId || !editingName.trim()) return
    if (editingName.trim() === selectedRole?.name) return
    setIsSavingName(true)
    try {
      await updateRoleName(selectedRoleId, { name: editingName.trim() })
      toast.success('Nome do cargo atualizado com sucesso!')
      refetchRoles()
    } catch {
      toast.error('Erro ao atualizar o nome do cargo.')
    } finally {
      setIsSavingName(false)
    }
  }

  const permissionDetailsById = useMemo(() => {
    return permissionGroups.reduce((acc, group) => {
      group.permissions.forEach(permission => {
        acc.set(permission.id, {
          name: permission.name,
          module: group.module,
        })
      })
      return acc
    }, new Map<number, { name: string; module: string }>())
  }, [permissionGroups])

  const addedPermissionIds = useMemo(() => {
    const baselineSet = new Set(baselinePermissionIds)
    return selectedPermissionIds.filter(id => !baselineSet.has(id))
  }, [baselinePermissionIds, selectedPermissionIds])

  const removedPermissionIds = useMemo(() => {
    const selectedSet = new Set(selectedPermissionIds)
    return baselinePermissionIds.filter(id => !selectedSet.has(id))
  }, [baselinePermissionIds, selectedPermissionIds])

  const changedPermissionIds = useMemo(() => {
    return new Set([...addedPermissionIds, ...removedPermissionIds])
  }, [addedPermissionIds, removedPermissionIds])

  const mappedGroups = useMemo<ToggleGroup[]>(() => {
    return permissionGroups.map(group => ({
      groupName: group.module,
      items: group.permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        isChanged: changedPermissionIds.has(permission.id),
      })),
    }))
  }, [permissionGroups, changedPermissionIds])

  const confirmPermissionItems = useMemo<ConfirmChangeItem[]>(() => {
    const createItem = (
      id: number,
      statusLabel: string,
      statusVariant: ConfirmChangeItem['statusVariant'],
    ) => {
      const detail = permissionDetailsById.get(id)
      return {
        id: `${statusLabel}-${id}`,
        title: detail?.name ?? `Permissão ${id}`,
        description: detail?.module,
        statusLabel,
        statusVariant,
      }
    }

    return [
      ...addedPermissionIds.map(id => createItem(id, 'Adicionar', 'primary')),
      ...removedPermissionIds.map(id => createItem(id, 'Remover', 'destructive')),
    ]
  }, [addedPermissionIds, removedPermissionIds, permissionDetailsById])

  const hasPermissionChanges = confirmPermissionItems.length > 0

  function togglePermission(id: string | number) {
    const numId = Number(id)
    setSelectedPermissionIds(prev =>
      prev.includes(numId) ? prev.filter(v => v !== numId) : [...prev, numId],
    )
  }

  function handleModuleToggle(modulePermissionIds: (string | number)[], enable: boolean) {
    const numIds = modulePermissionIds.map(Number)
    const next = enable
      ? [...new Set([...selectedPermissionIds, ...numIds])]
      : selectedPermissionIds.filter(id => !numIds.includes(id))
    setSelectedPermissionIds(next)
  }

  const handleSavePermissions = async () => {
    if (!selectedRoleId || !hasPermissionChanges) return
    setIsSavingPermissions(true)
    try {
      await updateRolePermissions(selectedRoleId, {
        permissionIds: selectedPermissionIds,
      })
      toast.success('Permissões atualizadas com sucesso!')
      setBaselinePermissionIds(selectedPermissionIds)
      refetchRoles()
    } catch {
      toast.error('Erro ao salvar as permissões.')
    } finally {
      setIsSavingPermissions(false)
    }
  }

  const handleDiscardPermissions = () => {
    setSelectedPermissionIds(baselinePermissionIds)
  }

  const handleDelete = async () => {
    if (!selectedRoleId) return
    setIsDeleting(true)
    try {
      await deleteRole(selectedRoleId)
      toast.success('Cargo excluído com sucesso!')
      setIsDeleteOpen(false)
      setSelectedRoleId(null)
      refetchRoles()
    } catch {
      toast.error('Erro ao excluir o cargo. Verifique se existem usuários atrelados a ele.')
    } finally {
      setIsDeleting(false)
    }
  }

  function handleRoleClick(roleId: string) {
    if (isMobile) {
      setSelectedRoleId(roleId)
      setIsDrawerOpen(true)
    } else {
      setSelectedRoleId(selectedRoleId === roleId ? null : roleId)
    }
  }

  function handleDrawerOpenChange(open: boolean) {
    setIsDrawerOpen(open)
    if (!open) {
      setSelectedRoleId(null)
    }
  }

  const deleteDialogContent = (
    <span>
      Tem certeza que deseja excluir o cargo{' '}
      <span className="font-semibold text-foreground">{selectedRole?.name}</span>? Essa ação não
      pode ser desfeita.
    </span>
  )

  const permissionsContent = (
    <GroupedToggleSection
      confirmDescription="As seguintes permissões serão alteradas:"
      confirmItems={confirmPermissionItems}
      groups={mappedGroups}
      hasChanges={hasPermissionChanges}
      isDisabled={isDisabled}
      isLoading={isPermissionsLoading}
      isSavingChanges={isSavingPermissions}
      onDiscardChanges={handleDiscardPermissions}
      onSaveChanges={handleSavePermissions}
      onToggleGroup={handleModuleToggle}
      onToggleItem={togglePermission}
      selectedIds={selectedPermissionIds}
    />
  )

  const nameEditSection = (
    <div className="flex items-end gap-3">
      <div className="flex-1 space-y-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="role-name">
          Nome do Cargo
        </label>
        <Input
          className="h-9"
          id="role-name"
          onChange={e => setEditingName(e.target.value)}
          value={editingName}
        />
      </div>
      <Button
        disabled={isSavingName || !editingName.trim() || editingName.trim() === selectedRole?.name}
        onClick={handleSaveName}
        size="sm"
        variant="primary"
      >
        {isSavingName ? <Spinner size="sm" /> : 'Salvar Nome'}
      </Button>
      <Button onClick={() => setIsDeleteOpen(true)} size="sm" variant="destructive">
        <Trash2 className="size-4" />
        Excluir Cargo
      </Button>
    </div>
  )

  const headerContent = (
    <PageHeader
      actions={
        <Button onClick={() => setIsCreateOpen(true)} size="sm" variant="primary">
          <Plus className="mr-1.5 size-4" />
          Novo Cargo
        </Button>
      }
      subtitle="Gerencie os cargos e suas permissões de acesso."
      title="Cargos e Permissões"
    />
  )

  const roleListContent = (
    <>
      <div className="shrink-0 border-b p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            onChange={e => setRoleSearch(e.target.value)}
            placeholder="Buscar cargo..."
            value={roleSearch}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col divide-y overflow-y-auto">
        {rolesLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="md" />
          </div>
        ) : filteredRoles.length > 0 ? (
          filteredRoles.map(role => {
            const isSelected = selectedRoleId === role.id
            const permissionCount = role.permissionIds?.length ?? 0
            return (
              <button
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                  isSelected ? 'bg-muted text-foreground' : 'text-muted-foreground',
                )}
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                type="button"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{role.name}</span>
                  <span className="text-xs opacity-60">
                    {permissionCount} {permissionCount === 1 ? 'permissão' : 'permissões'}
                  </span>
                </div>
                {isSelected && <Check className="size-4 shrink-0 text-primary" />}
              </button>
            )
          })
        ) : (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            Nenhum cargo encontrado.
          </p>
        )}
      </div>
    </>
  )

  return (
    <>
      {isMobile ? (
        <>
          <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
            {headerContent}
            <div className="flex-1 overflow-hidden">
              <aside className="flex h-full flex-col overflow-hidden">{roleListContent}</aside>
            </div>
          </div>

          <Sheet onOpenChange={handleDrawerOpenChange} open={isDrawerOpen}>
            <SheetContent side="bottom" className="flex h-[90vh] flex-col">
              <SheetTitle className="sr-only">
                {selectedRole ? `Editando ${selectedRole.name}` : 'Editar Cargo'}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Edite o nome e as permissões do cargo selecionado.
              </SheetDescription>
              {selectedRole && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="shrink-0 border-b p-4">{nameEditSection}</div>
                  <div className="flex-1 overflow-hidden" key={syncKey}>
                    {permissionsContent}
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
          {headerContent}

          <div className="flex-1 grid grid-cols-1 divide-y xl:grid-cols-[330px_1fr] xl:divide-x xl:divide-y-0 overflow-hidden">
            <div className="flex h-full flex-col overflow-hidden">{roleListContent}</div>

            <div className="flex h-full flex-col overflow-hidden" key={syncKey}>
              {selectedRole ? (
                <>
                  <div className="shrink-0 border-b p-4">{nameEditSection}</div>
                  <div className="flex-1 overflow-hidden">{permissionsContent}</div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-muted/10 p-8 text-center">
                  <Badge className="text-xs" variant="secondary">
                    nenhum cargo selecionado
                  </Badge>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Selecione um cargo na lista à esquerda para gerenciar suas permissões de acesso
                    ao sistema.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CreateRoleModal isOpen={isCreateOpen} onClose={setIsCreateOpen} onSuccess={refetchRoles} />

      <Dialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen && !isMobile}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir Cargo</DialogTitle>
            <DialogDescription>{deleteDialogContent}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 justify-end pt-4">
            <Button onClick={() => setIsDeleteOpen(false)} size="sm" variant="outline">
              Cancelar
            </Button>
            <Button disabled={isDeleting} onClick={handleDelete} size="sm" variant="destructive">
              {isDeleting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet onOpenChange={setIsDeleteOpen} open={isDeleteOpen && isMobile}>
        <SheetContent side="bottom" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Excluir Cargo</SheetTitle>
            <SheetDescription>{deleteDialogContent}</SheetDescription>
          </SheetHeader>
          <SheetFooter className="pt-2">
            <Button disabled={isDeleting} onClick={handleDelete} size="sm" variant="destructive">
              {isDeleting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
            <SheetClose asChild>
              <Button onClick={() => setIsDeleteOpen(false)} size="sm" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
