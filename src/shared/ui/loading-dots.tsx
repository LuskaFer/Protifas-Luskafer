import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

const loadingDotsVariants = cva('rounded-full animate-fade-shrink', {
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      default: 'bg-foreground',
      muted: 'bg-muted-foreground',
    },
    size: {
      sm: 'w-1 h-1',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface LoadingDotsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingDotsVariants> {}

export function LoadingDots({ className, variant, size, ...props }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center space-x-1.5', className)} {...props}>
      <div
        className={cn(loadingDotsVariants({ variant, size }))}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn(loadingDotsVariants({ variant, size }))}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn(loadingDotsVariants({ variant, size }))}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}
