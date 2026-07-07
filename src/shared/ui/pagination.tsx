import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
  onPageChange: (page: number) => void
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  maxVisiblePages = 3,
  onPageChange,
}: PaginationProps) {
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(0, currentPage - half)
    const end = Math.min(totalPages - 1, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(0, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center gap-1">
      <Button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {getVisiblePages().map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          size="sm"
          variant={page === currentPage ? 'default' : 'ghost'}
        >
          {page + 1}
        </Button>
      ))}

      <Button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        size="icon"
        variant="ghost"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
