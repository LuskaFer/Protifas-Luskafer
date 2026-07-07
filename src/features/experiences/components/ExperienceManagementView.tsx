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
import { useArchiveExperience } from '../hooks/useArchiveExperience'
import { useDeleteExperience } from '../hooks/useDeleteExperience'
import { useGetExperienceDetail } from '../hooks/useGetExperienceDetail'
import { useGetManagementExperiences } from '../hooks/useGetManagementExperiences'
import { usePublishExperience } from '../hooks/usePublishExperience'
import { useToggleFeaturedExperience } from '../hooks/useToggleFeaturedExperience'
import { useUpdateExperience } from '../hooks/useUpdateExperience'
import {
  type CreateExperienceFormSchema,
  createExperienceSchema,
  thumbnailFileSchema,
} from '../zod/schemas'
import { CreateExperienceModal } from './CreateExperienceModal'
import { ExperienceActionsColumn } from './ExperienceActionsColumn'
import { ExperienceEditorColumn } from './ExperienceEditorColumn'
import { ExperienceListColumn } from './ExperienceListColumn'

export function ExperienceManagementView() {
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState('DRAFT')
  const [isFeatured, setIsFeatured] = useState(false)
  const [publishedDate, setPublishedDate] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data: listData, isLoading: listLoading } = useGetManagementExperiences()
  const { data: detail, isLoading: detailLoading } = useGetExperienceDetail(selectedId)
  const { mutateAsync: updateExperience, isPending: isUpdatingExperience } = useUpdateExperience()
  const { mutateAsync: publishExperience } = usePublishExperience()
  const { mutateAsync: archiveExperience } = useArchiveExperience()
  const { mutateAsync: deleteExperience, isPending: isDeletingExperience } = useDeleteExperience()
  const { mutateAsync: toggleFeaturedExperience } = useToggleFeaturedExperience()

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateExperienceFormSchema>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: { title: '', company: '', period: '', description: '' },
  })

  const watchedTitle = watch('title')

  const filteredItems = useMemo(() => {
    if (!listData?.content) return []
    if (!search.trim()) return listData.content
    const q = search.toLowerCase()
    return listData.content.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.period.toLowerCase().includes(q),
    )
  }, [listData?.content, search])

  useEffect(() => {
    if (detail && selectedId) {
      setValue('title', detail.title ?? '')
      setValue('company', detail.company ?? '')
      setValue('period', detail.period ?? '')
      setValue('description', detail.description ?? '')
      setCurrentStatus(detail.publicationStatus ?? 'DRAFT')
      setIsFeatured((detail as any).isFeatured ?? false)
      setPublishedDate(detail.publishedDate ?? null)
      if (!thumbnailFile) {
        setThumbnailPreview(detail.thumbnail ? getMediaUrl(detail.thumbnail) : null)
      }
    }
  }, [detail, selectedId, setValue, thumbnailFile])

  const selectExperience = (id: string) => {
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

  function toggleExperience(id: string) {
    if (!isMobile && selectedId === id) {
      setSelectedId(null)
      setThumbnailPreview(null)
      setThumbnailFile(null)
      reset()
      return
    }

    selectExperience(id)

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
      await updateExperience({
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
      await publishExperience(selectedId)
      setCurrentStatus('PUBLISHED')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleArchive = async () => {
    if (!selectedId) return
    setIsUpdatingStatus(true)
    try {
      await archiveExperience(selectedId)
      setCurrentStatus('ARCHIVED')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleToggleFeatured = async () => {
    if (!selectedId) return
    const next = !isFeatured
    setIsUpdatingStatus(true)
    try {
      await toggleFeaturedExperience(selectedId)
      setIsFeatured(next)
      toast.success(next ? 'Experiência destacada com sucesso!' : 'Destaque removido com sucesso!')
    } catch {
      toast.error('Erro ao alterar destaque da experiência.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    try {
      await deleteExperience(selectedId)
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
      Tem certeza que deseja remover a experiência{' '}
      <span className="font-semibold text-foreground">{watchedTitle}</span>? Esta ação não pode ser
      desfeita.
    </p>
  )

  const headerContent = (
    <PageHeader
      actions={
        <Button onClick={() => setCreateModalOpen(true)} size="sm" variant="primary">
          <Plus className="mr-1.5 size-4" />
          Nova Experiência
        </Button>
      }
      subtitle="Gerencie as experiências exibidas no portfólio."
      title="Experiências"
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
            placeholder="Buscar experiência..."
            value={search}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ExperienceListColumn
          items={filteredItems}
          selectedId={selectedId}
          isLoading={listLoading}
          onSelect={toggleExperience}
        />
      </div>
    </>
  )

  const editorSection = selectedId ? (
    <div className="flex h-full flex-col overflow-hidden">
      <ExperienceEditorColumn
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
    <ExperienceActionsColumn
      detail={detail}
      isLoading={detailLoading}
      selectedId={selectedId}
      currentStatus={currentStatus}
      isFeatured={isFeatured}
      publishedDate={publishedDate}
      isSaving={isUpdatingExperience}
      isUpdatingStatus={isUpdatingStatus}
      onSave={handleSave}
      onPublish={handlePublish}
      onArchive={handleArchive}
      onToggleFeatured={handleToggleFeatured}
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
          {detail ? `Editando ${detail.title}` : 'Editar Experiência'}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Edite os dados da experiência selecionada.
        </SheetDescription>
        <div className="flex-1 overflow-y-auto">
          <ExperienceEditorColumn
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
            disabled={isUpdatingExperience || !selectedId}
            onClick={handleSave}
            size="sm"
            variant="primary"
          >
            {isUpdatingExperience ? (
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

      <CreateExperienceModal open={createModalOpen} onClose={setCreateModalOpen} />

      <Dialog
        open={isDeleteOpen && !isMobile}
        onOpenChange={open => {
          if (!isDeletingExperience) setIsDeleteOpen(open)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover Experiência</DialogTitle>
          </DialogHeader>
          {deleteDialogContent}
          <DialogFooter className="flex flex-row gap-3">
            <Button onClick={() => setIsDeleteOpen(false)} size="sm" variant="outline">
              Cancelar
            </Button>
            <Button
              disabled={isDeletingExperience}
              onClick={handleDelete}
              size="sm"
              variant="destructive"
            >
              {isDeletingExperience ? (
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
          if (!isDeletingExperience) setIsDeleteOpen(open)
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Remover Experiência</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-2">{deleteDialogContent}</div>
          <DrawerFooter className="flex-col gap-3 p-4">
            <Button
              className="w-full"
              disabled={isDeletingExperience}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeletingExperience ? (
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
