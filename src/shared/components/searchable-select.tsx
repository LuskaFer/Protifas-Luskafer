import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/input'
import { Spinner } from '@/shared/ui/spinner'

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  className?: string
  id?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  isLoading = false,
  className,
  id,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  const filtered = search
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (optValue: string) => {
    onChange(optValue)
    setIsOpen(false)
    setSearch('')
  }

  const handleTriggerClick = () => {
    if (disabled) return
    setIsOpen(prev => !prev)
    if (!isOpen) setSearch('')
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTriggerClick()
    }
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
      setSearch('')
    }
  }

  return (
    <div className={cn('relative', className)} id={id} ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          disabled && 'cursor-not-allowed opacity-50',
          !selectedOption && 'text-muted-foreground',
        )}
        disabled={disabled}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        type="button"
      >
        <span className="truncate">
          {isLoading ? 'Carregando...' : selectedOption?.label || placeholder}
        </span>
        <Search className="ml-2 size-4 shrink-0 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            <Input
              className="h-7 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              ref={inputRef}
              value={search}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Spinner size="sm" />
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                Nenhum resultado encontrado.
              </p>
            )}
            {!isLoading &&
              filtered.map(option => (
                <button
                  aria-selected={option.value === value}
                  className={cn(
                    'flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    option.value === value && 'bg-accent text-accent-foreground font-medium',
                  )}
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSelect(option.value)
                    }
                  }}
                  role="option"
                  type="button"
                >
                  {option.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
