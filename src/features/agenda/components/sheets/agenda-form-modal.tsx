import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, ArrowDown, CalendarIcon, Clock, ExternalLink, Minus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { type AgendaEventFormSchema, agendaEventSchema } from '@/features/agenda/zod/schemas'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Spinner } from '@/shared/ui/spinner'

function splitDateTime(dateTimeStr: string) {
  if (!dateTimeStr) return { date: '', time: '' }
  try {
    const d = new Date(dateTimeStr)
    return {
      date: format(d, 'yyyy-MM-dd'),
      time: format(d, 'HH:mm'),
    }
  } catch {
    return { date: '', time: '' }
  }
}

function combineDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return ''
  const time = timeStr || '09:00'
  return `${dateStr}T${time}:00`
}

interface AgendaFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  defaultDate?: Date
  defaultValues?: Partial<AgendaEventFormSchema>
  onSubmit: (data: AgendaEventFormSchema) => Promise<void>
}

export function AgendaFormModal({
  isOpen,
  onOpenChange,
  mode,
  defaultDate,
  defaultValues,
  onSubmit,
}: AgendaFormModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [eventDateOpen, setEventDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const form = useForm<AgendaEventFormSchema>({
    resolver: zodResolver(agendaEventSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: defaultDate ? format(defaultDate, "yyyy-MM-dd'T'09:00:00") : '',
      endDate: '',
      origin: 'PERSONAL',
      thirdPartySystem: '',
      thirdPartyId: '',
      thirdPartyUrl: '',
      priority: 'MEDIUM',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        form.reset({
          title: '',
          description: '',
          startDate: defaultDate ? format(defaultDate, "yyyy-MM-dd'T'09:00:00") : '',
          endDate: '',
          origin: 'PERSONAL',
          thirdPartySystem: '',
          thirdPartyId: '',
          thirdPartyUrl: '',
          priority: 'MEDIUM',
        })
      } else if (mode === 'edit' && defaultValues) {
        form.reset(defaultValues as AgendaEventFormSchema)
      }
    }
  }, [isOpen, mode, defaultDate, defaultValues, form])

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form
  const watchedOrigin = watch('origin')
  const watchedStartDate = watch('startDate')
  const watchedEndDate = watch('endDate')

  const startDateTime = splitDateTime(watchedStartDate)
  const endDateTime = splitDateTime(watchedEndDate || '')

  function handleClose(open: boolean) {
    if (!open && !isSaving) {
      form.reset()
    }
    onOpenChange(open)
  }

  async function handleSubmit(data: AgendaEventFormSchema) {
    setIsSaving(true)
    try {
      await onSubmit(data)
      handleClose(false)
    } finally {
      setIsSaving(false)
    }
  }

  const submitButtonText = isSaving ? (
    <>
      <Spinner className="mr-2" size="sm" /> <span className="truncate">Salvando...</span>
    </>
  ) : (
    'Salvar'
  )

  const formContent = (
    <form className="space-y-4" id="agenda-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground" htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            className="h-11"
            id="title"
            placeholder="Ex: Reunião de alinhamento"
            {...register('title')}
          />
          {errors.title && (
            <p className="text-destructive text-xs flex items-center gap-1 mt-1">
              <AlertTriangle className="size-3" /> {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground" htmlFor="description">
            Descrição
          </Label>
          <textarea
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
            id="description"
            placeholder="Detalhes do evento (opcional)"
            rows={3}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-destructive text-xs flex items-center gap-1 mt-1">
              <AlertTriangle className="size-3" /> {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Data e Hora <span className="text-destructive">*</span>
            </Label>
            <Popover onOpenChange={setEventDateOpen} open={eventDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    'w-full justify-start text-left font-normal h-11',
                    !startDateTime.date && 'text-muted-foreground',
                  )}
                  variant="outline"
                >
                  <CalendarIcon className="size-4 mr-2" />
                  {startDateTime.date
                    ? format(new Date(`${startDateTime.date}T00:00:00`), 'dd/MM/yyyy')
                    : 'Selecionar data'}
                  {startDateTime.time && (
                    <span className="ml-auto flex items-center text-muted-foreground">
                      <Clock className="size-3.5 mr-1" />
                      {startDateTime.time}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <div className="p-3 pb-0">
                  <Calendar
                    initialFocus
                    locale={ptBR}
                    mode="single"
                    onSelect={date => {
                      if (date) {
                        setValue(
                          'startDate',
                          combineDateTime(
                            format(date, 'yyyy-MM-dd'),
                            startDateTime.time || '09:00',
                          ),
                          { shouldValidate: true },
                        )
                      }
                    }}
                    selected={
                      startDateTime.date ? new Date(`${startDateTime.date}T00:00:00`) : undefined
                    }
                  />
                </div>
                <div className="border-t p-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <Input
                      className="flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      onChange={e => {
                        setValue(
                          'startDate',
                          combineDateTime(
                            startDateTime.date || format(new Date(), 'yyyy-MM-dd'),
                            e.target.value,
                          ),
                          { shouldValidate: true },
                        )
                      }}
                      type="time"
                      value={startDateTime.time || '09:00'}
                    />
                    <Button onClick={() => setEventDateOpen(false)} size="sm">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <input type="hidden" {...register('startDate')} />
            {errors.startDate && (
              <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                <AlertTriangle className="size-3" /> {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Término (opcional)</Label>
            <Popover onOpenChange={setEndDateOpen} open={endDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    'w-full justify-start text-left font-normal h-11',
                    !endDateTime.date && 'text-muted-foreground',
                  )}
                  variant="outline"
                >
                  <CalendarIcon className="size-4 mr-2" />
                  {endDateTime.date
                    ? format(new Date(`${endDateTime.date}T00:00:00`), 'dd/MM/yyyy')
                    : 'Selecionar data'}
                  {endDateTime.time && (
                    <span className="ml-auto flex items-center text-muted-foreground">
                      <Clock className="size-3.5 mr-1" />
                      {endDateTime.time}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <div className="p-3 pb-0">
                  <Calendar
                    initialFocus
                    locale={ptBR}
                    mode="single"
                    onSelect={date => {
                      if (date) {
                        setValue(
                          'endDate',
                          combineDateTime(format(date, 'yyyy-MM-dd'), endDateTime.time || '10:00'),
                          { shouldValidate: true },
                        )
                      }
                    }}
                    selected={
                      endDateTime.date ? new Date(`${endDateTime.date}T00:00:00`) : undefined
                    }
                  />
                </div>
                <div className="border-t p-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <Input
                      className="flex-1 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      onChange={e => {
                        setValue(
                          'endDate',
                          combineDateTime(
                            endDateTime.date || format(new Date(), 'yyyy-MM-dd'),
                            e.target.value,
                          ),
                          { shouldValidate: true },
                        )
                      }}
                      type="time"
                      value={endDateTime.time || '10:00'}
                    />
                    <Button
                      onClick={() => {
                        setValue('endDate', '', { shouldValidate: true })
                        setEndDateOpen(false)
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Limpar
                    </Button>
                    <Button onClick={() => setEndDateOpen(false)} size="sm">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <input type="hidden" {...register('endDate')} />
            {errors.endDate && (
              <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                <AlertTriangle className="size-3" /> {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground" htmlFor="origin">
              Origem <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={val => {
                setValue('origin', val as 'PERSONAL' | 'THIRD_PARTY', { shouldValidate: true })
                if (val === 'PERSONAL') {
                  setValue('thirdPartySystem', '', { shouldValidate: true })
                  setValue('thirdPartyId', '', { shouldValidate: true })
                  setValue('thirdPartyUrl', '', { shouldValidate: true })
                }
              }}
              value={form.watch('origin')}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Selecionar origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERSONAL">Pessoal</SelectItem>
                <SelectItem value="THIRD_PARTY">Terceiro</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register('origin')} />
            {errors.origin && (
              <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                <AlertTriangle className="size-3" /> {errors.origin.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground" htmlFor="priority">
              Prioridade <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={val =>
                setValue('priority', val as 'LOW' | 'MEDIUM' | 'HIGH', { shouldValidate: true })
              }
              value={form.watch('priority')}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Selecionar prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="size-4 text-blue-600" />
                    <span>Baixa</span>
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <div className="flex items-center gap-2">
                    <Minus className="size-4 text-amber-600" />
                    <span>Média</span>
                  </div>
                </SelectItem>
                <SelectItem value="HIGH">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-red-600" />
                    <span>Alta</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register('priority')} />
            {errors.priority && (
              <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                <AlertTriangle className="size-3" /> {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        {watchedOrigin === 'THIRD_PARTY' && (
          <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                <ExternalLink className="size-4 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-foreground">Dados do sistema de origem</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" htmlFor="thirdPartySystem">
                Sistema de origem <span className="text-destructive">*</span>
              </Label>
              <Input
                id="thirdPartySystem"
                placeholder="Ex: Sistema de Processos"
                {...register('thirdPartySystem')}
              />
              {errors.thirdPartySystem && (
                <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                  <AlertTriangle className="size-3" /> {errors.thirdPartySystem.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium" htmlFor="thirdPartyId">
                  ID de origem <span className="text-destructive">*</span>
                </Label>
                <Input id="thirdPartyId" placeholder="Ex: 12345" {...register('thirdPartyId')} />
                {errors.thirdPartyId && (
                  <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                    <AlertTriangle className="size-3" /> {errors.thirdPartyId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium" htmlFor="thirdPartyUrl">
                  URL de origem
                </Label>
                <Input
                  id="thirdPartyUrl"
                  placeholder="https://..."
                  {...register('thirdPartyUrl')}
                />
                {errors.thirdPartyUrl && (
                  <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                    <AlertTriangle className="size-3" /> {errors.thirdPartyUrl.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )

  return (
    <Sheet onOpenChange={handleClose} open={isOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6" side="right">
        <SheetHeader className="mb-6 pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold tracking-tight">
            {mode === 'create' ? 'Novo Registro na Agenda' : 'Editar Registro'}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {mode === 'create'
              ? 'Preencha os dados do compromisso.'
              : 'Atualize as informações do evento.'}
          </p>
        </SheetHeader>
        <div className="flex-1 py-2">{formContent}</div>
        <SheetFooter className="flex-col gap-2 sm:flex-row sm:justify-end pt-6 border-t border-border mt-6">
          <SheetClose asChild>
            <Button className="w-full sm:w-auto" variant="outline">
              Cancelar
            </Button>
          </SheetClose>
          <Button
            className="w-full sm:w-auto min-w-[100px]"
            disabled={isSaving}
            form="agenda-form"
            type="submit"
            variant="primary"
          >
            {submitButtonText}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
