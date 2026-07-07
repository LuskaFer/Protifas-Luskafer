import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/components/page-header'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { getMediaUrl } from '@/shared/services/http'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer'
import { Input } from '@/shared/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'
import { useArchiveProject } from '../hooks/useArchiveProject'
import { useDeleteProject } from '../hooks/useDeleteProject'
import { useGetManagementProjects } from '../hooks/useGetManagementProjects'
import { useGetProjectDetail } from '../hooks/useGetProjectDetail'
import { usePublishProject } from '../hooks/usePublishProject'
import { useUpdateProject } from '../hooks/useUpdateProject'
import {
  type CreateProjectFormSchema,
  createProjectSchema,
  thumbnailFileSchema,
} from '../zod/schemas'
import { CreateProjectModal } from './CreateProjectModal'
import { ProjectActionsColumn } from './ProjectActionsColumn'
import { ProjectEditorColumn } from './ProjectEditorColumn'
import { ProjectListColumn } from './ProjectListColumn'

export function ProjectManagementView() {
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState('DRAFT')
  const [publishedDate, setPublishedDate] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: listData, isLoading: listLoading } = useGetManagementProjects()
  const { data: detail, isLoading: detailLoading } = useGetProjectDetail(selectedId)
  const { mutateAsync: updateProject, isPending: isUpdatingProject } = useUpdateProject()
  const { mutateAsync: publishProject } = usePublishProject()
  const { mutateAsync: archiveProject } = useArchiveProject()
  const { mutateAsync: deleteProject, isPending: isDeletingProject } = useDeleteProject()

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
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
    },
  })

  const watchedTitle = watch('title')

  const filteredItems = useMemo(() => {
    if (!listData?.content) return []
    if (!search.trim()) return listData.content
    const q = search.toLowerCase()
    return listData.content.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.dateMade.toLowerCase().includes(q) ||
        item.company?.toLowerCase().includes(q),
    )
  }, [listData?.content, search])

  useEffect(() => {
    if (detail && selectedId) {
      setValue('title', detail.title ?? '')
      setValue('dateMade', detail.dateMade ?? '')
      setValue('repositoryUrl', detail.repositoryUrl ?? '')
      setValue('liveUrl', detail.liveUrl ?? '')
      setValue('description', detail.description ?? '')
      setValue('company', detail.company ?? '')
      setCurrentStatus(detail.publicationStatus ?? 'DRAFT')
      setPublishedDate(detail.publishedDate ?? null)
      if (!thumbnailFile) {
        setThumbnailPreview(detail.thumbnail ? getMediaUrl(detail.thumbnail) : null)
      }
    }
  }, [detail, selectedId, setValue, thumbnailFile])

  const selectProject = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null)
      setThumbnailPreview(null)
      setThumbnailFile(null)
      reset()
      return
    }
    setSelectedId(id)
    setThumbnailFile(null)
    setPublishedDate(null)
  }

  function toggleProject(id: string) {
    if (!isMobile && selectedId === id) {
      setSelectedId(null)
      setThumbnailPreview(null)
      setThumbnailFile(null)
      reset()
      return
    }

    selectProject(id)

    if (isMobile) {
      setIsDrawerOpen(true)
    }
  }

  function handleDrawerOpenChange(open: boolean) {
    setIsDrawerOpen(open)
    if (!open) {
      setSelectedId(null)
      setThumbnailPreview(null)
      setThumbnailFile(null)
      reset()
    }
  }

  const handleSave = handleSubmit(async data => {
    if (!selectedId) return
    try {
      await updateProject({
        id: selectedId,
        payload: { ...data },
        file: thumbnailFile,
      })
      setThumbnailFile(null)
    } catch {
      // error toast handled in mutation
    }
  })

  const handlePublish = async () => {
    if (!selectedId) return
    setIsUpdatingStatus(true)
    try {
      await publishProject(selectedId)
      setCurrentStatus('PUBLISHED')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleArchive = async () => {
    if (!selectedId) return
    setIsUpdatingStatus(true)
    try {
      await archiveProject(selectedId)
      setCurrentStatus('ARCHIVED')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    try {
      await deleteProject(selectedId)
      setIsDeleteOpen(false)
      setSelectedId(null)
      setThumbnailPreview(null)
      setThumbnailFile(null)
      reset()
    } catch {
      // error toast handled in mutation
    }
  }

  const handleThumbnailSelect = (file: File) => {
    const result = thumbnailFileSchema.safeParse(file)
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Arquivo inválido')
      return
    }
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null)
    if ((detail as any)?.thumbnail) {
      setThumbnailPreview(getMediaUrl((detail as any).thumbnail))
    } else {
      setThumbnailPreview(null)
    }
  }

  const deleteDialogContent = (
    <p className="text-sm text-muted-foreground">
      Tem certeza que deseja remover o projeto{' '}
      <span className="font-semibold text-foreground">{watchedTitle}</span>? Esta ação não pode ser
      desfeita.
    </p>
  )

  const headerContent = (
    <PageHeader
      actions={
        <Button onClick={() => setCreateModalOpen(true)} size="sm" variant="primary">
          <Plus className="mr-1.5 size-4" />
          Novo Projeto
        </Button>
      }
      subtitle="Gerencie os projetos exibidos no portfólio."
      title="Projetos"
    />
  )

  const listContent = (
    <>
      <div className="shrink-0 border-b p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            onChange={event => setSearch(event.target.value)}
            placeholder="Buscar projeto..."
            value={search}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ProjectListColumn
          items={filteredItems}
          selectedId={selectedId}
          isLoading={listLoading}
          onSelect={toggleProject}
        />
      </div>
    </>
  )

  const editorSection = selectedId ? (
    <div className="flex h-full flex-col overflow-hidden">
      <ProjectEditorColumn
        isLoading={detailLoading}
        thumbnailPreview={thumbnailPreview}
        register={register}
        errors={errors}
        onThumbnailSelect={handleThumbnailSelect}
        onRemoveThumbnail={handleRemoveThumbnail}
      />
    </div>
  ) : null

  const actionsSection = selectedId ? (
    <ProjectActionsColumn
      detail={detail}
      isLoading={detailLoading}
      selectedId={selectedId}
      currentStatus={currentStatus}
      publishedDate={publishedDate}
      isSaving={isUpdatingProject}
      isUpdatingStatus={isUpdatingStatus}
      onSave={handleSave}
      onPublish={handlePublish}
      onArchive={handleArchive}
      onDelete={() => setIsDeleteOpen(true)}
    />
  ) : null

  const emptyState = (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <Badge className="text-xs text-white bg-blue-600" variant="secondary">
        nenhum item selecionado
      </Badge>
      <p className="text-sm text-muted-foreground">Selecione um item na lista para editar.</p>
    </div>
  )

  const mobileSheetContent = (
    <Sheet onOpenChange={handleDrawerOpenChange} open={isDrawerOpen}>
      <SheetContent side="bottom" className="flex h-[90vh] flex-col">
        <SheetTitle className="sr-only">
          {detail ? `Editando ${detail.title}` : 'Editar Projeto'}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Edite os dados do projeto selecionado.
        </SheetDescription>
        <div className="flex-1 overflow-y-auto">
          <ProjectEditorColumn
            isLoading={detailLoading}
            thumbnailPreview={thumbnailPreview}
            register={register}
            errors={errors}
            onThumbnailSelect={handleThumbnailSelect}
            onRemoveThumbnail={handleRemoveThumbnail}
          />
        </div>
        <div className="shrink-0 border-t p-4">
          <Button
            className="w-full"
            disabled={isUpdatingProject || !selectedId}
            onClick={handleSave}
            size="sm"
            variant="primary"
          >
            {isUpdatingProject ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {isMobile ? (
        <>
          <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
            {headerContent}
            <div className="flex-1 overflow-hidden">
              <aside className="flex h-full flex-col overflow-hidden">{listContent}</aside>
            </div>
          </div>
          {mobileSheetContent}
        </>
      ) : (
        <div className="bg-background h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col">
          {headerContent}

          <div className="flex-1 grid grid-cols-1 divide-y xl:grid-cols-[330px_1fr_300px] xl:divide-x xl:divide-y-0 overflow-hidden">
            <aside className="flex h-full flex-col overflow-hidden">{listContent}</aside>

            {selectedId ? (
              <>
                {editorSection}
                {actionsSection}
              </>
            ) : (
              <div className="flex h-full flex-col overflow-hidden">{emptyState}</div>
            )}
          </div>
        </div>
      )}

      <CreateProjectModal open={createModalOpen} onClose={setCreateModalOpen} />

      <Dialog
        open={isDeleteOpen && !isMobile}
        onOpenChange={open => {
          if (!isDeletingProject) setIsDeleteOpen(open)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover Projeto</DialogTitle>
          </DialogHeader>
          {deleteDialogContent}
          <DialogFooter className="flex flex-row gap-3">
            <Button onClick={() => setIsDeleteOpen(false)} size="sm" variant="outline">
              Cancelar
            </Button>
            <Button
              disabled={isDeletingProject}
              onClick={handleDelete}
              size="sm"
              variant="destructive"
            >
              {isDeletingProject ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  <span>Removendo...</span>
                </>
              ) : (
                'Remover'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer
        open={isDeleteOpen && isMobile}
        onOpenChange={open => {
          if (!isDeletingProject) setIsDeleteOpen(open)
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Remover Projeto</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-2">{deleteDialogContent}</div>
          <DrawerFooter className="flex-col gap-3 p-4">
            <Button
              className="w-full"
              disabled={isDeletingProject}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeletingProject ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  <span>Removendo...</span>
                </>
              ) : (
                'Remover'
              )}
            </Button>
            <Button className="w-full" onClick={() => setIsDeleteOpen(false)} variant="outline">
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
