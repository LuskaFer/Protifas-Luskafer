import type * as React from 'react'
import { cn } from '@/shared/lib/utils'

function Checkbox({
  className,
  checked,
  onCheckedChange,
  disabled,
  id,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <input
      checked={checked}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-primary',
        className,
      )}
      data-slot="checkbox"
      disabled={disabled}
      id={id}
      onChange={e => onCheckedChange?.(e.target.checked)}
      type="checkbox"
      {...props}
    />
  )
}

export { Checkbox }
