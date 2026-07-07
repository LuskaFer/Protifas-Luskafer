import type * as React from 'react'
import { cn } from '@/shared/lib/utils'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: shadcn label receives htmlFor via props
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      data-slot="label"
      {...props}
    />
  )
}

export { Label }
