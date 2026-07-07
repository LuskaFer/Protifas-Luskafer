import { ptBR } from 'date-fns/locale'
import { FilterX } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import type { AgendaFilters as AgendaFiltersType } from '@/features/agenda/interfaces'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Label } from '@/shared/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

interface AgendaFiltersProps {
  filters: AgendaFiltersType
  updateFilter: (key: keyof AgendaFiltersType, value: string) => void
  clearFilters: () => void
  filterDateRange: DateRange | undefined
  setFilterDateRange: (range: DateRange | undefined) => void
  onApply: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgendaFilters({
  filters,
  updateFilter,
  clearFilters,
  filterDateRange,
  setFilterDateRange,
  onApply,
  open,
  onOpenChange,
}: AgendaFiltersProps) {
  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.origin || filters.status

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button className="h-9 text-sm relative" variant="outline">
          Filtros
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Filtrar eventos</p>
            {hasActiveFilters && (
              <Button className="h-7 text-xs px-2" onClick={clearFilters} size="sm" variant="ghost">
                <FilterX className="size-3 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>

        <div className="p-0">
          <Calendar
            defaultMonth={filterDateRange?.from || new Date()}
            locale={ptBR}
            mode="range"
            numberOfMonths={2}
            onSelect={setFilterDateRange}
            selected={filterDateRange}
          />
        </div>

        <div className="p-4 border-t bg-muted/30 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Origem</Label>
              <Select
                onValueChange={val => updateFilter('origin', val === 'ALL' ? '' : val)}
                value={filters.origin || 'ALL'}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="PERSONAL">Pessoal</SelectItem>
                  <SelectItem value="THIRD_PARTY">Terceiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Status</Label>
              <Select
                onValueChange={val => updateFilter('status', val === 'ALL' ? '' : val)}
                value={filters.status || 'ALL'}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={onApply} size="sm">
            Aplicar Filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
