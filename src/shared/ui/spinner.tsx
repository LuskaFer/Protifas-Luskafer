import { cn } from '@/shared/lib/utils'

function Spinner({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  }

  return (
    <svg
      aria-label="Carregando"
      className={cn('animate-spin text-current', sizeClasses[size], className)}
      data-slot="spinner"
      fill="none"
      role="img"
      viewBox="0 0 24 24"
    >
      <title>Carregando</title>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>
  )
}

export { Spinner }
