import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

export type TripleSwitchState = 'off' | 'inherit' | 'on'

interface TripleStateSwitchProps extends HTMLAttributes<HTMLDivElement> {
  value: TripleSwitchState
  onValueChange?: (value: TripleSwitchState) => void
  disabled?: boolean
  inheritedActive?: boolean
  showInheritedIndicator?: boolean
}

const STATE_LABELS: Record<TripleSwitchState, string> = {
  off: 'Desligado',
  inherit: 'Herdado',
  on: 'Ligado',
}

export function TripleStateSwitch({
  value,
  onValueChange,
  disabled = false,
  inheritedActive = false,
  showInheritedIndicator = true,
  className,
  ...props
}: TripleStateSwitchProps) {
  const handleChange = (nextValue: TripleSwitchState) => {
    if (disabled) return
    onValueChange?.(nextValue)
  }

  return (
    <div
      aria-disabled={disabled}
      className={cn(
        'relative inline-flex h-5 w-14 items-center rounded-full p-0.5',
        value === 'on' && 'bg-emerald-400',
        value === 'off' && 'bg-rose-400',
        value === 'inherit' && 'bg-input',
        'transition-colors duration-300 ease-in-out',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      role="group"
      {...props}
    >
      {/* A Bolinha Deslizante (Thumb) */}
      <div
        className={cn(
          'absolute left-0.5 top-0.5 z-10 h-4 w-[calc((100%-4px)/3)] rounded-full bg-background shadow-xs',
          'transition-transform duration-300 ease-in-out',
          value === 'off' && 'translate-x-0',
          value === 'inherit' && 'translate-x-full',
          value === 'on' && 'translate-x-[200%]',
        )}
      />

      {/* Wrapper dos botões clicáveis */}
      <div className="relative z-20 grid h-full w-full grid-cols-3">
        {(Object.keys(STATE_LABELS) as TripleSwitchState[]).map(state => (
          <button
            aria-label={STATE_LABELS[state]}
            aria-pressed={value === state}
            className={cn(
              'relative flex h-full items-center justify-center rounded-full text-[10px]',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
            disabled={disabled}
            key={state}
            onClick={event => {
              event.stopPropagation()
              handleChange(state)
            }}
            type="button"
          >
            {state === 'inherit' && (
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span
                  className={cn(
                    'size-3 rounded-full bg-black/15 transition-opacity duration-300 ease-in-out',
                    value === 'inherit' ? 'opacity-0' : 'opacity-100',
                  )}
                />
              </span>
            )}

            {state === 'inherit' && showInheritedIndicator && (
              <span
                className={cn(
                  'relative z-30 size-2 rounded-full transition-colors duration-300',
                  inheritedActive ? 'bg-primary' : 'bg-muted-foreground/40',
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
